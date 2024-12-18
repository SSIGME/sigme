import {
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import PdfView from "react-native-pdf";
import { useLocalSearchParams } from "expo-router";
import { Dimensions } from "react-native";
import * as FileSystem from "expo-file-system";
import { shareAsync } from "expo-sharing";
import axios from "axios";
const Pdf = () => {
  const { url } = useLocalSearchParams();
  const save = async (uri: string) => {
    shareAsync(uri);
  }
  const [documentUrl, setDocumentUrl] = useState({ uri: "", cache: true });
  const downloadDocument = async (url: string) => {
    const fileName = "blank.pdf";
    const result = await FileSystem.downloadAsync(
      'https://storage.googleapis.com/sigme-resources/GCIW/GCIW-81W7-E33C/GCIW-81W7-E33C-Certificado_de_calibracion.pdf?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=userviewer%40master-scanner-436213-u1.iam.gserviceaccount.com%2F20241218%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241218T215231Z&X-Goog-Expires=900&X-Goog-SignedHeaders=host&X-Goog-Signature=8a9401cea01c886c26ba6fa84232c973b2eada7f7116b002618e96dcbabe2cceded4c8ea995f06ae36ae8487c05c5d53af894f93ae1b78051244f7c896f011ba1d087d532e7ecab2cb9a5ca4e8d43c429c0f0f7bc0f272179dc3624605290d9068312649b9577c3518064b63ccbb9656a7902dde8593caa9ace502535bce48c21bd25b1f3d970a2e409db2c48cdab9abcafdcf260b75b18acee6e5254c7711539e5923fcfd9315c58f69290f967b4959f91058444baa24e2901052b4e6ad093a06f8419f4a66f20c660ebdc635bc7926326f36a2b394e1f5ff044312c409abec5abff86b0282757116e635a7fda0e461e4cab0f09cc3e60119d8c4e46fd8eb05',
      FileSystem.documentDirectory + fileName
    );
    save(result.uri);
    console.log(result); 
  };
  const getDocument = async (url: string) => {
    try {
      const response = await axios.get(url);
      setDocumentUrl({ uri: response.data.url, cache: false });
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getDocument(url);
  }, []);
  useEffect(() => {
    console.log("El proyecto se esta actualizando", documentUrl);
    console.log(
      documentUrl.uri ? "URI EN DOCUMENT URL " + documentUrl.uri : "No hay url"
    );
  }, [documentUrl]);
  return (
    <View
      style={{
        flex: 1,
      }}
    >
      {documentUrl.uri ? (
        <View
          style={{
            flex: 1,
          }}
        >
          <Pressable
            style={{
              backgroundColor: "blue",
              padding: 10,
              margin: 10,
              borderRadius: 10,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => {
              downloadDocument(documentUrl.uri);
              console.log("Presionado");
            }}
          >
            <Text
              style={{
                fontSize: 20,
                textAlign: "center",
                color: "white",
              }}
            >
              Descargar
            </Text>
          </Pressable>
          {/*           <PdfView
            trustAllCerts={false}
            source={documentUrl}
            style={styles.pdf}
            onLoadComplete={(numberOfPages, filePath) => {
              console.log(`Number of pages: ${numberOfPages}`);
            }}
            onPageChanged={(page, numberOfPages) => {
              console.log(`Current page: ${page}`);
            }}
            onError={(error) => {
              console.log(error);
            }}
            onPressLink={(uri) => {
              console.log(`Link pressed: ${uri}`);
            }}
          /> */}
        </View>
      ) : (
        <View>
          <Text>El documento no esta disponible</Text>
        </View>
      )}
    </View>
  );
};

export default Pdf;

const styles = StyleSheet.create({
  pdf: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});
