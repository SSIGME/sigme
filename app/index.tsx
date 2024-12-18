import React, { useCallback } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Dimensions,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useUserContext } from "./UserContext";

import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();
  const { setUserType } = useUserContext();

  const handleUserTypeChange = (type: string, route: string) => {
    setUserType(type); // Cambia el userType en el contexto
    router.push(route); // Navega a la ruta deseada
  };
  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" backgroundColor="#050259" />
      <Text style={styles.title}>
      Elige tu tipo{"\n"}de
        {/* Esto fuerza un salto de línea */}
        <Text style={styles.highlight}> usuario</Text>
      </Text>
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity
          style={[styles.option, { backgroundColor: "#7e9ef7" }]}
          onPress={() => handleUserTypeChange("admin", "/screens/login/admin")}
        >
          <Image
            source={require("../assets/images/admin.png")}
            style={styles.image}
          />
          <Text style={styles.optionText}>Encargado{"\n"}Mantenimiento</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.option, { backgroundColor: "#6a7ebe" }]}
          onPress={() => handleUserTypeChange("tecnico", "/screens/login/tecnico")}
        >
          <Image
            source={require("../assets/images/tecnico.png")}
            style={[styles.image, {  height: "130%",width:"40%",    resizeMode: "", }]}
          />
          <Text style={[styles.optionText, { }]}>Técnico</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.option, { backgroundColor: "#3f58a8" }]}
          onPress={() => handleUserTypeChange("jefeArea", "/screens/login/jefeArea")}
        >
          <Image
            source={require("../assets/images/jefeArea.png")}
            style={[styles.image, {}]}
          />
          <Text style={styles.optionText1}>Jefe de Área</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.option, { backgroundColor: "#3C497A" }]}
          onPress={() => handleUserTypeChange("medico", "/screens/login/medico")}
        >
          <Image
            source={require("../assets/images/medico.png")}
            style={[styles.image, {}]}
          />
          <Text style={styles.optionText1}>Profesional</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.option, { backgroundColor: "#1C2D63" }]}
          onPress={() => handleUserTypeChange("secretaria", "/screens/login/secretaria")}
        >
          <Image
            source={require("../assets/images/secretaria.png")}
            style={[styles.image, { width: "57%", height: "125%" }]}
          />
          <Text style={[styles.optionText1, { marginLeft: 0 }]}>
            Secretaría {"\n"}de Salud
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 2,
    paddingBottom: "18%",
    padding: 0,
    color: "#fff",
  },
  title: {
    fontSize: 24,
    position: "static",
    fontWeight: "200",
    color: "#ffffff",
    backgroundColor: "#050259",
    paddingTop: "13%",
    paddingBottom: "3%",
    borderBottomLeftRadius: 23, // Solo para el borde inferior izquierdo
    borderBottomRightRadius: 23,

    paddingLeft: 30,
  },
  highlight: {
    color: "#ffffff",
    fontWeight: "600",
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8EAF6",
    marginTop: "14%",

    marginLeft: "9%",
    marginRight: "9%",
    borderBottomLeftRadius: 30,

    borderTopLeftRadius: 30,
    borderBottomRightRadius: 0,
    borderTopRightRadius: 70,
    height: Dimensions.get("window").height * 0.15,
  },
  image: {
    height: "130%",
    resizeMode: "contain",
    width: "32%", // Establece una altura fija
    marginTop: -35, // Desplaza la imagen hacia arriba
    marginBottom: 0, // Ajusta la parte inferior
    // Mantiene la proporción sin deformar la imagen
  },

  optionText: {
    fontSize: 26,
    color: "#ffffff",
    marginTop: "5%",
    fontWeight: "500",
    marginLeft: "10%",
  },
  optionText1: {
    fontSize: 26,
    color: "#ffffff",
    marginTop: "5%",
    fontWeight: "500",
    marginLeft: "10%",
  },
});
