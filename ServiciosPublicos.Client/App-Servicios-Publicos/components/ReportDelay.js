import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const { width: WIDTH, height: HEIGHT } = Dimensions.get("screen");

const ReportDelay = ({ parentCallback }) => {
  const [borderColor, setBorderColor] = useState("#000");
  const [hours, setHours] = useState("0");

  const sendData = () => {
    parentCallback(11, parseInt(hours));
  };

  let isNumeric = (n) => {
    return !isNaN(parseFloat(n)) && isFinite(n);
  };

  let validateField = () => {
    if (!isNumeric(hours)) setBorderColor("red");
    else {
      if (parseFloat(hours) > 0) setBorderColor("#000");
      else setBorderColor("red");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.cardHeader}>
        <Text style={styles.headerText}>Dejar reporte inconcluso</Text>
      </View>

      <View style={styles.cardContent}>
        <MaterialCommunityIcons
          name="clock-outline"
          size={WIDTH * 0.2}
          color="black"
        />
        <Text style={styles.instructionText}>
          Ingresa las horas restantes estimadas para la finalización del reporte
        </Text>
        <Text style={styles.elementText}>Horas</Text>
        <TextInput
          style={[styles.textInput, { borderColor: borderColor }]}
          onChangeText={(text) => setHours(text)}
          value={hours}
          keyboardType="numeric"
          onFocus={() => setBorderColor("rgba(0,158,227,1)")}
          onBlur={() => validateField()}
        />
        {borderColor === "red" ? (
          <Text style={styles.errorMsg}>
            Las horas restantes deben ser mayores a 0
          </Text>
        ) : null}
      </View>

      <View style={styles.cardFooter}>
        {borderColor === "#000" ? (
          parseInt(hours) > 0 ? (
            <TouchableOpacity style={styles.nextButton} onPress={sendData}>
              <Text style={styles.buttonText}>Aceptar</Text>
            </TouchableOpacity>
          ) : null
        ) : null}
      </View>
    </View>
  );
};

export default ReportDelay;

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
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    paddingHorizontal: WIDTH * 0.02,
    paddingVertical: HEIGHT * 0.03,
  },
  elementText: {
    fontSize: HEIGHT * 0.019,
    fontWeight: "bold",
    alignSelf: "center",
    marginTop: WIDTH * 0.014,
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
    fontSize: HEIGHT * 0.021,
    fontWeight: "bold",
  },
  buttonText: {
    fontSize: HEIGHT * 0.02,
    alignSelf: "center",
    color: "white",
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
  textInput: {
    borderWidth: 0.5,
    borderColor: "gray",
    backgroundColor: "transparent",
    width: "15%",
    height: HEIGHT * 0.043,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    fontSize: HEIGHT * 0.018,
    paddingLeft: WIDTH * 0.015,
    alignSelf: "center",
  },
  errorMsg: {
    fontSize: HEIGHT * 0.016,
    color: "red",
    alignSelf: "center",
  },
  instructionText: {
    fontSize: HEIGHT * 0.024,
    color: "black",
    marginBottom: HEIGHT * 0.01,
    textAlign: "center",
    marginTop: HEIGHT * 0.01,
    marginHorizontal: WIDTH * 0.09,
    fontWeight: "bold",
  },
});
