import { StyleSheet, Text, View, Image, Pressable, ActivityIndicator } from "react-native";
import React from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useFonts } from "expo-font";

const EquipoDetail = () => {
  const [fontsLoaded] = useFonts({
    "Kanit-Regular": require("../../assets/fonts/Kanit/Kanit-Regular.ttf"),
  });

  if (!fontsLoaded) {
    return (
        <ActivityIndicator size="large" color="#0000ff" />
    ); 
  }
  const router = useRouter();
  const {
    codigoIdentificacion,
    Imagen,
    Tipo,
    Marca,
    Modelo,
    Serie,
    UltimoMantenimiento,
    ProximaVisita,
    area,
  } = useLocalSearchParams();
  return (
    <View style={styles.container}>
      <View style={styles.divinfo}>
        <View style={styles.fototipo}>
          {Imagen === "" ? (
            <Image
              source={require("../../assets/images/tenso.jpg")}
              style={{
                marginLeft: "10%",
                width: 100,
                height: 100,
                borderRadius: 20,
              }}
            />
          ) : (
            <Image
              style={{
                width: 100,
                height: 100,
                borderRadius: 20,
                marginLeft: "5%",
              }}
              source={{ uri: Array.isArray(Imagen) ? Imagen[0] : Imagen }}
            />
          )}

          <Text
            style={{
            fontFamily: "Kanit-Regular",
            fontSize: 22,
              textAlign: "center",
              flexWrap: "wrap",
              width: "60%",
              fontWeight: "bold",
            }}
          >
            {Tipo}
          </Text>
        </View>
        <View style={styles.detalles}>
          <View style={styles.cajaparametros}>
            <View style={styles.cajitainfo}>
              <Text style={styles.parametro}>Codigo Identificacion </Text>
              <Text>{codigoIdentificacion}</Text>
            </View>
            <View style={styles.cajitainfo}>
              <Text style={styles.parametro}>Area</Text>
              <Text>{area}</Text>
            </View>
            <View style={styles.cajitainfo}>
              <Text style={styles.parametro}>Marca </Text>
              <Text>{Marca}</Text>
            </View>
            <View style={styles.cajitainfo}>
              <Text style={styles.parametro}>Modelo </Text>
              <Text>{Modelo}</Text>
            </View>
            <View style={styles.cajitainfo}>
              <Text style={styles.parametro}>Serie </Text>
              <Text>{Serie}</Text>
            </View>
            <View style={styles.cajitainfo}>
              <Text style={styles.parametro}>Ultimo Mantenimiento </Text>
              <Text>{UltimoMantenimiento}</Text>
            </View>
            <View style={styles.cajitainfo}>
              <Text style={styles.parametro}>Proxima Visita </Text>
              <Text>{ProximaVisita}</Text>
            </View>
          </View>
          <View style={styles.botonesrapidos}>
            <View style={styles.cajitabotonrapido}>
              <Pressable style={styles.botonrapido}>
                <Image
                  source={require("../../assets/images/guiarapida.png")}
                  style={{ width: 30, height: 30 }}
                />
              </Pressable>
              <Text>Guia Rapida</Text>
            </View>

            <View style={styles.cajitabotonrapido}>
              <Pressable style={styles.botonrapido}>
                <Image
                  source={require("../../assets/images/manual.png")}
                  style={{ width: 30, height: 30 }}
                />
              </Pressable>
              <Text>Manual</Text>
            </View>

            <View style={styles.cajitabotonrapido}>
              <Pressable style={styles.botonrapido}>
                <Image
                  source={require("../../assets/images/uso.png")}
                  style={{ width: 30, height: 30 }}
                />
              </Pressable>
              <Text>Uso</Text>
            </View>
            <View style={styles.cajitabotonrapido}>
              <Pressable style={styles.botonrapido}>
                <Image
                  source={require("../../assets/images/guiarapida.png")}
                  style={{ width: 30, height: 30 }}
                />
              </Pressable>
              <Text>Guia Rapida</Text>
            </View>

            <View style={styles.cajitabotonrapido}>
              <Pressable style={styles.botonrapido}>
                <Image
                  source={require("../../assets/images/manual.png")}
                  style={{ width: 30, height: 30 }}
                />
              </Pressable>
              <Text>Manual</Text>
            </View>

            <View style={styles.cajitabotonrapido}>
              <Pressable style={styles.botonrapido}>
                <Image
                  source={require("../../assets/images/uso.png")}
                  style={{ width: 30, height: 30 }}
                />
              </Pressable>
              <Text>Uso</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default EquipoDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "rgba(208, 215, 237, 1)",
  },
  divinfo: {
    marginTop: "10%",
    width: "85%",
    height: "80%",
    borderRadius: 20,
    backgroundColor: "rgba(158, 171, 255, 1)",
  },
  cajaparametros: {
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: "0%",
    height: "60%",
    width: "100%",
  },
  detalles: {
    position: "absolute",
    bottom: "0%",
    width: "100%",
    height: "80%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  cajitainfo: {
    marginLeft: "12%",
    marginBottom: "2%",
    width: "100%",
    height: "10%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  parametro: {
    width: "50%",
    fontWeight: "bold",
  },
  fototipo: {
    position: "absolute",
    top: "-2%",
    borderRadius: 20,
    flexDirection: "row",
    width: "100%",
    height: "25%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  botonesrapidos: {
    paddingLeft: "5%",
    paddingRight: "5%",
    flexDirection: "row",
    flexWrap: "wrap", // Permite que los botones se ajusten a la siguiente línea
    justifyContent: "space-between", // Ajusta el espacio entre los botones
    position: "absolute",
    top: "60%",
    width: "100%",
    height: "15%",
    display: "flex",
    alignItems: "center",
  },
  botonrapido: {
    backgroundColor: "rgba(5, 2, 89, 1)",
    width: 55,
    height: 55,
    borderRadius: 100,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  cajitabotonrapido: {
    marginBottom: "7%",
    width: "30%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});
