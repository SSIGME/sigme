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
import url from "@/constants/url.json";
import { Dimensions } from "react-native";
import ModalHojaVida from "@/app/utils/ModalHojaVida"; // Ensure the path is correct
import Rutina from "@/app/Equipo/Rutina"; // Ensure the path is correct
import Documentos from "@/app/Equipo/Documentos"; // Ensure the path is correct
const { width, height } = Dimensions.get("window");
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { ActionSheetIOS, Platform } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
interface Pregunta {
  id: number;
  pregunta: string;
  tipo: string;
  opciones?: string[];
}

export default function CrearEquipo() {
  const [shouldUploadData, setShouldUploadData] = useState(false);
  const [shouldUploadDocuments, setShouldUploadDocuments] = useState(false);
  const [imageUri, setImageUri] = useState("");
  const [numeroQuestions, setNumeroQuestions] = useState(0);
  const [tipos, setTipos] = useState<string[]>([]);
  const [marcas, setMarcas] = useState<string[]>([]);
  const [modelos, setModelos] = useState<string[]>([]);
  const [serie, setSerie] = useState("");
  const [isModalQuestionsVisible, setIsModalQuestionsVisible] = useState(false);
  const [isModalDocumentVisible, setIsModalDocumentVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState(true);
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
  const [modalHoja, setModalHoja] = useState({ isVisible: false });
  const [gotCodigo, setGotCodigo] = useState("");
  const closeModal = () => {
    setModalHoja({ isVisible: false });
  };
  const addOption = (index: number) => {
    console.log("Añadiendo opción");
    const newPreguntas = [...preguntas];
    newPreguntas[index].opciones.push("");
    setPreguntas(newPreguntas);
  };
  const deleteOption = (index: number, optionIndex: number) => {
    const newPreguntas = [...preguntas];
    newPreguntas[index].opciones.splice(optionIndex, 1);
    setPreguntas(newPreguntas);
  };
  useEffect(() => {
    console.log(preguntas);
  }, [preguntas]);
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
  const uploadRutina = async () => {
    console.log("Subiendo rutina...", selectedTipo);
    if (preguntas.length === 0) {
      Alert.alert("No hay preguntas");
      setShouldUploadDocuments(true);
      return;
    }
    try {
      const response = await axios.post(
        `${url.url}/preventivo/${codigoHospital} `,
        {
          tipoequipo: selectedTipo,
          modelo: selectedModelo,
          marca: selectedMarca,
          preguntas: preguntas,
        }
      );
      if (response.status === 201) {
        Alert.alert("Rutina subida correctamente");
        setShouldUploadDocuments(true);
        setShouldUploadData(true);
      }
    } catch (error) {
      console.error(error);
    }
  }

  const addInput = () => {
    setInputs([...inputs, ""]);
    setPreguntas([
      ...preguntas,
      { pregunta: "", tipo: "abierta", opciones: [], id: preguntas.length },
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
    console.log(codigoHospital);
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
      setGotCodigo(response.data.codigoIdentificacion);
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
    const { status: galleryStatus } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    const { status: cameraStatus } =
      await ImagePicker.requestCameraPermissionsAsync();

    if (galleryStatus !== "granted" || cameraStatus !== "granted") {
      Alert.alert(
        "Error",
        "Necesitas permisos para acceder a la galería y la cámara"
      );
      return;
    }

    const showOptions = async () => {
      if (Platform.OS === "ios") {
        ActionSheetIOS.showActionSheetWithOptions(
          {
            options: ["Cancelar", "Abrir galería", "Tomar foto"],
            cancelButtonIndex: 0,
          },
          async (buttonIndex) => {
            if (buttonIndex === 1) {
              await openGallery();
            } else if (buttonIndex === 2) {
              await openCamera();
            }
          }
        );
      } else {
        const response = await new Promise((resolve) => {
          Alert.alert(
            "Seleccionar una opción",
            "Elige cómo quieres añadir tu imagen",
            [
              {
                text: "Cancelar",
                style: "cancel",
                onPress: () => resolve(null),
              },
              { text: "Abrir galería", onPress: () => resolve("gallery") },
              { text: "Tomar foto", onPress: () => resolve("camera") },
            ]
          );
        });

        if (response === "gallery") {
          await openGallery();
        } else if (response === "camera") {
          await openCamera();
        }
      }
    };

    const openGallery = async () => {
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

    const openCamera = async () => {
      const result = await ImagePicker.launchCameraAsync({
        quality: 1,
        allowsEditing: true,
        aspect: [3, 3],
      });
      if (!result.canceled) {
        const { uri } = result.assets[0];
        setImageUri(uri);
      }
    };

    await showOptions();
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
        `${url.url}/upload_image/${codigoHospital}/${fileName}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        Alert.alert("Imagen subida correctamente");
        uploadRutina();
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
    console.log("SHOULD DOCUMENTS", shouldUploadDocuments);
  }, [shouldUploadDocuments]);
  useEffect(() => {
    getAreas();
    fetchTipos();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container} scrollEnabled={true}>
      <View style={styles.divinputs}>
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
          } // Mostrar el modelo seleccionado o el texto inicial
          value={searchQueryArea}
          onChangeText={setSearchQueryArea}
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
        <View style={styles.divbuttons}>
          {selectedOption && (
            <Pressable onPress={togglemodalQuestions} style={styles.button}>
              <Text style={styles.whitetext}>Añadir preguntas</Text>
            </Pressable>
          )}
          <Pressable onPress={pickImage} style={styles.button}>
            <Text style={styles.whitetext}>Seleccionar imagen</Text>
          </Pressable>
          <Pressable
            onPress={() => setModalHoja({ isVisible: true })}
            style={styles.button}
          >
            <Text style={styles.whitetext}>Rellenar Hoja de vida</Text>
          </Pressable>
          <Pressable
            onPress={() => {
              setIsModalDocumentVisible(true);
            }}
            style={styles.button}
          >
            <Text style={styles.whitetext}> Seleccionar documentos </Text>
          </Pressable>
          <Pressable
            onPress={() => {
              crearEquipo();
            }}
            style={styles.button}
          >
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
            <Text style={{ fontWeight: "bold", fontSize: 22, marginTop: "0%" }}>
              Imagen del equipo:
            </Text>
            <Image
              source={{ uri: imageUri }}
              style={{
                width: width * 0.3,
                height: width * 0.3,
                position: "absolute",
                bottom: "0%",
              }}
            />
          </View>
        )}
      </View>
      <ModalHojaVida
        setShouldUploadData={setShouldUploadData}
        shouldUploadData={shouldUploadData}
        visible={modalHoja.isVisible}
        onClose={closeModal}
        codigoHospital={codigoHospital}
        gotCodigo={gotCodigo}
      />
      <Rutina
        isModalQuestionsVisible={isModalQuestionsVisible}
        setIsModalQuestionsVisible={setIsModalQuestionsVisible}
        deleteOption={deleteOption}
        inputs={inputs}
        addInput={addInput}
        addOption={addOption}
        handleInputChange={handleInputChange}
        removeInput={removeInput}
        preguntas={preguntas}
        updateTipoPregunta={updateTipoPregunta}
        setPreguntas={setPreguntas}
      />
      <Documentos
        gotCodigo={gotCodigo}
        setShouldUploadDocuments={setShouldUploadDocuments}
        shouldUploadDocuments={shouldUploadDocuments}
        codigoHospital={codigoHospital}
        isModalDocumentVisible={isModalDocumentVisible}
        setIsModalDocumentVisible={setIsModalDocumentVisible}
      />
    </ScrollView>
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
    backgroundColor: "#f9fafb", // Fondo claro
    justifyContent: "center",
    alignItems: "center",
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
    height: height * 0.88,
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
    marginTop: "5%",
    justifyContent: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
    height: "20%",
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
    margin: "2%",
    backgroundColor: "rgba(5, 2, 89, 1)", // Azul vibrante para el botón
    width: "45%",
    height: "35%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  whitetext: {
    textAlign: "center",
    color: "#fff", // Texto blanco
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2d3748",
    marginBottom: 20,
  },
});
