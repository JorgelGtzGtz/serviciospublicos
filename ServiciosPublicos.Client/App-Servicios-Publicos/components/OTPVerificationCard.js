import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  Vibration,
} from "react-native";
const { width: WIDTH, height: HEIGHT } = Dimensions.get("screen");
import Base64 from "../components/Base64";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      one: "",
      two: "",
      three: "",
      four: "",
      oneFocus: false,
      twoFocus: false,
      threeFocus: false,
      fourFocus: false,
      code: (Math.floor(Math.random() * 9999) + 1000)
        .toString()
        .substring(0, 4),
      timer: 120,
      loading: false,
      error: false,
    };
  }

  PATTERN = [1 * 100, 1 * 200, 1 * 10, 1 * 200];

  sendConfirmationEmail = () => {
    fetch(this.props.url + "/api/Usuario/Send/" + parseInt(this.state.code), {
      method: "POST",
      headers: {
        Authorization:
          "Basic " +
          Base64.btoa(
            this.props.usuario.Login_usuario +
              ":" +
              Base64.btoa(this.props.usuario.Password_usuario)
          ),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(this.props.usuario),
    }).then(async (response) => {
      let data = await response;
      if (response.status >= 200 && response.status < 300) {
      } else {
        //USUARIO NO ENCONTRADO
        //console.log("REGISTRO FALLIDO");
      }
    });
  };

  confirmUser = () => {
    fetch(this.props.url + "/api/Usuario/Actualizar", {
      method: "PUT",
      headers: {
        Authorization:
          "Basic " +
          Base64.btoa(
            this.props.usuario.Login_usuario +
              ":" +
              Base64.btoa(this.props.usuario.Password_usuario)
          ),
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ID_usuario: this.props.usuario.ID_usuario,
        Correo_usuario: this.props.usuario.Correo_usuario,
        Disponible: this.props.usuario.Disponible,
        Estatus_usuario: this.props.usuario.Estatus_usuario,
        Genero_usuario: this.props.usuario.Genero_usuario,
        ID_tipoUsuario: this.props.usuario.ID_tipoUsuario,
        Jefe_asignado: this.props.usuario.Jefe_asignado,
        Login_usuario: this.props.usuario.Login_usuario,
        Nombre_usuario: this.props.usuario.Nombre_usuario,
        Password_usuario: Base64.btoa(this.props.usuario.Password_usuario),
        Telefono_usuario: this.props.usuario.Telefono_usuario,
        Confirmado: true,
      }),
    })
      .then(async (response) => {
        let data = await response;
        if (response.status >= 200 && response.status < 300) {
          console.log("VALIDACION COMPLETADA");
          this.userLogin(
            this.props.usuario.Login_usuario,
            this.props.usuario.Password_usuario
          );
        }
      })
      .catch((error) => {
        console.log("ERROR VALIDACION", error);
      });
  };

  userLogin = (usuario, password) => {
    fetch(this.props.url + "/api/Usuario/Login/", {
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
        data.Password_usuario = Base64.atob(data.Password_usuario);
        this.props.currentUser(data);
        console.log(data);
      } else {
        //USUARIO NO ENCONTRADO
      }
    });
  };

  timer = (time) => {
    let i = time;
    if (--i < 0) return;
    setTimeout(() => {
      this.setState({ timer: i });
      this.timer(this.state.timer);
    }, 1000);
  };

  minuteCountdown = (second) => {
    let minutes = second >= 120 ? 2 : second >= 60 ? 1 : 0;
    let seconds = minutes >= 1 ? second - 60 : second;
    return "0" + minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
  };

  resetCode = () => {
    this.setState({
      code: (Math.floor(Math.random() * 9999) + 1000)
        .toString()
        .substring(0, 4),
    });
    this.setState({ timer: 120 });
    console.log(this.state.code);
    this.timer(this.state.timer);
    this.sendConfirmationEmail();
  };

  componentDidMount() {
    this.refs.one.focus();
    this.sendConfirmationEmail();
    //console.log(this.state.code);
    /*for (let i = 30; i >= 1; i--) {
      //this.setState({ timer: (this.state.timer -= 1) });
      setTimeout(() => {
        this.setState({ timer: i });
      }, 1000);
    }*/
    //this.timer(this.state.timer);
  }

  handleChangeTextOne = (text) => {
    this.setState({ one: text }, () => {
      if (this.state.one) this.refs.two.focus();
    });
  };
  handleChangeTextTwo = (text) => {
    this.setState({ two: text }, () => {
      if (this.state.two) this.refs.three.focus();
    });
  };
  handleChangeTextThree = (text) => {
    this.setState({ three: text }, () => {
      if (this.state.three) this.refs.four.focus();
    });
  };
  handleChangeTextFour = (text) => {
    this.setState({ four: text });
    if (text !== "") this.refs.four.blur();
  };

  validateCode = () => {
    if (!this.state.loading) {
      this.setState({ loading: true });
      if (
        "" +
          this.state.one +
          this.state.two +
          this.state.three +
          this.state.four ===
        this.state.code
      )
        this.confirmUser();
      else {
        this.setState({
          loading: false,
          error: true,
          one: "",
          two: "",
          three: "",
          four: "",
        });
        Vibration.vibrate(this.PATTERN);
        this.refs.one.focus();
      }
    }
  };

  backspace = (id) => {
    if (id === "two") {
      if (this.state.two) {
        this.setState({ two: "" });
      } else if (this.state.one) {
        this.setState({ one: "" });
        this.refs.one.focus();
      }
    } else if (id === "three") {
      if (this.state.three) {
        this.setState({ three: "" });
      } else if (this.state.two) {
        this.setState({ two: "" });
        this.refs.two.focus();
      }
    } else if (id === "four") {
      if (this.state.four) {
        this.setState({ four: "" });
      } else if (this.state.three) {
        this.setState({ three: "" });
        this.refs.three.focus();
      }
    }
  };

  render() {
    const { oneFocus, twoFocus, threeFocus, fourFocus } = this.state;
    const oneStyle = {
      borderColor: oneFocus ? "rgba(0,158,227,1)" : "black",
      borderWidth: oneFocus ? 2 : 1,
    };
    const twoStyle = {
      borderColor: twoFocus ? "rgba(0,158,227,1)" : "black",
      borderWidth: twoFocus ? 2 : 1,
    };
    const threeStyle = {
      borderColor: threeFocus ? "rgba(0,158,227,1)" : "black",
      borderWidth: threeFocus ? 2 : 1,
    };
    const fourStyle = {
      borderColor: fourFocus ? "rgba(0,158,227,1)" : "black",
      borderWidth: fourFocus ? 2 : 1,
    };
    const textColor = {
      color: this.state.error ? "red" : "black",
    };
    return (
      <View style={styles.container}>
        <View style={styles.cardHeader}>
          <Text style={styles.headerText}>Verifica tu correo</Text>
        </View>

        <View style={styles.cardContent}>
          <Text style={[styles.elementText, { ...textColor }]}>
            Ingresa el código de 4 dígitos el cual fue enviado a tu correo
          </Text>
          <View style={styles.inputcontainer}>
            <TextInput
              ref="one"
              style={[styles.textInput, { ...oneStyle }]}
              autoCorrect={false}
              autoCapitalize="none"
              keyboardType="number-pad"
              caretHidden
              onFocus={() => this.setState({ oneFocus: true })}
              onBlur={() => this.setState({ oneFocus: false })}
              maxLength={1}
              onChangeText={(text) => {
                this.handleChangeTextOne(text);
              }}
              value={this.state.one}
            />
            <TextInput
              ref="two"
              onKeyPress={({ nativeEvent }) =>
                nativeEvent.key === "Backspace" ? this.backspace("two") : null
              }
              style={[styles.textInput, { ...twoStyle }]}
              autoCorrect={false}
              autoCapitalize="none"
              maxLength={1}
              onFocus={() => this.setState({ twoFocus: true })}
              onBlur={() => this.setState({ twoFocus: false })}
              caretHidden
              keyboardType="number-pad"
              onChangeText={(text) => {
                this.handleChangeTextTwo(text);
              }}
              value={this.state.two}
            />
            <TextInput
              ref="three"
              onKeyPress={({ nativeEvent }) =>
                nativeEvent.key === "Backspace" ? this.backspace("three") : null
              }
              style={[styles.textInput, { ...threeStyle }]}
              autoCorrect={false}
              autoCapitalize="none"
              onFocus={() => this.setState({ threeFocus: true })}
              onBlur={() => this.setState({ threeFocus: false })}
              maxLength={1}
              caretHidden
              keyboardType="number-pad"
              onChangeText={(text) => {
                this.handleChangeTextThree(text);
              }}
              value={this.state.three}
            />
            <TextInput
              ref="four"
              onKeyPress={({ nativeEvent }) =>
                nativeEvent.key === "Backspace" ? this.backspace("four") : null
              }
              style={[styles.textInput, { ...fourStyle }]}
              autoCorrect={false}
              autoCapitalize="none"
              onFocus={() => this.setState({ fourFocus: true })}
              onBlur={() => this.setState({ fourFocus: false })}
              maxLength={1}
              caretHidden
              keyboardType="number-pad"
              onChangeText={(text) => {
                this.handleChangeTextFour(text);
              }}
              value={this.state.four}
            />
          </View>
          <Text style={styles.elementText}>
            {/*this.minuteCountdown(this.state.timer)*/}
          </Text>

          {!this.state.loading ? (
            <TouchableOpacity
              style={styles.reSendButton}
              onPress={() => this.sendConfirmationEmail()}
            >
              <Text style={styles.buttonTransparentText}>Reenviar correo</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        <View style={styles.cardFooter}>
          {this.state.one &&
          this.state.two &&
          this.state.three &&
          this.state.four ? (
            <TouchableOpacity
              style={styles.nextButton}
              onPress={() => this.validateCode()}
            >
              {this.state.loading ? (
                <ActivityIndicator
                  size="small"
                  color="white"
                  animating={this.state.loading}
                />
              ) : (
                <Text style={styles.buttonText}>Enviar</Text>
              )}
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    );
  }
}

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
    paddingHorizontal: 50,
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
  inputcontainer: {
    height: "20%",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    paddingHorizontal: "5%",
    marginBottom: "2%",
  },
  textInput: {
    fontSize: 22,
    textAlign: "center",
    width: "15%",
    height: "50%",
    borderRadius: 5,
  },
  headerText: {
    fontSize: HEIGHT * 0.022,
    fontWeight: "bold",
  },
  buttonText: {
    fontSize: HEIGHT * 0.02,
    alignSelf: "center",
    color: "white",
  },
  buttonTransparentText: {
    fontSize: HEIGHT * 0.02,
    alignSelf: "center",
    fontWeight: "bold",
    color: "rgba(0,158,227,1)",
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
  reSendButton: {
    backgroundColor: "transparent",
    width: "40%",
    height: HEIGHT * 0.038,
    alignItems: "center",
    justifyContent: "center",
    marginTop: HEIGHT * 0.01,
  },
  elementText: {
    fontSize: HEIGHT * 0.021,
    fontWeight: "bold",
    textAlign: "center",
    marginHorizontal: WIDTH * 0.15,
  },
});
