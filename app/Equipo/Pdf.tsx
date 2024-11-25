import React, { useState, useEffect, useRef } from 'react';
import { WebView } from 'react-native-webview';
import { StyleSheet, Text, View,TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

export default function App() {
  const webViewRef = useRef(null);
  const { reporte, url } = useLocalSearchParams();
  const parsedReporte = reporte ? JSON.parse(reporte) : {};
  const [htmlContent, setHtmlContent] = useState('');

  // Función para generar y compartir el PDF
  const handleGeneratePDF = async () => {
    try {
      // Enviar el reporte a la API mediante una solicitud POST
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parsedReporte), // Convertir el reporte a JSON
      });

      if (!response.ok) {
        throw new Error(`Error al obtener HTML: ${response.statusText}`);
      }

      // Obtener el HTML devuelto por la API
      const html = await response.text();

      // Estilos CSS que se van a agregar
      const styles = `
        <style>
          body {
            transform: scale(1);
            transform-origin: top left;
            width: 100%;
          }
        </style>
      `;

      // Concatenar los estilos con el HTML
      const modifiedHtml = styles + html;

      console.log(modifiedHtml);

      // Crear el PDF y obtener su URI
      const { uri } = await Print.printToFileAsync({ html: modifiedHtml });

      // Compartir el archivo generado
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      } else {
        Alert.alert('Error', 'La funcionalidad de compartir no está disponible en este dispositivo.');
      }

      Alert.alert('PDF generado', 'El archivo PDF se ha creado y compartido correctamente.');
    } catch (error) {
      console.error('Error al generar el PDF:', error);
      Alert.alert('Error', 'No se pudo generar el archivo PDF.');
    }
  };

  useEffect(() => {
    const fetchHtmlContent = async () => {
      try {
        // Realiza una solicitud POST para obtener el HTML
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(parsedReporte), // Enviar el reporte como JSON
        });

        if (!response.ok) {
          throw new Error(`Error al obtener HTML: ${response.statusText}`);
        }

        const html = await response.text();
        setHtmlContent(html); // Almacena el HTML recibido
      } catch (error) {
        console.error('Error al obtener HTML:', error);
        Alert.alert('Error', 'No se pudo obtener el contenido HTML.');
      }
    };

    fetchHtmlContent();
  }, [url, reporte]);

  return (
    <View style={styles.container}>
      {htmlContent ? (
        <WebView
          ref={webViewRef}
          style={styles.webview}
          originWhitelist={['*']}
          source={{ html: htmlContent }} // Usa el HTML cargado
        />
      ) : (
        <Text>Cargando...</Text> // Mostrar mensaje de carga mientras obtienes el HTML
      )}
      <TouchableOpacity style={styles.button} onPress={handleGeneratePDF}>
        <Text style={styles.buttonText}>Generar PDF</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: '20%',
    justifyContent: 'center', // Puedes ajustar esto según lo que desees
    position: 'relative', // Esto es importante para posicionar el botón correctamente
  },
  webview: {
    flex: 1,
    paddingBottom: '20%',
  },
  button: {
    position: 'absolute',
    bottom: 0, // Ajusta la distancia desde el fondo
    left: 0, // Opcional, para centrar el botón
    right: 0, // Opcional, para centrar el botón
    backgroundColor: '#050259',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99,
    borderRadius: 0, // Para bordes redondeados en el botón
  },
  buttonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '200',
  },
});
