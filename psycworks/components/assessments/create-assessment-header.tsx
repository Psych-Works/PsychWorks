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

export default function CreateAssessmentHeader({
  onTableTypeChange,
}: {
  onTableTypeChange: (value: string) => void;
}) {
  const [types, setTypes] = useState<AssessmentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchTypes() {
      try {
        const response = await fetch("/api/assessments/types");
        if (!response.ok) throw new Error("Failed to fetch assessment types");
        const data = await response.json();
        setTypes(data);
      } catch (err) {
        setError("Failed to load table types");
      } finally {
        setLoading(false);
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
        <div className="col-start-3 col-end-5 w-full">
          <Select onValueChange={onTableTypeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select table type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Table types</SelectLabel>
                {loading && <SelectItem value="loading">Loading...</SelectItem>}
                {error && <SelectItem value="error">{error}</SelectItem>}
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
