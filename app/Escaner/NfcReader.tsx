import { StatusBar } from "expo-status-bar";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState } from "react";
import NfcManager, { NfcTech, Ndef } from "react-native-nfc-manager";
import React from "react";
import { useFonts } from "expo-font";
import { useRouter } from "expo-router";
import { useUserContext } from "@/app/UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
const NfcReader = () => {
  const { userType } = useUserContext();

  const router = useRouter();
  const [fontsLoaded] = useFonts({
    "Kanit-Regular": require("../../assets/fonts/Kanit/Kanit-Regular.ttf"),
    "Kanit-Medium": require("../../assets/fonts/Kanit/Kanit-Medium.ttf"),
  });

  const [nfcSupported, setNfcSupported] = useState(false);
  const [mensajeToNfc, setMensajeToNfc] = useState("");
  useEffect(() => {
    isSupported();
  }, []);
  const isSupported = async () => {
    try {
      await NfcManager.start();
      setNfcSupported(true);
      console.log("NFC está soportado");
      readNFC();
    } catch (ex) {
      console.warn("NFC no está soportado:", ex);
    }
  };
  const writeNfc = async () => {
    try {
      console.log("Iniciando escritura de NFC");
      Alert.alert("Iniciando escritura de NFC");
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const tag = await NfcManager.getTag();
      if (tag) {
        console.log("Etiqueta NFC encontrada");
        if (!mensajeToNfc) {
          console.log("No hay mensaje para escribir");
          return;
        } else {
          const bytes = Ndef.encodeMessage([Ndef.textRecord(mensajeToNfc)]);
          if (bytes) {
            console.log("Escribiendo mensaje NDEF");
            await NfcManager.ndefHandler.writeNdefMessage(bytes);
            console.log("Mensaje NDEF escrito");
          } else {
            console.log("No se pudo escribir el mensaje NDEF");
          }
        }
      } else {
        console.log("No se encontró una etiqueta NFC");
      }
    } catch (ex) {
      console.warn("Error al escribir mensaje NDEF:", ex);
    } finally {
      console.log("Finalizando escritura de NFC");
      NfcManager.cancelTechnologyRequest();
    }
  };
  const readNFC = async () => {
    try {
      const codigoHospital = await AsyncStorage.getItem("codigoHospital");
      console.log("Iniciando lectura de NFC");
      Alert.alert("Iniciando lectura de NFC");
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const tag = await NfcManager.getTag();
      if (tag) {
        console.log("Etiqueta NFC encontrada");
        if (tag.ndefMessage) {
          console.log("Leyendo mensaje NDEF");
          tag.ndefMessage.forEach((record) => {
            const payload = record.payload;
            const text = String.fromCharCode(...payload.slice(3)); // Elimina el prefijo de lenguaje
            router.push({
              pathname: "/Equipo/EquipoDetail",
              params: {
                codigoHospital: codigoHospital,
                codigoIdentificacion: text,
              },
            });
            console.log("Contenido NDEF: ", text);
          });
        }
      } else {
        console.log("No se encontró una etiqueta NFC");
      }
    } catch (ex) {
      console.warn("Error al leer etiqueta NFC:", ex);
    } finally {
      Alert.alert("La lectura NFC ha finalizado");
      console.log("Finalizando lectura de NFC");
      NfcManager.cancelTechnologyRequest();
    }
  };
  if (fontsLoaded === true) {
    if (nfcSupported === true) {
      return (
        <View style={styles.container}>
          <View style={styles.viewtext}>
            <Text style={styles.textnobold}>Acerca tu dispositivo</Text>
            <View style={{ flexDirection: "row" }}>
              <Text style={styles.textnobold}>a la </Text>
              <Text style={styles.textbold}>etiqueta con</Text>
            </View>
            <Text style={styles.textbold}>este logo</Text>
          </View>
          <Image
            source={require("../../assets/images/nfc.png")}
            style={{ width: 150, height: 50 }}
          />
          {userType === "admin" ? (
            <View
              style={{
                position: "absolute",
                bottom: "2%",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "20%",
                width: "40%",
              }}
            >
              <Pressable
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  position: "absolute",
                  top: 0,
                  backgroundColor: "#f0f0f0",
                  padding: 10,
                  borderRadius: 5,
                }}
                onPress={() => {
                  router.push("/Escaner/NfcWrite");
                }}
              >
                <Text style={[styles.textbold, { color: "black" }]}>
                  Escribir NFC
                </Text>
              </Pressable>
              <Pressable
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  position: "absolute",
                  bottom: 20,
                  backgroundColor: "#f0f0f0",
                  padding: 10,
                  borderRadius: 5,
                }}
                onPress={() => {
                  readNFC();
                }}
              >
                <Text style={[styles.textbold, { color: "black" }]}>
                  Leer NFC
                </Text>
              </Pressable>
            </View>
          ) : (
            <Pressable
              style={{
                justifyContent: "center",
                alignItems: "center",
                position: "absolute",
                bottom: 20,
                backgroundColor: "#f0f0f0",
                padding: 10,
                borderRadius: 5,
              }}
              onPress={() => {
                router.push("/Escaner/NfcWrite");
              }}
            >
              <Text style={[styles.textbold, { color: "black" }]}>
                Leer NFC
              </Text>
            </Pressable>
          )}
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <Text style={styles.errorText}>
            Este dispositivo no tiene tecnología NFC
          </Text>
        </View>
      );
    }
  } else {
    return <ActivityIndicator />;
  }
};

export default NfcReader;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#a0a0a0",
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    fontFamily: "Kanit-Medium",
    fontSize: 20,
    color: "white",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  boton: {
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    width: 200,
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 5,
  },
  viewtext: {
    justifyContent: "center",
    alignItems: "center",
    height: "30%",
    position: "absolute",
    top: "-5%",
    flexDirection: "column",
  },
  textnobold: {
    fontFamily: "Kanit-Regular",
    fontSize: 24,
    color: "white",
  },
  textbold: {
    fontFamily: "Kanit-Medium",
    fontSize: 24,
    color: "white",
  },
});
