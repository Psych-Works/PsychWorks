import { Paragraph, TextRun, Header, ImageRun, ExternalHyperlink, Footer, Table, TableCell, TableRow } from 'docx';
import fs from 'fs';

export const ReportTitle = new Paragraph({
    alignment: 'center',
    children: [
        new TextRun({
            text: 'NEUROPSYCHOLOGICAL EVALUATION',
            break: 1,
            bold: true,
            size: 24,
            font: 'Times New Roman',
        }),
        new TextRun({
            text: 'CONFIDENTIAL',
            break: 1,
            bold: true,
            size: 24,
            font: 'Times New Roman',
            color: '#FF0000',
        })
    ]
});

export const ClientInfo = new Paragraph({
    alignment: 'left',
    children: [
        new TextRun({
            text: 'Name: ',
            bold: true,
            size: 24,
            font: 'Times New Roman',
        }),
        new TextRun({
            text: '\t',

        }),
        new TextRun({
            text: 'Date(s) of Evaluation: ',
            break: 1,
            bold: true,
            size: 24,
            font: 'Times New Roman',
        }),
        new TextRun({
            text: 'Date of Birth: ',
            bold: true,
            size: 24,
            font: 'Times New Roman',
        }),
        new TextRun({
            text: '\t',
        }),
        new TextRun({
            text: 'Date of Report: ',
            break: 1,
            bold: true,
            size: 24,
            font: 'Times New Roman',
        }),
        new TextRun({
            text: 'Age: ',
            bold: true,
            size: 24,
            font: 'Times New Roman',
        }),
        new TextRun({
            text: '\t',
        }),
        new TextRun({
            text: 'Evaluator: ',
            break: 1,
            bold: true,
            size: 24,
            font: 'Times New Roman',
        }),
        new TextRun({
            text: 'Insurance: ',
            bold: true,
            size: 24,
            font: 'Times New Roman',
        }),
        new TextRun({
            text: '\t',
        }),
        new TextRun({
            text: 'Referral: ',
            bold: true,
            size: 24,
            font: 'Times New Roman',
        }),
    ]
});

export const ReportHeader = new Header({
    children: [
        new Paragraph({
            children: [
                new ImageRun({
                    type: 'png',
                    data: fs.readFileSync('@/public/images/logo.png'),
                    transformation: {
                        width: 100,
                        height: 100,
                    },
                }),
            ],
        }),
        new Paragraph({
            alignment: 'left',
            children: [
                new TextRun({
                    text: '300 College Ave, Fort Worth, Texas 76104',
                    break: 1,
                    bold: true,
                    size: 20,
                    font: 'Times New Roman',
                    color: '#808080',
                }),
                new TextRun({
                    text: 'Office: 817.394.7646',
                    break: 1,
                    bold: true,
                    size: 20,
                    font: 'Times New Roman',
                    color: '#808080',
                }),
                new TextRun({
                    text: 'Fax: 817.631.2405',
                    break: 1,
                    bold: true,
                    size: 20,
                    font: 'Times New Roman',
                    color: '#808080',
                }),
                new ExternalHyperlink({
                    children: [
                        new TextRun({
                            text: 'www.fwpsychworks.com',
                            style: 'hyperlink',
                        }),
                    ],
                    link: 'https://www.fwpsychworks.com/',
                }),
            ],
        }),
    ]
});

export const ReportFooter = new Footer({
    children: [
        new Paragraph({
            alignment: 'center',
            children: [
                new TextRun({
                    text: 'Fort Worth Psycworks',
                    size: 24,
                    font: 'Times New Roman',
                }),
            ],
        }),
        new Paragraph({
            alignment: 'center',
            children: [
                new TextRun({
                    text: 'Page {pageNumber} of {totalPages}',
                    size: 24,
                    font: 'Times New Roman',
                }),
            ],
        }),
    ]
});

export const FirstHalfHeaders = new Paragraph({
    alignment: 'left',
    children: [
        new TextRun({
            text: 'Identifying and Referral Information:',
        }),
        new TextRun({
            text: 'Informed Consent:',
        }),
        new TextRun({
            text: 'Developmental and Health History:',
        }),
        new TextRun({
            text: 'Psychiatric History:',
        }),
        new TextRun({
            text: 'Psychosocial and Behavioral History:',
        }),
        new TextRun({
            text: 'Educational and Occupational History:',
        }),
        new TextRun({
            text: 'Current Mental Status Examination:',
        }),
        new Table({
            rows: [
                new TableRow({
                    children: [
                        new TableCell({
                            children: [
                                new Paragraph({
                                    text: '',
                                }),
                            ],
                        }),
                        new TableCell({
                            children: [
                                new Paragraph({
                                    text: '',
                                }),
                            ],
                        }),
                    ],
                }),
                new TableRow({
                    children: [
                        new TableCell({
                            children: [
                                
                            ],
                        }),
                        new TableCell({
                            children: [
                                new Paragraph({
                                    text: '',
                                }),
                            ],
                        }),
                    ],
                }),
                new TableRow({
                    children: [
                        new TableCell({
                            children: [
                                
                            ],
                        }),
                        new TableCell({
                            children: [
                                new Paragraph({
                                    text: '',
                                }),
                            ],
                        }),
                    ],
                }),
                new TableRow({
                    children: [
                        new TableCell({
                            children: [
                                
                            ],
                        }),
                        new TableCell({
                            children: [
                                new Paragraph({
                                    text: '',
                                }),
                            ],
                        }),
                    ],
                }),
                new TableRow({
                    children: [
                        new TableCell({
                            children: [
                                
                            ],
                        }),
                        new TableCell({
                            children: [
                                new Paragraph({
                                    text: '',
                                }),
                            ],
                        }),
                    ],
                }),
                new TableRow({
                    children: [
                        new TableCell({
                            children: [
                                
                            ],
                        }),
                        new TableCell({
                            children: [
                                new Paragraph({
                                    text: '',
                                }),
                            ],
                        }),
                    ],
                }),
            ],
        }),
        new TextRun({
            text: 'Assessment Observation:',
        }),
    ],
});

