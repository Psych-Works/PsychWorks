import React from 'react'

const CreateAssessmentField = ({name, type}: {name: string, type: string}) => {
    return (
        <div className={'grid grid-cols-5 my-5 w-full'}>
            <p className={"col-start-2 col-end-3 text-xl font-extrabold justify-self-center"}>{name}:</p>
            <input type={type} className={'border-2 border-black border-solid mx-1 px-2 rounded-2xl text max-w-full max-h-full col-start-3 col-span-2'}/>
        </div>
    )
}
export default CreateAssessmentField
