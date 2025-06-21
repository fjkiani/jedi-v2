// Contact Form Service
// Handles lead form submission, email generation, and data formatting
import emailjs from '@emailjs/browser';

export class ContactFormService {
  constructor() {
    // EmailJS configuration - using the same config as your existing Contact component
    this.emailjsConfig = {
      serviceId: 'service_pbft5vk',
      templateId: 'template_0wxfg2m', // Use the same template as Contact component
      publicKey: 'uJYd4pcG3X27kg7z-'
    };
    
    // Use hardcoded values since process.env is not available in browser
    this.emailEndpoint = null; // No API endpoint configured
    this.fallbackEmail = 'fjkiani1@gmail.com'; // Default fallback email
    
    // Initialize EmailJS
    this.initializeEmailJS();
  }

  /**
   * Initialize EmailJS with public key
   */
  initializeEmailJS() {
    try {
      if (emailjs && emailjs.init) {
        emailjs.init(this.emailjsConfig.publicKey);
        console.log('EmailJS initialized successfully');
      } else {
        console.warn('EmailJS not available for initialization');
      }
    } catch (error) {
      console.error('Failed to initialize EmailJS:', error);
    }
  }

  /**
   * Submit lead form data
   * @param {Object} formData - Complete form submission data
   * @returns {Promise} - Submission result
   */
  async submitLead(formData) {
    try {
      // Generate email content
      const emailContent = this.generateEmailContent(formData);
      
      console.log('Attempting to submit lead:', {
        formData,
        emailContent: { ...emailContent, html: '[HTML Content]' } // Don't log full HTML
      });
      
      // Try EmailJS first with comprehensive error handling
      try {
        const result = await this.submitViaEmailJS(emailContent, formData);
        console.log('Lead submitted successfully via EmailJS:', result);
        return result;
      } catch (emailjsError) {
        console.warn('EmailJS failed, error details:', emailjsError);
        
        // Try API endpoint if available
        if (this.emailEndpoint) {
          console.log('Trying API endpoint...');
          return await this.submitViaAPI(emailContent, formData);
        } else {
          console.log('No API endpoint, using mailto fallback...');
          return await this.submitViaMailto(emailContent, formData);
        }
      }
    } catch (error) {
      console.error('Error submitting lead:', error);
      throw new Error('Failed to submit lead. Please try again.');
    }
  }

