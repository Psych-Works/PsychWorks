import { useEffect, useState} from 'react'
import { CreationForm } from './creation-form'
import { FinalizeForm } from './finalize-form'
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogTrigger
} from '@/components/ui/dialog';
import { DialogDescription } from '@radix-ui/react-dialog';
import { useTableFormContext } from './assessments-form-context';

interface CreateTableDialogProps {
  onClose: () => void;
}

const FormContainer = ({ onClose }: CreateTableDialogProps) => {
  const { currentStep } = useTableFormContext();

  return (
    <>
      {currentStep === 1 && <CreationForm />}
      {currentStep === 2 && <FinalizeForm onClose={onClose}/>}
      {currentStep === null && <div/>}
    </>
  );
};

export const CreateTableDialog = ({}) => {

  const [isOpen, setIsOpen] = useState(false);
  const { formData, updateFormData } = useTableFormContext();

  const handleSetIsOpen = (open: boolean) => {
    if (!open) {
      updateFormData(formData);
      console.log("Form data updated: ", formData);
    }
    setIsOpen(open);
  }
  
  return (
    <>      
        <Dialog 
        open={isOpen} 
        onOpenChange={handleSetIsOpen}
        >

        <DialogTrigger asChild>
          <Button onClick={() => { handleSetIsOpen(true); }}>Add Domain/Subtest</Button>
        </DialogTrigger>
        
        <DialogContent className="sm:max-w-[80%] h-[80vh] w-[80%] flex flex-col overflow-hidden"
          onInteractOutside={(e) => {
            // Prevent closing the dialog when clicking outside
            e.preventDefault();
          }}>
          <DialogTitle>
            Assessment Creation
          </DialogTitle>

          <DialogDescription>
          </DialogDescription>
            
          <FormContainer 
          onClose={() => { handleSetIsOpen(false); }} 
          />

        </DialogContent>
        
        </Dialog>
    </>
  )
}
