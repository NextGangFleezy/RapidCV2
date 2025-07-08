import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } from 'docx';
import type { ResumeData } from '../types.js';

export async function generateWordDocument(resumeData: ResumeData): Promise<Buffer> {
  const { personalInfo, summary, workExperience, education, skills, projects } = resumeData;
  
  // Create document sections
  const children: Paragraph[] = [];
  
  // Header with name and contact info
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: personalInfo.fullName,
          bold: true,
          size: 32,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    })
  );
  
  // Contact information
  const contactInfo = [
    personalInfo.email,
    personalInfo.phone,
    personalInfo.location,
    personalInfo.linkedin,
    personalInfo.website,
    personalInfo.github,
  ].filter(Boolean).join(' | ');
  
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: contactInfo,
          size: 22,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 300 },
    })
  );
  
  // Professional Summary
  if (summary) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "PROFESSIONAL SUMMARY",
            bold: true,
            size: 24,
          }),
        ],
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 200, after: 100 },
        border: {
          bottom: {
            color: "000000",
            space: 1,
            style: BorderStyle.SINGLE,
            size: 6,
          },
        },
      })
    );
    
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: summary,
            size: 22,
          }),
        ],
        spacing: { after: 300 },
      })
    );
  }
  
  // Work Experience
  if (workExperience && workExperience.length > 0) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "PROFESSIONAL EXPERIENCE",
            bold: true,
            size: 24,
          }),
        ],
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 200, after: 100 },
        border: {
          bottom: {
            color: "000000",
            space: 1,
            style: BorderStyle.SINGLE,
            size: 6,
          },
        },
      })
    );
    
    workExperience.forEach((job) => {
      // Job title and company
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: job.position,
              bold: true,
              size: 24,
            }),
            new TextRun({
              text: ` | ${job.company}`,
              size: 24,
            }),
          ],
          spacing: { before: 200, after: 50 },
        })
      );
      
      // Dates and location
      const dateText = job.current 
        ? `${job.startDate} - Present`
        : `${job.startDate} - ${job.endDate || 'Present'}`;
      
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${dateText}${job.location ? ` | ${job.location}` : ''}`,
              italics: true,
              size: 20,
            }),
          ],
          spacing: { after: 100 },
        })
      );
      
      // Job description bullets
      if (job.description && job.description.length > 0) {
        job.description.forEach((bullet) => {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `• ${bullet}`,
                  size: 22,
                }),
              ],
              indent: { left: 720 },
              spacing: { after: 50 },
            })
          );
        });
      }
    });
  }
  
  // Education
  if (education && education.length > 0) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "EDUCATION",
            bold: true,
            size: 24,
          }),
        ],
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 300, after: 100 },
        border: {
          bottom: {
            color: "000000",
            space: 1,
            style: BorderStyle.SINGLE,
            size: 6,
          },
        },
      })
    );
    
    education.forEach((edu) => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${edu.degree} in ${edu.field}`,
              bold: true,
              size: 24,
            }),
            new TextRun({
              text: ` | ${edu.institution}`,
              size: 24,
            }),
          ],
          spacing: { before: 200, after: 50 },
        })
      );
      
      const eduDate = edu.endDate 
        ? `${edu.startDate} - ${edu.endDate}`
        : `${edu.startDate} - Present`;
      
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: eduDate + (edu.gpa ? ` | GPA: ${edu.gpa}` : ''),
              italics: true,
              size: 20,
            }),
          ],
          spacing: { after: 100 },
        })
      );
      
      if (edu.achievements && edu.achievements.length > 0) {
        edu.achievements.forEach((achievement) => {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `• ${achievement}`,
                  size: 22,
                }),
              ],
              indent: { left: 720 },
              spacing: { after: 50 },
            })
          );
        });
      }
    });
  }
  
  // Skills
  if (skills && skills.length > 0) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "SKILLS",
            bold: true,
            size: 24,
          }),
        ],
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 300, after: 100 },
        border: {
          bottom: {
            color: "000000",
            space: 1,
            style: BorderStyle.SINGLE,
            size: 6,
          },
        },
      })
    );
    
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: skills.join(' • '),
            size: 22,
          }),
        ],
        spacing: { after: 200 },
      })
    );
  }
  
  // Projects
  if (projects && projects.length > 0) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "PROJECTS",
            bold: true,
            size: 24,
          }),
        ],
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 300, after: 100 },
        border: {
          bottom: {
            color: "000000",
            space: 1,
            style: BorderStyle.SINGLE,
            size: 6,
          },
        },
      })
    );
    
    projects.forEach((project) => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: project.name,
              bold: true,
              size: 24,
            }),
          ],
          spacing: { before: 200, after: 50 },
        })
      );
      
      if (project.url || project.github) {
        const links = [project.url, project.github].filter(Boolean).join(' | ');
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: links,
                italics: true,
                size: 20,
              }),
            ],
            spacing: { after: 50 },
          })
        );
      }
      
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: project.description,
              size: 22,
            }),
          ],
          spacing: { after: 50 },
        })
      );
      
      if (project.technologies && project.technologies.length > 0) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `Technologies: ${project.technologies.join(', ')}`,
                bold: true,
                size: 20,
              }),
            ],
            spacing: { after: 100 },
          })
        );
      }
    });
  }
  
  // Create the document
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: children,
      },
    ],
  });
  
  // Generate buffer
  const buffer = await Packer.toBuffer(doc);
  return buffer;
}