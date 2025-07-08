import puppeteer from 'puppeteer';
import type { ResumeData } from '../../shared/schema';

export async function generatePDF(resumeData: ResumeData, template: string = 'modern'): Promise<Buffer> {
  let browser;
  
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
        '--no-first-run',
        '--no-zygote',
        '--single-process'
      ]
    });
    
    const page = await browser.newPage();
    const html = generateResumeHTML(resumeData, template);
    
    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    const pdf = await page.pdf({
      format: 'A4',
      margin: {
        top: '0.5in',
        right: '0.5in',
        bottom: '0.5in',
        left: '0.5in'
      },
      printBackground: true
    });
    
    return pdf;
    
  } catch (error) {
    console.error('PDF generation error:', error);
    throw new Error(`Failed to generate PDF: ${error.message}`);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

function generateResumeHTML(resumeData: ResumeData, template: string): string {
  const { personalInfo, summary, workExperience, education, skills, projects } = resumeData;
  
  const baseStyles = `
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { 
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        line-height: 1.6; 
        color: #333; 
        font-size: 11px;
      }
      .container { max-width: 8.5in; margin: 0 auto; padding: 0.5in; }
      h1 { font-size: 24px; font-weight: 700; margin-bottom: 8px; }
      h2 { font-size: 16px; font-weight: 600; margin: 20px 0 10px 0; border-bottom: 2px solid #3B82F6; padding-bottom: 4px; }
      h3 { font-size: 14px; font-weight: 600; margin-bottom: 4px; }
      .header { text-align: center; margin-bottom: 24px; }
      .contact { font-size: 10px; color: #666; margin-top: 4px; }
      .section { margin-bottom: 20px; }
      .experience-item, .education-item, .project-item { margin-bottom: 16px; }
      .job-header, .edu-header, .project-header { display: flex; justify-content: space-between; align-items: baseline; }
      .company, .institution, .project-name { font-weight: 600; }
      .position, .degree { font-style: italic; }
      .date { color: #666; font-size: 10px; }
      .description { margin-top: 4px; }
      .description li { margin-left: 16px; margin-bottom: 2px; }
      .skills-list { display: flex; flex-wrap: wrap; gap: 8px; }
      .skill-tag { 
        background: #EFF6FF; 
        color: #1D4ED8; 
        padding: 4px 8px; 
        border-radius: 4px; 
        font-size: 10px; 
      }
      @media print { 
        body { -webkit-print-color-adjust: exact; }
        .container { padding: 0; }
      }
    </style>
  `;

  const modernTemplate = `
    ${baseStyles}
    <div class="container">
      <div class="header">
        <h1>${personalInfo.fullName}</h1>
        <div class="contact">
          ${personalInfo.email} | ${personalInfo.phone} | ${personalInfo.location}
          ${personalInfo.website ? ` | ${personalInfo.website}` : ''}
          ${personalInfo.linkedin ? ` | ${personalInfo.linkedin}` : ''}
          ${personalInfo.github ? ` | ${personalInfo.github}` : ''}
        </div>
      </div>

      ${summary ? `
        <div class="section">
          <h2>Professional Summary</h2>
          <p>${summary}</p>
        </div>
      ` : ''}

      ${workExperience.length > 0 ? `
        <div class="section">
          <h2>Work Experience</h2>
          ${workExperience.map(exp => `
            <div class="experience-item">
              <div class="job-header">
                <div>
                  <div class="company">${exp.company}</div>
                  <div class="position">${exp.position}</div>
                </div>
                <div class="date">${exp.startDate} - ${exp.current ? 'Present' : exp.endDate || ''}</div>
              </div>
              ${exp.description.length > 0 ? `
                <ul class="description">
                  ${exp.description.map(bullet => `<li>${bullet}</li>`).join('')}
                </ul>
              ` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}

      ${education.length > 0 ? `
        <div class="section">
          <h2>Education</h2>
          ${education.map(edu => `
            <div class="education-item">
              <div class="edu-header">
                <div>
                  <div class="institution">${edu.institution}</div>
                  <div class="degree">${edu.degree} in ${edu.field}</div>
                </div>
                <div class="date">${edu.startDate} - ${edu.endDate || ''}</div>
              </div>
              ${edu.gpa ? `<div>GPA: ${edu.gpa}</div>` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}

      ${skills.length > 0 ? `
        <div class="section">
          <h2>Skills</h2>
          <div class="skills-list">
            ${skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
          </div>
        </div>
      ` : ''}

      ${projects.length > 0 ? `
        <div class="section">
          <h2>Projects</h2>
          ${projects.map(project => `
            <div class="project-item">
              <div class="project-header">
                <h3 class="project-name">${project.name}</h3>
                ${project.url || project.github ? `
                  <div class="date">
                    ${project.url ? `<a href="${project.url}">Demo</a>` : ''}
                    ${project.github ? `<a href="${project.github}">Code</a>` : ''}
                  </div>
                ` : ''}
              </div>
              <p>${project.description}</p>
              ${project.technologies.length > 0 ? `
                <div class="skills-list" style="margin-top: 4px;">
                  ${project.technologies.map(tech => `<span class="skill-tag">${tech}</span>`).join('')}
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}
    </div>
  `;

  return `<!DOCTYPE html><html><head><meta charset="UTF-8">${modernTemplate}</head><body></body></html>`;
}
