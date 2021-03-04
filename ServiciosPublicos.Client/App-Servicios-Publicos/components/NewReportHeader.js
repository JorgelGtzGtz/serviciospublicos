import React from "react";
import { StyleSheet, View, Text, SafeAreaView, Dimensions } from "react-native";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const { width: WIDTH, height: HEIGHT } = Dimensions.get("screen");

const NewReportHeader = ({ parentCallback, screen }) => {
  const sendData = () => {
    parentCallback();
  };

  return (
    <LinearGradient
      colors={["#009EE3", "#0074A7", "#004360"]}
      style={styles.container}
    >
      <Feather
        name="arrow-left-circle"
        size={HEIGHT * 0.046}
        color={screen !== 5 && screen !== 9 ? "white" : "transparent"}
        style={{ alignSelf: "flex-start", marginLeft: WIDTH * 0.02 }}
        onPress={() => sendData()}
      />
      <Text style={styles.titleText}>Nuevo reporte</Text>
      <Text style={styles.welcomeText}>Completa los siguientes pasos</Text>
    </LinearGradient>
  );
};

export default NewReportHeader;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  welcomeText: {
    alignItems: "center",
    justifyContent: "center",
    fontSize: HEIGHT * 0.027,
    color: "white",
  },
  titleText: {
    alignItems: "center",
    justifyContent: "center",
    fontSize: HEIGHT * 0.035,
    fontWeight: "bold",
    color: "white",
  },
});
