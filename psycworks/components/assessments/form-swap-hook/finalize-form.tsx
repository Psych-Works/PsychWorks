import React from 'react'
import { Form, useForm, useFormContext } from 'react-hook-form'
import { Textarea } from '../../ui/textarea'
import { Table } from '../../ui/table'
import { InputData, tableDataSchema } from '@/types/table-input-data'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTableFormContext } from './assessments-form-context'
import { z } from 'zod'
import { Button } from '@/components/ui/button'

export const FinalizeForm = () => {

  const { formData, updateFormData} = useTableFormContext();
  const form = useForm<z.infer<typeof tableDataSchema>>({
    resolver: zodResolver(tableDataSchema.pick({fields: true})),
    defaultValues: { fields : formData.fields },
  });

  return (
    <>
      <div className='flex flex-col flex-1'>
        <div className='flex-1 overflow-y-auto p-4'>
          <h1 style={{ color: 'lightgrey', fontStyle: 'italic' }}>
          Use double square brackets like this, [[]], to denote a portion of the text that you want to be auto populated from the
          table.
          </h1>
          <Form {...form}>
            <form >
              <Textarea 
                placeholder='Assessment Description' 
                className="min-h-[200px]"
              />
            </form>
          </Form>
            
        </div>
        <div className='flex-1 overflow-y-auto p-4'>
          <Table />
        </div>
      </div>

      <div className="flex w-full justify-between">
        <Button
          className="w-[32%] h-9"
          onClick={() => {}}
        >
          Back
        </Button>
        <Button
          className="w-[32%] h-9"
          onClick={() => {}}
        >
          Finalize
        </Button>
      </div>
    </>
  )
}

export default FinalizeForm
