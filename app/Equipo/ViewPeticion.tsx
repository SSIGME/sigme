import React, { useState, useRef } from 'react';
import { View, Image,Text, ScrollView, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useFonts } from "expo-font";
import { useLocalSearchParams } from "expo-router";
import { useRouter } from "expo-router";
export default function ReporteEquipoViewScreen() {
  const router = useRouter();
  const { reporte } = useLocalSearchParams();
  const parsedReporte = JSON.parse(reporte);
  const scaleValue = useRef(new Animated.Value(1)).current;
  const [fontsLoaded] = useFonts({
    "Kanit-Regular": require("@/assets/fonts/Kanit/Kanit-Regular.ttf"),
    "Kanit-Medium": require("@/assets/fonts/Kanit/Kanit-Medium.ttf"),
    "Kanit-Light": require("@/assets/fonts/Kanit/Kanit-Light.ttf"),
    "Kanit-Thin": require("@/assets/fonts/Kanit/Kanit-Thin.ttf"),
    "Kanit-Bold": require("../../assets/fonts/Kanit/Kanit-Regular.ttf"),
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
 

  const manejarEnvio = () => {
    console.log('Datos del parsedReporte:', parsedReporte);
  };

  return (
    <View style={styles.contenedor}>
          <View style={styles.header}>
      <TouchableOpacity onPress={() => {router.push('/(tabs)/Pendientes2');}} style={styles.backButton}>
          <Image source={require("../../assets/images/back.png")} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerText}>
 
        </Text>
        <Text style={styles.subHeaderText}>REPORTE DE <Text style={{    fontFamily: "Kanit-Medium",}}>EQUIPO</Text> </Text>
        <View style={styles.cajaparametros}>
          <Text style={styles.parametro}>
            Modelo <Text style={styles.parametroinfo}> {parsedReporte.modelo}</Text>
          </Text>
          <Text style={styles.parametro}>
            Marca <Text style={styles.parametroinfo}> {parsedReporte.marca}</Text>
          </Text>
          <Text style={styles.parametro}>
            Serie <Text style={styles.parametroinfo}> {parsedReporte.serie}</Text>
          </Text>
          <Text style={styles.parametro}>
            Ubicacion <Text style={styles.parametroinfo}> {parsedReporte.area}</Text>
          </Text>
        </View>
        
      </View>

      <Animated.View style={[styles.botonContainer, { transform: [{ scale: scaleValue }] }]}>
            <TouchableOpacity
             onPress={()=>{router.push({pathname:"Equipo/Pdf", params:{reporte:JSON.stringify(reporte), url:"http://192.168.20.119:5005/generate_pdf" }});manejarEnvio()}}
              style={styles.boton}
            >
              <Text style={styles.botonTexto}>Ver documento</Text>
            </TouchableOpacity>
          </Animated.View>
      <View style={{backgroundColor:"#182c6e", height:2, width:"100%"  ,marginLeft:"auto", }}></View>
      <ScrollView style={styles.scrollView}>

        <View style={styles.caja}>


          <Text style={styles.encabezado}>Descripción del Problema</Text>
          <Text style={[styles.textoValor,{fontSize:18, fontWeight:300}]}>{parsedReporte.descripcionProblema}</Text>
          <Text style={styles.texto}>Es la primera ve que ocurre: {"\n"}<Text style={styles.textoValor}>{parsedReporte.esPrimeraVez? 'Sí' : 'No'}</Text></Text>


        </View>

        <View style={styles.caja}>
          <Text style={styles.encabezado}>Detalles del Impacto</Text>
        
          <Text style={styles.texto}>Equipo Fuera de Servicio: {"\n"}<Text style={styles.textoValor}>{parsedReporte.equipoFueraServicio}</Text></Text>
          <Text style={styles.texto}>Funciones Afectadas:{"\n"} <Text style={styles.textoValor}>{parsedReporte.funcionesAfectadas}</Text></Text>
          <Text style={styles.texto}>Afecta la seguridad del paciente o del personal: {"\n"}<Text style={styles.textoValor}>{parsedReporte.afectaSeguridad? 'Sí' : 'No'}</Text></Text>

          
        </View>

        <View style={styles.caja}>
          <Text style={styles.encabezado}>Ubicación y Condiciones</Text>
       
          <Text style={styles.texto}>Cambio Reciente de Ubicación: {"\n"}<Text style={styles.textoValor}>{parsedReporte.cambioRecienteUbicacion ? 'Sí' : 'No'}</Text></Text>
          <Text style={styles.texto}>Exposición a Condiciones Especiales:{"\n"} <Text style={styles.textoValor}>{parsedReporte.exposicionCondiciones}</Text></Text>
        </View>

        <View style={styles.caja}>
          <Text style={styles.encabezado}>Uso y Frecuencia</Text>
          <Text style={styles.texto}>Frecuencia de Uso: {"\n"}<Text style={styles.textoValor}>{parsedReporte.frecuenciaUso}</Text></Text>
          <Text style={styles.texto}>Uso Intensivo o inusual: {"\n"}<Text style={styles.textoValor}>{parsedReporte.usoIntensivo ? 'Sí' : 'No'}</Text></Text>
        </View>

        <View style={styles.caja}>
          <Text style={styles.encabezado}>Alertas y Señales</Text>
          <Text style={styles.texto}>Mensaje de Error:{"\n"} <Text style={styles.textoValor}>{parsedReporte.mensajeError}</Text></Text>
          <Text style={styles.texto}>Señal de Alarma:{"\n"} <Text style={styles.textoValor}>{parsedReporte.senalAlarma}</Text></Text>
          <Text style={styles.texto}>Sonido Inusual:{"\n"} <Text style={styles.textoValor}>{parsedReporte.sonidoInusual}</Text></Text>
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
    marginVertical: 0,
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
    fontFamily: "Kanit-Medium",
  },


  texto: {
    fontSize: 17,
    color: '#060688',
    marginVertical: 5,
    lineHeight: 22,
    fontFamily: "Kanit-Bold",
    fontWeight: '400',
    
  },
  textoValor: {
    fontSize: 16
    ,
    fontWeight: '200',
    fontFamily: "Kanit-Light",
    color: '#6f6f77',
  },

  boton: {
    backgroundColor: '#050259',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 15,
    marginBottom: 15, 
    margin:0// Spacing between buttons
  },
  botonTexto: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '400',
    fontFamily: "Kanit-Thin",
  },
  backButton: {
    position: 'absolute',
    left: 5,
    top: 30,
    zIndex:99
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
    fontFamily: "Kanit-Bold",
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
   
    marginVertical: 10,
    marginTop:'7%',
    color:'#022e68',
    fontFamily: "Kanit-Medium",
  },



  botonContainer: {
    marginTop: 0,

    alignItems:'center',
  },
  cajaparametros: {
    paddingLeft: "0%",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: "65%",
    flexDirection: "row",
    flexWrap: "wrap",
   
    height: 200,
    borderBottomWidth: 0,
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
    height:100
  },
});
