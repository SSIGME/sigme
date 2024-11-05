import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, FlatList, SafeAreaView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import SigmeModal from "../componets/SigmeModal";
import url from "@/constants/url.json";

const CodesAccessScreen = () => {
  const { type } = useLocalSearchParams();
  const [modal, setModal] = useState({
    isVisible: false,
    title: "",
    message: "",
    type: "success"
  });
  const [activeTab, setActiveTab] = useState('Preventivos');
  const [accessCodes, setAccessCodes] = useState([
    {
      tecnico: "Juan Pérez",
      ubicacion: "Edificio A, Piso 3",
      fecha: "2024-11-04",
      estado: "Activo",
      numeroReporte: "12345",
      tipo: "Preventivo"
    },
    {
      tecnico: "María López",
      ubicacion: "Edificio B, Piso 1",
      fecha: "2024-10-30",
      estado: "Inactivo",
      numeroReporte: "67890",
      tipo: "Correctivo"
    },
    {
      tecnico: "Carlos García",
      ubicacion: "Edificio C, Piso 2",
      fecha: "2024-10-25",
      estado: "Activo",
      numeroReporte: "54321",
      tipo: "Preventivo"
    }
  ]);
  

  const renderAccessCode = ({ item }) => (
    <View style={[styles.codeCard, item.estado === "Activo" ? styles.activeCodeCard : styles.inactiveCodeCard]}>
    <View style={{ gap: 4 }}>
      <TouchableOpacity>
        <Text style={styles.ownerText}><Text style={styles.labelText}>Técnico:</Text> {item.tecnico}</Text>
        <Text style={styles.ownerText}><Text style={styles.labelText}>Ubicación:</Text> {item.ubicacion}</Text>
        <Text style={styles.ownerText}><Text style={styles.labelText}>Fecha:</Text> {item.fecha}</Text>
        <Text style={styles.ownerText}><Text style={styles.labelText}>Estado:</Text> {item.estado}</Text>
        <Text style={styles.ownerText}><Text style={styles.labelText}>Número de Reporte:</Text> {item.numeroReporte}</Text>
        <Text style={styles.ownerText}><Text style={styles.labelText}>Tipos:</Text> {item.tipo}</Text>
      </TouchableOpacity>
    </View>
  </View>
  
  );
  const filteredCodes = accessCodes.filter(code => 
    activeTab === 'Correctivo' ? code.tipo === 'Correctivo' : code.tipo === 'Preventivo'
  );
  const closeModal = () => setModal({ ...modal, isVisible: false });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/(tabs)/Codigos')} style={styles.backButton}>
          <Image source={require("../../assets/images/back.png")} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerText}>
          Hoja de <Text style={{ fontWeight: '600' }}>Vida</Text>
        </Text>
      </View>
      
      <View style={styles.cajaparametros}>
        <Text style={styles.parametro}>Modelo: <Text style={styles.parametroinfo}>sdf</Text></Text>
        <Text style={styles.parametro}>Marca: <Text style={styles.parametroinfo}>sdf</Text></Text>
        <Text style={styles.parametro}>Serie: <Text style={styles.parametroinfo}>zfgzfg</Text></Text>
        <Text style={styles.parametro}>Ubicación: <Text style={styles.parametroinfo}>dfgz</Text></Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity onPress={() => setActiveTab('Preventivo')} style={[styles.tab, activeTab === 'Preventivo' && styles.activeTab]}>
          <Text style={[styles.tabText, activeTab === 'Preventivo' && styles.activeTabText]}>Preventivos</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('Correctivo')} style={[styles.tab, activeTab === 'Correctivo' && styles.activeTab]}>
          <Text style={[styles.tabText, activeTab === 'Correctivo' && styles.activeTabText]}>Correctivos</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredCodes.reverse()}
        renderItem={renderAccessCode}
        keyExtractor={(item) => item.numeroReporte.toString()}
        style={styles.codeList}
      />



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
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 30,
  },

  labelText: {
    fontWeight: '600', // Hace que el subtítulo esté en negrita
    color: '#03396e',
  },
  parametroinfo: {
    color: "rgba(0, 0, 0, 0.3)",
    fontFamily: "Kanit-Light",
    fontSize:18,
  },
  cajaparametros: {
    padding: "5%",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
    marginHorizontal:"auto"
  },
  parametro: {
    width: "50%",
    fontSize:17,
    fontWeight:'400',
    fontFamily: "Kanit-Light",
  },
  backIcon: {
    width: 35,
    height: 35,
    resizeMode: 'contain',
  },
  header: {
    marginTop: 30,
    marginBottom: 20,
  },
  headerText: {
    fontSize: 28,
    fontWeight: '300',
    color: '#050259',
    marginTop: "25%",
    marginLeft: '10%',
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

  },


  ownerText: {
    fontSize: 16,
    fontWeight: '300',
    color: '#000000',
    marginBottom: 4,
  },
  durationText: {
    fontSize: 14,
    color: '#001366',
  },
  deleteButton: {
    borderRadius: 20,
    padding: 5,
  },
  generateButton: {
    backgroundColor: '#001366',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    height: "10%",
    justifyContent: 'center',
    width: '100%',
  },
  generateButtonText: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: '300',
  },
  
  inactiveButton: {
    display: "none",
  },
  codeCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    marginHorizontal:"5%",
    elevation: 5,
    flexDirection: 'column',
  },  codeText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#34495E',
    marginBottom: 8,
  },

  activeCodeCard: {
    borderLeftWidth: 5,
    borderLeftColor: '#2ECC71', // Verde para indicar código activo
  },

  inactiveCodeCard: {
    borderLeftWidth: 5,
    borderLeftColor: '#E74C3C', // Rojo para indicar código inactivo
    // Para dar un efecto visual de inactividad
  },
  
});

export default CodesAccessScreen;
