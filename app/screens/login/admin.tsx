import React, { useCallback, useState, useRef, useEffect } from "react";
import {
  View,
  SafeAreaView,
  Text,
  StatusBar,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";
import url from "@/constants/url.json";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SigmeModal from "../../componets/SigmeModal"; // Ensure the path is correct
import { checkServerAvailability } from "@/app/utils/CheckServer";
import { EXPO_PUBLIC_URL_EXTERN_SERVER } from "@env";

const AdminLoginScreen: React.FC = () => {
  const [code, setCode] = useState(["", "", "", ""]);
  const [serverUrl, setServerUrl] = useState(EXPO_PUBLIC_URL_EXTERN_SERVER); // Inicialmente usa la URL por defecto

  const handleKeyPress = (event, index) => {
    if (event.nativeEvent.key === "Backspace") {
      const newCode = [...code];
      if (code[index]) {
        // Si el cuadro tiene contenido, borra el carácter
        newCode[index] = "";
        setCode(newCode);
      } else if (index > 0) {
        inputs[index - 1].focus();
        newCode[index - 1] = ""; // Borra el contenido del cuadro anterior
        setCode(newCode);
      }
    }
  };

  const handleInputChange = (text, index) => {
    if (text.length <= 1) {
      const newCode = [...code];
      newCode[index] = text;
      setCode(newCode);
      if (text && index < 3) {
        inputs[index + 1].focus();
      }
    }
  };
  const inputs = [];

  const [modal, setModal] = useState({
    isVisible: false,
    title: "",
    message: "",
    type: "success", // Default type, you can change this based on login outcome
  });
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const hospitalCode = `${code[0]}${code[1]}${code[2]}${code[3]}`;
    try {
      await AsyncStorage.setItem("codigoHospital", hospitalCode);
      const response = await axios.post(`${serverUrl}/login`, {
        usuario: username,
        contrasena: password,
        codigoHospital: hospitalCode,
      });

      if (response.status === 200) {
        await AsyncStorage.setItem("codigoHospital", hospitalCode);
        await AsyncStorage.setItem("access_token", response.data.access_token);

        router.push("/(tabs)/Areas");
      } else {
        setModal({
          isVisible: true,
          title: "Acceso denegado",
          message: "No tienes permisos de administrador.",
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
  const checkServer = async () => {
    console.log(serverUrl);
    const hospitalCode = `${code[0]}${code[1]}${code[2]}${code[3]}`;
    const url = await checkServerAvailability(hospitalCode);
    setServerUrl(url);
    console.log(url);
    handleLogin();
  };

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle("light-content");
      StatusBar.setBackgroundColor("#7e9ef7");
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#7e9ef7" />
      <View style={styles.topContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Image
            source={require("../../../assets/images/back.png")}
            style={styles.backButton}
            tintColor={"#ffff"}
          />
        </TouchableOpacity>

        <View
          style={{
            height: "100%",
            flexDirection: "row",
            paddingHorizontal: "5%",
          }}
        >
          <Image
            source={require("../../../assets/images/admin.png")}
            style={styles.image}
          />
          <Text style={styles.title}>Encargado{"\n"}Mantenimiento</Text>
        </View>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.label}>
          Ingresa tus{"\n"}
          <Text style={[styles.label, { fontWeight: "bold" }]}>
            credenciales
          </Text>
        </Text>

        {/* Código del hospital */}
        <View style={styles.codeInputContainer}>
          {code.map((char, index) => (
            <TextInput
              key={index}
              style={styles.codeInput}
              value={char}
              onChangeText={(text) => handleInputChange(text, index)}
              onKeyPress={(event) => handleKeyPress(event, index)}
              keyboardType="default"
              maxLength={1}
              ref={(ref) => (inputs[index] = ref)}
            />
          ))}
        </View>
        <Text style={styles.hospitalCodeLabel}>Código del hospital</Text>

        <TextInput
          style={styles.input}
          placeholder="Documento"
          value={username}
          onChangeText={setUsername}
          placeholderTextColor="#888"
        />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#888"
        />

        {/* Login button */}
        <TouchableOpacity style={styles.loginButton} onPress={checkServer}>
          <Text style={styles.loginButtonText}>Iniciar</Text>
        </TouchableOpacity>
      </View>

      {/* SigmeModal for displaying messages */}
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
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 10,
    width: 38,
    height: 20,
  },
  image: {
    width: "43%",
    height: "80%",
    marginBottom: 0,
    marginTop: "auto",
  },
  title: {
    fontSize: 27,
    fontWeight: "bold",
    marginBottom: "14%",
    marginLeft: "6%",
    color: "#ffffff",
    marginTop: "auto",
  },
  label: {
    fontSize: 22,
    color: "#050259",
    marginBottom: "4%",
    marginTop: "15%",
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
    backgroundColor: "#7e9ef7",
    height: "35%",
    borderBottomLeftRadius: 23,
    borderBottomRightRadius: 23,
  },
  formContainer: {
    paddingHorizontal: "10%",
  },
});

export default AdminLoginScreen;
