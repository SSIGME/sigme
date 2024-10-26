import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Areas from "../ListarAreas";
const NfcWrite = () => {
  return (
    <View
      style={{
        backgroundColor: "white",
        alignItems: "center",
        width: "100%",
        position: "absolute",
      }}
    >
      <Text
        style={{
          fontSize: 20,
          textAlign: "center",
          marginBottom: 20,
          fontWeight: "bold",
        }}
      >
        Busque el equipo medico que desea escribir en la etiqueta NFC
      </Text>
      <Areas />
    </View>
  );
};

export default NfcWrite;

const styles = StyleSheet.create({});
