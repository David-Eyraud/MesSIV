import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../lib/store';

const AuthForm = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const { signIn, signUp, resetPassword } = useAuthStore();

  const validatePassword = (password: string): string | null => {
    if (password.length < 6) {
      return 'Le mot de passe doit contenir au moins 6 caractères';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (isResetPassword) {
        await resetPassword(email);
        setSuccess('Un email de réinitialisation vous a été envoyé.');
      } else if (isSignUp) {
        const passwordError = validatePassword(password);
        if (passwordError) {
          setError(passwordError);
          setLoading(false);
          return;
        }
        await signUp(email, password, firstName, lastName);
      } else {
        await signIn(email, password);
      }
    } catch (err: any) {
      // Traduction des messages d'erreur de Supabase
      let message = err.message;
      if (message.includes('Email not confirmed')) {
        message = 'Email non confirmé. Veuillez vérifier votre boîte de réception.';
      } else if (message.includes('Invalid login credentials')) {
        message = 'Email ou mot de passe incorrect';
      } else if (message.includes('User already registered')) {
        message = 'Un compte existe déjà avec cet email';
      } else if (message.includes('Password should be at least 6 characters')) {
        message = 'Le mot de passe doit contenir au moins 6 caractères';
      } else if (message.includes('violates row-level security policy')) {
        message = 'Une erreur est survenue lors de la création du profil. Veuillez réessayer.';
      } else if (message.includes('email rate limit exceeded')) {
        message = 'Trop de tentatives. Veuillez réessayer dans quelques minutes.';
        setEmailSent(true);
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (isResetPassword) {
    return (
      <div className="max-w-md mx-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Réinitialiser votre mot de passe
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
            </p>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="text-green-600 text-sm">
              {success}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <button
              type="submit"
              disabled={loading || emailSent}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
            >
              {loading ? 'Envoi en cours...' : 'Envoyer le lien'}
            </button>

            <button
              type="button"
              onClick={() => {
                setIsResetPassword(false);
                setError(null);
                setSuccess(null);
                setEmailSent(false);
              }}
              className="text-sm text-primary hover:text-primary-600"
            >
              Retour à la connexion
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        {isSignUp && (
          <>
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                Prénom
              </label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                Nom
              </label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              />
            </div>
          </>
        )}
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Mot de passe
          </label>
          <div className="mt-1 relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 px-3 flex items-center"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-gray-400" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400" />
              )}
            </button>
          </div>
          {isSignUp && (
            <p className="mt-1 text-sm text-gray-500">
              Le mot de passe doit contenir au moins 6 caractères
            </p>
          )}
        </div>

        {error && (
          <div className="text-red-600 text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || emailSent}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
        >
          {loading ? 'Chargement...' : isSignUp ? 'Créer un compte' : 'Se connecter'}
        </button>

        <div className="flex flex-col gap-2 text-center">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError(null);
              setEmailSent(false);
            }}
            className="text-sm text-primary hover:text-primary-600"
          >
            {isSignUp ? 'Déjà un compte ? Se connecter' : 'Pas de compte ? S\'inscrire'}
          </button>

          {!isSignUp && (
            <button
              type="button"
              onClick={() => {
                setIsResetPassword(true);
                setError(null);
                setEmailSent(false);
              }}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Mot de passe oublié ?
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AuthForm;