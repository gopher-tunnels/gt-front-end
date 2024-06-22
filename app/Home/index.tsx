import React, { useState, useEffect } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import LocationButton from '../../components/LocationButton';
import {
  LocationObject as LocationObjectLocation,
  requestForegroundPermissionsAsync as requestForegroundPermissionsAsyncLocation,
  watchHeadingAsync as watchHeadingAsyncLocation,
  LocationSubscription as LocationSubscriptionLocation,
} from 'expo-location';
import { DeviceMotion } from 'expo-sensors';

import { Container, Map } from './styles';
import TunnelEntranceImage from '../../components/TunnelEntranceImage';

export interface types {
  newText: string;
}

export default function Home() {
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
  const [orientation, setOrientation] = useState<number | null>(null); // Sttate to get the current heading position
  const [errorMsg, setErrorMsg] = useState<string | null>(null); // State to track errors
  const [zoomLevel, setZoomLevel] = useState(0); // State to track zoom level
  const [markerSize, setMarkerSize] = useState(56);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Location permissions denied');
        return;
      }
      try {
        const currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);
      } catch (error) {
        setErrorMsg('Error getting current location');
      }
    };
    getLocation();

    const interval = setInterval(getLocation, 1);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const startWatchingOrientation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access sensors was denied');
        return;
      }

      DeviceMotion.addListener(({ rotation }) => {
        const radToDeg = 180 / Math.PI;
        const angle = Math.atan2(rotation.gamma, rotation.beta) * radToDeg;
        setOrientation(angle);
      });
    };

    startWatchingOrientation();

    return () => {
      DeviceMotion.removeAllListeners();
    };
  }, []);

  const handleRegionChange = (newRegion: any) => {
    // Calculate zoom level based on latitudeDelta
    const newZoomLevel = Math.log2(360 / newRegion.longitudeDelta);
    console.log(markerSize);
    setMarkerSize(Math.pow(1.6, zoomLevel) / 20);
    setZoomLevel(newZoomLevel);
    setRegion(newRegion);
  };

  if (!location) {
    return <Text>Loading...</Text>;
  }

  return (
    <Container>
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
      >
        {location && (
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            rotation={orientation || 0} // Set the rotation of the marker based on the user's heading
            anchor={{ x: 0.5, y: 0.5 }} // Adjust anchor to center of marker
            centerOffset={{ x: 0, y: 0 }} // Adjust centerOffset based on marker size
            calloutOffset={{ x: 0, y: 0 }} // Adjust calloutOffset based on marker size
          >
            <LocationButton width={markerSize} height={markerSize} />
          </Marker>
        )}
        <View style={{ marginTop: 50 }}>
          <TunnelEntranceImage
            imageUrl="https://www.archkey.com/wp-content/uploads/TateHallUMN_FarmKidStudios2-scaled.jpg"
            description="Tate Hall my goat"
          />
        </View>
      </Map>
      <Text>Current latitude: {region.latitude}</Text>
      <Text>Current longitude: {region.longitude}</Text>
      <Text>Bruh</Text>
    </Container>
  );
}
