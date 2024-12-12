import axios from "axios";
import { EXPO_PUBLIC_URL_EXTERN_SERVER } from "@env";



export const checkServerAvailability = async (codeHospital:string): Promise<string> => {
  const urlcompleta = `http://${codeHospital}-server.local:5000`
  try {
    const response = await axios.get(`${urlcompleta}/health`);
    console.log(response.data);
    console.log("Servidor local disponible.", urlcompleta);
    return urlcompleta;
  } catch {
    console.warn("Servidor local no disponible, probando servidor externo...", urlcompleta);
  }
  try {
    console.log("Probando servidor externo...");
    await axios.get(`${EXPO_PUBLIC_URL_EXTERN_SERVER}/health`);
    console.log("Servidor externo disponible.");
    return EXPO_PUBLIC_URL_EXTERN_SERVER;
  } catch {
    console.warn("Servidor local no disponible, utilizando fallback...");
  }
  console.error("Ningún servidor está disponible.");
  return ""
};
