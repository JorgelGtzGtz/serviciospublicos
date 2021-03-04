import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";

const { width: WIDTH, height: HEIGHT } = Dimensions.get("screen");
let reports = [
  { id: "1", status: "Abierto" },
  { id: "28", status: "Abierto" },
  { id: "35566", status: "Abierto" },
  { id: "4", status: "Abierto" },
  { id: "5", status: "Abierto" },
  { id: "6", status: "Abierto" },
  { id: "7", status: "Abierto" },
  { id: "8", status: "Abierto" },
  { id: "9", status: "Abierto" },
  { id: "10", status: "Abierto" },
  { id: "11", status: "Abierto" },
  { id: "12", status: "Abierto" },
];

const ReportList = () => {
  return (
    <View style={styles.container}>
      <View style={styles.tableHeader}>
        <Text style={styles.headerText}>ID</Text>
        <Text style={styles.headerText}>Datos</Text>
        <Text style={styles.headerText}>Estatus</Text>
        <MaterialCommunityIcons
          name="clipboard-text-outline"
          size={HEIGHT * 0.03}
          color="black"
        />
      </View>
      <View style={styles.tableElements}>
        <FlatList
          keyExtractor={(item) => item.id}
          data={reports}
          renderItem={({ item }) => (
            <View style={styles.reportRow}>
              <View style={styles.reportItem}>
                <Text style={styles.elementText}>#{item.id}</Text>
              </View>
              <View style={[styles.reportItem, { alignItems: "flex-start" }]}>
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: "#CCD1D1" }]}
                >
                  <Text style={styles.buttonText}>Checar</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.reportItem}>
                <Text style={styles.elementText}>{item.status}</Text>
              </View>
              <View style={[styles.reportItem, { alignItems: "flex-start" }]}>
                <TouchableOpacity style={styles.button}>
                  <Text style={styles.buttonText}>Editar</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>
      <View style={styles.tableFooter}>
        <AntDesign name="closecircleo" size={HEIGHT * 0.038} color="black" />
      </View>
    </View>
  );
};

export default ReportList;

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
    justifyContent: "space-evenly",
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
    marginBottom: 1,
  },
  reportItem: {
    padding: HEIGHT * 0.0085,
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    alignItems: "center",
    backgroundColor: "rgba(0,158,227,1)",
    padding: 10,
    borderRadius: 5,
    width: "100%",
    height: "80%",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: HEIGHT * 0.019,
    color: "white",
    textAlign: "center",
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
    fontSize: HEIGHT * 0.022,
    fontWeight: "bold",
  },
  elementText: {
    fontSize: HEIGHT * 0.019,
  },
});
