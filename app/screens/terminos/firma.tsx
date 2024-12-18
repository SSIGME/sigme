import React, { useState } from 'react';
import { View, StyleSheet, Alert, Dimensions, TouchableOpacity, Text } from 'react-native';
import { Svg, Path } from 'react-native-svg';
import axios from "axios";
import url from "@/constants/url.json";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const { height, width } = Dimensions.get('window');

export default () => {
  const router = useRouter();
  const [paths, setPaths] = useState([]);
  const [currentPath, setCurrentPath] = useState([]);

  const onTouchEnd = () => {
    if (currentPath.length > 0) {
      const newPaths = [...paths, currentPath];
      setPaths(newPaths);
      setCurrentPath([]);
    }
  };

  const onTouchMove = (event) => {
    const locationX = event.nativeEvent.locationX;
    const locationY = event.nativeEvent.locationY;
    const newPoint = `${currentPath.length === 0 ? 'M' : 'L'}${locationX.toFixed(1)},${locationY.toFixed(1)} `;
    setCurrentPath((prevPath) => [...prevPath, newPoint]);
  };

  const handleClearButtonClick = () => {
    setPaths([]);
    setCurrentPath([]);
  };

  const handleContinueButtonClick = async () => {
    try {
      const svgData = paths.map(path => path.join('')).join(' ');
      const codigoHospital = await AsyncStorage.getItem("codigoHospital");
      const codigo = await AsyncStorage.getItem("codigo");

      // Crear el objeto con los datos
      const data = {
        firma: `${svgData}`,
        codigo: codigo,
        codigoHospital: codigoHospital,
      };

      // Obtener el token de acceso
      const token = await AsyncStorage.getItem("access_token");
      if (!token) {
        throw new Error('Token de acceso no encontrado');
      }

      const response = await axios.post(`${url.url}/user/firma`, data, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      // Mostrar el mensaje de éxito
      Alert.alert('Success', response.data.msg);
      router.push("/(tabs)/Areas");

    } catch (error) {
      // Manejar el error de manera más robusta
      const errorMessage = error.response
        ? error.response.data.msg
        : error.message || 'Error al crear el técnico';

      Alert.alert('Error', errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.svgContainer} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
        <Svg height={height * 0.9} width={width * 0.75}>
          {paths.map((path, index) => (
            <Path
              key={`path-${index}-${Math.random()}`}
              d={path.join('')}
              stroke="#000000"
              fill="transparent"
              strokeWidth={2}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          ))}
          <Path
            key="currentPath"
            d={currentPath.join('')}
            stroke="#000000"
            fill="transparent"
            strokeWidth={2}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </Svg>
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={handleClearButtonClick}>
          <Text style={styles.buttonText}>Limpiar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleContinueButtonClick}>
          <Text style={styles.buttonText}>Continuar</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.labelText}>Dibuja tu Firma Aquí</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#050259',
    height: height,
    width: width,
  },
  svgContainer: {
    height: height * 0.9,
    width: width * 0.65,
    marginRight: '10%',
    marginBottom: "-10%",
    backgroundColor: '#fdfbe8',
    borderRadius: 15,
  },
  buttonsContainer: {
    flexDirection: 'column',
    position: 'absolute',
    bottom: '10%',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: '100%',
    left: "38%",
    gap: 100,
  },
  button: {
    backgroundColor: '#F2F2F2',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 30,
    marginHorizontal: 10,
    transform: [{ rotate: '90deg' }],
  },
  buttonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '300',
    textAlign: 'center',
  },
  labelText: {
    position: 'absolute',
    right: "-10%",
    top: "20%",
    color: 'white',
    fontWeight: '100',
    fontSize: 21,
    transform: [{ rotate: '-270deg' }],
  },
});
