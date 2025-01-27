import { useState} from 'react'
import { CreationForm } from './creation-form'
import { FinalizeForm } from './finalize-form'
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { DialogDescription } from '@radix-ui/react-dialog';
import TableFormContextProvider, { useTableFormContext } from './assessments-form-context';

const FormContainer = () => {
  const { currentStep } = useTableFormContext();

  return (
    <>
      {currentStep === 1 && <CreationForm/>}
      {currentStep === 2 && <FinalizeForm/>}
      {currentStep === null && <div/>}
    </>
  );
};

export const CreateTableDialog = ({}) => {

  const [openDialog, onOpenChange] = useState(false);

  return (
    <>      
      <Dialog open={openDialog} onOpenChange={onOpenChange}>

        <DialogTrigger asChild>
          <Button onClick={() => { onOpenChange(true); }}>Add Domain/Subtest</Button>
        </DialogTrigger>
        
        <DialogContent className="sm:max-w-[80%] h-[80vh] w-[80%] flex flex-col overflow-hidden">
          <DialogTitle>
            Assessment Creation
          </DialogTitle>

          <DialogDescription>
          </DialogDescription>
            
          <TableFormContextProvider>
            <FormContainer />
          </TableFormContextProvider>

        </DialogContent>
        
      </Dialog>
    </>
  )
}
