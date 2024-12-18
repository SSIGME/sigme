import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Image, Text, Dimensions, TouchableOpacity, StyleSheet, FlatList, TextInput, Alert, Platform, Keyboard } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import Checkbox from 'expo-checkbox';
import axios from "axios";
import url from "@/constants/url.json";

import AsyncStorage from '@react-native-async-storage/async-storage';
import SigmeModal from "../../componets/SigmeModal";

const CodesAccessScreen = () => {
  const { type } = useLocalSearchParams();
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [accessCodes, setAccessCodes] = useState([]);
  const [modal, setModal] = useState({ isVisible: false, title: "", message: "", type: "success" });
  const [isChecked, setIsChecked] = useState(false);
  const [selectedOption, setSelectedOption] = useState('option1');
  const [nombre, setNombre] = useState('');
  const [fechaExpiracion, setFechaExpiracion] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [documento, setDocumento] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDateEnabled, setIsDateEnabled] = useState(true);

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || new Date();
    setShowDatePicker(Platform.OS === 'ios');
    setSelectedDate(currentDate);
    const formattedDate = `${currentDate.getDate().toString().padStart(2, '0')}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getFullYear()}`;
    setFechaExpiracion(formattedDate);
  };

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
    setIsDateEnabled(isChecked); // Cambia el estado del input de fecha
    if (!isChecked) {
      setFechaExpiracion(''); // Reiniciar la fecha si se deshabilita
    }
  };

  const handleGenerateCode = async () => {
    try {
      const codigoHospital = await AsyncStorage.getItem("codigoHospital");
      const codigo = { nombre, fechaExpiracion, empresa, documento, codigoHospital, fechaExpiracionEstado: isDateEnabled };
      const token = await AsyncStorage.getItem("access_token");
      if (!token) throw new Error('Token de acceso no encontrado');

      const response = await axios.post(`${url.url}/${type}`, codigo, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      setModal({ isVisible: true, title: "Código", message: response.data.msg, type: "success" });
    } catch (error) {
      const errorMessage = error.response ? error.response.data.msg : error.message || 'Error al crear el técnico';
      setModal({ isVisible: true, title: error.response.data.msg, message: errorMessage, type: "error" });
    }
  };

  const closeModal = () => {
    setModal({ ...modal, isVisible: false });
    router.push(`/screens/codigos/listaCodigos?type=${type}`)
  };
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    // Cleanup the listeners on unmount
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() =>  router.push(`/screens/codigos/listaCodigos?type=${type}`)} style={styles.backButton}>
        <Image source={require("../../../assets/images/back.png")} style={styles.backIcon} />
      </TouchableOpacity>
      <View style={styles.header}>
        <Text style={styles.headerText}>
          {type === 'profesional' ? 'Profesional' :
           type === 'encargado' ? 'Encargado' :
           type === 'jefeArea' ? 'Jefe de area' :
           type === 'tecnico' ? 'Técnico' :
           'Códigos'}
        </Text>
        <Text style={styles.subHeaderText}>CREAR CÓDIGO DE ACCESO</Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Nombre</Text>
        <TextInput
          style={styles.input}
          placeholder="Ingresa el nombre"
          value={nombre}
           placeholderTextColor="#a6a7b1"
          onChangeText={setNombre}
        />

        <Text style={styles.label}>Fecha de expiración</Text>
        <TextInput
          style={styles.input}
          placeholder="dd/mm/yyyy"
          value={fechaExpiracion}
            placeholderTextColor="#a6a7b1"
          editable={isDateEnabled}
          onFocus={() => isDateEnabled && setShowDatePicker(true)}
        />
        
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            minimumDate={new Date(new Date().setDate(new Date().getDate() + 1))}
            onChange={onChangeDate}
          />
        )}

        <Text style={styles.label}>Documento</Text>
        <TextInput
          style={styles.input}
            placeholderTextColor="#a6a7b1"
          placeholder="Número de documento"
          value={documento}
          onChangeText={setDocumento}
        />

        {type === 'tecnico' && (
          <>
            <Text style={styles.label}>Empresa</Text>
            <TextInput
              placeholderTextColor="#a6a7b1"
              style={styles.input}
              placeholder="Nombre de la empresa"
              value={empresa}
              onChangeText={setEmpresa}
            />
          </>
        )}

        {type === 'jefeArea' && (
          <>
            <Text style={styles.label}>Seleccione Área</Text>
            <Picker
              selectedValue={selectedOption}
              onValueChange={(itemValue) => setSelectedOption(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Área 1" value="option1" />
              <Picker.Item label="Área 2" value="option2" />
              <Picker.Item label="Área 3" value="option3" />
            </Picker>
          </>
        )}

        {(type === 'jefeArea' || type === "profesional" || type === "encargado") && (
          <View style={styles.containerCheck}>
            <Checkbox
              value={isChecked}
              onValueChange={handleCheckboxChange}
              style={styles.checkbox}
              color={"#457cf1"}
            />
            <Text style={styles.label}>Crear sin fecha expiración</Text>
          </View>
        )}

        <TouchableOpacity style={styles.generateButton} onPress={handleGenerateCode}>
          <Text style={styles.generateButtonText}>Generar</Text>
        </TouchableOpacity>
      </View>

      <SigmeModal 
        isVisible={modal.isVisible}
        message={modal.message}
        title={modal.title}
        type={modal.type}
        onClose={closeModal}
        onConfirm={closeModal}
      />
     {!isKeyboardVisible && (
        <View style={styles.logoC}>
          <Image source={require("../../../assets/images/logo.png")} style={styles.logo} />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  backButton: {
   
    marginLeft: -0,
    marginTop: -60,
  },
  logoC:{
    zIndex:-99,
    position: 'absolute',
    width:Dimensions.get("window").width * 1,
    bottom:"-25%",
    alignItems:"center",
  
    marginHorizontal:"auto",
    resizeMode:'center'
  },
  logo:{  
    width:"35%",
   
    
    
    resizeMode:'center'}
  ,
  backIcon: {
    width: 35,
    height: 35,
    resizeMode: 'contain',
  },
  container: {
    flex: 1,
    backgroundColor: '#F9FAFC',
    paddingHorizontal: 20,
    justifyContent: 'center',
  
  },
  header: {
    marginBottom: 50,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 26,
    marginBottom:15,
    fontWeight: 'bold',
    color: '#333',
  },
  subHeaderText: {
    fontSize: 18,
    color: '#333',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    color: '#021733',
    marginBottom: 7,
    fontWeight: '300',
    marginLeft:3
  },
  input: {
    backgroundColor: '#d5d6f8',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    borderColor: '#DDD',
    borderWidth: 1,
    fontSize: 16,

  },
  codeList: {
    flexGrow: 0,
    marginBottom: 60,
  },
  generateButton: {
    backgroundColor: '#001366',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: "7%",
    width: '70%',
   
    marginHorizontal: "auto",
  },
  generateButtonText: {
    fontSize: 22,
    fontWeight: '200',
    color: '#FFF',
  },
  containerCheck: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  checkbox: {
    alignSelf: 'center',
  },
  picker: {
    height: 50,
    width: '100%',
  },
});

export default CodesAccessScreen;