  /**
   * Generate HTML email content using the provided template
   * @param {Object} formData - Form submission data
   * @returns {Object} - Email content object
   */
  generateEmailContent(formData) {
    const timestamp = new Date().toLocaleString();
    const leadScore = this.calculateLeadScore(formData);
    
    // Create summary message
    const summaryMessage = this.createSummaryMessage(formData);
    
    // Generate HTML email using the provided template
    const htmlContent = `
      <div style="font-family: system-ui, sans-serif, Arial; font-size: 12px">
        <div>A message by ${formData.name} has been received. Kindly respond at your earliest convenience.</div>
        <div
          style="
            margin-top: 20px;
            padding: 15px 0;
            border-width: 1px 0;
            border-style: dashed;
            border-color: lightgrey;
          "
        >
          <table role="presentation">
            <tr>
              <td style="vertical-align: top">
                <div
                  style="
                    padding: 6px 10px;
                    margin: 0 10px;
                    background-color: aliceblue;
                    border-radius: 5px;
                    font-size: 26px;
                  "
                  role="img"
                >
                  &#x1F464;
                </div>
              </td>
              <td style="vertical-align: top">
                <div style="color: #2c3e50; font-size: 16px">
                  <strong>${formData.name}</strong>
                </div>
                <div style="color: #cccccc; font-size: 13px">${timestamp}</div>
                <p style="font-size: 16px">${summaryMessage}</p>
              </td>
            </tr>
          </table>
        </div>
        
        <!-- Lead Score Indicator -->
        <div style="margin-top: 20px; padding: 10px; background-color: ${this.getLeadScoreColor(leadScore)}; border-radius: 5px;">
          <strong>Lead Score: ${leadScore}/100</strong> - ${this.getLeadScorePriority(leadScore)}
        </div>
        
        <!-- Detailed Information -->
        <div style="margin-top: 20px;">
          <h3 style="color: #2c3e50; margin-bottom: 15px;">Contact Information</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 5px; font-weight: bold; width: 150px;">Name:</td><td style="padding: 5px;">${formData.name}</td></tr>
            <tr><td style="padding: 5px; font-weight: bold;">Email:</td><td style="padding: 5px;"><a href="mailto:${formData.email}">${formData.email}</a></td></tr>
            <tr><td style="padding: 5px; font-weight: bold;">Company:</td><td style="padding: 5px;">${formData.company}</td></tr>
            ${formData.phone ? `<tr><td style="padding: 5px; font-weight: bold;">Phone:</td><td style="padding: 5px;"><a href="tel:${formData.phone}">${formData.phone}</a></td></tr>` : ''}
          </table>
        </div>
        
        <div style="margin-top: 20px;">
          <h3 style="color: #2c3e50; margin-bottom: 15px;">Project Details</h3>
          <table style="width: 100%; border-collapse: collapse;">
            ${formData.industry ? `<tr><td style="padding: 5px; font-weight: bold; width: 150px;">Industry:</td><td style="padding: 5px;">${formData.industry}</td></tr>` : ''}
            <tr><td style="padding: 5px; font-weight: bold; vertical-align: top;">Project Scope:</td><td style="padding: 5px;">${formData.projectScope}</td></tr>
            <tr><td style="padding: 5px; font-weight: bold; vertical-align: top;">Primary Challenge:</td><td style="padding: 5px;">${formData.primaryChallenge}</td></tr>
            ${formData.currentSolution ? `<tr><td style="padding: 5px; font-weight: bold; vertical-align: top;">Current Solution:</td><td style="padding: 5px;">${formData.currentSolution}</td></tr>` : ''}
          </table>
        </div>
        
        <div style="margin-top: 20px;">
          <h3 style="color: #2c3e50; margin-bottom: 15px;">Requirements & Budget</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 5px; font-weight: bold; width: 150px;">Budget Range:</td><td style="padding: 5px;">${this.formatBudgetRange(formData.budgetRange)}</td></tr>
            <tr><td style="padding: 5px; font-weight: bold;">Timeline:</td><td style="padding: 5px;">${this.formatTimeline(formData.timeline)}</td></tr>
            <tr><td style="padding: 5px; font-weight: bold;">Urgency:</td><td style="padding: 5px;">${this.formatUrgency(formData.urgency)}</td></tr>
            ${formData.teamSize ? `<tr><td style="padding: 5px; font-weight: bold;">Team Size:</td><td style="padding: 5px;">${formData.teamSize}</td></tr>` : ''}
          </table>
        </div>
        
        ${this.renderAdditionalDetails(formData)}
        ${this.renderConversationContext(formData)}
        
        <div style="margin-top: 30px; padding: 15px; background-color: #f8f9fa; border-radius: 5px;">
          <h4 style="color: #2c3e50; margin-bottom: 10px;">Next Steps</h4>
          <ul style="margin: 0; padding-left: 20px;">
            <li>Review lead score and prioritize accordingly</li>
            <li>Respond within ${this.getResponseTime(formData.urgency)}</li>
            <li>Schedule initial consultation call</li>
            <li>Prepare relevant case studies and proposals</li>
          </ul>
        </div>
      </div>
    `;

    return {
      subject: `New Lead: ${formData.name} from ${formData.company} - ${this.getLeadScorePriority(leadScore)} Priority`,
      html: htmlContent,
      text: this.generateTextContent(formData),
      leadScore,
      timestamp
    };
  }

  /**
   * Create a concise summary message for the lead
   * @param {Object} formData - Form data
   * @returns {string} - Summary message
   */
  createSummaryMessage(formData) {
    const industry = formData.industry ? ` in ${formData.industry}` : '';
    const budget = formData.budgetRange ? ` with ${this.formatBudgetRange(formData.budgetRange)} budget` : '';
    const timeline = formData.timeline ? ` targeting ${this.formatTimeline(formData.timeline).toLowerCase()}` : '';
    
    return `New AI solution inquiry from ${formData.company}${industry}${budget}${timeline}. ${formData.projectScope.substring(0, 100)}${formData.projectScope.length > 100 ? '...' : ''}`;
  }

  /**
   * Calculate lead score based on form data
   * @param {Object} formData - Form submission data
   * @returns {number} - Lead score (0-100)
   */
  calculateLeadScore(formData) {
    let score = 0;

    // Budget scoring (30 points max)
    const budgetScores = {
      'over-1m': 30,
      '500k-1m': 25,
      '250k-500k': 20,
      '100k-250k': 15,
      '50k-100k': 10,
      'under-50k': 5,
      'flexible': 15
    };
    score += budgetScores[formData.budgetRange] || 0;

    // Urgency scoring (25 points max)
    const urgencyScores = {
      'critical': 25,
      'high': 20,
      'medium': 15,
      'low': 10
    };
    score += urgencyScores[formData.urgency] || 0;

    // Timeline scoring (20 points max)
    const timelineScores = {
      'immediate': 20,
      'short': 18,
      'medium': 15,
      'long': 10,
      'planning': 5
    };
    score += timelineScores[formData.timeline] || 0;

    // Company and project detail scoring (15 points max)
    if (formData.company && formData.company.length > 5) score += 5;
    if (formData.projectScope && formData.projectScope.length > 50) score += 5;
    if (formData.primaryChallenge && formData.primaryChallenge.length > 30) score += 5;

    // Additional details scoring (10 points max)
    if (formData.specificRequirements && formData.specificRequirements.length > 20) score += 3;
    if (formData.expectedOutcomes && formData.expectedOutcomes.length > 20) score += 3;
    if (formData.teamSize) score += 2;
    if (formData.phone) score += 2;

    return Math.min(score, 100);
  }

