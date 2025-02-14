"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import CreateAssessmentHeader from '@/components/assessments/create-assessment-header';
import CreateAssessmentField from '@/components/assessments/create-assessment-field';
import TableFormContextProvider, { useTableFormContext } from '@/components/assessments/form-swap-hook/assessments-form-context';
import { ModifyTableDialog } from '@/components/assessments/form-swap-hook/modify-table-dialog';


interface Domain {
    id: number;
    name: string;
    score_type: "" | "T" | "Z" | "ScS" | "StS";
    subtests: Subtest[];
}

interface Subtest {
    id: number;
    name: string;
    score_type: "" | "T" | "Z" | "ScS" | "StS";
}

interface Assessment {
    id: number;
    name: string;
    measure: string;
    description: string;
    table_type_name: string;
    created_at: string;
    updated_at: string | null;
    domains: Domain[];
    standaloneSubtests: Subtest[];
}

const EditAssessmentPage: React.FC = () => {
    const router = useRouter();
    const { assessment_id } = useParams() as { assessment_id: string };
    const [initialAssessment, setInitialAssessment] = useState<Assessment | null>(null);
    const [formState, setFormState] = useState({
        name: '',
        measure: '',
        tableType: '',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const { formData } = useTableFormContext();

    useEffect(() => {
        const fetchAssessment = async () => {
            try {
                const response = await fetch(`/api/assessments/${assessment_id}`);
                if (!response.ok) throw new Error("Failed to fetch assessment");
                const data: Assessment = await response.json();
                setInitialAssessment(data);
                setFormState({
                    name: data.name,
                    measure: data.measure,
                    tableType: data.table_type_name,
                });
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load assessment");
            } finally {
                setLoading(false);
            }
        };
        fetchAssessment();
    }, [assessment_id]);

    // Memoize initialData to prevent unnecessary re-renders
    const initialData = useMemo(() => {
        if (!initialAssessment) return { fields: [], associatedText: '' };

        return {
            fields: [
                ...initialAssessment.domains.map(domain => ({
                    type: "domain" as const,
                    fieldData: {
                        name: domain.name,
                        score_type: domain.score_type,
                        id: domain.id.toString(),
                    },
                    subtests: domain.subtests.map(subtest => ({
                        name: subtest.name,
                        score_type: subtest.score_type,
                        id: subtest.id.toString(),
                        domain_id: domain.id.toString(),
                    })),
                })),
                ...initialAssessment.standaloneSubtests.map(subtest => ({
                    type: "subtest" as const,
                    fieldData: {
                        name: subtest.name,
                        score_type: subtest.score_type,
                        id: subtest.id.toString(),
                    },
                    subtests: [],
                })),
            ],
            associatedText: initialAssessment.description,
        };
    }, [initialAssessment]);

    const handleSave = async () => {
        if (!initialAssessment) return;

        const updatedAssessment = {
            ...initialAssessment,
            name: formState.name,
            measure: formState.measure,
            table_type_name: formState.tableType,
            description: formData.associatedText,
            domains: formData.fields.filter(field => field.type === 'domain').map(field => ({
                id: Number(field.fieldData.id),
                name: field.fieldData.name,
                score_type: field.fieldData.score_type,
                subtests: field.subtests ? field.subtests.map(subtest => ({
                    id: Number(subtest.id),
                    name: subtest.name,
                    score_type: subtest.score_type,
                })) : [],
            })),
            standaloneSubtests: formData.fields.filter(field => field.type === 'subtest').map(field => ({
                id: Number(field.fieldData.id),
                name: field.fieldData.name,
                score_type: field.fieldData.score_type,
            })),
        };

        try {
            const response = await fetch(`/api/assessments/${assessment_id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedAssessment),
            });
            if (!response.ok) throw new Error('Failed to save changes');
            router.back();
        } catch (error) {
            setError(error instanceof Error ? error.message : "Failed to save changes");
        }
    };

    if (loading) return <div className="p-4">Loading assessment...</div>;
    if (error) return <div className="p-4 text-red-500">{error}</div>;
    if (!initialAssessment) return <div className="p-4">Assessment not found</div>;

    return (
        <div className="space-y-20">
            <div className="flex-col items-center justify-items-center">
                <CreateAssessmentHeader
                    onTableTypeChange={(value) =>
                        setFormState(prev => ({ ...prev, tableType: value }))
                    }
                    value={formState.tableType}
                    mode="modify"
                />
                <CreateAssessmentField
                    name="Name"
                    value={formState.name}
                    onChange={(value) =>
                        setFormState(prev => ({ ...prev, name: value }))
                    }
                />
                <CreateAssessmentField
                    name="Measure"
                    value={formState.measure}
                    onChange={(value) =>
                        setFormState(prev => ({ ...prev, measure: value }))
                    }
                />
                <ModifyTableDialog
                    initialData={initialData}
                    onClose={() => router.back()}
                />
                <div className="grid grid-cols-5 w-full fixed bottom-10 left-10">
                    <Button
                        className="col-start-1 col-span-1"
                        onClick={() => router.back()}
                    >
                        Cancel
                    </Button>
                    <Button
                        className="col-start-4 col-span-1"
                        onClick={handleSave}
                        disabled={loading}
                    >
                        Save Changes
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
