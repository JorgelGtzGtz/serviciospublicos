import React, { useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Vibration,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const { width: WIDTH, height: HEIGHT } = Dimensions.get("screen");

const NewReportFinished = ({
  parentCallback,
  title,
  MessageHeader,
  Message,
  success,
}) => {
  const sendData = () => {
    parentCallback(10);
  };

  const ERROR_PATTERN = [1 * 100, 1 * 200, 1 * 10, 1 * 200];
  const PATTERN = [1 * 100, 1 * 200, 1 * 10];

  useEffect(() => {
    Vibration.vibrate(success ? PATTERN : ERROR_PATTERN);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.cardHeader}>
        <Text style={styles.headerText}>{title}</Text>
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.elementText}>{MessageHeader}</Text>

        <MaterialCommunityIcons
          name={success ? "clipboard-check-outline" : "clipboard-alert-outline"}
          size={120}
          color="black"
        />
        <Text style={styles.elementText}>{Message}</Text>
      </View>

      <View style={styles.cardFooter}>
        <TouchableOpacity style={styles.nextButton} onPress={sendData}>
          <Text style={styles.buttonText}>Salir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default NewReportFinished;

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
  },
  elementText: {
    fontSize: HEIGHT * 0.027,
    fontWeight: "bold",
    marginBottom: HEIGHT * 0.02,
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
