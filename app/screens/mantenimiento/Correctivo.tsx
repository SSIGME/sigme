import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { useRouter } from "expo-router";
import axios from "axios";
import url from "@/constants/url.json";
import { Picker } from "@react-native-picker/picker";
import { CheckBox } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";

const { width, height } = Dimensions.get("window");
const Correctivo = () => {
  interface Pregunta {
    id: number;
    texto: string;
    opciones: string[];
    tipo: string;
  }
  interface Respuesta {
    id: number;
    respuesta: string;
  }
  const router = useRouter();
  const [tecnico, settecnico] = useState("");
  const [fontsLoaded] = useFonts({
    "Kanit-Regular": require("@/assets/fonts/Kanit/Kanit-Regular.ttf"),
    "Kanit-Medium": require("@/assets/fonts/Kanit/Kanit-Medium.ttf"),
    "Kanit-Light": require("@/assets/fonts/Kanit/Kanit-Light.ttf"),
  });
  const [isContinue, setIsContinue] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const { tipo, marca, modelo, serie, area, IdEquipo } = useLocalSearchParams();
  const [isModalVisible, setIsModalVisible] = useState(true);
  const [preguntas, setPreguntas] = useState<Pregunta[]>([]);
  const [respuestas, setRespuestas] = useState<Respuesta[]>([]);
  const [timer, setTimer] = useState(0);
  const [idMantenimiento, setidMantenimiento] = useState(0);
  const [hours, setHours] = useState(0);
  const saveAnswer = (preguntaId: number, opcion: string) => {
    setRespuestas((prevRespuestas) => {
      const newRespuestas = prevRespuestas.filter((r) => r.id !== preguntaId);
      return [...newRespuestas, { id: preguntaId, respuesta: opcion }];
    });
  };
  useEffect(() => {
    console.log("Respuestas updated:", respuestas);
  }, [respuestas]);
  const startTimer = () => {
    const startTime = Date.now();
    const updateElapsedTime = () => {
      setTimer(Date.now() - startTime);
    };
    const intervalId = setInterval(updateElapsedTime, 1000);
    return () => clearInterval(intervalId);
  };
  const continueTimer = () => {
    const startTime = Date.now() - timer;
    const updateElapsedTime = () => {
      setTimer(Date.now() - startTime);
    };
    const intervalId = setInterval(updateElapsedTime, 1000);
    return () => clearInterval(intervalId);
  };
  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(
      2,
      "0"
    );
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };
  useEffect(() => {
    const decimal = timer / (1000 * 60 * 60);
    const roundedDecimal = Math.round(decimal * 100) / 100;
    setHours(roundedDecimal);
  }, [timer]);
  const generateId = () => {
    return Math.floor(Math.random() * 1000000);
  };
  const checkSaved = async () => {
    const codigoHospital = await AsyncStorage.getItem("codigoHospital");
    try {
      const response = await axios.get(
        `${url.url}/mantenimiento/${codigoHospital}/${IdEquipo}/correctivo`
      );
      console.log(response.data);
      if (
        response.data.length > 0 &&
        response.data &&
        Array.isArray(response.data)
      ) {
        response.data.forEach((mantenimiento: any) => {
          if (mantenimiento.finished === false) {
            setIsContinue(true);
            getRutina();
            setRespuestas(
              mantenimiento.respuestas.map((respuesta: any) => ({
                id: respuesta.id,
                respuesta: respuesta.respuesta,
              }))
            );
            setTimer(mantenimiento.duracion * 1000 * 60 * 60);
            setidMantenimiento(mantenimiento.idMantenimiento);
          }
        });
      } else {
        getRutina();
        setidMantenimiento(generateId());
        console.log("No hay respuestas almacenadas");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getRutina = async () => {
    try {
      const response = await axios.get(
        `${url.url}/correctivo/${tipo}/${marca}/${modelo}`
      );
      console.log(response.data);
      if (response.data && Array.isArray(response.data.preguntas)) {
        setPreguntas(
          response.data.preguntas.map(
            (pregunta: {
              opciones: string[];
              texto: string;
              tipo: string;
              id: number;
            }) => ({
              opciones: pregunta.opciones,
              tipo: pregunta.tipo,
              texto: pregunta.texto,
              id: pregunta.id,
            })
          )
        );
      } else {
        console.log("Invalid response data format");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const saveMantenimiento = async () => {
    console.log("Enviando mantenimiento", idMantenimiento);
    const token = await AsyncStorage.getItem("access_token");
    if (!token) {
      console.log("No hay token");
    } else {
      const decodedToken = jwtDecode(token);
      const nombretecnico = decodedToken.sub.nombre;
      settecnico(nombretecnico);
    }
    console.log("Token:", tecnico);
    const codigoHospital = await AsyncStorage.getItem("codigoHospital");
    try {
      const response = await axios.post(
        `${url.url}/mantenimiento`,
        {
          idMantenimiento: Number(idMantenimiento),
          codigoHospital: codigoHospital,
          fecha: new Date(),
          IdEquipo: IdEquipo,
          nombre: tecnico,
          respuestas: respuestas,
          tipoMantenimiento: "correctivo",
          finished: false,
          firma: "",
          duracion: hours,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      if (response.status === 201) {
        console.log("Mantenimiento enviado con éxito");
        Alert.alert("Mantenimiento almacenado podras consultarlo mas tarde");
      } else {
        console.log("Error al enviar el mantenimiento");
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  };
  useEffect(() => {
    checkSaved();
  }, []);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          width: "90%",
          height: height * 0.25,
          position: "absolute",
          top: 0,
          zIndex: 1,
          justifyContent: "center",
          alignItems: "center",
          borderBottomWidth: 1,
          backgroundColor: "white",
          borderBottomColor: "rgba(145, 190, 216, 1)",
        }}
      >
        <Text
          style={{
            fontFamily: "Kanit-Medium",
            fontSize: 24,
            color: "#050259",
            position: "absolute",
            top: "3%",
            left: "5%",
          }}
        >
          Correctivo
        </Text>
        <View
          style={{
            position: "absolute",
            top: "30%",
            width: "90%",
            height: height * 0.06,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Image
            source={require("@/assets/images/timer.png")}
            style={{
              height: height * 0.045,
              width: height * 0.045,
              position: "absolute",
              left: "2%",
            }}
          />
          <Text
            style={{
              fontFamily: "Kanit-Medium",
              position: "absolute",
              left: "20%",
              fontSize: 16,
            }}
          >
            Tiempo transcurrido:
            <Text style={{ fontFamily: "Kanit-Light" }}>
              {" "}
              {formatTime(timer)}{" "}
            </Text>{" "}
          </Text>
        </View>
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
          <Text style={styles.parametro}>
            Ubicacion <Text style={styles.parametroinfo}> {area}</Text>
          </Text>
        </View>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.preguntas}
      >
        {preguntas.map((pregunta, index) => (
          <View key={index} style={{ width: "100%", alignItems: "center" }}>
            {pregunta.tipo === "cerrada" ? (
              <View
                style={{
                  height: height * 0.25,
                  backgroundColor: "rgba(194, 222, 235, 1)",
                  borderRadius: 9,
                  padding: "5%",
                  marginBottom: "5%",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Kanit-Medium",
                    fontSize: 16,
                    textAlign: "center",
                  }}
                >
                  {pregunta.texto}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    width: "100%",
                    height: "70%",
                  }}
                >
                  {pregunta.opciones.map((opcion, opcionIndex) => (
                    <View
                      key={opcionIndex}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-around",
                        width: "45%",
                        height: "40%",
                        paddingLeft: 5,
                        paddingBottom: 5,
                        paddingTop: 5,
                        paddingRight: 0,
                        margin: 5,
                      }}
                    >
                      <Text
                        style={{
                          width: "80%",
                          flexWrap: "wrap",
                          position: "absolute",
                          left: "-2%",
                          fontFamily: "Kanit-Medium",
                          textAlign: "center",
                        }}
                      >
                        {opcion}
                      </Text>
                      <TouchableOpacity
                        onPress={() => saveAnswer(pregunta.id, opcion)}
                        style={{
                          position: "absolute",
                          right: "5%",
                          width: width * 0.08,
                          height: width * 0.08,
                          borderRadius: 5,
                          backgroundColor:
                            respuestas.find((r) => r.id === pregunta.id)
                              ?.respuesta === opcion
                              ? "transparent"
                              : "rgba(175, 183, 230, 1)",
                        }}
                      >
                        <Icon
                          name={
                            respuestas.find((r) => r.id === pregunta.id)
                              ?.respuesta === opcion
                              ? "check-square"
                              : "square"
                          }
                          size={width * 0.085}
                          color={
                            respuestas.find((r) => r.id === pregunta.id)
                              ?.respuesta === opcion
                              ? "#ffffff"
                              : "rgba(175, 183, 230, 1)"
                          }
                        />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </View>
            ) : (
              <View
                style={{
                  backgroundColor: "rgba(176, 178, 228, 0.17)",
                  width: "95%",
                  borderRadius: 9,
                  padding: 10,
                  marginBottom: 10,
                }}
              >
                <Text
                  style={{ textAlign: "center", fontFamily: "Kanit-Medium" }}
                >
                  {pregunta.texto}
                </Text>
                <TextInput
                  value={
                    respuestas.find((r) => r.id === pregunta.id)?.respuesta ||
                    ""
                  }
                  onChangeText={(text) => saveAnswer(pregunta.id, text)}
                  style={{
                    borderColor: "rgba(176, 178, 228, 0.17)",
                    borderBottomWidth: 1,
                    padding: 8,
                    marginVertical: 10,
                  }}
                />
              </View>
            )}
          </View>
        ))}
        <Text
          style={{
            fontFamily: "Kanit-Medium",
            fontSize: 16,
            textAlign: "center",
            marginTop: 20,
          }}
        >
          Has terminado el mantenimiento!
        </Text>
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={true} // Permite que el fondo se vea
        visible={isModalVisible}
        onRequestClose={() => {
          router.back();
        }}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <ScrollView
              showsVerticalScrollIndicator={true}
              contentContainerStyle={styles.scrollContentContainer}
            >
              <Text style={styles.modalTitle}>
                Aceptación de Términos y Condiciones para el Mantenimiento
              </Text>
              <Text style={styles.bulletPoint}>
                •{" "}
                <Text style={styles.modalText}>
                  Al aceptar los terminos y condiciones para iniciar el
                  mantenimiento, confirmas que eres la persona registrada bajo
                  el nombre:{" "}
                  <Text style={{ fontWeight: "bold" }}>Benito Martínez</Text>.
                </Text>
              </Text>
              <Text style={styles.bulletPoint}>
                •{" "}
                <Text style={styles.modalText}>
                  Te comprometes a llenar cada campo de manera concienzuda y
                  completa, responsabilizándote tanto por la veracidad de los
                  datos ingresados como por el estado del equipo en el cual
                  realizas el mantenimiento.
                </Text>
              </Text>
              <Text style={styles.bulletPoint}>
                •{" "}
                <Text style={styles.modalText}>
                  Ten en cuenta que si el dispositivo se apaga, el temporizador
                  se reiniciará y todas las respuestas registradas hasta el
                  momento se eliminarán, por lo que deberás iniciar el proceso
                  desde el principio.
                </Text>
              </Text>
              <Text style={styles.bulletPoint}>
                •{" "}
                <Text style={styles.modalText}>
                  Una vez presiones “Iniciar Mantenimiento,” el tiempo de
                  servicio comenzará a registrarse automáticamente y quedará
                  almacenado en la hoja de vida de mantenimientos del equipo
                  junto con tu nombre como responsable del mantenimiento.
                </Text>
              </Text>
              <Text style={styles.bulletPoint}>
                •{" "}
                <Text style={styles.modalText}>
                  Finalmente, al darle “Guardar Mantenimiento” y posteriormente
                  “Enviar,” aceptas que el mantenimiento quedará disponible para
                  revisión por el Responsable de Área, quien se encargará de
                  verificar y aprobar el registro para su almacenamiento
                  definitivo en la hoja de vida del equipo.
                </Text>
              </Text>

              <CheckBox
                title="He leido y acepto los terminos y condiciones para este y futuros mantenimientos"
                checked={isAccepted} // Set the initial state of the checkbox
                onPress={() => {
                  setIsAccepted(!isAccepted);
                }} // Add an onPress handler to handle checkbox state changes
              />
              {isAccepted ? (
                <Pressable
                  style={styles.enabledboton}
                  onPress={() => {
                    if (isContinue === true) {
                      toggleModal();
                      continueTimer();
                    } else {
                      startTimer();
                      toggleModal();
                    }
                  }}
                >
                  <Text style={{ color: "white" }}>
                    {isContinue
                      ? "Continuar Mantenimiento"
                      : "Iniciar Mantenimiento"}
                  </Text>
                </Pressable>
              ) : (
                <Pressable style={styles.disabledboton}>
                  <Text style={{ color: "#A9A9A9" }}>
                    {isContinue
                      ? "Continuar Mantenimiento"
                      : "Iniciar Mantenimietno"}{" "}
                  </Text>
                </Pressable>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
      <View style={styles.divbotonesfinales}>
        <Pressable
          onPress={() => {
            router.push({
              pathname: "/screens/mantenimiento/Preview",
              params: {
                idMantenimiento,
                IdEquipo,
                tipo,
                tipoMantenimiento: "correctivo",
                marca,
                modelo,
                serie,
                area,
                hours,
                respuestas: JSON.stringify(respuestas),
              },
            });
          }}
          style={styles.guadarboton}
        >
          <Text style={{ color: "white", fontFamily: "Kanit-Medium" }}>
            Finalizar Mantenimiento
          </Text>
        </Pressable>
        <Pressable
          onPress={() => {
            saveMantenimiento();
          }}
          style={styles.guadarboton}
        >
          <Text style={{ color: "white", fontFamily: "Kanit-Medium" }}>
            Guardar Mantenimiento
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: "20%",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)", // Fondo semitransparente
    justifyContent: "center",
    alignItems: "center",
  },
  preguntas: {
    width: width * 0.9,
    position: "relative",
    top: height * 0.27,
    alignItems: "center",
    paddingBottom: height * 0.3,
  },

  bulletPoint: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  parametro: {
    marginVertical: 3,
    fontFamily: "Kanit-Medium",
    width: "50%",
  },
  parametroinfo: {
    color: "rgba(0, 0, 0, 0.3)",
    fontFamily: "Kanit-Light",
  },
  scrollContentContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexGrow: 1,
    paddingBottom: 20, // espacio inferior para el botón de cerrar
  },
  modalContainer: {
    margin: 20,
    width: "85%",
    maxHeight: "90%",
    paddingLeft: "3%",
    paddingRight: "2%",
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: "white",
    borderRadius: 10,
  },
  modalTitle: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
    padding: "5%",
  },
  modalText: {
    fontSize: 14,
    color: "#333",
  },
  closeButton: {
    color: "white", // Color del botón de cerrar
  },
  disabledboton: {
    alignItems: "center",
    justifyContent: "center",
    height: "6%",
    width: "70%",
    borderRadius: 10,
    backgroundColor: "#D3D3D3",
    color: "white",
    marginTop: "5%",
  },
  enabledboton: {
    alignItems: "center",
    justifyContent: "center",
    height: "6%",
    width: "70%",
    borderRadius: 10,
    backgroundColor: "blue",
    color: "white",
    marginTop: "5%",
  },

  cajaparametros: {
    paddingLeft: "5%",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: "60%",
    flexDirection: "row",
    flexWrap: "wrap",
    height: "45%",
    width: "100%",
  },
  divbotonesfinales: {
    position: "absolute",
    bottom: 0,
    backgroundColor: "#ebebeb",
    flexDirection: "row",
    width: "100%",
    height: height * 0.1,
    justifyContent: "space-around",
    zIndex: 1,
  },
  guadarboton: {
    top: "5%",
    padding: 5,
    height: "60%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    backgroundColor: "#050259",
    color: "white",
  },
});

export default Correctivo;
