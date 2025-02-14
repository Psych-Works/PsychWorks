import React, { useState, useEffect } from 'react';
import { CreationForm } from './creation-form';
import { FinalizeForm } from './finalize-form';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTitle, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { DialogDescription } from '@radix-ui/react-dialog';
import { useTableFormContext } from './assessments-form-context';
import { InputData } from '@/types/table-input-data';

// shallowCompare is a basic helper to avoid unnecessary updates
function shallowCompare(a: InputData, b: InputData): boolean {
    // Both must have the same keys e.g. fields + associatedText
    // For simplicity, we only compare if the references differ or top-level arrays differ:
    if (a === b) return true;
    if (
        a.associatedText === b.associatedText &&
        a.fields.length === b.fields.length
    ) {
        return true; // as a starting point
    }
    return false;
}

interface ModifyTableDialogProps {
    initialData: InputData;
    onClose: () => void;
}

const FormContainer = ({ initialData, onClose }: ModifyTableDialogProps) => {
    const { currentStep, formData, updateFormData } = useTableFormContext();

    useEffect(() => {
        // Clear cache

    }, [])
    useEffect(() => {
        // ONLY update if the new data differs from what's in the context
        if (!shallowCompare(formData, initialData)) {
            updateFormData(initialData);
        }
        // The next line warns React to watch for changes to both initialData and formData
        // But we do a condition to avoid infinite loops
    }, [initialData, formData, updateFormData]);

    return (
        <>
            {currentStep === 1 && <CreationForm />}
            {currentStep === 2 && <FinalizeForm onClose={onClose} />}
            {currentStep === null && <div />}
        </>
    );
};

export default FormContainer;

export const ModifyTableDialog = ({ initialData, onClose }: ModifyTableDialogProps) => {
    const [isOpen, setIsOpen] = useState(false);

    // We still rely on the TableFormContext to apply local changes.s
    // Actual DB save triggers happen on the parent page.
    const handleSetIsOpen = (open: boolean) => {
        setIsOpen(open);
        // Only close the dialog without triggering onClose
        if (!open) {
            setIsOpen(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleSetIsOpen}>
            <DialogTrigger asChild>
                <Button onClick={() => handleSetIsOpen(true)}>
                    Modify Domains/Subtests
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[80%] h-[80vh] w-[80%] flex flex-col overflow-hidden">
                <DialogTitle>Modify Assessment</DialogTitle>
                <DialogDescription />
                <FormContainer
                    initialData={initialData}
                    onClose={() => setIsOpen(false)} // Close the dialog without navigating
                />
                {/* Removed the local "Save Changes" button to defer saving */}
            </DialogContent>
        </Dialog>
    );
}; 