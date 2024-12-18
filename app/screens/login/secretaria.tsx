import React, { useCallback, useState, useRef } from "react";
import {
  View,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
  Pressable,
  Keyboard,
} from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import url from "@/constants/url.json";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SigmeModal from "../../componets/SigmeModal";
const SecretariaLoginScreen = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState(["", "", "", ""]);
  const { height } = Dimensions.get('window'); 
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [modal, setModal] = useState({
    isVisible: false,
    title: "",
    message: "",
    type: "success", // Default type, you can change this based on login outcome
  });

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

  const handleLogin = async () => {
    const hospitalCode = `${code[0]}${code[1]}${code[2]}${code[3]}`;

    try {
      const response = await axios.post(`${url.url}/login/code`, {
        codigo: username,
        contrasena: password,
        codigoHospital: hospitalCode,
        tipo: "encargado",
      });

      if (response.status === 200) {
        await AsyncStorage.setItem("codigoHospital", hospitalCode);
        await AsyncStorage.setItem("access_token", response.data.access_token);
        await AsyncStorage.setItem("codigo", username);

        console.log(response.data.firmaEstado);
        if (response.data.firmaEstado) {
          router.push("/(tabs)/Areas");
        } else {
          router.push("/(tabs)/Areas");
        }
      } else {
        setModal({
          isVisible: true,
          title: "Acceso denegado",
          message: "No tienes permisos de jefe de area.",
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
  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle("light-content");
      StatusBar.setBackgroundColor("#1C2D63");
      const keyboardDidShowListener = Keyboard.addListener(
        "keyboardDidShow",
        () => {
          setKeyboardVisible(true);  // Establece el estado a true cuando el teclado aparece
        }
      );
      const keyboardDidHideListener = Keyboard.addListener(
        "keyboardDidHide",
        () => {
          setKeyboardVisible(false);  // Establece el estado a false cuando el teclado desaparece
        }
      );
  
      // Limpieza de los listeners cuando el componente se desmonta
      return () => {
        keyboardDidHideListener.remove();
        keyboardDidShowListener.remove();
      };}, [])
  );
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1C2D63" />
      <View style={[styles.topContainer,  keyboardVisible ? {height:'16%'}: {},]}>
      <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Image
            source={require("../../../assets/images/back.png")}
            style={{ height: "100%", width: undefined, aspectRatio: 2 }} 
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
            source={require("../../../assets/images/secretaria.png")}
            style={[styles.image,  keyboardVisible ? {display:'none'}: {},]}
          />
          <Text style={[styles.title, keyboardVisible ? {display:'none'}: {},]}>Secretaría {"\n"}de Salud</Text>
        </View>
      </View>

      <View style={styles.formContainer}>
        {/* Input fields */}
        <Text style={styles.label}>
          Ingresa tu código {"\n"}
          <Text style={[styles.label, { fontWeight: "bold" }]}>asignado</Text>
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
    top: 40,
    left: 10,
    width: 38,
    height: 20,
    paddingLeft:0,
  },
  image: {
    width: "67%",
    height: "70%",
    marginBottom: 0,
    marginTop: "auto",
  },
  title: {
    fontSize: 27,
    fontWeight: "bold",
    marginBottom: "12%",

    color: "#ffffff",
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
    backgroundColor: "#1C2D63",
    height: "35%",
    borderBottomLeftRadius: 23,
    borderBottomRightRadius: 23,
  },
  formContainer: {
    paddingHorizontal: "10%",
  },
});

export default SecretariaLoginScreen;
