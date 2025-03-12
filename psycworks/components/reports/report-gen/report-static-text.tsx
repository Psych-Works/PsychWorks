import {
  Paragraph,
  TextRun,
  Header,
  ImageRun,
  ExternalHyperlink,
  Footer,
  Table,
  TableCell,
  TableRow,
  PageNumber,
} from "docx";

const base64logo = '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';

export const ReportTitle = new Paragraph({
  alignment: "center",
  children: [
    new TextRun({
      text: "NEUROPSYCHOLOGICAL EVALUATION",
      break: 1,
      bold: true,
      size: 24,
      font: "Times New Roman",
    }),
    new TextRun({
      text: "CONFIDENTIAL",
      break: 1,
      bold: true,
      size: 24,
      font: "Times New Roman",
      color: "#FF0000",
    }),
  ],
});

export const ClientInfo = new Paragraph({
  alignment: "left",
  children: [
    new TextRun({
      text: "Name: \t\t\t\t\t\t Date(s) of Evaluation: ",
      bold: true,
      break: 1,
      size: 24,
      font: "Times New Roman",
    }),
    new TextRun({
      text: "Date of Birth: \t\t\t\t\t Date of Report: ",
      bold: true,
      break: 1,
      size: 24,
      font: "Times New Roman",
    }),
    new TextRun({
      text: "Age: \t\t\t\t\t\t\t Evaluator: ",
      bold: true,
      break: 1,
      size: 24,
      font: "Times New Roman",
    }),
    new TextRun({
      text: "Insurance: \t\t\t\t\t\t Referral: ",
      bold: true,
      break: 1,
      size: 24,
      font: "Times New Roman",
    }),
  ],
});

const imageBlob = Uint8Array.from(atob(base64logo), c => c.charCodeAt(0));

export const ReportHeader = new Header({
  children: [
    new Paragraph({
      children: [
        new ImageRun({
          type: 'png',
          data: imageBlob,
          transformation: {
            width: 300,
            height: 50,
          },
        }),
      ],
    }),
    new Paragraph({
      alignment: "left",
      children: [
        new TextRun({
          text: "300 College Ave, Fort Worth, Texas 76104",
          break: 1,
          bold: true,
          size: 20,
          font: "Times New Roman",
          color: "#808080",
        }),
        new TextRun({
          text: "Office: 817.394.7646",
          break: 1,
          bold: true,
          size: 20,
          font: "Times New Roman",
          color: "#808080",
        }),
        new TextRun({
          text: "Fax: 817.631.2405",
          break: 1,
          bold: true,
          size: 20,
          font: "Times New Roman",
          color: "#808080",
        }),
        new ExternalHyperlink({
          children: [
            new TextRun({
              text: "www.fwpsychworks.com",
              break: 1,
              style: "hyperlink",
            }),
          ],
          link: "https://www.fwpsychworks.com/",
        }),
      ],
    }),
  ],
});

export const ReportFooter = new Footer({
  children: [
    new Paragraph({
      alignment: "right",
      children: [
        new TextRun({
          children: [
            "Page ", PageNumber.CURRENT, " of ", PageNumber.TOTAL_PAGES
          ],
          size: 24,
          font: "Times New Roman",
        }),
      ],
    }),
    new Paragraph({
      alignment: "center",
      children: [
        new TextRun({
          text: "Fort Worth PsychWorks",
          size: 24,
          font: "Times New Roman",
        }),
      ],
    }),
  ],
});

