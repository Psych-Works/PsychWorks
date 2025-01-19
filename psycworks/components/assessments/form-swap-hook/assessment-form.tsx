import { useState, createContext, ReactNode, useContext} from 'react'
import { FormProvider, useForm } from 'react-hook-form'

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
import { InputData } from '@/types/table-input-data';
import TableFormContextProvider from './assessments-form-context';


function getForm(step : Number) {
    switch (step) {
        case 1:
            return <CreationForm />;
        case 2:
            return <FinalizeForm />;
        default:
            return "Unknown Form";
    }
}

export const CreateTableDialog = ({}) => {

  const [openDialog, onOpenChange] = useState(false);
  const [activeForm, setActiveForm] = useState(1);

  const methods = useForm<InputData>();
  const { trigger } = methods;

  // const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  // const [erroredInputName, setErrorredInputName] = useState("");

    // This handles the swapping of the forms and saves the state of the current form
    const handleNext = async () => {
      const isFormValid = await trigger();
      if (isFormValid) {
        // Switch to the next form
        setActiveForm((prev) => prev + 1);
      }
      console.log("Next Button Pressed");
    };
  
    const handleBack = async () => {
      // Save the current form state
      const isFormValid = await trigger();
      if (isFormValid){
        // Switch to the previous form
        setActiveForm((prev) => prev - 1);
      }
      console.log("Back Button Pressed");
    };

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
          <Button onClick={() => { setActiveForm(1); onOpenChange(true); }}>Add Domain/Subtest</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[80%] h-[80vh] w-[80%] flex flex-col overflow-hidden">
          <DialogTitle>
            Assessment Creation
          </DialogTitle>

          <DialogDescription>
          </DialogDescription>
            
          <TableFormContextProvider>
            {getForm(activeForm)}
          </TableFormContextProvider>

        </DialogContent>
      </Dialog>
    </>
  )
}
