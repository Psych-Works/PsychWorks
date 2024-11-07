import { Button } from "@/components/ui/button"
import { SearchBar } from "@/components/searchbar/searchbar"

export default function AssessmentsPage() {
  return (
    <div className="space-y-20">
      <div className="px-[10%] pt-24 relative flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold">Assessment Table Template</h1>
          <p className="text-gray-500 mt-2">Create templates to use tables that you can reuse on Templates</p>
        </div>
        <Button className="w-40 h-12">Create</Button>
      </div>
      <div className="w-full px-40">
        <SearchBar placeholder="Search assessments..." className="w-[500%]" />
      </div>
    </div>
  );
}
