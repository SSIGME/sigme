import { Stack } from "expo-router/stack";
export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerStyle: {
            backgroundColor: "#050259",
          },
          headerTintColor: "#050259",
        }}
      />
      <Stack.Screen
        name="CrearEquipo"
        options={{
          headerStyle: {
            backgroundColor: "rgba(0, 175, 255, 0.125)",
          },
          headerTintColor: "#000",
          headerTitleStyle: {
            color: "#000",
            fontWeight: "bold",
          },
          headerTitle: "Crear Equipo",
        }}
      />
      <Stack.Screen
        name="CrearArea"
        options={{
          headerTitle: "Crear Area",
          headerStyle: {
            backgroundColor: "rgba(0, 175, 255, 0.125)",
          },
          headerTintColor: "#000",
          headerTitleStyle: {
            color: "#000",
            fontWeight: "bold",
          },
        }}
      />
      <Stack.Screen
        name="ListarAreas"
        options={{
          headerStyle: {
            backgroundColor: "rgba(0, 175, 255, 0.125)",
          },
          headerTintColor: "#000",
          headerTitleStyle: {
            color: "#000",
            fontWeight: "bold",
          },
          headerTitle: "Areas",
        }}
      />

      <Stack.Screen
        name="Area/AreaDetail"
        options={({ route }) => ({
          headerStyle: {
            backgroundColor: "rgba(0, 175, 255, 0.125)",
          },
          headerTintColor: "#000",
          headerTitleStyle: {
            color: "#000",
            fontWeight: "bold",
          },
          headerTitle:
            typeof route.params.nombre === "string"
              ? route.params.nombre
              : "Area",
        })}
      />
      <Stack.Screen
        name="ListarEquipos"
        options={{
          headerStyle: {
            backgroundColor: "rgba(0, 175, 255, 0.125)",
          },
          headerTintColor: "#000",
          headerTitleStyle: {
            color: "#000",
            fontWeight: "bold",
          },
          headerTitle: "Listar Equipos",
        }}
      />
      <Stack.Screen
        name="Equipo/EquipoDetail"
        options={({ route }) => ({
          headerStyle: {
            backgroundColor: "rgba(0, 175, 255, 0.125)",
          },
          headerTintColor: "#000",
          headerTitleStyle: {
            color: "#000",
            fontWeight: "bold",
          },
          headerTitle:
            typeof route.params.title === "string"
              ? route.params.title
              : "Equipo",
        })}
      />
    </Stack>
  );
}
