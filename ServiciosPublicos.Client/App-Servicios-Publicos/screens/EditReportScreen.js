import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import EditReportHeader from "../components/EditReportHeader";
import NewReportImages from "../components/NewReportImages";
import NewReportFinished from "../components/NewReportFinished";
import ReportDelay from "../components/ReportDelay";
import Modal from "react-native-modal";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Base64 from "../components/Base64";

const { width: WIDTH, height: HEIGHT } = Dimensions.get("screen");

const EditReportScreen = ({ route, navigation }) => {
  const { report, firstScreen, url, usuario } = route.params;
  const [images, setImages] = useState([]);
  const [screen, setScreen] = useState(firstScreen);
  const [visibleModal, setVisibleModal] = useState(null);
  const [visibleModal2, setVisibleModal2] = useState(null);
  const [restantTime, setRestantTime] = useState(0);
  let [loading, setLoading] = useState(false);

  const back = (childData) => {
    if (screen === 1 || screen === 3) navigation.goBack();
  };

  const callbackFunction = (childData, reportValue) => {
    switch (childData) {
      case 4:
        setImages(reportValue);
        setVisibleModal(1);
        break;
      case 10:
        navigation.navigate("MainMenu");
        break;
      case 11:
        delayReport(reportValue);
        break;
    }
  };

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

  let _renderModalContent = () =>
    loading ? (
      loadingCircle
    ) : (
      <View style={styles.modalContent}>
        <MaterialCommunityIcons
          name="clipboard-alert-outline"
          size={HEIGHT * 0.04}
          color="black"
        />
        <Text style={[styles.modalText, { textAlign: "center" }]}>
          ¿Estás seguro que deseas cerrar el reporte?
        </Text>

        <View style={styles.modalButtons}>
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
              handleUploadPhoto(images);
              setLoading(true);
            },
            "white",
            "normal"
          )}
        </View>
      </View>
    );

  let modalReportDelayed = () => (
    <View style={styles.modalContent}>
      <MaterialCommunityIcons
        name="clipboard-alert-outline"
        size={HEIGHT * 0.04}
        color="black"
      />
      <Text style={[styles.modalText, { textAlign: "center" }]}>
        El estado actual del reporte ha pasado a inconcluso
      </Text>

      <View style={styles.modalButtons}>
        {_renderButton(
          "Aceptar",
          "rgba(0,158,227,1)",
          () => {
            navigation.navigate("MainMenu");
            //setVisibleModal2(null);
          },
          "white",
          "normal"
        )}
      </View>
    </View>
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
        usuario.Login_usuario +
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
              paths.push({ Path_imagen: data, Tipo_imagen: 2 });
            }
          } else {
            console.log("imagen fallida");
          }
        })
        .then(() => {
          if (paths.length === photos.length) registrarImagenesCierre(paths);
        })
        .catch((error) => {
          console.log("upload error", error);
        });
    }
  };

  let registrarImagenesCierre = (paths) => {
    console.log("recibidos: " + paths);

    fetch(url + "/api/Reporte/InsertarImagenesReporte", {
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
        reporte: {
          ID_reporte: report.id,
        },
        imagenes: paths,
      }),
    })
      .then(async (response) => {
        let data = await response.json();
        if (response.status >= 200 && response.status < 300) {
          closeReport();
        } else {
          console.log("REGISTRO IMAGENES FALLIDO");
        }
      })
      .catch((error) => {
        console.log("ERROR REGISTRO IMAGENES", error);
      });
  };

  let closeReport = () => {
    fetch(url + "/api/Reporte/Actualizar", {
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
        ID_reporte: report.id,
        ID_tipoReporte: report.idType,
        Latitud_reporte: report.latitude,
        Longitud_reporte: report.longitude,
        FechaRegistro_reporte: report.registerDate,
        FechaCierre_reporte: getCurrentDateTime(),
        NoTickets_reporte: report.numTickets,
        Estatus_reporte: 2,
        //ID_sector: report.sector,
        ID_cuadrilla: report.cuadrilla,
        TiempoEstimado_reporte: report.estimated,
        TiempoRestante_reporte: report.restant,
        Direccion_reporte: report.address,
        EntreCalles_reporte: report.between,
        Referencia_reporte: report.references,
        Colonia_reporte: report.nbhood,
        Poblado_reporte: report.poblado,
        Observaciones_reporte: report.observations,
        Origen: report.origin,
      }),
    })
      .then(async (response) => {
        let data = await response;
        if (response.status >= 200 && response.status < 300) {
          console.log("CIERRE EXITOSO");
          setLoading(false);
          setScreen(2);
          setVisibleModal(null);
        } else {
          console.log("CIERRE FALLIDO");
        }
      })
      .catch((error) => {
        console.log("ERROR CIERRE", error);
      });
  };

  let delayReport = (hours) => {
    fetch(url + "/api/Reporte/Actualizar", {
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
        ID_reporte: report.id,
        ID_tipoReporte: report.idType,
        Latitud_reporte: report.latitude,
        Longitud_reporte: report.longitude,
        FechaRegistro_reporte: report.registerDate,
        FechaCierre_reporte: report.endDate,
        NoTickets_reporte: report.numTickets,
        Estatus_reporte: 3,
        //ID_sector: report.sector,
        ID_cuadrilla: report.cuadrilla,
        TiempoEstimado_reporte: report.estimated,
        TiempoRestante_reporte: hours,
        Direccion_reporte: report.address,
        EntreCalles_reporte: report.between,
        Referencia_reporte: report.references,
        Colonia_reporte: report.nbhood,
        Poblado_reporte: report.poblado,
        Observaciones_reporte: report.observations,
        Origen: report.origin,
      }),
    })
      .then(async (response) => {
        let data = await response;
        if (response.status >= 200 && response.status < 300) {
          console.log("EDICION COMPLETADA");
          setVisibleModal2(1);
        } else {
          console.log("REGISTRO FALLIDO");
        }
      })
      .catch((error) => {
        console.log("ERROR REGISTRO", error);
      });
  };

  let reportImages = (
    <NewReportImages parentCallback={callbackFunction} currentImages={images} />
  );
  let reportDelay = (
    <ReportDelay parentCallback={callbackFunction} currentImages={images} />
  );
  let reportFinished = (
    <NewReportFinished
      parentCallback={callbackFunction}
      title="Reporte cerrado"
      MessageHeader="¡Gracias!"
      Message="Reporte cerrado con éxito"
      success={true}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <EditReportHeader parentCallback={back} screen={screen} />
      </View>

      <View style={styles.card}>
        {screen === 1
          ? reportImages
          : screen === 2
          ? reportFinished
          : reportDelay}
      </View>
      <Modal isVisible={visibleModal === 1}>{_renderModalContent()}</Modal>
      <Modal isVisible={visibleModal2 === 1}>{modalReportDelayed()}</Modal>
    </View>
  );
};

export default EditReportScreen;

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
  card: {
    flex: 16,
    backgroundColor: "#E5E7E9",
    flexDirection: "row",
    alignItems: "stretch",
    justifyContent: "center",
    marginHorizontal: WIDTH * 0.015,
    borderRadius: 10,
    marginTop: HEIGHT * 0.01,
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
  reportsCard: {
    flex: 13,
    backgroundColor: "#E5E7E9",
    alignItems: "stretch",
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
