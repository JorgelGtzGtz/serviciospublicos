import React from "react";
import { StyleSheet, View, Text, Dimensions } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const { width: WIDTH, height: HEIGHT } = Dimensions.get("screen");
let date = new Date().getDate();
let month = new Date().getMonth() + 1;
let year = new Date().getFullYear();
let monthName = () => {
  switch (month) {
    case 1:
      return "Enero";
    case 2:
      return "Febrero";
    case 3:
      return "Marzo";
    case 4:
      return "Abril";
    case 5:
      return "Mayo";
    case 6:
      return "Junio";
    case 7:
      return "Julio";
    case 8:
      return "Agosto";
    case 9:
      return "Septiembre";
    case 10:
      return "Octubre";
    case 11:
      return "Noviembre";
    case 12:
      return "Diciembre";
    default:
      return "";
  }
};

const CurrentDate = () => {
  return (
    <View style={styles.container}>
      <MaterialIcons name="date-range" size={HEIGHT * 0.028} color="black" />
      <Text style={styles.dateText}>
        Día {date < 10 ? 0 : null}
        {date} de {monthName()} de {year}
      </Text>
    </View>
  );
};

export default CurrentDate;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    flexDirection: "row",
    backgroundColor: "#fff",
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
  dateText: {
    fontSize: HEIGHT * 0.022,
    fontWeight: "bold",
  },
});