export const ReportEvaluationMethods = new Paragraph({
    alignment: 'left',
    children: [
        new TextRun({
            text: 'Adverse Childhood Experiences Questionnaire (ACE-Q)\nAdult ADHD – Self-Report Scale (ASRS)\nAutism Diagnostic Observation Schedule – Second Edition (ADOS-2)\nBeck Depression Inventory – Second Edition (BDI-II)\nBurns Anxiety Inventory (BAI)\nCAGE Adapted to Include Drugs (CAGE-AID)\nCalifornia Verbal Learning Test – Third Edition (CVLT-3)\nColumbia Suicide Severity Rating Scales (C-SSRS)\nDelis-Kaplan Executive Function System (D-KEFS)\nDissociate Experiences Scale – Second Edition (DES-II)\nGeneralized Anxiety Disorder (GAD-7)\nMcLean Screening Instrument for Borderline Personality Disorder (MSI-BPD)\nMental Status Exam\nMonteiro Interview Guidelines for Diagnosing Autism Spectrum – Second Edition (MIGDAS-2)\nMood Disorder Questionnaire (MDQ)\nPatient Health Questionnaire – 9 (PHQ-9)\nPatient Interview\nAssessment Observation\nPenn State Worry Questionnaire (PSWQ)\nPTSD Checklist with Life Events Checklist (PCL-5 with LEC-5)\nRepeatable Battery for the Assessment of Neuropsychological Status (RBANS-Update)\nRey 15-Item Test (Rey-15)\nSocial Interaction Anxiety Scale (SIAS)\nSocial Responsiveness Scale – Second Edition (SRS-2)\nWechsler Adult Intelligence Scale – Fourth Edition (WAIS-IV)\nWechsler Memory Scale – Fourth Edition (WMS-IV), selected subtests\nWeiss Functional Impairment Scale – Self-Report (WFIRS-S)\nWHO Disability Assessment Schedule (WHODAS 2.0)\nYale-Brown Obsessive-Compulsive Scale (Y-BOCS)',
            bold: true,
            size: 24,
            font: 'Times New Roman',
        }),
    ],
});

export const ReportAssessmentResults = new Paragraph({
    alignment: 'left',
    children: [
        new TextRun({
            text: 'Assessment Results:',
        }),
        new Table({
            rows: [
                new TableRow({
                    children: [
                        new TableCell({
                            children: [
                                new Paragraph({
                                    text: '',
                                }),
                            ],
                        }),
                        new TableCell({
                            children: [
                                new Paragraph({
                                    text: '',
                                }),
                            ],
                        }),
                        new TableCell({
                            children: [
                                new Paragraph({
                                    text: '',
                                }),
                            ],
                        }),
                    ],
                }),
                new TableRow({
                    children: [
                        new TableCell({
                            children: [
                                
                            ],
                        }),
                        new TableCell({
                            children: [
                                new Paragraph({
                                    text: '',
                                }),
                            ],
                        }),
                        new TableCell({
                            children: [
                                new Paragraph({
                                    text: '',
                                }),
                            ],
                        }),
                    ],
                }),
                new TableRow({
                    children: [
                        new TableCell({
                            children: [
                                
                            ],
                        }),
                        new TableCell({
                            children: [
                                new Paragraph({
                                    text: '',
                                }),
                            ],
                        }),
                        new TableCell({
                            children: [
                                new Paragraph({
                                    text: '',
                                }),
                            ],
                        }),
                    ],
                }),
                new TableRow({
                    children: [
                        new TableCell({
                            children: [
                                
                            ],
                        }),
                        new TableCell({
                            children: [
                                new Paragraph({
                                    text: '',
                                }),
                            ],
                        }),
                        new TableCell({
                            children: [
                                new Paragraph({
                                    text: '',
                                }),
                            ],
                        }),
                    ],
                }),
                new TableRow({
                    children: [
                        new TableCell({
                            children: [
                                
                            ],
                        }),
                        new TableCell({
                            children: [
                                new Paragraph({
                                    text: '',
                                }),
                            ],
                        }),
                        new TableCell({
                            children: [
                                new Paragraph({
                                    text: '',
                                }),
                            ],
                        }),
                    ],
                }),
                new TableRow({
                    children: [
                        new TableCell({
                            children: [
                                
                            ],
                        }),
                        new TableCell({
                            children: [
                                new Paragraph({
                                    text: '',
                                }),
                            ],
                        }),
                        new TableCell({
                            children: [
                                new Paragraph({
                                    text: '',
                                }),
                            ],
                        }),
                    ],
                }),
            ],
        }),
    ],
});


