
import React, { useEffect , useState} from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, FlatList, SafeAreaView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import SigmeModal from "@/app/componets/SigmeModal";
import url from "@/constants/url.json";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
const CodesAccessScreen = () => {

  const { tipo, marca, modelo,  HojaVida, codigoIdentificacion,serie, area, Imagen } = useLocalSearchParams();
  const [modal, setModal] = useState({
    isVisible: false,
    title: "",
    message: "",
    type: "success"
  });
  const [activeTab, setActiveTab] = useState('preventivo');
  const [equipo, setEquipo] = useState([
 
  ]);

  const renderEquipo = ({ item }) => (
    <View style={[styles.codeCard, item.tipoMantenimiento === "preventivo" ? styles.activeCodeCard : styles.inactiveCodeCard]}>
      <View style={{ gap: 4 }}>
        <TouchableOpacity        onPress={() => {
          router.push({
            pathname: "/screens/mantenimiento/Preview",
            params: {
              tipo,
              marca,
              modelo,
              serie,
              area,
              codigoIdentificacion,
              respuestas: JSON.stringify(equipo.respuestas),
            },
          });
        }}>
          <Text style={styles.ownerText}><Text style={styles.labelText}>Técnico:</Text> {item.tecnico}</Text>
          <Text style={styles.ownerText}><Text style={styles.labelText}>Ubicación:</Text> {area}</Text>
          <Text style={styles.ownerText}><Text style={styles.labelText}>Fecha:</Text> {item.fecha}</Text>
          <Text style={styles.ownerText}>
  <Text style={styles.labelText}>Estado:</Text>{' '}
  {item.finished
    ? item.firmadoPorRecibidor
      ? 'Completado'
      : 'Requiere firma de jefe de área'
    : 'Mantenimiento incompleto'}
</Text>

          <Text style={styles.ownerText}><Text style={styles.labelText}>Número de Reporte:</Text> {item.idMantenimiento}</Text>
          <Text style={styles.ownerText}><Text style={styles.labelText}>Tipo:</Text> {item.tipoMantenimiento}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
 

  useEffect(() => {
    console.log(JSON.parse(HojaVida))
  }, []);
  const closeModal = () => setModal({ ...modal, isVisible: false });
  
  const filteredCodes = Array.isArray(JSON.parse(HojaVida))
  ? JSON.parse(HojaVida).filter(equipo => 
      activeTab === 'correctivo' ? equipo.tipoMantenimiento === 'correctivo' : equipo.tipoMantenimiento === 'preventivo'
    )
  : [];


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Image source={require("@/assets/images/back.png")} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerText}>
          Hoja de <Text style={{ fontWeight: '600' }}>Vida</Text>
        </Text>
      </View>
      
      <View style={styles.fototipo}>
        {Imagen === "" ? (
          <Image
            source={require("@/assets/images/tenso.jpg")}
            style={styles.image}
          />
        ) : (
          <Image
            style={styles.image}
            source={{ uri: Array.isArray(Imagen) ? Imagen[0] : Imagen }}
          />
        )}
      </View>

      <View style={styles.cajaparametros}>
        <Text style={styles.parametro}>Modelo: <Text style={styles.parametroinfo}>{modelo}</Text></Text>
        <Text style={styles.parametro}>Marca: <Text style={styles.parametroinfo}>{marca}</Text></Text>
        <Text style={styles.parametro}>Serie: <Text style={styles.parametroinfo}>{serie}</Text></Text>
        <Text style={styles.parametro}>Ubicación: <Text style={styles.parametroinfo}>{area}</Text></Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity onPress={() =>  {    setActiveTab('preventivo'); 
  console.log(equipo)
}} style={[styles.tab, activeTab === 'preventivo' && styles.activeTab]}>
          <Text style={[styles.tabText, activeTab === 'preventivo' && styles.activeTabText]}>Preventivos</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('correctivo')} style={[styles.tab, activeTab === 'correctivo' && styles.activeTab]}>
          <Text style={[styles.tabText, activeTab === 'correctivo' && styles.activeTabText]}>Correctivos</Text>
        </TouchableOpacity>
       
      </View>

      <FlatList
        data={filteredCodes}
        renderItem={renderEquipo}
        keyExtractor={(item) => item.idMantenimiento}
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
           <TouchableOpacity
          onPress={() => {
            router.push({
              pathname: "Equipo/Pdf",
              params: {
                url: `${url.url2}/equipoDetail/${codigoHospital}/${codigoIdentificacion}`,
              },
            });
            console.log(`${url.url2}/equipoDetail/${codigoHospital}/${codigoIdentificacion}`)
          }}
          style={styles.boton}
        >
          <Text style={styles.botonTexto}>Ver documento</Text>
        </TouchableOpacity>
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
  fototipo: {
    width: "40%",
    height: "20%",
    marginHorizontal:"auto",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 20,
  },
  labelText: {
    fontWeight: '600',
    color: '#03396e',
  },
  parametroinfo: {
    color: "rgba(0, 0, 0, 0.3)",
    fontFamily: "Kanit-Light",
    fontSize: 18,
    marginHorizontal: "auto",
  },
  cajaparametros: {
    paddingHorizontal: "5%",
    justifyContent: "center",
    alignItems: "center",
    alignSelf:"center",
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
    marginHorizontal: "auto",
    textAlign:"center",
  },
  parametro: {
    width: "50%",
    fontSize: 17,
    fontWeight: '400',

    fontFamily: "Kanit-Medium",
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
    flexWrap:"wrap",
    gap:0,
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
    flexGrow: 3,
    marginBottom:50
  },
  ownerText: {
    fontSize: 16,
    fontWeight: '300',
    color: '#000000',
    marginBottom: 4,
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
    marginHorizontal: "5%",
    elevation: 5,
    flexDirection: 'column',
  },
  activeCodeCard: {
    borderLeftWidth: 5,
    borderLeftColor: '#2ECC71',
  },
  inactiveCodeCard: {
    borderLeftWidth: 5,
    borderLeftColor: '#052386',
  },
  boton: {
    backgroundColor: "#050259",
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 0,
    marginBottom: 0,
    bottom: 0,
    width:'100%',
    position: "absolute",
    margin: 0, // Spacing between buttons
  },
  botonTexto: {
    color: "#fff",
    fontSize: 18,
    textAlign:"center",
    fontFamily: "Kanit-Regular",
  },
});

export default CodesAccessScreen;
