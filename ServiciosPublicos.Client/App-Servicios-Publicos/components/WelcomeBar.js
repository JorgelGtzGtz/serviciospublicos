import React from "react";
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const { width: WIDTH, height: HEIGHT } = Dimensions.get("screen");

const WelcomeBar = ({ user, parentCallBack }) => {
  let firstName = (name) => {
    let str = name.split(" ");
    return str[0];
  };

  let toTitleCase = (str) => {
    return str.replace(/\w\S*/g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };

  let burgerEvent = () => {
    parentCallBack();
  };

  return (
    <LinearGradient
      colors={["#009EE3", "#0074A7", "#004360"]}
      style={styles.container}
    >
      <TouchableOpacity style={styles.burgerButton} onPress={burgerEvent}>
        <Entypo name="menu" size={HEIGHT * 0.046} color="white" />
      </TouchableOpacity>

      <Text style={styles.welcomeText}>
        ¡Hola, {toTitleCase(firstName(user.Nombre_usuario))}!
      </Text>
      <Text style={styles.titleText}>
        Bienvenid{user.Genero_usuario === "M" ? "o" : "a"}
      </Text>
    </LinearGradient>
  );
};

export default WelcomeBar;

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
    fontSize: HEIGHT * 0.03,
    color: "white",
  },
  titleText: {
    alignItems: "center",
    justifyContent: "center",
    fontSize: HEIGHT * 0.035,
    fontWeight: "bold",
    color: "white",
  },
  burgerButton: {
    backgroundColor: "transparent",
    width: "10%",
    height: "17%",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
    marginLeft: WIDTH * 0.02,
  },
});
