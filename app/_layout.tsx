import { Stack } from "expo-router/stack";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { ImageSourcePropType, Image } from "react-native";
import { TouchableOpacity } from "react-native";
import { UserProvider } from "../app/UserContext";
import { NavigationContainer } from '@react-navigation/native';
import React from "react";
import { router } from "expo-router";
export default function Layout() {
  return (
    <UserProvider>
       <NavigationContainer>
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
              backgroundColor: "white",
            },
            headerShadowVisible: false,
            headerTintColor: "#000",
            headerTitleStyle: {
              color: "#000",
              fontWeight: "bold",
            },
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.back()}>
                <Image
                  source={require("../assets/images/backarrowblack.png")}
                  style={{ width: 40, height: 20, marginLeft: 20 }}
                />
              </TouchableOpacity>
            ),
            headerTitle: "Crear Equipo",
            headerTitleAlign: 'center'
          }}
        />
        <Stack.Screen
          name="CrearArea"
          options={{
            headerStyle: {
              backgroundColor: "white",
            },
            headerShadowVisible: false,
            headerTintColor: "#000",
            headerTitleStyle: {
              color: "#000",
              fontWeight: "bold",
            },
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.back()}>
                <Image
                  source={require("../assets/images/backarrowblack.png")}
                  style={{ width: 40, height: 20, marginLeft: 20 }}
                />
              </TouchableOpacity>
            ),
            headerTitle: "Crear Area",
            headerTitleAlign: 'center'
          }}
        />
        <Stack.Screen
          name="Area/AreaDetail"
          options={({ route }) => ({
            headerShadowVisible: false,
            headerStyle: {
              backgroundColor: "transparent",
            },
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.back()}>
                <Image
                  source={require("../assets/images/backarrowblack.png")}
                  style={{ width: 40, height: 20, marginLeft: 20 }}
                />
              </TouchableOpacity>
            ),
            headerTitleAlign: "center",
            headerTitle:
              typeof route.params.nombre === "string"
                ? route.params.nombre
                : "Area",
          })}
        />
        <Stack.Screen
          name="Equipo/EquipoDetail"
          options={({ route }) => ({
            headerShadowVisible: false,
            headerStyle: {
              backgroundColor: "transparent",
            },
            headerTintColor: "#000",
            headerTitleStyle: {
              color: "#000",
              fontWeight: "bold",
            },
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.back()}>
                <Image
                  source={require("../assets/images/backarrowblack.png")}
                  style={{ width: 40, height: 20, marginLeft: 20 }}
                />
              </TouchableOpacity>
            ),
            headerTitleAlign: 'center',
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
          name="screens/login/medico"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="screens/login/admin"
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
          name="screens/terminos/firma"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="screens/terminos/terminos"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="screens/codigos/crearTecnico"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="screens/codigos/listaCodigos"
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="Equipo/HojaVida"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Equipo/ViewPeticion"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Equipo/Pdf"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Equipo/PeticionMantenimiento"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="screens/mantenimiento/Preview"
          options={{
            headerShadowVisible: false,
            headerTitle: "",
            headerStyle: {
              backgroundColor: "#050259",
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
          name="screens/mantenimiento/Correctivo"
          options={{
            headerShadowVisible: false,
            headerTitle: "",
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.back()}>
                <Image
                  source={require("../assets/images/backarrowblue.png")}
                  style={{
                    width: 35,
                    height: 17,
                    marginLeft: 5,
                    marginTop: 15,
                  }}
                />
              </TouchableOpacity>
            ),
          }}
        />
        <Stack.Screen
          name="screens/mantenimiento/Preventivo"
          options={{
            headerShadowVisible: false,
            headerTitle: "",
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.back()}>
                <Image
                  source={require("../assets/images/backarrowblue.png")}
                  style={{
                    width: 35,
                    height: 17,
                    marginLeft: 5,
                    marginTop: 15,
                  }}
                />
              </TouchableOpacity>
            ),
          }}
        />
      </Stack>
      </NavigationContainer>
    </UserProvider>
  );
}
