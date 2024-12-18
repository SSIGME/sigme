import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Image,
  Pressable,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import React from "react";
import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import axios from "axios";
import url from "@/constants/url.json";
import { useRouter } from "expo-router";
import { useFonts } from "expo-font";
import { Dimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCodeDeleteStore, useCodeWriteStore } from "@/app/utils/useStore";
interface Area {
  codigoIdentificacion: string;
  nombre: string;
  hospital: string;
  idEquipos: any[];
  documentoResponsableArea: string;
  responsableArea: string;
}

interface Equipo {
  area: string;
  UltimoMantenimiento: string;
  ProximaVisita: string;
  Imagen: string;
  codigoIdentificacion: string;
  Tipo: string;
  Marca: string;
  Modelo: string;
  Serie: string;
}
const { width, height } = Dimensions.get("window");
const ListarEquipos = () => {
  const codeWrite = useCodeWriteStore((state) => state.codeWrite);
  const setCodeWrite = useCodeWriteStore((state) => state.setCodeWrite);
  const setCodeDelete = useCodeDeleteStore((state) => state.setCodeDelete);
  const codeDelete = useCodeDeleteStore((state) => state.codeDelete);
  const [codigoHospital, setCodigoHospital] = useState("");
  const router = useRouter();
  const { codigoIdentificacion, comeback } = useLocalSearchParams();
  const [area, setArea] = useState<Area | null>(null);
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [search, setSearch] = useState("");
  const [fontsLoaded] = useFonts({
    "Kanit-Regular": require("@/assets/fonts/Kanit/Kanit-Regular.ttf"),
    "Kanit-Medium": require("@/assets/fonts/Kanit/Kanit-Medium.ttf"),
    "Kanit-Light": require("@/assets/fonts/Kanit/Kanit-Light.ttf"),
  });

  const getImagen = async (
    codigoIdentificacion: string,
    codigoHospital: string
  ) => {
    try {
      const response = await axios.get(
        `${url.url}/static_images/${codigoHospital}/${codigoIdentificacion}`
      );
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      console.error(error);
    }
  };
  const filteredEquipos = equipos.filter((equipo) =>
    equipo.Tipo.toLowerCase().includes(search.toLowerCase())
  );

  const getEquipos = async () => {
    const codigoHospital = await AsyncStorage.getItem("codigoHospital");
    try {
      const response = await axios.get(
        `${url.url}/getequipos/${codigoHospital}/${codigoIdentificacion}`
      );
      if (response.status === 200) {
        console.log(response.data);
        setEquipos(response.data);
        console.log("Estos son los equipos", equipos);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getArea = async () => {
    const codigoHospital = await AsyncStorage.getItem("codigoHospital");
    if (codigoHospital === null) {
      Alert.alert("Error", "No se pudo obtener el codigo del hospital");
      return;
    } else {
      setCodigoHospital(codigoHospital);
    }
    try {
      const response = await axios.get(
        `${url.url}/getarea/${codigoHospital}/${codigoIdentificacion}`
      );
      if (response.status === 200) {
        console.log(response.data);
        setArea(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getArea();
    getEquipos();
  }, []);

  if (!area) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {equipos.length === 0 ? (
        <View
          style={{
            position: "absolute",
            width: "100%",
            height: "20%",
            justifyContent: "center",
            alignItems: "center",
            top: "30%",
          }}
        >
          <Text style={styles.textbold}>
            No se han encontrado equipos en {area.nombre}
          </Text>
          <Text style={styles.textbold}>
            Responsable de area: {area.responsableArea}
          </Text>
          <Text style={styles.textbold}>
            Codigo de identificacion del area: {area.codigoIdentificacion}
          </Text>
        </View>
      ) : (
        <View style={styles.infoarea}>
          <Text style={[styles.title, { fontFamily: "Kanit-Light" }]}>
            Busca el <Text style={{ fontFamily: "Kanit-Medium" }}>Equipo</Text>
          </Text>
          <TextInput
            style={{
              position: "absolute",
              right: "10%",
              width: "45%",
              height: height * 0.08,
              backgroundColor: "rgba(0, 0, 98, 0.75)",
              borderRadius: 10,
              color: "white",
              paddingLeft: 10,
              fontFamily: "Kanit-Regular",
            }}
            placeholder="EJ. Tensiometro..."
            placeholderTextColor="lightgray"
            returnKeyType="search"
            onChangeText={(text) => {
              setSearch(text);
            }}
          />
        </View>
      )}
      <ScrollView
        contentContainerStyle={styles.listequipos}
        scrollEnabled={true}
        showsVerticalScrollIndicator={true}
      >
        {equipos.length === 0
          ? null
          : search === ""
          ? equipos.map((equipo) => (
              <Pressable
                onPress={() => {
                  {
                    comeback === "EliminarEquipo" ? (
                      setCodeDelete(equipo.codigoIdentificacion),
                      router.replace("Equipo/EliminarEquipo")
                    ) : (
                      setCodeWrite(equipo.codigoIdentificacion),
                      router.replace("Equipo/EscribirTag")
                    );

                  }
                }}
                style={styles.cadaequipo}
                key={equipo.codigoIdentificacion}
              >
                <View
                  style={{
                    position: "absolute",
                    left: "5%",
                    width: "40%",
                    height: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Image
                    source={{
                      uri: equipo.Imagen,
                    }}
                    style={{
                      width: "90%",
                      height: "90%",
                      borderRadius: 20,
                    }}
                  />
                </View>
                <View
                  style={{ position: "absolute", left: "48%", height: "95%" }}
                >
                  <Text style={styles.whitetext}>{equipo.Tipo}</Text>
                  <Text style={styles.whitetext}>{equipo.Marca}</Text>
                  <Text style={styles.whitetext}>{equipo.Modelo}</Text>
                  <Text style={styles.whitetext}>{equipo.Serie}</Text>
                  <Text style={styles.whitetext}>
                    {equipo.codigoIdentificacion}
                  </Text>
                </View>
              </Pressable>
            ))
          : filteredEquipos.map((equipo) => (
              <Pressable
                style={styles.cadaequipo}
                key={equipo.codigoIdentificacion}
              >
                <View
                  style={{
                    position: "absolute",
                    left: "5%",
                    width: "40%",
                    height: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Image
                    source={{
                      uri: equipo.Imagen,
                    }}
                    style={{
                      width: "90%",
                      height: "90%",
                      borderRadius: 20,
                    }}
                  />
                </View>
                <View
                  style={{
                    position: "absolute",
                    left: "48%",
                    height: height * 0.16,
                  }}
                >
                  <Text style={styles.whitetext}>{equipo.Tipo}</Text>
                  <Text style={styles.whitetext}>{equipo.Marca}</Text>
                  <Text style={styles.whitetext}>{equipo.Modelo}</Text>
                  <Text style={styles.whitetext}>{equipo.Serie}</Text>
                  <Text style={styles.whitetext}>
                    {equipo.codigoIdentificacion}
                  </Text>
                </View>
              </Pressable>
            ))}
      </ScrollView>
    </View>
  );
};

export default ListarEquipos;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
  },
  infoarea: {
    flexDirection: "row",
    marginLeft: "3%",
    justifyContent: "center",
    width: "100%",
    height: "15%",
    alignItems: "center",
  },
  listequipos: {
    flexGrow: 1,
    paddingTop: "5%",
    width: width,
    alignItems: "center",
    paddingBottom: 20,
  },
  cadaequipo: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 0.1,
    flexDirection: "row",
    padding: "2%",
    alignItems: "center",
    justifyContent: "space-around",
    width: width * 0.88,
    height: height * 0.18,
    backgroundColor: "rgba(0, 0, 98, 0.75)", // Fondo del botón
    marginBottom: "5%",
    borderRadius: 9, // Bordes redondeados
  },

  title: {
    color: "black",
    position: "absolute",
    left: "5%",
    width: "30%",
    fontSize: 24,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  whitetext: {
    marginBottom: 4,
    color: "white",
    fontWeight: "400",
    fontFamily: "Kanit-Regular",
    fontSize: width * 0.035, // Tamaño de fuente proporcional al ancho de la pantalla
  },
  textbold: {
    textAlign: "center",
    color: "black",
    fontWeight: "bold",
    fontFamily: "Kanit-Regular",
    fontSize: 16,
  },
});
