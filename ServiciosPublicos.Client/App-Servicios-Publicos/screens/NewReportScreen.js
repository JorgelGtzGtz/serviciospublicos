import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  BackHandler,
} from "react-native";
import NewReportHeader from "../components/NewReportHeader";
import NewReportType from "../components/NewReportType";
import NewReportLocation from "../components/NewReportLocation";
import NewReportImages from "../components/NewReportImages";
import NewReportNotification from "../components/NewReportNotification";
import NewReportFinished from "../components/NewReportFinished";
import RegisterCard from "../components/RegisterCard";
import ReportSteps from "../components/ReportSteps";
import Modal from "react-native-modal";
import OTPVerificationCard from "../components/OTPVerificationCard";
import { Foundation } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import Base64 from "../components/Base64";

const { width: WIDTH, height: HEIGHT } = Dimensions.get("screen");

const NewReportScreen = ({ route, navigation }) => {
  const { usuario, url } = route.params;
  const [screen, setScreen] = useState(1);
  const [visibleModal, setVisibleModal] = useState(null);
  const [reportModalVisible, setReportModalVisible] = useState(null);
  const [type, setType] = useState(1);
  const [location, setLocation] = useState({});
  const [observations, setObservations] = useState("");
  const [images, setImages] = useState([]);
  const [user, setUser] = useState(usuario);
  const [idTicket, setIdTicket] = useState(0);
  let [address, setAddress] = useState({
    street: "",
    street_1: "",
    street_2: "",
    references: "",
    neighborhood: "",
  });
  const [sendSms, setSms] = useState(false);
  const [sendEmail, setEmail] = useState(false);
  const [submittingInfo, setSubmittingInfo] = useState(false);
  const [successMsg, setSuccessMsg] = useState(
    "Reporte #" + idTicket + " creado con éxito"
  );

  const callbackHeader = () => {
    if (screen > 1) {
      if (screen === 6) setScreen(3);
      else {
        if (screen !== 5 && screen !== 9) setScreen(screen - 1);
      }
    } else if (screen === 1) {
      if (user.Login_usuario.trim() === "incognito")
        navigation.navigate("LoginScreen");
      else
        navigation.navigate("MainMenu", {
          user: user,
          url: url,
        });
    }
    return true;
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setScreen(1);
      setVisibleModal(null);
      setReportModalVisible(null);
      setType(1);
      setLocation({});
      setObservations("");
      setImages([]);
      setUser(usuario);
      setAddress({
        street: "",
        street_1: "",
        street_2: "",
        references: "",
        neighborhood: "",
      });
      setSms(false);
      setEmail(false);
      setSubmittingInfo(false);
      setSuccessMsg("Reporte #" + idTicket + " creado con éxito");
      setIdTicket(0);
      console.log("Refreshed");
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", callbackHeader);
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", callbackHeader);
    };
  }, [callbackHeader]);

  let _renderButton = (text, color, onPress, textColor, textWeight) => (
    <TouchableOpacity onPress={onPress}>
      <View
        style={[styles.button, { backgroundColor: color, marginBottom: 0 }]}
      >
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

  let _renderModalContent = () => (
    <View style={styles.modalContent}>
      <FontAwesome name="user-secret" size={HEIGHT * 0.04} color="black" />
      <Text style={[styles.modalText, { textAlign: "center" }]}>
        ¿Desea registrarse para recibir actualizaciones de este reporte?
      </Text>

      <View style={styles.modalButtons}>
        {_renderButton(
          "Rechazar",
          "transparent",
          () => {
            setReportModalVisible(1);
            setVisibleModal(null);
          },
          "gray",
          "bold"
        )}
        {_renderButton(
          "Aceptar",
          "rgba(0,158,227,1)",
          () => {
            setScreen(6);
            setVisibleModal(null);
          },
          "white",
          "normal"
        )}
      </View>
    </View>
  );

  let reportConfirmationModal = () =>
    submittingInfo ? (
      loadingCircle
    ) : (
      <View style={styles.modalContent}>
        <Foundation
          name="clipboard-pencil"
          size={HEIGHT * 0.04}
          color="black"
        />
        <Text style={[styles.modalText, { textAlign: "center" }]}>
          ¿Deseas enviar el reporte con todos los datos ingresados
          anteriormente?
        </Text>

        <View style={styles.modalButtons}>
          {_renderButton(
            "Rechazar",
            "transparent",
            () => {
              setReportModalVisible(null);
            },
            "gray",
            "bold"
          )}
          {_renderButton(
            "Aceptar",
            "rgba(0,158,227,1)",
            () => {
              handleUploadPhoto(images);
              setSubmittingInfo(true);
            },
            "white",
            "normal"
          )}
        </View>
      </View>
    );

  let getCurrentDateTime = () => {
    var date = new Date();
    let seconds = date.getSeconds();
    let minutes = date.getMinutes();
    let hour = date.getHours();
    let year = date.getFullYear();
    let month = date.getMonth() + 1; // beware: January = 0; February = 1, etc.
    let day = date.getDate();

    return (
      year +
      "-" +
      (month < 10 ? "0" + month : month) +
      "-" +
      (day < 10 ? "0" + day : day) +
      "T" +
      (hour < 10 ? "0" + hour : hour) +
      ":" +
      (minutes < 10 ? "0" + minutes : minutes) +
      ":" +
      (seconds < 10 ? "0" + seconds : seconds)
    );
  };

  const createFormData = (photo, index) => {
    const data = new FormData();
    var date = new Date();
    let seconds = date.getSeconds();
    let minutes = date.getMinutes();
    let hour = date.getHours();
    let year = date.getFullYear();
    let month = date.getMonth() + 1; // beware: January = 0; February = 1, etc.
    let day = date.getDate();

    data.append("photo", {
      uri:
        Platform.OS === "android"
          ? photo.uri
          : photo.uri.replace("file://", ""),
      name:
        index +
        "-" +
        user.Login_usuario +
        "-" +
        day +
        "-" +
        month +
        "-" +
        year +
        "-" +
        hour +
        "-" +
        minutes +
        "-" +
        seconds +
        ".jpg",
      type: "image/jpg",
    });

    return data;
  };

  let handleUploadPhoto = (photos) => {
    let paths = [];
    for (let i = 0; i < photos.length; i++) {
      fetch(url + "/api/Imagen/SubirImagenApi", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
          Authorization:
            "Basic " +
            Base64.btoa(
              usuario.Login_usuario +
                ":" +
                Base64.btoa(usuario.Password_usuario)
            ),
        },
        body: createFormData(photos[i], i),
      })
        .then(async (response) => {
          let data = await response.json();
          if (response.status === 200) {
            if (data !== "anonymous.png") {
              paths.push({ Path_imagen: data, Tipo_imagen: 1 });
            }
          } else {
            console.log("imagen fallida");
            setSubmittingInfo(false);
            setReportModalVisible(null);
            setScreen(9);
          }
        })
        .then(() => {
          if (paths.length === photos.length) addTicket(paths);
        })
        .catch((error) => {
          console.log("upload error", error);
          setScreen(9);
          setSubmittingInfo(false);
          setReportModalVisible(null);
        });
    }
  };

  let addTicket = (paths) => {
    console.log("recibidos: " + paths);
    const data = new FormData();

    fetch(url + "/api/Reporte/Registrar/", {
      method: "POST",
      headers: {
        Authorization:
          "Basic " +
          Base64.btoa(
            usuario.Login_usuario + ":" + Base64.btoa(usuario.Password_usuario)
          ),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ticket: {
          ID_tipoReporte: type,
          ID_usuarioReportante: user.ID_usuario,
          Estatus_ticket: 1,
          FechaRegistro_ticket: getCurrentDateTime(),
          Latitud_ticket: location.latitude,
          Longitud_ticket: location.longitude,
          //ID_sector: 1,
          Direccion_ticket: address.street,
          EntreCalles_ticket: address.street_1 + " y " + address.street_2,
          Referencia_ticket: address.references,
          Colonia_ticket: address.neighborhood,
          Poblacion_ticket: address.neighborhood,
          EnviarCorreo_ticket: sendEmail,
          EnviarSMS_ticket: sendSms,
          Observaciones_ticket: observations,
          Origen: 1,
        },
        imagenes: paths,
      }),
    })
      .then(async (response) => {
        let data = await response.json();
        if (response.status >= 200 && response.status < 300) {
          getTicketNumber();
        } else {
          console.log("REGISTRO FALLIDO");
          setScreen(9);
          setSubmittingInfo(false);
          setReportModalVisible(null);
        }
      })
      .catch((error) => {
        console.log("ERROR REGISTRO", error);
        setScreen(9);
        setSubmittingInfo(false);
        setReportModalVisible(null);
      });
  };

  let getTicketNumber = () => {
    fetch(
      url + "/api/Ticket/GetTicketsByUser/" + user.ID_usuario + "/0/0/0/1",
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization:
            "Basic " +
            Base64.btoa(
              usuario.Login_usuario +
                ":" +
                Base64.btoa(usuario.Password_usuario)
            ),
        },
      }
    )
      .then(async (response) => {
        let data = await response.json();
        if (response.status === 200) {
          console.log(data[0].ID_ticket);
          setSuccessMsg("Reporte #" + data[0].ID_ticket + " creado con éxito");
        } else {
          console.log("No se obtuvo ningun ticket");
        }
      })
      .then(() => {
        setScreen(5);
        setSubmittingInfo(false);
        setReportModalVisible(null);
      })
      .catch((error) => {
        console.log("tickets error", error);
      });
  };

  const callbackFunction = (childData, reportValue, reportValue2) => {
    switch (childData) {
      case 2:
        console.log(reportValue);
        setType(reportValue);
        setObservations(reportValue2);
        setScreen(childData);
        break;
      case 3:
        setLocation(reportValue);
        setAddress(reportValue2);
        setScreen(childData);
        break;
      case 4:
        setImages(reportValue);
        //USUARIO INCOGNITO;
        if (usuario.Login_usuario.trim() === "incognito") {
          setVisibleModal(1);
        } else setScreen(childData);
        break;
      case 5:
        setSms(reportValue);
        setEmail(reportValue2);
        setReportModalVisible(1);
        break;
      case 10:
        if (user.Login_usuario.trim() === "incognito")
          navigation.navigate("LoginScreen");
        else
          navigation.navigate("MainMenu", {
            user: user,
            url: url,
          });
        break;
    }
    //setScreen(childData);
  };

  const callbackRegister = (childData, value) => {
    switch (childData) {
      case null:
        setScreen(3);
        break;
      case 4:
        setUser(value);
        setScreen(7);
        break;
      default:
        setUser(childData);
        setScreen(4);
        break;
    }
  };

  let reportHeader = (
    <NewReportHeader parentCallback={callbackHeader} screen={screen} />
  );
  let reportType = (
    <NewReportType
      parentCallback={callbackFunction}
      typeSelected={type}
      usuario={usuario}
      url={url}
      observs={observations}
    />
  );
  let reportLocation = (
    <NewReportLocation
      parentCallback={callbackFunction}
      currentLocation={location}
      currentAddress={address}
    />
  );
  let reportImages = (
    <NewReportImages parentCallback={callbackFunction} currentImages={images} />
  );
  let reportNotification = (
    <NewReportNotification parentCallback={callbackFunction} />
  );
  let reportFinished = (
    <NewReportFinished
      parentCallback={callbackFunction}
      title="Reporte creado"
      MessageHeader="¡Gracias por tu reporte!"
      Message={successMsg}
      success={true}
    />
  );

  let reportFailed = (
    <NewReportFinished
      parentCallback={callbackFunction}
      title="Reporte fallido"
      MessageHeader="¡Algo salió mal!"
      Message="Inténtalo mas tarde"
      success={false}
    />
  );

  let registerCard = (
    <RegisterCard
      parentCallback={callbackRegister}
      url={url}
      editableUser={null}
      isEditing={false}
    />
  );

  let otpVerificationCard = (
    <OTPVerificationCard
      url={url}
      usuario={user}
      currentUser={callbackRegister}
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
        animating={submittingInfo}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>{reportHeader}</View>

      <View style={styles.stepsCard}>
        <ReportSteps currentScreen={screen} />
      </View>

      <View style={styles.reportsCard}>
        {screen === 1
          ? reportType
          : screen === 2
          ? reportLocation
          : screen === 3
          ? reportImages
          : screen === 4
          ? reportNotification
          : screen === 5
          ? reportFinished
          : screen === 6
          ? registerCard
          : screen === 9
          ? reportFailed
          : otpVerificationCard}
      </View>

      <Modal isVisible={visibleModal === 1}>{_renderModalContent()}</Modal>
      <Modal isVisible={reportModalVisible === 1}>
        {reportConfirmationModal()}
      </Modal>
    </View>
  );
};

