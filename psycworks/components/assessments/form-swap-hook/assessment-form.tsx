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

// function getForm({currentStep} = useTableFormContext) {
//   switch(currentStep) {

//   }
// }

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
  
  // const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  // const [erroredInputName, setErrorredInputName] = useState("");

  return (
    <>

      {/* {errors.root?.formError && (
        <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to close?</AlertDialogTitle>
            <AlertDialogDescription>
              Any unsaved changes will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setShowConfirmDialog(false);
                onOpenChange(false);
                reset(); // Reset form state
              }}
            >
              Close
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      )} */}

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
