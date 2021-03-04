import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
} from "react-native";
import MapView from "react-native-maps";
const { width: WIDTH, height: HEIGHT } = Dimensions.get("screen");

const MapComponent = ({ parentCallback, parentLocation, editMarker }) => {
  const [marker, setMarker] = useState(parentLocation);
  const [mapRegion, setMapRegion] = useState({
    latitude: 27.4833,
    longitude: -109.9333,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    if (parentLocation !== null) {
      setCurrentLocation(parentLocation);
    }
  }, []);

  const sendData = (m) => {
    if (parentCallback !== null) parentCallback(m);
  };

  const setLocation = (e) => {
    if (editMarker) {
      setMarker(e.nativeEvent.coordinate);
      sendData(e.nativeEvent.coordinate);
      setMapRegion({
        latitude: e.nativeEvent.coordinate.latitude,
        longitude: e.nativeEvent.coordinate.longitude,
        latitudeDelta: 0.002,
        longitudeDelta: 0.001,
      });
    }
  };

  const setCurrentLocation = () => {
    setMarker(marker);
    sendData(marker);
    setMapRegion({
      latitude: parentLocation.latitude,
      longitude: parentLocation.longitude,
      latitudeDelta: 0.002,
      longitudeDelta: 0.001,
    });
  };

  return (
    <View style={styles.page}>
      <View style={styles.container}>
        <MapView style={styles.map} region={mapRegion} onPress={setLocation}>
          {marker && <MapView.Marker coordinate={marker} />}
        </MapView>
      </View>
    </View>
  );
};

export default MapComponent;

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
    width: "100%",
    height: "40%",
  },
  container: {
    flex: 1,
    height: "80%",
    width: "100%",
    backgroundColor: "tomato",
  },
  map: {
    flex: 1,
    alignContent: "flex-start",
  },
  gpsButton: {
    backgroundColor: "#006A99",
    width: "60%",
    height: HEIGHT * 0.048,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: WIDTH * 0.02,
    flexDirection: "row",
  },
  buttonText: {
    fontSize: HEIGHT * 0.02,
    alignSelf: "center",
    color: "white",
  },
});
