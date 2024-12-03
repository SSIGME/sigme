import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Alert,
  Image,
  Modal,
} from "react-native";
import axios from "axios";
import url from "@/constants/url.json";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { images, iconos } from "@/app/utils/IconosProvider";
import { useRouter } from "expo-router";
import { Dimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
const { width, height } = Dimensions.get("window");
interface Responsable {
  nombre: string;
  documento: string;
}
interface Icono {
  nombre: string;
  ruta: string;
}

export default function CrearArea() {
  const router = useRouter();
  const [modalIconsVisible, setModalIconsVisible] = useState(false);
  const [pathIcon, setPathIcon] = useState("");
  const [nombreArea, setNombreArea] = useState("");
  const [responsable, setResponsable] = useState<Responsable>({
    nombre: "",
    documento: "",
  });
  const [profesionales, setProfesionales] = useState<
    { nombre: string; documento: string }[]
  >([]);
  const [areas, setAreas] = useState([]);
  const [searchQueryProfesional, setSearchQueryProfesional] = useState("");
  const [searchQueryArea, setSearchQueryArea] = useState("");
  const toggleModalIcons = () => setModalIconsVisible(!modalIconsVisible);
  const [codigoHospital, setCodigoHospital] = useState("");
  const crearArea = async () => {
    if (pathIcon === "") {
      Alert.alert("Debe seleccionar una imagen para el area");
    } else if (!nombreArea) {
      Alert.alert("Debe asignarle un nombre al area");
    } else if (
      !profesionales.some((prof) => prof.nombre === responsable.nombre)
    ) {
      Alert.alert(
        "El nombre del responsable no es válido, por favor seleccione un profesional de los disponibles, si no encuentra el profesional cree uno desde el apartado de codigos de acceso"
      );
    } else {
      try {
        const response = await axios.post(`${url.url}/area`, {
          codigoHospital,
          nombre: nombreArea,
          responsableArea: responsable.nombre,
          documentoResponsableArea: responsable.documento,
          icono: pathIcon,
        });
        if (response.status === 201) {
          Alert.alert("Área creada correctamente, subiendo imagen...");
          router.back();
        } else {
          Alert.alert("Error", response.data.msg || "Algo salió mal");
        }
      } catch (error) {
        Alert.alert("Error", "No se pudo crear el área");
        console.error(error);
      }
    }
  };

  const filteredProfesionales = profesionales.filter((profesional) =>
    profesional.nombre
      ?.toLowerCase()
      .includes(searchQueryProfesional.toLowerCase())
  );

  const filteredAreas = areas.filter((area: string) =>
    area.toLowerCase().includes(searchQueryArea.toLowerCase())
  );

  const fetchAreas = async () => {
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

  const fetchResponsables = async () => {
    const codigoHospital = await AsyncStorage.getItem("codigoHospital");
    try {
      const response = await axios.get(
        `${url.url}/getprofesionales/${codigoHospital}`
      );
      console.log("Estos son los profesionales", response.data);
      if (Array.isArray(response.data) && response.data.length > 0) {
        const profesionalesData = response.data.map((profesional) => ({
          documento: profesional.documento,
          nombre: profesional.nombre,
        }));
        setProfesionales(profesionalesData);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAreas();
    fetchResponsables();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.divinputs}>
        <Text style={styles.title}>Ingresa los datos del Área</Text>
        <TextInput
          style={styles.inputs}
          placeholder={
            nombreArea === ""
              ? "Introduce el nombre del Área "
              : "Area seleccionada " + nombreArea
          }
          value={searchQueryArea}
          onChangeText={(text) => {
            setNombreArea(text);
            setSearchQueryArea(text);
          }}
        />
        {searchQueryArea !== "" &&
          filteredAreas.map((area, index) => (
            <Text
              key={index}
              style={styles.suggestionItem}
              onPress={() => {
                setNombreArea(area);
                setSearchQueryArea("");
              }}
            >
              Área existente: {area}
            </Text>
          ))}
        <TextInput
          style={styles.inputs}
          placeholder={
            responsable.nombre === "" && responsable.documento === ""
              ? "Introduce el responsable del Área"
              : `Responsable: ${responsable.nombre}`
          }
          value={searchQueryProfesional}
          onChangeText={setSearchQueryProfesional}
        />
        {searchQueryProfesional !== "" &&
          filteredProfesionales.map((profesional, index) => (
            <Text
              key={index}
              style={styles.suggestionItem}
              onPress={() => {
                setResponsable(profesional);
                setSearchQueryProfesional("");
              }}
            >
              {profesional.nombre}: {profesional.documento}
            </Text>
          ))}
        <Pressable onPress={toggleModalIcons} style={styles.button}>
          <Text style={styles.buttonText}>Seleccionar Imagen</Text>
        </Pressable>
        <Pressable onPress={crearArea} style={styles.button}>
          <Text style={styles.buttonText}>Crear Área</Text>
        </Pressable>
      </View>
      {pathIcon && (
        <View
          style={{
            width: "80%",
            height: "20%",
            alignItems: "center",
            position: "absolute",
            bottom: height * 0.1,
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "bold",
              color: "#2d3748",
              marginBottom: 20,
            }}
          >
            Icono seleccionado para el area:
          </Text>
          <Image
            source={images[pathIcon]}
            style={{
              width: 100,
              height: 100,
              position: "absolute",
              bottom: "10%",
            }}
          />
        </View>
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalIconsVisible}
        onRequestClose={toggleModalIcons}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecciona un Icono</Text>
            <View style={styles.iconsContainer}>
              {iconos.map((icono, index) => (
                <Pressable
                  key={index}
                  onPress={() => {
                    setPathIcon(icono.ruta);
                    toggleModalIcons();
                  }}
                  style={styles.iconPressable}
                >
                  <Image source={images[icono.ruta]} style={styles.iconImage} />
                </Pressable>
              ))}
            </View>
            <Pressable onPress={toggleModalIcons} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    width: "80%",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4, // Sombra para Android
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2d3748",
    marginBottom: 20,
  },
  iconsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  iconPressable: {
    alignItems: "center",
    margin: 10,
  },
  iconImage: {
    width: 50,
    height: 50,
  },
  iconText: {
    marginTop: 5,
    fontSize: 14,
    color: "#2d3748",
  },
  closeButton: {
    backgroundColor: "#e53e3e", // Rojo para el botón de cerrar
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginTop: 20,
  },
  closeButtonText: {
    color: "#ffffff", // Texto blanco en el botón
    fontSize: 16,
    fontWeight: "bold",
  },
  container: {
    height: height * 0.9,
    width: width,
    backgroundColor: "#f0f4f8", // Fondo suave
    paddingHorizontal: 16,
    alignItems: "center",
  },
  divinputs: {
    position: "absolute",
    top: "20%",
    backgroundColor: "#ffffff", // Fondo blanco para el formulario
    width: "100%",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4, // Sombra para Android
    alignItems: "center",
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2d3748",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#3182ce", // Azul vibrante para el botón
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: "#ffffff", // Texto blanco en el botón
    fontSize: 16,
    fontWeight: "bold",
  },
  suggestionItem: {
    color: "#2b6cb0", // Azul para ítems seleccionables
    marginVertical: 5,
    fontSize: 16,
  },
});
