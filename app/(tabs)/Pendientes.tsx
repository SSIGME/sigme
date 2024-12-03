import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { useUserContext } from "@/app/UserContext";
import axios from "axios";
import url from "@/constants/url.json";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { router } from "expo-router";
import { useFonts } from "expo-font";
import { Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");
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
      const subData = JSON.parse(decodedToken.sub);
      console.log("Sub Data:", subData);
    getPendientesJefeArea(subData.codigo, codigoHospital);
      setCodigoHospital(codigoHospital);
    }
  };
  const signMantenimiento = async (
    idMantenimiento: number,
    codigoEquipo: string
  ) => {
    console.log("Recibido", idMantenimiento);
    try {
      const response = await axios.post(
        `${url.url}/firmar_mantenimiento/${CodigoHospital}/${codigoEquipo}/${idMantenimiento}`
      );
      if (response.status === 200) {
        alert("Mantenimiento firmado correctamente");
      }
    } catch (error) {
      console.error(error);
    }
  };
  const getPendientesJefeArea = async (
    codigoUsuario: string,
    codigoHospital: string
  ) => {
    try {
      const response = await axios.get(
        `${url.url}/getpendientes/${codigoHospital}/${codigoUsuario}`
      );
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
      console.log(pendientesData);
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

        <ScrollView contentContainerStyle={styles.list}>
          {pendientes.map((pendiente, index) => (
            <View
              key={index}
              style={[
                styles.pendienteCard,
                {
                  backgroundColor: "rgba(5, 2, 89, 1)",
                  justifyContent: "center",
                },
              ]}
            >
          <Text style={styles.pendienteText}>
  Equipo: <Text style={styles.valorText}>{pendiente.codigoEquipo}</Text>
</Text>
<Text style={styles.pendienteText}>
  Tipo: <Text style={styles.valorText}>{pendiente.tipoEquipo}</Text>
</Text>
<Text style={styles.pendienteText}>
  Mantenimiento: <Text style={styles.valorText}>{pendiente.tipoMantenimiento}</Text>
</Text>
<Text style={styles.pendienteText}>
  Realizado por: <Text style={styles.valorText}>{pendiente.tecnico}</Text>
</Text>
<Text style={styles.pendienteText}>
  Fecha:{" "}
  <Text style={styles.valorText}>
    {new Date(pendiente.fecha).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })}
  </Text>
</Text>
<Text style={styles.pendienteText}>
  <Text style={styles.valorText}>
    {pendiente.firmadoPorRecibidor
      ? "Firmado por el recibidor"
      : "Pendiente de firma"}
  </Text>
</Text>

              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.viewButton}>
                  <Text style={styles.buttonText}>Documento</Text>
                </TouchableOpacity>
                {!pendiente.firmadoPorRecibidor && (
                  <TouchableOpacity
                    style={styles.signButton}
                    onPress={() =>
                      signMantenimiento(
                        pendiente.idMantenimiento,
                        pendiente.codigoEquipo
                      )
                    }
                  >
                    <Text style={[styles.buttonText, { color: "#050259" }]}>
                      Firmar
                    </Text>
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
    flexGrow: 1,
    paddingTop: "5%",
    width: width * 0.9,
    alignItems: "center",
    paddingBottom: height * 0.1,
  },
  pendienteCard: {
    height: 300,
    width: "100%",
    padding: 20,
    gap:5,
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
    fontSize: 17,
    color: "#F2F2F2",
    marginBottom: 5,
  },
  statusText: {
    fontFamily: "Kanit-Medium",
    fontSize: 16,
    color: "#666",
    marginBottom: 10,
  },
  buttonContainer: {
    width: "100%",
    height: "20%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  viewButton: {
    justifyContent: "center",
    alignItems: "center",
    width: "48%",
    backgroundColor: "rgba(255, 255, 255, 1)",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 9,
  },
  signButton: {
    justifyContent: "center",
    alignItems: "center",
    width: "48%",
    backgroundColor: "#FFFFFF",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 9,
  },
  buttonText: {
    fontFamily: "Kanit-Medium",
    textAlign: "center",
    fontSize: width * 0.035,
  },
  valorText: {
    fontFamily: "Kanit-Light", // Fuente para los valores
    fontSize: 15,
    color: "#ffffff",
  },
});
