import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter, useLocalSearchParams, useSegments } from "expo-router";
import { useFonts } from "expo-font";
import { Dimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import url from "@/constants/url.json";
import { Svg } from "react-native-svg";

import { Path } from "react-native-svg";
const { height, width } = Dimensions.get("window");
interface Respuesta {
  id: number;
  respuesta: string;
}
const PreviewJefe = () => {
  const router = useRouter();
  const [isSigned, setIsSigned] = useState(false);
  const [nombretecnico, setNombretecnico] = useState("");
  const [firma, setFirma] = useState("");
  const { idMantenimiento, codigoEquipo, tipoMantenimiento, previousSigned } =
    useLocalSearchParams();
  const [fontsLoaded] = useFonts({
    "Kanit-Regular": require("@/assets/fonts/Kanit/Kanit-Regular.ttf"),
    "Kanit-Medium": require("@/assets/fonts/Kanit/Kanit-Medium.ttf"),
    "Kanit-Light": require("@/assets/fonts/Kanit/Kanit-Light.ttf"),
  });
  const [mantenimiento, setMantenimiento] = useState({
    id: 0,
    fecha: "",
    modelo: "",
    marca: "",
    serie: "",
    area: "",
    tipo: "",
    hours: "",
    respuestas: [],
    firmaTecnico: "",
    firmaResponsable: "",
    firmadoPorRecibidor: false,
  });
  const getMantenimiento = async () => {
    const token = await AsyncStorage.getItem("access_token");
    const codigoHospital = await AsyncStorage.getItem("codigoHospital");
    if (!token) {
      throw new Error("Token de acceso no encontrado");
    } else {
      const response = await axios.get(
        `${url.url}/finished_mantenimiento/${codigoHospital}/${codigoEquipo}/${idMantenimiento}`,
        {
          headers: {
            "Content-Type": "application",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        console.log("Mantenimiento obtenido con éxito", response.data);
        const data = response.data[0];
        setMantenimiento({
          id: data.idMantenimiento,
          fecha: data.fecha,
          modelo: data.modelo,
          marca: data.marca,
          serie: data.serie,
          area: data.ubicacion,
          tipo: data.tipoequipo,
          hours: data.duracion,
          respuestas: data.respuestas,
          firmaTecnico: data.firmaTecnico,
          firmaResponsable: data.firmaResponsable,
          firmadoPorRecibidor: data.firmadoPorRecibidor,
        });
        setIsSigned(data.firmadoPorRecibidor);
      } else {
        console.log("Error al obtener el mantenimiento");
      }
    }
  };
  useEffect(() => {
    console.log("Mantenimiento en el useEffect", mantenimiento);
  }, [mantenimiento]);
  const sendApprobed = async () => {
    const token = await AsyncStorage.getItem("access_token");
    const codigoHospital = await AsyncStorage.getItem("codigoHospital");
    if (!token) {
      throw new Error("Token de acceso no encontrado");
    } else {
      const response = await axios.post(
        `${url.url}/firmar_mantenimiento/${codigoHospital}/${codigoEquipo}/${idMantenimiento}`,
        {},
        {
          headers: {
            "Content-Type": "application",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        Alert.alert("Mantenimiento firmado correctamente");
        router.replace("/(tabs)/Pendientes");
      } else {
        console.log("Error al firmar el mantenimiento");
      }
    }
  };
  const getFirmaandPut = async () => {
    const token = await AsyncStorage.getItem("access_token");
    console.log("Hay un token", token);
    if (!token) {
      throw new Error("Token de acceso no encontrado");
    } else {
      const response = await axios.get(`${url.url}/user/firma`, {
        headers: {
          "Content-Type": "application",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        console.log("Firma obtenida con éxito", response.data.firma);
        setFirma(response.data.firma);
      } else {
        console.log("Error al obtener la firma");
      }
    }
  };
  useEffect(() => {
    getMantenimiento();
    getFirmaandPut();
  }, []);

  if (!fontsLoaded) {
    return null;
  } else {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Previsualización</Text>
        <View style={styles.plantilla}>
          <View style={styles.scrollViewContent}>
            <Text style={styles.texttitle}>{mantenimiento.tipo}</Text>
            <View style={styles.cajaparametros}>
              <Text style={styles.parametro}>
                Modelo{" "}
                <Text style={styles.parametroinfo}>
                  {" "}
                  {mantenimiento.modelo}
                </Text>
              </Text>
              <Text style={styles.parametro}>
                Marca{" "}
                <Text style={styles.parametroinfo}> {mantenimiento.marca}</Text>
              </Text>
              <Text style={styles.parametro}>
                Serie{" "}
                <Text style={styles.parametroinfo}> {mantenimiento.serie}</Text>
              </Text>
              <Text style={[styles.parametro, { marginTop: "5%" }]}>
                Ubicacion{" "}
                <Text style={styles.parametroinfo}>{mantenimiento.area}</Text>
              </Text>
            </View>
            <View style={styles.cajahallazgos}>
              <Text style={styles.texttitle}>Hallazgos</Text>
              <Text style={styles.infospace}> Ningun Hallazgo </Text>
              <Text
                style={{
                  position: "absolute",
                  bottom: "8%",
                  fontFamily: "Kanit-Medium",
                  fontSize: 20,
                }}
              >
                Horas Gastadas:
                <Text style={{ fontFamily: "Kanit-Light", fontSize: 20 }}>
                  {" "}
                  {mantenimiento.hours}
                </Text>
              </Text>
            </View>
            <View style={styles.cajaobservaciones}>
              <Text style={styles.texttitle}>Observaciones</Text>
              <Text style={styles.infospace}>
                {mantenimiento.respuestas.length > 0
                  ? mantenimiento.respuestas[0].respuesta
                  : ""}
              </Text>
              <TouchableOpacity
                style={{
                  position: "absolute",
                  bottom: "10%",
                  width: "65%",
                  height: "20%",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "rgba(5, 2, 89, 1)",
                  borderRadius: 6.91,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Kanit-Medium",
                    fontSize: 20,
                    color: "white",
                  }}
                >
                  Ver Documento
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.cajafirmas}>
            <View style={styles.cajitafirma}>
              <Svg
                style={{
                  width: "100%",
                  height: "70%",
                  position: "absolute",
                  bottom: "50%",
                }}
                viewBox="0 0 400 200" // Ajusta el tamaño del viewBox según la firma
              >
                <Path
                  d={mantenimiento.firmaTecnico} // La firma obtenida de la base de datos
                  fill="none" // No rellena el trazado
                  stroke="black" // Color del trazo
                  strokeWidth="12" // Ancho del trazo
                  transform="rotate(270, 20, 240)" // Rota 90 grados hacia la derecha alrededor del centro del SVG
                />
              </Svg>
              <Text style={styles.firmatext}>Firma Entregador</Text>
            </View>
            <View style={styles.cajitafirma}>
              {isSigned ? (
                <Svg
                  style={{
                    width: "100%",
                    height: "70%",
                    position: "absolute",
                    bottom: "50%",
                  }}
                  viewBox="0 0 400 200" // Ajusta el tamaño del viewBox según la firma
                >
                  <Path
                    d={firma} // La firma obtenida de la base de datos
                    fill="none" // No rellena el trazado
                    stroke="black" // Color del trazo
                    strokeWidth="12" // Ancho del trazo
                    transform="rotate(270, 20, 240)" // Rota 90 grados hacia la derecha alrededor del centro del SVG
                  />
                </Svg>
              ) : null}
              <Text style={styles.firmatext}>Firma Recibidor</Text>
            </View>
          </View>
        </View>
        {mantenimiento.firmadoPorRecibidor ? null : isSigned ? (
          <TouchableOpacity
            onPress={() => {
              sendApprobed();
            }}
            style={styles.firmarbutton}
          >
            <Text
              style={{
                fontSize: 16,
                fontFamily: "Kanit-Medium",
                color: "#050259",
              }}
            >
              Enviar
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => setIsSigned(true)}
            style={styles.firmarbutton}
          >
            <Text
              style={{
                fontSize: 16,
                fontFamily: "Kanit-Medium",
                color: "#050259",
              }}
            >
              Firmar
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }
};

export default PreviewJefe;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050259",
    alignItems: "center",
  },
  title: {
    position: "absolute",
    top: "-1%",
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  texttitle: {
    position: "absolute",
    top: "0%",
    fontFamily: "Kanit-Medium",
    fontSize: 24,
  },
  scrollViewContent: {
    width: "100%",
    height: "90%",
    justifyContent: "center",
    alignItems: "center",
  },
  infospace: {
    textAlignVertical: "center",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 9,
    textAlign: "center",
    width: "100%",
    height: "40%",
    backgroundColor: "rgba(187, 189, 242, 1)",
  },
  plantilla: {
    position: "absolute",
    top: "4%",
    width: width * 0.9,
    height: "82%",
    backgroundColor: "rgba(242, 242, 242, 1)",
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 10,
    marginTop: "5%",
    borderTopRightRadius: 69,
    borderTopLeftRadius: 9,
    borderBottomRightRadius: 9,
    borderBottomLeftRadius: 9,
  },
  textContainer: {
    position: "absolute",
    top: "10%",
    alignItems: "center",
  },
  cajahallazgos: {
    position: "absolute",
    top: "32%",
    height: "33%",
    width: "85%",
    paddingBottom: "5%",
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "rgba(160, 164, 242, 1)",
  },
  cajaobservaciones: {
    position: "absolute",
    top: "68%",
    height: "33%",
    width: "85%",
    paddingBottom: "5%",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "rgba(160, 164, 242, 1)",
  },
  cajaparametros: {
    borderColor: "rgba(160, 164, 242, 1)",
    borderBottomWidth: 1,
    borderTopWidth: 1,
    position: "absolute",
    top: "10%",
    paddingTop: "5%",
    paddingBottom: "5%",
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    height: "18%",
    width: "85%",
  },
  cajafirmas: {
    position: "absolute",
    bottom: "1%",
    height: "10%",
    width: width * 0.9,
    justifyContent: "space-around",
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
  },
  cajitafirma: {
    width: "40%",
    height: "100%",
    flexDirection: "column",
  },
  parametroinfo: {
    fontSize: 13,
    color: "rgba(0, 0, 0, 0.3)",
    fontFamily: "Kanit-Light",
    flexDirection: "row",
  },
  parametro: {
    fontFamily: "Kanit-Medium",
    width: "50%",
  },
  firmarbutton: {
    position: "absolute",
    bottom: "3%",
    borderRadius: 6.91,
    justifyContent: "center",
    alignItems: "center",
    width: "40%",
    height: "6%",
    backgroundColor: "rgba(242, 242, 242, 1)",
  },
  firmatext: {
    position: "absolute",
    bottom: "2%",
    width: "100%",
    borderTopWidth: 1,
    fontFamily: "Kanit-Light",
    fontSize: 16,
  },
});