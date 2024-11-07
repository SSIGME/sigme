import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  ActivityIndicator,
} from "react-native";
import React, { useEffect } from "react";
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
}
const EquipoDetail = () => {
  const { userType } = useUserContext();
  const [equipo, setEquipo] = React.useState<Equipo | null>(null);
  const [modalVisible, setModalVisible] = React.useState<boolean>(false);
  const [fontsLoaded] = useFonts({
    "Kanit-Regular": require("../../assets/fonts/Kanit/Kanit-Regular.ttf"),
    "Kanit-Medium": require("../../assets/fonts/Kanit/Kanit-Medium.ttf"),
    "Kanit-Light": require("../../assets/fonts/Kanit/Kanit-Light.ttf"),
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
      !Imagen ||
      !Tipo ||
      !Marca ||
      !Modelo ||
      !Serie ||
      !UltimoMantenimiento ||
      !ProximaVisita ||
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
        Imagen: Imagen as string,
        Tipo: Tipo as string,
        Marca: Marca as string,
        Modelo: Modelo as string,
        Serie: Serie as string,
        UltimoMantenimiento: UltimoMantenimiento as string,
        ProximaVisita: ProximaVisita as string,
        area: area as string,
      });
    }
  };
  useEffect(() => {
    checkParams();
  }, []);
  if (!equipo || !fontsLoaded) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  } else {
    return (
      <View style={styles.container}>
        <View style={styles.fototipo}>
          {Imagen === "" ? (
            <Image
              source={require("../../assets/images/tenso.jpg")}
              style={{
                width: 100,
                height: 100,
                borderRadius: 20,
              }}
            />
          ) : (
            <Image
              style={{
                width: 150,
                height: 150,
                borderRadius: 20,
              }}
              source={{ uri: Array.isArray(Imagen) ? Imagen[0] : Imagen }}
            />
          )}
        </View>
        <View style={styles.cajaparametros}>
          <Text style={styles.parametro}>
            Modelo <Text style={styles.parametroinfo}> {Modelo}</Text>
          </Text>
          <Text style={styles.parametro}>
            Marca <Text style={styles.parametroinfo}> {Marca}</Text>
          </Text>
          <Text style={styles.parametro}>
            Serie <Text style={styles.parametroinfo}> {Serie}</Text>
          </Text>
          <Text style={styles.parametro}>
            Ubicacion <Text style={styles.parametroinfo}> {area}</Text>
          </Text>

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
        {userType !== "tecnico" ? (
          <View style={[styles.botonesrapidos, { top: "45%" }]}>
            <Pressable style={styles.botonrapido}>
              <Image
                source={require("../../assets/images/manual.png")}
                style={{ width: 30, height: 30 }}
              />
              <Text style={{ position: "absolute", bottom: "-40%" }}>
                Manual
              </Text>
            </Pressable>
            <Pressable onPress={toggleModal} style={styles.botonrapido}>
              <Image
                source={require("../../assets/images/uso.png")}
                style={{ width: 30, height: 30 }}
              />
              <Text style={{ position: "absolute", bottom: "-40%" }}>Uso</Text>
            </Pressable>
            <Pressable onPress={() => {
                  router.push({
                    pathname: "Equipo/HojaVida",
                    params: {
                      tipo: equipo.Tipo,
                      marca: equipo.Marca,
                      modelo: equipo.Modelo,
                      serie: equipo.Serie,
                      area: equipo.area,
                      Imagen: equipo.Imagen,
             
                      codigoIdentificacion:equipo.codigoIdentificacion
                    },
                  });
                }}
                    >
              <Image
                source={require("../../assets/images/guiarapida.png")}
                style={{ width: 30, height: 30 }}
              />
              <Text
                style={{
                  position: "absolute",
                  bottom: "-40%",
                  width: "150%",
                  textAlign: "center",
                }}
              >
                Guia Rapida
              </Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.botonesrapidos}>
            <Pressable style={styles.botonrapido}>
              <Image
                source={require("../../assets/images/manual.png")}
                style={{ width: 30, height: 30 }}
              />
              <Text style={{ position: "absolute", bottom: "-40%" }}>
                Manual
              </Text>
            </Pressable>
            <Pressable style={styles.botonrapido}>
              <Image
                source={require("../../assets/images/uso.png")}
                style={{ width: 30, height: 30 }}
              />
              <Text style={{ position: "absolute", bottom: "-40%" }}>Uso</Text>
            </Pressable>
            <Pressable  onPress={() => {
                  router.push({
                    pathname: "Equipo/HojaVida",
                    params: {
                      tipo: equipo.Tipo,
                      marca: equipo.Marca,
                      modelo: equipo.Modelo,
                      serie: equipo.Serie,
                      area: equipo.area,
                      Imagen: equipo.Imagen,
                
                      codigoIdentificacion:equipo.codigoIdentificacion
                      

                    },
                  });
                }} style={styles.botonrapido}>
              <Image
                source={require("../../assets/images/guiarapida.png")}
                style={{ width: 30, height: 30 }}
              />
              <Text
                style={{
                  position: "absolute",
                  bottom: "-40%",
                  width: "150%",
                  textAlign: "center",
                }}
              >
                Guia Rapida
              </Text>
            </Pressable>
          </View>
        )}
        <ModalAlert
          visible={modalVisible}
          message="¿Desea reportar un problema con este equipo?"
          hideModal={toggleModal}
        />
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
    backgroundColor: "#F2F2F2",
  },

  cajaparametros: {
    padding: "8%",
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    height: "100%",
    width: "100%",
  },
  cajitainfo: {
    marginLeft: "12%",
    marginBottom: "2%",
    width: "100%",
    height: "10%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  parametro: {
    fontFamily: "Kanit-Medium",
    width: "50%",
  },
  parametroinfo: {
    color: "rgba(0, 0, 0, 0.3)",
    fontFamily: "Kanit-Light",
  },
  fototipo: {
    width: "40%",
    height: "25%",
    justifyContent: "center",
    alignItems: "center",
  },
  botonesrapidos: {
    borderWidth: 1,
    borderBottomWidth: 0,
    borderRadius: 9,
    borderColor: "rgba(160, 164, 242, 0.4)",
    paddingBottom: "-30%",
    flexDirection: "row",
    flexWrap: "wrap", // Permite que los botones se ajusten a la siguiente línea
    justifyContent: "space-between", // Ajusta el espacio entre los botones
    position: "absolute",
    top: "50%",
    width: "100%",
    height: "50%",
    display: "flex",
  },
  botonrapido: {
    marginTop: "5%",
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
    marginTop: "8%",
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
    fontFamily: "Kanit-Regular",
    fontSize: 16,
  },
});
