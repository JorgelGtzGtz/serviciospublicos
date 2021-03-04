import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from "react-native";
import { Picker } from "@react-native-community/picker";
import Base64 from "../components/Base64";
import { Ionicons } from "@expo/vector-icons";
import Modal from "react-native-modal";

const { width: WIDTH, height: HEIGHT } = Dimensions.get("screen");

const ReportFilter = ({
  parentCallback,
  typeSelected,
  usuario,
  url,
  currentStatus,
}) => {
  [options, setOptions] = useState([]);
  const [iosOptions, setIosOptions] = useState([]);
  const [selection, setSelection] = useState(typeSelected);
  const [status, setStatus] = useState(currentStatus);
  let [loading, setLoading] = useState(true);
  let [iosLabel, setIosLabel] = useState("");
  let [iosStatusLabel, setIosStatusLabel] = useState("");
  const [visibleModal, setVisibleModal] = useState(null);
  const [visibleModal2, setVisibleModal2] = useState(null);

  let getAllTypes = () => {
    fetch(url + "/api/TipoReporte/GetTipoReporte", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
        Authorization:
          "Basic " +
          Base64.btoa(
            usuario.Login_usuario + ":" + Base64.btoa(usuario.Password_usuario)
          ),
      },
    })
      .then(async (response) => {
        let data = await response.json();
        if (response.status === 200) {
          setOptions(
            options.concat(<Picker.Item key={0} label="Todos" value={0} />)
          );
          for (let i = 0; i < data.length; i++) {
            setOptions(
              options.concat(
                <Picker.Item
                  key={i + 1}
                  label={data[i].Descripcion_tipoReporte}
                  value={data[i].ID_tipoReporte}
                />
              )
            );
            if (data[i].ID_tipoReporte === selection)
              setIosLabel(data[i].Descripcion_tipoReporte);
          }
          setIosOptions(data);
          setLoading(false);
        } else {
          console.log("No se obtuvo ningun tipo");
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  useEffect(() => {
    getAllTypes();
    setIosStatus(status);
  }, []);

  let typeModal = () => (
    <View style={styles.modalContent}>
      <View style={styles.modalTop}>
        <TouchableOpacity
          style={styles.closeModalButton}
          onPress={() => setVisibleModal(null)}
        >
          <Ionicons name="ios-close-circle-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <Picker
        style={styles.picker}
        selectedValue={selection}
        onValueChange={(itemValue, itemIndex) => {
          setSelection(itemValue);
          setVisibleModal(null);
          if (itemIndex > 0)
            setIosLabel(iosOptions[itemIndex - 1].Descripcion_tipoReporte);
          else setIosLabel("Todos");
        }}
      >
        {options}
      </Picker>
    </View>
  );

  let statusModal = () => (
    <View style={styles.modalContent}>
      <View style={styles.modalTop}>
        <TouchableOpacity
          style={styles.closeModalButton}
          onPress={() => setVisibleModal2(null)}
        >
          <Ionicons name="ios-close-circle-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <Picker
        style={styles.picker}
        selectedValue={status}
        onValueChange={(itemValue, itemIndex) => {
          setStatus(itemValue);
          setIosStatus(itemValue);
          setVisibleModal2(null);
        }}
      >
        <Picker.Item label="Todos" value={0} />
        <Picker.Item label="Abierto" value={1} />
        <Picker.Item label="Cerrado" value={2} />
        <Picker.Item label="Inconcluso" value={3} />
        <Picker.Item label="Cancelado" value={4} />
      </Picker>
    </View>
  );

  const sendData = () => {
    parentCallback(selection, status);
  };

  const setIosStatus = (current) => {
    switch (current) {
      case 0:
        setIosStatusLabel("Todos");
        break;
      case 1:
        setIosStatusLabel("Abierto");
        break;
      case 2:
        setIosStatusLabel("Cerrado");
        break;
      case 3:
        setIosStatusLabel("Inconcluso");
        break;
      case 4:
        setIosStatusLabel("Cancelado");
        break;
      default:
        setIosStatusLabel("");
        break;
    }
  };

  const goBack = () => {
    parentCallback(typeSelected, currentStatus);
  };

  let nextButton = (
    <TouchableOpacity style={styles.nextButton} onPress={sendData}>
      <Text style={styles.buttonText}>Aplicar</Text>
    </TouchableOpacity>
  );

  let backButton = (
    <TouchableOpacity
      style={[styles.nextButton, { backgroundColor: "transparent" }]}
      onPress={goBack}
    >
      <Text style={[styles.buttonText, { color: "gray", fontWeight: "bold" }]}>
        Volver
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
        <Text style={styles.headerText}>Filtrar por...</Text>
      </View>

      {loading ? (
        loadingCircle
      ) : (
        <View style={styles.cardContent}>
          <Text style={styles.elementText}>Tipo de reporte</Text>

          <View style={styles.pickerContainer}>
            {Platform.OS === "android" ? (
              <Picker
                style={styles.picker}
                selectedValue={selection}
                onValueChange={(itemValue, itemIndex) => {
                  setSelection(itemValue);
                }}
              >
                {options}
              </Picker>
            ) : (
              <TouchableOpacity
                style={styles.iosPickerButton}
                onPress={() => setVisibleModal(1)}
              >
                <Text style={styles.iosPickerText}>{iosLabel}</Text>
                <Ionicons name="ios-arrow-dropdown" size={24} color="black" />
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.elementText}>Estado</Text>
          <View style={styles.pickerContainer}>
            {Platform.OS === "android" ? (
              <Picker
                style={styles.picker}
                selectedValue={status}
                onValueChange={(itemValue, itemIndex) => {
                  setStatus(itemValue);
                }}
              >
                <Picker.Item label="Todos" value={0} />
                <Picker.Item label="Abierto" value={1} />
                <Picker.Item label="Cerrado" value={2} />
                <Picker.Item label="Inconcluso" value={3} />
                <Picker.Item label="Cancelado" value={4} />
              </Picker>
            ) : (
              <TouchableOpacity
                style={styles.iosPickerButton}
                onPress={() => setVisibleModal2(1)}
              >
                <Text style={styles.iosPickerText}>{iosStatusLabel}</Text>
                <Ionicons name="ios-arrow-dropdown" size={24} color="black" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      <View style={styles.cardFooter}>
        {backButton}
        {nextButton}
      </View>
      <Modal isVisible={visibleModal === 1}>{typeModal()}</Modal>
      <Modal isVisible={visibleModal2 === 1}>{statusModal()}</Modal>
    </View>
  );
};

export default ReportFilter;

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
    fontSize: HEIGHT * 0.025,
    fontWeight: "bold",
    alignSelf: "flex-start",
    marginLeft: WIDTH * 0.168,
    marginBottom: HEIGHT * 0.01,
  },
  picker: {
    height: HEIGHT * 0.05,
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
    width: "65%",
    height: HEIGHT * 0.05,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    fontSize: HEIGHT * 0.021,
    paddingLeft: WIDTH * 0.03,
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
  iosPickerButton: {
    backgroundColor: "transparent",
    width: "100%",
    height: HEIGHT * 0.049,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingHorizontal: WIDTH * 0.02,
  },
  iosPickerText: {
    fontSize: HEIGHT * 0.02,
    alignSelf: "center",
    color: "black",
  },
  modalContent: {
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    height: HEIGHT * 0.25,
    backgroundColor: "white",
    borderRadius: 15,
  },
  closeModalButton: {
    backgroundColor: "transparent",
    width: "15%",
    height: HEIGHT * 0.048,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-end",
  },
  modalTop: {
    width: "100%",
    height: "25%",
    alignItems: "stretch",
    alignSelf: "flex-start",
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    justifyContent: "center",
    // marginBottom: HEIGHT * 0.04,
  },
});
