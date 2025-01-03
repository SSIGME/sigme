import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import url from "../../constants/url.json";
import axios from "axios";
import * as Animatable from "react-native-animatable";
import { useFocusEffect } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import { router, useRouter } from "expo-router";
import { useUserContext } from "@/app/UserContext";
import Icon from "react-native-vector-icons/FontAwesome5";
const { width } = Dimensions.get("window");
const HospitalInfoScreen = () => {
  const route = useRouter();
  const [hospitalData, setHospitalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { userType } = useUserContext();

  const fetchHospitalData = async () => {
    try {
      const codigoHospital = await AsyncStorage.getItem("codigoHospital");
      const token = await AsyncStorage.getItem("access_token");

      if (!codigoHospital || !token)
        throw new Error("No se encontró el código del hospital o el token.");

      const response = await axios.get(
        `${url.url}/hospital/${codigoHospital}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setHospitalData(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const logout = async () => {
    try {
      await AsyncStorage.removeItem("access_token");
      await AsyncStorage.removeItem("codigoHospital");
      await AsyncStorage.removeItem("codigoUsuario");
      await AsyncStorage.removeItem("rol");
      route.replace("/");
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    setLoading(true);
    fetchHospitalData();
  }, []);

  if (loading) {
    return (
      <ActivityIndicator
        color="#6200EE"
        style={{ flex: 1, justifyContent: "center" }}
      />
    );
  }

  if (!hospitalData) {
    return <Text>No se pudo cargar la información del hospital.</Text>;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Animatable.Image
          animation="zoomIn"
          source={{ uri: hospitalData.imagen }}
          style={styles.logo}
        />
        <Animatable.Text animation="fadeInDown" style={styles.header}>
          {hospitalData.nombre || "Nombre del Hospital"}
        </Animatable.Text>
        <Text style={styles.infoText1}>
          {hospitalData.codigoIdentificacion || "N/A"}
        </Text>
        <Animatable.Text animation="fadeIn" style={styles.sectionTitle}>
          Información General
        </Animatable.Text>
        <View style={styles.divider} />

        <Animatable.View animation="slideInUp" style={styles.infoBox}>
          <View style={styles.infoRow}>
            <Text style={styles.infoTitle}>Ciudad:</Text>
            <Text style={styles.infoText}>{hospitalData.ciudad || "N/A"}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoTitle}>Departamento:</Text>
            <Text style={styles.infoText}>
              {hospitalData.departamento || "N/A"}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoTitle}>Dirección:</Text>
            <Text style={styles.infoText}>
              {hospitalData.direccion || "N/A"}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoTitle}>Tipo :</Text>
            <Text style={styles.infoText}>{hospitalData.tipo || "N/A"}</Text>
          </View>
        </Animatable.View>

        <Animatable.View animation="slideInUp" style={styles.licenseInfo}>
          <Text style={styles.licenseText}>Fecha de Creación</Text>
          <Text>{hospitalData.fechaCreacion || "N/A"}</Text>

          <Text style={styles.licenseText}>Fecha de Expiración</Text>
          <Text>{hospitalData.fechaExpiracion || "N/A"}</Text>

          <Text style={styles.licenseText}>Estado de Licencia</Text>
          <Text>{hospitalData.estadoLicencia ? "Activa" : "Inactiva"}</Text>

          <Text style={styles.licenseText}>Responsable de Mantenimiento</Text>
          <Text>{hospitalData.responsableMantenimiento || "N/A"}</Text>
        </Animatable.View>
        <Animatable.Text animation="fadeIn" style={styles.sectionTitle}>
          Información Contacto
        </Animatable.Text>
        <View style={styles.divider} />
        <Animatable.View animation="slideInUp" style={styles.infoBox}>
          <View style={styles.infoRow}>
            <Text style={styles.infoTitle}>Teléfono:</Text>
            <Text style={styles.infoText}>
              {hospitalData.telefono || "N/A"}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoTitle}>Correo de Contacto:</Text>
            <Text style={styles.infoText}>
              {hospitalData.correoContacto || "N/A"}
            </Text>
          </View>
        </Animatable.View>
        {userType === "admin" ? (
          <View style={styles.tileContainer}>
            <Pressable
              onPress={() => router.push("Equipo/CrearEquipo")}
              style={[styles.tile, styles.tileSmall]}
            >
              <Text style={styles.tileText}>Crear equipo</Text>
              <Icon name="plus-circle" size={30} color="#fff" />
            </Pressable>

            <Pressable
              onPress={() => router.push("Area/CrearArea")}
              style={[styles.tile, styles.tileSmall]}
            >
              <Text style={styles.tileText}>Crear área</Text>
              <Icon name="building" size={30} color="#fff" />
            </Pressable>
            <Pressable
              onPress={() => router.push("Equipo/EscribirTag")}
              style={[styles.tile, styles.tileSmall]}
            >
              <Text style={styles.tileText}>
                Escribir TAG de equipo
              </Text>
              <Icon name="power-off" size={30} color="#fff" />
            </Pressable>

             <Pressable
              onPress={() => router.push("Equipo/EliminarEquipo")}
              style={[styles.tile, styles.tileSmall]}
            >
              <Text style={styles.tileText}>Eliminar equipo</Text>
              <Icon name="power-off" size={30} color="#fff" />
            </Pressable>

            <Pressable
              onPress={() => logout()}
              style={[styles.tile, styles.tileLarge]}
            >
              <Text style={styles.tileText}>Cerrar sesión</Text>
              <Icon name="power-off" size={30} color="#fff" />
            </Pressable>
          </View>
        ) : (
          <View style={styles.tileContainer}>
            <Pressable
              onPress={() => logout()}
              style={[styles.tile, styles.tileLarge]}
            >
              <Text style={styles.tileText}>Cerrar sesión</Text>
              <Icon name="sign-out-alt" size={30} color="#fff" />
            </Pressable>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingBottom: "30%",
    padding: 20,
    backgroundColor: "#F2F2F2",
  },
  createequipo: {
    backgroundColor: "#5c5c5c",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  createarea: {
    backgroundColor: "#3681f1",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  logoutButton: {
    backgroundColor: "#ee3d3d",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  logoutButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  header: {
    fontSize: 30,
    fontWeight: "500",
    color: "#021342",
    textAlign: "center",

    textTransform: "capitalize",
  },
  logo: {
    width: width * 1,
    aspectRatio: 1.4,
    borderColor: "#001844",
    alignSelf: "center",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
    resizeMode: "contain",
  },
  sectionTitle: {
    fontSize: 23,
    fontWeight: "300",
    marginTop: 20,
    color: "#333",
  },
  divider: {
    height: 3,
    backgroundColor: "#D6D7F2",
    marginVertical: 20,
  },
  infoBox: {
    backgroundColor: "#050259",
    padding: 25,
    borderRadius: 10,
    elevation: 6,
    marginBottom: "3%",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  infoTitle: {
    fontSize: 17,
    marginRight: 4,
    color: "#ffffff",
    fontWeight: "300",
  },
  infoText: {
    fontSize: 17,
    color: "#ffffff",
    fontWeight: "100",
  },
  infoText1: {
    fontSize: 17,
    color: "#000000",
    fontWeight: "100",
    textAlign: "center",
  },
  licenseInfo: {
    marginTop: 10,
    marginHorizontal: 20,
  },
  licenseText: {
    fontWeight: "bold",
    marginTop: 20,
    color: "#02096b",
  },

  tileContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    gap: 3, // Espaciado uniforme entre mosaicos
    paddingHorizontal: 0, // Espaciado lateral dentro del contenedor
  },
  tile: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#050259", // Color base del mosaico
    padding: 20,
    marginTop: 0,
  },
  tileLarge: {
    width: "100%",
    height: 90,
    backgroundColor: "#e66262",
    marginTop: 0,
  },
  tileSmall: {
    width: "49%",
    height: 100,
  },
  tileText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "300",
    marginBottom: 10,
  },
});

export default HospitalInfoScreen;
