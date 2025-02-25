import { Resend } from 'resend';

const resend = new Resend(import.meta.env.VITE_RESEND_API_KEY);

interface SendEmailParams {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
}

export const sendEmail = async ({ firstName, lastName, email, message }: SendEmailParams) => {
  if (!import.meta.env.VITE_RESEND_API_KEY) {
    throw new Error('La clé API Resend n\'est pas configurée.');
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: ['david@pilotage-parapente.com'],
      reply_to: email,
      subject: `Message de ${firstName} ${lastName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #F15A24;">Nouveau message de contact - Mes SIV</h2>
          <p><strong>De :</strong> ${firstName} ${lastName}</p>
          <p><strong>Email :</strong> ${email}</p>
          <p><strong>Message :</strong></p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin-top: 10px;">
            ${message.split('\n').map(line => `<p style="margin: 0 0 10px 0;">${line}</p>`).join('')}
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('Erreur Resend:', error);
      throw new Error(
        'Une erreur est survenue lors de l\'envoi du message. ' +
        'Veuillez réessayer plus tard ou contacter directement david@pilotage-parapente.com'
      );
    }

    return data;
  } catch (error: any) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    if (error.message.includes('Failed to fetch')) {
      throw new Error(
        'Impossible de se connecter au service d\'envoi d\'emails. ' +
        'Veuillez vérifier votre connexion internet et réessayer.'
      );
    }
    throw error;
  }
};