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
      text: "Name: ",
      bold: true,
      size: 24,
      font: "Times New Roman",
    }),
    new TextRun({
      text: "\t",
    }),
    new TextRun({
      text: "Date(s) of Evaluation: ",
      break: 1,
      bold: true,
      size: 24,
      font: "Times New Roman",
    }),
    new TextRun({
      text: "Date of Birth: ",
      bold: true,
      size: 24,
      font: "Times New Roman",
    }),
    new TextRun({
      text: "\t",
    }),
    new TextRun({
      text: "Date of Report: ",
      break: 1,
      bold: true,
      size: 24,
      font: "Times New Roman",
    }),
    new TextRun({
      text: "Age: ",
      bold: true,
      size: 24,
      font: "Times New Roman",
    }),
    new TextRun({
      text: "\t",
    }),
    new TextRun({
      text: "Evaluator: ",
      break: 1,
      bold: true,
      size: 24,
      font: "Times New Roman",
    }),
    new TextRun({
      text: "Insurance: ",
      bold: true,
      size: 24,
      font: "Times New Roman",
    }),
    new TextRun({
      text: "\t",
    }),
    new TextRun({
      text: "Referral: ",
      bold: true,
      size: 24,
      font: "Times New Roman",
    }),
  ],
});

export const ReportHeader = new Header({
  children: [
    new Paragraph({
      children: [
        // new ImageRun({
        //   type: "png",
        //   data: fs.readFileSync("@/public/images/logo.png"),
        //   transformation: {
        //     width: 100,
        //     height: 100,
        //   },
        // }),
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
        break: 3,
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
        text: "Informed Consent:",
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
  new Paragraph({
    alignment: "left",
    children: [
      new TextRun({
        text: "Developmental and Health History:",
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
  new Paragraph({
    alignment: "left",
    children: [
      new TextRun({
        text: "Psychiatric History:",
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
  new Paragraph({
    alignment: "left",
    children: [
      new TextRun({
        text: "Psychosocial and Behavioral History:",
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
  new Paragraph({
    alignment: "left",
    children: [
      new TextRun({
        text: "Educational and Occupational History:",
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
  new Paragraph({
    alignment: "left",
    children: [
      new TextRun({
        text: "Current Mental Status Examination:",
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

