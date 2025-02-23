import React from 'react';
import { Document, Packer, Paragraph, TextRun, Header, ImageRun, ExternalHyperlink, Footer } from 'docx';

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
                    data: 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png',
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
    ]
});


