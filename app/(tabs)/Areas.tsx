import { useEffect, useState } from "react";
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
import url from "@/constants/url.json";
import axios from "axios";
import { useRouter } from "expo-router";
import { Dimensions } from "react-native";
import { ActivityIndicator } from "react-native";
import { useFonts } from "expo-font";
import DropShadow from "react-native-drop-shadow";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");
const Areas = () => {
  const router = useRouter();
  interface Area {
    icono: string;
    codigoIdentificacion: string;
    nombre: string;
    responsableArea: string;
    cantidadEquipos?: number;
  }
  const navigation = useNavigation(); 
  const [areas, setAreas] = useState<Area[]>([]);
  const [search, setSearch] = useState("");
  const [areaSearch, setAreaSearch] = useState("");
  const [isloading, setIsLoading] = useState(true);
  const [fontsLoaded] = useFonts({
    "Kanit-Regular": require("../../assets/fonts/Kanit/Kanit-Regular.ttf"),
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
    } finally {
      console.log("Finalizado");
    }
  };
  const filteredAreas = areas.filter((area) =>
    area.nombre.toLowerCase().includes(search.toLowerCase())
  );
  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);
  useEffect(() => {
    getAreas();
  }, []);

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        backgroundColor: "white",
/*         backgroundColor: "rgba(0, 175, 255, 0.125)",
 */      }}
    >
      <TextInput
        placeholder="Busca el área"
        value={search}
        style={{
          marginTop: "10%",
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

      <ScrollView contentContainerStyle={styles.divareas}>
        {search !== ""
          ? filteredAreas.map((area, index) => (
              <Pressable
                onPress={gotoArea(area, area.nombre)}
                style={styles.boton}
                key={index}
              >
                <View
                  style={{
                    marginLeft: "5%",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "rgba(189, 202, 239, 1)",
                    borderRadius: 9,
                    width: 80,
                    height: 82,
                  }}
                >
                  <Image
                    source={require("../../assets/images/photo.png")}
                    style={{ width: 70, height: 70 }}
                  />
                </View>
                <View
                  style={{
                    marginLeft: "5%",
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
                </View>
              </Pressable>
            ))
          : areas.map((area, index) => (
              <Pressable
                onPress={gotoArea(area, area.nombre)}
                style={styles.boton}
                key={index}
              >
                <View
                  style={{
                    marginLeft: "5%",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "rgba(189, 202, 239, 1)",
                    borderRadius: 9,
                    width: 80,
                    height: 82,
                  }}
                >
                  <Image
                    source={require("../../assets/images/odo.png")}
                    style={{ width: 70, height: 70 }}
                  />
                </View>
                <View
                  style={{
                    marginLeft: "5%",
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
                </View>
              </Pressable>
            ))}
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  divareas: {
    backgroundColor: "light-gray",
    width: width,
    height: height * 0.8,
    display: "flex",
    alignContent: "space-around",
    alignItems: "center",
  },
  boton: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 0.1,
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    width: width * 0.85,
    height: "20%",
    backgroundColor: "rgba(0, 0, 98, 0.75)", // Fondo del botón
    borderRadius: 9,
    marginBottom: "10%",
  },
  whitetext: {
    marginBottom: 5,
    color: "white",
    fontWeight: "400",
    fontFamily: "Kanit-Regular",
    fontSize: 16,
  },
});
export default Areas;