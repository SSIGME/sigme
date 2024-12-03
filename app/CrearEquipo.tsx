import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Image,
  Modal,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { CheckBox } from "react-native-elements";
import axios from "axios";
import url from "../constants/url.json";
import * as ImagePicker from "expo-image-picker";
import { Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");
import AsyncStorage from "@react-native-async-storage/async-storage";
interface Pregunta {
  pregunta: string;
  tipo: string;
  opciones?: string[];
}

export default function CrearEquipo() {
  const [imageUri, setImageUri] = useState("");
  const [numeroQuestions, setNumeroQuestions] = useState(0);
  const [tipos, setTipos] = useState<string[]>([]);
  const [marcas, setMarcas] = useState<string[]>([]);
  const [modelos, setModelos] = useState<string[]>([]);
  const [serie, setSerie] = useState("");
  const [isModalQuestionsVisible, setIsModalQuestionsVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState(false);
  const [selectedModelo, setSelectedModelo] = useState("");
  const [selectedMarca, setSelectedMarca] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedTipo, setSelectedTipo] = useState("");
  const [searchQueryTipo, setSearchQueryTipo] = useState("");
  const [searchQueryMarca, setSearchQueryMarca] = useState("");
  const [searchQueryModelo, setSearchQueryModelo] = useState("");
  const [searchQueryArea, setSearchQueryArea] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [areas, setAreas] = useState<string[]>([]);
  const [preguntas, setPreguntas] = useState<Pregunta[]>([]);
  const [inputs, setInputs] = useState<string[]>([]);
  const [codigoHospital, setCodigoHospital] = useState("");
  const handleInputChange = (text: string, index: number) => {
    const newInputs = [...inputs];
    newInputs[index] = text;
    setInputs(newInputs);
    setPreguntas(
      newInputs.map((pregunta, idx) => ({
        ...preguntas[idx],
        pregunta,
      }))
    );
  };
  const addInput = () => {
    setInputs([...inputs, ""]);
    setPreguntas([
      ...preguntas,
      { pregunta: "", tipo: "abierta", opciones: [] },
    ]);
  };
  const updateTipoPregunta = (index: number, tipo: string) => {
    const newPreguntas = [...preguntas];
    newPreguntas[index] = { ...newPreguntas[index], tipo };
    setPreguntas(newPreguntas);
  };
  const removeInput = (index: number) => {
    const newInputs = [...inputs];
    const newPreguntas = [...preguntas];
    newInputs.splice(index, 1);
    newPreguntas.splice(index, 1);
    setInputs(newInputs);
    setPreguntas(newPreguntas);
  };

  const crearEquipo = async () => {
    console.log(codigoHospital  )

    console.log(
      "Datos del ",
      selectedTipo,
      selectedMarca,
      selectedModelo,
      serie,
      selectedArea,
      imageUri
    );
    if (
      !selectedTipo ||
      !selectedMarca ||
      !selectedModelo ||
      !serie ||
      !selectedArea
    ) {
      Alert.alert("Faltan campos por rellenar");
      return;
    }
    try {
      const response = await axios.post(`${url.url}/equipo`, {
        codigoHospital: codigoHospital,
        tipo: selectedTipo,
        marca: selectedMarca,
        modelo: selectedModelo,
        serie: serie,
        area: selectedArea,
        preguntas: preguntas,
      });
      if (response.status === 201) {
        Alert.alert("Equipo creado correctamente");
      }
      const codigoIdentificacion = response.data.codigoIdentificacion;
      Alert.alert(
        "Equipo creado correctamente",
        `Código de identificación: ${codigoIdentificacion}`
      );
      uploadImage(imageUri, codigoIdentificacion);
    } catch (error) {
      console.error(error);
      Alert.alert("Error al crear el equipo");
    }
  };

  const togglemodalQuestions = () => {
    setIsModalQuestionsVisible(!isModalQuestionsVisible);
  };

  const fetchMarcas = async (tipo: string) => {
    try {
      const response = await axios.get(`${url.url}/getmarcas/${tipo}`);
      setMarcas(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Error", "Necesitas permisos para acceder a la galería");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      quality: 1,
      allowsEditing: true,
      aspect: [3, 3],
    });
    if (!result.canceled) {
      const { uri } = result.assets[0];
      setImageUri(uri);
    }
  };
  const uploadImage = async (imageUri: string, fileName: string) => {
    console.log("Subiendo imagen", fileName);
    try {
      const formData = new FormData();
      formData.append("file", {
        uri: imageUri,
        name: `${fileName}.jpg`, // Nombre del archivo con extensión
        type: "image/jpeg", // Tipo MIME del archivo
      });
      const response = await axios.post(
        `${url.url}/upload_photo/${codigoHospital}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        Alert.alert("Imagen subida correctamente");
      } else {
        console.log("Error al subir la imagen");
      }
    } catch (error) {
      console.error("Error en la subida de imagen", error);
    }
  };
  const fetchTipos = async () => {
    try {
      const response = await axios.get(`${url.url}/gettipos`);
      setTipos(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchModelos = async (marca: string) => {
    console.log("Obteniendo modelos");
    try {
      const response = await axios.get(
        `${url.url}/getmodelos/${selectedTipo}/${marca}`
      );
      setModelos(response.data);
    } catch (error) {
      console.error;
    }
  };

  const getAreas = async () => {
    const codigoHospital = await AsyncStorage.getItem("codigoHospital");
    if (codigoHospital) {
      setCodigoHospital(codigoHospital);
    }
    try {
      const response = await axios.get(`${url.url}/getareas/${codigoHospital}`);
      setAreas(response.data.map((area: { nombre: string }) => area.nombre));
    } catch (error) {
      console.error(error);
    }
  };

  const filteredTipos = tipos.filter((tipo: string) =>
    tipo.toLowerCase().includes(searchQueryTipo.toLowerCase())
  );
  const filteredMarcas = marcas.filter((marca: string) =>
    marca.toLowerCase().includes(searchQueryMarca.toLowerCase())
  );
  const filteredModelos = modelos.filter((modelo: string) =>
    modelo.toLowerCase().includes(searchQueryModelo.toLowerCase())
  );
  const filteredAreas = areas.filter((area) =>
    area.toLowerCase().includes(searchQueryArea.toLowerCase())
  );

  useEffect(() => {
    getAreas();
    fetchTipos();
  }, []);

  return (
    <KeyboardAvoidingView style={styles.container}>
      <View style={styles.divinputs}>
        <Text style={styles.title}>CREAR EQUIPO</Text>

        <TextInput
          placeholder={
            "Tipo de equipo seleccionado: " + selectedTipo ||
            "Selecciona el tipo de equipo"
          }
          value={searchQueryTipo}
          onChangeText={(text) => {
            setSearchQueryTipo(text);
            setSelectedTipo(text);
          }}
          style={styles.inputs}
        />
        {searchQueryTipo &&
          filteredTipos.map((tipo, index) => (
            <Text
              style={styles.suggestionItem}
              key={index}
              onPress={() => {
                setSelectedTipo(tipo);
                fetchMarcas(tipo);
                setSearchQueryTipo("");
              }}
            >
              {tipo}
            </Text>
          ))}

        <TextInput
          placeholder={
            "Marca seleccionada:" + selectedMarca || "Selecciona la marca"
          }
          value={searchQueryMarca}
          onChangeText={(text) => {
            setSearchQueryMarca(text);
            setSelectedMarca(text);
          }}
          style={styles.inputs}
        />
        {searchQueryMarca &&
          filteredMarcas.map((marca, index) => (
            <Text
              key={index}
              style={styles.suggestionItem}
              onPress={() => {
                setSelectedMarca(marca);
                fetchModelos(marca);
                setSearchQueryMarca("");
              }}
            >
              {marca}
            </Text>
          ))}

        <TextInput
          placeholder={
            "Modelo seleccionado:" + selectedModelo || "Selecciona el modelo"
          } // Mostrar el modelo seleccionado o el texto inicial
          value={searchQueryModelo}
          onChangeText={(text) => {
            setSearchQueryModelo(text);
            setSelectedModelo(text);
          }}
          style={styles.inputs}
        />
        {searchQueryModelo &&
          filteredModelos.map((modelo, index) => (
            <Text
              key={index}
              style={styles.suggestionItem}
              onPress={() => {
                setSelectedModelo(modelo);
                setSearchQueryModelo("");
              }}
            >
              {modelo}
            </Text>
          ))}
        <TextInput
          placeholder="Introduce la serie"
          value={serie}
          onChangeText={setSerie}
          style={styles.inputs}
        />
        <TextInput
          placeholder={
            "Area seleccionada:" + selectedArea || "Selecciona el area"
          } // Mostrar el modelo seleccionado o el texto inicial          value={searchQueryArea}
          onChangeText={setSearchQueryArea}
          value={searchQueryArea}
          style={styles.inputs}
        />
        {searchQueryArea &&
          filteredAreas.map((area, index) => (
            <Text
              key={index}
              style={styles.suggestionItem}
              onPress={() => {
                setSelectedArea(area);
                setSearchQueryArea("");
              }}
            >
              {area}
            </Text>
          ))}
        <View style={styles.divcheckbox}>
          <CheckBox
            title="SI"
            checked={selectedOption}
            onPress={() => setSelectedOption(true)}
          />
          <CheckBox
            title="NO"
            checked={!selectedOption}
            onPress={() => setSelectedOption(false)}
          />
        </View>
        <View style={styles.divbuttons}>
          {selectedOption && (
            <Pressable onPress={togglemodalQuestions} style={styles.button}>
              <Text style={styles.whitetext}>Añadir preguntas</Text>
            </Pressable>
          )}
          <Pressable onPress={pickImage} style={styles.button}>
            <Text style={styles.whitetext}>Seleccionar imagen</Text>
          </Pressable>
          <Pressable onPress={crearEquipo} style={styles.button}>
            <Text style={styles.whitetext}>Crear Equipo</Text>
          </Pressable>
        </View>
        {imageUri !== "" && (
          <View
            style={{
              height: "25%",
              width: "60%",
              position: "absolute",
              bottom: "4%",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                color: "#2d3748",
              }}
            >
              Imagen del equipo:
            </Text>
            <Image
              source={{ uri: imageUri }}
              style={{
                width: width * 0.25,
                height: width * 0.25,
                position: "absolute",
                bottom: "10%",
              }}
            />
          </View>
        )}
      </View>
      <Modal
        onRequestClose={() => {
          setIsModalQuestionsVisible(!isModalQuestionsVisible);
        }}
        animationType="slide"
        transparent={true}
        visible={isModalQuestionsVisible}
      >
        <Pressable
          style={styles.overlay}
          onPress={() => setIsModalQuestionsVisible(false)} // Cierra el modal al presionar fuera
        ></Pressable>
        <View style={styles.modalView}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              marginBottom: "5%",
              textAlign: "center",
            }}
          >
            Ingresa las preguntas para la rutina
          </Text>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "normal",
              textAlign: "center",
            }}
          >
            Preguntas actuales: {inputs.length}
          </Text>
          <Pressable
            style={{ justifyContent: "center", alignItems: "center" }}
            onPress={addInput}
          >
            <Image
              source={require("../assets/images/add.png")}
              style={{ width: 40, height: 40, margin: "5%" }}
            />
          </Pressable>
          <ScrollView style={{ width: "100%", height: "60%" }}>
            {inputs.map((input, index) => (
              <View
                key={index}
                style={{
                  height:
                    preguntas[index]?.tipo === "cerrada"
                      ? height * 0.2
                      : height * 0.15,
                  backgroundColor: "#f9f9f9",
                  borderRadius: 10,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.2,
                  shadowRadius: 5,
                  elevation: 3,
                  marginVertical: 20,
                  alignItems: "center",
                }}
              >
                <View style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginVertical: 10,
                  paddingHorizontal: 10,
                }}>
                  <TextInput
                    style={styles.inputsmodal}
                    placeholder={`Ingresa la pregunta número ${index + 1}`}
                    value={input}
                    onChangeText={(text) => handleInputChange(text, index)}
                  />
                  <Pressable
                    style={styles.deleteButton}
                    onPress={() => removeInput(index)}
                  >
                    <Image
                      source={require("../assets/images/delete.png")}
                      style={{ width: 30, height: 30 }}
                    />
                  </Pressable>
                </View>

                <View style={{
                  position: "absolute",
                  top: '35%',
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  marginVertical: 10,
                }}>
                  <CheckBox
                    checked={preguntas[index]?.tipo === "abierta"}
                    onPress={() => updateTipoPregunta(index, "abierta")}
                  />
                  <Text>Abierta</Text>

                  <CheckBox
                    checked={preguntas[index]?.tipo === "cerrada"}
                    onPress={() => updateTipoPregunta(index, "cerrada")}
                  />
                  <Text>Cerrada</Text>
                </View>
                {preguntas[index]?.tipo === "cerrada" && (
                  <Pressable
                    style={{
                      width: "50%",
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "#2C37FF",
                      borderRadius: 10,
                      padding: 5,
                    }}
                    onPress={() => {
                      const newPreguntas = [...preguntas];
                      newPreguntas[index].opciones = [];
                      setPreguntas(newPreguntas);
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: "bold",
                        textAlign: "center",
                        fontSize: 16,
                        color: "#fff",
                      }}
                    >Anadir opcion de respuesta</Text>
                  </Pressable>
                )}
              </View>
            ))}
          </ScrollView>
          <Pressable
            style={[styles.modalboton]}
            onPress={() => setIsModalQuestionsVisible(!isModalQuestionsVisible)}
          >
            <Text style={{ fontWeight: "bold", fontSize: 22 }}>Guardar</Text>
          </Pressable>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  divinputpreguntas: {
    height: height * 0.15,
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  inputsmodal: {
    flex: 1,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  deleteButton: {
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: 40,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(2, 2, 2, 0.712)",
  },
  modalView: {
    height: height * 0.7,
    width: "90%",
    position: "absolute",
    backgroundColor: "#ebebeb",
    top: "10%",
    margin: 20,
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalboton: {
    position: "absolute",
    bottom: height * -0.1,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2C37FF",
    width: "40%",
    height: "15%",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  suggestionItem: {
    color: "#2b6cb0", // Azul para ítems seleccionables
    marginVertical: 5,
    fontSize: 16,
  },
  divinputs: {
    position: "absolute",
    top: "2%",
    backgroundColor: "#ffffff", // Fondo blanco para el formulario
    width: "90%",
    height: height * 0.85,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4, // Sombra para Android
    alignItems: "center",
  },
  divbuttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  inputs: {
    backgroundColor: "#f9fafb", // Fondo claro para inputs
    width: "100%",
    height: 50,
    marginBottom: 15,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    borderColor: "#e2e8f0", // Borde sutil
    borderWidth: 1,
  },

  divcheckbox: {
    flexDirection: "row",
    marginVertical: 10,
  },
  button: {
    backgroundColor: "#3182ce", // Azul vibrante para el botón
    width: "30%",
    height: "35%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginTop: 20,
  },
  whitetext: {
    color: "#fff", // Texto blanco
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2d3748",
    marginBottom: 20,
  },
});
