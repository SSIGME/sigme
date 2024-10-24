import React from "react";
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PerfilScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <Text style={styles.title}>
        Consultar{"\n"}
        {/* Esto fuerza un salto de línea */}
        <Text style={styles.highlight}>código </Text>
      </Text>
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity
          style={[styles.option, { backgroundColor: "#A4B1E3" }]}
          onPress={() =>
            router.push(`/screens/codigos/listaCodigos?type=tecnico`)
          }
        >
          <Image
            source={require("../../assets/images/tecnico.png")}
            style={[styles.image, { width: "60%", height: "107%" }]}
          />
          <Text style={[styles.optionText, { marginLeft: "3%" }]}>Técnico</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.option, { backgroundColor: "#6E7DD0" }]}
          onPress={() =>
            router.push(`/screens/codigos/listaCodigos?type=jefeArea`)
          }
        >
          <Image
            source={require("../../assets/images/jefeArea.png")}
            style={[styles.image, {}]}
          />
          <Text style={styles.optionText1}>Jefe de Área</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.option, { backgroundColor: "#3C497A" }]}
          onPress={() =>
            router.push(`/screens/codigos/listaCodigos?type=profesional`)
          }
        >
          <Image
            source={require("../../assets/images/medico.png")}
            style={[styles.image, {}]}
          />
          <Text style={styles.optionText1}>Médico</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.option, { backgroundColor: "#1C2D63" }]}
          onPress={() =>
            router.push(`/screens/codigos/listaCodigos?type=encargado`)
          }
        >
          <Image
            source={require("../../assets/images/secretaria.png")}
            style={[styles.image, { width: "57%", height: "125%" }]}
          />
          <Text style={[styles.optionText1, { marginLeft: 0 }]}>
            Secretaria
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 2,
    paddingBottom: "17%",
    padding: 0,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    position: "static",
    fontWeight: "200",
    color: "#ffffff",

    backgroundColor: "#050259",
    paddingTop: "17%",
    paddingBottom: "5%",
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
    width: "32%", // Establece una altura fija
    marginTop: -35, // Desplaza la imagen hacia arriba
    marginBottom: 0, // Ajusta la parte inferior
    // Mantiene la proporción sin deformar la imagen
  },

  optionText: {
    fontSize: 26,
    color: "#000000",
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
