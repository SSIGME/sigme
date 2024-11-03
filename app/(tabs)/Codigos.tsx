import React, { useCallback } from "react";
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
export default function CodesScreen() {
  const router = useRouter();
  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle("light-content");
      StatusBar.setBackgroundColor("#050259");
    }, [])
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
        <StatusBar barStyle="light-content" backgroundColor="#050259" />
      <Text style={styles.title}>
        Consultar{"\n"}
        <Text style={styles.highlight}>Códigos </Text>
      </Text>
      <View style={styles.container}>
        <View style={styles.optionContainer}>
          <TouchableOpacity
            style={[styles.option, { backgroundColor: "#A4B1E3" }]}
            onPress={() =>
              router.push(`/screens/codigos/listaCodigos?type=tecnico`)
            }
          >
            <Image
              source={require("../../assets/images/tecnico.png")}
              style={[styles.image,{   top: "-45%", // Ajusta este valor para sobresalir de la caja
                width: "120%",
                resizeMode: "contain",
                height: "150%",}]}
            />
          </TouchableOpacity>
          <Text style={styles.optionText}>Técnico</Text>
        </View>

        <View style={styles.optionContainer}>
          <TouchableOpacity
            style={[styles.option, { backgroundColor: "#3C497A" }]}
            onPress={() =>
              router.push(`/screens/codigos/listaCodigos?type=profesional`)
            }
          >
            <Image
              source={require("../../assets/images/medico.png")}
              style={styles.image}
            />
          </TouchableOpacity>
          <Text style={styles.optionText}>Médico</Text>
        </View>

        <View style={styles.optionContainer}>
          <TouchableOpacity
            style={[styles.option, { backgroundColor: "#1C2D63" }]}
            onPress={() =>
              router.push(`/screens/codigos/listaCodigos?type=encargado`)
            }
          >
            <Image
              source={require("../../assets/images/secretaria.png")}
              style={[styles.image,{   top: -33, // Ajusta este valor para sobresalir de la caja
                width: "130%",
                resizeMode: "contain",
                left:-10,
                height: "130%",}]}
            />
          </TouchableOpacity>
          <Text style={styles.optionText}>Secretaria</Text>
        </View>
        <View style={styles.optionContainer}>
          <TouchableOpacity
            style={[styles.option, { backgroundColor: "#6E7DD0" }]}
            onPress={() =>
              router.push(`/screens/codigos/listaCodigos?type=jefeArea`)
            }
          >
            <Image
              source={require("../../assets/images/jefeArea.png")}
              style={[styles.image,{   top: -33, // Ajusta este valor para sobresalir de la caja
                width: "120%",
                resizeMode: "contain",
                left:-10,
                height: "120%",}]}
            />
          </TouchableOpacity>
          <Text style={styles.optionText}>Jefe de area</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 20,
    gap: 40,
    alignContent: "center",
    marginBottom:'10%',
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "200",
    color: "#ffffff",
    backgroundColor: "#050259",
    paddingTop: "17%",
    paddingBottom: "5%",
    borderBottomLeftRadius: 23,
    borderBottomRightRadius: 23,
    paddingLeft: 30,
  },
  highlight: {
    color: "#ffffff",
    fontWeight: "600",
  },
  optionContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: Dimensions.get("window").width * 0.4,
  },
  option: {

    width: Dimensions.get("window").width * 0.4,
    height: Dimensions.get("window").width * 0.4,
    borderRadius: 20,
  
  },
  image: {

    top: -50, // Ajusta este valor para sobresalir de la caja
    width: "100%",
    resizeMode: "contain",
    height: "130%",

  },
  optionText: {
    fontSize: 18,
    color: "#000000",
    fontWeight: "500",
    textAlign: "center",
    marginTop: 10,
  },
});
