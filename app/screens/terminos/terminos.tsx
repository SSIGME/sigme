import React, { useState, useLayoutEffect, useEffect } from "react";
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import CheckBox from "expo-checkbox"; // Importar expo-checkbox
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ConsentScreen() {
  const [isChecked, setIsChecked] = useState(false);
  const router = useRouter();


 
  const handleContinue = () => {
    if (!isChecked) {
      Alert.alert(
        "Aviso",
        "Debes aceptar los términos y condiciones para continuar."
      );
      return;
    }

    router.push("/screens/terminos/firma");
    
  };


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Términos y condiciones</Text>
        <Text style={styles.terms}>
          <Text style={styles.bold}>Sigme - Sistema Integral de Gestión de Mantenimiento de Equipos{"\n"}</Text>
          Ubicación: Colombia{"\n\n"}

           confirmo que he leído y comprendido los siguientes términos y condiciones de la plataforma Sigme para la gestión del mantenimiento de equipos médicos:{"\n\n"}

          <Text style={styles.item}>
            <Text style={styles.number}>1. </Text>
            <Text style={styles.bold}>Propósito</Text>: Sigme es una plataforma con las finalidad de gestionar y monitorear el mantenimiento de equipos médicos, sin realizar el mantenimiento directamente.{"\n\n"}
          </Text>

          <Text style={styles.item}>
            <Text style={styles.number}>2. </Text>
            <Text style={styles.bold}>Datos Personales</Text>: La información personal se usará únicamente para fines de gestión, manteniéndose confidencial.{"\n\n"}
          </Text>

          <Text style={styles.item}>
            <Text style={styles.number}>3. </Text>
            <Text style={styles.bold}>Responsabilidad</Text>: Entiendo que Sigme no es responsable de los servicios de mantenimiento brindados por terceros, ni de la calidad de los mismos.{"\n\n"}
     
        <Text style={styles.item}>
            <Text style={styles.number}>5. </Text>
            <Text style={styles.bold}>Consentimiento de Firma Electrónica</Text>: Autorizo a la aplicación
            a utilizar mi firma electrónica unicamente para dar constancia de los servicios de
            mantenimiento realizados.{"\n\n"}
          </Text>
          </Text>

Al firmar este documento, confirmo mi acuerdo con estos términos para usar la plataforma Sigme.
</Text>
      </ScrollView>

      <View style={styles.checkboxContainer}>
        <CheckBox
          value={isChecked}
          onValueChange={setIsChecked}
          color={isChecked ? "#050259" : undefined}
          style={styles.checkbox}
        />
        <Text style={styles.label}>
          Confirmo que he leído y he comprendido todos los términos y condiciones.
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: isChecked ? "#050259" : "#ccc" }]}
        onPress={handleContinue}
        disabled={!isChecked}
      >
        <Text style={styles.buttonText}>Continuar</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 15,
  },
  scrollView: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#11243F",
    textAlign: "center",
    marginBottom: 20,
  },
  terms: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',

    textAlign: 'justify',
  },
  item: {
    marginBottom: 8,
  },
  number: {
    color: '#3c72e7',  // Color azul para los números
    fontWeight: 'bold', // Negrita
  },
  bold: {
    fontWeight: 'bold', // Negrita para el texto
  },
  checkboxContainer: {
    flexDirection: "row",
    marginBottom: 20,
    alignItems: "center",
  },
  checkbox: {
    marginRight: 10,
  },
  label: {
    fontSize: 16,
    color: "#000000",
    marginRight:40,
  },
  button: {
    alignItems: "center",
    padding: 15,
    borderRadius: 10,
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 18,
    color: "white",
    fontWeight: "300",
  },
});
