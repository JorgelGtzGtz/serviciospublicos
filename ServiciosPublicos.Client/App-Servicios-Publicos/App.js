import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import LoginScreen from "./screens/LoginScreen";
import MainMenu from "./screens/MainMenu";
import NewReportScreen from "./screens/NewReportScreen";
import EditReportScreen from "./screens/EditReportScreen";
import BurgerMenu from "./screens/BurgerMenu";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="LoginScreen"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="MainMenu" component={MainMenu} />
        <Stack.Screen name="NewReportScreen" component={NewReportScreen} />
        <Stack.Screen name="EditReportScreen" component={EditReportScreen} />
        <Stack.Screen name="BurgerMenu" component={BurgerMenu} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
