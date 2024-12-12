import { useEffect, useState } from "react";
import { Alert, Button, Modal, Pressable } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native";
import { Icon } from "react-native-elements";
import axios from "axios";
import url from "@/constants/url.json";
import { router } from "expo-router";
interface Document {
  uri: string;
  name: string;
  size: number;
}
const Documentos = ({
  isModalDocumentVisible,
  setIsModalDocumentVisible,
  codigoHospital,
  shouldUploadDocuments,
  setShouldUploadDocuments,
  gotCodigo,
}) => {
  const [documents, setDocuments] = useState<Document[]>(
    new Array(5).fill({ uri: "", name: "", size: 0 })
  );
  const uploadDocument = async () => {
    console.log("Subiendo documentos...");
    setShouldUploadDocuments(false);
    try {
      const formData = new FormData();
      let validFileCount = 0; // Contador de archivos válidos

      documents.forEach((document, index) => {
        // Verificar si el documento existe y no está vacío
        if (document && document.uri) {
          formData.append("files", {
            uri: document.uri,
            name: documentNames[index] + ".pdf",
            type: "application/pdf",
          });
          validFileCount++; // Incrementa si el archivo es válido
        } else {
          console.log(
            `El documento en el índice ${index} está vacío o no existe.`
          );
        }
      });
      if (validFileCount > 0) {
        const response = await axios.post(
          `${url.url}/upload_multiple_pdfs/${codigoHospital}/${gotCodigo}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log(response.data);
        if (response.status === 200) {
          Alert.alert("Documentos subidos correctamente.");
          router.replace("/(tabs)/Perfil");
          console.log("Documentos subidos correctamente.");
        }
      } else {
        console.log("No hay documentos válidos para subir.");
      }
    } catch (error) {
      console.error(
        "Error al subir documentos:",
        error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    {
      documents.map((document, index) => {
        console.log("Documento " + index + ":");
        console.log(document.uri);
        console.log(document.name);
        console.log(document.size);
      });
    }
  }, [documents]);
  useEffect(() => {
    console.log(shouldUploadDocuments);
    console.log("Se estan subeindo los documentos ");
    console.log(codigoHospital, gotCodigo);
    if (shouldUploadDocuments) {
      console.log("Subiendo documentos");
      uploadDocument();
    }
  }, [shouldUploadDocuments]);
  const setDocument = (index: number, document: Document) => {
    const newDocuments = [...documents];
    newDocuments[index] = document;
    setDocuments(newDocuments);
  };
  const chooseDocument = async (index: number) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const document = result.assets[0];
        setDocument(index, document);
        console.log(document.uri);
        console.log(document.name);
        console.log(document.size);
      } else {
        console.log("No se selecciono ningun documento");
      }
    } catch (err) {
      console.error("Error al seleccionar documento:", err);
    }
  };
  const documentNames = [
    "Manual de uso",
    "Plan de mantenimiento",
    "Certificado de calibracion",
    "Protocolo de limpieza y desinfeccion",
    "Guia Rapida",
  ];

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isModalDocumentVisible}
      onRequestClose={() => setIsModalDocumentVisible(false)}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>
          Selecciona los documentos del equipo, si no se posee alguno de los
          documentos se puede omitir su seleccion.
        </Text>
        {documentNames.map((documentName, index) => (
          <View key={index} style={styles.viewDocument}>
            <Text
              style={{ fontSize: 20, fontWeight: "bold", flexShrink: 1 }}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {documentName}
            </Text>
            {documents[index].uri ? (
              <View
                style={{
                  width: "40%",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  overflow: "hidden",
                }}
              >
                <Pressable
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "rgba(255, 0, 0, 0.8)",
                    borderRadius: 10,
                    padding: 5,
                    elevation: 2,
                    marginLeft: 10,
                  }}
                  onPress={() =>
                    setDocument(index, { uri: "", name: "", size: 0 })
                  }
                >
                  <Icon name="delete" color="white" />
                </Pressable>
                <Text
                  style={{ fontSize: 14, color: "green", marginLeft: "2%" }}
                >
                  {documents[index].name}
                </Text>
              </View>
            ) : (
              <Pressable
                style={{
                  backgroundColor: "rgba(5, 2, 89, 1)",
                  borderRadius: 10,
                  padding: 10,
                  elevation: 2,
                }}
                onPress={() => chooseDocument(index)}
              >
                <Text style={{ fontSize: 16, color: "white" }}>
                  Seleccionar
                </Text>
              </Pressable>
            )}
          </View>
        ))}
        <View style={styles.footer}>
          <Pressable
            style={styles.button}
            onPress={() => setIsModalDocumentVisible(false)}
          >
            <Text style={styles.textStyle}>Guardar</Text>
          </Pressable>
          <Pressable
            style={{
              ...styles.button,
              backgroundColor: "red",
            }}
            onPress={() =>
              setDocuments(new Array(5).fill({ uri: "", name: "", size: 0 }))
            }
          >
            <Text style={styles.textStyle}>Borrar Documentos</Text>
          </Pressable>
        </View>
      </ScrollView>
    </Modal>
  );
};
export default Documentos;
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f8f8f8",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  footer: {
    position: "absolute",
    bottom: "5%",
    width: "100%",
    height: "18%",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: 10,
  },
  button: {
    width: "100%",
    height: "35%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(5, 2, 89, 1)",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginVertical: 5,
  },
  textStyle: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  viewDocument: {
    flexDirection: "row",
    height: "10%",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 10,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});
