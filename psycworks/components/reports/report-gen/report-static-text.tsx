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
      alignment: "center",
      children: [
        new TextRun({
          text: "Fort Worth Psycworks",
          size: 24,
          font: "Times New Roman",
        }),
      ],
    }),
    new Paragraph({
      alignment: "center",
      children: [
        new TextRun({
          text: "Page {pageNumber} of {totalPages}",
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
      }),
    ],
  }),
  new Paragraph({
    alignment: "left",
    children: [
      new TextRun({
        text: "Informed Consent:",
      }),
    ],
  }),
  new Paragraph({
    alignment: "left",
    children: [
      new TextRun({
        text: "Developmental and Health History:",
      }),
    ],
  }),
  new Paragraph({
    alignment: "left",
    children: [
      new TextRun({
        text: "Psychiatric History:",
      }),
    ],
  }),
  new Paragraph({
    alignment: "left",
    children: [
      new TextRun({
        text: "Psychosocial and Behavioral History:",
      }),
    ],
  }),
  new Paragraph({
    alignment: "left",
    children: [
      new TextRun({
        text: "Educational and Occupational History:",
      }),
    ],
  }),
  new Paragraph({
    alignment: "left",
    children: [
      new TextRun({
        text: "Current Mental Status Examination:",
      }),
    ],
  }),
  new Table({
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
      }),
    ],
  }),
  new Paragraph({
    alignment: "left",
    children: [
      new TextRun({
        text: "Assessment Observation:",
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
          bold: true,
          size: 24,
          font: "Times New Roman",
        }),
      ],
    })
);

export const ReportAssessmentResults = new Paragraph({
  alignment: "left",
  children: [
    new TextRun({
      text: "Assessment Results:",
    }),
    new Table({
      rows: [
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ text: "Standard Scores" })],
            }),
            new TableCell({
              children: [new Paragraph({ text: "Percentile Scores" })],
            }),
            new TableCell({
              children: [new Paragraph({ text: "Descriptive Terms" })],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  text: "130 or higher",
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  text: "98-99",
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  text: "Extremely High",
                }),
              ],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  text: "120-129",
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  text: "91-98",
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  text: "Very High",
                }),
              ],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  text: "110-119",
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  text: "75-90",
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  text: "High Average",
                }),
              ],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  text: "90-109",
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  text: "25-74",
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  text: "Average",
                }),
              ],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  text: "80-89",
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  text: "9-24",
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  text: "Low Average",
                }),
              ],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  text: "70-79",
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  text: "3-8",
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  text: "Very Low",
                }),
              ],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  text: "69 and below",
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  text: "1-2",
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  text: "Extremely Low",
                }),
              ],
            }),
          ],
        }),
      ],
    }),
  ],
});
