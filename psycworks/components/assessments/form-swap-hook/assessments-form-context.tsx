import { InputData } from "@/types/table-input-data";
import { ReactNode, useCallback, useContext, useState } from "react";
import { createContext } from "react";

interface TableFormContextType {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  formData: InputData;
  updateFormData: (data: Partial<InputData>) => void;
  clearFormData: () => void;
}

interface TableFormContextProviderProps {
  children: ReactNode;
  initialData?: InputData;
}

const TableFormContext = createContext<TableFormContextType | undefined>(
  undefined
);
const CACHING_KEY = "table_form_data";

export default function TableFormContextProvider({
  children,
  initialData,
}: TableFormContextProviderProps) {
  const defaultInitialData: InputData = {
    fields: [],
    associatedText: "",
  };

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<InputData>(() => {
    // Priority: initialData > localStorage > default
    if (initialData) return initialData;

    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(CACHING_KEY);
      return saved ? JSON.parse(saved) : defaultInitialData;
    }

    return defaultInitialData;
  });

  const updateFormData = useCallback((data: Partial<InputData>) => {
    setFormData((prevFormData) => {
      const updatedData = { ...prevFormData, ...data };
      if (typeof window !== "undefined") {
        localStorage.setItem(CACHING_KEY, JSON.stringify(updatedData));
      }
      return updatedData;
    });
  }, []);

  const clearFormData = () => {
    setFormData(initialData || defaultInitialData);
    if (typeof window !== "undefined") {
      localStorage.removeItem(CACHING_KEY);
    }
  };

  return (
    <TableFormContext.Provider
      value={{
        currentStep,
        setCurrentStep,
        formData,
        updateFormData,
        clearFormData,
      }}
    >
      {children}
    </TableFormContext.Provider>
  );
}

export function useTableFormContext() {
  const context = useContext(TableFormContext);
  if (context === undefined) {
    throw new Error(
      "useTableFormContext must be used within a TableFormContextProvider"
    );
  }
  return context;
}
