# EmailJS Template Setup for Lead Capture

## Template Configuration

1. **Go to EmailJS Dashboard**: https://dashboard.emailjs.com/
2. **Create New Template** with ID: `template_lead_capture`
3. **Use the HTML content** from `emailjs-lead-template.html`

## Required Template Variables

Make sure your EmailJS template includes all these variables:

### Basic Information
- `{{name}}` - Contact name
- `{{time}}` - Timestamp
- `{{message}}` - Summary message
- `{{from_name}}` - Contact name (duplicate for compatibility)
- `{{from_email}}` - Contact email
- `{{to_email}}` - Recipient email (JEDI Labs)
- `{{to_name}}` - Recipient name

### Contact Details
- `{{company}}` - Company name
- `{{phone}}` - Phone number
- `{{industry}}` - Industry sector

### Project Information
- `{{project_scope}}` - Project description
- `{{primary_challenge}}` - Main business challenge
- `{{current_solution}}` - Existing solution (if any)

### Requirements & Budget
- `{{budget_range}}` - Budget range (formatted)
- `{{timeline}}` - Project timeline (formatted)
- `{{urgency}}` - Urgency level (formatted)
- `{{team_size}}` - Team size

### Additional Details
- `{{specific_requirements}}` - Specific technical requirements
- `{{expected_outcomes}}` - Expected project outcomes
- `{{additional_notes}}` - Additional notes

### Lead Scoring & Context
- `{{lead_score}}` - Calculated lead score (0-100)
- `{{lead_priority}}` - Priority level (High/Medium/Low)
- `{{response_time}}` - Recommended response time
- `{{conversation_context}}` - AI conversation summary
- `{{discussed_solutions}}` - Solutions discussed in chat
- `{{lead_source}}` - Lead source (AI Co-Pilot)
- `{{capture_type}}` - Type of lead capture

### Backup
- `{{full_message}}` - Complete plain text version

## Template HTML

Copy the entire content from `emailjs-lead-template.html` into your EmailJS template editor.

## Testing

After creating the template:
1. Test with sample data in EmailJS dashboard
2. Verify all variables are properly replaced
3. Check email formatting in different email clients
4. Test the lead capture flow in the application

## Current Configuration

- **Service ID**: `service_pbft5vk`
- **Template ID**: `template_lead_capture`
- **Public Key**: `uJYd4pcG3X27kg7z-`

The ContactFormService is already configured to use this template ID. 