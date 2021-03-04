import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  ToastAndroid,
  BackHandler,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import Modal from "react-native-modal";
import Base64 from "../components/Base64";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width: WIDTH, height: HEIGHT } = Dimensions.get("screen");

const ReportListUser = ({ parentCallback, user, url, type, status }) => {
  [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [exitApp, setExitApp] = useState(0);
  const [inverted, setInverted] = useState([]);
  const [page, setPage] = useState(0);
  const [results, setResults] = useState(12);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isFull, setIsFull] = useState(false);

  let getTickets = () => {
    fetch(
      url +
        "/api/Ticket/GetTicketsByUser/" +
        user.ID_usuario +
        "/" +
        type +
        "/" +
        status +
        "/" +
        page +
        "/" +
        results,
      {
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
      }
    )
      .then(async (response) => {
        let data = await response.json();
        if (response.status === 200) {
          if (data.length > 0) {
            for (let i = 0; i < data.length; i++) {
              setReportes(
                reportes.concat({
                  id: data[i].ID_ticket,
                  type: getReportType(data[i].NombreTipoReporte),
                  date: getReportDate(data[i].FechaRegistro_ticket),
                  status: getReportStatus(data[i].Estatus_ticket),
                  latitude: data[i].Latitud_ticket,
                  longitude: data[i].Longitud_ticket,
                  idType: data[i].ID_tipoReporte,
                  dbDate: data[i].FechaRegistro_ticket,
                  origin: data[i].Origen,
                }) //[1,2,3,4,5,6,7,8,9,10,11,12]
              ); //[5,4,3,2,1]
            }
            setLoadingMore(false);
          } else setIsFull(true);
        } else {
          console.log("No se obtuvo ningun ticket");
          setLoadingMore(false);
        }
      })
      .then(() => {
        setLoading(false);
        setLoadingMore(false);
      })
      .catch((error) => {
        console.log("tickets error", error);
      });
  };

  let getReportes = () => {
    fetch(
      url +
        "/api/Reporte/GetReporteByJefeAsignado/" +
        user.ID_usuario +
        "/" +
        type +
        "/" +
        status +
        "/" +
        page +
        "/" +
        results,
      {
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
      }
    )
      .then(async (response) => {
        let data = await response.json();
        if (response.status === 200) {
          if (data.length > 0) {
            for (let i = 0; i < data.length; i++) {
              setReportes(
                reportes.concat({
                  id: data[i].ID_reporte,
                  type: getReportType(data[i].nombreTipo),
                  date: getReportDate(data[i].FechaRegistro_reporte),
                  status: getReportStatus(data[i].Estatus_reporte),
                  latitude: data[i].Latitud_reporte,
                  longitude: data[i].Longitud_reporte,
                  idType: data[i].ID_tipoReporte,
                  registerDate: data[i].FechaRegistro_reporte,
                  endDate: data[i].FechaCierre_reporte,
                  numTickets: data[i].NoTickets_reporte,
                  sector: data[i].ID_sector,
                  cuadrilla: data[i].ID_cuadrilla,
                  estimated: data[i].TiempoEstimado_reporte,
                  restant: data[i].TiempoRestante_reporte,
                  address: data[i].Direccion_reporte,
                  between: data[i].EntreCalles_reporte,
                  references: data[i].Referencia_reporte,
                  nbhood: data[i].Colonia_reporte,
                  poblado: data[i].Poblado_reporte,
                  observations: data[i].Observaciones_reporte,
                  origin: data[i].Origen,
                })
              );
            }
            setLoadingMore(false);
          } else setIsFull(true);
        } else {
          console.log("No se obtuvo ningun ticket");
          setLoadingMore(false);
        }
      })
      .then(() => {
        setLoading(false);
        setLoadingMore(false);
      })
      .catch((error) => {
        console.log("tickets error", error);
      });
  };

  const getPermissions = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("@procesoP");
      if (jsonValue != null) {
        validateReportCreation(JSON.parse(Base64.atob(jsonValue)));
      }
    } catch (e) {
      // error reading value
    }
  };

  useEffect(() => {
    if (reportes.length === 0) {
      if (user.ID_tipoUsuario === 2) getReportes();
      else getTickets();
      setPage(page + results);
    }
  }, []);

  const sendData = () => {
    parentCallback("NewReportScreen");
  };

  const getReportStatus = (id) => {
    switch (id) {
      case 1:
        return "Abierto";
        break;
      case 2:
        return "Cerrado";
        break;
      case 3:
        return "Inconcluso";
        break;
      case 4:
        return "Cancelado";
        break;
      default:
        return "";
        break;
    }
  };

  const getReportDate = (date) => {
    let day = date.split("T");
    return (
      day[0].charAt(8) +
      day[0].charAt(9) +
      "-" +
      day[0].charAt(5) +
      day[0].charAt(6) +
      "-" +
      day[0].charAt(0) +
      day[0].charAt(1) +
      day[0].charAt(2) +
      day[0].charAt(3)
    );
  };

  const getReportType = (type) => {
    let description = type.split(" ");
    return description[0];
  };

  const sendReport = (item, screen) => {
    if (
      screen === 2 &&
      (item.status === "Cerrado" || item.status === "Cancelado")
    )
      setError("No es posible modificar un reporte " + item.status);
    else parentCallback(item, screen);
  };

  let validateReportCreation = (gottenPermissions) => {
    let allowed = false;
    gottenPermissions.forEach((perm) => {
      if (perm.ID_procesoPermisos === 20) allowed = true;
    });
    if (allowed) {
      sendData();
    } else {
      setError(
        "Actualmente no cuentas con permiso para crear un nuevo reporte"
      );
    }
  };

  let _renderButton = (text, color, onPress, textColor, textWeight) => (
    <TouchableOpacity onPress={onPress}>
      <View
        style={[
          styles.buttonModal,
          { backgroundColor: color, marginBottom: 0 },
        ]}
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

  let modalError = () => (
    <View style={styles.modalContent}>
      <MaterialCommunityIcons
        name="clipboard-alert-outline"
        size={HEIGHT * 0.04}
        color="black"
      />
      <Text style={[styles.modalText, { textAlign: "center" }]}>{error}</Text>

      <View style={styles.modalButtons}>
        {_renderButton(
          "Aceptar",
          "rgba(0,158,227,1)",
          () => {
            setError("");
          },
          "white",
          "normal"
        )}
      </View>
    </View>
  );

  const setFilterScreen = () => {
    parentCallback(true);
  };

  const loadMore = () => {
    if (!isFull) {
      if (reportes.length <= page) {
        console.log("reportes: " + reportes.length + " pagina: " + page);
        setPage(page + results);
        setLoadingMore(true);
        if (user.ID_tipoUsuario === 2) getReportes();
        else getTickets();
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.tableHeader}>
        {user.ID_tipoUsuario !== 2 ? (
          <Text style={styles.headerText}>Mis reportes creados</Text>
        ) : (
          <Text style={[styles.headerText, { marginRight: WIDTH * 0.1759 }]}>
            Trabajos asignados
          </Text>
        )}
        <TouchableOpacity style={styles.filterButton} onPress={setFilterScreen}>
          <Entypo
            name="sound-mix"
            size={HEIGHT * 0.021}
            color="rgba(0,158,227,1)"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.tableElements}>
        {loading ? (
          <ActivityIndicator
            size="large"
            color="rgba(0,158,227,1)"
            animating={loading}
          />
        ) : reportes.length === 0 ? (
          <Text style={styles.voidText}>No hay reportes</Text>
        ) : (
          <FlatList
            keyExtractor={(item) => "" + item.id}
            data={reportes}
            renderItem={({ item }) => (
              <View style={styles.reportRow}>
                <View style={[styles.reportItem, { flex: 1 }]}>
                  <MaterialCommunityIcons
                    name="clipboard-text-outline"
                    size={28}
                    color="black"
                  />
                </View>
                <View
                  style={[
                    styles.reportItem,
                    { alignItems: "flex-start", flex: 2 },
                  ]}
                >
                  <Text style={styles.idText}>#{item.id}</Text>
                  <Text style={styles.typeText}>{item.type}</Text>
                </View>
                <View style={[styles.reportItem, { alignItems: "flex-start" }]}>
                  <Text style={styles.idText}>{item.date}</Text>
                  <Text style={styles.elementText}>{item.status}</Text>
                </View>
                <View style={[styles.reportItem, { flex: 2, padding: 0 }]}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => sendReport(item, 1)}
                  >
                    <Text style={styles.buttonText}>Detalles</Text>
                  </TouchableOpacity>
                  {user.ID_tipoUsuario === 2 ? (
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => sendReport(item, 2)}
                    >
                      <Text style={[styles.buttonText, { color: "#223995" }]}>
                        Modificar
                      </Text>
                    </TouchableOpacity>
                  ) : null}
                </View>
              </View>
            )}
            onEndReached={loadMore}
            onEndReachedThreshold={0}
            ListFooterComponent={
              !isFull ? (
                <View
                  style={[styles.reportRow, { backgroundColor: "transparent" }]}
                >
                  {loadingMore ? (
                    <ActivityIndicator
                      size="large"
                      color="rgba(0,158,227,1)"
                      animating={loadingMore}
                    />
                  ) : null}
                </View>
              ) : null
            }
          />
        )}
      </View>

      <View style={styles.tableFooter}>
        {user.ID_tipoUsuario !== 2 ? (
          <TouchableOpacity style={styles.addButton} onPress={getPermissions}>
            <Ionicons
              name="md-add"
              size={WIDTH * 0.1}
              color="rgba(0,158,227,1)"
            />
          </TouchableOpacity>
        ) : null}
      </View>
      <Modal isVisible={error !== ""}>{modalError()}</Modal>
    </View>
  );
};

