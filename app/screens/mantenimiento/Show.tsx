import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";

const Show = () => {
  const { respuestas: respuestasParam } = useLocalSearchParams();
  const respuestas = respuestasParam ? JSON.parse(respuestasParam) : [];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Aquí están las respuestas:</Text>
      {respuestas.map((respuesta, index) => (
        <Text key={index} style={styles.answerText}>
          {`Pregunta ${respuesta.id}: ${respuesta.respuesta}`}
        </Text>
      ))}
    </View>
  );
};

export default Show;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  answerText: {
    fontSize: 16,
    marginVertical: 5,
  },
});
