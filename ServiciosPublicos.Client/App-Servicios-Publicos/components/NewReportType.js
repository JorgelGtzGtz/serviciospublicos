import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Platform,
  FlatList,
} from "react-native";
import { Picker } from "@react-native-community/picker";
import Base64 from "../components/Base64";
import { Ionicons } from "@expo/vector-icons";
import Modal from "react-native-modal";

const { width: WIDTH, height: HEIGHT } = Dimensions.get("screen");

const NewReportType = ({
  parentCallback,
  typeSelected,
  usuario,
  url,
  observs,
}) => {
  [options, setOptions] = useState([]);
  const [iosOptions, setIosOptions] = useState([]);
  const [selection, setSelection] = useState(typeSelected);
  const [observations, setObservations] = useState(observs);
  let [loading, setLoading] = useState(true);
  let [observationsColor, setObservationsColor] = useState("black");
  const [visibleModal, setVisibleModal] = useState(null);
  let [iosLabel, setIosLabel] = useState("");

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
  }, []);

  const sendData = () => {
    parentCallback(2, selection, observations);
  };

  let _renderModalContent = () => (
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
          setIosLabel(iosOptions[itemIndex].Descripcion_tipoReporte);
        }}
      >
        {options}
      </Picker>
    </View>
  );

  let observationsInput = (
    <TextInput
      placeholder="Observaciones"
      style={[styles.textInput, { borderColor: observationsColor }]}
      onChangeText={(text) => setObservations(text)}
      value={observations}
      maxLength={39}
      onFocus={() => setObservationsColor("rgba(0,158,227,1)")}
      onBlur={() => setObservationsColor("black")}
    />
  );
  let nextButton = (
    <TouchableOpacity style={styles.nextButton} onPress={sendData}>
      <Text style={styles.buttonText}>Siguiente</Text>
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
        <Text style={styles.headerText}>Tipo de reporte</Text>
      </View>

      {loading ? (
        loadingCircle
      ) : (
        <View style={styles.cardContent}>
          <Text style={styles.elementText}>Selecciona el tipo de reporte</Text>

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
          {observationsInput}
        </View>
      )}

      <View style={styles.cardFooter}>
        {selection !== 0 ? nextButton : null}
      </View>
      <Modal isVisible={visibleModal === 1}>{_renderModalContent()}</Modal>
    </View>
  );
};

export default NewReportType;

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
    marginBottom: HEIGHT * 0.02,
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
    height: HEIGHT * 0.05,
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
