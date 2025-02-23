import { useState } from "react";
import { Packer, Document, Paragraph, TextRun, HeadingLevel } from "docx";
import { ReportTitle } from "./static-report-text";
import { Button } from "@/components/ui/button";
import { saveAs } from "file-saver";

export default function ExportToWord() {
    const [isLoading, setIsLoading] = useState(false);
  
    const exportToWord = (): void => {
      const doc = new Document({
        styles: {
          default: {
            document: {
              run: {
                font: "Times New Roman",
              },
            },
            heading2: {
              run: {  
                color: "#000000",
                font: "Times New Roman",
                bold: true,
                underline: {
                  type: "single",
                  color: "#000000",
                },
                size: 24,
              },
            }
          },
        },
        sections: [
          {
            children: [
              ReportTitle,
            ],
          },
          {
            children: [
                    new Paragraph({
                        children: [
                            new TextRun({ text: "Name: Client LastName\nDate of Birth: XX/XX/XXXX\nAge: X years, X months\nInsurance: BCBS\nDate(s) of Evaluation: XX/XX/2024\nDate of Report: XX/XX/2024\nEvaluator: Justin Gaddis, PhD\nReferral: X", size: 24, font: "Times New Roman" }),
                        ],
                    }),
                    new Paragraph(
                      { 
                      text: "Identifying and Referral Information:",
                      heading: HeadingLevel.HEADING_2,
                    }),
                    new Paragraph({ 
                        text: "Informed Consent: Client was informed about the purpose of the evaluation and the limits of confidentiality..." 
                    }),
                    new Paragraph({ 
                        text: "Developmental and Health History:", 
                        heading: HeadingLevel.HEADING_2 
                    }),
                    new Paragraph({ 
                        text: "(Every effort has been made to include factual historical information...)" 
                    }),
                    new Paragraph({ 
                        text: "Psychiatric History:", 
                        heading: HeadingLevel.HEADING_2 
                    }),
                    new Paragraph({ 
                        text: "Psychosocial and Behavioral History:", 
                        heading: HeadingLevel.HEADING_2 
                    }),
                    new Paragraph({ 
                        text: "Educational and Occupational History:", 
                        heading: HeadingLevel.HEADING_2 
                    }),
                    new Paragraph({ 
                        text: "Current Mental Status Examination:", 
                        heading: HeadingLevel.HEADING_2 
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ 
                                text: "Thought Process: linear/goal-oriented\nBehavior/Eye Contact: good, variable\nInsight: good\nPsychomotor Activity: appropriate\nAppearance: neat, clean, and casual...", 
                                size: 24, 
                                font: "Times New Roman" 
                            }),
                        ],
                    }),
                    new Paragraph({ 
                        text: "Assessment Observation:", 
                        heading: HeadingLevel.HEADING_2 
  
                    }),
                    new Paragraph({ 
                        text: "Evaluation Methods:", 
                        heading: HeadingLevel.HEADING_2 
                    }),
                    new Paragraph({ 
                        text: "Patient Interview, Assessment Observation, Mental Status Exam..." 
                    }),
                    new Paragraph({ 
                        text: "Assessment Results:", 
                        heading: HeadingLevel.HEADING_2 
                    }),
                    new Paragraph({ text: "The results of most psychological tests are reported using either standard scores or percentile ranks..." }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "___________________________\nJustin Gaddis, PhD, LP, LSSP\nLicensed Psychologist #38134\nLicensed Specialist in School Psychology #70691", size: 24, font: "Times New Roman" }),
                        ],
                    }),
                ],
            },
        ],
    });
  
    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, 'report.docx');
    });
    }
  
    return (
      <div>
        <div className="mt-4">
          <Button onClick={exportToWord} className="mt-4" disabled={isLoading}>
            {isLoading ? 'Exporting...' : 'Export to DOCX'}
          </Button>
        </div>
      </div>
  
    );
};