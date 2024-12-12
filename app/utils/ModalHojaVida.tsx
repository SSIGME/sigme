import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Modal,
  ScrollView,
  Pressable,
  TouchableOpacity,
  Image,
} from "react-native";
import { CheckBox } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import { Dimensions } from "react-native";
import axios from "axios";
import url from "@/constants/url.json";
const { height, width } = Dimensions.get("window");
interface Componente {
  descripcion: string;
  cantidad: number;
}
const ModalHojaVida = ({
  visible,
  onClose,
  setShouldUploadData,
  shouldUploadData,
  gotCodigo,
  codigoHospital,
}) => {
  const [inputs, setInputs] = useState<string[]>([]);
  const [componentes, setComponentes] = useState<Componente[]>([]);
  const addInput = () => {
    setInputs((prevInputs) => [...prevInputs, ""]);
    setComponentes((prevComponentes) => [
      ...prevComponentes,
      { descripcion: "", cantidad: 0 },
    ]);
  };
  const removeInput = (index) => {
    setComponentes((prevComponentes) => [
      ...prevComponentes.slice(0, index),
      ...prevComponentes.slice(index + 1),
    ]);
    setInputs((prevInputs) => [
      ...prevInputs.slice(0, index),
      ...prevInputs.slice(index + 1),
    ]);
  };
  const [data, setData] = useState({
    invAct: "",
    servicio: "",
    ubicacion: "",
    registroSanitario: "",
    vidaUtil: "",
    tipoEquipo: "Fijo", // Valor por defecto como ejemplo
    formaAdquisicion: "",
    fabricante: "",
    fechaCompra: "",
    fechaOperacion: "",
    vencimientoGarantia: "",
    fuenteAlimentacion: "",
    voltajeMax: "",
    voltajeMin: "",
    potencia: "",
    frecuencia: "",
    corrienteMax: "",
    corrienteMin: "",
    temperatura: "",
    presion: "",
    otrosInstalacion: "",
    rangoVoltaje: "",
    rangoCorriente: "",
    rangoFrecuencia: "",
    rangoPresion: "",
    rangoPotencia: "",
    rangoTemperatura: "",
    rangoHumedad: "",
    otrosFuncionamiento: "",
    manuales: {
      operacion: false, // Checkbox ejemplo
      mantenimiento: false,
    },
    planos: {
      electronico: false,
      electrico: false,
      mecanico: false, // Checkbox ejemplo
    },
    clasificacionBiomedica: "", // Selección por defecto
    clasificacionRiesgo: "I", // Selección por defecto
    componentes: [],
    periodicidadMantenimiento: "Anual",
    requiereCalibracion: true, // Checkbox ejemplo
  });
  const handleInputComponenteChange = (index: number, value: string) => {
    setComponentes((prevComponentes) => {
      const newComponentes = [...prevComponentes];
      if (newComponentes[index]) {
        newComponentes[index].descripcion = value;
      }
      return newComponentes;
    });
  };
  const uploadHojaVida = async () => {
    console.log("Data a subir", data);
    console.log(url.url, gotCodigo, codigoHospital);
    try {
      const response = await fetch(
        `${url.url}/HojaVida/${gotCodigo}/${codigoHospital}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...data,
            hospital: codigoHospital,
          }),
        }
      );
      if (response.ok) {
        console.log("Data subida con éxito");
        const responseData = await response.json(); // Parsea la respuesta JSON si es necesario
        console.log(responseData); // Imprime la respuesta del servidor
      } else {
        console.log("Error al subir la data:", response.status);
      }
    } catch (error) {
      console.error("Error en la petición fetch:", error);
    }
  };
  const handleCantidadChange = (index: number, value: string) => {
    const updatedComponentes = [...componentes];
    updatedComponentes[index] = {
      ...updatedComponentes[index],
      cantidad: value ? parseInt(value, 10) : 0,
    };
    setComponentes(updatedComponentes);
  };
  const handleInputChange = (field, value) => {
    setData({ ...data, [field]: value });
  };
  const handlePressableChange = (section, field) => {
    setData((prevData) => ({
      ...prevData,
      [section]: {
        ...prevData[section],
        [field]: !prevData[section][field], // Cambia el valor de true a false y viceversa
      },
    }));
  };
  const handleCheckboxChange = (field, value) => {
    setData({ ...data, [field]: value });
  };

  const handleSubmit = () => {
    console.log(JSON.stringify(data, null, 2));
    setShouldUploadData(false);
    onClose();
  };
  useEffect(() => {
    console.log(shouldUploadData);
    console.log("se esta subiendo la data");
    console.log(codigoHospital, gotCodigo);
    if (shouldUploadData) {
      console.log("Subiendo data");
      uploadHojaVida();
    }
  }, [shouldUploadData]);
  useEffect(() => {
    setData((prevData) => ({
      ...prevData,
      componentes: componentes,
    }));
  }, [componentes]);

  useEffect(() => {
    console.log("Nuevo log");
    componentes.forEach((componente, index) => {
      console.log(
        `Componente ${index + 1}: Descripción - ${
          componente.descripcion
        }, Cantidad - ${componente.cantidad}`
      );
    });
  }, [componentes]);
  useEffect(() => {
    console.log("Nueva data", data);
  }, [data]);
  return (
    <Modal animationType="slide" transparent={false} visible={visible}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Hoja de Vida</Text>
        <Text style={styles.sectionTitle}>1. Identificación del equipo</Text>
        <TextInput
          style={styles.input}
          placeholder="INV/ACT"
          value={data.invAct}
          onChangeText={(text) => handleInputChange("invAct", text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Servicio"
          value={data.servicio}
          onChangeText={(text) => handleInputChange("servicio", text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Ubicación"
          value={data.ubicacion}
          onChangeText={(text) => handleInputChange("ubicacion", text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Registro Sanitario o PC"
          value={data.registroSanitario}
          onChangeText={(text) => handleInputChange("registroSanitario", text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Vida útil"
          value={data.vidaUtil}
          onChangeText={(text) => handleInputChange("vidaUtil", text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Tipo de equipo"
          value={data.tipoEquipo}
          onChangeText={(text) => handleInputChange("tipoEquipo", text)}
        />
        <Text style={styles.sectionTitle}>
          2. Registro historico del equipo
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Forma de adquisición"
          value={data.formaAdquisicion}
          onChangeText={(text) => handleInputChange("formaAdquisicion", text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Fabricante"
          value={data.fabricante}
          onChangeText={(text) => handleInputChange("fabricante", text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Fecha de compra"
          value={data.fechaCompra}
          onChangeText={(text) => handleInputChange("fechaCompra", text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Fecha de operación"
          value={data.fechaOperacion}
          onChangeText={(text) => handleInputChange("fechaOperacion", text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Vencimiento de garantía"
          value={data.vencimientoGarantia}
          onChangeText={(text) =>
            handleInputChange("vencimientoGarantia", text)
          }
        />
        <Text style={styles.sectionTitle}>
          3. Registro tecnico de instalacion
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Fuente de alimentación"
          value={data.fuenteAlimentacion}
          onChangeText={(text) => handleInputChange("fuenteAlimentacion", text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Voltaje máximo"
          value={data.voltajeMax}
          onChangeText={(text) => handleInputChange("voltajeMax", text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Voltaje mínimo"
          value={data.voltajeMin}
          onChangeText={(text) => handleInputChange("voltajeMin", text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Potencia"
          value={data.potencia}
          onChangeText={(text) => handleInputChange("potencia", text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Frecuencia"
          value={data.frecuencia}
          onChangeText={(text) => handleInputChange("frecuencia", text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Corriente máxima"
          value={data.corrienteMax}
          onChangeText={(text) => handleInputChange("corrienteMax", text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Corriente mínima"
          value={data.corrienteMin}
          onChangeText={(text) => handleInputChange("corrienteMin", text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Temperatura"
          value={data.temperatura}
          onChangeText={(text) => handleInputChange("temperatura", text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Presión"
          value={data.presion}
          onChangeText={(text) => handleInputChange("presion", text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Informacion adicional sobre instalacion"
          value={data.otrosInstalacion}
          onChangeText={(text) => handleInputChange("otrosInstalacion", text)}
        />
        <Text style={styles.sectionTitle}>
          4. Registro tenico de funcionamiento
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Rango de voltaje"
          value={data.rangoVoltaje}
          onChangeText={(text) => handleInputChange("rangoVoltaje", text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Rango de corriente"
          value={data.rangoCorriente}
          onChangeText={(text) => handleInputChange("rangoCorriente", text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Rango de frecuencia"
          value={data.rangoFrecuencia}
          onChangeText={(text) => handleInputChange("rangoFrecuencia", text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Rango de presión"
          value={data.rangoPresion}
          onChangeText={(text) => handleInputChange("rangoPresion", text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Rango de potencia"
          value={data.rangoPotencia}
          onChangeText={(text) => handleInputChange("rangoPotencia", text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Rango de temperatura"
          value={data.rangoTemperatura}
          onChangeText={(text) => handleInputChange("rangoTemperatura", text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Rango de humedad"
          value={data.rangoHumedad}
          onChangeText={(text) => handleInputChange("rangoHumedad", text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Informacion adicional sobre funcionamiento"
          value={data.otrosFuncionamiento}
          onChangeText={(text) =>
            handleInputChange("otrosFuncionamiento", text)
          }
        />
        <Text style={styles.sectionTitle}>
          5. Documentacion tecnica del equipo
        </Text>
        <View style={styles.checkboxContainer}>
          <Text>Manuales del equipo:</Text>
          <View style={styles.optionsdiv}>
            <View style={styles.option}>
              <Text style={styles.checkboxText}>Operación</Text>
              <TouchableOpacity
                onPress={() => handlePressableChange("manuales", "operacion")}
              >
                <Icon
                  name={data.manuales.operacion ? "check-square" : "square-o"}
                  size={24}
                  color="#0026ff"
                />
              </TouchableOpacity>
            </View>
            <View style={styles.option}>
              <Text style={styles.checkboxText}>Mantenimiento</Text>
              <TouchableOpacity
                onPress={() =>
                  handlePressableChange("manuales", "mantenimiento")
                }
              >
                <Icon
                  name={
                    data.manuales.mantenimiento ? "check-square" : "square-o"
                  }
                  size={24}
                  color="#0026ff"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={styles.checkboxContainer}>
          <Text >Planos del equipo:</Text>
          <View style={styles.optionsdiv}>
            <View style={styles.option}>
              <Text style={styles.checkboxText}>Electronico</Text>
              <TouchableOpacity
                onPress={() => handlePressableChange("planos", "electronico")}
              >
                <Icon
                  name={data.planos.electronico ? "check-square" : "square-o"}
                  size={24}
                  color="#0026ff"
                />
              </TouchableOpacity>
            </View>
            <View style={styles.option}>
              <Text style={styles.checkboxText}>Electrico</Text>
              <TouchableOpacity
                onPress={() => handlePressableChange("planos", "electrico")}
              >
                <Icon
                  name={data.planos.electrico ? "check-square" : "square-o"}
                  size={24}
                  color="#0026ff"
                />
              </TouchableOpacity>
            </View>
            <View style={styles.option}>
              <Text style={styles.checkboxText}>Mecanico </Text>
              <TouchableOpacity
                onPress={() => handlePressableChange("planos", "mecanico")}
              >
                <Icon
                  name={data.planos.mecanico ? "check-square" : "square-o"}
                  size={24}
                  color="#0026ff"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={styles.checkboxContainer}>
          <Text >Clasificacion de riesgo</Text>
          <View style={styles.optionsdiv}>
            <View style={styles.option}>
              <Text style={styles.checkboxText}>I</Text>
              <TouchableOpacity
                onPress={() => handleCheckboxChange("clasificacionRiesgo", "I")}
              >
                <Icon
                  name={
                    data.clasificacionRiesgo === "I"
                      ? "check-square"
                      : "square-o"
                  }
                  size={24}
                  color="#0026ff"
                />
              </TouchableOpacity>
            </View>
            <View style={styles.option}>
              <Text style={styles.checkboxText}>II</Text>
              <TouchableOpacity
                onPress={() =>
                  handleCheckboxChange("clasificacionRiesgo", "II")
                }
              >
                <Icon
                  name={
                    data.clasificacionRiesgo === "II"
                      ? "check-square"
                      : "square-o"
                  }
                  size={24}
                  color="#0026ff"
                />
              </TouchableOpacity>
            </View>
            <View style={styles.option}>
              <Text style={styles.checkboxText}>III</Text>
              <TouchableOpacity
                onPress={() =>
                  handleCheckboxChange("clasificacionRiesgo", "III")
                }
              >
                <Icon
                  name={
                    data.clasificacionRiesgo === "III"
                      ? "check-square"
                      : "square-o"
                  }
                  size={24}
                  color="#0026ff"
                />
              </TouchableOpacity>
            </View>
            <View style={styles.option}>
              <Text style={styles.checkboxText}>IV</Text>
              <TouchableOpacity
                onPress={() =>
                  handleCheckboxChange("clasificacionRiesgo", "IV")
                }
              >
                <Icon
                  name={
                    data.clasificacionRiesgo === "IV"
                      ? "check-square"
                      : "square-o"
                  }
                  size={24}
                  color="#0026ff"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={styles.checkboxContainer}>
          <Text>Clasificacion biomedica</Text>
          <View style={styles.optionsdiv}>
            <View style={styles.option}>
              <Text style={styles.checkboxText}>Diagnostica</Text>
              <TouchableOpacity
                onPress={() =>
                  handleCheckboxChange("clasificacionBiomedica", "Diagnostico")
                }
              >
                <Icon
                  name={
                    data.clasificacionBiomedica === "Diagnostico"
                      ? "check-square"
                      : "square-o"
                  }
                  size={24}
                  color="#0026ff"
                />
              </TouchableOpacity>
            </View>
            <View style={styles.option}>
              <Text style={styles.checkboxText}>Prevencion</Text>
              <TouchableOpacity
                onPress={() =>
                  handleCheckboxChange("clasificacionBiomedica", "Prevencion")
                }
              >
                <Icon
                  name={
                    data.clasificacionBiomedica === "Prevencion"
                      ? "check-square"
                      : "square-o"
                  }
                  size={24}
                  color="#0026ff"
                />
              </TouchableOpacity>
            </View>
            <View style={styles.option}>
              <Text style={styles.checkboxText}>Rehabilitacion</Text>
              <TouchableOpacity
                onPress={() =>
                  handleCheckboxChange(
                    "clasificacionBiomedica",
                    "Rehabilitacion"
                  )
                }
              >
                <Icon
                  name={
                    data.clasificacionBiomedica === "Rehabilitacion"
                      ? "check-square"
                      : "square-o"
                  }
                  size={24}
                  color="#0026ff"
                />
              </TouchableOpacity>
            </View>
            <View style={styles.option}>
              <Text style={styles.checkboxText}>Otros</Text>
              <TouchableOpacity
                onPress={() =>
                  handleCheckboxChange("clasificacionBiomedica", "Otros")
                }
              >
                <Icon
                  name={
                    data.clasificacionBiomedica === "Otros"
                      ? "check-square"
                      : "square-o"
                  }
                  size={24}
                  color="#0026ff"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <Text style={[styles.sectionTitle, { marginTop: "10%" }]}>
          6. Componentes y accesorios del equipo
        </Text>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "normal",
            textAlign: "center",
          }}
        >
          Componentes actuales: {inputs.length}
        </Text>
        {inputs.map((input, index) => (
          <View
            key={index}
            style={{
              height: height * 0.07,
              backgroundColor: "#f9f9f9",
              borderRadius: 10,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 5,
              elevation: 3,
              marginVertical: 20,
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginVertical: 10,
                paddingHorizontal: 10,
              }}
            >
              <TextInput
                style={styles.inputsmodal}
                placeholder={`Componente ${index + 1}`}
                value={componentes[index]?.descripcion}
                onChangeText={(text) =>
                  handleInputComponenteChange(index, text)
                }
              />
              <TextInput
                style={styles.inputsmodal}
                placeholder={`Cantidad`}
                keyboardType="numeric"
                value={componentes[index]?.cantidad.toString()}
                onChangeText={(text) => handleCantidadChange(index, text)}
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
          </View>
        ))}
        <Pressable
          style={{ justifyContent: "center", alignItems: "center" }}
          onPress={addInput}
        >
          <Image
            source={require("@/assets/images/add.png")}
            style={{ width: 40, height: 40, margin: "5%" }}
          />
        </Pressable>
        <Text style={styles.sectionTitle}>7. Mantenimiento y calibracion</Text>
        <View style={styles.checkboxContainer}>
            <Text style={{ marginLeft: "0%" }}>
            Periodicidad de{"\n"}mantenimiento
            </Text>
          <View
            style={{
              ...styles.optionsdiv,
              marginLeft: "2%",
            }}
          >
            <View style={styles.option}>
              <Text style={styles.checkboxText}>Anual</Text>
              <TouchableOpacity
                onPress={() =>
                  handleCheckboxChange("periodicidadMantenimiento", "Anual")
                }
              >
                <Icon
                  name={
                    data.periodicidadMantenimiento === "Anual"
                      ? "check-square"
                      : "square-o"
                  }
                  size={24}
                  color="#0026ff"
                />
              </TouchableOpacity>
            </View>
            <View style={styles.option}>
              <Text style={styles.checkboxText}>Semestral</Text>
              <TouchableOpacity
                onPress={() =>
                  handleCheckboxChange("periodicidadMantenimiento", "Semestral")
                }
              >
                <Icon
                  name={
                    data.periodicidadMantenimiento === "Semestral"
                      ? "check-square"
                      : "square-o"
                  }
                  size={24}
                  color="#0026ff"
                />
              </TouchableOpacity>
            </View>
            <View style={styles.option}>
              <Text style={styles.checkboxText}>Trimestral</Text>
              <TouchableOpacity
                onPress={() =>
                  handleCheckboxChange(
                    "periodicidadMantenimiento",
                    "trimestral"
                  )
                }
              >
                <Icon
                  name={
                    data.periodicidadMantenimiento === "Trimestral"
                      ? "check-square"
                      : "square-o"
                  }
                  size={24}
                  color="#0026ff"
                />
              </TouchableOpacity>
            </View>
            <View style={styles.option}>
              <Text style={styles.checkboxText}>Mensual</Text>
              <TouchableOpacity
                onPress={() =>
                  handleCheckboxChange("periodicidadMantenimiento", "Mensual")
                }
              >
                <Icon
                  name={
                    data.periodicidadMantenimiento === "Mensual"
                      ? "check-square"
                      : "square-o"
                  }
                  size={24}
                  color="#0026ff"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={styles.checkboxContainer}>
          <Text style={{ marginLeft: "0%" }}>Requiere calibración</Text>

          <View style={styles.optionsdiv}>
            <View style={styles.option}>
              <Text style={styles.checkboxText}>Si</Text>
              <TouchableOpacity
                onPress={() =>
                  handleCheckboxChange("requiereCalibracion", true)
                }
              >
                <Icon
                  name={data.requiereCalibracion ? "check-square" : "square-o"}
                  size={24}
                  color="#0026ff"
                />
              </TouchableOpacity>
            </View>
            <View style={styles.option}>
              <Text style={styles.checkboxText}>No</Text>
              <TouchableOpacity
                onPress={() =>
                  handleCheckboxChange("requiereCalibracion", false)
                }
              >
                <Icon
                  name={!data.requiereCalibracion ? "check-square" : "square-o"}
                  size={24}
                  color="#0026ff"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <Pressable
            style={{ ...styles.botton, backgroundColor: "rgba(5, 2, 89, 1)" }}
            onPress={handleSubmit}
          >
            <Text
              style={{
                color: "white",
                fontSize: 16,
                fontWeight: "bold",
              }}
            >
              Guardar
            </Text>
          </Pressable>
          <Pressable
            style={{ ...styles.botton, backgroundColor: "rgba(255, 0, 0, 1)" }}
            onPress={onClose}
          >
            <Text
              style={{
                color: "white",
                fontSize: 16,
                fontWeight: "bold",
              }}
            >
              Cerrar
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </Modal>
  );
};

export default ModalHojaVida;

const styles = StyleSheet.create({
  checkbutton: {
    alignItems: "center",
    justifyContent: "center",
    width: "20%",
    borderRadius: 10,
    backgroundColor: "blue",
    color: "white",
  },
  botton: {
    alignItems: "center",
    justifyContent: "center",
    width: "40%",
    height: 50,
    borderRadius: 10,
    color: "white",
  },
  inputsmodal: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    width: "40%",
  },
  deleteButton: {
    marginLeft: 10,
  },
  option: {
    padding: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  optionsdiv: {
    justifyContent: "space-around",
    flexWrap: "wrap",
    flexDirection: "row",
    width: "55%",
    backgroundColor: "rgba(166, 206, 252, 1)",
    borderRadius: 10,
    marginVertical: "5%",
  },
  checkboxText: {
    fontSize: 16,
  },
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  checkboxContainer: {
    justifyContent: "space-between",
    height: height * 0.1,
    flexDirection: "row",
    alignItems: "center",
    marginVertical: "5%",
  },
  buttonContainer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
