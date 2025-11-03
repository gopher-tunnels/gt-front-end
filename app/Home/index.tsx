import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useLayoutEffect,
} from "react";
import { StyleSheet } from "react-native";
import * as Location from "expo-location";
import CustomMarker from "../../components/CustomMarker";
import * as SplashScreen from "expo-splash-screen";

import MapboxGL, { UserTrackingMode } from "@rnmapbox/maps";
import { MAPBOX_ACCESS_TOKEN } from "../../mapboxConfig";

import { Container, Content } from "./styles";
import SearchBar from "../../components/Searchbar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DirectionsHeader from "../../components/DirectionsHeader";
import BottomControls from "../../components/BottomControls";
import { devLog, getBoundingBox, metersToMiles } from "../../utils/functions";
import { getBuildings, getRoute } from "../../services/api";
import PathComponent from "../../components/PathComponent";
import { GetBuildingsResponse, GetRouteResponse } from "../../@types/api";
import useNavigationProgress, {
  OffRouteCallbackPayload,
} from "../../hooks/useNavigationProgress";
import { mockClosedTimes, mockOpenTimes } from "../../mock/buildings";

SplashScreen.preventAutoHideAsync();
MapboxGL.setAccessToken(MAPBOX_ACCESS_TOKEN);

const defaultCameraSettings: MapboxGL.CameraStop = {
  heading: 0,
  zoomLevel: 15,
  pitch: 0,
  centerCoordinate: [-93.23532984426897, 44.974795560478185], // centers on campus if no location
};

const Home = () => {
  const insets = useSafeAreaInsets();
  const cameraRef = useRef<MapboxGL.Camera | null>(null);
  const latestQuery = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isReroutingRef = useRef(false);
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
  const [heading, setHeading] = useState<number>(0);
  // page state
  const [onRoute, setOnRoute] = useState<boolean>(false);
  const [followUserLocation, setFollowUserLocation] =
    useState<boolean>(onRoute);
  const [destination, setDestination] = useState<
    (typeof buildings)[number] | null
  >(null);

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
      } catch (e) {
        devLog("error re-routing: ", e);
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

  useLayoutEffect(() => {
    (async () => {
      try {
        // get buildings before first render
        const data = await getBuildings();
        devLog(data);
        setBuildings(data);
      } catch (e) {
        devLog("error calling api: ", e);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.warn("Permission to access location was denied");
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
      Location.watchHeadingAsync((heading) => {
        // devLog(heading);
        setHeading(heading.trueHeading);
      });
    })();
  }, []);

  useEffect(() => {
    if (!location?.coords) return;
    setLoadingProgress(null);
    if (latestQuery.current) clearTimeout(latestQuery.current);
    if (!destination) {
      cameraRef.current?.setCamera({
        heading: 0,
        animationDuration: 500,
        animationMode: "easeTo",
      });
      setCurrentRoute(null);
      return;
    } else {
      setLoading(true);
      simulateLoadingProgress(0.5, 0.95);
      latestQuery.current = setTimeout(async () => {
        try {
          const data = await getRoute(
            destination.buildingName,
            location?.coords.latitude,
            location?.coords.longitude,
          );
          setCurrentRoute(data);
          devLog("route data: ", data);
        } catch (e) {
          devLog("error getting route: ", e);
        } finally {
          setLoadingProgress(1);
          setLoading(false);
          setLoadingProgress(null);
        }
      }, 500);
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

  const handleMapPressed = useCallback((feature: GeoJSON.Feature) => {
    if (__DEV__) return;
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
  }, []);

  return (
    <Container>
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
            onSelectDestination={(destination) => {
              setDestination(buildings.find((x) => x.id === destination.id)!);
            }}
          />
        )}
        <BottomControls
          active={!!destination}
          onCenter={() => {
            if (!onRoute && location?.coords)
              cameraRef.current?.moveTo(
                [location?.coords.longitude, location?.coords.latitude],
                500,
              );
            else if (onRoute && !followUserLocation)
              setFollowUserLocation(true);
          }}
          centerButtonActive={onRoute && followUserLocation}
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

      <MapboxGL.MapView
        scaleBarEnabled={false}
        onPress={handleMapPressed}
        style={styles.map}
        styleURL="mapbox://styles/mapbox/standard"
        onCameraChanged={(state) => {
          if (state.gestures.isGestureActive && followUserLocation)
            setFollowUserLocation(false);
        }}
      >
        <MapboxGL.Camera
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
        <MapboxGL.UserLocation
          visible={true}
          showsUserHeadingIndicator={onRoute}
        />
        {routeSegments.length > 0 && (
          <PathComponent
            id="route-animated"
            segments={routeSegments}
            userLocation={location?.coords ?? null}
          />
        )}
        {buildings
          .filter(
            (building) =>
              !onRoute || building.buildingName === destination.buildingName,
          )
          .map((building, index) => (
            <CustomMarker
              coordinate={[building.longitude, building.latitude]}
              id={building.buildingName}
              key={building.buildingName + index}
              onSelected={() => {
                if (!onRoute) adjustMapToRoute(building);
              }}
              onDeselected={() => {
                if (!onRoute) {
                  setDestination(null);
                  setCurrentRoute(null);
                }
              }}
            />
          ))}
      </MapboxGL.MapView>
    </Container>
  );
};

export default Home;

const styles = StyleSheet.create({
  map: StyleSheet.absoluteFillObject,
});
