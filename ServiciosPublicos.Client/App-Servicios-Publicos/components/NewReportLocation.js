import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Vibration,
} from "react-native";
import LocationForm from "../components/LocationForm";
import MapComponent from "../components/MapComponent";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";

const { width: WIDTH, height: HEIGHT } = Dimensions.get("screen");

const NewReportLocation = ({
  parentCallback,
  currentLocation,
  currentAddress,
}) => {
  const [screen, setScreen] = useState(0);
  const [address, setAddress] = useState(currentLocation);
  const [location, setLocation] = useState("");
  const [exist, setExist] = useState(
    Object.keys(currentLocation).length === 0 ? false : true
  );
  let [optionalAddress, setOptionalAddress] = useState(currentAddress);
  const PATTERN = [1 * 100, 1 * 200, 1 * 10, 1 * 200];
  const [addressColor, setAddressColor] = useState("#000");

  const sendData = () => {
    parentCallback(3, address, optionalAddress);
  };

  let isNumeric = (n) => {
    return !isNaN(parseFloat(n)) && isFinite(n);
  };

  const callbackFunction = (childData) => {
    if (childData === 1) {
      setScreen(childData);
      setAddress(null);
      setLocation("");
    } //27.518302, -109.9502619
    else {
      getCurrentLocation();
    }
  };

  const callbackAddress = (childData) => {
    setAddress(childData);
    console.log(childData);
    ReverseGeocode(childData);
    setExist(true);
  };

  const callbackOptionalAddress = (childData) => {
    setOptionalAddress(childData);
  };

  let locationForm = (
    <LocationForm
      parentCallback={callbackFunction}
      locationAdded={exist}
      optionalAddressForm={callbackOptionalAddress}
      dataForm={optionalAddress}
    />
  );
  let mapComponent = (
    <MapComponent
      parentCallback={callbackAddress}
      parentLocation={address}
      editMarker={true}
    />
  );
  let addressText = (
    <Text style={[styles.instructionText, { color: addressColor }]}>
      {location}
    </Text>
  );
  let instructionText = (
    <Text style={styles.instructionText}>
      Arrastre y pulse la ubicación exacta en el mapa
    </Text>
  );
  let nextButton = (
    <TouchableOpacity style={styles.nextButton} onPress={sendData}>
      <Text style={styles.buttonText}>Siguiente</Text>
    </TouchableOpacity>
  );
  let acceptButton = (
    <TouchableOpacity style={styles.nextButton} onPress={() => setScreen(2)}>
      <Text style={styles.buttonText}>Aceptar</Text>
    </TouchableOpacity>
  );

  let ReverseGeocode = async (ad) => {
    const { granted } = await Permissions.askAsync(Permissions.LOCATION);
    if (granted) {
      let data = await Location.reverseGeocodeAsync({
        latitude: ad.latitude,
        longitude: ad.longitude,
      });
      console.log(data);
      if (data[0] !== undefined) {
        if (data[0].city === "Ciudad Obregón") {
          setAddressColor("#000");
          setLocation(
            (data[0].street !== null ? data[0].street : "") +
              (data[0].name !== null && isNumeric(data[0].name)
                ? " #" + data[0].name
                : "") +
              (data[0].district !== null ? ", " + data[0].district : "") +
              (data[0].postalCode !== null ? " CP. " + data[0].postalCode : "")
          );
          setOptionalAddress({
            street:
              (data[0].street !== null ? data[0].street : "") +
              (data[0].name !== null && isNumeric(data[0].name)
                ? " #" + data[0].name
                : ""),
            street_1: "",
            street_2: "",
            references: "",
            neighborhood: data[0].district !== null ? data[0].district : "",
          });
        } else {
          setLocation("¡Ubicación fuera de rango de atención!");
          Vibration.vibrate(PATTERN);
          setAddressColor("red");
        }
      } else
        setLocation(
          "Dirección no disponible para mostrar, puede continuar la realización reporte"
        );
    } else {
      console.log("Necesitas dar permiso");
    }
  };

  let getCurrentLocation = async () => {
    const { granted } = await Permissions.askAsync(Permissions.LOCATION);
    if (granted) {
      let data = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      console.log(data.coords);
      setAddress(data.coords);
      setScreen(1);
      setExist(true);
    } else {
      console.log("Necesitas dar permiso");
      setExist(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.cardHeader}>
        <Text style={styles.headerText}>Ubicación del reporte</Text>
      </View>

      <View style={styles.cardContent}>
        {screen === 1
          ? address !== null
            ? addressText
            : instructionText
          : null}

        {screen === 0 || screen === 2 ? locationForm : mapComponent}
      </View>

      <View style={styles.cardFooter}>
        {exist && (screen === 0 || screen === 2) ? nextButton : null}
        {screen === 1 &&
        location !== "" &&
        location !== "¡Ubicación fuera de rango de atención!"
          ? acceptButton
          : null}
      </View>
    </View>
  );
};

export default NewReportLocation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
    justifyContent: "center",
    width: "100%",
    borderRadius: 10,
  },
  cardHeader: {
    flex: 2,
    alignItems: "center",
    justifyContent: "space-evenly",
    flexDirection: "row",
    marginBottom: 2,
    backgroundColor: "white",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  cardContent: {
    flex: 20,
    alignItems: "stretch",
    justifyContent: "center",
    backgroundColor: "white",
  },
  cardFooter: {
    flex: 3,
    alignItems: "center",
    justifyContent: "flex-end",
    flexDirection: "row",
    marginTop: 2,
    backgroundColor: "white",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  headerText: {
    fontSize: HEIGHT * 0.022,
    fontWeight: "bold",
  },
  buttonText: {
    fontSize: HEIGHT * 0.02,
    alignSelf: "center",
    color: "white",
  },
  instructionText: {
    fontSize: HEIGHT * 0.018,
    alignSelf: "center",
    color: "black",
    marginVertical: HEIGHT * 0.02,
    textAlign: "center",
  },
  nextButton: {
    backgroundColor: "rgba(0,158,227,1)",
    width: "25%",
    height: HEIGHT * 0.048,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginRight: WIDTH * 0.02,
  },
});
