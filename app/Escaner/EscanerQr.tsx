import { Camera, CameraView } from "expo-camera";
import { Stack } from "expo-router";
import axios from "axios";
import { useRouter } from "expo-router";
import React from "react";
import {
  AppState,
  Linking,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  Image,
  View,
  Dimensions,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import Modal from "react-native-modal";
import { useLayoutEffect, useRef, useState } from "react";
import { ThemedButton } from "react-native-really-awesome-button";
import url from "@/constants/url.json";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { Canvas, DiffRect, rect, rrect } from "@shopify/react-native-skia";
import AsyncStorage from "@react-native-async-storage/async-storage";
const { width, height } = Dimensions.get("window");
const innerDimension = 300;

const outer = rrect(rect(0, 40, width, height), 10, 10);
const inner = rrect(
  rect(
    width / 2 - innerDimension / 2,
    height / 2 - innerDimension / 2,
    innerDimension,
    innerDimension
  ),
  50,
  50
);

export default function Home() {
  const router = useRouter();
  const qrLock = useRef(false);
  const appState = useRef(AppState.currentState);
  const [equipo, setEquipo] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("");

  const getEquipo = async (codigoIdentificacion) => {
    const codigoHospital = await AsyncStorage.getItem("codigoHospital");
    try {
      const response = await axios.get(
        `${url.url}/getequipo/${codigoHospital}/${codigoIdentificacion}`
      );
      if (response.status === 200) {
        setModalMessage("Se encontro un equipo que conside con el QR");
        setModalType("success");
        setEquipo(response.data);
      }
      setModalVisible(true);
    } catch (error) {
      console.error(error);
      setModalMessage("Hubo un error al intentar escanear el QR.");
      setModalType("error");
      setModalVisible(true);
    }
  };

  const navegarEquipo = () => {
    console.log(equipo);
    router.push({
      pathname: `/Equipo/EquipoDetail`,
      params: {
        title: equipo.Tipo,
        ...equipo, // Usamos el spread operator para pasar todos los datos de `equipo`
      },
    });
  };
  const closeModal = () => {
    setModalVisible(false);
    qrLock.current = false;
  };

  const handleModal = (modalType: string) => {
    if (modalType === "success") {
      setModalVisible(false);

      navegarEquipo();
      qrLock.current = true;
    } else {
      setModalVisible(false);

      qrLock.current = false;
    }
  };

  useLayoutEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        qrLock.current = false;
      }
      appState.current = nextAppState;
    });
    return () => subscription.remove();
  }, []);

  return (
    <SafeAreaView style={[StyleSheet.absoluteFillObject,{height:"100%"}]}>
      <Stack.Screen options={{ title: "Overview", headerShown: false }} />
      {Platform.OS === "android" ? <StatusBar hidden /> : null}
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onBarcodeScanned={({ data }) => {
          if (data && !qrLock.current) {
            qrLock.current = true;
            setTimeout(async () => {
              await getEquipo(data);
            }, 500);
          }
        }}
      />
      <Canvas
        style={
          Platform.OS === "android"
            ? { flex: 1 }
            : StyleSheet.absoluteFillObject
        }
      >
        <DiffRect inner={inner} outer={outer} color="#040e3b" opacity={0.5} />
      </Canvas>
      <View style={{ width: "100%", position: "absolute", bottom: 0 }}>
        <Image
          source={require("../../assets/images/logo.png")}
          style={styles.image}
        />
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.overlayText}>
          Escanee el <Text style={{ fontWeight: "400" }}>código QR</Text> {"\n"}
          dentro del recuadro
        </Text>
      </View>
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={closeModal}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        backdropTransitionOutTiming={0}
      >
        <View
          style={[
            styles.modalContainer,
            modalType === "success" && styles.successModal,
            modalType === "error" && styles.errorModal,
          ]}
        >
          {modalType === "success" && (
            <AntDesign name="checkcircle" size={50} color="#44d644" />
          )}
          {modalType === "error" && (
            <AntDesign name="closecircle" size={50} color="red" />
          )}
          <Text style={styles.modalText}>{modalMessage}</Text>
          <ThemedButton
            name="rick"
            type="danger"
            onPress={() => {
              handleModal(modalType);
            }}
            backgroundColor={
              modalType === "success"
                ? "#4df34d"
                : modalType === "warning"
                ? "#ffe605"
                : "red"
            }
            backgroundActive={
              modalType === "success"
                ? "#54af4c"
                : modalType === "warning"
                ? "#fad400"
                : "#D32F2F"
            }
            borderColor={
              modalType === "success"
                ? "#388E3C"
                : modalType === "warning"
                ? "#856404"
                : "#B71C1C"
            }
            backgroundDarker={
              modalType === "success"
                ? "#33993a"
                : modalType === "warning"
                ? "#bd9100"
                : "#9A0007"
            }
            width={200}
            height={70}
            raiseLevel={10}
            borderRadius={20}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={[
                  styles.placeholderText,
                  (modalType === "success" || modalType === "warning") &&
                    styles.placeholderTextBlack,
                ]}
              >
                {modalType === "success" ? "Ir al equipo" : "Volver"}
              </Text>
            </View>
          </ThemedButton>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  textContainer: {
    position: "absolute",
    top: height / 2 - innerDimension / 2 - 90,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  overlayText: {
    color: "white",
    fontSize: 21,
    fontWeight: "100",
    textAlign: "center",
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  modalText: {
    fontSize: 21,
    marginTop: "10%",
    color: "#000000",
    fontWeight: "300",
    marginBottom: "10%",
    textAlign: "center",
    width: "90%",
  },
  successModal: {
    backgroundColor: "#d8fde1",
  },
  errorModal: {
    backgroundColor: "#fcb2b9",
  },
  placeholderText: {
    color: "white",
    fontSize: 20,
    fontWeight: "200",
    textAlign: "center",
  },
  placeholderTextBlack: {
    color: "#000000",
    fontSize: 20,
    fontWeight: "200",
    textAlign: "center",
  },
  image: {
    width: 200, // Ajusta según el tamaño deseado
    height: 200,
    resizeMode: "contain", // Ajusta según el tamaño deseado
    marginHorizontal: "auto",
  },
});
