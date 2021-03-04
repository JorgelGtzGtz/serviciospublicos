import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, View, ImageBackground } from "react-native";
import bgImage from "../assets/palacio.jpg";

const CityImages = () => {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={bgImage}
        style={styles.cityImages}
        resizeMode="stretch"
      >
        <StatusBar style="auto" />
      </ImageBackground>
      <StatusBar style="auto" />
    </View>
  );
};

export default CityImages;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "stretch",
    justifyContent: "center",
  },
  cityImages: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    resizeMode: "cover",
    overflow: "hidden",
    width: "100%",
    height: "100%",
    opacity: 1,
  },
});
