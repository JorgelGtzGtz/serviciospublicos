import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import MapComponent from "../components/MapComponent";
import * as Location from "expo-location";
import { FontAwesome5 } from "@expo/vector-icons";
import * as Permissions from "expo-permissions";
import Modal from "react-native-modal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Base64 from "../components/Base64";

const { width: WIDTH, height: HEIGHT } = Dimensions.get("screen");

const ModifyReport = ({ parentCallback, report, EditReport }) => {
  const [address, setAddress] = useState({
    latitude: report.latitude,
    longitude: report.longitude,
  });
  const [textAddress, setTextAddress] = useState("");
  const [addressColor, setAddressColor] = useState("#000");
  const [error, setError] = useState("");

  let isLocationEnabled = async () => {
    const { granted } = await Permissions.askAsync(Permissions.LOCATION);
    if (granted) {
      ReverseGeocode(address);
    } else {
      setTextAddress("Dirección no disponible, necesitamos permisos de GPS");
      setAddressColor("orange");
    }
  };

  useEffect(() => {
    isLocationEnabled();
  }, []);

  let isNumeric = (n) => {
    return !isNaN(parseFloat(n)) && isFinite(n);
  };

  const getPermissions = async (perm) => {
    try {
      const jsonValue = await AsyncStorage.getItem("@procesoP");
      if (jsonValue != null) {
        validatePermission(JSON.parse(Base64.atob(jsonValue)), perm);
      } else console.log(jsonValue);
    } catch (e) {
      // error reading value
    }
  };

  let validatePermission = (gottenPermissions, permis) => {
    let allowed = false;
    gottenPermissions.forEach((perm) => {
      if (perm.ID_procesoPermisos === permis) allowed = true;
    });
    if (allowed) {
      if (permis === 22) delayReport();
      else if (permis === 25) closeReport();
    } else {
      setError(
        "Actualmente no tienes permiso para " +
          (perm === 22 ? "editar" : "cancelar") +
          " este reporte"
      );
    }
  };

  let _renderButton = (text, color, onPress, textColor, textWeight) => (
    <TouchableOpacity onPress={onPress}>
      <View style={[styles.button, { backgroundColor: color }]}>
        <Text
          style={[
            styles.buttonText,
            { fontWeight: textWeight, color: textColor },
          ]}
        >
          {text}
        </Text>
      </View>
    </TouchableOpacity>
  );

  let modalPermissionDenied = () => (
    <View style={styles.modalContent}>
      <FontAwesome5 name="user-shield" size={HEIGHT * 0.035} color="black" />
      <Text style={[styles.modalText, { textAlign: "center" }]}>{error}</Text>

      <View style={styles.modalFooter}>
        {_renderButton(
          "Aceptar",
          "rgba(0,158,227,1)",
          () => {
            setError("");
          },
          "white",
          "normal"
        )}
      </View>
    </View>
  );

  let ReverseGeocode = async (ad) => {
    let data = await Location.reverseGeocodeAsync({
      latitude: ad.latitude,
      longitude: ad.longitude,
    });
    if (data[0] !== undefined) {
      setTextAddress(
        (data[0].street !== null ? data[0].street : "") +
          (data[0].name !== null && isNumeric(data[0].name)
            ? " #" + data[0].name
            : "") +
          (data[0].district !== null ? ", " + data[0].district : "") +
          (data[0].postalCode !== null ? " CP. " + data[0].postalCode : "")
      );
    } else {
      setTextAddress("¡Dirección no disponible para mostrar por el momento!");
      setAddressColor("orange");
    }
  };

  const sendData = () => {
    parentCallback(null);
  };

  const closeReport = () => {
    EditReport("EditReportScreen", 1);
  };

  const delayReport = () => {
    EditReport("EditReportScreen", 3);
  };

  return (
    <View style={styles.container}>
      <View style={styles.cardHeader}>
        <Text style={styles.headerText}>Reporte #{report.id}</Text>
      </View>

      <View style={styles.cardContent}>
        <View style={styles.mapContainer}>
          <MapComponent parentLocation={address} parentCallback={null} />
        </View>

        <View style={styles.textCardContainer}>
          <View style={styles.buttonsContainer}>
            <Text style={[styles.addressText, { color: addressColor }]}>
              {textAddress}
            </Text>
          </View>
        </View>

        <View style={styles.textCardContainer}>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => getPermissions(25) /*closeReport*/}
            >
              <FontAwesome5
                name="tools"
                size={HEIGHT * 0.018}
                color="rgba(0,158,227,1)"
              />
              <Text style={styles.actionButtonText}>Cerrar reporte</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => getPermissions(22) /*delayReport*/}
            >
              <FontAwesome5
                name="clock"
                size={HEIGHT * 0.018}
                color="#223995"
              />
              <Text style={[styles.actionButtonText, { color: "#223995" }]}>
                Dejar inconcluso
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <TouchableOpacity style={styles.goBackButton} onPress={sendData}>
          <Text style={styles.buttonText}>Volver</Text>
        </TouchableOpacity>
      </View>
      <Modal isVisible={error !== ""}>{modalPermissionDenied()}</Modal>
    </View>
  );
};

export default ModifyReport;

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
    alignItems: "flex-start",
    justifyContent: "space-between",
    backgroundColor: "white",
  },
  addressText: {
    fontSize: HEIGHT * 0.018,
    color: "black",
    textAlign: "center",
    fontWeight: "bold",
    marginHorizontal: WIDTH * 0.02,
  },
  actionButtonText: {
    fontSize: HEIGHT * 0.018,
    color: "rgba(0,158,227,1)",
    textAlign: "center",
    fontWeight: "bold",
    marginHorizontal: WIDTH * 0.008,
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
    color: "gray",
    fontWeight: "bold",
  },
  goBackButton: {
    backgroundColor: "transparent",
    width: "23%",
    height: HEIGHT * 0.037,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginRight: WIDTH * 0.02,
  },
  actionButton: {
    backgroundColor: "white",
    flexDirection: "row",
    width: "42%",
    height: "50%",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginRight: WIDTH * 0.02,
  },
  mapContainer: {
    flex: 1,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    ...StyleSheet.absoluteFillObject,
  },
  textCardContainer: {
    flexDirection: "row",
    alignSelf: "flex-end",
    width: "100%",
    height: "15%",
    alignItems: "center",
    justifyContent: "center",
    //backgroundColor: "#F8F9FB",
    backgroundColor: "transparent",
    padding: 5,
  },
  buttonsContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    width: "85%",
    height: "96%",
    backgroundColor: "white",
    borderRadius: 15,
    marginHorizontal: WIDTH * 0.004,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.46,
    shadowRadius: 11.14,
    elevation: 17,
  },
  modalContent: {
    justifyContent: "flex-end",
    alignItems: "center",
    borderColor: "rgba(0, 0, 0, 0.1)",
    width: "100%",
    height: HEIGHT * 0.25,
    backgroundColor: "white",
    borderRadius: 15,
    paddingTop: HEIGHT * 0.015,
  },
  modalText: {
    fontSize: HEIGHT * 0.023,
    alignSelf: "center",
    fontWeight: "bold",
    marginHorizontal: WIDTH * 0.05,
    marginBottom: HEIGHT * 0.025,
  },
  modalFooter: {
    width: "100%",
    height: "35%",
    alignItems: "stretch",
    alignSelf: "flex-end",
    backgroundColor: "#E5E7E9",
    justifyContent: "flex-end",
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    width: WIDTH * 0.25,
    height: HEIGHT * 0.048,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: WIDTH * 0.01,
  },
});