export default ReportListUser;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
    justifyContent: "center",
    width: "100%",
    borderRadius: 10,
  },
  tableHeader: {
    flex: 2,
    alignItems: "center",
    justifyContent: "flex-end",
    flexDirection: "row",
    marginBottom: 2,
    backgroundColor: "white",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  tableElements: {
    flex: 20,
    alignItems: "stretch",
    justifyContent: "center",
  },
  reportRow: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "white",
    justifyContent: "center",
    margin: 2,
    borderRadius: 5,
  },
  reportItem: {
    paddingVertical: HEIGHT * 0.0085,
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
    width: "25%",
  },
  button: {
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    width: "85%",
    height: HEIGHT * 0.028,
    justifyContent: "center",
    marginVertical: HEIGHT * 0.005,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.46,
    shadowRadius: 11.14,
    elevation: 17,
  },
  addButton: {
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 60,
    width: "15%",
    height: "80%",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 8,
      height: 8,
    },
    shadowOpacity: 0.46,
    shadowRadius: 11.14,
    elevation: 17,
  },
  buttonText: {
    fontSize: HEIGHT * 0.017,
    color: "rgba(0,158,227,1)",
    textAlign: "center",
    fontWeight: "bold",
  },
  tableFooter: {
    flex: 3,
    alignItems: "center",
    justifyContent: "space-evenly",
    flexDirection: "row",
    marginTop: 2,
    backgroundColor: "white",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  headerText: {
    fontSize: HEIGHT * 0.021,
    fontWeight: "bold",
    textAlign: "center",
    marginRight: WIDTH * 0.17,
  },
  voidText: {
    fontSize: HEIGHT * 0.024,
    fontWeight: "bold",
    textAlign: "center",
  },
  typeText: {
    fontSize: HEIGHT * 0.017,
    color: "black",
    fontWeight: "bold",
  },
  idText: {
    fontSize: HEIGHT * 0.014,
    color: "gray",
  },
  elementText: {
    fontSize: HEIGHT * 0.017,
    color: "black",
  },
  filterButton: {
    backgroundColor: "transparent",
    width: "10%",
    height: "75%",
    alignItems: "center",
    justifyContent: "center",
    marginRight: WIDTH * 0.02,
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
  buttonModal: {
    width: WIDTH * 0.3,
    height: HEIGHT * 0.048,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
});
