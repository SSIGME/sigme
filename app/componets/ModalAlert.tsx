import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Modal } from "react-native";

interface ModalAlertProps {
  visible: boolean;
  message: string;
  hideModal: () => void;
}

const ModalAlert: React.FC<ModalAlertProps> = ({
  visible,
  message,
  hideModal,
}) => {
  return (
    <View>
      <Modal visible={visible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.messageText}>{message}</Text>
            <Text style={styles.statusText}></Text>
            <Pressable
              style={{
                backgroundColor: "#050259",
                width: "100%",
                alignItems: "center",
                borderRadius: 5,
              }}
              onPress={hideModal}
            >
              <Text
                style={{
                  color: "#fff",
                  fontSize: 16,
                  padding: 10,
                  borderRadius: 5,
                }}
              >
                Cerrar
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    justifyContent: "center",
    width: "80%",
    backgroundColor: "#F2F2F2",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  messageText: {
    textAlign: "center",
    fontSize: 18,
    marginBottom: 10,
  },
  statusText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 20,
  },
});

export default ModalAlert;
