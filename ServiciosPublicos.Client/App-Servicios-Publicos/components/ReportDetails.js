import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Image,
  ImageBackground,
  ActivityIndicator,
  BackHandler,
  ToastAndroid,
} from "react-native";
import MapComponent from "../components/MapComponent";
import * as Location from "expo-location";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Octicons } from "@expo/vector-icons";
import Modal from "react-native-modal";
import * as Permissions from "expo-permissions";
import Base64 from "../components/Base64";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width: WIDTH, height: HEIGHT } = Dimensions.get("screen");

const ReportDetails = ({ parentCallback, report, url, usuario }) => {
  let [images, setImages] = useState([]);
  const [address, setAddress] = useState({
    latitude: report.latitude,
    longitude: report.longitude,
  });
  const [exitApp, setExitApp] = useState(0);
  let [loading, setLoading] = useState(true);
  const [textAddress, setTextAddress] = useState("");
  let reportImages =
    "Reporte/GetImagenesReporte?idReporte=" + report.id + "&tipoImagen=1";
  let ticketImages = "Ticket/GetImagenesTicket?idTicket=" + report.id;
  let [canceling, setCanceling] = useState(false);
  const [visibleModal, setVisibleModal] = useState(null);
  const [visibleModal2, setVisibleModal2] = useState(null);
  const [addressColor, setAddressColor] = useState("#000");

  let cancelTicket = () => {
    setCanceling(true);
    fetch(url + "/api/Ticket/CancelarTicket", {
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
        ID_ticket: report.id,
        Latitud_ticket: report.latitude,
        Longitud_ticket: report.longitude,
        ID_tipoReporte: report.idType,
        ID_usuarioReportante: usuario.ID_usuario,
        Estatus_ticket: 4,
        FechaRegistro_ticket: report.dbDate,
        ID_sector: 1,
        Origen: report.origin,
      }),
    })
      .then(async (response) => {
        let data = await response;
        if (response.status >= 200 && response.status < 300) {
          console.log("CANCEL EXITOSO");
          parentCallback(null);
        } else {
          console.log("CANCEL FALLIDO");
        }
      })
      .catch((error) => {
        console.log("ERROR CANCEL", error);
      });
  };

  const getPermissions = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("@procesoP");
      if (jsonValue != null) {
        validateReportCancelation(JSON.parse(Base64.atob(jsonValue)));
      } else console.log(jsonValue);
    } catch (e) {
      // error reading value
    }
  };

  let validateReportCancelation = (gottenPermissions) => {
    let allowed = false;
    gottenPermissions.forEach((perm) => {
      if (perm.ID_procesoPermisos === 23) allowed = true;
    });
    if (allowed) {
      setVisibleModal(1);
    } else {
      setVisibleModal2(1);
    }
  };

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
    canceling ? (
      cancelationCircle
    ) : (
      <View style={styles.modalContent}>
        <Octicons name="clippy" size={HEIGHT * 0.035} color="black" />
        <Text style={[styles.modalText, { textAlign: "center" }]}>
          ¿Estas seguro de que deseas cancelar este reporte?
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
              cancelTicket();
            },
            "white",
            "normal"
          )}
        </View>
      </View>
    );

  let modalPermissionDenied = () => (
    <View style={styles.modalContent}>
      <Octicons name="clippy" size={HEIGHT * 0.035} color="black" />
      <Text style={[styles.modalText, { textAlign: "center" }]}>
        Actualmente no cuentas con permiso para cancelar reportes
      </Text>

      <View style={styles.modalFooter}>
        {_renderButton(
          "Aceptar",
          "rgba(0,158,227,1)",
          () => {
            setVisibleModal2(null);
          },
          "white",
          "normal"
        )}
      </View>
    </View>
  );

  let isNumeric = (n) => {
    return !isNaN(parseFloat(n)) && isFinite(n);
  };

  let getReportImages = () => {
    fetch(
      url +
        "/api/" +
        (usuario.ID_tipoUsuario === 2 ? reportImages : ticketImages),
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
          setImages(data);
          setLoading(false);
        } else {
          setLoading(false);
          console.log("No se obtuvo ninguna imagen");
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  let isLocationEnabled = async () => {
    const { granted } = await Permissions.askAsync(Permissions.LOCATION);
    if (granted) {
      ReverseGeocode(report.latitude, report.longitude);
    } else {
      setTextAddress("¡Dirección no disponible, necesitamos permisos de GPS!");
      setAddressColor("orange");
    }
  };

  useEffect(() => {
    getReportImages();
    if (images.length >= 1)
      setImages(images.filter((image) => image != undefined));
    isLocationEnabled();
  }, []);

  let ReverseGeocode = async (lat, long) => {
    let data = await Location.reverseGeocodeAsync({
      latitude: lat,
      longitude: long,
    });
    if (data[0] !== undefined)
      setTextAddress(
        (data[0].street !== null ? data[0].street : "") +
          (data[0].name !== null && isNumeric(data[0].name)
            ? " #" + data[0].name
            : "") +
          (data[0].district !== null ? ", " + data[0].district : "") +
          (data[0].postalCode !== null ? " CP. " + data[0].postalCode : "")
      );
    else {
      setTextAddress("¡Dirección no disponible para mostrar por el momento!");
      setAddressColor("orange");
    }
  };

  const sendData = () => {
    parentCallback(null);
  };

  let loadingCircle = (
    <View style={[styles.cardContent, { alignItems: "center" }]}>
      <ActivityIndicator
        size="large"
        color="rgba(0,158,227,1)"
        animating={loading}
      />
    </View>
  );

  let cancelationCircle = (
    <View
      style={[
        styles.modalContent,
        { backgroundColor: "transparent", justifyContent: "center" },
      ]}
    >
      <ActivityIndicator
        size="large"
        color="rgba(0,158,227,1)"
        animating={canceling}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.cardHeader}>
        <Text style={styles.headerText}>Reporte #{report.id}</Text>
      </View>

      {loading ? (
        loadingCircle
      ) : (
        <View style={styles.cardContent}>
          <View style={styles.imageButtonsContainer}>
            <View style={styles.infoContainer}>
              <View style={styles.addressContainer}>
                <Text style={styles.elementText}>Tipo: {report.type}</Text>
                <Text style={styles.elementText}>Estado: {report.status}</Text>
                <Text style={styles.elementText}>Fecha: {report.date}</Text>
              </View>
              <View style={styles.addressContainer}>
                <Text style={[styles.addressText, { color: addressColor }]}>
                  {textAddress}
                </Text>
              </View>
            </View>
            <View style={styles.infoContainer}>
              {usuario.ID_tipoUsuario !== 2 &&
              report.status !== "Cancelado" &&
              report.status !== "Cerrado" ? (
                <TouchableOpacity
                  style={[
                    styles.addressContainer,
                    {
                      flex: 1,
                      flexDirection: "row",
                      height: "30%",
                    },
                  ]}
                  onPress={getPermissions}
                >
                  <Octicons name="clippy" size={20} color="gray" />
                  <Text style={styles.buttonText}>Cancelar reporte</Text>
                </TouchableOpacity>
              ) : null}
              <View style={styles.mapContainer}>
                <MapComponent
                  parentLocation={address}
                  parentCallback={null}
                  editMarker={false}
                />
              </View>
            </View>
          </View>

          {images.length < 2 ? (
            <View style={styles.imagesContainer}>
              {images[0] !== undefined ? (
                <Image
                  source={{
                    uri: url + "/" + images[0].Path_imagen,
                  }}
                  resizeMode="stretch"
                  style={{ height: "100%", width: "100%" }}
                />
              ) : (
                <MaterialCommunityIcons
                  name="image-off"
                  size={24}
                  color="black"
                />
              )}
            </View>
          ) : images.length === 2 ? (
            <View style={styles.imagesContainer}>
              <View style={styles.imagesTrioContainer}>
                <Image
                  source={{
                    uri: url + "/" + images[0].Path_imagen,
                  }}
                  resizeMode="stretch"
                  style={{ height: "100%", width: "100%" }}
                />
              </View>
              <View style={styles.imagesTrioContainer}>
                <Image
                  source={{
                    uri: url + "/" + images[1].Path_imagen,
                  }}
                  resizeMode="stretch"
                  style={{ height: "100%", width: "100%" }}
                />
              </View>
            </View>
          ) : images.length === 3 ? (
            <View style={styles.imagesContainer}>
              <View style={styles.imagesTrioContainer}>
                <View style={styles.imageElement}>
                  <Image
                    source={{
                      uri: url + "/" + images[0].Path_imagen,
                    }}
                    resizeMode="stretch"
                    style={{ height: "100%", width: "100%" }}
                  />
                </View>
                <View style={styles.imageElement}>
                  <Image
                    source={{
                      uri: url + "/" + images[1].Path_imagen,
                    }}
                    resizeMode="stretch"
                    style={{ height: "100%", width: "100%" }}
                  />
                </View>
              </View>
              <View style={styles.imagesTrioContainer}>
                <Image
                  source={{
                    uri: url + "/" + images[2].Path_imagen,
                  }}
                  resizeMode="stretch"
                  style={{ height: "100%", width: "100%" }}
                />
              </View>
            </View>
          ) : (
            <View style={styles.imagesContainer}>
              <View style={styles.imagesTrioContainer}>
                <View style={styles.imageElement}>
                  {images[0] !== undefined ? (
                    <Image
                      source={{
                        uri: url + "/" + images[0].Path_imagen,
                      }}
                      resizeMode="stretch"
                      style={{ height: "100%", width: "100%" }}
                    />
                  ) : (
                    <MaterialCommunityIcons
                      name="image-off"
                      size={24}
                      color="black"
                    />
                  )}
                </View>
                <View style={styles.imageElement}>
                  {images.length >= 2 && images[1] !== undefined ? (
                    <ImageBackground
                      source={{ uri: url + "/" + images[1].Path_imagen }}
                      resizeMode="stretch"
                      style={{ height: "100%", width: "100%" }}
                    ></ImageBackground>
                  ) : (
                    <MaterialCommunityIcons
                      name="image-off"
                      size={24}
                      color="black"
                    />
                  )}
                </View>
              </View>
              <View style={styles.imagesTrioContainer}>
                <View style={styles.imageElement}>
                  {images.length >= 3 && images[2] !== undefined ? (
                    <ImageBackground
                      source={{ uri: url + "/" + images[2].Path_imagen }}
                      resizeMode="stretch"
                      style={{ height: "100%", width: "100%" }}
                    ></ImageBackground>
                  ) : (
                    <MaterialCommunityIcons
                      name="image-off"
                      size={24}
                      color="black"
                    />
                  )}
                </View>
                <View style={styles.imageElement}>
                  {images.length === 4 && images[3] !== undefined ? (
                    <ImageBackground
                      source={{ uri: url + "/" + images[3].Path_imagen }}
                      resizeMode="stretch"
                      style={{ height: "100%", width: "100%" }}
                    ></ImageBackground>
                  ) : (
                    <MaterialCommunityIcons
                      name="image-off"
                      size={24}
                      color="black"
                    />
                  )}
                </View>
              </View>
            </View>
          )}
        </View>
      )}

      <View style={styles.cardFooter}>
        <TouchableOpacity style={styles.goBackButton} onPress={sendData}>
          <Text style={styles.buttonText}>Volver</Text>
        </TouchableOpacity>
      </View>
      <Modal isVisible={visibleModal === 1}>{_renderModalContent()}</Modal>
      <Modal isVisible={visibleModal2 === 1}>{modalPermissionDenied()}</Modal>
    </View>
  );
};

