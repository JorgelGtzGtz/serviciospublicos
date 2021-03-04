import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-community/picker";
import Base64 from "../components/Base64";
import { Ionicons } from "@expo/vector-icons";
import Modal from "react-native-modal";
import { FontAwesome5 } from "@expo/vector-icons";

const { width: WIDTH, height: HEIGHT } = Dimensions.get("screen");

const RegisterCard = ({ parentCallback, url, editableUser, isEditing }) => {
  const sendData = (value, user) => {
    parentCallback(value, user);
  };

  const sendUser = (usuario) => {
    parentCallback(usuario);
  };

  const [visibleModal, setVisibleModal] = useState(null);
  const [editingModal, setEditingModal] = useState(null);
  const [termModal, setTermModal] = useState(null);
  let [loading, setLoading] = useState(false);
  let [loadingModal, setLoadingModal] = useState(false);
  const [gender, setGender] = useState(
    editableUser !== null && isEditing
      ? editableUser.Genero_usuario === "M"
        ? "Masculino"
        : "Femenino"
      : "Masculino"
  );
  let [user, setUser] = useState({
    name:
      editableUser === null && !isEditing ? "" : editableUser.Nombre_usuario,
    phone:
      editableUser === null && !isEditing ? "" : editableUser.Telefono_usuario,
    user_gender:
      editableUser === null && !isEditing ? "" : editableUser.Genero_usuario,
    email:
      editableUser === null && !isEditing ? "" : editableUser.Correo_usuario,
    userName:
      editableUser === null && !isEditing ? "" : editableUser.Login_usuario,
    password: "",
    confirmPassword: "",
  });
  let [border, setBorder] = useState({
    nameColor: "#000",
    phoneColor: "#000",
    emailColor: "#000",
    userNameColor: "#000",
    passwordColor: "#000",
    confirmPasswordColor: "#000",
  });

  let [errorMsg, setErrorMsg] = useState({
    nameError: "",
    phoneError: "",
    emailError: "",
    userNameError: "",
    passwordError: "",
    confirmPasswordError: "",
  });

  let changeBorder = (field, color) => {
    switch (field) {
      case 1:
        setBorder({ ...border, nameColor: color });
        break;
      case 2:
        setBorder({ ...border, phoneColor: color });
        break;
      case 3:
        setBorder({ ...border, emailColor: color });
        break;
      case 4:
        setBorder({ ...border, userNameColor: color });
        break;
      case 5:
        setBorder({ ...border, passwordColor: color });
        break;
      case 6:
        setBorder({ ...border, confirmPasswordColor: color });
        break;
    }
    //setBorder({ nameColor: color });
  };

  let loadingCircle = (
    <ActivityIndicator size="small" color="white" animating={loading} />
  );

  let loadingCircleModal = (
    <View
      style={[
        styles.modalContent,
        { backgroundColor: "transparent", justifyContent: "center" },
      ]}
    >
      <ActivityIndicator
        size="large"
        color="rgba(0,158,227,1)"
        animating={loadingModal}
      />
    </View>
  );

  let isNumeric = (n) => {
    return !isNaN(parseFloat(n)) && isFinite(n);
  };

  let isIntNumber = (n) => {
    let x = true;
    for (let i = 0; i < n.length; i++) if (n.charAt(i) === ".") x = false;
    return x;
  };

  let validateField = (field) => {
    switch (field) {
      case 1:
        if (user.name.trim() === "") {
          changeBorder(field, "red");
          setErrorMsg({ ...errorMsg, nameError: "Ingresa un nombre valido" });
          setUser({ ...user, name: "" });
        } else {
          changeBorder(field, "#000");
        }
        break;
      case 2:
        if (
          user.phone.trim().length !== 10 ||
          !isNumeric(user.phone.trim()) ||
          parseInt(user.phone.trim()) <= 0 ||
          !isIntNumber(user.phone.trim())
        ) {
          changeBorder(field, "red");
          setErrorMsg({ ...errorMsg, phoneError: "Ingresa 10 digitos" });
          setUser({ ...user, phone: "" });
        } else {
          changeBorder(field, "#000");
        }
        break;
      case 3:
        if (!validateEmail(user.email)) {
          changeBorder(field, "red");
          setErrorMsg({ ...errorMsg, emailError: "Ingresa un correo valido" });
          setUser({ ...user, email: "" });
        } else {
          changeBorder(field, "#000");
        }
        break;
      case 4:
        if (user.userName.trim() === "") {
          changeBorder(field, "red");
          setErrorMsg({
            ...errorMsg,
            userNameError: "Ingresa un usuario valido",
          });
          setUser({ ...user, userName: "" });
        } else {
          changeBorder(field, "#000");
        }
        break;
      case 5:
        if (user.password === "" || !validatePassword(user.password)) {
          changeBorder(field, "red");
          setErrorMsg({
            ...errorMsg,
            passwordError:
              "Letra mayúscula, número y 8 caracteres al menos son requeridos",
          });
          setUser({ ...user, password: "" });
        } else {
          changeBorder(field, "#000");
        }
        break;
      case 6:
        if (
          user.confirmPassword === "" ||
          user.confirmPassword !== user.password
        ) {
          changeBorder(field, "red");
          setErrorMsg({
            ...errorMsg,
            confirmPasswordError: "Las contraseñas no coinciden",
          });
          setUser({ ...user, confirmPassword: "" });
        } else {
          changeBorder(field, "#000");
        }
        break;
    }
  };

  let userLogin = (usuario, password) => {
    fetch(url + "/api/Usuario/Login/", {
      method: "POST",
      headers: {
        Authorization:
          "Basic " + Base64.btoa(usuario + ":" + Base64.btoa(password)),
        "Content-Type": "application/json",
      },
    }).then(async (response) => {
      let data = await response.json();
      if (response.status === 200) {
        //USUARIO CORRECTO
        setEditingModal(null);
        setTermModal(null);
        data.Password_usuario = Base64.atob(data.Password_usuario);
        sendData(4, data);
      } else {
        //USUARIO NO ENCONTRADO
      }
    });
  };

  let registerUser = () => {
    setLoading(false);
    setLoadingModal(true);
    fetch(url + "/api/Usuario/Registrar/", {
      method: "POST",
      headers: {
        Authorization:
          "Basic " + Base64.btoa("incognito" + ":" + Base64.btoa("incognito")),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Nombre_usuario: user.name,
        Correo_usuario: user.email,
        Telefono_usuario: user.phone.trim(),
        Genero_usuario: gender.charAt(0),
        ID_tipoUsuario: 1,
        Login_usuario: user.userName.trim(),
        Password_usuario: Base64.btoa(user.password),
        Estatus_usuario: true,
        Jefe_asignado: false,
        Disponible: true,
        Confirmado: false,
      }),
    }).then(async (response) => {
      let data = await response.json();
      if (response.status >= 200 && response.status < 300) {
        //USUARIO REGISTRADO
        userLogin(user.userName, user.password);
      } else {
        //USUARIO NO ENCONTRADO
        console.log("REGISTRO FALLIDO");
      }
    });
  }; //response.status >= 200 && response.status < 300

  let modifyUser = () => {
    setLoadingModal(true);
    fetch(url + "/api/Usuario/Actualizar", {
      method: "PUT",
      headers: {
        Authorization:
          "Basic " + Base64.btoa("incognito" + ":" + Base64.btoa("incognito")),
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ID_usuario: editableUser.ID_usuario,
        Nombre_usuario: user.name,
        Correo_usuario: user.email,
        Telefono_usuario: user.phone.trim(),
        Genero_usuario: gender.charAt(0),
        ID_tipoUsuario: editableUser.ID_tipoUsuario,
        Login_usuario: user.userName.trim(),
        Password_usuario: Base64.btoa(user.password),
        Estatus_usuario: editableUser.Estatus_usuario,
        Jefe_asignado: editableUser.Jefe_asignado,
        Disponible: editableUser.Disponible,
        Confirmado: editableUser.Confirmado,
      }),
    })
      .then(async (response) => {
        let data = await response;
        if (response.status >= 200 && response.status < 300) {
          console.log("EDICION COMPLETADA");
          userLogin(user.userName, user.password);
        }
      })
      .catch((error) => {
        console.log("ERROR EDICION", error);
      });
  };

  let verifyPhoneAvailability = () => {
    setLoading(true);
    fetch(url + "/api/Usuario/GetUsuarioByTel?telefonoUsuario=" + user.phone, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization:
          "Basic " + Base64.btoa("incognito" + ":" + Base64.btoa("incognito")),
      },
    })
      .then(async (response) => {
        let data = await response.json();
        if (response.status === 200) {
          if (
            data === null ||
            (data !== null &&
              editableUser !== null &&
              isEditing &&
              editableUser.Telefono_usuario === user.phone)
          ) {
            verifyEmailAvailability();
          } else {
            changeBorder(2, "red");
            setErrorMsg({ ...errorMsg, phoneError: "El número ya existe" });
            setUser({ ...user, phone: "" });
            setLoading(false);
          }
        } else {
          //error
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  let verifyEmailAvailability = () => {
    setLoading(true);
    fetch(url + "/api/Usuario/GetUsuarioByEmail?correoUsuario=" + user.email, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization:
          "Basic " + Base64.btoa("incognito" + ":" + Base64.btoa("incognito")),
      },
    })
      .then(async (response) => {
        let data = await response.json();
        if (response.status === 200) {
          if (
            data === null ||
            (data !== null &&
              editableUser !== null &&
              isEditing &&
              editableUser.Correo_usuario === user.email)
          ) {
            verifyUserAvailability();
          } else {
            changeBorder(3, "red");
            setErrorMsg({ ...errorMsg, emailError: "El correo ya existe" });
            setUser({ ...user, email: "" });
            setLoading(false);
          }
        } else {
          //error
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
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
        selectedValue={gender}
        onValueChange={(itemValue, itemIndex) => {
          setGender(itemValue);
          setUser({ ...user, user_gender: itemValue.charAt(0) });
          setVisibleModal(null);
        }}
      >
        <Picker.Item label="Masculino" value="Masculino" />
        <Picker.Item label="Femenino" value="Femenino" />
      </Picker>
    </View>
  );

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

  let editModal = () =>
    loadingModal ? (
      loadingCircleModal
    ) : (
      <View
        style={[
          styles.modalContent,
          { justifyContent: "flex-end", paddingTop: HEIGHT * 0.035 },
        ]}
      >
        <FontAwesome5 name="user-edit" size={HEIGHT * 0.03} color="black" />
        <Text style={[styles.modalText, { textAlign: "center" }]}>
          ¿Deseas guardar los cambios?
        </Text>

        <View style={styles.modalFooter}>
          {_renderButton(
            "Rechazar",
            "transparent",
            () => {
              setEditingModal(null);
              setLoading(false);
            },
            "gray",
            "bold"
          )}
          {_renderButton(
            "Aceptar",
            "rgba(0,158,227,1)",
            () => {
              setLoading(false);
              modifyUser();
            },
            "white",
            "normal"
          )}
        </View>
      </View>
    );

  let termsAndConditionsModal = () =>
    loadingModal ? (
      loadingCircleModal
    ) : (
      <View
        style={[
          styles.modalContent,
          {
            justifyContent: "flex-end",
            paddingTop: HEIGHT * 0.027,
            flex: 1,
            backgroundColor: "#E5E7E9",
          },
        ]}
      >
        <Text style={[styles.modalHeaderText, { textAlign: "center" }]}>
          Términos y condiciones
        </Text>
        <ScrollView contentContainerStyle={styles.modalScrollView}>
          <Text style={styles.termsText}>
            Al descargar o usar la aplicación, estos términos se aplicarán
            automáticamente a usted; por lo tanto, debe asegurarse de leerlos
            detenidamente antes de usar la aplicación. No se le permite copiar
            ni modificar la aplicación, ninguna parte de la aplicación o
            nuestras marcas comerciales de ninguna manera. No tiene permitido
            intentar extraer el código fuente de la aplicación y tampoco debe
            intentar traducir la aplicación a otros idiomas o hacer versiones
            derivadas. La aplicación en sí, y todas las marcas comerciales,
            derechos de autor, derechos de bases de datos y otros derechos de
            propiedad intelectual relacionados con ella, siguen perteneciendo al
            H. Ayuntamiento de Cajeme. H. Ayuntamiento de Cajeme se compromete a
            garantizar que la aplicación sea lo más útil y eficiente posible.
            Por esa razón, nos reservamos el derecho de realizar cambios en la
            aplicación o cobrar por sus servicios, en cualquier momento y por
            cualquier motivo. Nunca le cobraremos por la aplicación o sus
            servicios sin dejarle muy claro exactamente por qué está pagando. La
            aplicación Servicios públicos almacena y procesa los datos
            personales que nos ha proporcionado, para poder brindar nuestro
            Servicio. Es su responsabilidad mantener su teléfono y el acceso a
            la aplicación seguros. Por lo tanto, le recomendamos que no haga
            jailbreak ni rootee su teléfono, que es el proceso de eliminar las
            restricciones y limitaciones de software impuestas por el sistema
            operativo oficial de su dispositivo. Podría hacer que su teléfono
            sea vulnerable a malware / virus / programas maliciosos, comprometer
            las funciones de seguridad de su teléfono y podría significar que la
            aplicación Servicios públicos no funcionará correctamente o no
            funcionará en absoluto. La aplicación utiliza servicios de terceros
            que declaran sus propios términos y condiciones. Debe tener en
            cuenta que hay ciertas cosas de las que H. Ayuntamiento de Cajeme no
            se responsabiliza. Ciertas funciones de la aplicación requerirán que
            la aplicación tenga una conexión a Internet activa. La conexión
            puede ser Wi-Fi, o provista por su proveedor de red móvil, pero H.
            Ayuntamiento de Cajeme no puede asumir la responsabilidad de que la
            aplicación no funcione con todas sus funciones si usted no tiene
            acceso a Wi-Fi y no lo tiene. le queda parte de su asignación de
            datos. Si está utilizando la aplicación fuera de un área con Wi-Fi,
            debe recordar que los términos del acuerdo con su proveedor de red
            móvil se seguirán aplicando. Como resultado, su proveedor de
            telefonía móvil puede cobrarle el costo de los datos durante la
            duración de la conexión mientras accede a la aplicación, u otros
            cargos de terceros. Al usar la aplicación, acepta la responsabilidad
            de dichos cargos, incluidos los cargos de datos de roaming si usa la
            aplicación fuera de su territorio de origen (es decir, región o
            país) sin desactivar el roaming de datos. Si no es el pagador de
            facturas del dispositivo en el que está utilizando la aplicación,
            tenga en cuenta que asumimos que ha recibido el permiso del pagador
            de facturas para utilizar la aplicación. En la misma línea, H.
            Ayuntamiento de Cajeme no siempre puede asumir la responsabilidad de
            la forma en que usa la aplicación, es decir, debe asegurarse de que
            su dispositivo permanezca cargado, si se queda sin batería y no
            puede encenderlo para aprovechar el Service, H. Ayuntamiento de
            Cajeme no se hace responsable. conexión mientras accede a la
            aplicación, u otros cargos de terceros. Al usar la aplicación,
            acepta la responsabilidad de dichos cargos, incluidos los cargos de
            datos de roaming si usa la aplicación fuera de su territorio de
            origen (es decir, región o país) sin desactivar el roaming de datos.
            Si no es el pagador de facturas del dispositivo en el que está
            utilizando la aplicación, tenga en cuenta que asumimos que ha
            recibido el permiso del pagador de facturas para utilizar la
            aplicación. En la misma línea, H. Ayuntamiento de Cajeme no siempre
            puede asumir la responsabilidad de la forma en que usa la
            aplicación, es decir, debe asegurarse de que su dispositivo
            permanezca cargado, si se queda sin batería y no puede encenderlo
            para aprovechar el Service, H. Ayuntamiento de Cajeme no se hace
            responsable. recibido el permiso del pagador de facturas para
            utilizar la aplicación. En la misma línea, H. Ayuntamiento de Cajeme
            no siempre puede asumir la responsabilidad de la forma en que usa la
            aplicación, es decir, debe asegurarse de que su dispositivo
            permanezca cargado, si se queda sin batería y no puede encenderlo
            para aprovechar el Service, H. Ayuntamiento de Cajeme no se hace
            responsable.
          </Text>
        </ScrollView>

        <View style={[styles.modalFooter, { height: "10%" }]}>
          {_renderButton(
            "Rechazar",
            "transparent",
            () => {
              setTermModal(null);
              setLoading(false);
            },
            "gray",
            "bold"
          )}
          {_renderButton(
            "Aceptar",
            "rgba(0,158,227,1)",
            () => {
              registerUser();
            },
            "white",
            "normal"
          )}
        </View>
      </View>
    );

  let verifyUserAvailability = () => {
    setLoading(true);
    fetch(
      url + "/api/Usuario/GetUsuarioByLogin?loginUsuario=" + user.userName,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization:
            "Basic " +
            Base64.btoa("incognito" + ":" + Base64.btoa("incognito")),
        },
      }
    )
      .then(async (response) => {
        let data = await response.json();
        if (response.status === 200) {
          if (
            data === null ||
            (data !== null &&
              editableUser !== null &&
              isEditing &&
              editableUser.Login_usuario === user.userName)
          ) {
            if (editableUser !== null && isEditing) setEditingModal(1);
            else setTermModal(1); //registerUser();
          } else {
            changeBorder(4, "red");
            setErrorMsg({ ...errorMsg, userNameError: "El usuario ya existe" });
            setUser({ ...user, userName: "" });
            setLoading(false);
          }
        } else {
          //error
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  let validateForm = () => {
    if (!loading) {
      verifyPhoneAvailability();
    }
  };

  let validatePassword = (pass) => {
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)([A-Za-z\d]|[^ ]){8}$/;
    return re.test(String(pass));
  };

  let validateEmail = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  return (
    <View style={styles.container}>
      <View style={styles.cardHeader}>
        <Text style={styles.headerText}>
          {isEditing && editableUser !== null ? "Modifica" : "Ingresa"} tus
          datos
        </Text>
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.elementText}>Nombre completo</Text>
        <TextInput
          style={[styles.textInput, { borderColor: border.nameColor }]}
          onFocus={() => {
            changeBorder(1, "rgba(0,158,227,1)");
            setErrorMsg({ ...errorMsg, nameError: "" });
          }}
          onBlur={() => validateField(1)}
          onChangeText={(text) => setUser({ ...user, name: text })}
          value={user.name}
          placeholder={errorMsg.nameError}
          placeholderTextColor={"#EE7B7B"}
          autoCapitalize={"words"}
          maxLength={39}
        />
        <View style={[styles.rowContent, { alignContent: "space-between" }]}>
          <Text style={styles.elementText}>Teléfono</Text>
          <Text style={[styles.elementText, { marginLeft: 2 }]}>Sexo</Text>
        </View>
        <View style={styles.rowContent}>
          <TextInput
            style={[
              styles.textInput,
              {
                width: "49%",
                marginRight: WIDTH * 0.01,
                borderColor: border.phoneColor,
              },
            ]}
            onFocus={() => {
              changeBorder(2, "rgba(0,158,227,1)");
              setErrorMsg({ ...errorMsg, phoneError: "" });
            }}
            onBlur={() => validateField(2)}
            onChangeText={(text) => setUser({ ...user, phone: text })}
            value={user.phone}
            keyboardType="numeric"
            placeholder={errorMsg.phoneError}
            placeholderTextColor={"#EE7B7B"}
          />
          <View style={styles.pickerContainer}>
            {Platform.OS === "android" ? (
              <Picker
                style={styles.picker}
                selectedValue={gender}
                onValueChange={(itemValue, itemIndex) => {
                  setGender(itemValue);
                  setUser({ ...user, user_gender: itemValue.charAt(0) });
                }}
              >
                <Picker.Item label="Masculino" value="Masculino" />
                <Picker.Item label="Femenino" value="Femenino" />
              </Picker>
            ) : (
              <TouchableOpacity
                style={styles.iosPickerButton}
                onPress={() => setVisibleModal(1)}
              >
                <Text style={styles.iosPickerText}>{gender}</Text>
                <Ionicons name="ios-arrow-dropdown" size={24} color="black" />
              </TouchableOpacity>
            )}
          </View>
        </View>
        <Text style={styles.elementText}>Correo electronico</Text>
        <TextInput
          style={[styles.textInput, { borderColor: border.emailColor }]}
          autoCompleteType="email"
          onFocus={() => {
            changeBorder(3, "rgba(0,158,227,1)");
            setErrorMsg({ ...errorMsg, emailError: "" });
          }}
          onBlur={() => validateField(3)}
          onChangeText={(text) => setUser({ ...user, email: text })}
          value={user.email}
          placeholder={errorMsg.emailError}
          placeholderTextColor={"#EE7B7B"}
          autoCapitalize={"none"}
          maxLength={39}
        />
        <Text style={styles.elementText}>Nombre de usuario</Text>
        <TextInput
          style={[styles.textInput, , { borderColor: border.userNameColor }]}
          onFocus={() => {
            changeBorder(4, "rgba(0,158,227,1)");
            setErrorMsg({ ...errorMsg, userNameError: "" });
          }}
          onBlur={() => validateField(4)}
          onChangeText={(text) => setUser({ ...user, userName: text.trim() })}
          value={user.userName}
          placeholder={errorMsg.userNameError}
          placeholderTextColor={"#EE7B7B"}
          autoCapitalize={"none"}
          maxLength={49}
        />
        <Text style={styles.elementText}>Contraseña</Text>
        <TextInput
          style={[styles.textInput, { borderColor: border.passwordColor }]}
          onFocus={() => {
            changeBorder(5, "rgba(0,158,227,1)");
            setErrorMsg({ ...errorMsg, passwordError: "" });
          }}
          onBlur={() => validateField(5)}
          onChangeText={(text) => setUser({ ...user, password: text })}
          value={user.password}
          secureTextEntry={true}
          placeholder={errorMsg.passwordError}
          placeholderTextColor={"#EE7B7B"}
          autoCapitalize={"none"}
          maxLength={8}
        />
        <Text style={styles.elementText}>Confirmar contraseña</Text>
        <TextInput
          style={[
            styles.textInput,
            { borderColor: border.confirmPasswordColor },
          ]}
          onFocus={() => {
            changeBorder(6, "rgba(0,158,227,1)");
            setErrorMsg({ ...errorMsg, confirmPasswordError: "" });
          }}
          onBlur={() => validateField(6)}
          onChangeText={(text) => setUser({ ...user, confirmPassword: text })}
          value={user.confirmPassword}
          secureTextEntry={true}
          placeholder={errorMsg.confirmPasswordError}
          placeholderTextColor={"#EE7B7B"}
          autoCapitalize={"none"}
          maxLength={8}
        />
      </View>

      <View style={styles.cardFooter}>
        {!loading ? (
          <TouchableOpacity
            style={[
              styles.nextButton,
              { backgroundColor: "transparent", height: HEIGHT * 0.037 },
            ]}
            onPress={() => sendData(null)}
          >
            <Text
              style={[styles.buttonText, { color: "gray", fontWeight: "bold" }]}
            >
              Cancelar
            </Text>
          </TouchableOpacity>
        ) : null}

        {user.name !== "" &&
        user.phone !== "" &&
        user.email !== "" &&
        user.userName !== "" &&
        user.password !== "" &&
        user.confirmPassword !== "" ? (
          <TouchableOpacity style={styles.nextButton} onPress={validateForm}>
            {loading ? (
              loadingCircle
            ) : (
              <Text style={styles.buttonText}>
                {" "}
                {isEditing && editableUser !== null
                  ? "Modificar"
                  : "Registrar"}{" "}
              </Text>
            )}
          </TouchableOpacity>
        ) : null}
      </View>
      <Modal isVisible={visibleModal === 1}>{_renderModalContent()}</Modal>
      <Modal isVisible={editingModal === 1}>{editModal()}</Modal>
      <Modal isVisible={termModal === 1} propagateSwipe={true}>
        {termsAndConditionsModal()}
      </Modal>
    </View>
  );
};

export default RegisterCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  cardHeader: {
    flex: 3,
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
    paddingHorizontal: WIDTH * 0.02,
    paddingVertical: HEIGHT * 0.03,
  },
  elementText: {
    fontSize: HEIGHT * 0.019,
    fontWeight: "bold",
    alignSelf: "flex-start",
    marginRight: WIDTH * 0.29,
    marginTop: WIDTH * 0.014,
  },
  errorMsgText: {
    fontSize: HEIGHT * 0.014,
    alignSelf: "flex-start",
    marginRight: WIDTH * 0.2,
    color: "red",
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
    fontSize: HEIGHT * 0.024,
    fontWeight: "bold",
  },
  rowContent: {
    flexDirection: "row",
    alignSelf: "flex-start",
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
  textInput: {
    borderWidth: 0.5,
    borderColor: "gray",
    backgroundColor: "transparent",
    width: "100%",
    height: HEIGHT * 0.043,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    fontSize: HEIGHT * 0.018,
    paddingLeft: WIDTH * 0.015,
    alignSelf: "flex-start",
  },
  pickerContainer: {
    borderWidth: 0.5,
    borderColor: "#000",
    backgroundColor: "transparent",
    width: "49%",
    height: HEIGHT * 0.043,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  picker: {
    height: HEIGHT * 0.044,
    width: "100%",
    fontWeight: "bold",
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
    alignContent: "stretch",
    width: "100%",
    height: "100%",
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
  modalText: {
    fontSize: HEIGHT * 0.023,
    alignSelf: "center",
    fontWeight: "bold",
    marginHorizontal: WIDTH * 0.05,
    marginBottom: HEIGHT * 0.025,
  },
  modalHeaderText: {
    fontSize: HEIGHT * 0.021,
    alignSelf: "center",
    fontWeight: "bold",
    marginHorizontal: WIDTH * 0.05,
    marginBottom: HEIGHT * 0.02,
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
  termsText: {
    fontSize: HEIGHT * 0.012,
    marginHorizontal: WIDTH * 0.02,
  },
  modalScrollView: {
    width: "100%",
    height: HEIGHT,
    alignContent: "stretch",
    justifyContent: "center",
    backgroundColor: "white",
  },
});
