import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface CookieSettings {
  necessary: boolean;
  analytics: boolean;
}

const COOKIE_CONSENT_KEY = 'cookie-consent';

interface Props {
  onClose?: () => void;
}

export const CookieSettings = ({ onClose }: Props) => {
  const [settings, setSettings] = useState<CookieSettings>({
    necessary: true,
    analytics: false,
  });
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (consent) {
      try {
        const savedSettings = JSON.parse(consent);
        setSettings(savedSettings);
      } catch (error) {
        console.error('Erreur lors de la lecture des paramètres de cookies:', error);
      }
    }
  }, []);

  const handleSaveSettings = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(settings));
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      if (onClose) onClose();
    }, 1500);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Paramètres des cookies
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            Gérez vos préférences concernant l'utilisation des cookies sur notre site.
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="pt-0.5">
            <input
              type="checkbox"
              id="necessary"
              checked={settings.necessary}
              disabled
              className="rounded border-gray-300 text-primary focus:ring-primary cursor-not-allowed opacity-60"
            />
          </div>
          <div>
            <label htmlFor="necessary" className="block text-sm font-medium text-gray-900">
              Cookies nécessaires
            </label>
            <p className="text-sm text-gray-500">
              Ces cookies sont indispensables au fonctionnement du site et ne peuvent pas être désactivés.
              Ils permettent notamment l'authentification, la sauvegarde de votre session, de vos stages et de vos évaluations.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="pt-0.5">
            <input
              type="checkbox"
              id="analytics"
              checked={settings.analytics}
              onChange={(e) => setSettings({ ...settings, analytics: e.target.checked })}
              className="rounded border-gray-300 text-primary focus:ring-primary"
            />
          </div>
          <div>
            <label htmlFor="analytics" className="block text-sm font-medium text-gray-900">
              Cookies d'analyse
            </label>
            <p className="text-sm text-gray-500">
              Ces cookies nous permettent d'analyser l'utilisation du site pour en améliorer les fonctionnalités.
            </p>
          </div>
        </div>
      </div>

      <div className="pt-4 flex items-center justify-between">
        <button
          onClick={handleSaveSettings}
          className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary-600 transition-colors"
        >
          Enregistrer mes préférences
        </button>

        {success && (
          <div className="text-green-600 text-sm font-medium animate-fade-in">
            Préférences enregistrées !
          </div>
        )}
      </div>
    </div>
  );
};