import { View, Text, StyleSheet, Pressable } from "react-native";
import { TextInput } from "react-native";
import { useState } from "react";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import url from "../constants/url.json";
import { Alert } from "react-native";
import { useLayoutEffect, useEffect } from "react";
export default function CrearArea() {
  const [nombreArea, setNombreArea] = useState("");
  const [responsable, setResponsable] = useState("");
  const [profesionales, setProfesionales] = useState([]);
  const [areas, setAreas] = useState([]);
  const [searchQueryProfesional, setSearchQueryProfesional] = useState("");
  const [searchQueryArea, setSearchQueryArea] = useState("");

  const crearArea = async () => {
    console.log("corriendo");
    try {
      const response = await axios.post(`${url.url}/area`, {
        nombre: nombreArea,
        responsableArea: responsable,
        documentoResponsableArea: "123456",
      });
      console.log(response.data);
      if (response.data.msg === "Area creada") {
        Alert.alert("Area creada correctamente");
      } else {
        Alert.alert("Ha habido un error", response.data.msg);
      }
    } catch (error) {
      Alert.alert("Ha habido un error");
      console.error(error);
    }
  };
  const fetchAreas = async () => {
    try {
      const response = await axios.get(`${url.url}/getareas`);
      console.log(response.data);
      setAreas(response.data.map((area: { nombre: string }) => area.nombre));
    } catch (error) {
      console.error(error);
    }
  };

  const filteredProfesionales = profesionales.filter((profesional:string) =>
    profesional.toLowerCase().includes(searchQueryProfesional.toLowerCase())
  );
  const filteredAreas = areas.filter((area:string) =>
    area.toLowerCase().includes(searchQueryArea.toLowerCase())
  );
  const fetchResponsables = async () => {
    try {
      const response = await axios.get(`${url.url}/getprofesionales`);
      console.log(response.data);
      setProfesionales(
        response.data.map(
          (profesional: { nombre: string }) => profesional.nombre
        )
      );
      console.log(profesionales);
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
              style={{color: "red"}}
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
            responsable === ""
              ? "Introduce el responsable del Area"
              : "Responsable seleccionado: " + responsable
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
              style={styles.whitetext}
            >
              {profesional}
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
