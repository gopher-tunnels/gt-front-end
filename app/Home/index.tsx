import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useLayoutEffect,
} from "react";
import * as Location from "expo-location";
import CustomMarker from "../../components/CustomMarker";
import * as SplashScreen from "expo-splash-screen";

import MapboxGL from "@rnmapbox/maps";
import { MAPBOX_ACCESS_TOKEN } from "../../mapboxConfig";

import { Container, Content } from "./styles";
import SearchBar from "../../components/Searchbar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DirectionsHeader from "../../components/DirectionsHeader";
import DirectionsModal from "../../components/DirectionsModal";
import { getBoundingBox } from "../../utils/functions";
import userMarker from "../../assets/userMarker.png"
import { getBuildings, getRoute } from "../../services/api";
import PathComponent from "../../components/PathComponent";
import { GetBuildingsResponse, GetRouteResponse } from "../../@types/api";
export interface types {
  newText: string;
}

SplashScreen.preventAutoHideAsync();
MapboxGL.setAccessToken(MAPBOX_ACCESS_TOKEN);

const Home = () => {
  const insets = useSafeAreaInsets();

  const cameraRef = useRef<MapboxGL.Camera | null>(null);
  const latestQuery = useRef<ReturnType<typeof setTimeout> | null>(null);
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
        // console.log(boundingBox);
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

  useLayoutEffect(() => {
    (async () => {
      try {
        // get buildings before first render
        const data = await getBuildings();
        console.log(data);
        setBuildings(data);
      } catch (e) {
        console.log("error calling api: ", e);
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
          // console.log("location updated: ", loc);
          setLocation(loc);
        },
      );
      Location.watchHeadingAsync((heading) => {
        // console.log(heading);
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
        } catch (e) {
          console.log("error getting route: ", e);
        } finally {
          setLoadingProgress(1);
          setLoading(false);
          setLoadingProgress(null);
        }
      }, 500);
    }
  }, [destination]);

  useEffect(() => {
    // match map rotation to heading if `onRoute`
    if (onRoute && heading)
      cameraRef.current?.setCamera({
        heading: heading,
        animationDuration: 150,
        animationMode: "easeTo",
      });
    else
      cameraRef.current?.setCamera({
        heading: 0,
        animationDuration: 1000,
        animationMode: "easeTo",
      });
  }, [heading, onRoute]);

  return (
    <Container>
      <Content
        pointerEvents="box-none"
        style={{ paddingTop: insets.top + 5, paddingBottom: insets.bottom }}
      >
        {onRoute ? (
          <DirectionsHeader
            directions={["enter", "left", "forward", "right"]}
            current={0}
            progress={0.1}
          />
        ) : (
          <SearchBar
            onFocus={() => setDestination(null)}
            onSelectDestination={(destination) => {
              setDestination(buildings.find((x) => x.id === destination.id)!);
            }}
          />
        )}
        {destination && (
          <>
            <DirectionsModal
              loading={loading}
              loadingProgress={loadingProgress || undefined}
              destinationInfo={{
                id: destination.buildingName,
                name: destination.buildingName,
                // TODO: use actual data from back-end response
                opens: Array.from(
                  { length: 7 },
                  () => new Date(2024, 8, 23, 9, 0, 0),
                ),
                closes: Array.from(
                  { length: 7 },
                  () => new Date(2024, 8, 23, 19, 0, 0),
                ),
              }}
              distance={{ miles: 0.1, meters: 0.2 }}
              eta={{ minutes: 6 }}
              //TODO ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
              onStartRoute={() => setOnRoute(true)}
              onEndRoute={() => setOnRoute(false)}
            />
          </>
        )}
      </Content>
      {/* <Animation /> */}

      <MapboxGL.MapView
        scaleBarEnabled={false}
        onPress={(x) => console.log(x)}
        style={{
          flex: 1,
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -1,
        }}
        styleURL="mapbox://styles/mapbox/outdoors-v12"
      >
        <MapboxGL.Camera
          animationMode={"moveTo"}
          ref={cameraRef}
          defaultSettings={{
            heading: 0,
            zoomLevel: 15,
            centerCoordinate: [-93.23532984426897, 44.974795560478185], // centers on campus if no location
          }}
          followZoomLevel={14}
          // followUserLocation={true}
        />
        <MapboxGL.Images images={{ 'user-marker': userMarker }}/>
        <MapboxGL.UserLocation>
          <MapboxGL.SymbolLayer
            id={'custom-user-symbol'}
            style={{
              iconImage: 'user-marker',
              iconRotationAlignment: 'map',
              iconAllowOverlap: true,
              iconSize: 0.6
            }}
            />
        </MapboxGL.UserLocation>
        {currentRoute && (
          <PathComponent
            coordinates={currentRoute.steps.map((step) => [
              step.longitude,
              step.latitude,
            ])}
          />
        )}
        {buildings
          .filter(
            (building) =>
              !onRoute || building.buildingName === destination.buildingName,
          )
          .map((building) => (
            <CustomMarker
              coordinate={[building.longitude, building.latitude]}
              id={building.buildingName}
              key={building.buildingName}
              onSelected={() => {
                if (!onRoute) adjustMapToRoute(building);
              }}
              onDeselected={() => {
                if (!onRoute) setDestination(null);
              }}
            />
          ))}
      </MapboxGL.MapView>
    </Container>
  );
};

export default Home;
