import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Image,
  Pressable,
} from "react-native";
import React, { useLayoutEffect } from "react";
import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import axios from "axios";
import url from "@/constants/url.json";
import { useRouter } from "expo-router";
import { useFonts } from "expo-font";
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
const AreaDetail = () => {
  const router = useRouter();
  const { codigoIdentificacion } = useLocalSearchParams();
  const [area, setArea] = useState<Area | null>(null);
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [fontsLoaded] = useFonts({
    "Kanit-Regular": require("../../assets/fonts/Kanit/Kanit-Regular.ttf"),
  });

  const navegarEquipo = (
    codigoIdentificacion: string,
    Imagen: string,
    Tipo: string,
    Marca: string,
    Modelo: string,
    Serie: string,
    UltimoMantenimiento: string,
    ProximaVisita: string,
    area: string
  ) => {
    router.push({
      pathname: `/Equipo/EquipoDetail`,
      params: {
        title: Tipo,
        Imagen: Imagen,
        codigoIdentificacion: codigoIdentificacion,
        Tipo: Tipo,
        Marca: Marca,
        Modelo: Modelo,
        Serie: Serie,
        UltimoMantenimiento: UltimoMantenimiento,
        ProximaVisita: ProximaVisita,
        area: area,
      },
    });
  };

  const getEquipos = async () => {
    try {
      const response = await axios.get(
        `${url.url}/getequipos/${codigoIdentificacion}`
      );
      if (response.status === 200) {
        console.log(response.data);
        setEquipos(response.data);
        console.log(equipos.map((equipo) => equipo.Imagen));
      }
    } catch (error) {
      console.error(error);
    }
  };
  const getArea = async () => {
    try {
      const response = await axios.get(
        `${url.url}/getarea/${codigoIdentificacion}`
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
        <ActivityIndicator size="large" />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <View style={styles.infoarea}>
        <Text style={styles.title}>{area.nombre}</Text>
        <Text style={styles.title}>{area.codigoIdentificacion}</Text>
        <Text style={styles.description}>{area.responsableArea}</Text>
      </View>
      <View style={styles.listequipos}>
        {equipos.length === 0 ? (
          <Text>No hay equipos en esta area</Text>
        ) : (
          equipos.map((equipo) => (

            <Pressable
              onPress={() => {
                navegarEquipo(
                  equipo.codigoIdentificacion,
                  equipo.Imagen,
                  equipo.Tipo,
                  equipo.Marca,
                  equipo.Modelo,
                  equipo.Serie,
                  equipo.UltimoMantenimiento,
                  equipo.ProximaVisita,
                  equipo.area
                );
              }}
              style={styles.cadaequipo}
              key={equipo.codigoIdentificacion}
            >
              <View
                style={{
                  position: "absolute",
                  left: "3%",
                  width: "40%",
                  height: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {equipo.Imagen === "" ? (
                  <Image
                    source={require("../../assets/images/tenso.jpg")}
                    style={{ width: "90%", height: "90%", borderRadius: 20 }}
                  />
                ) : (
                  <Image
                    source={{ uri: equipo.Imagen }}
                    style={{ width: "90%", height: "90%", borderRadius: 20 }}
                  />
                )}
              </View>
              <View
                style={{ position: "absolute", left: "48%", height: "90%", }}
              >
                <Text style={styles.whitetext}>{equipo.Tipo}</Text>
                <Text style={styles.whitetext}>{equipo.Marca}</Text>
                <Text style={styles.whitetext}>{equipo.Modelo}</Text>
                <Text style={styles.whitetext}>{equipo.Serie}</Text>
              </View>
            </Pressable>
          ))
        )}
      </View>
    
    </View>
  );
};

export default AreaDetail;

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
    width: "100%",
    height: "18%",
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
  },
  listequipos: {
    position: "absolute",
    top: "15%",
    height: "70%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  cadaequipo: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.00,
    elevation: 0.1,
    flexDirection: "row",
    padding: "2%",
    alignItems: "center",
    justifyContent: "space-around",
    width: "90%",
    height: "25%",
    backgroundColor: "rgba(0, 0, 98, 0.75)", // Fondo del botón
    marginBottom: "5%",
    borderRadius: 9, // Bordes redondeados
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
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
    fontSize: 16,
  },
});
