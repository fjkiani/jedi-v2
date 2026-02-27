/**
 * Job application submission service
 * Uses EmailJS to send applications (same pattern as contactFormService)
 */
import emailjs from '@emailjs/browser';

const EMAILJS_CONFIG = {
  serviceId: 'service_pbft5vk',
  templateId: 'template_0wxfg2m',
  publicKey: 'uJYd4pcG3X27kg7z-',
};
const FALLBACK_EMAIL = 'fjkiani1@gmail.com';

export const jobApplicationService = {
  async submitApplication(formData) {
    const templateParams = {
      from_name: formData.name,
      to_name: 'JEDI Labs Hiring',
      from_email: formData.email,
      to_email: FALLBACK_EMAIL,
      message: [
        `Job Application: ${formData.jobTitle || 'General'}`,
        `Name: ${formData.name}`,
        `Email: ${formData.email}`,
        formData.phone ? `Phone: ${formData.phone}` : '',
        formData.resumeUrl ? `Resume/LinkedIn: ${formData.resumeUrl}` : '',
        formData.message ? `\nCover Letter / Message:\n${formData.message}` : '',
      ]
        .filter(Boolean)
        .join('\n'),
    };

    try {
      emailjs.init(EMAILJS_CONFIG.publicKey);
      const response = await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateId,
        templateParams,
        EMAILJS_CONFIG.publicKey
      );
      if (response?.status === 200) return { success: true };
      throw new Error('Email delivery failed');
    } catch (err) {
      console.error('Job application submit error:', err);
      throw err;
    }
  },
};
