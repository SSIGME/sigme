import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useFonts } from "expo-font";
import axios from "axios";
import url from "@/constants/url.json";

import { useUserContext } from "../UserContext";
import ModalAlert from "@/app/componets/ModalAlert";
import AsyncStorage from "@react-native-async-storage/async-storage";
interface Equipo {
  codigoIdentificacion: string;
  Imagen: string;
  Tipo: string;
  Marca: string;
  Modelo: string;
  Serie: string;
  UltimoMantenimiento: string;
  ProximaVisita: string;
  area: string;
  HojaVida:any;
  solicitudes:any;
}
const EquipoDetail = () => {
  const { userType } = useUserContext();
  const [codigoHospital, setCodigoHospital] = useState("");
  const [equipo, setEquipo] = React.useState<Equipo | null>(null);
  const [modalVisible, setModalVisible] = React.useState<boolean>(false);
  const [fontsLoaded] = useFonts({
    "Kanit-Regular": require("../../assets/fonts/Kanit/Kanit-Regular.ttf"),
    "Kanit-Medium": require("../../assets/fonts/Kanit/Kanit-Medium.ttf"),
    "Kanit-Light": require("../../assets/fonts/Kanit/Kanit-Medium.ttf"),
  });
  const router = useRouter();
  const {
    codigoIdentificacion,
    Imagen,
    Tipo,
    Marca,
    Modelo,
    Serie,
    UltimoMantenimiento,
    ProximaVisita,
    area,
    HojaVida,
  } = useLocalSearchParams();

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
  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };
  const checkParams = () => {
    if (
      !codigoIdentificacion ||

      !Tipo ||
      !Marca ||
      !Modelo ||
      !Serie ||
      !UltimoMantenimiento ||
      !ProximaVisita ||
      !HojaVida||
      !area
    ) {
      console.log("Faltan parametros o se ha escaneado desde NFC");
      if (codigoIdentificacion) {
        console.log("Codigo de identificacion encontrado");
        getEquipo(codigoIdentificacion as string);
      } else {
        console.log(
          "El equipo que has buscado no ha sido encontrado en la base de datos"
        );
      }
    } else {
      console.log("Parametros encontrados");
      setEquipo({
        codigoIdentificacion: codigoIdentificacion as string,
 
        Tipo: Tipo as string,
        Marca: Marca as string,
        Modelo: Modelo as string,
        Serie: Serie as string,
        UltimoMantenimiento: UltimoMantenimiento as string,
        ProximaVisita: ProximaVisita as string,
        HojaVida: HojaVida,
        area: area as string,
      });
    }
  };
  useEffect(() => {
    checkParams();
    AsyncStorage.getItem("codigoHospital").then((codigo) => {
      setCodigoHospital(codigo);
      console.log(`${url.url2}/equipoDetail/${codigoHospital}/${codigoIdentificacion}`)
    });
  }, []);
  if (!equipo || !fontsLoaded) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  } else {
    return (
      <View style={styles.container}>
        <View
          style={[
            styles.optionsContainer,
            userType === "tecnico"
              ? { paddingTop: "18%", paddingBottom: "24%" }
              : {},
          ]}
        >
          <TouchableOpacity
            style={styles.option}
            onPress={() => {
              router.push({
                pathname: "Equipo/HojaVida",
                params: {
                  tipo: equipo.Tipo,
                  marca: equipo.Marca,
                  modelo: equipo.Modelo,
                  serie: equipo.Serie,
                  area: equipo.area,
                  Imagen:   Imagen,
                  HojaVida:JSON.stringify(equipo.HojaVida),

                  codigoIdentificacion: equipo.codigoIdentificacion,
                },
                
              })
              console.log(equipo.HojaVida);
            }}
          >
            <Image
              tintColor={"#c99494f"}
              source={require("../../assets/images/papaer.png")}
              style={styles.icon}
            />
            <Text style={styles.optionText}>Hoja de vida</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.option}
            onPress={() => {
              router.push({
                pathname: "Equipo/PeticionMantenimiento",
                params: {
                  IdEquipo: equipo.codigoIdentificacion,
                  tipo: equipo.Tipo,
                  marca: equipo.Marca,
                  modelo: equipo.Modelo,
                  serie: equipo.Serie,
                  area: equipo.area,
                },
              });
            }} // Navigate to NFC scanner screen
          >
            <Image
              tintColor={"#5e5454f"}
              source={require("../../assets/images/paper-plane.png")}
              style={styles.icon}
            />
            <Text style={[styles.optionText, { textAlign: "center" }]}>
              Solicitud mantenimiento
            </Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.cajaparametros, userType === "tecnico" ? {} : {}]}>
          <Text style={styles.parametro}>
            Modelo: <Text style={styles.parametroinfo}> {Modelo}</Text>
          </Text>
          <Text style={styles.parametro}>
            Marca: <Text style={styles.parametroinfo}> {Marca}</Text>
          </Text>
          <Text style={styles.parametro}>
            Serie: <Text style={styles.parametroinfo}> {Serie}</Text>
          </Text>
          <Text style={styles.parametro}>
            Ubicación:
            <Text style={styles.parametroinfo}> {area}</Text>
          </Text>
          {userType !== "tecnico" ? (
            <></>
          ) : (
            <Text style={styles.subHeaderText}>
              INICIAR{" "}
              <Text style={{ fontFamily: "Kanit-Medium" }}>MANTENIMIENTO</Text>{" "}
            </Text>
          )}
          {userType !== "tecnico" ? (
            <></>
          ) : (
            <View style={styles.cajamantenimientos}>
              <Pressable
                style={styles.botonmantenimiento}
                onPress={() => {
                  router.push({
                    pathname: "screens/mantenimiento/Preventivo",
                    params: {
                      IdEquipo: equipo.codigoIdentificacion,
                      tipo: equipo.Tipo,
                      marca: equipo.Marca,
                      modelo: equipo.Modelo,
                      serie: equipo.Serie,
                      area: equipo.area,
                    },
                  });
                }}
              >
                <Text style={styles.textboton}>Preventivo</Text>
              </Pressable>
              <Pressable
                style={styles.botonmantenimiento}
                onPress={() => {
                  router.push({
                    pathname: "screens/mantenimiento/Correctivo",
                    params: {
                      IdEquipo: equipo.codigoIdentificacion,
                      tipo: equipo.Tipo,
                      marca: equipo.Marca,
                      modelo: equipo.Modelo,
                      serie: equipo.Serie,
                      area: equipo.area,
                    },
                  });
                }}
              >
                <Text style={styles.textboton}>Correctivo</Text>
              </Pressable>
            </View>
          )}
        </View>

        <View style={styles.botonesrapidos}>
          <Pressable 
             onPress={() => {
              router.push({
                pathname: "Equipo/Pdf",
                params: {
                  url: `${url.url2}/equipo/manualUso/${codigoHospital}/${codigoIdentificacion}`,
                },
              });
            }}
          style={styles.botonrapido}>
            <Image
              tintColor={"#ffff"}
              source={require("../../assets/images/usoManual.png")}
              style={{ width: 30, height: 30 }}
            />
            <Text
              style={{
                position: "absolute",
                bottom: "-70%",
                textAlign: "center",
                fontFamily: "Kanit-Light",
              }}
            >
              Manual de uso
            </Text>
          </Pressable>
          <Pressable 
             onPress={() => {
              router.push({
                pathname: "Equipo/Solicitudes",
                params: {
                  IdEquipo: equipo.codigoIdentificacion,
                  tipo: equipo.Tipo,
                  marca: equipo.Marca,
                  modelo: equipo.Modelo,
                  serie: equipo.Serie,
                  area: equipo.area,
                  reportes: JSON.stringify(equipo.solicitudes)
                },
              });
            }}
          style={styles.botonrapido}>
            <Image
              tintColor={"#ffff"}
              source={require("../../assets/images/bell.png")}
              style={{ width: 30, height: 30 }}
            />
            <Text
              style={{
                position: "absolute",
                bottom: "-70%",
                width:"170%",
                textAlign: "center",
                fontFamily: "Kanit-Light",
              }}
            >
              Solicitudes de mantenimiento
            </Text>
          </Pressable>
          <Pressable
                onPress={() => {
                  router.push({
                    pathname: "Equipo/Pdf",
                    params: {
                      url: `${url.url2}/equipo/planMantenimiento/${codigoHospital}/${codigoIdentificacion}`,
                    },
                  });
                }}
            style={styles.botonrapido}
          >
            <Image
              source={require("../../assets/images/manual.png")}
              style={{ width: 30, height: 30 }}
            />
            <Text
              style={{
                fontFamily: "Kanit-Light",
                position: "absolute",
                width: "140%",
                bottom: "-70%",
                textAlign: "center",
              }}
            >
              Plan de mantenimiento
            </Text>
          </Pressable>

          <Pressable
             onPress={() => {
              router.push({
                pathname: "Equipo/Pdf",
                params: {
                  url: `${url.url2}/equipo/guiRapida/${codigoHospital}/${codigoIdentificacion}`,
                },
              });
            }}
            style={styles.botonrapido}
          >
            <Image
              source={require("../../assets/images/guiarapida.png")}
              style={{ width: 30, height: 30 }}
            />
            <Text
              style={{
                position: "absolute",
                bottom: "-35%",
                width: "150%",
                textAlign: "center",
                fontFamily: "Kanit-Light",
              }}
            >
              Guía rápida
            </Text>
          </Pressable>
          <Pressable
         onPress={() => {
          router.push({
            pathname: "Equipo/Pdf",
            params: {
              url: `${url.url2}/equipo/ProtocoloLimpieza/${codigoHospital}/${codigoIdentificacion}`,
            },
          });
        }}
            style={styles.botonrapido}
          >
            <Image
              tintColor={"#ffff"}
              source={require("../../assets/images/clena.png")}
              style={{ width: 40, height: 40 }}
            />
            <Text
              style={{
                fontFamily: "Kanit-Light",
                position: "absolute",
                bottom: "-70%",
                textAlign: "center",
                width: "180%",
              }}
            >
              Protocolo de limpieza y desinfección,
            </Text>
          </Pressable>
          <Pressable
            onPress={() => {
              router.push({
                pathname: "Equipo/Pdf",
                params: {
                  url: `${url.url2}/equipo/certificadoCalibracion/${codigoHospital}/${codigoIdentificacion}`,
                },
              });
            }}
            style={styles.botonrapido}
          >
            <Image
              tintColor={"#ffff"}
              source={require("../../assets/images/calibration.png")}
              style={{ width: 40, height: 40 }}
            />
            <Text
              style={{
                fontFamily: "Kanit-Light",
                position: "absolute",
                bottom: "-70%",
              }}
            >
              Certificado calibración
            </Text>
          </Pressable>

     
        </View>

        <ModalAlert
          visible={modalVisible}
          message="¿Desea reportar un problema con este equipo?"
          hideModal={toggleModal}
        />
        <TouchableOpacity
          onPress={() => {
            router.push({
              pathname: "Equipo/Pdf",
              params: {
                url: `${url.url2}/equipoDetail/${codigoHospital}/${codigoIdentificacion}`,
              },
            });
            console.log(`${url.url2}/equipoDetail/${codigoHospital}/${codigoIdentificacion}`)
          }}
          style={styles.boton}
        >
          <Text style={styles.botonTexto}>Ver documento</Text>
        </TouchableOpacity>
        <Text style={styles.subHeaderText1}>
          <Text style={{ fontFamily: "Kanit-Medium" }}> DOCUMENTOS</Text>{" "}
        </Text>
      </View>
    );
  }
};

