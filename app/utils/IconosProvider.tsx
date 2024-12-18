const images = {
    laboratorio: require('@/assets/images/iconsareas/laboratorio.png'),
    ambulancia: require('@/assets/images/iconsareas/ambulancia.png'),
    odontologia: require('@/assets/images/iconsareas/odontologia.png'),
    sirena: require('@/assets/images/iconsareas/sirena.png'),
    vacuna: require('@/assets/images/iconsareas/vacuna.png'),
    autoclave: require('@/assets/images/iconsareas/autoclave.png'),
    enfermera: require('@/assets/images/iconsareas/enfemera.png'),
    cirujano: require('@/assets/images/iconsareas/cirujano.png'),
    rayosx: require('@/assets/images/iconsareas/rayosx.png'),
    doctor: require('@/assets/images/iconsareas/doctor.png'),
    madre: require('@/assets/images/iconsareas/madre.png'),
    bebe: require('@/assets/images/iconsareas/bebe.png'),
  };
  
  const iconos: { nombre: string; ruta: keyof typeof images }[] = [
    { nombre: "laboratorio", ruta: "laboratorio" },
    { nombre: "ambulancia", ruta: "ambulancia" },
    { nombre: "odontologia", ruta: "odontologia" },
    { nombre: "sirena", ruta: "sirena" },
    { nombre: "vacuna", ruta: "vacuna" },
    { nombre: "autoclave", ruta: "autoclave" },
    { nombre: "enfermera", ruta: "enfermera" },
    { nombre: "cirujano", ruta: "cirujano" },
    { nombre: "rayosx", ruta: "rayosx" },
    { nombre: "doctor", ruta: "doctor" },
    { nombre: "madre", ruta: "madre" },
    { nombre: "bebe", ruta: "bebe" },
  ];
  export { images, iconos };
  