export default ReportDetails;

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
    alignItems: "flex-start",
    justifyContent: "center",
    backgroundColor: "white",
  },
  elementText: {
    fontSize: HEIGHT * 0.018,
    color: "black",
    alignSelf: "flex-start",
    fontWeight: "bold",
    marginLeft: WIDTH * 0.06,
  },
  addressText: {
    fontSize: HEIGHT * 0.018,
    color: "black",
    textAlign: "center",
    fontWeight: "bold",
    marginHorizontal: WIDTH * 0.02,
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
    color: "gray",
    fontWeight: "bold",
  },
  goBackButton: {
    backgroundColor: "transparent",
    width: "23%",
    height: HEIGHT * 0.037,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginRight: WIDTH * 0.02,
  },
  imagesContainer: {
    flex: 1,
    width: "100%",
    height: "55%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  imagesTrioContainer: {
    flex: 1,
    width: "100%",
    backgroundColor: "#E5E7E9",
    alignItems: "center",
    justifyContent: "center",
    margin: "0.5%",

    paddingVertical: "0.5%",
  },
  infoContainer: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "#F2F3F5",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  imageElement: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    margin: "0.5%",
  },
  imageButtonsContainer: {
    flexDirection: "row",
    alignSelf: "flex-end",
    width: "100%",
    height: "45%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F2F3F5",
  },
  addressContainer: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
    width: "94%",
    height: "96%",
    backgroundColor: "white",
    borderRadius: 15,
    marginHorizontal: WIDTH * 0.01,
    marginVertical: HEIGHT * 0.005,
  },
  mapContainer: {
    flex: 4,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    backgroundColor: "#F2F3F5",
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
  button: {
    width: WIDTH * 0.25,
    height: HEIGHT * 0.048,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: WIDTH * 0.01,
  },
});
