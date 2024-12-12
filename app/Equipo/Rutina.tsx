import {
  StyleSheet,
  Text,
  View,
  Modal,
  Pressable,
  Image,
  ScrollView,
  TextInput,
} from "react-native";
import { Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");
import React, { useState } from "react";
import { CheckBox } from "react-native-elements";

const Rutina = ({
  isModalQuestionsVisible,
  setIsModalQuestionsVisible,
  inputs,
  deleteOption,
  addInput,
  addOption,
  handleInputChange,
  removeInput,
  preguntas,
  updateTipoPregunta,
  setPreguntas,
}) => {
  return (
    <Modal
      onRequestClose={() => {
        setIsModalQuestionsVisible(!isModalQuestionsVisible);
      }}
      animationType="slide"
      transparent={true}
      visible={isModalQuestionsVisible}
    >
      <View style={styles.overlay}>
        <View style={styles.modalView}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              marginBottom: "5%",
              textAlign: "center",
            }}
          >
            Ingresa las preguntas para la rutina
          </Text>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "normal",
              textAlign: "center",
            }}
          >
            Preguntas actuales: {inputs.length}
          </Text>
          <Pressable
            style={{ justifyContent: "center", alignItems: "center" }}
            onPress={addInput}
          >
            <Image
              source={require("@/assets/images/add.png")}
              style={{ width: 40, height: 40, margin: "5%" }}
            />
          </Pressable>
              <ScrollView
              showsVerticalScrollIndicator={false}
              style={{
                width: "100%",
                flexDirection: "column",
                borderRadius: 10,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                padding: 10,
              }}
              >
            {inputs.map((input, index) => (
              <View
                key={index}
                style={{
                  height: "auto",
                  width: "100%",
                  flexDirection: "column",
                  marginBottom: preguntas[index]?.tipo === "cerrada" ? 10 : 10,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: "#ccc", // Borde suave
                  backgroundColor: "#fff", // Fondo claro
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.1,
                  shadowRadius: 6,
                  elevation: 5, // Sombra para Android
                  marginVertical: 10,
                  paddingHorizontal: 15, // Espaciado interno
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginVertical: 10,
                    paddingHorizontal: 10,
                  }}
                >
                  <TextInput
                    style={styles.inputsmodal}
                    placeholder={`Ingresa la pregunta número ${index + 1}`}
                    value={input}
                    onChangeText={(text) => handleInputChange(text, index)}
                  />
                  <Pressable
                    style={styles.deleteButton}
                    onPress={() => removeInput(index)}
                  >
                    <Image
                      source={require("@/assets/images/delete.png")}
                      style={{ width: 30, height: 30 }}
                    />
                  </Pressable>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <CheckBox
                    checked={preguntas[index]?.tipo === "abierta"}
                    onPress={() => updateTipoPregunta(index, "abierta")}
                  />
                  <Text>Abierta</Text>

                  <CheckBox
                    checked={preguntas[index]?.tipo === "cerrada"}
                    onPress={() => updateTipoPregunta(index, "cerrada")}
                  />
                  <Text>Cerrada</Text>
                </View>
                {preguntas[index]?.tipo === "cerrada" && (
                  <View
                    style={{
                      width: "100%",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {preguntas[index]?.opciones.map((opcion, i) => (
                      <View
                        key={i}
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginVertical: 20,
                          paddingHorizontal: 10,
                        }}
                      >
                        <TextInput
                          style={styles.inputsmodal}
                          placeholder={`Ingresa la opcion de respuesta`}
                          value={opcion}
                          onChangeText={(text) =>
                            setPreguntas((prevState) => {
                              const newPreguntas = [...prevState];
                              newPreguntas[index].opciones[i] = text;
                              return newPreguntas;
                            })
                          }
                        />
                        <Pressable
                          style={styles.deleteButton}
                          onPress={() => deleteOption(index, i)}
                        >
                          <Image
                            source={require("@/assets/images/delete.png")}
                            style={{ width: 30, height: 30 }}
                          />
                        </Pressable>
                      </View>
                    ))}
                    <Pressable
                      style={{
                        width: "50%",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "#2C37FF",
                        borderRadius: 10,
                        padding: 10,
                        marginVertical: 10,
                      }}
                      onPress={() => addOption(index)}
                    >
                      <Text
                        style={{
                          fontWeight: "bold",
                          textAlign: "center",
                          fontSize: 16,
                          color: "#fff",
                        }}
                      >
                        Anadir opcion de respuesta
                      </Text>
                    </Pressable>
                  </View>
                )}
              </View>
            ))}
          </ScrollView>
        </View>
        <Pressable
          style={[styles.modalboton]}
          onPress={() => setIsModalQuestionsVisible(!isModalQuestionsVisible)}
        >
          <Text style={{ fontWeight: "bold", fontSize: 22, color: "white" }}>
            Guardar
          </Text>
        </Pressable>
      </View>
    </Modal>
  );
};

export default Rutina;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Fondo semitransparente
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    display: "flex",
    height: height * 0.85,
    width: width * 0.9,
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingTop: "5%",
    paddingLeft: "5%",
    paddingRight: "5%",
    paddingBottom: "0%",
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
  inputsmodal: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    width: "90%",
  },
  deleteButton: {
    marginLeft: 10,
  },
  modalboton: {
    justifyContent: "center",
    alignItems: "center",
    width: "80%",
    height: "6%",
    position: "absolute",
    bottom: "0%",
    backgroundColor: "rgba(5, 2, 89, 1)",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
});