export const FirstHalfHeaders = [
  new Paragraph({
    alignment: "left",
    children: [
      new TextRun({
        text: "Identifying and Referral Information:",
        underline: {
          color: "#000000",
          type: "single",
        },
        break: 1,
        bold: true,
        size: 24,
        font: "Times New Roman",
      }),
    ],
  }),
  new Paragraph({
    alignment: "left",
    children: [
      new TextRun({
        text: "Informed Consent: ",
        break: 1,
        underline: {
          color: "#000000",
          type: "single",
        },
        bold: true,
        size: 24,
        font: "Times New Roman",
      }),
      new TextRun ({
        text: "Client was informed about the purpose of the evaluation and the limits of confidentiality. She was also told that any information offered during the evaluation might be included in the report for further guidance and assistance. Client consented to participate in the evaluation.",
        size: 24,
        font: "Times New Roman",
      }),
    ],
  }),
  new Paragraph({
    alignment: "left",
    children: [
      new TextRun({
        text: "Developmental and Health History: ",
        break: 1,
        underline: {
          color: "#000000",
          type: "single",
        },
        bold: true,
        size: 24,
        font: "Times New Roman",
      }),
      new TextRun ({
        text: "(Every effort has been made to include factual historical information relating to Client. Given the reality of occasional imprecise history reporting, some of the historical information included may not be entirely accurate, which is beyond the control of this examiner.)",
        size: 24,
        font: "Times New Roman",
      }),
    ],
  }),
  new Paragraph({
    alignment: "left",
    children: [
      new TextRun({
        text: "Psychiatric History: ",
        underline: {
          color: "#000000",
          type: "single",
        },
        break: 1,
        bold: true,
        size: 24,
        font: "Times New Roman",
      }),
    ],
  }),
  new Paragraph({
    alignment: "left",
    children: [
      new TextRun({
        text: "Psychosocial and Behavioral History: ",
        underline: {
          color: "#000000",
          type: "single",
        },
        break: 1,
        bold: true,
        size: 24,
        font: "Times New Roman",
      }),
    ],
  }),
  new Paragraph({
    alignment: "left",
    children: [
      new TextRun({
        text: "Educational and Occupational History: ",
        underline: {
          color: "#000000",
          type: "single",
        },
        break: 1,
        bold: true,
        size: 24,
        font: "Times New Roman",
      }),
    ],
  }),
  new Paragraph({
    alignment: "left",
    children: [
      new TextRun({
        text: "Current Mental Status Examination: ",
        underline: {
          color: "#000000",
          type: "single",
        },
        break: 1,
        bold: true,
        size: 24,
        font: "Times New Roman",
      }),
    ],
  }),
  new Table({
    width: {
      size: 100,
      type: "pct",
    },
    columnWidths: [50, 50],
    rows: [
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                text: "Thought Process:",
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                text: "Behavior/Eye Contact:",
              }),
            ],
          }),
        ],
        cantSplit: true,
      }),
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                text: "Insight:",
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                text: "Psychomotor Activity:",
              }),
            ],
          }),
        ],
        cantSplit: true,
      }),
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                text: "Appearance:",
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                text: "Associations:",
              }),
            ],
          }),
        ],
        cantSplit: true,
      }),
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                text: "Thought Content:",
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                text: "Suicidality:",
              }),
            ],
          }),
        ],
        cantSplit: true,
      }),
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                text: "Orientation:",
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                text: "Memory:",
              }),
            ],
          }),
        ],
        cantSplit: true,
      }),
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                text: "Affect:",
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                text: "Mood:",
              }),
            ],
          }),
        ],
        cantSplit: true,
      }),
    ],
  }),
  new Paragraph({
    alignment: "left",
    children: [
      new TextRun({
        text: "Assessment Observation:",
        underline: {
          color: "#000000",
          type: "single",
        },
        break: 3,
        bold: true,
        size: 24,
        font: "Times New Roman",
      }),
    ],
  }),
];

