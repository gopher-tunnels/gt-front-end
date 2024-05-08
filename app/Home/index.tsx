import React, { useState, useEffect, useRef } from 'react';
import { Alert, Platform, Text, TouchableOpacity, View } from 'react-native';
import MapView, {
  MapPolyline,
  Marker,
  PROVIDER_DEFAULT,
  PROVIDER_GOOGLE,
  Polyline,
} from 'react-native-maps';
import * as Location from 'expo-location';
import LocationButton from '../../components/LocationButton';
import {
  LocationObject as LocationObjectLocation,
  requestForegroundPermissionsAsync as requestForegroundPermissionsAsyncLocation,
  watchHeadingAsync as watchHeadingAsyncLocation,
  LocationSubscription as LocationSubscriptionLocation,
} from 'expo-location';
import { DeviceMotion } from 'expo-sensors';

import { Container, Map, LocButton } from './styles';
import Splash from '../Splash';
import { LocationSubscriber } from 'expo-location/build/LocationSubscribers';

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
  const [heading, setHeading] = useState<number | null>(null); // Sttate to get the current heading position
  const [errorMsg, setErrorMsg] = useState<string | null>(null); // State to track errors
  const [zoomLevel, setZoomLevel] = useState(0); // State to track zoom level
  const [markerSize, setMarkerSize] = useState(56);
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);
  const mapRef = useRef<any>();

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

  useEffect(() => {
    const getLocation = async () => {
      try {
        const { status: permissionStatus } =
          await Location.requestForegroundPermissionsAsync();
        if (permissionStatus !== 'granted') {
          console.log('Location permission not granted');
          return;
        }

        let currentLocation = await Location.getCurrentPositionAsync();
        setLocation(currentLocation);
      } catch (error) {
        console.error('Error getting location:', error);
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
        console.error('Error getting heading:', error);
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

  if (!location) {
    return <Splash />;
  }

  return (
    <Container>
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
              Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT
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
          <TouchableOpacity
            onPress={focusMap}
            style={{
              position: 'absolute',
              bottom: 20,
              right: 20,
              backgroundColor: 'white',
              padding: 10,
              borderRadius: 10,
            }}
          >
            <Text>Focus to Current Location</Text>
          </TouchableOpacity>
        </>
      )}
      <Text style={{ fontFamily: 'Plus-Jakarta-Sans' }}>
        heading: {heading !== null ? heading.toFixed(2) : 'Loading...'}
      </Text>
      <Text style={{ fontFamily: 'Plus-Jakarta-Sans' }}>
        Current user latitude: {location.coords.latitude}
      </Text>
      <Text style={{ fontFamily: 'Plus-Jakarta-Sans' }}>
        Current user longitude: {location.coords.longitude}
      </Text>
      <Text style={{ fontFamily: 'Plus-Jakarta-Sans' }}>
        Current latitude: {region.latitude}
      </Text>
      <Text style={{ fontFamily: 'Plus-Jakarta-Sans' }}>
        Current longitude: {region.longitude}
      </Text>
    </Container>
  );
}
