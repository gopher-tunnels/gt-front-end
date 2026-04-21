import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useLayoutEffect,
  useContext,
} from "react";
import { StyleSheet } from "react-native";
import * as Location from "expo-location";
import CustomMarker from "../../components/CustomMarker";
import * as SplashScreen from "expo-splash-screen";

import Mapbox, {
  UserTrackingMode,
  type Location as MapboxLocation,
} from "@rnmapbox/maps";
import { MAPBOX_ACCESS_TOKEN } from "../../mapboxConfig";
import { toast } from "sonner-native";
import NetInfo, { type NetInfoState } from "@react-native-community/netinfo";

import { Container, Content } from "./styles";
import SearchBar from "../../components/Searchbar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DirectionsHeader from "../../components/DirectionsHeader";
import BottomControls from "../../components/BottomControls";
import { devLog, getBoundingBox, metersToMiles } from "../../utils/functions";
import { getBuildings, getPopular, getRoute } from "../../services/api";
import PathComponent from "../../components/PathComponent";
import { retry } from "../../utils/retry";
import {
  GetBuildingsResponse,
  GetPopularResponse,
  GetRouteResponse,
} from "../../@types/api";
import useNavigationProgress, {
  OffRouteCallbackPayload,
} from "../../hooks/useNavigationProgress";
import { mockClosedTimes, mockOpenTimes } from "../../mock/buildings";
import { useTheme } from "styled-components/native";
import UserLocationIndicator from "../../components/UserLocationIndicator";
import Banner from "../../components/Banner";
import { Context } from "../../App";
import TunnelFloor from "../../components/TunnelFloor";

SplashScreen.preventAutoHideAsync();
Mapbox.setAccessToken(MAPBOX_ACCESS_TOKEN);

const defaultCameraSettings: Mapbox.CameraStop = {
  heading: 0,
  zoomLevel: 15,
  pitch: 0,
  centerCoordinate: [-93.23532984426897, 44.974795560478185], // centers on campus if no location
};

const TOAST_IDS = {
  buildings: "buildings-error",
  route: "route-error",
  reroute: "reroute-error",
  locationPermission: "location-permission",
} as const;

