import React, { useState, useEffect, useRef, useCallback } from "react";
import { Alert, Platform, Text, TouchableOpacity, View } from "react-native";
import MapView, {
  MapPolyline,
  Marker,
  PROVIDER_DEFAULT,
  PROVIDER_GOOGLE,
  Polyline,
} from "react-native-maps";
import * as Location from "expo-location";
import LocationButton from "../../components/LocationButton";
import CustomMarker from "../../components/CustomMarker";
import CustomChip from "../../components/CustomChip";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

import fontObject from "../../assets/fonts";

import { Container, Map, LocButton, Content, CustomMark } from "./styles";
import Splash from "../Splash";
import { LocationSubscriber } from "expo-location/build/LocationSubscribers";
import DirectionsHeader from "../../components/DirectionsHeader";
import SearchBar from "../../components/Searchbar";
export interface types {
  newText: string;
}

SplashScreen.preventAutoHideAsync();

export default function Home() {
  const [fontsLoaded, fontsError] = useFonts(fontObject);
  // State to get the current user location
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null,
  );
  // State to get the current location of the current user view
  const [region, setRegion] = useState({
    latitude: 44.97565862446892,
    longitude: -93.23372512269837,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  });
  const [heading, setHeading] = useState<number | null>(null); // Sttate to get the current heading position
  const [errorMsg, setErrorMsg] = useState<string | null>(null); // State to track errors
  const [zoomLevel, setZoomLevel] = useState(0); // State to track zoom level
  const [markerSize, setMarkerSize] = useState(56);
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);
  const mapRef = useRef<any>();
  // const size = zoomLevel <= 10 ? 20 : 30;

  const focusMap = () => {
    if (location) {
      const { latitude, longitude } = location.coords;
      mapRef.current.animateToRegion({
        latitude,
        longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      });
    }
  };
  // TODO: @limetheman merge these calls to `useEffect` (they both have the same dependency array)
  useEffect(() => {
    const getLocation = async () => {
      try {
        const { status: permissionStatus } =
          await Location.requestForegroundPermissionsAsync();
        if (permissionStatus !== "granted") {
          console.log("Location permission not granted");
          return;
        }

        const currentLocation = await Location.getCurrentPositionAsync();
        setLocation(currentLocation);
      } catch (error) {
        console.error("Error getting location:", error);
      }
    };

    // Call getLocation initially
    getLocation();

    setInterval(getLocation, 1000);
  }, []);

  useEffect(() => {
    const getHeading = async () => {
      try {
        Location.watchHeadingAsync((newHeading) => {
          setHeading(newHeading.trueHeading);
        });
      } catch (error) {
        console.error("Error getting heading:", error);
      }
    };

    // Call getHeading initially
    getHeading();
  }, []);

  const handleRegionChange = (newRegion: any) => {
    // Calculate zoom level based on latitudeDelta
    const newZoomLevel = Math.log2(360 / newRegion.longitudeDelta);
    setMarkerSize(Math.pow(1.6, zoomLevel) / 20);
    setZoomLevel(newZoomLevel);
    setRegion(newRegion);
  };

  const onLayoutRootView = useCallback(async () => {
    if (fontsError) console.warn(fontsError);
    if ((fontsLoaded || fontsError) && location) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontsError, location]);

  if (!(fontsLoaded || fontsError) || !location) {
    return null;
  }

  return (
    <Container onLayout={onLayoutRootView}>
      {location && (
        <>
          <Map
            // Specifies the location of the initial view screen
            initialRegion={region}
            // OnRegionChangeComplete runs when the user stops dragging the map view, our callback function uses this and sets the current region to the location of the screen where the user stopped
            onRegionChange={(region) => {
              handleRegionChange(region);
            }}
            showsUserLocation={false}
            showsMyLocationButton={false}
            showsBuildings={true}
            userInterfaceStyle="light"
            provider={
              Platform.OS === "android" ? PROVIDER_GOOGLE : PROVIDER_DEFAULT
            }
            ref={mapRef}
          >
            <LocButton
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              rotation={heading || 0} // Set the rotation of the marker based on the user's heading
              onPress={focusMap}
              anchor={{ x: 0.5, y: 0.5 }}
            >
              <LocationButton width={70} height={70} />
            </LocButton>

            <CustomMark
              coordinate={{
                latitude: 44.97588,
                longitude: -93.2345, // Morrill Hall
              }}
              title={"Morrill Hall"}
              description={"test test test test test"}
              tracksViewChanges={false}
              anchor={{ x: 0.5, y: 0.5 }}
              calloutAnchor={{ x: 0.5, y: 0.2 }}
            >
              <CustomMarker width={markerSize} height={markerSize} />
            </CustomMark>

            <CustomMark
              coordinate={{
                latitude: 44.9753,
                longitude: -93.23454,
              }}
              title={"Tate Hall"}
              description={"physics building"}
              tracksViewChanges={false}
              anchor={{ x: 0.5, y: 0.5 }}
              calloutAnchor={{ x: 0.5, y: 0.2 }}
            >
              <CustomMarker width={markerSize} height={markerSize} />
            </CustomMark>

            <MapPolyline
              coordinates={[
                {
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                },
                { latitude: 44.97565862446892, longitude: -93.23372512269837 },
                { latitude: 44.97565862446895, longitude: -93.23372512269835 },
              ]}
              strokeWidth={5}
              geodesic={true}
            ></MapPolyline>
          </Map>
          <Content pointerEvents="box-none">
            <SearchBar />
            <TouchableOpacity
              onPress={focusMap}
              style={{
                position: "absolute",
                bottom: 20,
                right: 20,
                backgroundColor: "white",
                padding: 10,
                borderRadius: 10,
              }}
            >
              <Text>Focus to Current Location</Text>
            </TouchableOpacity>
            {/* <DirectionsModal /> */}
          </Content>
        </>
      )}
      {/* <Text style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
        heading: {heading !== null ? heading.toFixed(2) : 'Loading...'}
      </Text>
      <Text style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
        Current user latitude: {location.coords.latitude}
      </Text>
      <Text style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
        Current user longitude: {location.coords.longitude}
      </Text>
      <Text style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
        Current latitude: {region.latitude}
      </Text>
      <Text style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
        Current longitude: {region.longitude}
      </Text> */}
    </Container>
  );
}
