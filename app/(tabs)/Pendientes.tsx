import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { useUserContext } from "@/app/UserContext";
import axios from "axios";
import url from "@/constants/url.json";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { router } from "expo-router";
import { useFonts } from "expo-font";

interface Pendiente {
  idMantenimiento: number;
  codigoEquipo: string;
  tipoEquipo: string;
  areaEquipo: string;
  fecha: string;
  tipoMantenimiento: string;
  firmadoPorRecibidor: boolean;
  tecnico: string;
}

const Pendientes = () => {
  const [fontsLoaded] = useFonts({
    "Kanit-Regular": require("@/assets/fonts/Kanit/Kanit-Regular.ttf"),
    "Kanit-Medium": require("@/assets/fonts/Kanit/Kanit-Medium.ttf"),
    "Kanit-Light": require("@/assets/fonts/Kanit/Kanit-Light.ttf"),
  });
  const { userType } = useUserContext();
  const [pendientes, setPendientes] = useState<Pendiente[]>([]);
  const [CodigoHospital, setCodigoHospital] = useState<string | null>(null);
  const checkToken = async () => {
    const codigoHospital = await AsyncStorage.getItem("codigoHospital");
    const token = await AsyncStorage.getItem("access_token");
    if (token && codigoHospital) {
      const decodedToken = jwtDecode(token);
      getPendientesJefeArea(decodedToken.sub.codigo, codigoHospital);
      setCodigoHospital(codigoHospital);
    }
  };
  const signMantenimiento = async(idMantenimiento:number, codigoEquipo:string) => {
    console.log("Recibido",idMantenimiento);
    try {
      const response = await axios.post(`${url.url}/firmar_mantenimiento/${CodigoHospital}/${codigoEquipo}/${idMantenimiento}`);
      if(response.status === 200){
        alert("Mantenimiento firmado correctamente");
      }
    } 

    catch (error) {
      console.error(error
      );
    }
  }
  const getPendientesJefeArea = async (codigoUsuario: string, codigoHospital: string) => {
    try {
      const response = await axios.get(`${url.url}/getpendientes/${codigoHospital}/${codigoUsuario}`);
      const pendientesData = response.data.map((pendiente: any) => ({
        idMantenimiento: pendiente.idMantenimiento,
        codigoEquipo: pendiente.codigoIdentificacionEquipo,
        tipoEquipo: pendiente.tipo,
        tecnico: pendiente.tenico,
        fecha: pendiente.fecha,
        tipoMantenimiento: pendiente.tipoMantenimiento,
        firmadoPorRecibidor: pendiente.firmadoPorRecibidor,
      }));
      setPendientes(pendientesData);
    } catch (error) {
      console.error(error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      checkToken();
    }, [])
  );

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.title}>Pendientes</Text>
        {userType === "admin" && <Text style={styles.subtitle}>Jefe de Area</Text>}

        <ScrollView contentContainerStyle={styles.list}>
          {pendientes.map((pendiente, index) => (
            <View
              key={index}
              style={[
                styles.pendienteCard,
                {
                  backgroundColor: pendiente.firmadoPorRecibidor ? "#E0FFE0" : "#FFE0E0",
                },
              ]}
            >
              <Text style={styles.pendienteText}>Equipo: {pendiente.codigoEquipo}</Text>
              <Text style={styles.pendienteText}>Tipo: {pendiente.tipoEquipo}</Text>
              <Text style={styles.pendienteText}>Mantenimiento: {pendiente.tipoMantenimiento}</Text>
              <Text style={styles.pendienteText}>Realizado por: {pendiente.tecnico}</Text>
                <Text style={styles.pendienteText}>
                Fecha: {new Date(pendiente.fecha).toLocaleDateString("es-ES", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
                </Text>
              <Text style={styles.statusText}>
                {pendiente.firmadoPorRecibidor ? "Firmado por el recibidor" : "Pendiente de firma"}
              </Text>

              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.viewButton}>
                  <Text style={styles.buttonText}>Ver mantenimiento</Text>
                </TouchableOpacity>
                {!pendiente.firmadoPorRecibidor && (
                  <TouchableOpacity style={styles.signButton} 
                  onPress={()=>
                    signMantenimiento(pendiente.idMantenimiento, pendiente.codigoEquipo)
                  }>
                    <Text style={styles.buttonText}>Firmar mantenimiento</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </>
  );
};

export default Pendientes;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F2",
    paddingTop: "10%",
    paddingHorizontal: 20,
  },
  title: {
    fontFamily: "Kanit-Medium",
    color: "#050259",
    fontSize: 24,
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontFamily: "Kanit-Light",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
  },
  list: {
    paddingBottom: 20,
  },
  pendienteCard: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  pendienteText: {
    fontFamily: "Kanit-Regular",
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  statusText: {
    fontFamily: "Kanit-Medium",
    fontSize: 16,
    color: "#666",
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  viewButton: {
    backgroundColor: "#050259",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  signButton: {
    backgroundColor: "#ff2727",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    fontFamily: "Kanit-Medium",
    color: "#fff",
    fontSize: 10,
    textAlign: "center",
  },
});
