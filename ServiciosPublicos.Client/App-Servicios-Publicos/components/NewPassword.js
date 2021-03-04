import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from "react-native";
import Base64 from "../components/Base64";

const { width: WIDTH, height: HEIGHT } = Dimensions.get("screen");

const NewPassword = ({ parentCallback, usuario, url, access }) => {
  let [loading, setLoading] = useState(false);
  let [password, setPassword] = useState("");
  let [confirmPassword, setConfirmPassword] = useState("");

  let [border, setBorder] = useState({
    passwordColor: "#000",
    confirmPasswordColor: "#000",
  });

  let changeBorder = (field, color) => {
    switch (field) {
      case 1:
        setBorder({ ...border, passwordColor: color });
        break;
      case 2:
        setBorder({ ...border, confirmPasswordColor: color });
        break;
    }
    //setBorder({ nameColor: color });
  };

  let [errorMsg, setErrorMsg] = useState({
    passwordError: "",
    confirmPasswordError: "",
  });

  const sendUser = (user) => {
    access(user);
  };

  const cancel = () => {
    parentCallback(null);
  };

  let validatePassword = (pass) => {
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)([A-Za-z\d]|[^ ]){8}$/;
    return re.test(String(pass));
  };

  changeUserPassword = () => {
    setLoading(true);
    fetch(url + "/api/Usuario/Actualizar", {
      method: "PUT",
      headers: {
        Authorization:
          "Basic " +
          Base64.btoa(
            usuario.Login_usuario + ":" + Base64.btoa(usuario.Password_usuario)
          ),
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ID_usuario: usuario.ID_usuario,
        Correo_usuario: usuario.Correo_usuario,
        Disponible: usuario.Disponible,
        Estatus_usuario: usuario.Estatus_usuario,
        Genero_usuario: usuario.Genero_usuario,
        ID_tipoUsuario: usuario.ID_tipoUsuario,
        Jefe_asignado: usuario.Jefe_asignado,
        Login_usuario: usuario.Login_usuario,
        Nombre_usuario: usuario.Nombre_usuario,
        Password_usuario: Base64.btoa(password),
        Telefono_usuario: usuario.Telefono_usuario,
        Confirmado: true,
      }),
    })
      .then(async (response) => {
        let data = await response;
        if (response.status >= 200 && response.status < 300) {
          console.log("CONTRASEÑA CAMBIADA");
          usuario.Password_usuario = password;
          sendUser(usuario);
        } else {
          console.log("VALIDACION FALLIDA");
        }
      })
      .catch((error) => {
        console.log("ERROR VALIDACION", error);
      });
  };

  let validateField = (field) => {
    switch (field) {
      case 1:
        if (password === "" || !validatePassword(password)) {
          changeBorder(field, "red");
          setErrorMsg({
            ...errorMsg,
            passwordError:
              "Letra mayúscula, número y 8 caracteres al menos son requeridos",
          });
          setPassword("");
        } else {
          changeBorder(field, "#000");
        }
        break;
      case 2:
        if (confirmPassword === "" || confirmPassword !== password) {
          changeBorder(field, "red");
          setErrorMsg({
            ...errorMsg,
            confirmPasswordError: "Las contraseñas no coinciden",
          });
          setConfirmPassword("");
        } else {
          changeBorder(field, "#000");
        }
        break;
    }
  };

  let nextButton = (
    <TouchableOpacity
      style={styles.nextButton}
      onPress={() => changeUserPassword()}
    >
      <Text style={styles.buttonText}>Aceptar</Text>
    </TouchableOpacity>
  );

  let cancelButton = (
    <TouchableOpacity
      style={[
        styles.nextButton,
        { backgroundColor: "transparent", height: HEIGHT * 0.037 },
      ]}
      onPress={cancel}
    >
      <Text style={[styles.buttonText, { color: "gray", fontWeight: "bold" }]}>
        Cancelar
      </Text>
    </TouchableOpacity>
  );

  let loadingCircle = (
    <View style={styles.cardContent}>
      <ActivityIndicator
        size="large"
        color="rgba(0,158,227,1)"
        animating={loading}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.cardHeader}>
        <Text style={styles.headerText}>Cambiar contraseña</Text>
      </View>

      {loading ? (
        loadingCircle
      ) : (
        <View style={styles.cardContent}>
          <Text style={styles.elementText}>Nueva contraseña</Text>
          <TextInput
            style={[styles.textInput, { borderColor: border.passwordColor }]}
            onFocus={() => {
              changeBorder(1, "rgba(0,158,227,1)");
              setErrorMsg({ ...errorMsg, passwordError: "" });
            }}
            onBlur={() => validateField(1)}
            onChangeText={(text) => setPassword(text)}
            value={password}
            secureTextEntry={true}
            placeholder={errorMsg.passwordError}
            placeholderTextColor={"#EE7B7B"}
          />
          <Text style={styles.elementText}>Confirmar contraseña</Text>
          <TextInput
            style={[
              styles.textInput,
              { borderColor: border.confirmPasswordColor },
            ]}
            onFocus={() => {
              changeBorder(2, "rgba(0,158,227,1)");
              setErrorMsg({ ...errorMsg, confirmPasswordError: "" });
            }}
            onBlur={() => validateField(2)}
            onChangeText={(text) => setConfirmPassword(text)}
            value={confirmPassword}
            secureTextEntry={true}
            placeholder={errorMsg.confirmPasswordError}
            placeholderTextColor={"#EE7B7B"}
          />
        </View>
      )}

      <View style={styles.cardFooter}>
        {!loading ? cancelButton : null}
        {password !== "" && confirmPassword !== "" && !loading
          ? nextButton
          : null}
      </View>
    </View>
  );
};

export default NewPassword;

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
  elementText: {
    fontSize: HEIGHT * 0.022,
    fontWeight: "bold",
    alignSelf: "flex-start",
    marginLeft: WIDTH * 0.035,
    marginBottom: HEIGHT * 0.005,
  },
  picker: {
    height: HEIGHT * 0.08,
    width: WIDTH * 0.6,
    fontWeight: "bold",
  },
  pickerContainer: {
    borderWidth: 0.5,
    borderColor: "black",
    backgroundColor: "transparent",
    width: "65%",
    height: HEIGHT * 0.05,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: HEIGHT * 0.02,
  },
  textInput: {
    borderWidth: 0.5,
    borderColor: "black",
    backgroundColor: "transparent",
    width: "95%",
    height: HEIGHT * 0.05,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    fontSize: HEIGHT * 0.021,
    paddingLeft: WIDTH * 0.03,
    marginBottom: HEIGHT * 0.02,
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
  buttonText: {
    fontSize: HEIGHT * 0.02,
    alignSelf: "center",
    color: "white",
  },
});
