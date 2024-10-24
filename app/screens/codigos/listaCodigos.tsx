import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
const CodesAccessScreen = () => {
  const { type } = useLocalSearchParams()
  const [activeTab, setActiveTab] = useState('activos');
  const [accessCodes, setAccessCodes] = useState([
    { id: '1', codigo: 'F24F23', propietario: 'Luz Marina', expiracion: '24 Horas' },
    { id: '2', codigo: 'F24F23', propietario: 'Luz Marina', expiracion: '24 Horas' },
    { id: '3', codigo: 'F24F23', propietario: 'Luz Marina', expiracion: '24 Horas' },
    { id: '4', codigo: 'F24F23', propietario: 'Luz Marina', expiracion: '24 Horas' },
    { id: '5', codigo: 'F24F23', propietario: 'Luz Marina', expiracion: '24 Horas' },
  ]);

  const renderAccessCode = ({ item }) => (
    <View style={styles.codeCard}>
      <Text style={styles.codeText}>CÓDIGO: {item.codigo}</Text>
      <Text style={styles.ownerText}>Pertenece a: {item.propietario}</Text>
      <Text style={styles.durationText}>Vence en: {item.expiracion}</Text>
      <TouchableOpacity style={styles.deleteButton}>
        <Text style={styles.deleteButtonText}>X</Text>
      </TouchableOpacity>
    </View>
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
          <Text style={[styles.tabText, activeTab === 'historial' && styles.activeTabText]}>HISTORIAL</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={accessCodes}
        renderItem={renderAccessCode}
        keyExtractor={(item) => item.id}
        style={styles.codeList}
      />

      <TouchableOpacity  onPress={()=> {router.push(`/screens/codigos/crearTecnico?type=${type}`)}} style={styles.generateButton}>
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
    marginTop: 30,
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
});

export default CodesAccessScreen;
