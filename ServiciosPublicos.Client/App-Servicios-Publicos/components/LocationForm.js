import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const { width: WIDTH, height: HEIGHT } = Dimensions.get("screen");

const LocationForm = ({
  parentCallback,
  locationAdded,
  optionalAddressForm,
  dataForm,
}) => {
  const [exist, setExist] = useState(locationAdded);
  const [loading, setLoading] = useState(locationAdded);
  let [address, setAddress] = useState(dataForm);
  let [border, setBorder] = useState({
    streetColor: "gray",
    street_1Color: "gray",
    street_2Color: "gray",
    referencesColor: "gray",
    neighborhoodColor: "gray",
  });

  let changeBorder = (field, color) => {
    switch (field) {
      case 1:
        setBorder({ ...border, streetColor: color });
        break;
      case 2:
        setBorder({ ...border, street_1Color: color });
        break;
      case 3:
        setBorder({ ...border, street_2Color: color });
        break;
      case 4:
        setBorder({ ...border, referencesColor: color });
        break;
      case 5:
        setBorder({ ...border, neighborhoodColor: color });
        break;
    }
    //setBorder({ nameColor: color });
  };

  const sendData = () => {
    setExist(false);
    setLoading(true);
    parentCallback(1);
  };

  const sendData2 = () => {
    setExist(false);
    setLoading(true);
    parentCallback(4);
  };

  const sendAddress = () => {
    optionalAddressForm(address);
  };

  useEffect(() => {
    setLoading(false);
  }, []);

  let locationButtons = (
    <View
      style={{
        flexDirection: "row",
        alignSelf: "flex-start",
        flex: 2,
        //backgroundColor: "green",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <TouchableOpacity
        style={[styles.gpsButton, { marginRight: WIDTH * 0.03 }]}
        onPress={sendData}
      >
        <MaterialIcons
          name="location-searching"
          size={HEIGHT * 0.028}
          color="#335CDC"
        />
        <Text style={[styles.gpsButtonText, { color: "#335CDC" }]}>
          Buscar ubicación
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.gpsButton} onPress={sendData2}>
        <MaterialIcons
          name="my-location"
          size={HEIGHT * 0.028}
          color="#223995"
        />
        <Text style={styles.gpsButtonText}>Ubicación actual</Text>
      </TouchableOpacity>
    </View>
  );

  let locationFormContent = (
    <View style={styles.addressFormContainer}>
      <Text style={styles.validatedAddress}>
        ¡Ubicación establecida correctamente!
      </Text>
      <Text style={styles.optionalText}>Información opcional</Text>
      <Text style={styles.elementText}>Calle y número</Text>
      <TextInput
        style={[styles.textInput, { borderColor: border.streetColor }]}
        onChangeText={(text) => setAddress({ ...address, street: text })}
        value={address.street}
        maxLength={39}
        onFocus={() => changeBorder(1, "rgba(0,158,227,1)")}
        onBlur={() => {
          changeBorder(1, "gray");
          sendAddress();
        }}
      />
      <Text style={styles.elementText}>Entre</Text>
      <View
        style={{
          flexDirection: "row",
          alignSelf: "flex-start",
        }}
      >
        <TextInput
          style={[
            styles.textInput,
            { borderColor: border.street_1Color, width: "46.8%" },
          ]}
          onChangeText={(text) => setAddress({ ...address, street_1: text })}
          value={address.street_1}
          maxLength={18}
          onFocus={() => changeBorder(2, "rgba(0,158,227,1)")}
          onBlur={() => {
            changeBorder(2, "gray");
            sendAddress();
          }}
        />
        <Text style={styles.betweenStreetsText}>y</Text>
        <TextInput
          style={[
            styles.textInput,
            { borderColor: border.street_2Color, width: "46.8%" },
          ]}
          onChangeText={(text) => setAddress({ ...address, street_2: text })}
          value={address.street_2}
          maxLength={18}
          onFocus={() => changeBorder(3, "rgba(0,158,227,1)")}
          onBlur={() => {
            changeBorder(3, "gray");
            sendAddress();
          }}
        />
      </View>
      <Text style={styles.elementText}>Referencias</Text>
      <TextInput
        style={[styles.textInput, { borderColor: border.referencesColor }]}
        onChangeText={(text) => setAddress({ ...address, references: text })}
        value={address.references}
        maxLength={39}
        onFocus={() => changeBorder(4, "rgba(0,158,227,1)")}
        onBlur={() => {
          changeBorder(4, "gray");
          sendAddress();
        }}
      />
      <Text style={styles.elementText}>Colonia</Text>
      <TextInput
        style={[styles.textInput, { borderColor: border.neighborhoodColor }]}
        onChangeText={(text) => setAddress({ ...address, neighborhood: text })}
        value={address.neighborhood}
        maxLength={39}
        onFocus={() => changeBorder(5, "rgba(0,158,227,1)")}
        onBlur={() => {
          changeBorder(5, "gray");
          sendAddress();
        }}
      />
    </View>
  );

  return (
    <View style={styles.cardContent}>
      {loading ? (
        <ActivityIndicator
          size="large"
          color="rgba(0,158,227,1)"
          animating={loading}
          style={{ marginTop: HEIGHT * 0.02 }}
        />
      ) : (
        locationButtons
      )}

      {exist ? locationFormContent : null}
    </View>
  );
};

export default LocationForm;

const styles = StyleSheet.create({
  cardContent: {
    flex: 1,
    alignItems: "stretch",
    alignContent: "stretch",
    justifyContent: "center",
    backgroundColor: "white",
    width: "100%",
    height: "100%",
  },
  addressFormContainer: {
    flex: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    width: "100%",
    height: "100%",
    paddingHorizontal: WIDTH * 0.015,
  },
  gpsButton: {
    backgroundColor: "white",
    width: "48%",
    height: HEIGHT * 0.051,
    borderRadius: 45,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.46,
    shadowRadius: 11.14,
    elevation: 17,
  },
  gpsButtonText: {
    fontSize: HEIGHT * 0.021,
    alignSelf: "center",
    fontWeight: "bold",
    color: "#223995",
    textAlign: "center",
  },
  buttonText: {
    fontSize: HEIGHT * 0.02,
    alignSelf: "center",
    color: "white",
    textAlign: "center",
  },
  elementText: {
    fontSize: HEIGHT * 0.02,
    fontWeight: "bold",
    marginBottom: HEIGHT * 0.004,
    alignSelf: "flex-start",
  },
  optionalText: {
    fontSize: HEIGHT * 0.019,
    color: "gray",
    alignSelf: "flex-start",
    fontStyle: "italic",
    marginTop: HEIGHT * 0.016,
  },
  validatedAddress: {
    fontSize: HEIGHT * 0.019,
    color: "#28BF07",
    textAlign: "center",
  },
  textInput: {
    borderWidth: 0.5,
    borderColor: "gray",
    backgroundColor: "transparent",
    width: "100%",
    height: HEIGHT * 0.044,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    fontSize: HEIGHT * 0.019,
    paddingLeft: WIDTH * 0.015,
    marginBottom: WIDTH * 0.02,
    alignSelf: "flex-start",
  },
  betweenStreetsText: {
    alignSelf: "center",
    fontSize: HEIGHT * 0.021,
    marginHorizontal: "2%",
  },
});
