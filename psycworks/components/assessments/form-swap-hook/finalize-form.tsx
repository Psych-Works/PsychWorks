import React from 'react'
import { Form, useForm } from 'react-hook-form'
import { Textarea } from '../../ui/textarea'
import { Table } from '../../ui/table'
import { InputData, tableDataSchema } from '@/types/table-input-data'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTableFormContext } from './assessments-form-context'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import DynamicTable from '@/components/assessments/table-rendering/dynamic-table';

interface FinalizeFormProps {
  onClose: () => void;
  assessmentName: string;
  measure: string;
  tableTypeId: string;
} 

export const FinalizeForm = ({ onClose, assessmentName, measure, tableTypeId }: FinalizeFormProps) => {

  const { setCurrentStep ,formData, updateFormData, isDirty, setIsDirty} = useTableFormContext();
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

  const hasRendered = React.useRef(false);

  // Run renderDomSub when component mounts
  React.useEffect(() => {
    if (!hasRendered.current && isDirty) {
      renderDomSub();
      hasRendered.current = true;
      setIsDirty(false);
    }
  }, [isDirty]); // Empty dependency array means this runs once when component mounts


  const { register, handleSubmit, setValue } = form;

  const handleBack = handleSubmit((data) => {
    updateFormData({ ...formData, associatedText: data.associatedText });
    setCurrentStep(1);
  });

  const handleFinalize = () => {
    updateFormData({ ...formData, associatedText: form.getValues('associatedText') });
    onClose();
  };

  const renderDomSub = () => {
    const allNames = formData.fields.flatMap((field) => {
      const names = ['{{'+ field.fieldData.name + '}}'];
      
      // Add child subtests if this is a domain with subtests
      if (field.type === "domain" && field.subtests && field.subtests.length > 0) {
        const subtestNames = field.subtests.map(subtest => '{{'+ subtest.name + '}}');
        names.push(...subtestNames);
      }
      
      return names;
    }).join(' ');
    
    setValue('associatedText', allNames + '\n' + form.getValues('associatedText'));
  }

  return (
    <div className="flex flex-col h-full max-h-screen"> {/* Add max-h-screen to limit height */}
      <div className="flex-1 overflow-y-auto min-h-0"> {/* Add min-h-0 to allow proper scrolling */}
        <div className='p-4'>
          <h1 style={{ color: 'black', fontStyle: 'italic' }}>
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
        
        <div className={`p-4 ${tableTypeId !== "3" ? "border-t" : ""}`}>
          {tableTypeId === "3" && (
            <DynamicTable assessmentName={assessmentName} measure={measure} tableTypeId={tableTypeId}/>
          )}
        </div>
      </div>

        <div className="w-full p-4 border-t bg-background">
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

