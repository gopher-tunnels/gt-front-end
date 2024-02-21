import React, { useState, useEffect } from "react";
import CustomButton from "../../components/CustomButton";
import { StatusBar } from 'expo-status-bar';
import { Alert, StyleSheet, Text, View } from 'react-native';
import CustomInput from "../../components/CustomInput";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";


import { 
  Container,
  Map
} from './styles'




export interface types {
  newText: string;
}

export default function Home() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [region, setRegion] = useState({
    latitude: 44.97565862446892,
    longitude: -93.23372512269837,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  });
  const [heading, setHeading] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  useEffect(() => {
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted'){
        setErrorMsg('Location permissions denied');
        return;
      }
      try {
        const currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);
        setRegion({
          ...region,
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        });
      } catch (error) {
        setErrorMsg('Error getting current location')
      }
    }
    getLocation();

    const interval = setInterval(getLocation, 10000);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    const getHeading = async () => {
      try {
        const heading = await Location.getHeadingAsync();
        setHeading(heading.trueHeading);
      } catch (error) {
        console.error('Error getting device heading:', error);
      }
    };
    getHeading();
  }, []);

  if (!location) {
    return <Text>Loading...</Text>
  }

  return (
    <Container>
      <Map
      // Specifies the location of the initial view screen
      initialRegion={region}
      // OnRegionChangeComplete runs when the user stops dragging the map view, our callback function uses this and sets the current region to the location of the screen where the user stopped
      onRegionChangeComplete={(region) => {setRegion(region)}}
      showsUserLocation={true}
      showsMyLocationButton={true}
      >
        {location && (
          <Marker coordinate={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        }}
        rotation={heading || 0}
      >

      </Marker>
        )
        
        }
      </Map>
      <Text>Current latitude: {region.latitude}</Text>
      <Text>Current longitude: {region.longitude}</Text>
      <Text>Bruh</Text>
    </Container>
  );
};

