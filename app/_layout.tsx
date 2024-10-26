import { Stack } from "expo-router/stack";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { ImageSourcePropType, Image } from "react-native";
import { TouchableOpacity } from "react-native";
import React from "react";
import { router } from "expo-router";
export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          /*           headerStyle: {
            backgroundColor: "#050259",
          },
          headerTintColor: "#050259", */
        }}
      />
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="CrearEquipo"
        options={{
          headerStyle: {
            backgroundColor: "rgba(0, 175, 255, 0.125)",
          },
          headerTintColor: "#000",
          headerTitleStyle: {
            color: "#000",
            fontWeight: "bold",
          },
          headerTitle: "Crear Equipo",
        }}
      />
      <Stack.Screen
        name="CrearArea"
        options={{
          headerTitle: "Crear Area",
          headerStyle: {
            backgroundColor: "rgba(0, 175, 255, 0.125)",
          },
          headerTintColor: "#000",
          headerTitleStyle: {
            color: "#000",
            fontWeight: "bold",
          },
        }}
      />

      <Stack.Screen
        name="Area/AreaDetail"
        options={({ route }) => ({
          headerStyle: {
            backgroundColor: "rgba(0, 175, 255, 0.125)",
          },
          headerTintColor: "#000",
          headerTitleStyle: {
            color: "#000",
            fontWeight: "bold",
          },
          headerTitle:
            typeof route.params.nombre === "string"
              ? route.params.nombre
              : "Area",
        })}
      />
      <Stack.Screen
        name="ListarEquipos"
        options={{
          headerStyle: {
            backgroundColor: "rgba(0, 175, 255, 0.125)",
          },
          headerTintColor: "#000",
          headerTitleStyle: {
            color: "#000",
            fontWeight: "bold",
          },
          headerTitle: "Listar Equipos",
        }}
      />
      <Stack.Screen
        name="Equipo/EquipoDetail"
        options={({ route }) => ({
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: "#F2F2F2",
          },
          headerTintColor: "#000",
          headerTitleStyle: {
            color: "#000",
            fontWeight: "bold",
          },
          headerTitle:
            typeof route.params.title === "string"
              ? route.params.title
              : "Equipo",
        })}
      />

      <Stack.Screen
        name="Escaner/NfcReader"
        options={{
          headerShadowVisible: false,
          headerTitle: "",
          headerStyle: {
            backgroundColor: "#959595",
          },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Image
                source={require("../assets/images/backarrow.png")}
                style={{ width: 40, height: 20, marginLeft: 1 }}
              />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="Escaner/NfcWrite"
        options={{
          headerShadowVisible: false,
          headerTitle: "",
          headerStyle: {
            backgroundColor: "transparent",
          },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Image
                source={require("../assets/images/backarrow.png")}
                style={{ width: 40, height: 20, marginLeft: 1 }}
              />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="screens/login/admin"
        options={{
          headerShown: false,
        }}  
      />
         <Stack.Screen
        name="screens/login/jefeArea"
        options={{
          headerShown: false,
        }}  
      />
      <Stack.Screen
        name="screens/login/secretaria"
        options={{
          headerShown: false,
        }}  
      />
          <Stack.Screen
        name="screens/login/tecnico"
        options={{
          headerShown: false,
        }}  
      />
           <Stack.Screen
        name="screens/login/medico"
        options={{
          headerShown: false,
        }}  
      />
    </Stack>
    
  );
}
