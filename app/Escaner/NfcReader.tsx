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
const NfcReader = () => {
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
    if (nfcSupported === false) {
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
              Escribir NFC
            </Text>
          </Pressable>
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <Text>Este dispositivo no tiene tecnologia NFC</Text>
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
    backgroundColor: "#959595",
    alignItems: "center",
    justifyContent: "center",
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
