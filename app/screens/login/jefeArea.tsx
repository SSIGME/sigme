import React, { useState, useRef, useEffect } from 'react';
import { SafeAreaView ,View, Text, StatusBar,TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';


const JefeAreaLoginScreen = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // State for the three inputs of the "Código"
  const [code1, setCode1] = useState('');
  const [code2, setCode2] = useState('');
  const [code3, setCode3] = useState('');
  const [code4, setCode4] = useState('');
  const code1Ref = useRef(null);
  const code2Ref = useRef(null);
  const code3Ref = useRef(null);
  const code4Ref = useRef(null);
  // Function to handle input change and focus movement
  const handleCode1Change = (text) => {
    setCode1(text.toUpperCase());
    if (text.length === 1) {
      code2Ref.current.focus(); // Move to the second input
    }
  };

  const handleCode2Change = (text) => {
    setCode2(text.toUpperCase());
    if (text.length === 1) {
      code3Ref.current.focus(); // Move to the third input
    } else if (text.length === 0) {
      code1Ref.current.focus(); // Move back to the first input if deleting
    }
  };

  const handleCode3Change = (text) => {
    setCode3(text.toUpperCase());
    if (text.length === 1) {
      code4Ref.current.focus(); // Move back to the second input if deleting
    } else if (text.length === 0) {
      code2Ref.current.focus(); // Move back to the first input if deleting
    }
  };

  const handleCode4Change = (text) => {
    setCode4(text.toUpperCase());
    if (text.length === 0) {
      code3Ref.current.focus(); // Move back to the second input if deleting
    }
  };



  const handleLogin = () => {
    // Combine the code inputs into one string if needed
    const hospitalCode = `${code1}${code2}${code3}`;
    
    console.log('Logging in with:', { username, password, hospitalCode });
    router.push('/dashboard'); // Example screen
  };

  return (
    <SafeAreaView style={styles.container}>
       <StatusBar barStyle="light-content" backgroundColor="#6E7DD0" /> 
      <View style={styles.topContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Image tintColor={"white"} source={require("../../../assets/images/back.png")} style={styles.backButton}></Image>
        </TouchableOpacity>
        
        <View style={{ height: "100%", flexDirection: "row", paddingHorizontal: "5%" }}>
          <Image source={require('../../../assets/images/jefeArea.png')} style={styles.image} />
          <Text style={styles.title}>Jefe de{"\n"}Area</Text>
        </View>
      </View>

      <View style={styles.formContainer}>
        {/* Input fields */}
        <Text style={styles.label}>Ingresa tu código {"\n"}<Text style={[styles.label, { fontWeight: 'bold' }]}>asignado</Text></Text>

        {/* Código del hospital */}
        <View style={styles.codeInputContainer}>
        <TextInput
        style={styles.codeInput}
        ref={code1Ref} // Reference to the first input
        maxLength={1}
        value={code1}
        onChangeText={handleCode1Change}
        keyboardType="default"
        placeholder="-"
        placeholderTextColor="#888"
      />
      <TextInput
        style={styles.codeInput}
        ref={code2Ref}  // Reference to the second input
        maxLength={1}
        value={code2}
        onChangeText={handleCode2Change}
        keyboardType="default"
        placeholder="-"
        placeholderTextColor="#888"
      />
      <TextInput
        style={styles.codeInput}
        value={code3}
        onChangeText={handleCode3Change}
        keyboardType="default"
        placeholder="-"
        placeholderTextColor="#888"
      />
        <TextInput
        style={styles.codeInput}
        ref={code4Ref}  // Reference to the third input
        maxLength={1}
        value={code4}
        onChangeText={handleCode4Change}
        keyboardType="default"
        placeholder="-"
        placeholderTextColor="#888"
      />
        </View>
        <Text style={styles.hospitalCodeLabel}>Código del hospital</Text>

        <TextInput
          style={styles.input}
          placeholder="Código de mantenimiento"
          value={username}
          onChangeText={setUsername}
          placeholderTextColor="#888"
        />
   
        {/* Login button */}
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Iniciar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFC',
    height: "100%",
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 10,
    width: 38,
    height: 20,
  },
  image: {
    width: "40%",
    height: "80%",
    marginBottom: 0,
    marginTop: "auto",
  },
  title: {
    fontSize: 27,
    fontWeight: 'bold',
    marginBottom: "12%",
    marginLeft: "10%",
    color: '#ffffff',
    marginTop: "auto",
  },
  label: {
    fontSize: 22,
    color: '#050259',
    marginBottom: "4%",
    marginTop: '20%',
    fontWeight: "300",
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#D6D7F2',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 18,
  },
  codeInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 10,
    width:'65%',
    marginLeft:'auto',
    marginRight:'auto',
  },
  codeInput: {
    width: 50,
    height: 50,

    borderRadius: 5,
    textAlign: 'center',
    borderBottomColor:'black',
    borderBottomWidth:1.4,
    fontSize: 24,
  },
  hospitalCodeLabel: {
    textAlign: 'center',
    fontSize: 18,
    color: '#888',
    marginBottom: "10%",
    fontWeight:"200"
  },
  loginButton: {
    backgroundColor: '#001366',
    width: '60%',
    marginRight:'auto',
    marginLeft:"auto",
    padding: 15,
    marginTop:"5%",
    borderRadius: 10,
    alignItems: 'center',
  },
  loginButtonText: {
    fontSize: 20,
    color: '#FFF',
    fontWeight: '300',
  },
  topContainer: {
    backgroundColor: '#6E7DD0',
    height: "35%",
    borderBottomLeftRadius: 23,
    borderBottomRightRadius: 23,
  },
  formContainer: {
    paddingHorizontal: '10%',
  },
});

export default JefeAreaLoginScreen;
