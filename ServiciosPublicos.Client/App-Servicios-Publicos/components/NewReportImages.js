import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";

const { width: WIDTH, height: HEIGHT } = Dimensions.get("screen");

const NewReportImages = ({ parentCallback, currentImages }) => {
  let [images, setImages] = useState(currentImages);
  let [loading, setLoading] = useState(false);

  useEffect(() => {
    if (images.length >= 1)
      setImages(images.filter((image) => image != undefined));
  }, []);

  const sendData = () => {
    parentCallback(4, images);
  };

  let pushImage = (img) => {
    setImages(images.concat(img));
    setLoading(false);
  };

  let deleteImage = (index) => {
    if (!loading) {
      images[index] = undefined;
      setImages(images.filter((image) => image != undefined));
    }
  };

  let takePicture = async () => {
    const { granted } = await Permissions.askAsync(Permissions.CAMERA);
    if (granted) {
      setLoading(true);
      let data = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.3,
      });
      console.log(data);
      if (data !== undefined)
        if (!data.cancelled) pushImage(data);
        else setLoading(false);
    } else {
      console.log("Necesitas dar permiso");
      setLoading(false);
    }
  };

  let getGalleryPicture = async () => {
    const { granted } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (granted) {
      setLoading(true);
      let data = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.3,
      });
      console.log(data);
      if (data !== undefined)
        if (!data.cancelled) pushImage(data);
        else setLoading(false);
    } else {
      console.log("Necesitas dar permiso");
      setLoading(false);
    }
  };

  let buttons = (
    <View style={styles.imageButtonsContainer}>
      <TouchableOpacity style={styles.imageButton} onPress={takePicture}>
        <MaterialCommunityIcons
          name="camera"
          size={HEIGHT * 0.028}
          color="#223995"
        />
        <Text style={[styles.imageButtonText, { color: "#223995" }]}>
          Cámara
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.imageButton} onPress={getGalleryPicture}>
        <MaterialCommunityIcons
          name="image"
          size={HEIGHT * 0.028}
          color="#6E0BAE"
        />
        <Text style={styles.imageButtonText}>Galería</Text>
      </TouchableOpacity>
    </View>
  );

  let loadingCircle = (
    <View style={styles.imageButtonsContainer}>
      <ActivityIndicator
        size="large"
        color="rgba(0,158,227,1)"
        animating={loading}
        style={styles.imageButton}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.cardHeader}>
        <Text style={styles.headerText}>Fotos del reporte</Text>
      </View>

      <View style={styles.cardContent}>
        {images.length >= 1 ? (
          <View style={styles.imagesContainer}>
            <View style={styles.imagesTrioContainer}>
              <View style={styles.imageElement}>
                {images[0] !== undefined ? (
                  <ImageBackground
                    source={{ uri: images[0].uri }}
                    resizeMode="stretch"
                    style={{ height: "100%", width: "100%" }}
                  >
                    <MaterialCommunityIcons
                      name="close-circle"
                      size={WIDTH * 0.07}
                      color="red"
                      onPress={() => deleteImage(0)}
                    />
                  </ImageBackground>
                ) : null}
              </View>
              <View style={styles.imageElement}>
                {images.length >= 2 && images[1] !== undefined ? (
                  <ImageBackground
                    source={{ uri: images[1].uri }}
                    resizeMode="stretch"
                    style={{ height: "100%", width: "100%" }}
                  >
                    <MaterialCommunityIcons
                      name="close-circle"
                      size={WIDTH * 0.07}
                      color="red"
                      onPress={() => deleteImage(1)}
                    />
                  </ImageBackground>
                ) : null}
              </View>
            </View>
            <View style={styles.imagesTrioContainer}>
              <View style={styles.imageElement}>
                {images.length >= 3 && images[2] !== undefined ? (
                  <ImageBackground
                    source={{ uri: images[2].uri }}
                    resizeMode="stretch"
                    style={{ height: "100%", width: "100%" }}
                  >
                    <MaterialCommunityIcons
                      name="close-circle"
                      size={WIDTH * 0.07}
                      color="red"
                      onPress={() => deleteImage(2)}
                    />
                  </ImageBackground>
                ) : null}
              </View>
              <View style={styles.imageElement}>
                {images.length === 4 && images[3] !== undefined ? (
                  <ImageBackground
                    source={{ uri: images[3].uri }}
                    resizeMode="stretch"
                    style={{ height: "100%", width: "100%" }}
                  >
                    <MaterialCommunityIcons
                      name="close-circle"
                      size={WIDTH * 0.07}
                      color="red"
                      onPress={() => deleteImage(3)}
                    />
                  </ImageBackground>
                ) : null}
              </View>
            </View>
          </View>
        ) : (
          <Text style={styles.elementText}>No hay imagenes</Text>
        )}

        {images.length < 4 ? (loading ? loadingCircle : buttons) : null}
      </View>

      <View style={styles.cardFooter}>
        {!loading && images.length >= 1 ? (
          <TouchableOpacity style={styles.nextButton}>
            <Text style={styles.buttonText} onPress={sendData}>
              Siguiente
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

export default NewReportImages;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
    alignSelf: "stretch",
    justifyContent: "center",
    width: "100%",
    height: "100%",
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
  imagesContainer: {
    flex: 1,
    width: "100%",
    height: "85%",
    alignItems: "center",
    justifyContent: "center",
  },
  imagesTrioContainer: {
    flex: 1,
    width: "100%",
    backgroundColor: "#E5E7E9",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    paddingVertical: "0.5%",
  },
  imageElement: {
    flex: 1,
    //backgroundColor: "yellow",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    margin: "0.5%",
    //borderWidth: 1,
    //borderColor: "gray",
  },
  imageButtonsContainer: {
    flexDirection: "row",
    alignSelf: "flex-end",
    width: "100%",
    height: "15%",
    alignItems: "center",
    justifyContent: "center",
  },
  imageButton: {
    backgroundColor: "white",
    width: "35%",
    height: HEIGHT * 0.048,
    borderRadius: 45,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginHorizontal: WIDTH * 0.015,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.46,
    shadowRadius: 11.14,
    elevation: 17,
  },
  imageButtonText: {
    fontSize: HEIGHT * 0.024,
    fontWeight: "bold",
    alignSelf: "center",
    color: "#6E0BAE",
  },
  buttonText: {
    fontSize: HEIGHT * 0.02,
    alignSelf: "center",
    color: "white",
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
});
