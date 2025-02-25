import React, { useEffect, useState } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const COOKIE_CONSENT_KEY = 'cookie-consent';

interface CookieSettings {
  necessary: boolean;
  analytics: boolean;
}

export const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [settings, setSettings] = useState<CookieSettings>({
    necessary: true, // Toujours true car nécessaire
    analytics: false,
  });

  useEffect(() => {
    // Vérifie si le consentement a déjà été donné
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      setIsVisible(true);
    } else {
      try {
        const savedSettings = JSON.parse(consent);
        setSettings(savedSettings);
      } catch (error) {
        setIsVisible(true);
      }
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
    };
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(allAccepted));
    setSettings(allAccepted);
    setIsVisible(false);
  };

  const handleAcceptNecessary = () => {
    const necessaryOnly = {
      necessary: true,
      analytics: false,
    };
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(necessaryOnly));
    setSettings(necessaryOnly);
    setIsVisible(false);
  };

  const handleSaveSettings = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(settings));
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 p-4 z-50">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Paramètres des cookies
              </h3>
              <p className="text-gray-600 text-sm">
                Nous utilisons des cookies pour améliorer votre expérience sur notre site. Vous pouvez choisir les cookies que vous acceptez. Pour en savoir plus, consultez notre{' '}
                <Link to="/legal" className="text-primary hover:text-primary-600">
                  politique de confidentialité
                </Link>.
              </p>
            </div>

            <div className="mb-4">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="flex items-center gap-2 text-primary hover:text-primary-600"
              >
                <span className="text-sm">
                  {showDetails ? 'Masquer les détails' : 'Afficher les détails'}
                </span>
                {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>

            {showDetails && (
              <div className="mb-6 space-y-4">
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
            )}

            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleAcceptAll}
                className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary-600 transition-colors"
              >
                Tout accepter
              </button>
              <button
                onClick={handleAcceptNecessary}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Accepter nécessaires uniquement
              </button>
              {showDetails && (
                <button
                  onClick={handleSaveSettings}
                  className="px-4 py-2 bg-gray-800 text-white rounded-md text-sm font-medium hover:bg-gray-700 transition-colors"
                >
                  Enregistrer mes choix
                </button>
              )}
            </div>
          </div>

          <button
            onClick={handleAcceptNecessary}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};