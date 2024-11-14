import { View, Text, StyleSheet, Pressable } from "react-native";
import { TextInput } from "react-native";
import { useState } from "react";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import url from "../constants/url.json";
import { Alert } from "react-native";
import { useLayoutEffect, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
interface Responsable {
  nombre: string;
  documento: string;
}
export default function CrearArea() {
  const [codigoHospital, setCodigoHospital] = useState("ISAK");
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

  const crearArea = async () => {
    console.log("corriendo", responsable.documento);
    try {
      const response = await axios.post(`${url.url}/area`, {
        codigoHospital: codigoHospital,
        nombre: nombreArea,
        responsableArea: responsable.nombre,
        documentoResponsableArea: responsable.documento,
      });
      console.log("nombres", response.data);
      if (response.status === 201) {
        Alert.alert("Area creada correctamente");
      } else {
        Alert.alert("Ha habido un error", response.data.msg);
      }
    } catch (error) {
      Alert.alert("Ha habido un error");
      console.error(error);
    }
  };
  const filteredProfesionales = profesionales.filter((profesional) =>
    profesional.nombre
      ?.toLowerCase()
      .includes(searchQueryProfesional.toLowerCase())
  );
  console.log("Profesionales:", profesionales);
  console.log("Search Query:", searchQueryProfesional);
  console.log("Filtered Profesionales:", filteredProfesionales);
  const filteredAreas = areas.filter((area: string) =>
    area.toLowerCase().includes(searchQueryArea.toLowerCase())
  );
  const fetchAreas = async () => {
    try {
      const response = await axios.get(`${url.url}/getareas/${codigoHospital}`);
      console.log(response.data);
      setAreas(response.data.map((area: { nombre: string }) => area.nombre));
    } catch (error) {
      console.error(error);
    }
  };
  const fetchResponsables = async () => {
    try {
      const response = await axios.get(
        `${url.url}/getprofesionales/${codigoHospital}`
      );
      console.log("Profesionales", response.data);
      if (Array.isArray(response.data) && response.data.length > 0) {
        // Mapea solo los campos 'documento' y 'nombre' y los guarda en el estado
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
        <Text
          style={[
            { top: "5%", position: "absolute", fontSize: 25 },
            styles.whitetext,
          ]}
        >
          CREAR AREA
        </Text>
        <TextInput
          style={styles.inputs}
          placeholder="Introduce el nombre del Area"
          value={searchQueryArea}
          onChangeText={(text) => {
            setNombreArea(text);
            setSearchQueryArea(text);
          }}
        />
        {searchQueryArea !== "" ? (
          filteredAreas.map((area, index) => (
            <Text
              onPress={() => {
                setNombreArea(area);
                setSearchQueryArea("");
              }}
              key={index}
              style={{ color: "red" }}
            >
              Area existente con el nombre: {area}
            </Text>
          ))
        ) : (
          <></>
        )}
        <TextInput
          style={styles.inputs}
          placeholder={
            responsable.nombre === "" && responsable.documento === ""
              ? "Introduce el responsable del Area"
              : "Responsable seleccionado: " + responsable.nombre
          }
          value={searchQueryProfesional}
          onChangeText={setSearchQueryProfesional}
        />
        {searchQueryProfesional !== "" ? (
          filteredProfesionales.map((profesional, index) => (
            <Text
              onPress={() => {
                setResponsable(profesional);
                setSearchQueryProfesional("");
              }}
              key={index}
            >
              {profesional.nombre}: {profesional.documento}
            </Text>
          ))
        ) : (
          <></>
        )}
        <Pressable
          onPress={crearArea}
          style={{
            backgroundColor: "blue",
            width: "80%",
            height: "15%",

            justifyContent: "center",
            alignItems: "center",
            borderRadius: 10,
          }}
        >
          <Text style={styles.whitetext}>Crear Area</Text>
        </Pressable>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  divinputs: {
    top: "10%",
    backgroundColor: "gray",
    width: "100%",
    height: "80%",
    justifyContent: "center",
    alignItems: "center",
  },
  inputs: {
    backgroundColor: "white",
    width: "80%",
    height: "15%",
    marginBottom: "5%",
    borderRadius: 10,
    paddingLeft: 10,
  },
  picker: {
    width: "100%", // Asegúrate de que el Picker tenga un ancho
    height: 50, // Establece una altura adecuada para que sea visible
  },
  whitetext: {
    color: "white",
  },
});
