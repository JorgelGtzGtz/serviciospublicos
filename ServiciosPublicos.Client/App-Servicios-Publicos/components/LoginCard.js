import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  Vibration,
  ImageBackground,
} from "react-native";
import "react-native-gesture-handler";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import bgImage from "../assets/logo.png";
import Base64 from "../components/Base64";

const { width: WIDTH, height: HEIGHT } = Dimensions.get("screen");

const LoginCard = ({ parentCallback, currentUser, url, loginLoad }) => {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  let [loading, setLoading] = useState(false);
  let [errorMsg, setErrorMsg] = useState(false);
  let [border, setBorder] = useState({
    userNameColor: "gray",
    passwordColor: "gray",
  });
  const PATTERN = [1 * 100, 1 * 200, 1 * 10, 1 * 200];

  let changeBorder = (field, color) => {
    switch (field) {
      case 1:
        setBorder({ ...border, userNameColor: color });
        break;
      case 2:
        setBorder({ ...border, passwordColor: color });
        break;
    }
    //setBorder({ nameColor: color });
  };

  let userLogin = (usuario, password) => {
    let encriptada = Base64.btoa(password);
    fetch(url + "/api/Usuario/Login/", {
      method: "POST",
      headers: {
        Authorization: "Basic " + Base64.btoa(usuario + ":" + encriptada),
        "Content-Type": "application/json",
      },
    }).then(async (response) => {
      let data = await response.json();
      data.Password_usuario = Base64.atob(data.Password_usuario);
      if (
        response.status === 200 &&
        data.Login_usuario !== "incognito" &&
        data.Disponible
      ) {
        //USUARIO CORRECTO
        console.log(data);
        setUser("");
        setPassword("");
        currentUser(data);
        setLoading(false);
      } else {
        //USUARIO NO ENCONTRADO
        setLoading(false);
        setErrorMsg(true);
        Vibration.vibrate(PATTERN);
        setBorder({
          userNameColor: "red",
          passwordColor: "red",
        });
        console.log("no entraste");
      }
    });
  };

  const sendData = () => {
    if (!loading) parentCallback(2);
  };

  let loadingCircle = (
    <ActivityIndicator size="small" color="white" animating={loading} />
  );

  const sendData2 = () => {
    if (!loading) parentCallback(3);
  };

  const incognito = () => {
    if (!loading) parentCallback(6);
  };

  const signIn = () => {
    if (!loading) {
      setBorder({
        userNameColor: "gray",
        passwordColor: "gray",
      });
      setErrorMsg(false);
      setLoading(true);
      userLogin(user, password);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.cardHeader}>
        <ImageBackground
          source={bgImage}
          style={styles.headerImage}
          resizeMode="stretch"
        ></ImageBackground>
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.welcomeText}>¡Bienvenido!</Text>
        {errorMsg ? (
          <Text style={styles.errorText}>
            ¡El usuario y la contraseña no coinciden!
          </Text>
        ) : null}

        <Text style={styles.elementText}>Usuario</Text>
        <View
          style={[
            styles.textInputContainer,
            { borderColor: border.userNameColor },
          ]}
        >
          <View style={styles.iconContainer}>
            <FontAwesome5 name="user-alt" size={16} color="black" />
          </View>
          <TextInput
            style={styles.textInput}
            onChangeText={(text) => setUser(text)}
            value={user}
            onFocus={() => changeBorder(1, "rgba(0,158,227,1)")}
            onBlur={() => changeBorder(1, "gray")}
            autoCapitalize={"none"}
            maxLength={49}
          />
        </View>

        <Text style={styles.elementText}>Contraseña</Text>
        <View
          style={[
            styles.textInputContainer,
            { borderColor: border.passwordColor },
          ]}
        >
          <View style={styles.iconContainer}>
            <FontAwesome5 name="lock" size={16} color="black" />
          </View>
          <TextInput
            style={styles.textInput}
            secureTextEntry={true}
            onChangeText={(text) => setPassword(text)}
            value={password}
            onFocus={() => changeBorder(2, "rgba(0,158,227,1)")}
            onBlur={() => changeBorder(2, "gray")}
          />
        </View>

        <TouchableOpacity
          style={styles.forgotPasswordButton}
          onPress={sendData2}
        >
          <Text style={styles.SecondaryButtonText}>Olvidé mi contraseña*</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logInButton} onPress={signIn}>
          <LinearGradient
            colors={["#009EE3", "#0074A7"]}
            style={styles.logInButton}
          >
            {loading ? (
              loadingCircle
            ) : (
              <Text style={styles.buttonText}>Iniciar sesión</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <View style={styles.cardFooter}>
        <TouchableOpacity style={styles.incognitoButton} onPress={incognito}>
          <Text style={[styles.SecondaryButtonText, { color: "gray" }]}>
            Entrar como incógnito
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.registerButton} onPress={sendData}>
          <Text
            style={[
              styles.SecondaryButtonText,
              { color: "rgba(0, 158, 227, 1)" },
            ]}
          >
            Registrarse
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
    justifyContent: "center",
    width: "100%",
    borderRadius: 10,
  },
  headerImage: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    resizeMode: "cover",
    overflow: "hidden",
    width: "100%",
    height: "90%",
    opacity: 1,
  },
  cardHeader: {
    flex: 5,
    alignItems: "center",
    justifyContent: "space-evenly",
    flexDirection: "row",
    marginBottom: 2,
    backgroundColor: "#EEEEEE",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingHorizontal: 50,
  },
  cardContent: {
    flex: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    paddingHorizontal: WIDTH * 0.02,
  },
  cardFooter: {
    flex: 3,
    alignItems: "center",
    justifyContent: "space-evenly",
    flexDirection: "row",
    marginTop: 2,
    backgroundColor: "white",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  elementText: {
    fontSize: HEIGHT * 0.02,
    fontWeight: "bold",
    marginBottom: HEIGHT * 0.004,
    alignSelf: "flex-start",
  },
  titleText: {
    fontSize: HEIGHT * 0.032,
    fontWeight: "bold",
    marginBottom: HEIGHT * 0.01,
    textAlign: "center",
    color: "white",
  },
  welcomeText: {
    fontSize: HEIGHT * 0.026,
    fontWeight: "bold",
    textAlign: "center",
  },
  iconContainer: {
    width: "7%",
    height: HEIGHT * 0.05,
    justifyContent: "center",
    alignItems: "center",
    //alignSelf: "flex-start",
  },
  textInputContainer: {
    borderWidth: 0.5,
    borderColor: "gray",
    backgroundColor: "transparent",
    width: "100%",
    height: HEIGHT * 0.05,
    borderRadius: 5,
    alignItems: "stretch",
    justifyContent: "center",
    marginBottom: WIDTH * 0.02,
    alignSelf: "flex-start",
    flexDirection: "row",
  },
  textInput: {
    width: "93%",
    height: HEIGHT * 0.05,
    alignItems: "center",
    justifyContent: "center",
    fontSize: HEIGHT * 0.021,
  },
  forgotPasswordButton: {
    width: "55%",
    height: HEIGHT * 0.04,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: WIDTH * 0.04,
    alignSelf: "flex-start",
  },
  SecondaryButtonText: {
    fontSize: HEIGHT * 0.018,
    alignSelf: "flex-start",
    fontWeight: "bold",
    color: "red",
  },
  logInButton: {
    width: "100%",
    height: HEIGHT * 0.05,
    backgroundColor: "rgba(0, 158, 227, 1)",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
  },
  buttonText: {
    fontSize: HEIGHT * 0.021,
    alignSelf: "center",
    color: "white",
  },
  errorText: {
    fontSize: HEIGHT * 0.016,
    textAlign: "center",
    color: "red",
  },
  incognitoButton: {
    width: "48%",
    height: HEIGHT * 0.04,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  registerButton: {
    width: "27%",
    height: HEIGHT * 0.04,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
});
