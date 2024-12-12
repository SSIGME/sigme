import { create } from "zustand";

type codeDeleteStore = {
  codeDelete: string;
  setCodeDelete: (codigoIdentificacion: string) => void;
};
type shouldLoadAreas = {
  value: boolean;
  setValue: (newValue: boolean) => void;
};
type codeWriteStore = {
  codeWrite: string;
  setCodeWrite: (codigoIdentificacion: string) => void;
};

export const useShouldLoadAreas = create<shouldLoadAreas>((set) => ({
  value: false,
  setValue: (newValue: boolean) => set({ value: newValue }),
}));

export const useCodeDeleteStore = create<codeDeleteStore>((set) => ({
  codeDelete: "",
  setCodeDelete: (codigoIdentificacion: string) =>
    set({ codeDelete: codigoIdentificacion }),
}));
export const useCodeWriteStore = create<codeWriteStore>((set) => ({
  codeWrite: "",
  setCodeWrite: (codigoIdentificacion: string) =>
    set({ codeWrite: codigoIdentificacion }),
}));

