import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function CreateReportHeader({
  name,
  onNameChange,
  onAddAssessment,
}: {
  name: string;
  onNameChange: (value: string) => void;
  onAddAssessment: () => void;
}) {
  return (
    <div className="grid grid-cols-5 w-full items-center gap-4 mb-8">
      <div className="col-span-2 flex items-center gap-4">
        <p className="text-xl font-bold whitespace-nowrap">Template Name:</p>
        <Input
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Enter template name"
          className="border-2 border-gray-400 rounded-2xl flex-1"
        />
      </div>
      <div className="col-start-5 justify-self-end">
        <Button
          onClick={onAddAssessment}
          className="bg-[#757195] text-white hover:bg-[#757195]/90"
        >
          + Add Assessment
        </Button>
      </div>
    </div>
  );
}
