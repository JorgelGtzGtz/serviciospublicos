import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  BackHandler,
  ToastAndroid,
  Platform,
  Snackbar,
} from "react-native";
import WelcomeBar from "../components/WelcomeBar";
import CurrentDate from "../components/CurrentDate";
import ReportListUser from "../components/ReportListUser";
import ReportDetails from "../components/ReportDetails";
import ModifyReport from "../components/ModifyReport";
import ReportFilter from "../components/ReportFilter";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width: WIDTH, height: HEIGHT } = Dimensions.get("screen");

const MainMenu = ({ route, navigation }) => {
  const { user, url } = route.params;

  const [report, setReport] = useState(null);
  const [screen, setScreen] = useState(1);
  const [filterScreen, setFilterScreen] = useState(false);
  const [type, setType] = useState(0);
  const [status, setStatus] = useState(0);
  const [refresh, setRefresh] = useState(true);
  const [exitApp, setExitApp] = useState(0);
  const backAction = () => {
    setTimeout(() => {
      setExitApp(0);
    }, 2000); // 2 seconds to tap second-time

    if (exitApp === 0) {
      setExitApp(exitApp + 1);

      if (Platform.OS !== "android") {
        Snackbar.show({
          text: "Presiona de nuevo para salir",
          duration: Snackbar.LENGTH_SHORT,
        });
      } else {
        ToastAndroid.show("Presiona de nuevo para salir", ToastAndroid.SHORT);
      }
    } else if (exitApp === 1) {
      BackHandler.exitApp();
    }
    navigation.addListener("focus", () => {
      setFilterScreen(false);
      setType(0);
      setStatus(0);
      setReport(null);
      setRefresh(true);
      console.log("Refreshed");
    });
    return true;
  };

  const callbackFunction = (childData, value) => {
    if (childData === "NewReportScreen") {
      navigation.navigate(childData, {
        usuario: user,
        url: url,
      });
      setRefresh(false);
    } else {
      if (childData === true) setFilterScreen(childData);
      else {
        setReport(childData);
        setScreen(value);
      }
    }
  };

  const closeReport = (childData, value) => {
    navigation.navigate(childData, {
      report: report,
      firstScreen: value,
      url: url,
      usuario: user,
    });
  };

  const setFilters = (type, status) => {
    setType(type);
    setStatus(status);
    setFilterScreen(false);
  };

  const openBurger = () => {
    navigation.navigate("BurgerMenu", {
      user: user,
      url: url,
    });
  };

  let reportDetails = (
    <ReportDetails
      report={report}
      parentCallback={callbackFunction}
      url={url}
      usuario={user}
    />
  );

  let modifyReport = (
    <ModifyReport
      report={report}
      parentCallback={callbackFunction}
      EditReport={closeReport}
    />
  );

  let filter = (
    <ReportFilter
      url={url}
      usuario={user}
      typeSelected={type}
      parentCallback={setFilters}
      currentStatus={status}
    />
  );

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setFilterScreen(false);
      setType(0);
      setStatus(0);
      setReport(null);
      setRefresh(true);
      console.log("Refreshed");
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", backAction);
    };
  }, [backAction]);

  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <WelcomeBar user={user} parentCallBack={openBurger} />
      </View>
      <View style={styles.dateCard}>
        <CurrentDate />
      </View>
      <View style={styles.reportsCard}>
        {filterScreen ? (
          filter
        ) : report === null ? (
          refresh ? (
            <ReportListUser
              parentCallback={callbackFunction}
              user={user}
              url={url}
              type={type}
              status={status}
            />
          ) : null
        ) : screen === 1 ? (
          reportDetails
        ) : (
          modifyReport
        )}
      </View>
    </View>
  );
};

export default MainMenu;

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
  dateCard: {
    flex: 1,
    backgroundColor: "red",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: WIDTH * 0.05,
    borderRadius: 10,
    marginTop: -(HEIGHT * 0.02),
    marginBottom: HEIGHT * 0.01,
  },
  reportsCard: {
    flex: 15,
    backgroundColor: "#E5E7E9",
    alignItems: "center",
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
});