const Home = () => {
  const { hideSplash } = useContext(Context);
  const [offline, setOffline] = useState(false);
  const [setupFailed, setSetupFailed] = useState(false);
  const [retries, setRetries] = useState(0);
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const cameraRef = useRef<Mapbox.Camera | null>(null);
  const latestQuery = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isReroutingRef = useRef(false);
  const destinationRef = useRef<number | string | null>(null);
  // loading
  const [loading, setLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState<number | null>(null);
  // populated by api
  const [buildings, setBuildings] = useState<GetBuildingsResponse>([]);
  const [currentRoute, setCurrentRoute] = useState<GetRouteResponse | null>(
    null,
  );
  // geolocation state
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null,
  );
  const [heading, setHeading] = useState<number | null>(null);
  const [selectedMarkerId, setSelectedMarkerId] = useState<
    number | string | null
  >(null);
  // page state
  const [onRoute, setOnRoute] = useState<boolean>(false);
  const [centered, setCentered] = useState<boolean>(true);
  const [followUserLocation, setFollowUserLocation] =
    useState<boolean>(onRoute);
  const [destination, setDestination] = useState<
    (typeof buildings)[number] | null
  >(null);
  const [popularDestinations, setPopularDestinations] =
    useState<GetPopularResponse>([]);

  useEffect(() => {
    destinationRef.current = destination?.id ?? null;
  }, [destination]);

  // memoized functions
  /**
   * Adjusts the Mapbox camera view to either move to a building location directly
   * or fit the map view to include both the user's current location and the selected building.
   *
   * @param building - The building selected as the destination.
   */
  const adjustMapToRoute = useCallback(
    (building: (typeof buildings)[number]) => {
      setDestination(building);
      if (!location)
        cameraRef.current?.moveTo([building.longitude, building.latitude], 500);
      else {
        const boundingBox = getBoundingBox([
          [location.coords.longitude, location.coords.latitude],
          [building.longitude, building.latitude],
        ]);
        // devLog(boundingBox);
        cameraRef.current?.fitBounds(
          boundingBox.ne,
          boundingBox.sw,
          // TODO: set to dynamic value from size of overlays
          [300, 50],
          500,
        );
      }
    },
    [location, cameraRef.current],
  );

  /**
   * Simulates loading progress by incrementally increasing the progress value using a random factor.
   * Useful for simulating progress-based loading indicators while waiting for route data.
   *
   * @param avgSpeed - Average speed at which the progress should increase (default: 0.01).
   * @param goal - The maximum value to reach before stopping the progress (default: 1).
   */
  const simulateLoadingProgress = useCallback(
    (avgSpeed: number = 0.01, goal: number = 1) => {
      setLoadingProgress((prev) => {
        const newVal = Math.min((prev || 0) + avgSpeed * Math.random(), goal);
        if (newVal < goal) setTimeout(simulateLoadingProgress, 50);
        return newVal;
      });
    },
    [setLoadingProgress],
  );

  const clearRouteData = useCallback(() => {
    if (latestQuery.current) {
      clearTimeout(latestQuery.current);
      latestQuery.current = null;
    }
    setCurrentRoute(null);
    setLoading(false);
    setLoadingProgress(null);
    setOnRoute(false);
  }, []);

  const handleOffRoute = useCallback(
    async ({ location: offRouteLocation }: OffRouteCallbackPayload) => {
      if (!destination) return;
      if (isReroutingRef.current) return;
      isReroutingRef.current = true;
      if (latestQuery.current) {
        clearTimeout(latestQuery.current);
        latestQuery.current = null;
      }
      try {
        setLoading(true);
        setLoadingProgress(null);
        simulateLoadingProgress(0.5, 0.95);
        const data = await getRoute(
          destination.buildingName,
          offRouteLocation.coords.latitude,
          offRouteLocation.coords.longitude,
        );
        setCurrentRoute(data);
        toast.dismiss(TOAST_IDS.reroute);
      } catch (e) {
        devLog("error re-routing: ", e);
        toast.warning("Rerouting failed", {
          id: TOAST_IDS.reroute,
          description: "We'll keep your last directions for now.",
        });
      } finally {
        setLoadingProgress(null);
        setLoading(false);
        isReroutingRef.current = false;
      }
    },
    [destination, simulateLoadingProgress],
  );

  const navigation = useNavigationProgress(
    currentRoute,
    location,
    onRoute,
    handleOffRoute,
  );
  const routeSegments = navigation.normalizedRoute?.segments ?? [];

  const setup = async () => {
    if (buildings?.length && popularDestinations?.length) return;
    try {
      // get buildings and popular destinations before first render
      const [buildingsData, popular] = await Promise.all([
        retry(() => getBuildings(), 3, 800),
        retry(() => getPopular(), 3, 800),
      ]);
      // devLog(buildingsData);
      setBuildings(buildingsData);
      setPopularDestinations(popular);
      setSetupFailed(false);
    } catch (e) {
      setRetries((prev) => prev + 1);
      setSetupFailed(true);
      devLog("error calling api: ", e);
      // toast.error("Couldn't load buildings", {
      //   id: TOAST_IDS.buildings,
      //   description: "Check your connection and try again.",
      // });
    } finally {
      hideSplash();
    }
  };

  useEffect(() => {
    let isMounted = true;

    const handleNetInfoUpdate = (state: NetInfoState) => {
      // devLog("network state updated:", state);
      setOffline((prevOffline) => {
        if (state.isInternetReachable === false || state.isConnected === false)
          return true;
        if (state.isInternetReachable === true || state.isConnected === true)
          return false;
        return prevOffline;
      });
    };

    setup();

    NetInfo.fetch()
      .then((state) => {
        if (isMounted) handleNetInfoUpdate(state);
      })
      .catch((error) => devLog("netinfo fetch failed:", error));

    const unsubscribe = NetInfo.addEventListener(handleNetInfoUpdate);
    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          toast.error("Location permission denied", {
            id: TOAST_IDS.locationPermission,
            description: "Enable location to get navigation directions.",
          });
          return;
        }
        Location.watchPositionAsync(
          {
            accuracy: Location.LocationAccuracy.BestForNavigation,
            distanceInterval: 1,
            timeInterval: 500,
          },
          (loc) => {
            // devLog("location updated: ", loc);
            setLocation(loc);
          },
        );
        Location.watchHeadingAsync((headingValue) => {
          const { trueHeading } = headingValue;
          setHeading(
            Number.isFinite(trueHeading) && trueHeading >= 0
              ? trueHeading
              : null,
          );
        });
      } catch (e) {
        devLog("error requesting location permissions: ", e);
        toast.error("Unable to access location", {
          id: TOAST_IDS.locationPermission,
          description: "Please try again or check location services.",
        });
      }
    })();
  }, []);

  useEffect(() => {
    if (!location?.coords) return;
    setLoadingProgress(null);
    if (latestQuery.current) {
      clearTimeout(latestQuery.current);
      latestQuery.current = null;
    }
    if (!destination) {
      cameraRef.current?.setCamera({
        heading: 0,
        animationDuration: 500,
        animationMode: "easeTo",
      });
      setCurrentRoute(null);
      return;
    } else {
      const targetDestination = destination;
      const targetDestinationId = destination.id;
      setLoading(true);
      simulateLoadingProgress(0.5, 0.95);
      const timeoutId = setTimeout(async () => {
        try {
          const data = await getRoute(
            targetDestination.buildingName,
            location?.coords.latitude,
            location?.coords.longitude,
          );
          if (destinationRef.current !== targetDestinationId) return;
          setCurrentRoute(data);
          toast.dismiss(TOAST_IDS.route);
          // devLog("route data: ", data);
        } catch (e) {
          if (destinationRef.current !== targetDestinationId) return;
          devLog("error getting route: ", e);
          toast.error("Couldn't load route", {
            id: TOAST_IDS.route,
            description: "Please check your connection and try again.",
          });
        } finally {
          if (destinationRef.current !== targetDestinationId) return;
          setLoadingProgress(1);
          setLoading(false);
          setLoadingProgress(null);
          if (latestQuery.current === timeoutId) latestQuery.current = null;
        }
      }, 500);
      latestQuery.current = timeoutId;
      return () => {
        if (latestQuery.current === timeoutId) {
          clearTimeout(timeoutId);
          latestQuery.current = null;
        }
      };
    }
  }, [destination]);

  useEffect(() => {
    if (!(onRoute || followUserLocation)) {
      setTimeout(
        () => cameraRef.current?.setCamera({ ...defaultCameraSettings }),
        0, // ? something behind the scenes in Mapbox doesn't allow for the camera to be set immediately after `followUserPosition` turns `false`
      );
    }
  }, [onRoute, followUserLocation]);

  const handleMapPressed = useCallback(
    (feature: GeoJSON.Feature) => {
      if (selectedMarkerId) {
        if (!onRoute) {
          setDestination(null);
          setCurrentRoute(null);
        }
        setSelectedMarkerId(null);
      }
      if (!__DEV__) return;
      const coords = (
        feature.geometry as unknown as { coordinates: [number, number] }
      ).coordinates; // ? this seems to be a typing mistake from Mapbox, since it does return the forced type
      devLog(coords);
      setLocation(
        (prev) =>
          ({
            ...prev,
            coords: {
              ...prev?.coords,
              longitude: coords[0],
              latitude: coords[1],
            },
          }) as Location.LocationObject,
      );
    },
    [onRoute, selectedMarkerId],
  );

  const handleMarkerSelected = useCallback(
    (building: (typeof buildings)[number] | null) => {
      if (building === null) {
        clearRouteData();
        setDestination(null);
        setSelectedMarkerId(null);
        return;
      }

      const isAlreadySelected = destination?.id === building.id;

      if (isAlreadySelected) {
        clearRouteData();
        setDestination(null);
        setSelectedMarkerId(null);
        return;
      }

      clearRouteData();
      setSelectedMarkerId(building.id);
      adjustMapToRoute(building);
    },
    [adjustMapToRoute, clearRouteData, destination],
  );

  const isDarkMode = theme.name === "dark";
  const userLocationCoordinate = location?.coords
    ? ([location.coords.longitude, location.coords.latitude] as [
        number,
        number,
      ])
    : null;

  const handleUserLocationUpdate = useCallback((_location: MapboxLocation) => {
    // no-op – keeps the internal location manager running even when hidden
  }, []);

  return (
    <Container>
      {!offline && setupFailed && (
        <Banner
          key="setup-failed-banner"
          title="We couldn't load required data"
          description="Please check your connection and try again."
          onPressButton={setup}
          retries={retries}
        />
      )}
      {offline && (
        <Banner
          key="offline-banner"
          title="You are currently offline"
          description="Routes are unavailable while offline."
          noButton
        />
      )}
      <Content
        pointerEvents="box-none"
        style={{ paddingTop: insets.top + 5, paddingBottom: insets.bottom }}
      >
        {onRoute && navigation.directions.length ? (
          <DirectionsHeader
            directions={navigation.directions}
            current={navigation.current}
            progress={navigation.progress}
          />
        ) : (
          <SearchBar
            popularDestinations={popularDestinations}
            onSelectDestination={(destination) => {
              const nextDestination = buildings.find(
                (x) => x.id === destination.id,
              );
              if (!nextDestination) return;
              clearRouteData();
              setSelectedMarkerId(nextDestination.id);
              adjustMapToRoute(nextDestination);
            }}
          />
        )}
        <BottomControls
          active={!!destination}
          onCenter={() => {
            if (!onRoute && location?.coords) {
              cameraRef.current?.setCamera({
                centerCoordinate: [
                  location?.coords.longitude,
                  location?.coords.latitude,
                ],
                zoomLevel: 17,
                animationDuration: 500,
              });
              setCentered(true);
            } else if (onRoute && !followUserLocation)
              setFollowUserLocation(true);
          }}
          centerButtonActive={onRoute ? followUserLocation : centered}
          loading={loading}
          loadingProgress={loadingProgress || undefined}
          destinationInfo={{
            id: destination?.buildingName || "",
            name: destination?.buildingName || "",
            opens: destination?.opens || mockOpenTimes,
            closes: destination?.closes || mockClosedTimes,
          }}
          distance={{
            miles: metersToMiles(currentRoute?.totalDistance || 0),
            meters: currentRoute?.totalDistance || 0,
          }}
          startRouteDisabled={!loading && !currentRoute}
          eta={
            currentRoute?.totalTime ? Math.round(currentRoute?.totalTime) : null
          }
          routeProgress={
            navigation.normalizedRoute?.instructions
              ? 1 -
                navigation.current /
                  navigation.normalizedRoute?.instructions?.length
              : 1
          }
          onStartRoute={() => {
            setFollowUserLocation(true);
            setOnRoute(true);
          }}
          onEndRoute={() => {
            setFollowUserLocation(false);
            setOnRoute(false);
          }}
        />
      </Content>

      <Mapbox.MapView
        attributionEnabled
        attributionPosition={{ left: -3, bottom: 6 }}
        scaleBarEnabled={false}
        onPress={handleMapPressed}
        style={styles.map}
        styleURL={theme.mapboxStyleURL}
        onCameraChanged={(state) => {
          if (state.gestures.isGestureActive) {
            if (followUserLocation) setFollowUserLocation(false);
            if (centered) setCentered(false);
          }
        }}
      >
        <Mapbox.Camera
          animationMode={"moveTo"}
          ref={cameraRef}
          defaultSettings={{
            ...defaultCameraSettings,
            centerCoordinate: location
              ? [location.coords.longitude, location.coords.latitude]
              : defaultCameraSettings.centerCoordinate,
          }}
          followUserLocation={followUserLocation}
          // only active if the above is
          followZoomLevel={18}
          followPitch={45}
          followUserMode={UserTrackingMode.FollowWithHeading}
        />
        <Mapbox.UserLocation
          visible={!isDarkMode}
          showsUserHeadingIndicator={onRoute}
          onUpdate={handleUserLocationUpdate}
        />
        {isDarkMode && (
          <UserLocationIndicator
            coordinate={userLocationCoordinate}
            heading={heading}
            showsHeadingIndicator={onRoute}
            visible={!!userLocationCoordinate}
          />
        )}
        {routeSegments.length > 0 && (
          <PathComponent
            id="route-animated"
            segments={routeSegments}
            userLocation={location?.coords ?? null}
            />
          )}
          { routeSegments.length > 0 && (
          <TunnelFloor steps={currentRoute?.steps ?? []} /> )}
        {buildings.map((building, index) => (
          <CustomMarker
            selected={building.id === destination?.id}
            coordinate={[building.longitude, building.latitude]}
            id={String(building.id)}
            key={building.id + index}
            delay={index * 10}
            onSelected={() => {if (!onRoute) handleMarkerSelected(building)}}
          />
        ))}
      </Mapbox.MapView>
    </Container>
  );
};

export default Home;

const styles = StyleSheet.create({
  map: StyleSheet.absoluteFillObject,
});
