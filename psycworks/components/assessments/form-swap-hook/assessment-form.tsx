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
  assessmentName: string;
  onClose: () => void;
  measure: string;
  tableTypeId: string;
}

const FormContainer = ({ onClose, assessmentName , measure, tableTypeId}: CreateTableDialogProps) => {
  const { currentStep } = useTableFormContext();

  return (
    <>
      {currentStep === 1 && <CreationForm />}
      {currentStep === 2 && <FinalizeForm onClose={onClose} assessmentName={assessmentName} measure={measure} tableTypeId={tableTypeId}/>}
      {currentStep === null && <div/>}
    </>
  );
};

export const CreateTableDialog = ({ assessmentName, onClose, measure, tableTypeId }: CreateTableDialogProps) => {

  const [isOpen, setIsOpen] = useState(false);
  const { formData, updateFormData } = useTableFormContext();

  // Update handleSetIsOpen to force a save:
  const handleSetIsOpen = (open: boolean) => {
    if (!open) {
      // Force save from both forms
      updateFormData({
        ...formData,
        // Include any last-minute changes from FinalizeForm
        associatedText: formData.associatedText 
      });
  }
  setIsOpen(open);
};
  
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
          }}
          >
          <DialogTitle>
            Assessment Creation
          </DialogTitle>

          <DialogDescription>
          </DialogDescription>
            
          <FormContainer 
          onClose={() => { handleSetIsOpen(false); }} 
          assessmentName={assessmentName}
          measure={measure}
          tableTypeId={tableTypeId}
          />

        </DialogContent>
        
        </Dialog>
    </>
  )
}
