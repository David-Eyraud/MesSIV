import React, { useState } from 'react';
import { User, KeyRound, AlertTriangle, Cookie } from 'lucide-react';
import { useAuthStore } from '../lib/store';
import AuthForm from '../components/AuthForm';
import ConfirmDialog from '../components/ConfirmDialog';
import { supabase } from '../lib/supabase';
import { CookieSettings } from '../components/CookieSettings';

const Account = () => {
  const { user, signOut, loading } = useAuthStore();
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showCookieSettings, setShowCookieSettings] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (newPassword !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (newPassword.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setUpdating(true);
    setError(null);
    setSuccess(null);

    try {
      // Vérifier l'ancien mot de passe
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email!,
        password: currentPassword,
      });

      if (signInError) {
        throw new Error('Le mot de passe actuel est incorrect');
      }

      // Mettre à jour le mot de passe
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) throw updateError;

      setSuccess('Votre mot de passe a été mis à jour avec succès');
      setShowPasswordForm(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    setDeleting(true);

    try {
      // Supprimer les évaluations
      const { error: evaluationsError } = await supabase
        .from('evaluations')
        .delete()
        .eq('user_id', user.id);

      if (evaluationsError) throw evaluationsError;

      // Supprimer les stages
      const { error: coursesError } = await supabase
        .from('courses')
        .delete()
        .eq('user_id', user.id);

      if (coursesError) throw coursesError;

      // Supprimer le profil
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Supprimer le compte
      const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id);
      if (deleteError) throw deleteError;

      await signOut();
    } catch (error) {
      console.error('Erreur lors de la suppression du compte:', error);
      alert('Une erreur est survenue lors de la suppression du compte');
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-2 py-2">
      <div className="text-center mb-3">
        <h1 className="text-3xl font-bold text-primary mb-1">Mon Compte</h1>
        <p className="text-lg text-gray-600">
          Gérez vos informations personnelles
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4">
        {user ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <p className="text-gray-900">{user.email}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prénom
                </label>
                <p className="text-gray-900">{user.user_metadata.first_name}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom
                </label>
                <p className="text-gray-900">{user.user_metadata.last_name}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200 space-y-4">
              <div>
                <button
                  onClick={() => setShowPasswordForm(!showPasswordForm)}
                  className="flex items-center gap-2 text-primary hover:text-primary-600 font-medium"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>Changer mon mot de passe</span>
                </button>

                {showPasswordForm && (
                  <form onSubmit={handlePasswordUpdate} className="mt-4 space-y-4">
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                        Mot de passe actuel
                      </label>
                      <input
                        type="password"
                        id="currentPassword"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                        Nouveau mot de passe
                      </label>
                      <input
                        type="password"
                        id="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        minLength={6}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                        Confirmer le nouveau mot de passe
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        minLength={6}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                      />
                    </div>

                    {error && (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex gap-3">
                          <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                          <p className="text-red-700 text-sm">{error}</p>
                        </div>
                      </div>
                    )}

                    {success && (
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-green-700 text-sm">{success}</p>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setShowPasswordForm(false);
                          setError(null);
                          setSuccess(null);
                          setCurrentPassword('');
                          setNewPassword('');
                          setConfirmPassword('');
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Annuler
                      </button>
                      <button
                        type="submit"
                        disabled={updating}
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                      >
                        {updating ? 'Mise à jour...' : 'Mettre à jour'}
                      </button>
                    </div>
                  </form>
                )}
              </div>

              <div>
                <button
                  onClick={() => setShowCookieSettings(!showCookieSettings)}
                  className="flex items-center gap-2 text-primary hover:text-primary-600 font-medium"
                >
                  <Cookie className="w-4 h-4" />
                  <span>Gérer les cookies</span>
                </button>

                {showCookieSettings && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <CookieSettings onClose={() => setShowCookieSettings(false)} />
                  </div>
                )}
              </div>

              <div>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="text-red-600 hover:text-red-800 font-medium"
                >
                  Supprimer mon compte
                </button>
              </div>

              <div>
                <button
                  onClick={() => signOut()}
                  className="text-gray-600 hover:text-gray-800 font-medium"
                >
                  Se déconnecter
                </button>
              </div>
            </div>
          </div>
        ) : (
          <AuthForm />
        )}
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteAccount}
        title="Supprimer votre compte"
        message="Cette action va définitivement supprimer votre compte et toutes vos données (stages, évaluations, etc.). Cette action est irréversible. Êtes-vous sûr de vouloir continuer ?"
      />
    </div>
  );
};

export default Account;