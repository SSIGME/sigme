import React, { useEffect, useRef } from 'react';
import { Text, TouchableOpacity, View, StyleSheet, Image } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { router, Tabs } from 'expo-router';

const animate1 = { 0: { scale: 0.5, translateY: 7 }, 0.92: { translateY: -34 }, 1: { scale: 1.2, translateY: -24 } };
const animate2 = { 0: { scale: 1.2, translateY: -24 }, 1: { scale: 1, translateY: 7 } };
const animateToLeft = { 0: { translateX: 0 }, 1: { translateX: -50, opacity: 0.5 } };

const TabButton = ({ route, focused, onPress, imageSource, title }) => {
  const viewRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    if (focused) {
      viewRef.current.animate(animate1);
      textRef.current.transitionTo({ scale: 1 });
    } else {
      viewRef.current.animate(animate2);
      textRef.current.transitionTo({ scale: 0 });
    }
  }, [focused]);

  const handlePress = () => {
    // Ejecutar la animación cuando se presiona la pestaña
    viewRef.current.animate(animateToLeft).then(() => {
      // Navegar a la nueva pestaña después de la animación
      router.push(`/(tabs)/${route.name}`);
    });
  };

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Animatable.View
        ref={viewRef}
        duration={1000}
        style={[
          styles.iconContainer,
          { backgroundColor: focused ? '#050259' : 'transparent' }, // Fondo dinámico cuando está seleccionado
        ]}
      >
        <Image source={imageSource} style={[styles.image, { tintColor: focused ? "#A0A4F2" : "#050259" }]} />
      </Animatable.View>
      <Animatable.Text 
        ref={textRef}
        style={[
          styles.text,
          { opacity: focused ? 1 : 0, marginTop: focused ? -20 : 0 }, // Cambiar el marginTop según el estado
        ]}
      >
        {title}
      </Animatable.Text>
    </TouchableOpacity>
  );
};

export default function TabLayout() {


  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => (
          <TabButton
          route={route}
          focused={focused}
          onPress={() => router.push(`/(tabs)/${route.name}`)}
          imageSource={
            route.name === 'Areas'
              ? require('../../assets/images/areaIcon.png')  // Icono para "Areas"
              : route.name === 'Escaner'
              ? require('../../assets/images/escanerIcon.png')  // Icono para "Escáner"
              : route.name === 'Codigos'
              ? require('../../assets/images/codigosIcon.png')  // Icono para "Códigos"
              : require('../../assets/images/perfilIcon.png')  // Icono para "Perfil"
          }
          title={
            route.name === 'Areas'
              ? 'Areas'
              : route.name === 'Escaner'
              ? 'Escáner'
              : route.name === 'Codigos'
              ? 'Códigos'
              : 'Perfil'
          }
        />
      ),
      tabBarShowLabel: false,
      tabBarStyle: styles.tabBar,
      headerShown: false,
    })}
  >
      <Tabs.Screen
        name="Areas"
        options={{
          headerShown: false,
        }}
      />
        <Tabs.Screen
        name="Escaner"
        options={{
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="Codigos"
        options={{
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="Perfil"
        options={{
          headerShown: false,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
  },
  tabBar: {
    height: 70,
    position: 'absolute',
    margin: 16,
    paddingBottom: 0,
    borderRadius: 16,
  },
  text: {
    fontSize: 13,
    color: "#050259",
    fontWeight: '500',
  },
  image: {
    width: 24,
    height: 24,
    resizeMode: 'contain',  // Asegura que la imagen se ajuste al contenedor
  },
});
