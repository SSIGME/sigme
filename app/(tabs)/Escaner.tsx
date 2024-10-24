import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ScanScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Image
          source={require("../../assets/images/back.png")} // Asegúrate de tener este ícono en la ruta correcta
          style={styles.backIcon}
        />
      </TouchableOpacity>

      <Text style={styles.title}>
        Escanear <Text style={styles.boldText}>con</Text>
      </Text>

      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={styles.option}
          onPress={() => router.push("/CrearArea")}
        >
          <Image
            source={require("../../assets/images/qrIcon.png")} // Asegúrate de tener este ícono en la ruta correcta
            style={styles.icon}
          />
          <Text style={styles.optionText}>Código Qr</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.option}
          onPress={() => router.push("/ListarAreas")}
        >
          <Image
            source={require("../../assets/images/nfcIcon.png")} // Asegúrate de tener este ícono en la ruta correcta
            style={styles.icon}
          />
          <Text style={styles.optionText}>Por Contacto</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
  },
  backButton: {
    marginTop: 10,
    marginLeft: 10,
  },
  backIcon: {
    width: 52,
    height: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "300",
    textAlign: "center",
    marginTop: 20,
    color: "#3C3C3C",
  },
  boldText: {
    fontWeight: "bold",
  },
  optionsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: "30%",
  },
  option: {
    backgroundColor: "#E8EAF6",
    width: "70%",
    paddingVertical: 30,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  icon: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  optionText: {
    fontSize: 20,
    color: "#3C3C3C",
  },
});
