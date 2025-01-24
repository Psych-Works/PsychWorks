import React from 'react'
import {Input} from "@/components/ui/input";

const CreateAssessmentField = ({name}: {name: string}) => {
    return (
        <div className='grid grid-cols-5 my-5 w-full'>
            <p className="col-start-2 col-end-3 text-xl font-bold justify-self-center">{name}:</p>
            <Input type='text' className='border-2 border-gray-400 border-solid mx-1 px-2 rounded-2xl max-w-full max-h-full col-start-3 col-span-2 mb-4'/>
        </div>
    )
}
export default CreateAssessmentField