import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, TextInput, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import Checkbox from 'expo-checkbox';
const CodesAccessScreen = () => {
  const { type } = useLocalSearchParams();

  const [accessCodes, setAccessCodes] = useState([
   
  ]);

  const [isChecked, setIsChecked] = useState(false);

  const [selectedOption, setSelectedOption] = useState('option1');

  const [nombre, setNombre] = useState('');
  const [fechaExpiracion, setFechaExpiracion] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDateEnabled, setIsDateEnabled] = useState(true); // E
  // Function to handle code generation
  const handleGenerateCode = () => {
   

    const newCode = {
      id: (accessCodes.length + 1).toString(),
      codigo: Math.random().toString(36).substring(2, 8).toUpperCase(), // Random 6-digit code
      propietario: nombre,
      expiracion: fechaExpiracion,
      empresa: empresa
    };

    setAccessCodes([...accessCodes, newCode]);
    setNombre(''); // Clear fields after generating the code
    setFechaExpiracion('');
    setEmpresa('');
  };

  // Function to handle the date picker change
  const onChangeDate = (event:any, selectedDate:any) => {
    const currentDate = selectedDate || new Date();
    setShowDatePicker(Platform.OS === 'ios'); // Close picker on Android, keep it open on iOS
    setSelectedDate(currentDate);

    // Format the date as dd/mm/yyyy
    const formattedDate = `${currentDate.getDate().toString().padStart(2, '0')}/${
      (currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getFullYear()}`;
    setFechaExpiracion(formattedDate);
  };

  const renderAccessCode = ({ item }) => (
    <View style={styles.codeCard}>
      <Text style={styles.codeText}>CÓDIGO: {item.codigo}</Text>
      <Text style={styles.ownerText}>Pertenece a: {item.propietario}</Text>
      <Text style={styles.durationText}>Vence en: {item.expiracion}</Text>
    </View>
  );


  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
    setIsDateEnabled(isChecked); // Cambia el estado del input de fecha
    if (isChecked) {
      setFechaExpiracion(''); // Reiniciar la fecha si se deshabilita
    }
  };
  return (
    <SafeAreaView style={styles.container}>
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
        <TextInput
          style={styles.input}
          placeholder="Nombre"
          value={nombre}
          onChangeText={setNombre}
        />
<TextInput
  style={styles.input}
  placeholder="Fecha de expiración"
  value={fechaExpiracion}
  editable={isDateEnabled} // Agrega esta línea
  onFocus={() => isDateEnabled && setShowDatePicker(true)} // Cambia esto también
/>


        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onChange={onChangeDate}
          />
        )}

{type === 'tecnico' && (
  <TextInput
    style={styles.input}
    placeholder="Empresa"
    value={empresa}
    onChangeText={setEmpresa}
  />
)}
{type === 'jefeArea' && (
      <Picker
      selectedValue={selectedOption}
      onValueChange={(itemValue) => setSelectedOption(itemValue)}
      style={styles.picker}
    >
      <Picker.Item label="Area1" value="option1" />
      <Picker.Item label="Area2" value="option2" />
      <Picker.Item label="Area3" value="option3" />
    </Picker>
)}

{(type === 'jefeArea' || type === "profesional" || type === "encargado") && (
    <View style={styles.containerCheck}>
    <Checkbox
      value={isChecked}
      onValueChange={handleCheckboxChange} // Cambia aquí
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
      <Text style={{marginLeft:"10%", fontSize:20, fontWeight:'200', marginBottom:"6%"}}>Últimos Códigos de{"\n"}acceso creados</Text>
      <FlatList
        data={accessCodes}
        renderItem={renderAccessCode}
        keyExtractor={(item) => item.id}
        style={styles.codeList}
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
  header: {
    marginTop: "10%",
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
  inputContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderColor: '#DDD',
    borderWidth: 1,
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
    height: 150,
    width:"85%",
    marginHorizontal:"auto",
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
  generateButton: {
    backgroundColor: '#001366',
    borderRadius: 10,
 
    padding: 15,
    alignItems: 'center',
    marginTop:"3%",
    width:'70%',
    marginHorizontal:"auto"
  },
  generateButtonText: {
    fontSize: 22,
    fontWeight:'200',
    color: '#FFF',
  },
  containerCheck: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  label: {
    fontSize: 18,
    fontWeight:'200',
    marginRight: 10,
    marginLeft:"3%"
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
