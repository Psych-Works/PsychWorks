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

const CreateAlertDialog = ({}) => {

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const { formData, clearFormData } = useTableFormContext();
  const isFormDirty = formData.fields.length > 0 || formData.associatedText !== "";
  console.log(isFormDirty);

  return (
    <>
    <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isFormDirty
              ? "Are you sure you want to close?"
              : "Close the form?"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isFormDirty
              ? "Any unsaved changes will be lost."
              : "You have no unsaved changes."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              if (isFormDirty) {
                clearFormData(); // Clear the form data
              }
              setShowConfirmDialog(false); // Close the dialog
            }}
          >
            Close
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  )
}

export const CreateTableDialog = ({}) => {

  const [openDialog, onOpenChange] = useState(false);

  return (
    <>      
      {/* <TableFormContextProvider>
        <CreateAlertDialog/>
      </TableFormContextProvider> */}


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
