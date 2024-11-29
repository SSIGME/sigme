

import React, { useState , useRef } from 'react';
import { View, Text, Image, FlatList,  TextInput,Animated, TouchableOpacity, Button, ScrollView, StyleSheet } from 'react-native';
import CheckBox from 'expo-checkbox';
import AsyncStorage from '@react-native-async-storage/async-storage';
import url from "@/constants/url.json";
import { useFonts } from "expo-font";
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import { useLocalSearchParams } from "expo-router";
export default function ReporteEquipoScreen() {
  const scaleValue = useRef(new Animated.Value(1)).current;
  const router = useRouter();
  const scaleAnim = new Animated.Value(1);



 
  const [color] = useState("#050259")
  // Descripción del problema
  const { tipo, reportes,marca, modelo, serie, area, IdEquipo } = useLocalSearchParams();


 
  const [fontsLoaded] = useFonts({
    "Kanit-Regular": require("@/assets/fonts/Kanit/Kanit-Regular.ttf"),
    "Kanit-Medium": require("@/assets/fonts/Kanit/Kanit-Medium.ttf"),
    "Kanit-Light": require("@/assets/fonts/Kanit/Kanit-Light.ttf"),
  });

 
  const renderItem = ({ item }) => {
    // Definir los colores y el ícono según el estado
    let iconColor = "#2923ca"; // Azul por defecto
    let iconName = "infocirlceo"; // Ícono por defecto
  
    if (item.equipoFueraServicio === "Fuera de servicio") {
      iconColor = "#ff4949"; // Rojo
      iconName = "circle";
    } else if (item.equipoFueraServicio === "parcialmente fuera de servicio") {
      iconColor = "#f0b13d"; // Amarillo
      iconName = "circle";
    } else if (item.equipoFueraServicio === "Funcionando") {
      iconColor = "#526bf8"; // Azul
      iconName = "circle";
    }
  
    return (
      <Animated.View style={[styles.card, { transform: [{ scale: scaleAnim }] }]}>
        <TouchableOpacity
        onPress={()=>{  router.push({
          pathname: "Equipo/ViewPeticion",
          params: { reporte: JSON.stringify(item) },
        });}}
          style={styles.touchable}
        >
          <View style={styles.iconContainer}>
            <FontAwesome name={iconName} size={30} color={iconColor} />
          </View>
          <View style={styles.textContainer}>
          <Text style={styles.title}>
  {item.descripcionProblema.length > 30
    ? `${item.descripcionProblema.substring(0, 30)}...`
    : item.descripcionProblema}
</Text>
            <Text style={styles.subtitle1}>{item.tipo} {item.serie}</Text>
            <Text style={styles.subtitle}>Estado: {item.equipoFueraServicio}</Text>
            <Text style={styles.date}>Fecha: {item.fecha}</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };
  return (
    <View style={styles.contenedor}>
   <View style={styles.header}>
      <TouchableOpacity onPress={() => router.push('/(tabs)/Codigos')} style={styles.backButton}>
          <Image source={require("../../assets/images/back.png")} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerText}>
 
        </Text>
        <Text style={styles.subHeaderText}>SOLICITUDES DE <Text style={{    fontFamily: "Kanit-Medium",}}>MANTENIMIENTO</Text> </Text>
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
      
        <FlatList
  data={(() => { 
    try { 
      return JSON.parse(reportes).reverse(); 
    } catch { 
      return []; 
    } 
  })()}

      renderItem={renderItem}
      keyExtractor={(item) => item._id}
      contentContainerStyle={styles.listContainer}
    />
      </ScrollView>
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
  listContainer: {
    padding: 5,
    marginTop:"4%",
    backgroundColor: '#f2f4f8',
    paddingBottom:'40%'
  },
  title1: {
    fontSize: 24,
    position: "static",
    fontWeight: "200",
    color: "#ffffff",
    backgroundColor: "#050259",
    paddingTop: "13%",
    paddingBottom: "3%",
    borderBottomLeftRadius: 23, // Solo para el borde inferior izquierdo
    borderBottomRightRadius: 23,

    paddingLeft: 30,
 
  },
  highlight: {
    color: "#ffffff",
    fontWeight: "600",
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  touchable: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 17
    ,
    fontWeight: 'bold',
    color: '#001275',
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
  },
  subtitle1: {
    fontSize: 14,
    color: '#131313',
    fontWeight:'500'
  },
  date: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
});
