import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";

type AssessmentType = {
  id: number;
  name: string;
};

export default function CreateAssessmentHeader() {
  const [types, setTypes] = useState<AssessmentType[]>([]);

  useEffect(() => {
    async function fetchTypes() {
      try {
        const response = await fetch("/api/assessments/types");
        const data = await response.json();
        setTypes(data);
      } catch (error) {
        console.error("Error fetching types:", error);
      }
    }
    fetchTypes();
  }, []);

  return (
    <>
      <div className="grid grid-cols-5 w-full">
        <div className="col-span-full my-10 text-black text-4xl font-bold justify-self-center">
          Create Assessment Table
        </div>

        <p className="col-start-2 col-end-3 mx-10 text-black font-bold text-xl justify-self-center">
          Table type:
        </p>
        <p className="col-start-3 col-end-5 w-full">
          <Select>
            <SelectTrigger>
              <SelectValue
                placeholder="Select a type"
                className="w-full !text-3xl"
              ></SelectValue>
            </SelectTrigger>
            <SelectContent className="w-full">
              <SelectGroup>
                <SelectLabel className="text-2xl">Table types</SelectLabel>
                {types.map((item) => (
                  <SelectItem key={item.id} value={item.name}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </p>
      </div>
    </>
  );
}