  /**
   * Get lead score priority label
   * @param {number} score - Lead score
   * @returns {string} - Priority label
   */
  getLeadScorePriority(score) {
    if (score >= 80) return 'High';
    if (score >= 60) return 'Medium-High';
    if (score >= 40) return 'Medium';
    if (score >= 20) return 'Medium-Low';
    return 'Low';
  }

  /**
   * Get lead score color
   * @param {number} score - Lead score
   * @returns {string} - Color code
   */
  getLeadScoreColor(score) {
    if (score >= 80) return '#d4edda'; // Green
    if (score >= 60) return '#d1ecf1'; // Blue
    if (score >= 40) return '#fff3cd'; // Yellow
    if (score >= 20) return '#f8d7da'; // Light red
    return '#f8f9fa'; // Gray
  }

  /**
   * Get recommended response time based on urgency
   * @param {string} urgency - Urgency level
   * @returns {string} - Response time
   */
  getResponseTime(urgency) {
    const responseTimes = {
      'critical': '2-4 hours',
      'high': '4-8 hours',
      'medium': '24 hours',
      'low': '48 hours'
    };
    return responseTimes[urgency] || '24 hours';
  }

  /**
   * Format budget range for display
   * @param {string} budgetRange - Budget range value
   * @returns {string} - Formatted budget range
   */
  formatBudgetRange(budgetRange) {
    const budgetLabels = {
      'under-50k': 'Under $50K',
      '50k-100k': '$50K - $100K',
      '100k-250k': '$100K - $250K',
      '250k-500k': '$250K - $500K',
      '500k-1m': '$500K - $1M',
      'over-1m': 'Over $1M',
      'flexible': 'Flexible/To be discussed'
    };
    return budgetLabels[budgetRange] || budgetRange;
  }

  /**
   * Format timeline for display
   * @param {string} timeline - Timeline value
   * @returns {string} - Formatted timeline
   */
  formatTimeline(timeline) {
    const timelineLabels = {
      'immediate': 'Immediate (0-1 month)',
      'short': 'Short-term (1-3 months)',
      'medium': 'Medium-term (3-6 months)',
      'long': 'Long-term (6+ months)',
      'planning': 'Still in planning phase'
    };
    return timelineLabels[timeline] || timeline;
  }

  /**
   * Format urgency for display
   * @param {string} urgency - Urgency value
   * @returns {string} - Formatted urgency
   */
  formatUrgency(urgency) {
    const urgencyLabels = {
      'low': 'Low - Exploring options',
      'medium': 'Medium - Actively evaluating',
      'high': 'High - Need solution soon',
      'critical': 'Critical - Urgent business need'
    };
    return urgencyLabels[urgency] || urgency;
  }

  /**
   * Render additional details section
   * @param {Object} formData - Form data
   * @returns {string} - HTML content
   */
  renderAdditionalDetails(formData) {
    const hasAdditionalDetails = formData.specificRequirements || formData.expectedOutcomes || formData.additionalNotes;
    
    if (!hasAdditionalDetails) return '';

    return `
      <div style="margin-top: 20px;">
        <h3 style="color: #2c3e50; margin-bottom: 15px;">Additional Details</h3>
        <table style="width: 100%; border-collapse: collapse;">
          ${formData.specificRequirements ? `<tr><td style="padding: 5px; font-weight: bold; width: 150px; vertical-align: top;">Requirements:</td><td style="padding: 5px;">${formData.specificRequirements}</td></tr>` : ''}
          ${formData.expectedOutcomes ? `<tr><td style="padding: 5px; font-weight: bold; vertical-align: top;">Expected Outcomes:</td><td style="padding: 5px;">${formData.expectedOutcomes}</td></tr>` : ''}
          ${formData.additionalNotes ? `<tr><td style="padding: 5px; font-weight: bold; vertical-align: top;">Additional Notes:</td><td style="padding: 5px;">${formData.additionalNotes}</td></tr>` : ''}
        </table>
      </div>
    `;
  }

