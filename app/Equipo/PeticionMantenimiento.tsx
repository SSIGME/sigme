

import React, { useState , useRef } from 'react';
import { View, Text, Image, TextInput,Animated, TouchableOpacity, Button, ScrollView, StyleSheet } from 'react-native';
import CheckBox from 'expo-checkbox';
import AsyncStorage from '@react-native-async-storage/async-storage';
import url from "@/constants/url.json";
import { useFonts } from "expo-font";
import SigmeModal from "../componets/SigmeModal";
import { router, useLocalSearchParams } from "expo-router";
export default function ReporteEquipoScreen() {
  const scaleValue = useRef(new Animated.Value(1)).current;
  const [modal, setModal] = useState({
    isVisible: false,
    title: "",
    message: "",
    type: "success" // Default type, you can change this based on login outcome
  });


  const handlePressIn = () => {
    
    Animated.spring(scaleValue, {
      toValue: 0.95, // Shrink to 95% of its original size
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1, // Return to original size
      useNativeDriver: true,
    }).start(() => manejarEnvio());
  };
  const [color] = useState("#050259")
  // Descripción del problema
  const { tipo, marca, modelo, serie, area, IdEquipo } = useLocalSearchParams();
  const [descripcionProblema, setDescripcionProblema] = useState('');
  const [esPrimeraVez, setEsPrimeraVez] = useState(false);
  const [impactoFuncionamiento, setImpactoFuncionamiento] = useState('');

  // Impacto en el funcionamiento
  const [equipoFueraServicio, setEquipoFueraServicio] = useState('');
  const [funcionesAfectadas, setFuncionesAfectadas] = useState('');
  const [afectaSeguridad, setAfectaSeguridad] = useState(false);

  // Ubicación y entorno de uso
  const [ubicacionEquipo, setUbicacionEquipo] = useState('');
  const [cambioRecienteUbicacion, setCambioRecienteUbicacion] = useState(false);
  const [exposicionCondiciones, setExposicionCondiciones] = useState('');

  // Frecuencia de uso
  const [frecuenciaUso, setFrecuenciaUso] = useState('');
  const [usoIntensivo, setUsoIntensivo] = useState(false);

  // Indicadores y señales de alerta
  const [mensajeError, setMensajeError] = useState('');
  const [senalAlarma, setSenalAlarma] = useState('');
  const [sonidoInusual, setSonidoInusual] = useState('');


  const [fontsLoaded] = useFonts({
    "Kanit-Regular": require("@/assets/fonts/Kanit/Kanit-Regular.ttf"),
    "Kanit-Medium": require("@/assets/fonts/Kanit/Kanit-Medium.ttf"),
    "Kanit-Light": require("@/assets/fonts/Kanit/Kanit-Light.ttf"),
  });

  const manejarEnvio = async () => {
    // Crear el objeto del reporte con los datos necesarios
    const reporte = {
      descripcionProblema,
      esPrimeraVez,
      impactoFuncionamiento,
      equipoFueraServicio,
      funcionesAfectadas,
      afectaSeguridad,
      ubicacionEquipo,
      cambioRecienteUbicacion,
      exposicionCondiciones,
      frecuenciaUso,
      usoIntensivo,
      mensajeError,
      senalAlarma,
      sonidoInusual,
      marca,
      modelo,
      serie,
      area,
      tipo,
      IdEquipo,

    };
  
    console.log('Reporte del equipo:', reporte); // Muestra el reporte en consola para verificar
  
    try {
      // Obtener el código del hospital desde AsyncStorage
      const codigoHospital = await AsyncStorage.getItem('codigoHospital');
      if (!codigoHospital) {
        console.error('No se encontró el código del hospital');
        return;
      }
  
      // Realizar la petición POST con el reporte
      const response = await fetch(`${url.url}/api/reporte/${codigoHospital}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reporte), // Convertir el reporte a JSON para enviarlo
      });
  
      // Manejo de la respuesta
      if (response.ok) {
        const data = await response.json();
        setModal({
          isVisible: true,
          title: "Reporte" ,
          message: "Reporte enviado",
          type: "success"
        });

      } else {
        setModal({
          isVisible: true,
          title: "Reporte" ,
          message: response.statusText,
          type: "error"
        });
      }
    } catch (error) {
      setModal({
        isVisible: true,
        title: "Reporte" ,
        message: error,
        type: "error"
      });
    }
  };
    const closeModal = () => {
    setModal({ ...modal, isVisible: false });
    router.back()
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
            Modelo <Text style={styles.parametroinfo}> {modelo}</Text>
          </Text>
          <Text style={styles.parametro}>
            Marca <Text style={styles.parametroinfo}> {marca}</Text>
          </Text>
          <Text style={styles.parametro}>
            Serie <Text style={styles.parametroinfo}> {serie}</Text>
          </Text>
          <Text style={styles.parametro}>
            Ubicacion <Text style={styles.parametroinfo}> {area}</Text>
          </Text>
        </View>
      </View>
   
        <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false} style={styles.scrollView}>
      <Text style={[styles.encabezado, {marginTop:'2%'}]}>Descripción del problema</Text>
      <TextInput
        style={styles.input}
        placeholder="¿Cuál es el problema o fallo específico que presenta el equipo?"
        value={descripcionProblema}
        onChangeText={setDescripcionProblema}
        multiline
      />
      <View style={styles.checkboxContainer}>
        <CheckBox
          value={esPrimeraVez}
          onValueChange={setEsPrimeraVez}
          style={styles.checkbox}
          color={esPrimeraVez ? color: undefined}
        />
        <Text style={styles.label}>¿Es la primera vez que ocurre?</Text>
      </View>

      {/* Impacto en el funcionamiento */}
      <Text style={styles.encabezado}>Impacto en el funcionamiento</Text>
      <Text style={{marginBottom:20,fontSize:17,}}>¿Cuál es el estado actual del equipo?</Text>
<View style={styles.checkboxGroup}>
  <View style={styles.checkboxContainer}>
    <CheckBox
      value={equipoFueraServicio=== 'Fuera de servicio'}
      onValueChange={() => setEquipoFueraServicio('Fuera de servicio')}
      style={styles.checkbox}
      color={equipoFueraServicio === 'Fuera de servicio' ? color : undefined}
    />
    <Text style={styles.label}>Fuera de servicio</Text>
  </View>
  <View style={styles.checkboxContainer}>
    <CheckBox
      value={equipoFueraServicio === 'parcialmente fuera de servicio'}
      onValueChange={() => setEquipoFueraServicio('parcialmente fuera de servicio')}
      style={styles.checkbox}
      color={equipoFueraServicio === 'parcialmente fuera de servicio' ? color : undefined}
    />
    <Text style={styles.label}>Parcialmente fuera de servicio</Text>
  </View>
  <View style={styles.checkboxContainer}>
    <CheckBox
      value={equipoFueraServicio === 'Funcionando'}
      onValueChange={() => setEquipoFueraServicio('Funcionando')}
      style={styles.checkbox}
      color={equipoFueraServicio=== 'Funcionando' ? color : undefined}
    />
    <Text style={styles.label}>Funcionando</Text>
  </View>
</View>
<TextInput
  style={styles.input}
  placeholder="¿Qué funciones o características del equipo están afectadas?"
  value={funcionesAfectadas}
  onChangeText={setFuncionesAfectadas}
  multiline
/>
<View style={styles.checkboxContainer}>
  <CheckBox
    value={afectaSeguridad}
    onValueChange={setAfectaSeguridad}
    style={styles.checkbox}
    color={afectaSeguridad ? color : undefined}
  />
  <Text style={styles.label}>¿Este problema afecta la seguridad del paciente o del personal?</Text>
</View>

      {/* Ubicación y entorno de uso */}
      <Text style={styles.encabezado}>Ubicación y entorno de uso</Text>
    

      <TextInput
        style={styles.input}
        placeholder="¿El equipo estuvo expuesto a alguna condición adversa (humedad, polvo, golpes)?     "
        value={exposicionCondiciones}
        onChangeText={setExposicionCondiciones}
        multiline
      />
      <View style={styles.checkboxContainer}>
        <CheckBox
          value={cambioRecienteUbicacion}
          onValueChange={setCambioRecienteUbicacion}
          style={styles.checkbox}
          color={cambioRecienteUbicacion ? color: undefined}
        />
        <Text style={styles.label}>¿Ha habido algún cambio reciente en la ubicación o entorno del equipo?</Text>
      </View>
      {/* Frecuencia de uso */}
      <Text style={styles.encabezado}>Frecuencia de uso</Text>
      <TextInput
        style={styles.input}
        placeholder="¿Con qué frecuencia se utiliza este equipo durante una jornada de funciones normales?"
        value={frecuenciaUso}
        onChangeText={setFrecuenciaUso}
        multiline
      />
      <View style={styles.checkboxContainer}>
        <CheckBox
          value={usoIntensivo}
          onValueChange={setUsoIntensivo}
          style={styles.checkbox}
          color={usoIntensivo ? color: undefined}
           
        />
        <Text style={styles.label}>¿Este equipo ha tenido un uso inusual o intensivo recientemente?</Text>
      </View>

      {/* Indicadores y señales de alerta */}
      <Text style={styles.encabezado}>Indicadores y señales de alerta</Text>
      <TextInput
        style={styles.input}
        placeholder="¿El equipo muestra algún mensaje de error o código de alerta en su pantalla?"
        value={mensajeError}
        onChangeText={setMensajeError}
        multiline
      />
      <TextInput
        style={styles.input}
        placeholder="¿Ha presentado alguna señal de alarma auditiva o visual (luces parpadeantes)?"
        value={senalAlarma}
        onChangeText={setSenalAlarma}
        multiline
      />
      <TextInput
        style={styles.input}
        placeholder="¿Hay algún sonido o vibración inusual al usar el equipo?"
        value={sonidoInusual}
        onChangeText={setSonidoInusual}
        multiline
      />
      
      <Animated.View style={[styles.botonContainer, { transform: [{ scale: scaleValue }] }]}>
        <TouchableOpacity
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
      

          style={styles.boton}
        >
          <Text style={styles.botonTexto}>Enviar Reporte</Text>
        </TouchableOpacity>
      </Animated.View>

      </ScrollView>
      <SigmeModal 
        isVisible={modal.isVisible}
        message={modal.message}
        title={modal.title}
        type={modal.type}
        onClose={closeModal}
        onConfirm={closeModal}
      />
    </View>
    
  );
}

const styles = StyleSheet.create({
  contenedor: {
    padding: 20,
    backgroundColor: '#f2f4f8',
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
    fontSize: 19,
    fontWeight: 'bold',
    marginVertical: 20,
    marginTop:'7%',
    color:'#02224d'
  },
  input: {
    height: "6%",
    borderColor: '#ffffff',
    borderWidth: 1,
    
    borderRadius: 15,
    padding: "4%",
    backgroundColor: '#eaeafa',
    marginBottom: 15,
   textAlign:"left",
   fontSize:15
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    
  },
  checkbox: {
    marginRight: 10,
    marginLeft:10,
    backgroundColor:'#aebafa',

  },
  label: {
    fontSize:15,
    flex: 1,
    flexWrap: 'wrap',
  },
  botonContainer: {
    marginTop: 20,
    marginBottom: "210%",
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
    width: "100%",
 
  },  parametro: {
    marginVertical: 3,
    fontFamily: "Kanit-Medium",
    width: "50%",
    fontSize:16,
  
  },
  parametroinfo: {
    color: "rgba(0, 0, 0, 0.3)",
    fontFamily: "Kanit-Light",
  },
  scrollView: {
    flexGrow: 1,  // Permitir que el contenido se expanda dentro del ScrollView
    paddingBottom: 200,
    paddingTop: '5%',
    marginTop: '4%',

  },

  boton: {
    backgroundColor: '#050259', // Customize your primary color
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    width:"90%",
    shadowRadius: 3.84,
    elevation: 5, // For Android shadow
  },
  botonTexto: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '200',
    textAlign: 'center',
  },
});
