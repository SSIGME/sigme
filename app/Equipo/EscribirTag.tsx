import { StyleSheet, Text, View } from "react-native";
import React from "react";
import ListarAreas from "@/app/Area/ListarAreas";
import { useCodeWriteStore } from "@/app/utils/useStore";
import { Equipo } from "@/app/Models/Equipo";
import { Pressable } from "react-native";
import { router } from "expo-router";
import { Image } from "react-native";
import { Alert } from "react-native";
import { useState } from "react";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import NfcManager, { NfcTech, Ndef } from "react-native-nfc-manager";
import url from "@/constants/url.json";

const EscribirTag = () => {
  const [nfcSupported, setNfcSupported] = useState(false);
  const codeWrite = useCodeWriteStore((state) => state.codeWrite);
  const setCodeWrite = useCodeWriteStore((state) => state.setCodeWrite);
  const [equipo, setEquipo] = useState<Equipo | null>(null);

  useEffect(() => {
    const checkNfcSupport = async () => {
      const supported = await NfcManager.isSupported();
      setNfcSupported(supported);
    };
    checkNfcSupport();
  }, []);

  const writeNfc = async () => {
    try {
      Alert.alert("Iniciando escritura de NFC");
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const tag = await NfcManager.getTag();
      if (tag) {
        console.log("Etiqueta NFC encontrada");
        if (!codeWrite) {
          console.log("No hay codigo para escribir");
          return;
        } else {
          const bytes = Ndef.encodeMessage([Ndef.textRecord(codeWrite)]);
          if (bytes) {
            console.log("Escribiendo codigo NDEF");
            await NfcManager.ndefHandler.writeNdefMessage(bytes);
            console.log("Codigo NDEF escrito correctamente");
            router.replace("Equipo/EscribirTag");            
            setCodeWrite("");
          } else {
            console.log("No se pudo escribir el codigo NDEF");
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

  const getEquipo = async (codigoIdentificacion: string) => {
    try {
      const codigoHospital = await AsyncStorage.getItem("codigoHospital");

      const response = await axios.get(
        `${url.url}/getequipo/${codigoHospital}/${codigoIdentificacion}`
      );
      if (response.status === 200) {
        console.log(response.data);
        setEquipo(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    console.log("Ha cambiado codeDelete", codeWrite);
    if (codeWrite !== "") {
      getEquipo(codeWrite);
    } else {
      setEquipo(null);
    }
  }, [codeWrite]);

  const EscribirEquipo = () => {
    return (
      <View style={styles.container}>
        <View style={styles.infoContainerbig}>
          <Text style={styles.title}>
            Pulsa el botón para escribir el TAG del equipo. Luego, acerca el TAG
            al lector NFC de tu teléfono.
          </Text>

          <View style={styles.infoContainer}>
            <Image
              source={{ uri: equipo?.Imagen }}
              style={{ width: 100, height: 100 }}
            />
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Tipo:</Text>
            <Text style={styles.value}>{equipo?.Tipo}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Marca:</Text>
            <Text style={styles.value}>{equipo?.Marca}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Modelo:</Text>
            <Text style={styles.value}>{equipo?.Modelo}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Serie:</Text>
            <Text style={styles.value}>{equipo?.Serie}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Área:</Text>
            <Text style={styles.value}>{equipo?.area}</Text>
          </View>
          <Text style={styles.code}>Código: {codeWrite}</Text>
          <Text style={styles.code}>
            Asegúrate de tener el TAG listo y cerca del lector NFC antes de
            presionar el botón.
          </Text>

          <Pressable
            style={{
              marginTop: "10%",
              width: "80%",
              height: "15%",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "red",
              borderRadius: 10,
            }}
            onPress={() => {
              writeNfc();
            }}
          >
            <Text
              style={{
                color: "white",
                fontWeight: "bold",
                fontSize: 24,
              }}
            >
              Escribir TAG
            </Text>
          </Pressable>
        </View>
      </View>
    );
  };

  if (!nfcSupported) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>
          {" "}
          La tecnologia NFC no es soportado en este dispositivo
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {codeWrite === ""
          ? "Seleccione un equipo para escribir su tag"
          : "Equipo seleccionado para escribir el tag"}
      </Text>
      {codeWrite === "" ? (
        <ListarAreas comeback={"EscribirTag"} />
      ) : (
        <EscribirEquipo />
      )}
    </View>
  );
};

export default EscribirTag;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  infoContainerbig: {
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: "10%",
  },
  text: {
    padding: 16,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  infoContainer: {
    justifyContent: "center",
    flexDirection: "row",
    marginHorizontal: 20,
    marginVertical: 10,
  },
  label: {
    fontWeight: "bold",
    fontSize: 16,
    marginRight: 10,
  },
  value: {
    fontSize: 16,
  },
  code: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    fontWeight: "bold",
  },
});
