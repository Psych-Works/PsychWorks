import { useState, useEffect, useRef, Children} from 'react'
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


export interface HierarchicalData {
    type: "domain" | "subtest";
    domainData?: {
      name: string;
      score_type: string;
    };
    subtestData?: {
      name: string;
      score_type: string;
    };
    subtests?: any[];
    id?: string;
  }

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

const HookFormSwap = ({}) => {

  const [openDialog, onOpenChange] = useState(false);
  const [activeForm, setActiveForm] = useState(1);
  
    // Separate states for each form
    const [creationFormState, setCreationFormState] = useState({});
    const [finalizeFormState, setFinalizeFormState] = useState({});

    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [erroredInputName, setErrorredInputName] = useState("");

    const methods = useForm<HierarchicalData[]> ({
      mode: "onTouched",  
    });


    // focus errored input on submit
    useEffect(() => {
      const erroredForm = 
      document.getElementsByName(erroredInputName)?.[0];
      if (erroredForm instanceof HTMLInputElement) {
        erroredForm.focus();
        setErrorredInputName("");
      }
    })

    const {
        trigger,
        setError,
        getValues,
        reset,
        formState: {isSubmitting, errors},
    } = methods;

    // This handles the swapping of the forms and saves the state of the current form
    const handleNext = async () => {
      const isFormValid = await trigger();
      if (isFormValid) {
        // Save the current form state
        if (activeForm === 1) {
          setCreationFormState(getValues());
        } else if (activeForm === 2) {
          setFinalizeFormState(getValues());
        }
        // Switch to the next form
        setActiveForm((prev) => prev + 1);
        // Reset form with the new form's state
        reset();
      }
    };
  
    const handleBack = () => {
      // Save the current form state
      if (activeForm === 1) {
        setCreationFormState(getValues());
      } else if (activeForm === 2) {
        setFinalizeFormState(getValues());
      }
      // Switch to the previous form
      setActiveForm((prev) => prev - 1);
      // Reset form with the new form's state
      reset();
    };

    const handleFormDataUpdate = (data : HierarchicalData | String) => {
      if (activeForm === 1) setCreationFormState(data);
      else if (activeForm === 1) setCreationFormState(data);
    }

    // const handleClose = () => {
    //   // If the form is dirty (has changes), show confirmation
    //   if (form.formState.isDirty) {
    //     setShowConfirmDialog(true);
    //   } 
    // };

  return (
    <>

      {errors.root?.formError && (
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
      )}


      <Dialog open={openDialog} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>
          <Button onClick={() => { setActiveForm(1); onOpenChange(true); }}>Add Domain/Subtest</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[80%] h-[80vh] w-[80%] flex flex-col overflow-hidden">
          <DialogTitle>
            Assessment Creation
          </DialogTitle>

          <FormProvider {...methods}>
            <form 
            noValidate 
            className="flex flex-col h-full" // Use flexbox to stretch the form
            >
              {getForm(activeForm)}
              <div className="sticky bottom-0 mt-auto h-14 border-t bg-white flex items-center px-4">
              {activeForm !== 1 && (
                <div className="flex w-full justify-between">
                  <Button
                    className="w-[32%] h-9"
                    onClick={handleBack}
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
              )}
              {activeForm === 1 && (
                <Button
                  className="w-[32%] h-9 ml-auto"
                  onClick={handleNext}
                >
                  Next
                </Button>
              )}
              </div>
            </form>
          </FormProvider>     
        </DialogContent>
      </Dialog>
    </>
  )
}

export default HookFormSwap
