import React, {  useCallback ,useEffect, useState } from 'react';
import { View, Text, StatusBar,FlatList, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import url from "@/constants/url.json";
import { useRouter } from "expo-router";
const ReportListScreen = () => {
  const [reportes, setReportes] = useState([])
  const scaleAnim = new Animated.Value(1);
  const router = useRouter();
  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = (reporte) => {
   
    
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start(() => {
      router.push({
        pathname: "Equipo/ViewPeticion",
        params: { reporte: JSON.stringify(reporte) },
      });
    });}
  
  useEffect(() => {
    // Esta lógica se ejecuta cuando el componente se monta
    ObtenerReportes();
    StatusBar.setBarStyle("light-content");
    StatusBar.setBackgroundColor("#050259");
  }, []); 

  const renderItem = ({ item }) => {
    // Definir los colores y el ícono según el estado
    let iconColor = "#2923ca"; // Azul por defecto
    let iconName = "infocirlceo"; // Ícono por defecto
  
    if (item.equipoFueraServicio === "Fuera de servicio") {
      iconColor = "#ff4949"; // Rojo
      iconName = "exclamation-circle";
    } else if (item.equipoFueraServicio === "parcialmente fuera de servicio") {
      iconColor = "#f0b13d"; // Amarillo
      iconName = "exclamation-circle";
    } else if (item.equipoFueraServicio === "Funcionando") {
      iconColor = "#526bf8"; // Azul
      iconName = "exclamation-circle";
    }
  
    return (
      <Animated.View style={[styles.card, { transform: [{ scale: scaleAnim }] }]}>
        <TouchableOpacity
          onPressIn={handlePressIn}
          onPressOut={() => handlePressOut(item)}
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

  const ObtenerReportes = async () => {
    try {
      // Obtener el código del hospital desde AsyncStorage
      const codigoHospital = await AsyncStorage.getItem('codigoHospital');
      if (!codigoHospital) {
        console.error('No se encontró el código del hospital');
        return;
      }
  
      // Realizar la petición GET para obtener todos los reportes
      const response = await fetch(`${url.url}/api/reportes/${codigoHospital}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      // Manejo de la respuesta
      if (response.ok) {
        const data = await response.json();
        console.log("Reportes obtenidos exitosamente:", data);
        setReportes(data)
        return data; // Retorna los reportes para usarlos en el componente
      } else {
        console.error("Error al obtener los reportes:", response.statusText);
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  };
  
  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" backgroundColor="#050259" />
      <Text style={styles.title1}>
        Solicitudes{"\n"}de
        {/* Esto fuerza un salto de línea */}
        <Text style={styles.highlight}> mantenimiento</Text>
      </Text>
    <FlatList
      data={reportes.reverse()}
      renderItem={renderItem}
      keyExtractor={(item) => item._id}
      contentContainerStyle={styles.listContainer}
    />
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
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

export default ReportListScreen;
