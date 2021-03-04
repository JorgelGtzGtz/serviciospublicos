import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  Vibration,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import Base64 from "../components/Base64";

const { width: WIDTH, height: HEIGHT } = Dimensions.get("screen");

const ForgotPasswordCard = ({ parentCallback, url }) => {
  const [borderColor, setBorderColor] = useState("#000");
  let [valid, setValid] = useState(false);
  let [loading, setLoading] = useState(false);
  let [errorMessage, setErrorMessage] = useState(
    "el correo ingresado es invalido"
  );
  const PATTERN = [1 * 100, 1 * 200, 1 * 10, 1 * 200];

  const sendData = () => {
    parentCallback(1);
  };

  const sendUser = (value, user) => {
    parentCallback(value, user);
  };

  const [email, setEmail] = useState("");

  let sendEmail = () => {
    if (!loading) verifyEmailAvailability();
  };

  let verifyEmailAvailability = () => {
    setLoading(true);
    fetch(url + "/api/Usuario/GetUsuarioByEmail?correoUsuario=" + email, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization:
          "Basic " + Base64.btoa("incognito" + ":" + Base64.btoa("incognito")),
      },
    })
      .then(async (response) => {
        let data = await response.json();
        if (response.status === 200) {
          if (
            data === null ||
            (data !== null && (!data.Disponible || !data.Estatus_usuario))
          ) {
            setLoading(false);
            setErrorMessage(
              "El correo ingresado no pertenece a ninguna cuenta"
            );
            validateField("error");
          } else {
            data.Password_usuario = Base64.atob(data.Password_usuario);
            sendUser(4, data);
          }
        }
      })
      .catch((error) => {
        console.log("error", error);
        setLoading(false);
      });
  };

  let validateEmail = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  let validateField = (emailAddress) => {
    if (!validateEmail(emailAddress)) {
      setBorderColor("red");
      setValid(false);
      Vibration.vibrate(PATTERN);
    } else {
      setBorderColor("#000");
      setValid(true);
    }
  };

  let loadingCircle = (
    <ActivityIndicator size="small" color="white" animating={loading} />
  );

  return (
    <View style={styles.container}>
      <View style={styles.cardHeader}>
        <Text style={styles.headerText}>Recuperar contraseña</Text>
      </View>

      <View style={styles.cardContent}>
        <AntDesign name="mail" size={WIDTH * 0.2} color="black" />

        <Text style={styles.elementText}>Correo electrónico</Text>
        <TextInput
          style={[styles.textInput, { borderColor: borderColor }]}
          onChangeText={(text) => setEmail(text)}
          value={email}
          onFocus={() => {
            setBorderColor("rgba(0,158,227,1)");
            setErrorMessage("El correo ingresado es invalido");
          }}
          onBlur={() => validateField(email)}
        />
        {borderColor === "red" ? (
          <Text style={styles.errorMsg}>{errorMessage}</Text>
        ) : null}
        <Text style={styles.instructionText}>
          Porfavor ingresa el correo asociado a tu cuenta para recuperar tu
          contraseña
        </Text>
      </View>

      <View style={styles.cardFooter}>
        {!loading ? (
          <TouchableOpacity
            style={[
              styles.nextButton,
              { backgroundColor: "transparent", height: HEIGHT * 0.037 },
            ]}
            onPress={sendData}
          >
            <Text
              style={[styles.buttonText, { color: "gray", fontWeight: "bold" }]}
            >
              Cancelar
            </Text>
          </TouchableOpacity>
        ) : null}
        {valid ? (
          <TouchableOpacity style={styles.nextButton} onPress={sendEmail}>
            {loading ? (
              loadingCircle
            ) : (
              <Text style={styles.buttonText}>Enviar</Text>
            )}
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

export default ForgotPasswordCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
    justifyContent: "center",
    width: "100%",
    borderRadius: 10,
  },
  cardHeader: {
    flex: 3,
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
    alignSelf: "flex-start",
    marginRight: WIDTH * 0.29,
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
    fontSize: HEIGHT * 0.024,
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
    width: "100%",
    height: HEIGHT * 0.043,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    fontSize: HEIGHT * 0.018,
    paddingLeft: WIDTH * 0.015,
    alignSelf: "flex-start",
  },
  errorMsg: {
    fontSize: HEIGHT * 0.016,
    color: "red",
    alignSelf: "flex-start",
  },
  instructionText: {
    fontSize: HEIGHT * 0.02,
    color: "black",
    marginBottom: HEIGHT * 0.01,
    textAlign: "center",
    marginTop: HEIGHT * 0.01,
  },
});