export default EquipoDetail;

const styles = StyleSheet.create({
  container: {
    padding: "5%",
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fffdfdc3",
  },
  boton: {
    backgroundColor: "#050259",
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 15,
    marginBottom: 15,
    bottom: 0,
    position: "absolute",
    margin: 0, // Spacing between buttons
  },
  botonTexto: {
    color: "#fff",
    fontSize: 18,

    fontFamily: "Kanit-Regular",
  },
  cajaparametros: {
    paddingHorizontal: "4%",
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    height: "100%",
    width: "100%",
  },
  cajitainfo: {
    marginLeft: "8%",
    marginBottom: "2%",
    width: "100%",
    height: "10%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  parametro: {
    marginVertical: 3,
    fontFamily: "Kanit-Medium",
    width: "50%",
    fontSize: 16,
  },
  parametroinfo: {
    color: "#3a3a3a",
    fontFamily: "Kanit-Light",
    height: 100,
  },
  fototipo: {
    width: "40%",
    height: "20%",
    justifyContent: "center",
    alignItems: "center",
  },
  botonesrapidos: {
    borderWidth: 0,
    borderBottomWidth: 0,
    borderRadius: 9,
    paddingTop: "16%",
    paddingBottom: "0%",
    flexDirection: "row",
    flexWrap: "wrap", // Permite que los botones se ajusten a la siguiente línea
    justifyContent: "space-evenly", // Ajusta el espacio entre los botones
    position: "absolute",
    top: "48%",
    width: "100%",
    height: "60%",
    display: "flex",
    backgroundColor: "#fcfcff",

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.1,
    shadowRadius: 6,

    elevation: 10,
  },
  botonrapido: {
    marginTop: "4%",
    marginLeft: "5%",
    marginBottom: "15%",
    marginRight: "5%",
    backgroundColor: "rgba(5, 2, 89, 1)",
    width: "20%",
    height: "18%",
    borderRadius: 100,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  cajitabotonrapido: {
    width: "30%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  cajamantenimientos: {
    marginTop: "0%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    width: "110%",
    height: "10%",
  },
  botonmantenimiento: {
    margin: "4%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 9,
    backgroundColor: "rgba(5, 2, 89, 1)",
    width: "45%",
    height: "45%",
    elevation: 12,
  },
  textboton: {
    color: "white",
    fontWeight: "400",
    fontFamily: "Kanit-Thin",
  },
  subHeaderText: {
    fontSize: 17,
    color: "#050259",
    fontFamily: "Kanit-Light",
    marginTop: 0,
    textAlign: "left",
  },
  subHeaderText1: {
    position: "absolute",
    fontSize: 17,
    color: "#050259",
    fontFamily: "Kanit-Light",
    marginTop: 10,
    textAlign: "left",
    top: "49%",
  },
  optionsContainer: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: "32%",
    display: "flex",
    flexDirection: "row",
    paddingTop: "27%",
    gap: 40,
  },
  option: {
    backgroundColor: "#d9dcee",
    width: 170,
    height: 170,
    paddingVertical: 30,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  icon: {
    width: 70,
    height: 70,
    marginBottom: 10,
  },
  optionText: {
    fontSize: 17,
    color: "#3C3C3C",
  },
});
