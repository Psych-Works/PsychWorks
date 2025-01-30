import React from 'react'
import { Form, useForm } from 'react-hook-form'
import { Textarea } from '../../ui/textarea'
import { Table } from '../../ui/table'
import { InputData, tableDataSchema } from '@/types/table-input-data'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTableFormContext } from './assessments-form-context'
import { z } from 'zod'
import { Button } from '@/components/ui/button'

interface FinalizeFormProps {
  onClose: () => void;
} 

export const FinalizeForm = ({ onClose }: FinalizeFormProps) => {

  const { setCurrentStep ,formData, updateFormData} = useTableFormContext();
  const form = useForm<z.infer<typeof tableDataSchema>>({
    resolver: zodResolver(tableDataSchema.pick({associatedText: true})),
    defaultValues: { associatedText : formData.associatedText },
  });

  const { register, handleSubmit } = form;

  const handleBack = handleSubmit((data) => {
    updateFormData({ ...formData, associatedText: data.associatedText });
    setCurrentStep(1);
  });

  const handleFinalize = () => {
    updateFormData({ ...formData, associatedText: form.getValues('associatedText') });
    onClose();
  };

  return (
    <>
      <div className='flex flex-col flex-1'>
        <div className='flex-1 overflow-y-auto p-4'>
          <h1 style={{ color: 'lightgrey', fontStyle: 'italic' }}>
          Use double square brackets like this, [[]], to denote a portion of the text that you want to be auto populated from the
          table.
          </h1>
          <form onSubmit={handleSubmit(handleFinalize)}>
            <Textarea 
              placeholder='Assessment Description' 
              className="min-h-[200px]"
              {...register('associatedText')}
            />
          </form>
            
        </div>
        <div className='flex-1 overflow-y-auto p-4'>
          <Table />
        </div>
      </div>

      <div className="flex w-full justify-between">
        <Button
          className="w-[32%] h-9"
          onClick = {handleBack}
        >
          Back
        </Button>
        <Button
          className="w-[32%] h-9"
          type="submit"
          onClick={handleFinalize}
        >
          Finalize
        </Button>
      </div>
    </>
  )
}