const evaluationMethodsText = `Adverse Childhood Experiences Questionnaire (ACE-Q)
Adult ADHD – Self-Report Scale (ASRS)
Autism Diagnostic Observation Schedule – Second Edition (ADOS-2)
Beck Depression Inventory – Second Edition (BDI-II)
Burns Anxiety Inventory (BAI)
CAGE Adapted to Include Drugs (CAGE-AID)
California Verbal Learning Test – Third Edition (CVLT-3)
Columbia Suicide Severity Rating Scales (C-SSRS)
Delis-Kaplan Executive Function System (D-KEFS)
Dissociate Experiences Scale – Second Edition (DES-II)
Generalized Anxiety Disorder (GAD-7)
McLean Screening Instrument for Borderline Personality Disorder (MSI-BPD)
Mental Status Exam
Monteiro Interview Guidelines for Diagnosing Autism Spectrum – Second Edition (MIGDAS-2)
Mood Disorder Questionnaire (MDQ)
Patient Health Questionnaire – 9 (PHQ-9)
Patient Interview
Assessment Observation
Penn State Worry Questionnaire (PSWQ)
PTSD Checklist with Life Events Checklist (PCL-5 with LEC-5)
Repeatable Battery for the Assessment of Neuropsychological Status (RBANS-Update)
Rey 15-Item Test (Rey-15)
Social Interaction Anxiety Scale (SIAS)
Social Responsiveness Scale – Second Edition (SRS-2)
Wechsler Adult Intelligence Scale – Fourth Edition (WAIS-IV)
Wechsler Memory Scale – Fourth Edition (WMS-IV), selected subtests
Weiss Functional Impairment Scale – Self-Report (WFIRS-S)
WHO Disability Assessment Schedule (WHODAS 2.0)
Yale-Brown Obsessive-Compulsive Scale (Y-BOCS)`;

export const ReportEvaluationMethods = evaluationMethodsText.split("\n").map(
  (line) =>
    new Paragraph({
      alignment: "left",
      children: [
        new TextRun({
          text: line,
          size: 24,
          font: "Times New Roman",
        }),
      ],
    })
);

export const ReportAssessmentResults = [
  new Paragraph({
    alignment: "left",
    children: [
      new TextRun({
        text: "Assessment Results:",
        underline: {
          color: "#000000",
          type: "single",
        },
        break: 1,
        bold: true,
        size: 24,
        font: "Times New Roman",
      }),
      new TextRun({
        text: "The results of most psychological tests are reported using either standard scores or percentile ranks. Standard scores and percentile ranks describe how a student performs on a test compared to a representative sample student of the same age from the general population.",
        break: 2,
        size: 24,
        font: "Times New Roman",
      }),
      new TextRun({
        text: "The following descriptive classifications can be applied to the data found below:",
        break: 2,
        size: 24,
        font: "Times New Roman",
      })
    ],
  }),
  new Table({
    width: {
      size: 100,
      type: "pct",
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            verticalAlign: "center",
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Standard Scores",
                    size: 24,
                    bold: true,
                    font: "Times New Roman",
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            verticalAlign: "center",
            children: [
              new Paragraph({ 
                children: [
                  new TextRun({
                    text: "Percentile Scores",
                    size: 24,
                    bold: true,
                    font: "Times New Roman",
                  }),
                ],
              })
          ],
          }),
          new TableCell({
            verticalAlign: "center",
            children: [
              new Paragraph({ 
                children: [
                  new TextRun({
                    text: "Descriptive Terms",
                    size: 24,
                    bold: true,
                    font: "Times New Roman",
                  }),
                ],
              })
          ],
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            verticalAlign: "center",
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "130 or higher",
                    size: 24,
                    font: "Times New Roman",
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            verticalAlign: "center",
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "98-99",
                    size: 24,
                    font: "Times New Roman",
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            verticalAlign: "center",
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Extremely High",
                    size: 24,
                    font: "Times New Roman",
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            verticalAlign: "center",
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "120-129",
                    size: 24,
                    font: "Times New Roman",
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            verticalAlign: "center",
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "91-98",
                    size: 24,
                    font: "Times New Roman",
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            verticalAlign: "center",
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Very High",
                    size: 24,
                    font: "Times New Roman",
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            verticalAlign: "center",
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "110-119",
                    size: 24,
                    font: "Times New Roman",
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            verticalAlign: "center",
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "75-90",
                    size: 24,
                    font: "Times New Roman",
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            verticalAlign: "center",
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "High Average",
                    size: 24,
                    font: "Times New Roman",
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            verticalAlign: "center",
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "90-109",
                    size: 24,
                    font: "Times New Roman",
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            verticalAlign: "center",
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "25-74",
                    size: 24,
                    font: "Times New Roman",
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            verticalAlign: "center",
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Average",
                    size: 24,
                    font: "Times New Roman",
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            verticalAlign: "center",
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "80-89",
                    size: 24,
                    font: "Times New Roman",
                  }),
                ],
              }),
            ],
          }),
          new TableCell({ 
            verticalAlign: "center",
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "9-24",
                    size: 24,
                    font: "Times New Roman",
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            verticalAlign: "center",
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Low Average",
                    size: 24,
                    font: "Times New Roman",
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            verticalAlign: "center",
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "70-79",
                    size: 24,
                    font: "Times New Roman",
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            verticalAlign: "center",
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "3-8",
                    size: 24,
                    font: "Times New Roman",
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            verticalAlign: "center",
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Very Low",
                    size: 24,
                    font: "Times New Roman",
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            verticalAlign: "center",
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "69 and below",
                    size: 24,
                    font: "Times New Roman",
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            verticalAlign: "center",
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "1-2",
                    size: 24,
                    font: "Times New Roman",
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            verticalAlign: "center",
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Extremely Low",
                    size: 24,
                    font: "Times New Roman",
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  }),
  new Paragraph({
    alignment: "left",
    children: [
      new TextRun({
        text: "In addition, scores reported to be in the Clinically Significant range suggest a high level of maladjustment. Scores in the “Elevated” range may identify a significant problem that may not be severe enough to require formal treatment or may identify the potential of developing a problem that needs careful monitoring.",
        break: 2,
        size: 24,
        font: "Times New Roman",
      }),
      new TextRun({
        text: "All assessments were administered in-person and in accordance with test publisher’s guidelines. Further, all scores (i.e. when applicable) were calculated utilizing age-based norms.",
        break: 2,
        size: 24,
        font: "Times New Roman",
      }),
    ],
  }),
];

