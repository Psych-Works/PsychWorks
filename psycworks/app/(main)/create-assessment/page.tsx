import {Button} from "@/components/ui/button";
import CreateAssessmentHeader from "@/components/create-assessment/create-assessment-header";
import CreateAssessmentField from "@/components/create-assessment/create-assessment-field";

export default function CreateAssessmentPage() {
    return (
        <div className="space-y-20">
            <div className="flex-col items-center justify-items-center">
                <CreateAssessmentHeader/>
                <CreateAssessmentField name='Name' type='text'/>
                <CreateAssessmentField name='Measure' type='text'/>
                <div className='grid grid-cols-5 w-full'>
                    <Button className='col-start-3 col-span-2'>Add Domain/Subtest</Button>
                </div>
                <div className='grid grid-cols-5 w-full fixed bottom-10 left-10'>
                    <Button className='col-start-1 col-span-1'>Cancel</Button>
                </div>
            </div>

        </div>
    );
}
