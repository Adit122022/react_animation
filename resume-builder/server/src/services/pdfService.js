const puppeteer = require('puppeteer');
const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');

// Register Handlebars helpers
handlebars.registerHelper('formatDate', function(date) {
    if (!date) return 'Present';
    return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric'
    });
});

handlebars.registerHelper('join', function(array, separator) {
    return array ? array.join(separator) : '';
});

// PDF template (HTML)
const getTemplate = (templateName = 'modern') => {
    const templates = {
        modern: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Arial', sans-serif; 
            color: #333; 
            line-height: 1.6;
            padding: 40px;
        }
        .header { 
            border-bottom: 3px solid {{theme.primaryColor}}; 
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .header h1 { 
            color: {{theme.primaryColor}}; 
            font-size: 32px;
            margin-bottom: 5px;
        }
        .contact-info { 
            color: #666; 
            font-size: 12px;
        }
        .contact-info a { 
            color: {{theme.primaryColor}}; 
            text-decoration: none;
        }
        .section { 
            margin-bottom: 25px;
        }
        .section-title { 
            color: {{theme.primaryColor}}; 
            font-size: 18px;
            font-weight: bold;
            border-bottom: 2px solid #eee;
            padding-bottom: 5px;
            margin-bottom: 15px;
        }
        .experience-item, .education-item, .project-item { 
            margin-bottom: 20px;
        }
        .item-header { 
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
        }
        .item-title { 
            font-weight: bold;
            font-size: 14px;
        }
        .item-subtitle { 
            color: #666;
            font-size: 12px;
        }
        .item-date { 
            color: #999;
            font-size: 12px;
        }
        .item-description { 
            font-size: 12px;
            margin-top: 8px;
            text-align: justify;
        }
        .skills-list { 
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
        }
        .skill-tag { 
            background: {{theme.primaryColor}};
            color: white;
            padding: 5px 12px;
            border-radius: 15px;
            font-size: 11px;
        }
        ul { 
            margin-left: 20px;
            font-size: 12px;
        }
        ul li { 
            margin-bottom: 5px;
        }
    </style>
</head>
<body>
    <!-- Header -->
    <div class="header">
        <h1>{{personalInfo.fullName}}</h1>
        <div class="contact-info">
            {{personalInfo.email}} | {{personalInfo.phone}}
            {{#if personalInfo.location}} | {{personalInfo.location}}{{/if}}
            {{#if personalInfo.linkedin}} | <a href="{{personalInfo.linkedin}}">LinkedIn</a>{{/if}}
            {{#if personalInfo.github}} | <a href="{{personalInfo.github}}">GitHub</a>{{/if}}
        </div>
        {{#if personalInfo.summary}}
        <p style="margin-top: 15px; font-size: 13px; text-align: justify;">{{personalInfo.summary}}</p>
        {{/if}}
    </div>

    <!-- Experience -->
    {{#if experience}}
    <div class="section">
        <div class="section-title">EXPERIENCE</div>
        {{#each experience}}
        <div class="experience-item">
            <div class="item-header">
                <div>
                    <div class="item-title">{{title}} - {{company}}</div>
                    <div class="item-subtitle">{{location}}</div>
                </div>
                <div class="item-date">
                    {{formatDate startDate}} - {{#if current}}Present{{else}}{{formatDate endDate}}{{/if}}
                </div>
            </div>
            {{#if description}}
            <div class="item-description">{{description}}</div>
            {{/if}}
            {{#if achievements}}
            <ul>
                {{#each achievements}}
                <li>{{this}}</li>
                {{/each}}
            </ul>
            {{/if}}
        </div>
        {{/each}}
    </div>
    {{/if}}

    <!-- Education -->
    {{#if education}}
    <div class="section">
        <div class="section-title">EDUCATION</div>
        {{#each education}}
        <div class="education-item">
            <div class="item-header">
                <div>
                    <div class="item-title">{{degree}}</div>
                    <div class="item-subtitle">{{institution}}, {{location}}</div>
                </div>
                <div class="item-date">{{formatDate startDate}} - {{formatDate endDate}}</div>
            </div>
            {{#if gpa}}<div style="font-size: 12px;">GPA: {{gpa}}</div>{{/if}}
        </div>
        {{/each}}
    </div>
    {{/if}}

    <!-- Skills -->
    {{#if skills.technical}}
    <div class="section">
        <div class="section-title">SKILLS</div>
        <div class="skills-list">
            {{#each skills.technical}}
            <span class="skill-tag">{{this}}</span>
            {{/each}}
        </div>
    </div>
    {{/if}}

    <!-- Projects -->
    {{#if projects}}
    <div class="section">
        <div class="section-title">PROJECTS</div>
        {{#each projects}}
        <div class="project-item">
            <div class="item-title">{{name}}</div>
            {{#if technologies}}
            <div class="item-subtitle">Tech: {{join technologies ", "}}</div>
            {{/if}}
            {{#if description}}
            <div class="item-description">{{description}}</div>
            {{/if}}
        </div>
        {{/each}}
    </div>
    {{/if}}
</body>
</html>
        `
    };

    return templates[templateName] || templates.modern;
};

// Generate PDF
exports.generatePDF = async (resumeData) => {
    try {
        // Compile template
        const template = handlebars.compile(getTemplate(resumeData.template));
        const html = template(resumeData);

        // Launch puppeteer
        const browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle0' });

        // Generate PDF
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: {
                top: '20px',
                right: '20px',
                bottom: '20px',
                left: '20px'
            }
        });

        await browser.close();

        return pdfBuffer;
    } catch (error) {
        console.error('PDF generation error:', error);
        throw new Error('Failed to generate PDF');
    }
};