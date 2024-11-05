import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
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
const Preview = () => {
  const router = useRouter();
  const [firma, setFirma] = useState("");
  const {
    tipo,
    marca,
    modelo,
    serie,
    area,
    respuestas: respuestasParam,
  } = useLocalSearchParams();
  const respuestas = respuestasParam
    ? JSON.parse(respuestasParam as string)
    : [];
  const [fontsLoaded] = useFonts({
    "Kanit-Regular": require("@/assets/fonts/Kanit/Kanit-Regular.ttf"),
    "Kanit-Medium": require("@/assets/fonts/Kanit/Kanit-Medium.ttf"),
    "Kanit-Light": require("@/assets/fonts/Kanit/Kanit-Light.ttf"),
  });
  const getFirmaandPut = async () => {
    const token = await AsyncStorage.getItem("access_token");
    console.log("Hay un token", token);
    if (!token) {
      throw new Error("Token de acceso no encontrado");
    } else {
      const decodedToken = jwtDecode<DecodedToken>(token);
      const codemantenimiento = decodedToken.sub.codigo;
      const codehospital = decodedToken.sub.hospital;
      const response = await axios.get(`${url.url}/user/firma`, {
        headers: {
          "Content-Type": "application",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        console.log("Firma obtenida con exito", response.data.firma);
        setFirma(response.data.firma);
      } else {
        console.log("Error al obtener la firma");
      }
    }
  };
  useEffect(() => {
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
            <Text style={styles.texttitle}>{tipo}</Text>
            <View style={styles.cajaparametros}>
              <Text style={styles.parametro}>
                Modelo <Text style={styles.parametroinfo}> {modelo}</Text>
              </Text>
              <Text style={styles.parametro}>
                Marca <Text style={styles.parametroinfo}> {marca}</Text>
              </Text>
              <Text style={styles.parametro}>
                Serie <Text style={styles.parametroinfo}> {serie}</Text>
              </Text>
              <Text style={[styles.parametro, { marginTop: "5%" }]}>
                Ubicacion <Text style={styles.parametroinfo}>{area}</Text>
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
                  fontSize: 24,
                }}
              >
                Estado:{" "}
                <Text style={{ fontFamily: "Kanit-Light", fontSize: 20 }}>
                  Funcionando
                </Text>
              </Text>
            </View>
            <View style={styles.cajaobservaciones}>
              <Text style={styles.texttitle}>Observaciones</Text>
              <Text style={styles.infospace}> {respuestas[1]?.respuesta} </Text>
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
              {firma ? (
         <Svg width="200" height="100" viewBox="0 0 200 100">
         <Path 
          d="M186.2,137.5 L183.2,128.9 L173.6,110.1 L159.7,93.0 L143.1,81.0 L127.4,74.6 L112.0,72.8 L97.2,75.1 L82.9,81.8 L70.2,92.3 L60.5,106.0 L54.7,123.6 L55.2,142.2 L61.7,159.4 L76.4,177.4 L95.2,191.4 L114.5,201.3 L138.3,211.5 L163.1,222.3 L187.4,229.9 L208.7,233.7 L226.0,234.4 L239.0,232.4 L248.4,228.3 L252.6,223.3 L252.9,217.3 L245.6,206.1 L230.4,192.4 L207.5,180.9 L181.3,175.2 L154.9,175.3 L133.0,180.4 L117.6,189.4 L108.6,200.5 L106.3,212.6 L111.1,227.5 L127.2,245.4 L148.7,265.1 L164.0,278.5 L166.8,280.7 L166.4,280.5 L156.8,274.2 L141.2,266.1 L126.4,259.5 L113.7,256.3 L106.9,255.5 L104.0,256.2 L103.2,260.5 L107.5,269.8 L118.4,281.2 L127.8,290.6 L130.5,294.3 L130.5,295.8 L126.5,298.4 L116.0,299.7 L108.0,300.0 L104.6,300.5 L104.3,300.6 L105.8,301.8 L112.6,305.6 L121.2,309.9 L125.2,312.2 L125.7,312.8 L124.4,314.7 L117.1,317.0 L110.3,318.5 L106.9,319.9 L105.0,321.5 L104.6,324.7 L107.4,331.7 L115.9,341.4 L130.3,354.4 L149.3,371.8 L165.3,389.2 L184.7,410.7 L205.1,436.1 L220.3,456.8 L226.8,465.7 L227.5,466.5 L223.8,457.5 L209.1,428.0 L187.4,391.6 L162.0,357.8 L135.8,330.9 L116.1,319.0 L101.4,321.8 L88.1,344.8 L85.0,399.7 L87.7,455.0 L90.9,501.3 L91.2,524.7 L91.2,528.6 L88.0,519.4 L80.5,489.3 L73.0,451.3 L66.2,409.8 L61.5,370.6 L60.6,343.6 L62.5,332.2 L69.8,332.8 L87.5,355.2 L103.1,397.0 L109.9,449.3 L103.6,501.8 L85.6,543.1 L67.5,565.7 L60.1,570.3 L56.3,562.1 L57.5,544.5 L65.1,525.2 L82.1,509.3 L108.4,504.7 L138.0,511.3 L162.8,524.7 L189.7,545.6 L204.6,560.5 L208.8,564.1 L208.4,560.8 L201.8,542.1 L188.3,512.9 L171.4,483.8 L153.1,463.2 L137.4,456.9 L122.4,464.6 L108.5,483.8 L96.8,511.0 L87.4,541.0 L84.0,567.1 L84.5,573.6" 
            fill="none" 
           stroke="black" 
           strokeWidth="2" 
         />
       </Svg>
              ) : null}
              <Text style={styles.firmatext}>Firma Recibidor</Text>
            </View>
            <View style={styles.cajitafirma}>
              <Text style={styles.firmatext}>Firma Entregador</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity style={styles.firmarbutton}>
          <Text
            style={{
              fontSize: 20,
              fontFamily: "Kanit-Regular",
              color: "#050259",
            }}
          >
            Firmar
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
};

export default Preview;

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
    bottom: "-2%",
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
    resizeMode:"contain",
    justifyContent: "center",
    alignItems: "center",
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
    width: "100%",
    borderTopWidth: 1,
    fontFamily: "Kanit-Light",
    fontSize: 16,
  },
});
