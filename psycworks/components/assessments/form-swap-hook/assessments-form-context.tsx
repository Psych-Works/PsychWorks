import { InputData } from "@/types/table-input-data";
import { ReactNode, useContext, useState } from "react";
import { createContext } from "react";

interface TableFormContextType {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  formData: InputData;
  updateFormData: (data: Partial<InputData>) => void;
  clearFormData: () => void;
}

const TableFormContext = createContext<TableFormContextType | undefined>(
  undefined
);

const CACHING_KEY = "table_form_data";

export default function TableFormContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const initialData: InputData = {
    fields: [],
    associatedText: "",
  };

  const [formData, setFormData] = useState<InputData>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(CACHING_KEY);
      return saved ? JSON.parse(saved) : initialData;
    }
    return initialData;
  });

  const updateFormData = (data: Partial<InputData>) => {
    const updatedData = { ...formData, ...data };
    if (typeof window !== "undefined") {
      localStorage.setItem(CACHING_KEY, JSON.stringify(updatedData));
    }
    setFormData(updatedData);
  };

  const clearFormData = () => {
    setFormData(initialData);
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
