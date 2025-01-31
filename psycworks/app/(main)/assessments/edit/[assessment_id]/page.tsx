"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import CreateAssessmentHeader from '@/components/assessments/create-assessment-header';
import CreateAssessmentField from '@/components/assessments/create-assessment-field';
import TableFormContextProvider, { useTableFormContext } from '@/components/assessments/form-swap-hook/assessments-form-context';

const EditAssessmentPage: React.FC = () => {
    const router = useRouter();
    const [name, setName] = useState('Sample Name');
    const [measure, setMeasure] = useState('Sample Measure');
    const [tableTypeId, setTableTypeId] = useState('1');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    //const { formData, setFormData } = useTableFormContext();

    const handleSubmit = async () => {
        // Placeholder for submission logic
        console.log('Form submitted');
    };

    return (
        <div className="space-y-20">
            <div className="flex-col items-center justify-items-center">
                <CreateAssessmentHeader
                    onTableTypeChange={(value) => setTableTypeId(value)}
                    mode="modify"
                />
                <CreateAssessmentField
                    name="Name"
                    value={name}
                    onChange={(value) => setName(value)}
                />
                <CreateAssessmentField
                    name="Measure"
                    value={measure}
                    onChange={(value) => setMeasure(value)}
                />
                {/* Add more fields as necessary */}
                {error && <div className="text-red-500 text-center mt-4">{error}</div>}
                <div className="grid grid-cols-5 w-full fixed bottom-10 left-10">
                    <Button
                        className="col-start-1 col-span-1"
                        onClick={() => router.back()}
                    >
                        Cancel
                    </Button>
                    <Button
                        className="col-start-4 col-span-1"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </div>

        </div>
    );
};

export default function EditAssessmentPageWrapper() {
    return (
        <TableFormContextProvider>
            <EditAssessmentPage />
        </TableFormContextProvider>
    );
}
