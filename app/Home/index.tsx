import React, { useState, useEffect, useRef, useCallback } from "react";
import * as Location from "expo-location";
import CustomMarker from "../../components/CustomMarker";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

import MapboxGL from "@rnmapbox/maps";
import { MAPBOX_ACCESS_TOKEN } from "../../mapboxConfig";
import fontObject from "../../assets/fonts";

import { Container, Content } from "./styles";
import SearchBar from "../../components/Searchbar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TODO } from "../../@types/utils";
import DirectionsHeader from "../../components/DirectionsHeader";
import DirectionsModal from "../../components/DirectionsModal";
import { buildings } from "../../utils/mock";
import { getBoundingBox } from "../../utils/functions";
export interface types {
  newText: string;
}

SplashScreen.preventAutoHideAsync();
MapboxGL.setAccessToken(MAPBOX_ACCESS_TOKEN);

const Home = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null,
  );
  const [fontsLoaded, fontsError] = useFonts(fontObject);
  const cameraRef = useRef<MapboxGL.Camera | null>(null);
  const [onRoute, setOnRoute] = useState<boolean>(false);
  const [destination, setDestination] = useState<TODO>(null);


  const adjustMapToRoute = useCallback(
    (building: (typeof buildings)[number]) => {
      setDestination(building);
      if (!location) cameraRef.current?.moveTo(building.coordinates, 500);
      else {
        const boundingBox = getBoundingBox([
          [location.coords.longitude, location.coords.latitude],
          building.coordinates,
        ]);
        console.log(boundingBox);
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

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.warn("Permission to access location was denied");
        return;
      }
      await setLocation(await Location.getCurrentPositionAsync({}));
    })();
  }, []);

  const insets = useSafeAreaInsets();
  if (!(fontsLoaded || fontsError)) {
    return null;
  }
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
              adjustMapToRoute(destination);
            }}
          />
        )}
        {destination && (
          <>
            <DirectionsModal
              destinationInfo={{
                id: destination.id,
                name: destination.name,
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
            zoomLevel: 15,
            centerCoordinate: [-93.23532984426897, 44.974795560478185], // centers on campus if no location
          }}
          followZoomLevel={14}
          // followUserLocation={true}
        />
        <MapboxGL.UserLocation visible={true} />
        {buildings
          .filter((building) => !onRoute || building.id === destination.id)
          .map((building) => (
            <CustomMarker
              coordinate={building.coordinates}
              id={building.id}
              key={building.id}
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
