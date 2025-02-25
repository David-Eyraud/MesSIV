import React, { useState, useEffect, useRef } from 'react';
import { Send, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../lib/store';
import { sendEmail } from '../lib/email';
import ScrollToTop from '../components/ScrollToTop';

const Contact = () => {
  const { user } = useAuthStore();
  const formRef = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: '',
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        firstName: user.user_metadata.first_name || '',
        lastName: user.user_metadata.last_name || '',
        email: user.email || '',
      }));
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;

    setSending(true);
    setError(null);

    try {
      await sendEmail(formData);
      setSent(true);
      setFormData(prev => ({
        ...prev,
        message: '',
      }));
    } catch (err: any) {
      console.error('Erreur d\'envoi:', err);
      setError(
        err.message || 
        'Une erreur est survenue lors de l\'envoi du message. Veuillez réessayer plus tard ou contacter directement david@pilotage-parapente.com'
      );
    } finally {
      setSending(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError(null);
  };

  return (
    <div className="max-w-5xl mx-auto px-2 py-2">
      <ScrollToTop />
      <div className="text-center mb-3">
        <h1 className="text-3xl font-bold text-primary mb-1">Contact</h1>
        <p className="text-lg text-gray-600">
          Pour toute question importante
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          {sent ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Message envoyé !</h3>
              <p className="text-gray-600 mb-6">
                Merci pour votre message. Je vous répondrai dans les plus brefs délais. En période de stage (les mois d'avril, mai, juin, septembre et octobre) il se peut que cela prenne quelques jours.
              </p>
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-primary hover:text-primary-600 font-medium"
              >
                Retour à l'accueil
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-amber-800">
                  <p className="font-medium mb-1">Avant d'envoyer un message :</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Avez-vous bien lu la page "À propos" qui explique le fonctionnement de l'application ?</li>
                    <li>Si vous rencontrez un problème technique, avez-vous essayé de vous déconnecter puis de vous reconnecter ?</li>
                  </ul>
                </div>
              </div>

              <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                      Prénom
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                      Nom
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-red-800 text-sm font-medium mb-1">Une erreur est survenue</p>
                        <p className="text-red-700 text-sm">{error}</p>
                        <p className="text-red-700 text-sm mt-2">
                          Si le problème persiste, vous pouvez envoyer votre message directement à{' '}
                          <a 
                            href="mailto:david@pilotage-parapente.com"
                            className="underline hover:text-red-800"
                          >
                            david@pilotage-parapente.com
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full flex items-center justify-center gap-2 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sending ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Envoi en cours...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Envoyer</span>
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;