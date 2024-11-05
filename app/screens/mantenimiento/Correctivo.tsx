import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { useRouter } from "expo-router";
import axios from "axios";
import url from "@/constants/url.json";
import { Picker } from "@react-native-picker/picker";
import { CheckBox } from "react-native-elements";
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
  const [isAccepted, setIsAccepted] = useState(false);
  const { tipo, marca, modelo, serie, area } = useLocalSearchParams();
  const [isModalVisible, setIsModalVisible] = useState(true);
  const [preguntas, setPreguntas] = useState<Pregunta[]>([]);
  const [respuestas, setRespuestas] = useState<Respuesta[]>([]);
  const [timer, setTimer] = useState(0);
  const [hours, setHours] = useState(0);
  const saveAnswer = (id: number, respuesta: string) => {
    setRespuestas((prevRespuestas) => {
      const respuestaExists = prevRespuestas.find((r) => r.id === id);
      if (respuestaExists) {
        return prevRespuestas.map((r) => (r.id === id ? { id, respuesta } : r));
      } else {
        return [...prevRespuestas, { id, respuesta }];
      }
    });
  };
  const startTimer = () => {
    const startTime = Date.now();
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
    setHours(decimal);
  }, [timer]);

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
  useEffect(() => {
    getRutina();
  }, []);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  return (
    <View style={styles.container}>
      <Text>Mantenimiento Preventivo</Text>
      <Text>Tiempo transcurrido: {formatTime(timer)}</Text>
      <Text>Horas totales para hoja de vida: {hours}</Text>

      <Pressable onPress={toggleModal}>
        <Text>Mostrar Detalles</Text>
      </Pressable>
      {preguntas.map((pregunta, index) => (
        <View key={index}>
          {pregunta.tipo === "cerrada" ? (
            <View>
              <Text>
                Pregunta Cerrada: <Text>{pregunta.texto}</Text>
              </Text>
              <Picker
                selectedValue={
                  respuestas.find((r) => r.id === pregunta.id)?.respuesta || ""
                }
                onValueChange={(itemValue) =>
                  saveAnswer(pregunta.id, itemValue)
                }
              >
                <Picker.Item label="Selecciona una opción" value="" />
                {pregunta.opciones.map((opcion, opcionIndex) => (
                  <Picker.Item
                    key={opcionIndex}
                    label={opcion}
                    value={opcion}
                  />
                ))}
              </Picker>
            </View>
          ) : (
            <View>
              <Text>
                Pregunta Abierta: <Text>{pregunta.texto}</Text>
              </Text>
              <TextInput
                placeholder="Escribe tu respuesta aquí"
                value={
                  respuestas.find((r) => r.id === pregunta.id)?.respuesta || ""
                }
                onChangeText={(text) => saveAnswer(pregunta.id, text)}
                style={{
                  borderColor: "gray",
                  borderWidth: 1,
                  padding: 8,
                  marginVertical: 10,
                }}
              />
            </View>
          )}
        </View>
      ))}
      {respuestas.map((respuesta, index) => (
        <Text key={index}>
          {respuesta.id}: {respuesta.respuesta}
        </Text>
      ))}
      <Modal
        animationType="slide"
        transparent={true} // Permite que el fondo se vea
        visible={isModalVisible}
        onRequestClose={toggleModal}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <ScrollView
              showsVerticalScrollIndicator={false}
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
                  onPress={() => (startTimer(), toggleModal())}
                >
                  <Text style={{ color: "white" }}>Iniciar Mantenimiento</Text>
                </Pressable>
              ) : (
                <Pressable style={styles.disabledboton}>
                  <Text style={{ color: "#A9A9A9" }}>
                    Iniciar Mantenimiento
                  </Text>
                </Pressable>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
      <Pressable
        onPress={() => {
          router.push({
            pathname: "/screens/mantenimiento/Preview",
            params: {
              tipo,
              marca,
              modelo,
              serie,
              area,
              respuestas: JSON.stringify(respuestas),
            },
          });
        }}
        style={styles.guadarboton}
      >
        <Text style={{ color: "white" }}>Guardar Mantenimiento</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)", // Fondo semitransparente
    justifyContent: "center",
    alignItems: "center",
  },
  bulletPoint: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
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
  guadarboton: {
    alignItems: "center",
    justifyContent: "center",
    height: "6%",
    width: "70%",
    borderRadius: 10,
    backgroundColor: "#050259",
    color: "white",
    marginTop: "5%",
  },
});

export default Correctivo;
