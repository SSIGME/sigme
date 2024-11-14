import React, { useState, useRef } from 'react';
import { View, Image,Text, ScrollView, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useFonts } from "expo-font";

import { useRouter } from "expo-router";
export default function ReporteEquipoViewScreen() {
  const router = useRouter();
  const scaleValue = useRef(new Animated.Value(1)).current;
  const [fontsLoaded] = useFonts({
    "Kanit-Regular": require("@/assets/fonts/Kanit/Kanit-Regular.ttf"),
    "Kanit-Medium": require("@/assets/fonts/Kanit/Kanit-Medium.ttf"),
    "Kanit-Light": require("@/assets/fonts/Kanit/Kanit-Light.ttf"),
  });
  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start(() => router.push("components/Pdf"));
  };

  // Datos iniciales con todos los campos
  const datosReporte = {
    _id: "6733e26393f4f50bcd972508",
    descripcionProblema: "Este es problema del equipo",
    esPrimeraVez: true,
    impactoFuncionamiento: "",
    equipoFueraServicio: "Fuera de servicio",
    funcionesAfectadas: "Todas",
    afectaSeguridad: true,
    ubicacionEquipo: "",
    cambioRecienteUbicacion: false,
    exposicionCondiciones: "Ninguna",
    frecuenciaUso: "2 o 3 veces",
    usoIntensivo: true,
    mensajeError: "Dos numeross",
    senalAlarma: "Luces muchass",
    sonidoInusual: "Ninguna cosa rara",
    marca: "Welch",
    modelo: "ModeloX",
    serie: "1343366XZ",
    area: "Consulta General",
    tipo: "Tensiometro",
    fecha: "2024-11-12",
  };

  const manejarEnvio = () => {
    console.log('Datos del reporte:', datosReporte);
  };

  return (
    <View style={styles.contenedor}>
          <View style={styles.header}>
      <TouchableOpacity onPress={() => router.push('/(tabs)/Codigos')} style={styles.backButton}>
          <Image source={require("../../assets/images/back.png")} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerText}>
 
        </Text>
        <Text style={styles.subHeaderText}>REPORTE DE <Text style={{    fontFamily: "Kanit-Medium",}}>EQUIPO</Text> </Text>
        <View style={styles.cajaparametros}>
          <Text style={styles.parametro}>
            Modelo <Text style={styles.parametroinfo}> {datosReporte.modelo}</Text>
          </Text>
          <Text style={styles.parametro}>
            Marca <Text style={styles.parametroinfo}> {datosReporte.marca}</Text>
          </Text>
          <Text style={styles.parametro}>
            Serie <Text style={styles.parametroinfo}> {datosReporte.serie}</Text>
          </Text>
          <Text style={styles.parametro}>
            Ubicacion <Text style={styles.parametroinfo}> {datosReporte.area}</Text>
          </Text>
        </View>
        
      </View>
      
      <ScrollView style={styles.scrollView}>

      <Animated.View style={[styles.botonContainer, { transform: [{ scale: scaleValue }] }]}>
            <TouchableOpacity
             onPress={()=>{router.push("Equipo/Pdf")}}
              style={styles.boton}
            >
              <Text style={styles.botonTexto}>Ver Documento</Text>
            </TouchableOpacity>
          </Animated.View>
        <View style={styles.caja}>


          <Text style={styles.encabezado}>Descripción del Problema</Text>
          <Text style={styles.texto}>{datosReporte.descripcionProblema}</Text>
        </View>

        <View style={styles.caja}>
          <Text style={styles.encabezado}>Detalles del Impacto</Text>
          <Text style={styles.texto}>Impacto en Funcionamiento:{"\n"} <Text style={styles.textoValor}>{datosReporte.impactoFuncionamiento}</Text></Text>
          <Text style={styles.texto}>Equipo Fuera de Servicio: {"\n"}<Text style={styles.textoValor}>{datosReporte.equipoFueraServicio}</Text></Text>
          <Text style={styles.texto}>Funciones Afectadas:{"\n"} <Text style={styles.textoValor}>{datosReporte.funcionesAfectadas}</Text></Text>
        </View>

        <View style={styles.caja}>
          <Text style={styles.encabezado}>Ubicación y Condiciones</Text>
       
          <Text style={styles.texto}>Cambio Reciente de Ubicación: {"\n"}<Text style={styles.textoValor}>{datosReporte.cambioRecienteUbicacion ? 'Sí' : 'No'}</Text></Text>
          <Text style={styles.texto}>Exposición a Condiciones Especiales:{"\n"} <Text style={styles.textoValor}>{datosReporte.exposicionCondiciones}</Text></Text>
        </View>

        <View style={styles.caja}>
          <Text style={styles.encabezado}>Uso y Frecuencia</Text>
          <Text style={styles.texto}>Frecuencia de Uso: {"\n"}<Text style={styles.textoValor}>{datosReporte.frecuenciaUso}</Text></Text>
          <Text style={styles.texto}>Uso Intensivo: {"\n"}<Text style={styles.textoValor}>{datosReporte.usoIntensivo ? 'Sí' : 'No'}</Text></Text>
        </View>

        <View style={styles.caja}>
          <Text style={styles.encabezado}>Alertas y Señales</Text>
          <Text style={styles.texto}>Mensaje de Error:{"\n"} <Text style={styles.textoValor}>{datosReporte.mensajeError}</Text></Text>
          <Text style={styles.texto}>Señal de Alarma:{"\n"} <Text style={styles.textoValor}>{datosReporte.senalAlarma}</Text></Text>
          <Text style={styles.texto}>Sonido Inusual:{"\n"} <Text style={styles.textoValor}>{datosReporte.sonidoInusual}</Text></Text>
        </View>


      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    padding: 0,
    backgroundColor: '#faf9f9',
  },
  scrollView: {

    width:'100%',
    marginVertical: 20,
    paddingTop:'0%',
  },
  caja: {
    marginBottom: 20,
    padding: 15,
  
    width:"94%",
    marginHorizontal:'auto',
    backgroundColor: '#fcfcff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },


  highlightText: {
    fontWeight: 'bold',
    color: '#3754a4',
  },


  texto: {
    fontSize: 17,
    color: '#010131',
    marginVertical: 5,
    lineHeight: 22,
    fontWeight: '400',
  },
  textoValor: {
    fontSize: 16
    ,
    fontWeight: '200',
    color: '#3a3a55',
  },

  boton: {
    backgroundColor: '#050259',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 15,
    marginBottom: 15, // Spacing between buttons
  },
  botonTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '400',
  },
  backButton: {
    position: 'absolute',
    left: 5,
    top: 30,
  },
  backIcon: {
    width: 35,
    height: 35,
    resizeMode: 'contain',
  },
  header: {
    marginTop: 20,
    marginBottom: 20,
    width:"100%",
    margin:30,


  },
  headerText: {
    fontSize: 34,
    fontFamily: "Kanit-Medium",
    color: '#050259',
    marginTop:30,
    marginRight:"auto",
    paddingLeft:7,
  },
  subHeaderText: {
    fontSize: 24,
    color: '#050259',
    fontFamily: "Kanit-Light",
    marginTop:20,
 
    marginBottom:'27%'
  },
  encabezado: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 20,
    marginTop:'7%',
    color:'#011631'
  },



  botonContainer: {
    marginTop: 20,

    alignItems:'center',
  },
  cajaparametros: {
    paddingLeft: "0%",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: "70%",
    flexDirection: "row",
    flexWrap: "wrap",
    height: "45%",
    borderBottomWidth: 1,
    borderBottomColor: '#0c45c2',
    width: "85%",
    marginHorizontal:'auto',
 
  },  parametro: {
    marginVertical: 3,
    fontFamily: "Kanit-Medium",
    width: "50%",
    fontSize:16,
  
  },
  parametroinfo: {
    color: "#3a3a3a",
    fontFamily: "Kanit-Light",
  },
});
