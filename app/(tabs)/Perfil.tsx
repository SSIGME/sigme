import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import { SafeAreaView } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import url from "../../constants/url.json";
import axios from "axios";
import * as Animatable from 'react-native-animatable';
import { useFocusEffect } from '@react-navigation/native';

const { width } = Dimensions.get('window'); 

const HospitalInfoScreen = () => {
  const [hospitalData, setHospitalData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchHospitalData = async () => {
    try {
      const codigoHospital = await AsyncStorage.getItem('codigoHospital');
      const token = await AsyncStorage.getItem('access_token');

      if (!codigoHospital || !token) throw new Error("No se encontró el código del hospital o el token.");

      const response = await axios.get(`${url.url}/hospital/${codigoHospital}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setHospitalData(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      fetchHospitalData();
    }, [])
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#6200EE" style={{ flex: 1, justifyContent: 'center' }} />;
  }

  if (!hospitalData) {
    return <Text>No se pudo cargar la información del hospital.</Text>;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Animatable.Image
          animation="zoomIn"
          source={{ uri: hospitalData.imagen }}
          style={styles.logo}
        />
        <Animatable.Text animation="fadeInDown" style={styles.header}>
          {hospitalData.nombre || "Nombre del Hospital"}
       
       
        </Animatable.Text>
        <Text style={styles.infoText1}>{hospitalData.codigoIdentificacion || "N/A"}</Text>
        <Animatable.Text animation="fadeIn" style={styles.sectionTitle}>
          Información General
        </Animatable.Text>
        <View style={styles.divider} />

        <Animatable.View animation="slideInUp" style={styles.infoBox}>
        
          <View style={styles.infoRow}>
            <Text style={styles.infoTitle}>Ciudad:</Text>
            <Text style={styles.infoText}>{hospitalData.ciudad || "N/A"}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoTitle}>Departamento:</Text>
            <Text style={styles.infoText}>{hospitalData.departamento || "N/A"}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoTitle}>Dirección:</Text>
            <Text style={styles.infoText}>{hospitalData.direccion || "N/A"}</Text>
          </View>
        
          <View style={styles.infoRow}>
            <Text style={styles.infoTitle}>Tipo :</Text>
            <Text style={styles.infoText}>{hospitalData.tipo || "N/A"}</Text>
          </View>
        </Animatable.View>



       
      <Animatable.View animation="slideInUp" style={styles.licenseInfo}>
          
          <Text style={styles.licenseText}>Fecha de Creación</Text>
          <Text>{hospitalData.fechaCreacion || "N/A"}</Text>

          <Text style={styles.licenseText}>Fecha de Expiración</Text>
          <Text>{hospitalData.fechaExpiracion || "N/A"}</Text>

          <Text style={styles.licenseText}>Estado de Licencia</Text>
          <Text>{hospitalData.estadoLicencia ? "Activa" : "Inactiva"}</Text>

          <Text style={styles.licenseText}>Responsable de Mantenimiento</Text>
          <Text>{hospitalData.responsableMantenimiento || "N/A"}</Text>
        </Animatable.View>
        <Animatable.Text animation="fadeIn" style={styles.sectionTitle}>
          Información Contacto
        </Animatable.Text>
        <View style={styles.divider} />
        <Animatable.View animation="slideInUp" style={styles.infoBox}>
        
   
    
    
        <View style={styles.infoRow}>
          <Text style={styles.infoTitle}>Teléfono:</Text>
          <Text style={styles.infoText}>{hospitalData.telefono || "N/A"}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoTitle}>Correo de Contacto:</Text>
          <Text style={styles.infoText}>{hospitalData.correoContacto || "N/A"}</Text>
        </View>
   
      </Animatable.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingBottom: '30%',
    padding: 20,
    backgroundColor: '#F2F2F2',
  },
  header: {
    fontSize: 30,
    fontWeight: '500',
    color: '#021342',
    textAlign: 'center',
  
    textTransform: "capitalize",
  },
  logo: {
    width: width * 1,
    aspectRatio: 1.4,
    borderColor: "#001844",
    alignSelf: 'center',
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
    resizeMode: 'contain',
  },
  sectionTitle: {
    fontSize: 23,
    fontWeight: '300',
    marginTop: 20,
    color: '#333',
  },
  divider: {
    height: 3,
    backgroundColor: '#D6D7F2',
    marginVertical: 20,
  },
  infoBox: {
    backgroundColor: '#050259',
    padding: 25,
    borderRadius: 10,
    elevation: 6,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  infoTitle: {
    fontSize: 17,
    marginRight: 4,
    color: '#ffffff',
    fontWeight: "300",
  },
  infoText: {
    fontSize: 17,
    color: '#ffffff',
    fontWeight: "100",
  },
  infoText1: {
    fontSize: 17,
    color: '#000000',
    fontWeight: "100",
    textAlign:'center'
  },
  licenseInfo: {
    marginTop: 10,
    marginHorizontal: 20,
  },
  licenseText: {
    fontWeight: 'bold',
    marginTop: 20,
    color: '#02096b',
  },
});

export default HospitalInfoScreen;
