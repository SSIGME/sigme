import React from "react";
import { View, Text, StatusBar, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCameraPermissions } from "expo-camera";

export default function ScanScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();

  const handleQrPress = async () => {
    // Request permission if not already granted
    if (!permission?.granted) {
      const { granted } = await requestPermission();
      if (!granted) return; // Stop if permission not granted
    }
    // Navigate to the QR scanner screen if permission is granted
    router.push("/Escaner/EscanerQr");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" /> 


      <Text style={styles.title}>
        Escanear <Text style={styles.boldText}>con</Text>
      </Text>

      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={styles.option}
          onPress={handleQrPress} // Call handleQrPress for QR option
        >
          <Image
            source={require("../../assets/images/qrIcon.png")}
            style={styles.icon}
          />
          <Text style={styles.optionText}>Código Qr</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.option}
          onPress={() => router.push("/Escaner/NfcReader")} // Navigate to NFC scanner screen
        >
          <Image
            source={require("../../assets/images/nfcIcon.png")}
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
    marginTop: 50,
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
