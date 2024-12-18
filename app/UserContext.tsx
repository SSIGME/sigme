// UserContext.tsx
import React, { createContext, useContext, useState } from "react";

type UserType = "admin" | "jefeArea" | "secretaria" | "tecnico" | "medico";

interface UserContextProps {
  userType: UserType;
  setUserType: React.Dispatch<React.SetStateAction<UserType>>;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC = ({ children }) => {
  const [userType, setUserType] = useState<UserType>("admin"); // Define aquí el valor inicial o usa uno dinámico

  return (
    <UserContext.Provider value={{ userType, setUserType }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};
