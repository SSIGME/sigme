import React from "react";
import { View, Text, StyleSheet, TouchableOpacity,Image } from "react-native";
import Modal from "react-native-modal";
import { AntDesign } from "@expo/vector-icons";

interface CustomModalProps {
  isVisible: boolean;
  message: string;
  title: string;
  type: "success" | "error" | "warning";
  onClose: () => void;
  onConfirm: () => void;
}

const CustomModal: React.FC<CustomModalProps> = ({
  isVisible,
  message,
  type,
  onClose,
  onConfirm,
  title,
}) => {
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      backdropTransitionOutTiming={0}
    >
      <View
        style={[
          styles.modalContainer,
          type === "success" && styles.successModal,
          type === "error" && styles.errorModal,
        ]}
      >
        {type === "success" && (
          <AntDesign name="checkcircle" size={35} color="#44d644" />
        )}
        {type === "error" && (
          <AntDesign name="closecircle" size={35} color="red" />
        )}
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.modalText}>{message}</Text>
        <TouchableOpacity
          style={[
            styles.button,
            type === "success" && styles.successButton,
            type === "error" && styles.errorButton,
            type === "warning" && styles.warningButton,
          ]}
          onPress={onClose}
        >
          <Text style={styles.buttonText}>
           Cerrar
          </Text>
        </TouchableOpacity  >
        <TouchableOpacity   onPress={onClose} style={styles.imageC}>
        <Image style={styles.image} source={require("../../assets/images/x.png")}/>
         </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: "#f2f7ff",
    paddingTop:"12%",
    padding: 20,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#0099ff",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 10,
    marginHorizontal:"8%"
  },
  modalText: {
    fontSize: 19,
    marginTop: "4%",
    color: "#000000",
    fontWeight: "300",
    marginBottom: "13%",
    textAlign: "center",
    width: "90%",
  },
  title:{    fontSize: 23,
    marginTop: "5%",
    color: "#06264b",
    fontWeight: "600",
   
    textAlign: "center",
    width: "90%",},
  successModal: {
    backgroundColor: "#f2f7ff",
  },
  errorModal: {
    backgroundColor: "#ffffff",
  },
  button: {
    paddingVertical: 13,
    paddingHorizontal: 60,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 0,
    marginBottom:'3%',
    backgroundColor: "#050259",
  },
  successButton: {
    backgroundColor: "#050259",
  },
  errorButton: {
    backgroundColor: "#050259",
  },
  warningButton: {
    backgroundColor: "#ffe605",
  },
  buttonText: {
    color: "white",
    fontSize: 17,
    fontWeight: "300",
  },
  image:{

    width:'100%',
    resizeMode:"contain"
  },
    imageC:{
        position:"absolute",
        top:-20,
        right:20,
        width:'10%',
        resizeMode:"contain"
      }
});

export default CustomModal;
