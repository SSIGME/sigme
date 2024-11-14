import React, { useState, useRef } from "react";
import {
  View,
  SafeAreaView,
  Text,
  TextInput,
  StatusBar,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import url from "@/constants/url.json";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SigmeModal from "../../componets/SigmeModal";
const TecnicoLoginScreen = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [modal, setModal] = useState({
    isVisible: false,
    title: "",
    message: "",
    type: "success", // Default type, you can change this based on login outcome
  });
  // State for the three inputs of the "Código"
  const [code1, setCode1] = useState("");
  const [code2, setCode2] = useState("");
  const [code3, setCode3] = useState("");
  const [code4, setCode4] = useState("");
  const code1Ref = useRef(null);
  const code2Ref = useRef(null);
  const code3Ref = useRef(null);
  const code4Ref = useRef(null);
  // Function to handle input change and focus movement
  const handleCode1Change = (text) => {
    setCode1(text.toUpperCase());
    if (text.length === 1) {
      code2Ref.current.focus(); // Move to the second input
    }
  };

  const handleCode2Change = (text) => {
    setCode2(text.toUpperCase());
    if (text.length === 1) {
      code3Ref.current.focus(); // Move to the third input
    } else if (text.length === 0) {
      code1Ref.current.focus(); // Move back to the first input if deleting
    }
  };

  const handleCode3Change = (text) => {
    setCode3(text.toUpperCase());
    if (text.length === 1) {
      code4Ref.current.focus(); // Move back to the second input if deleting
    } else if (text.length === 0) {
      code2Ref.current.focus(); // Move back to the first input if deleting
    }
  };

  const handleCode4Change = (text) => {
    setCode4(text.toUpperCase());
    if (text.length === 0) {
      code3Ref.current.focus(); // Move back to the second input if deleting
    }
  };

  const handleLogin = async () => {
    const hospitalCode = `${code1}${code2}${code3}${code4}`;

    try {
      const response = await axios.post(`${url.url}/login/code`, {
        codigo: username,
        contrasena: password,
        codigoHospital: hospitalCode,
        tipo: "tecnico",
      });

      if (response.status === 200) {
        await AsyncStorage.setItem("codigoHospital", hospitalCode);
        await AsyncStorage.setItem("access_token", response.data.access_token);
        await AsyncStorage.setItem("codigo", username);

        console.log(response.data.firmaEstado);
        if (response.data.firmaEstado) {
          router.push("/(tabs)/Areas");
        } else {
          router.push("/screens/terminos/terminos");
        }
      }
      if (response.status === 401) {
        console.log("mostrando modal");
        setModal({
          isVisible: true,
          title: "Acceso denegado",
          message: "No tienes permisos de técnico.",
          type: "error",
        });
      }
    } catch (error) {
      console.error(error);
      setModal({
        isVisible: true,
        title: "Inicio sesión",
        message: "Ocurrió un error al intentar iniciar sesión.",
        type: "error",
      });
    }
  };

  const closeModal = () => {
    setModal({ ...modal, isVisible: false });
  };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#A4B1E3" />
      <View style={styles.topContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Image
            source={require("../../../assets/images/back.png")}
            style={styles.backButton}
          ></Image>
        </TouchableOpacity>

        <View
          style={{
            height: "100%",
            flexDirection: "row",
            paddingHorizontal: "5%",
          }}
        >
          <Image
            source={require("../../../assets/images/tecnico.png")}
            style={styles.image}
          />
          <Text style={styles.title}>Técnico</Text>
        </View>
      </View>

      <View style={styles.formContainer}>
        {/* Input fields */}
        <Text style={styles.label}>
          Ingresa tu código{"\n"}asignado para{"\n"}
          <Text style={[styles.label, { fontWeight: "bold" }]}>
            mantenimiento
          </Text>
        </Text>

        {/* Código del hospital */}
        <View style={styles.codeInputContainer}>
          <TextInput
            style={styles.codeInput}
            ref={code1Ref} // Reference to the first input
            maxLength={1}
            value={code1}
            onChangeText={handleCode1Change}
            keyboardType="default"
            placeholder="-"
            placeholderTextColor="#888"
          />
          <TextInput
            style={styles.codeInput}
            ref={code2Ref} // Reference to the second input
            maxLength={1}
            value={code2}
            onChangeText={handleCode2Change}
            keyboardType="default"
            placeholder="-"
            placeholderTextColor="#888"
          />
          <TextInput
            style={styles.codeInput}
            ref={code3Ref}
            value={code3}
            onChangeText={handleCode3Change}
            keyboardType="default"
            placeholder="-"
            placeholderTextColor="#888"
          />
          <TextInput
            style={styles.codeInput}
            ref={code4Ref} // Reference to the third input
            maxLength={1}
            value={code4}
            onChangeText={handleCode4Change}
            keyboardType="default"
            placeholder="-"
            placeholderTextColor="#888"
          />
        </View>
        <Text style={styles.hospitalCodeLabel}>Código del hospital</Text>

        <TextInput
          style={styles.input}
          placeholder="Código de mantenimiento"
          value={username}
          onChangeText={setUsername}
          placeholderTextColor="#888"
        />

        {/* Login button */}
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Iniciar</Text>
        </TouchableOpacity>
      </View>
      <SigmeModal
        isVisible={modal.isVisible}
        message={modal.message}
        title={modal.title}
        type={modal.type}
        onClose={closeModal}
        onConfirm={closeModal}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFC",
    height: "100%",
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 10,
    width: 38,
    height: 20,
  },
  image: {
    width: "57%",
    height: "78%",
    marginBottom: 0,
    marginTop: "auto",
  },
  title: {
    fontSize: 27,
    fontWeight: "bold",
    marginBottom: "12%",
    marginLeft: "6%",
    color: "#000000",
    marginTop: "auto",
  },
  label: {
    fontSize: 22,
    color: "#050259",
    marginBottom: "4%",
    marginTop: "20%",
    fontWeight: "300",
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#D6D7F2",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 18,
  },
  codeInputContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: 10,
    width: "65%",
    marginLeft: "auto",
    marginRight: "auto",
  },
  codeInput: {
    width: 50,
    height: 50,

    borderRadius: 5,
    textAlign: "center",
    borderBottomColor: "black",
    borderBottomWidth: 1.4,
    fontSize: 24,
  },
  hospitalCodeLabel: {
    textAlign: "center",
    fontSize: 18,
    color: "#888",
    marginBottom: "10%",
    fontWeight: "200",
  },
  loginButton: {
    backgroundColor: "#001366",
    width: "60%",
    marginRight: "auto",
    marginLeft: "auto",
    padding: 15,
    marginTop: "5%",
    borderRadius: 10,
    alignItems: "center",
  },
  loginButtonText: {
    fontSize: 20,
    color: "#FFF",
    fontWeight: "300",
  },
  topContainer: {
    backgroundColor: "#A4B1E3",
    height: "35%",
    borderBottomLeftRadius: 23,
    borderBottomRightRadius: 23,
  },
  formContainer: {
    paddingHorizontal: "10%",
  },
});

export default TecnicoLoginScreen;