const signatureBase64 = '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';
const signatureBlob = Uint8Array.from(atob(signatureBase64), c => c.charCodeAt(0));

export const EndOfReport = [
  new Paragraph({
    alignment: "left",
    children: [
      new TextRun({
        text: "Recommendations",
        break: 1,
        size: 24,
        font: "Times New Roman",
        bold: true,
        underline: {
          type: "single",
          color: "#000000",
        },
      })
    ]
  }),
  new Paragraph({
    text: "It is recommended that Client share a copy of this report with her physician to aid in appropriate treatment planning.",
    numbering: {
      reference: "1",
        level: 0,
    },
  }),
  new Paragraph({
    text: "The consideration or administration of any medication should be closely monitored by a licensed physician.",
    numbering: {
      reference: "1",
      level: 1,
    },
  }),
  new Paragraph({
    text: "These diagnoses should be revisited after treatment and/or in the event of a significant increase in the intensity of symptoms or a decrease in social or adaptive functioning. ",
    numbering: {
      reference: "1",
      level: 0,
    },
  }),
  new Paragraph({
    text: "Please do not hesitate to contact our office with questions or concerns.",
    numbering: {
      reference: "1",
      level: 0,
    },
  }),
  new Paragraph({
    alignment: "left",
    children: [
      new ImageRun({
       type:'png',
       data:signatureBlob,
       transformation: {
        width: 250,
        height: 50,
       }
      }),
    ],
  }),
  new Paragraph({
    alignment: 'left',
    children: [
      new TextRun({
        text: "Justin Gaddis, PhD, LP, LSSP",
        break: 1,
        size: 24, 
        font: 'Times New Roman',
      }),
      new TextRun({
        text: "Licensed Psychologist #38134",
        break: 1,
        size: 24, 
        font: 'Times New Roman',
      }),
      new TextRun({
        text: "Licensed Specialist in School Psychology #70691",
        break: 1,
        size: 24, 
        font: 'Times New Roman',
      })
    ]
  })
];
