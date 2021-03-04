import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { RadioButton } from "react-native-paper";

const { width: WIDTH, height: HEIGHT } = Dimensions.get("screen");

const NewReportNotification = ({ parentCallback }) => {
  const [sendSms, setSms] = useState(true);
  const [sendEmail, setEmail] = useState(false);
  const sendData = () => {
    parentCallback(5, sendSms, sendEmail);
  };

  const [checked, setChecked] = useState("first");

  return (
    <View style={styles.container}>
      <View style={styles.cardHeader}>
        <Text style={styles.headerText}>Aviso del reporte</Text>
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.elementText}>Desea que le llegue aviso vía:</Text>
        <View style={styles.optionContent}>
          <RadioButton
            value="first"
            status={checked === "first" ? "checked" : "unchecked"}
            onPress={() => {
              setChecked("first");
              setSms(true);
              setEmail(false);
            }}
            color="rgba(0,158,227,1)"
          />
          <Text style={styles.instructionText}>Mensaje SMS</Text>
        </View>
        <View style={styles.optionContent}>
          <RadioButton
            value="second"
            status={checked === "second" ? "checked" : "unchecked"}
            onPress={() => {
              setChecked("second");
              setSms(false);
              setEmail(true);
            }}
            color="rgba(0,158,227,1)"
          />
          <Text style={styles.instructionText}>Correo electrónico</Text>
        </View>
        <View style={styles.optionContent}>
          <RadioButton
            value="third"
            status={checked === "third" ? "checked" : "unchecked"}
            onPress={() => {
              setChecked("third");
              setSms(true);
              setEmail(true);
            }}
            color="rgba(0,158,227,1)"
          />
          <Text style={styles.instructionText}>Ambos</Text>
        </View>
        <View style={styles.optionContent}>
          <RadioButton
            value="fourth"
            status={checked === "fourth" ? "checked" : "unchecked"}
            onPress={() => {
              setChecked("fourth");
              setSms(false);
              setEmail(false);
            }}
            color="rgba(0,158,227,1)"
          />
          <Text style={styles.instructionText}>No deseo aviso</Text>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <TouchableOpacity style={styles.nextButton} onPress={sendData}>
          <Text style={styles.buttonText}>Siguiente</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default NewReportNotification;

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
  optionContent: {
    height: "10%",
    width: "90%",
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "row",
    paddingLeft: WIDTH * 0.17,
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
  instructionText: {
    fontSize: HEIGHT * 0.021,
    alignSelf: "center",
    color: "black",
    marginVertical: HEIGHT * 0.02,
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
