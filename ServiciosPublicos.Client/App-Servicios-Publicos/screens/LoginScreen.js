import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import LoginCard from "../components/LoginCard";
import RegisterCard from "../components/RegisterCard";
import ForgotPasswordCard from "../components/ForgotPasswordCard";
import OTPVerificationCard from "../components/OTPVerificationCard";
import CityImages from "../components/CityImages";
import NewPassword from "../components/NewPassword";
import Modal from "react-native-modal";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Permissions from "expo-permissions";
import Base64 from "../components/Base64";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome } from "@expo/vector-icons";

const { width: WIDTH, height: HEIGHT } = Dimensions.get("screen");

const LoginScreen = ({ navigation }) => {
  const [screen, setScreen] = useState(1);
  const [createdUser, setCreatedUser] = useState({});
  const [changingPassword, setChangingPassword] = useState(false);
  let [loading, setLoading] = useState(false);
  let [loginLoading, setLoginLoading] = useState(false);
  const [visibleModal, setVisibleModal] = useState(null);
  const [error, setError] = useState("");
  let url = "http://4a777a5d5af0.ngrok.io";

  let isNumeric = (n) => {
    return !isNaN(parseFloat(n)) && isFinite(n);
  };

  let isLocationEnabled = async () => {
    const { granted } = await Permissions.askAsync(Permissions.LOCATION);
    if (!granted) {
      console.log("dame permisos");
    }
  };

  const storePermissions = async (value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem("@procesoP", Base64.btoa(jsonValue));
    } catch (e) {
      // saving error
    }
  };

  let removePermissions = async () => {
    try {
      await AsyncStorage.removeItem("@procesoP");
    } catch (e) {
      // remove error
    }
    console.log("Done.");
  };

  useEffect(() => {
    isLocationEnabled();
    console.log("encriptada " + Base64.btoa("nuevo123"));
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      removePermissions();
      setScreen(1);
      setChangingPassword(false);
      setLoading(false);
      setVisibleModal(null);
      setCreatedUser({});
      setLoginLoading(false);
      console.log("Logged off");
    });
    return unsubscribe;
  }, [navigation]);

  let _renderButton = (text, color, onPress, textColor, textWeight) => (
    <TouchableOpacity onPress={onPress}>
      <View style={[styles.button, { backgroundColor: color }]}>
        <Text
          style={[
            styles.buttonText,
            { fontWeight: textWeight, color: textColor },
          ]}
        >
          {text}
        </Text>
      </View>
    </TouchableOpacity>
  );

  let _renderModalContent = () =>
    loading ? (
      loadingCircle
    ) : (
      <View style={styles.modalContent}>
        <MaterialCommunityIcons
          name="incognito"
          size={HEIGHT * 0.05}
          color="black"
        />
        <Text style={[styles.modalText, { textAlign: "center" }]}>
          Si ingresas como incognito no podrás recibir actualizaciones ¿Deseas
          continuar?
        </Text>

        <View style={styles.modalFooter}>
          {_renderButton(
            "Rechazar",
            "transparent",
            () => {
              setVisibleModal(null);
            },
            "gray",
            "bold"
          )}
          {_renderButton(
            "Aceptar",
            "rgba(0,158,227,1)",
            () => {
              getIncognitoUser();
            },
            "white",
            "normal"
          )}
        </View>
      </View>
    );

  let modalPermissionDenied = () => (
    <View style={styles.modalContent}>
      <FontAwesome name="user-times" size={HEIGHT * 0.05} color="black" />
      <Text style={[styles.modalText, { textAlign: "center" }]}>{error}</Text>

      <View style={styles.modalFooter}>
        {_renderButton(
          "Aceptar",
          "rgba(0,158,227,1)",
          () => {
            setScreen(1);
            setChangingPassword(false);
            setLoading(false);
            setVisibleModal(null);
            setCreatedUser({});
            setError("");
          },
          "white",
          "normal"
        )}
      </View>
    </View>
  );

  let getIncognitoUser = () => {
    setLoading(true);
    fetch(url + "/api/Usuario/GetUsuarioByLogin?loginUsuario=incognito", {
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
        data.Password_usuario = Base64.atob(data.Password_usuario);
        if (response.status === 200) {
          if (data !== null) {
            getUserPermissions(data);
          }
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  let validateLoginPermission = (gottenPermissions, gottenUser) => {
    let allowed = false;
    gottenPermissions.forEach((perm) => {
      if (perm.ID_procesoPermisos === 2) allowed = true;
    });
    if (allowed) {
      storePermissions(gottenPermissions);
      setLoading(false);
      setVisibleModal(null);
      navigation.navigate("MainMenu", {
        user: gottenUser,
        url: url,
      });
    } else {
      setLoading(false);
      setVisibleModal(null);
      setError("Actualmente no cuentas con permiso para iniciar sesión");
      console.log("ACCESO DENEGADO");
    }
  };

  let validateReportCreation = (gottenPermissions, gottenUser) => {
    let allowed = false;
    gottenPermissions.forEach((perm) => {
      if (perm.ID_procesoPermisos === 20) allowed = true;
    });
    if (allowed) {
      storePermissions(gottenPermissions);
      setLoading(false);
      setVisibleModal(null);
      navigation.navigate("NewReportScreen", {
        usuario: gottenUser,
        url: url,
      });
    } else {
      setLoading(false);
      setVisibleModal(null);
      setError(
        "Actualmente no cuentas con permiso para crear un nuevo reporte"
      );
    }
  };

  let getUserPermissions = (user) => {
    fetch(url + "/api/Permisos/GetPermisos/" + user.ID_tipoUsuario, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization:
          "Basic " +
          Base64.btoa(
            user.Login_usuario + ":" + Base64.btoa(user.Password_usuario)
          ),
      },
    })
      .then(async (response) => {
        let data = await response.json();
        if (response.status === 200) {
          if (data !== null) {
            if (user.Login_usuario !== "incognito")
              validateLoginPermission(data, user);
            else {
              validateReportCreation(data, user);
              console.log("ENTRANDO INCOGNITO");
            }
          }
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const callbackFunction = (childData, value) => {
    if (!loginLoading) {
      if (isNumeric(childData)) {
        switch (childData) {
          case 1 || 2:
            setChangingPassword(false);
            break;
          case 3:
            setChangingPassword(true);
            break;
        }
        if (childData === 4) {
          setCreatedUser(value);
          setScreen(childData);
        } else if (childData === 6) {
          setVisibleModal(1);
        } else setScreen(childData);
      } else {
        if (childData === null) {
          setChangingPassword(false);
          setScreen(1);
        }
      }
    }
  };

  const signIn = (gottenUser) => {
    if (!loginLoading) {
      if (
        !gottenUser.Confirmado &&
        gottenUser.Disponible &&
        gottenUser.Estatus_usuario
      ) {
        setChangingPassword(false);
        setCreatedUser(gottenUser);
        setScreen(4);
      } else if (!gottenUser.Disponible) {
        //MENSAJE USUARIO ELIMINADO
      } else {
        if (changingPassword) {
          setCreatedUser(gottenUser);
          setChangingPassword(false);
          setScreen(5);
          console.log("intento de cambio");
        } else {
          /*navigation.navigate("MainMenu", {
            user: gottenUser,
            url: url,
          });*/
          setLoginLoading(true);
          getUserPermissions(gottenUser);
        }
      }
      /**/
    }
  };

  let loginCard = (
    <LoginCard
      parentCallback={callbackFunction}
      currentUser={signIn}
      url={url}
      loginLoad={loginLoading}
    />
  );
  let registerCard = (
    <RegisterCard
      parentCallback={callbackFunction}
      url={url}
      editableUser={null}
      isEditing={false}
    />
  );

  let forgotPasswordCard = (
    <ForgotPasswordCard parentCallback={callbackFunction} url={url} />
  );

  let otpVerificationCard = (
    <OTPVerificationCard
      parentCallback={callbackFunction}
      url={url}
      usuario={createdUser}
      currentUser={signIn}
    />
  );

  let newPassword = (
    <NewPassword
      parentCallback={callbackFunction}
      url={url}
      usuario={createdUser}
      access={signIn}
    />
  );

  let loadingCircle = (
    <View
      style={[
        styles.modalContent,
        { backgroundColor: "transparent", justifyContent: "center" },
      ]}
    >
      <ActivityIndicator
        size="large"
        color="rgba(0,158,227,1)"
        animating={loading}
      />
    </View>
  );

  return (
    <View style={styles.mainContainer}>
      <CityImages />

      <View style={styles.loginContainer}>
        {screen === 1
          ? loginCard
          : screen === 2
          ? registerCard
          : screen === 3
          ? forgotPasswordCard
          : screen === 5
          ? newPassword
          : otpVerificationCard}
      </View>

      <Text style={styles.bottomText}>Cd. Obregón, Sonora</Text>
      <Modal isVisible={visibleModal === 1}>{_renderModalContent()}</Modal>
      <Modal isVisible={error !== ""}>{modalPermissionDenied()}</Modal>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#E5E7E9",
    justifyContent: "center",
    alignItems: "stretch",
    width: "100%",
  },
  loginContainer: {
    flex: 2,
    backgroundColor: "#E5E7E9",
    marginTop: -(WIDTH * 0.03),
    alignItems: "center",
    borderRadius: 10,
    marginHorizontal: WIDTH * 0.03,
    //marginBottom: HEIGHT * 0.02,
    justifyContent: "center",
    resizeMode: "cover",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.46,
    shadowRadius: 11.14,
    elevation: 17,
  },
  bottomText: {
    textAlign: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginVertical: HEIGHT * 0.01,
    fontSize: HEIGHT * 0.015,
    color: "gray",
  },
  modalContent: {
    justifyContent: "flex-end",
    alignItems: "center",
    borderColor: "rgba(0, 0, 0, 0.1)",
    width: "100%",
    height: HEIGHT * 0.25,
    backgroundColor: "white",
    borderRadius: 15,
    paddingTop: HEIGHT * 0.035,
  },
  elementText: {
    fontSize: HEIGHT * 0.023,
    marginBottom: HEIGHT * 0.02,
    alignSelf: "center",
    fontWeight: "bold",
  },
  button: {
    width: WIDTH * 0.25,
    height: HEIGHT * 0.048,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: WIDTH * 0.01,
  },
  buttonText: {
    fontSize: HEIGHT * 0.02,
    alignSelf: "center",
    color: "white",
  },
  modalText: {
    fontSize: HEIGHT * 0.023,
    alignSelf: "center",
    fontWeight: "bold",
    marginHorizontal: WIDTH * 0.05,
    marginBottom: HEIGHT * 0.025,
  },
  modalFooter: {
    width: "100%",
    height: "35%",
    alignItems: "stretch",
    alignSelf: "flex-end",
    backgroundColor: "#E5E7E9",
    justifyContent: "flex-end",
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
