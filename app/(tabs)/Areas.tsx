import { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  Pressable,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import url from "../../constants/url.json";
import axios from "axios";
import {
  useLocalSearchParams,
  usePathname,
  useRouter,
  useSegments,
} from "expo-router";
import { Dimensions } from "react-native";
import { ActivityIndicator } from "react-native";
import { useFonts } from "expo-font";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";
import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { images, iconos } from "@/app/utils/IconosProvider";
import { useShouldLoadAreas } from "@/app/utils/useStore";
const { width, height } = Dimensions.get("window");

const Areas = () => {
  const { value: shouldLoadAreas } = useShouldLoadAreas(); // Accede al valor
  const pathname = usePathname();
  const segments = useSegments(); // Obtiene las partes de la URL actual
  const [hasFetched, setHasFetched] = useState(false); // Indica si ya se ha hecho la petición
  const router = useRouter();
  interface Area {
    icono: string;
    codigoIdentificacion: string;
    nombre: string;
    responsableArea: string;
    cantidadEquipos?: number;
  }
  const isFocused = useIsFocused(); // Detecta si la pantalla está enfocada
  const [areas, setAreas] = useState<Area[]>([]);
  const [search, setSearch] = useState("");
  const [areaSearch, setAreaSearch] = useState("");
  const [isloading, setIsLoading] = useState(true);
  const [fontsLoaded] = useFonts({
    "Kanit-Regular": require("../../assets/fonts/Kanit/Kanit-Regular.ttf"),
    "Kanit-Medium": require("../../assets/fonts/Kanit/Kanit-Medium.ttf"),
    "Kanit-Light": require("../../assets/fonts/Kanit/Kanit-Thin.ttf"),
  });

  const gotoArea = (area: Area, nombre: string) => () => {
    router.push({
      pathname: `/Area/AreaDetail`,
      params: {
        codigoIdentificacion: area.codigoIdentificacion,
        nombre: nombre,
      },
    });
  };

  const getAreas = async () => {
    const codigoHospital = await AsyncStorage.getItem("codigoHospital");
    try {
      const response = await axios.get(`${url.url}/getareas/${codigoHospital}`);
      if (response.status === 200) {
        console.log(response.data);
        const areasData = response.data.map(
          (area: {
            icono: string;
            codigoIdentificacion: string;
            nombre: string;
            responsableArea: string;
            idEquipos: string[];
          }) => ({
            icono: area.icono,
            codigoIdentificacion: area.codigoIdentificacion,
            nombre: area.nombre,
            responsableArea: area.responsableArea,
            cantidadEquipos: area.idEquipos.length,
          })
        );
        setAreas(areasData);
        console.log(areasData);
      } else {
        Alert.alert("Error", "No se pudo obtener las areas");
      }
    } catch (error) {
      console.error(error);
    } finally {
      console.log("Finalizado");
    }
  };

  const filteredAreas = areas.filter((area) =>
    area.nombre.toLowerCase().includes(search.toLowerCase())
  );
/*   useEffect(() => {
    if (shouldLoadAreas) {
      getAreas();
    }
  }
  , [shouldLoadAreas]); */
  useEffect(() => {
    getAreas();
  }, []);

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }
  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Busca el área"
        value={search}
        style={{
          fontFamily: "Kanit-Light",
          marginTop: "15%",
          fontSize: 20,
          left: "10%",
          width: "80%",
          height: 40,
          borderColor: "gray",
          borderBottomWidth: 1,
          borderRadius: 5,
          marginBottom: 20,
          paddingLeft: 10,
          color: "gray",
        }}
        onChangeText={(text) => {
          setSearch(text);
          setAreaSearch(text);
        }}
      />

      <ScrollView
        contentContainerStyle={[styles.divareas, { paddingBottom: 20 }]}
        scrollEnabled={true}
      >
        {search !== ""
          ? filteredAreas.map((area, index) => (
              <Pressable
                onPress={gotoArea(area, area.nombre)} // Cambia esto a una función anónima
                style={styles.boton}
                key={index}
              >
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "rgba(232, 242, 250, 1)",
                    borderRadius: 9,
                    width: height * 0.125,
                    height: height * 0.125,
                  }}
                >
                  <Image
                    source={images[area.icono]}
                    style={{ width: "100%", height: "100%" }}
                  />
                </View>
                <View
                  style={{
                    justifyContent: "center",
                    borderRadius: 9,
                    width: 200,
                    height: 82,
                  }}
                >
                  <Text style={styles.whitetext}>{area.nombre}</Text>
                  <Text style={styles.whitetext}>{area.responsableArea}</Text>
                  <Text style={styles.whitetext}>
                    {area.codigoIdentificacion}
                  </Text>
                  <Text style={styles.whitetext}>
                    {area.cantidadEquipos} Equipos
                  </Text>
                </View>
              </Pressable>
            ))
          : areas.map((area, index) => (
              <Pressable
                onPress={gotoArea(area, area.nombre)} // Cambia esto a una función anónima
                style={styles.boton}
                key={index}
              >
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "rgba(232, 242, 250, 1)",
                    borderRadius: 9,
                    width: height * 0.125,
                    height: height * 0.125,
                  }}
                >
                  <Image
                    source={images[area.icono]}
                    style={{ width: "100%", height: "100%" }}
                  />
                </View>
                <View
                  style={{
                    justifyContent: "center",
                    borderRadius: 9,
                    width: 200,
                    height: 82,
                  }}
                >
                  <Text style={styles.whitetext}>{area.nombre}</Text>
                  <Text style={styles.whitetext}>{area.responsableArea}</Text>
                  <Text style={styles.whitetext}>
                    {area.codigoIdentificacion}
                  </Text>
                  <Text style={styles.whitetext}>
                    {area.cantidadEquipos} Equipos
                  </Text>
                </View>
              </Pressable>
            ))}
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingBottom: "20%",
  },
  divareas: {
    width: width,
    alignItems: "center",
  },
  boton: {
    shadowOpacity: 0.58,
    shadowRadius: 16.0,

    flexDirection: "row",
    padding: "2%",
    alignItems: "center",
    justifyContent: "space-around",
    width: width * 0.9,
    height: height * 0.16,
    backgroundColor: "#050259", // Fondo del botón
    marginBottom: "5%",
    borderRadius: 9,
    shadowColor: "#00aeff",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    elevation: 8,
  },
  whitetext: {
    marginBottom: 4,
    color: "white",
    fontWeight: "400",
    fontFamily: "Kanit-Regular",
    fontSize: width * 0.035, // Tamaño de fuente proporcional al ancho de la pantalla
  },
});
export default Areas;
