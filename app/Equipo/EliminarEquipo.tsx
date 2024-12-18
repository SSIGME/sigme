import { Pressable, StyleSheet, Text, View, Image, Alert } from "react-native";
import React, { useCallback, useEffect } from "react";
import ListarAreas from "@/app/Area/ListarAreas";
import { useCodeDeleteStore } from "@/app/utils/useStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Equipo } from "@/app/Models/Equipo";
import axios from "axios";
import url from "@/constants/url.json";
import { router } from "expo-router";
const EliminarEquipo = () => {
  const [equipo, setEquipo] = React.useState<Equipo | null>(null);
  const codeDelete = useCodeDeleteStore((state) => state.codeDelete);
  const setCodeDelete = useCodeDeleteStore((state) => state.setCodeDelete);
  const handleClick = (codigo: string) => {
    console.log("Código actual:", codeDelete);
    setCodeDelete(codigo);
  };
  const DeleteEquipo = async () => {
    try {
      const codigoHospital = await AsyncStorage.getItem("codigoHospital");
      const response = await axios.delete(
        `${url.url}/delete/equipo/${codigoHospital}/${codeDelete}`
      );
      if (response.status === 200) {
        Alert.alert("El equipo ha sido borrado correctamente");
        router.replace("Equipo/EliminarEquipo");
        handleClick("");
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    console.log("Ha cambiado codeDelete", codeDelete);
    if (codeDelete !== "") {
      getEquipo(codeDelete);
    } else {
      setEquipo(null);
    }
  }, []);

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
  const ConfirmarEliminacion = () => {
    return (
      <View style={styles.container}>
        <View style={styles.infoContainerbig}>
          <Text style={styles.title}>
            Estas a punto de eliminar este equipo y todos sus documentos
          </Text>
          <View style={styles.infoContainer}>
            <Image
              source={{ uri: equipo?.Imagen }}
              style={{ width: 100, height: 100 }}
            />
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Tipo:</Text>
            <Text style={styles.value}>{equipo?.Tipo}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Marca:</Text>
            <Text style={styles.value}>{equipo?.Marca}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Modelo:</Text>
            <Text style={styles.value}>{equipo?.Modelo}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Serie:</Text>
            <Text style={styles.value}>{equipo?.Serie}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Área:</Text>
            <Text style={styles.value}>{equipo?.area}</Text>
          </View>
          <Text style={styles.code}>Código: {codeDelete}</Text>
          <Text style={styles.code}>
            Si esta seguro de borrarlo presione el siguiente boton:
          </Text>
          <Pressable
            style={{
              marginTop: "10%",
              width: "80%",
              height: "15%",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "red",
              borderRadius: 10,
            }}
            onPress={() => {
              DeleteEquipo();
            }}
          >
            <Text
              style={{
                color: "white",
                fontWeight: "bold",
                fontSize: 24,
              }}
            >
              Eliminar equipo
            </Text>
          </Pressable>
        </View>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {codeDelete === ""
          ? "Seleccione un equipo para eliminarlo"
          : "Equipo seleccionado para eliminar"}
      </Text>
      {codeDelete === "" ? (
        <ListarAreas comeback={"EliminarEquipo"} />
      ) : (
        <ConfirmarEliminacion />
      )}
    </View>
  );
};

export default EliminarEquipo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  infoContainerbig: {
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: "10%",
  },
  text: {
    padding: 16,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  infoContainer: {
    justifyContent: "center",
    flexDirection: "row",
    marginHorizontal: 20,
    marginVertical: 10,
  },
  label: {
    fontWeight: "bold",
    fontSize: 16,
    marginRight: 10,
  },
  value: {
    fontSize: 16,
  },
  code: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    fontWeight: "bold",
  },
});
