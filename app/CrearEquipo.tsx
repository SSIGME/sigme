import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import Svg from "react-native-svg";
import { TextInput } from "react-native";
import { useEffect, useLayoutEffect, useState } from "react";
import { Picker } from "@react-native-picker/picker";
import { CheckBox } from "react-native-elements";
import { KeyboardAvoidingView } from "react-native";
import { Modal } from "react-native";
import axios from "axios";
import { Alert } from "react-native";
import url from "../constants/url.json";
interface Area {
  codigoIdentificacion: string;
  nombre: string;
  responsableArea: string;
  cantidadEquipos?: number;
}
export default function CrearEquipo() {
  const [numeroQuestions, setNumeroQuestions] = useState(0);
  const [tipos, setTipos] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [modelos, setModelos] = useState([]);
  const [serie, setSerie] = useState("");
  const [isModalQuestionsVisible, setIsModalQuestionsVisible] = useState(false);
  const [isExtraQuestion, setIsExtraQuestion] = useState(false);
  const [isExtraQuestionFalse, setisExtraQuestionFalse] = useState(false);
  const [selectedOption, setSelectedOption] = useState(false);
  const [selectedModelo, setSelectedModelo] = useState("");
  const [selectedMarca, setSelectedMarca] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedTipo, setSelectedTipo] = useState("");
  const [searchQueryTipo, setSearchQueryTipo] = useState("");
  const [searchQueryMarca, setSearchQueryMarca] = useState("");
  const [searchQueryModelo, setSearchQueryModelo] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [areas, setAreas] = useState<Area[]>([]);
  const [questions, setQuestions] = useState([]);
  const [inputs, setInputs] = useState([]);

  const addInput = () => {
    setInputs([...inputs, ""]);
  };

  const handleInputChange = (text: string, index: number) => {
    const newInputs = [...inputs];
    newInputs[index] = text;
    setInputs(newInputs);
    setQuestions(newInputs);
  };
  const crearEquipo = async () => {
    try {
      const response = await axios.post(`${url.url}/equipo`, {
        tipo: selectedTipo,
        marca: selectedMarca,
        modelo: selectedModelo,
        serie: serie,
        area: selectedArea,
        preguntas: questions,
      });
      if (response.status === 201) {
        console.log(response.data);
        Alert.alert("Equipo creado correctamente");
      }
    } catch (error) {
      console.error(error);
    }
  };
  const toggleExtraQuestion = (option: true | false) => {
    setSelectedOption(option);
  };
  const togglemodalQuestions = () => {
    setIsModalQuestionsVisible(!isModalQuestionsVisible);
  };
  const fetchMarcas = async (tipo: string) => {
    console.log("Obteniendo marcas");
    try {
      const response = await axios.get(`${url.url}/getmarcas/${tipo}`);
      setMarcas(response.data);
      console.log("Marcas obtenidas" + response.data);
    } catch (error) {
      console.error(error);
    } finally {
      console.log("finalizado");
    }
  };
  const fetchTipos = async () => {
    console.log("Obteniendo tipos");
    try {
      const response = await axios.get(`${url.url}/gettipos`);
      setTipos(response.data);
      console.log("Equipos obtenidos" + response.data);
    } catch (error) {
      console.error(error);
    } finally {
      console.log("finalizado");
    }
  };
  const getAreas = async () => {
    try {
      const response = await axios.get(`${url.url}/getareas`);
      if (response.status === 200) {
        console.log(response.data);
        setAreas(
          response.data.map(
            (area: {
              codigoIdentificacion: string;
              nombre: string;
              responsableArea: string;
              idEquipos: string[];
            }) => ({
              codigoIdentificacion: area.codigoIdentificacion,
              nombre: area.nombre,
              responsableArea: area.responsableArea,
              cantidadEquipos: area.idEquipos.length,
            })
          )
        );
      } else {
        Alert.alert("Error", "No se pudo obtener las areas");
      }
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
    area.nombre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    getAreas();
    fetchTipos();
  }, []);
  return (
    <KeyboardAvoidingView style={styles.container}>
      <View style={styles.divinputs}>
        <Text
          style={[
            { top: "5%", position: "absolute", fontSize: 25 },
            styles.whitetext,
          ]}
        >
          CREAR EQUIPO
        </Text>

        <TextInput
          placeholder={
            selectedTipo === ""
              ? "Selecciona el tipo de equipo"
              : "Equipo seleccionado: " + selectedTipo
          }
          value={searchQueryTipo}
          onChangeText={setSearchQueryTipo}
        />
        {searchQueryTipo !== "" ? (
          filteredTipos.map((tipo, index) => (
            <Text
              key={index}
              onPress={() => {
                setSelectedTipo(tipo);
                fetchMarcas(tipo);
                setSearchQueryTipo(""); // Limpiar la búsqueda al seleccionar
              }}
            >
              {tipo}
            </Text>
          ))
        ) : (
          <></>
        )}

        <TextInput
          placeholder={
            selectedMarca === ""
              ? "Selecciona la marca"
              : "Marca seleccionado: " + selectedMarca
          }
          value={searchQueryMarca}
          onChangeText={setSearchQueryMarca}
        />
        {searchQueryMarca !== "" ? (
          filteredMarcas.map((marca, index) => (
            <Text
              key={index}
              onPress={() => {
                setSelectedMarca(marca);
                fetchModelos(marca);
                setSearchQueryMarca(""); // Limpiar la búsqueda al seleccionar
              }}
            >
              {marca}
            </Text>
          ))
        ) : (
          <></>
        )}

        <TextInput
          placeholder={
            selectedMarca === ""
              ? "Selecciona el modelo"
              : "Modelo seleccionado: " + selectedModelo
          }
          value={searchQueryModelo}
          onChangeText={setSearchQueryModelo}
        />
        {searchQueryModelo !== "" ? (
          filteredModelos.map((modelo, index) => (
            <Text
              key={index}
              onPress={() => {
                setSelectedModelo(modelo);
                setSearchQueryModelo(""); // Limpiar la búsqueda al seleccionar
              }}
            >
              {modelo}
            </Text>
          ))
        ) : (
          <></>
        )}
        <TextInput
          placeholder="Introduce la serie"
          value={serie}
          onChangeText={setSerie}
        />
        <TextInput
          placeholder={
            selectedArea === ""
              ? "Selecciona el Area"
              : "Area seleccionado: " + selectedArea
          }
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery !== "" ? (
          filteredAreas.map((area, index) => (
            <Text
              key={index}
              onPress={() => {
                setSelectedArea(area.nombre);
                setSearchQuery(""); // Limpiar la búsqueda al seleccionar
              }}
            >
              {area.nombre}
            </Text>
          ))
        ) : (
          <></>
        )}
        <Text style={styles.extraquestion}>
          Deseas anadir preguntas extra a la rutina de mantenimiento?
        </Text>

        <View style={styles.divcheckbox}>
          <CheckBox
            title="SI"
            checked={selectedOption === true}
            onPress={() => toggleExtraQuestion(true)}
          />
          <CheckBox
            title="NO"
            checked={selectedOption === false}
            onPress={() => toggleExtraQuestion(false)}
          />
        </View>
        {selectedOption ? (
          <Pressable onPress={togglemodalQuestions}>
            <Text>Presiona para ingresar las preguntas</Text>
          </Pressable>
        ) : (
          <></>
        )}
        <View>
          <Text>Preguntas anadidas </Text>
          {questions.map((input, index) => (
            <Text key={index}>
              Pregunta numero {index + 1} : {input}
            </Text>
          ))}
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
            <Text style={styles.modalText}>
              Ingresa las preguntas a insertar en la rutina: Preguntas actuales{" "}
              {numeroQuestions}
            </Text>
            <Pressable
              style={{ justifyContent: "center", alignItems: "center" }}
              onPress={() => {
                setNumeroQuestions(numeroQuestions + 1);
                addInput();
              }}
            >
              <Image
                source={require("../assets/images/add.png")}
                style={{ width: 40, height: 40, margin: "5%" }}
              />
            </Pressable>
            {inputs.map((input, index) => (
              <View style={styles.divinputpreguntas}>
                <TextInput
                  key={index}
                  style={styles.input}
                  placeholder={`Ingresa la pregunta numero ${index + 1}`}
                  value={input}
                  onChangeText={(text) => handleInputChange(text, index)}
                />
                <Pressable>
                  <Image
                    source={require("../assets/images/delete.png")}
                    style={{ width: 30, height: 30, margin: "5%" }}
                  />
                </Pressable>
              </View>
            ))}
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() =>
                setIsModalQuestionsVisible(!isModalQuestionsVisible)
              }
            >
              <Text style={styles.textStyle}>Guardar</Text>
            </Pressable>
          </View>
        </Modal>
        <Pressable
          onPress={crearEquipo}
          style={{
            backgroundColor: "blue",
            width: "80%",
            height: "15%",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 10,
          }}
        >
          <Text style={styles.whitetext}>Crear Equipo</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Fondo semi-transparente
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    alignItems: "center",
  },
  extraquestion: {
    textAlign: "center",
    width: "100%",
  },
  divinputs: {
    top: "0%",
    width: "100%",
    height: "70%",
    justifyContent: "center",
    alignItems: "center",
  },
  picker: {
    width: "100%", // Asegúrate de que el Picker tenga un ancho
    height: 50, // Establece una altura adecuada para que sea visible
  },
  divcheckbox: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  whitetext: {
    color: "white",
  },
  modalView: {
    alignItems: "center",
    position: "absolute",
    width: "80%",
    height: "50%",
    top: "20%",
    left: "10%",
    backgroundColor: "beige",
  },
  modalText: {
    padding: "5%",
    textAlign: "center",
  },
  button: {
    width: "60%",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  divinputpreguntas: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: "3%",
    marginBottom: "5%",
  },
  input: {
    width: "85%",
    textAlign: "center",
    borderColor: "gray",
    borderRadius: 25,
    borderWidth: 2,
    padding: "5%",
  },
});
