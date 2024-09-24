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

import MapboxGL from "@rnmapbox/maps";
import { MAPBOX_ACCESS_TOKEN } from "../../mapboxConfig";
import { MarkerView, PointAnnotation } from "@rnmapbox/maps";
import fontObject from "../../assets/fonts";

import { Container, Map, LocButton, Content, CustomMark } from "./styles";
import Splash from "../Splash";
import { LocationSubscriber } from "expo-location/build/LocationSubscribers";
import DirectionsHeader from "../../components/DirectionsHeader";
import SearchBar from "../../components/Searchbar";
import DirectionsModal from "../../components/DirectionsModal";
export interface types {
  newText: string;
}

SplashScreen.preventAutoHideAsync();
MapboxGL.setAccessToken(MAPBOX_ACCESS_TOKEN);

export default function Home() {
  const [fontsLoaded, fontsError] = useFonts(fontObject);
  // State to get the current user location
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null,
  );

  const [coordinates] = useState([40, -90]);

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
    <Container>
        <SearchBar />
        <MapboxGL.MapView style={{ flex: 1 , position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: -1}}
        styleURL="mapbox://styles/mapbox/outdoors-v12">
        <MapboxGL.Camera
          
        />
          <MapboxGL.UserLocation visible={true} />
          <CustomMarker coordinate={[-93.234727, 44.974494]} popupText="hello"/>
          

         
         
          
        </MapboxGL.MapView>
    
    </Container>
  );
}
