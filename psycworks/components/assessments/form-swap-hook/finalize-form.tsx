import React from 'react'
import { useFormContext } from 'react-hook-form'
import { Textarea } from '../../ui/textarea'
import { Table } from '../../ui/table'



export const FinalizeForm = () => {

  const {
    control,
    formState,
    register,
  } = useFormContext<String>();

  return (
    <>
      <div className='flex flex-col flex-1'>
        <div className='flex-1 overflow-y-auto p-4'>
          <Textarea 
            placeholder='Assessment Description' 
            className="min-h-[200px]"
          />
        </div>

        <div className='flex-1 overflow-y-auto p-4'>
          <Table />
        </div>
      </div>
    </>
  )
}

export default FinalizeForm
