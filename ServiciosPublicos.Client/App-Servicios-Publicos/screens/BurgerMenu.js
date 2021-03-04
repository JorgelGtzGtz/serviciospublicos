import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  BackHandler,
  TouchableOpacity,
} from "react-native";
import Modal from "react-native-modal";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import RegisterCard from "../components/RegisterCard";
import { FontAwesome5 } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Base64 from "../components/Base64";

const { width: WIDTH, height: HEIGHT } = Dimensions.get("screen");

const BurgerMenu = ({ route, navigation }) => {
  const { user, url } = route.params;
  const [visibleModal, setVisibleModal] = useState(null);
  const [visibleModal2, setVisibleModal2] = useState(null);
  const [visibleModal3, setVisibleModal3] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);

  let _renderButton = (text, color, onPress, textColor, textWeight) => (
    <TouchableOpacity onPress={onPress}>
      <View style={[styles.modalButton, { backgroundColor: color }]}>
        <Text
          style={[
            styles.modalButtonText,
            { fontWeight: textWeight, color: textColor },
          ]}
        >
          {text}
        </Text>
      </View>
    </TouchableOpacity>
  );

  let _renderModalContent = () => (
    <View style={styles.modalContent}>
      <MaterialCommunityIcons
        name="logout-variant"
        size={HEIGHT * 0.05}
        color="black"
      />
      <Text style={[styles.modalText, { textAlign: "center" }]}>
        ¿Estas seguro que deseas cerrar la sesión actual?
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
            navigation.navigate("LoginScreen");
          },
          "white",
          "normal"
        )}
      </View>
    </View>
  );

  let userChangedModal = () => (
    <View style={styles.modalContent}>
      <FontAwesome5 name="user-check" size={24} color="black" />
      <Text style={[styles.modalText, { textAlign: "center" }]}>
        Usuario actualizado exitosamente
      </Text>

      <View style={styles.modalFooter}>
        {_renderButton(
          "Aceptar",
          "rgba(0,158,227,1)",
          () => {
            setVisibleModal2(null);
            navigation.navigate("MainMenu", {
              user: editedUser,
              url: url,
            });
          },
          "white",
          "normal"
        )}
      </View>
    </View>
  );

  let permissionDeniedModal = () => (
    <View style={styles.modalContent}>
      <FontAwesome5 name="user-shield" size={24} color="black" />
      <Text style={[styles.modalText, { textAlign: "center" }]}>
        Actualmente no cuentas con permiso para editar tu usuario
      </Text>

      <View style={styles.modalFooter}>
        {_renderButton(
          "Aceptar",
          "rgba(0,158,227,1)",
          () => {
            setVisibleModal3(null);
          },
          "white",
          "normal"
        )}
      </View>
    </View>
  );

  const getPermissions = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("@procesoP");
      if (jsonValue != null) {
        validateUserModification(JSON.parse(Base64.atob(jsonValue)));
      } else console.log(jsonValue);
    } catch (e) {
      // error reading value
    }
  };

  let validateUserModification = (gottenPermissions) => {
    let allowed = false;
    gottenPermissions.forEach((perm) => {
      if (perm.ID_procesoPermisos === 9) allowed = true;
    });
    if (allowed) {
      setEditing(true);
    } else {
      setVisibleModal3(1);
    }
  };

  const callbackFunction = (childData, user) => {
    if (childData === null) setEditing(false);
    else {
      setEditedUser(user);
      setVisibleModal2(1);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons
            name="close-circle-outline"
            size={HEIGHT * 0.044}
            color="black"
          />
        </TouchableOpacity>
        <FontAwesome name="user-circle-o" size={HEIGHT * 0.1} color="black" />
        <Text style={styles.titleText}>{user.Nombre_usuario}</Text>
        <Text style={styles.typeText}>
          {user.ID_tipoUsuario !== 2 ? "Público" : "Jefe de cuadrilla"}
        </Text>
        <View style={[styles.separator, { marginTop: HEIGHT * 0 }]}></View>
      </View>

      {!editing ? (
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.goBack()}
          >
            <MaterialCommunityIcons
              name="clipboard-text-outline"
              size={HEIGHT * 0.03}
              color="rgba(0,158,227,1)"
            />
            <Text style={[styles.buttonText, { color: "rgba(0,158,227,1)" }]}>
              Mis reportes
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={getPermissions}>
            <FontAwesome5
              name="user-edit"
              size={HEIGHT * 0.02}
              color="#335CDC"
            />
            <Text style={[styles.buttonText, { color: "#335CDC" }]}>
              Editar usuario
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { marginTop: HEIGHT * 0.3 }]}
            onPress={() => setVisibleModal(1)}
          >
            <MaterialCommunityIcons
              name="logout-variant"
              size={HEIGHT * 0.03}
              color="gray"
            />
            <Text style={[styles.buttonText, { color: "gray" }]}>
              Cerrar sesión
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {editing ? (
        <View style={styles.editCard}>
          <RegisterCard
            parentCallback={callbackFunction}
            url={url}
            editableUser={user}
            isEditing={true}
          />
        </View>
      ) : (
        <View style={styles.footer}>
          <View style={styles.separator}></View>
          <Text style={styles.versionText}>Versión 1.0.0</Text>
        </View>
      )}

      <Modal isVisible={visibleModal === 1}>{_renderModalContent()}</Modal>
      <Modal isVisible={visibleModal2 === 1}>{userChangedModal()}</Modal>
      <Modal isVisible={visibleModal3 === 1}>{permissionDeniedModal()}</Modal>
    </View>
  );
};

export default BurgerMenu;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "stretch",
    justifyContent: "center",
    width: "100%",
  },
  headerBar: {
    flex: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    flex: 4,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: HEIGHT * 0.03,
  },
  footer: {
    flex: 1,
    alignItems: "stretch",
    justifyContent: "center",
    width: "100%",
  },
  editCard: {
    flex: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  typeText: {
    alignItems: "center",
    justifyContent: "center",
    fontSize: HEIGHT * 0.019,
    color: "#000",
    marginBottom: HEIGHT * 0.01,
  },
  closeButton: {
    backgroundColor: "transparent",
    width: "11%",
    height: "20%",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-end",
    marginRight: WIDTH * 0.02,
    marginTop: HEIGHT * 0.03,
  },
  separator: {
    backgroundColor: "gray",
    width: "90%",
    height: 1,
  },
  titleText: {
    alignItems: "center",
    justifyContent: "center",
    fontSize: HEIGHT * 0.035,
    fontWeight: "bold",
    color: "#000",
  },
  versionText: {
    textAlign: "center",
    fontSize: HEIGHT * 0.018,
  },
  button: {
    backgroundColor: "transparent",
    width: "45%",
    height: HEIGHT * 0.05,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    alignSelf: "flex-start",
    borderRadius: 10,
    marginVertical: 5,
  },
  buttonText: {
    textAlign: "center",
    fontSize: HEIGHT * 0.023,
    fontWeight: "bold",
  },
  modalContent: {
    justifyContent: "flex-end",
    alignItems: "center",
    borderColor: "rgba(0, 0, 0, 0.1)",
    width: "100%",
    height: HEIGHT * 0.25,
    backgroundColor: "white",
    borderRadius: 15,
    paddingTop: HEIGHT * 0.015,
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
  modalButton: {
    width: WIDTH * 0.25,
    height: HEIGHT * 0.048,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: WIDTH * 0.01,
  },
  modalButtonText: {
    fontSize: HEIGHT * 0.02,
    alignSelf: "center",
    color: "white",
  },
});
