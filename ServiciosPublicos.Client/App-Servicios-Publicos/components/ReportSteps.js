import React, { useState } from "react";
import { StyleSheet, View, Text, Dimensions } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";

const { width: WIDTH, height: HEIGHT } = Dimensions.get("screen");

const ReportSteps = ({ currentScreen }) => {
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons
        name="numeric-1-circle-outline"
        size={WIDTH * 0.07}
        color={currentScreen >= 1 ? "blue" : "#000"}
      />
      <FontAwesome
        name="long-arrow-right"
        size={WIDTH * 0.06}
        color={currentScreen > 1 ? "blue" : "#000"}
      />
      <MaterialCommunityIcons
        name="numeric-2-circle-outline"
        size={WIDTH * 0.07}
        color={currentScreen >= 2 ? "blue" : "#000"}
      />
      <FontAwesome
        name="long-arrow-right"
        size={WIDTH * 0.06}
        color={currentScreen > 2 ? "blue" : "#000"}
      />
      <MaterialCommunityIcons
        name="numeric-3-circle-outline"
        size={WIDTH * 0.07}
        color={currentScreen >= 3 ? "blue" : "#000"}
      />
      <FontAwesome
        name="long-arrow-right"
        size={WIDTH * 0.06}
        color={currentScreen > 3 ? "blue" : "#000"}
      />
      <MaterialCommunityIcons
        name="numeric-4-circle-outline"
        size={WIDTH * 0.07}
        color={currentScreen >= 4 ? "blue" : "#000"}
      />
      <FontAwesome
        name="long-arrow-right"
        size={WIDTH * 0.06}
        color={currentScreen === 5 ? "blue" : "#000"}
      />
      <MaterialCommunityIcons
        name="check-circle-outline"
        size={WIDTH * 0.07}
        color={currentScreen === 5 ? "#28BF07" : "#000"}
      />
    </View>
  );
};

export default ReportSteps;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-evenly",
    width: "100%",
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.46,
    shadowRadius: 11.14,
    elevation: 17,
  },
});
