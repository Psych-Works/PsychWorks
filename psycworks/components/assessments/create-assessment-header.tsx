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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTypes() {
      try {
        const response = await fetch("/api/assessments/types");
        if (!response.ok) {
          throw new Error("Failed to fetch assessment types");
        }
        const data = await response.json();
        setTypes(data);
        setError(null);
      } catch (error) {
        console.error("Error fetching types:", error);
        setError("Failed to load assessment types");
      } finally {
        setLoading(false);
      }
    }
    fetchTypes();
  }, []);

  if (loading) {
    return <div>Loading table types...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <>
      <div className="grid grid-cols-5 w-full">
        <div className="col-span-full my-10 text-black text-4xl font-bold justify-self-center">
          Create Assessment Table
        </div>

        <p className="col-start-2 col-end-3 mx-10 text-black font-bold text-xl justify-self-center">
          Table type:
        </p>
        <div className="col-start-3 col-end-5 w-full">
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select a type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Table types</SelectLabel>
                {types.map((item) => (
                  <SelectItem key={item.id} value={item.id.toString()}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  );
}