export default NewReportScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E5E7E9",
    alignItems: "stretch",
    justifyContent: "center",
    width: "100%",
  },
  headerBar: {
    flex: 5,
    alignItems: "center",
    justifyContent: "center",
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  stepsCard: {
    flex: 1,
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "stretch",
    justifyContent: "center",
    marginHorizontal: WIDTH * 0.12,
    borderRadius: 10,
    marginTop: -(HEIGHT * 0.02),
    marginBottom: HEIGHT * 0.01,
  },
  reportsCard: {
    flex: 14,
    backgroundColor: "#E5E7E9",
    alignItems: "center",
    borderRadius: 10,
    marginHorizontal: WIDTH * 0.02,
    marginBottom: HEIGHT * 0.01,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.46,
    shadowRadius: 11.14,
    elevation: 17,
  },
  button: {
    width: WIDTH * 0.3,
    height: HEIGHT * 0.048,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
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
  elementText: {
    fontSize: HEIGHT * 0.023,
    marginBottom: HEIGHT * 0.02,
    alignSelf: "center",
    fontWeight: "bold",
  },
  buttonText: {
    fontSize: HEIGHT * 0.02,
    alignSelf: "center",
    color: "white",
  },
  modalButtons: {
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
  modalText: {
    fontSize: HEIGHT * 0.023,
    alignSelf: "center",
    fontWeight: "bold",
    marginHorizontal: WIDTH * 0.05,
    marginBottom: HEIGHT * 0.025,
  },
});
