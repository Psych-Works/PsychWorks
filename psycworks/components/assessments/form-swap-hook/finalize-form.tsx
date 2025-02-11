import React from 'react'
import { Form, useForm } from 'react-hook-form'
import { Textarea } from '../../ui/textarea'
import { Table } from '../../ui/table'
import { InputData, tableDataSchema } from '@/types/table-input-data'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTableFormContext } from './assessments-form-context'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import DynamicTable from '../table-rendering/dynamic-table';

interface FinalizeFormProps {
  onClose: () => void;
  assessmentName: string;
  measure: string;
  tableTypeId: string;
} 

export const FinalizeForm = ({ onClose, assessmentName, measure, tableTypeId }: FinalizeFormProps) => {

  const { setCurrentStep ,formData, updateFormData} = useTableFormContext();
  const form = useForm<z.infer<typeof tableDataSchema>>({
    resolver: zodResolver(tableDataSchema.pick({associatedText: true})),
    defaultValues: { associatedText : formData.associatedText },
  });

  // Add this useEffect to watch for changes in associatedText:
  const { watch } = form;
  const associatedText = watch('associatedText');

  React.useEffect(() => {
    updateFormData({ associatedText });
  }, [associatedText]);

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
    <div className="flex flex-col h-full"> {/* Set fixed height container */}
  {/* Scrollable content area */}
  <div className="flex-1 overflow-y-auto">
    <div className='flex flex-col'>
      <div className='p-4'>
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
      
      <div className='p-4'>
        <DynamicTable assessmentName={assessmentName} measure={measure} tableTypeId={tableTypeId}/>
        {/* <EditableTable /> */}
      </div>
    </div>
  </div>

  {/* Fixed button container */}
  <div className="w-full p-4 border-t bg-background sticky bottom-0">
    <div className="flex justify-between gap-4">
      <Button
        className="flex-1 h-9"
        onClick={handleBack}
      >
        Back
      </Button>
      <Button
        className="flex-1 h-9"
        type="submit"
        onClick={handleFinalize}
      >
        Finalize
      </Button>
    </div>
  </div>
</div>
  )
}

