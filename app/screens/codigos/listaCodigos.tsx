import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, FlatList, SafeAreaView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import axios from "axios";
import url from "@/constants/url.json";
import AsyncStorage from '@react-native-async-storage/async-storage';

const CodesAccessScreen = () => {
  const { type } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState('activos');
  const [accessCodes, setAccessCodes] = useState([]);
  const [access, setAccess] =useState("")
  const renderAccessCode = ({ item }) => (
    <View style={[styles.codeCard, item.estado ? styles.activeCodeCard : styles.inactiveCodeCard]}>
      <Text style={styles.codeText}>CÓDIGO: {item.codigo}</Text>
      <Text style={styles.ownerText}>Pertenece a: {item.nombre}</Text>
      <Text style={styles.durationText}>
        {item.fechaExpiracion === true 
          ? "Sin expiración" 
          : `Expira el: ${item.fechaExpiracion}`}
      </Text>
      <TouchableOpacity onPress={() => handleDesactivateCode(item.codigo)} style={item.estado ? styles.deleteButton : styles.inactiveButton}>
        <Text style={styles.deleteButtonText}>X</Text>
      </TouchableOpacity>
    </View>
  );
  
  const handleGetCodes = async () => {
    try {
      const codigoHospital = await AsyncStorage.getItem("codigoHospital");
      if (!codigoHospital) throw new Error('Código de hospital no encontrado');
  
      const token = await AsyncStorage.getItem("access_token");
      
      if (!token) throw new Error('Token de acceso no encontrado');
      
      const response = await axios.get(`${url.url}/get/users/${codigoHospital}/${type}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (response && response.data) {
        setAccessCodes(response.data);
      }
    } catch (error) {
      const errorMessage = error.response 
        ? error.response.data.msg 
        : error.message || 'Error al crear el técnico';
      Alert.alert('Error', errorMessage);
    }
  };

  const handleDesactivateCode = async (codigo) => {
    try {
      const codigoHospital = await AsyncStorage.getItem("codigoHospital");
      if (!codigoHospital) throw new Error('Código de hospital no encontrado');
  
      const token = await AsyncStorage.getItem("access_token");
      if (!token) throw new Error('Token de acceso no encontrado');
  
      const response = await axios.put(`${url.url}/usuario/${codigoHospital}/${codigo}`, {}, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (response && response.data) {
        Alert.alert("Código desactivado");
        handleGetCodes(); // Actualizar la lista de códigos después de desactivar
      }
    } catch (error) {
      const errorMessage = error.response 
        ? error.response.data.msg 
        : error.message || 'Error al desactivar el código';
      Alert.alert('Error', errorMessage);
    }
  };
  


  useEffect(() => {
    handleGetCodes();
  }, []);

  // Filtrar códigos de acceso según el estado de activeTab
  const filteredCodes = accessCodes.filter(code => 
    activeTab === 'activos' ? code.estado === true : code.estado === false
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>
          {type === 'profesional' ? 'Profesionales' : 
           type === 'encargado' ? 'Encargados' : 
           type === 'jefeArea' ? 'Jefes de area' : 
           type === 'tecnico' ? 'Técnicos' : 
           'Códigos'}
        </Text>
        <Text style={styles.subHeaderText}>CÓDIGOS DE ACCESO</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity onPress={() => setActiveTab('activos')} style={[styles.tab, activeTab === 'activos' && styles.activeTab]}>
          <Text style={[styles.tabText, activeTab === 'activos' && styles.activeTabText]}>ACTIVOS</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('historial')} style={[styles.tab, activeTab === 'historial' && styles.activeTab]}>
          <Text style={[styles.tabText, activeTab === 'historial' && styles.activeTabText]}>INACTIVOS</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredCodes}
        renderItem={renderAccessCode}
        keyExtractor={(item) => item.id}
        style={styles.codeList}
      />

      <TouchableOpacity onPress={() => {router.push(`/screens/codigos/crearTecnico?type=${type}`)}} style={styles.generateButton}>
        <Text style={styles.generateButtonText}>Generar código de acceso</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFC',
    paddingHorizontal: 0,
  },
  header: {
    marginTop: 60,
    marginBottom: 20,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
  },
  subHeaderText: {
    fontSize: 18,
    color: '#333',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#D6D7F2',
  },
  activeTab: {
    backgroundColor: '#001366',
  },
  tabText: {
    fontSize: 16,
    color: '#888',
  },
  activeTabText: {
    color: '#FFF',
  },
  codeList: {
    flexGrow: 0,
    marginBottom: 60,
  },
  codeCard: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    height:150,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  codeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#001366',
  },
  ownerText: {
    fontSize: 14,
    color: '#888',
  },
  durationText: {
    fontSize: 14,
    color: '#001366',
  },
  deleteButton: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 5,
  },
  deleteButtonText: {
    fontSize: 23,
    color: '#ff0000',
    fontWeight:"900"
  },
  generateButton: {
    backgroundColor: '#001366',

    borderRadius: 0,
    alignItems: 'center',
    position:'absolute',
    bottom:0,
    height:"10%",
    justifyContent:'center',
    width:'100%'
  },
  generateButtonText: {
    fontSize: 18,
    color: '#FFF',
    fontWeight:'300',
  },
  inactiveCodeCard: {
     // Fondo para códigos inactivos

    opacity: 0.4,  // Hacer que el código inactivo parezca atenuado
  },
  inactiveButton: {
    display:"none"
  }
});

export default CodesAccessScreen;