  /**
   * Render conversation context section
   * @param {Object} formData - Form data
   * @returns {string} - HTML content
   */
  renderConversationContext(formData) {
    const hasContext = formData.discussedSolutions?.length > 0 || formData.conversationContext;
    
    if (!hasContext) return '';

    return `
      <div style="margin-top: 20px;">
        <h3 style="color: #2c3e50; margin-bottom: 15px;">Conversation Context</h3>
        ${formData.discussedSolutions?.length > 0 ? `
          <div style="margin-bottom: 10px;">
            <strong>Solutions Discussed:</strong>
            <ul style="margin: 5px 0; padding-left: 20px;">
              ${formData.discussedSolutions.map(solution => `<li>${solution}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
        ${formData.conversationContext ? `
          <div>
            <strong>Conversation Summary:</strong>
            <p style="margin: 5px 0; padding: 10px; background-color: #f8f9fa; border-radius: 3px;">
              ${formData.conversationContext}
            </p>
          </div>
        ` : ''}
      </div>
    `;
  }

  /**
   * Generate plain text version of the email
   * @param {Object} formData - Form data
   * @returns {string} - Plain text content
   */
  generateTextContent(formData) {
    const leadScore = this.calculateLeadScore(formData);
    const timestamp = new Date().toLocaleString();
    
    return `
NEW LEAD INQUIRY - ${this.getLeadScorePriority(leadScore)} Priority (Score: ${leadScore}/100)

Contact Information:
- Name: ${formData.name}
- Email: ${formData.email}
- Company: ${formData.company}
${formData.phone ? `- Phone: ${formData.phone}` : ''}

Project Details:
${formData.industry ? `- Industry: ${formData.industry}` : ''}
- Project Scope: ${formData.projectScope}
- Primary Challenge: ${formData.primaryChallenge}
${formData.currentSolution ? `- Current Solution: ${formData.currentSolution}` : ''}

Requirements & Budget:
- Budget Range: ${this.formatBudgetRange(formData.budgetRange)}
- Timeline: ${this.formatTimeline(formData.timeline)}
- Urgency: ${this.formatUrgency(formData.urgency)}
${formData.teamSize ? `- Team Size: ${formData.teamSize}` : ''}

${formData.specificRequirements ? `Specific Requirements: ${formData.specificRequirements}` : ''}
${formData.expectedOutcomes ? `Expected Outcomes: ${formData.expectedOutcomes}` : ''}
${formData.additionalNotes ? `Additional Notes: ${formData.additionalNotes}` : ''}

Submitted: ${timestamp}
Source: AI Co-Pilot
Response Time: ${this.getResponseTime(formData.urgency)}
    `.trim();
  }

  /**
   * Submit via API endpoint
   * @param {Object} emailContent - Email content object
   * @param {Object} formData - Form data
   * @returns {Promise} - API response
   */
  async submitViaAPI(emailContent, formData) {
    const response = await fetch(this.emailEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: this.fallbackEmail,
        subject: emailContent.subject,
        html: emailContent.html,
        text: emailContent.text,
        leadData: formData,
        leadScore: emailContent.leadScore,
        timestamp: emailContent.timestamp
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  /**
   * Submit via mailto (fallback for development)
   * @param {Object} emailContent - Email content object
   * @param {Object} formData - Form data
   * @returns {Promise} - Success response
   */
  async submitViaMailto(emailContent, formData) {
    // Create mailto link
    const mailtoLink = `mailto:${this.fallbackEmail}?subject=${encodeURIComponent(emailContent.subject)}&body=${encodeURIComponent(emailContent.text)}`;
    
    // Open mailto link
    window.open(mailtoLink, '_blank');
    
    // Also log to console for development
    console.log('Lead Submission:', {
      formData,
      emailContent,
      mailtoLink
    });
    
    // Return success response
    return { success: true, method: 'mailto' };
  }

  /**
   * Submit via EmailJS
   * @param {Object} emailContent - Email content object
   * @param {Object} formData - Form data
   * @returns {Promise} - EmailJS response
   */
  async submitViaEmailJS(emailContent, formData) {
    try {
      // Initialize EmailJS if not already done
      if (!emailjs.init) {
        console.error('EmailJS not properly imported');
        throw new Error('EmailJS not properly imported');
      }

      // Use the same simple template parameters as the working Contact component
      const templateParams = {
        from_name: formData.name,
        to_name: "JEDI Labs Team",
        from_email: formData.email,
        to_email: this.fallbackEmail,
        message: emailContent.text
      };

      console.log('EmailJS Config:', this.emailjsConfig);
      console.log('Submitting lead via EmailJS with params:', templateParams);

      const response = await emailjs.send(
        this.emailjsConfig.serviceId,
        this.emailjsConfig.templateId,
        templateParams,
        this.emailjsConfig.publicKey
      );

      console.log('EmailJS response:', response);
      
      if (response.status === 200) {
        return { success: true, method: 'emailjs', response };
      } else {
        throw new Error(`EmailJS failed with status: ${response.status}`);
      }
    } catch (error) {
      console.error('EmailJS submission error:', error);
      throw error; // Re-throw to trigger fallback
    }
  }
}

// Export singleton instance
export const contactFormService = new ContactFormService();