import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, TouchableOpacity,Image, Alert, StyleSheet, FlatList, SafeAreaView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import axios from "axios";
import url from "@/constants/url.json";
import AsyncStorage from '@react-native-async-storage/async-storage';
import SigmeModal from "../../componets/SigmeModal";
import * as Clipboard from 'expo-clipboard';
const CodesAccessScreen = () => {
  const { type } = useLocalSearchParams();
  const typeString = String(type);
  const [modal, setModal] = useState({
    isVisible: false,
    title: "",
    message: "",
    type: "success" // Default type, you can change this based on login outcome
  });
  const [activeTab, setActiveTab] = useState('activos');
  const [accessCodes, setAccessCodes] = useState([]);
  const [access, setAccess] =useState("")
  const renderAccessCode = ({ item }) => (
    <View style={[styles.codeCard, item.estado ? styles.activeCodeCard : styles.inactiveCodeCard]}>
      <View style={{gap:4}}>
      <TouchableOpacity  onPress={() => handleCopyCode(item.codigo)}> 
      <Text style={styles.codeText}>CÓDIGO: {item.codigo}</Text>
  
      <Text style={styles.ownerText}>Pertenece a: {item.nombre}</Text>
      <Text style={styles.durationText}>
        
        {item.fechaExpiracion === true 
          ? "Sin expiración" 
          : `Expira el: ${item.fechaExpiracion}`}
      </Text>
      </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => handleDesactivateCode(item.codigo)} style={item.estado ? styles.deleteButton : styles.inactiveButton}>
      <Image
            source={require("../../../assets/images/trash.png")}
            style={styles.image}
          />
      </TouchableOpacity>
    </View>
  );
  const handleCopyCode = async (codigo) => {
    await Clipboard.setStringAsync(codigo); // Copiar el código al portapapeles
    setModal({
      isVisible: true,
      title: "Código Copiado",
      message: `El código ${codigo} ha sido copiado al portapapeles.`,
      type: "success"
    });
  };
  const handleGetCodes = async () => {
    try {
      const codigoHospital = await AsyncStorage.getItem("codigoHospital");
      if (!codigoHospital) throw new Error('Código de hospital no encontrado');
  
      const token = await AsyncStorage.getItem("access_token");
      if (!token || token.trim() === '') throw new Error('Token de acceso no encontrado');
  
      const response = await axios.get(`${url.url}/get/users/${codigoHospital}/${type}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token.trim()}`
        }
      });
  
      if (response?.data) {
        console.log(response.data)
        setAccessCodes(response.data);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.msg || error.message || 'Error desconocido';
      setModal({
        isVisible: true,
        title: 'Error',
        message: errorMessage,
        type: "error"
      });
    }
  };
  
  const handleDesactivateCode = async (codigo) => {
    try {
      const codigoHospital = await AsyncStorage.getItem("codigoHospital");
      if (!codigoHospital) throw new Error('Código de hospital no encontrado');
  
      const token = await AsyncStorage.getItem("access_token")
      console.log(token)

      if (!token) throw new Error('Token de acceso no encontrado');
  
      const response = await axios.put(`${url.url}/usuario/${codigoHospital}/${codigo}`, {}, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
  
      if (response && response.data) {
        setModal({
          isVisible: true,
          title: "Código" ,
          message: "Código desactivado exitosamente",
          type: "success"
        });
        handleGetCodes(); // Actualizar la lista de códigos después de desactivar
      }
    } catch (error) {
      const errorMessage = error.response 
        ? error.response.data.msg 
        : error.message || 'Error al desactivar el código';
        setModal({
          isVisible: true,
          title: error.response.data.msg ,
          message: errorMessage,
          type: "error"
        });
    }
  };
  


  useEffect(() => {
    handleGetCodes();
  }, [typeString]);
  

  // Filtrar códigos de acceso según el estado de activeTab
  const filteredCodes = accessCodes.filter(code => 
    activeTab === 'activos' ? code.estado === true : code.estado === false
  );
  const closeModal = () => {
    setModal({ ...modal, isVisible: false });
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
      <TouchableOpacity onPress={() => router.push('/(tabs)/Codigos')} style={styles.backButton}>
          <Image source={require("../../../assets/images/back.png")} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerText}>
          {type === 'profesional' ? 'Profesionales' : 
           type === 'encargado' ? 'Encargados' : 
           type === 'jefeArea' ? 'Jefes de area' : 
           type === 'tecnico' ? 'Técnicos' : 
           'Códigos'}
        </Text>
        <Text style={styles.subHeaderText}>CÓDIGOS DE <Text style={{fontWeight:'900'}}>ACCESO</Text> </Text>
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
       data={filteredCodes.reverse()} 
        renderItem={renderAccessCode}
        keyExtractor={(item) => item.id}
        style={styles.codeList}
      />

{type !== 'jefeArea' && (
  <TouchableOpacity onPress={() => { router.push(`/screens/codigos/crearTecnico?type=${type}`); }} style={styles.generateButton}>
    <Text style={styles.generateButtonText}>Generar código de acceso</Text>
  </TouchableOpacity>
)}

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
    backgroundColor: '#F9FAFC',
    paddingHorizontal: 0,
  },

  
  backButton: {
    position: 'absolute',
    left: 20,
    top: 30,
  },
  backIcon: {
    width: 35,
    height: 35,
    resizeMode: 'contain',
  },
  header: {
    marginTop: 30,
    marginBottom: 20,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#050259',
    marginTop:50,
  },
  subHeaderText: {
    fontSize: 18,
    color: '#050259',
    marginTop:20,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    marginTop: "10%",
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 50,
    borderRadius: 10,
    backgroundColor: '#e7e7ee',
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  activeTab: {
    backgroundColor: '#050259',
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
    marginBottom: 80,
  },
  codeCard: {
    backgroundColor: '#D6D7F2',
    padding: 15,
    borderRadius: 10,
    marginHorizontal:'5%',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    height:150,
    flexDirection: 'row',
    paddingHorizontal:'5%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  codeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#001366',
    marginBottom:10
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
   
    borderRadius: 20,
    padding: 5,
  },
  image: {
 width:50,
 resizeMode: "contain",
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
