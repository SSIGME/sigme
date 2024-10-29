import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { useRouter } from "expo-router";
import axios from "axios";
import url from "@/constants/url.json";
import { Picker } from "@react-native-picker/picker";
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
  const { tipo, marca, modelo } = useLocalSearchParams();
  const [isModalVisible, setIsModalVisible] = useState(true);
  const [preguntas, setPreguntas] = useState<Pregunta[]>([]);
  const [respuestas, setRespuestas] = useState<Respuesta[]>([]);
  const [timer, setTimer] = useState(0);
  const [hours, setHours] = useState(0);
  const saveAnswer = (id: number, respuesta: string) => {};
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
            }) => ({
              opciones: pregunta.opciones,
              tipo: pregunta.tipo,
              texto: pregunta.texto,
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
              <Picker selectedValue={""} onValueChange={(itemValue) => {}}>
                <Picker.Item label="Selecciona una opción" value="" />
                {pregunta.opciones.map((opcion, index) => (
                  <Picker.Item key={index} label={opcion} value={opcion} />
                ))}
              </Picker>
            </View>
          ) : (
            <View>
              <Text>
                Pregunta Abierta: <Text>{pregunta.texto}</Text>
              </Text>
              <TextInput
                placeholder="Escribe tu respuesta"
                style={{
                  height: 40,
                  borderColor: "gray",
                  borderWidth: 1,
                  width: "100%",
                }}
              />
            </View>
          )}
        </View>
      ))}
      <Modal
        animationType="slide"
        transparent={true} // Permite que el fondo se vea
        visible={isModalVisible}
        onRequestClose={toggleModal}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={{ textAlign: "center" }}>
              Estas a punto de iniciar el mantenimiento al presionar el boton
              iniciar mantenimiento aceptas los terminos y condiciones:
            </Text>
            <Text>
              Eres el encargado de mantenimiento: <Text>Benito Maltinez</Text>
            </Text>
            <Text>
              Cuando presiones el boton de iniciar mantenimiento se iniciara un
              temporizador el cual medira el tiempo de mantenimiento del equipo
              y este tiempo se sumara a la hoja de vida del equipo
            </Text>
            <Pressable
              onPress={() => {
                toggleModal();
                startTimer();
              }}
            >
              <Text style={styles.closeButton}>Iniciar Mantenimiento</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
  modalContainer: {
    width: "80%", // Ancho del modal
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    marginBottom: 10, // Espaciado entre los textos
  },
  closeButton: {
    color: "blue", // Color del botón de cerrar
    marginTop: 10, // Espaciado superior del botón
  },
});

export default Correctivo;
