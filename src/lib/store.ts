import { create } from 'zustand';
import { supabase } from './supabase';
import { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  session: any | null;
  loading: boolean;
  lastMetadataUpdate: number;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  setSession: (session: any) => void;
  updateUserMetadata: () => Promise<void>;
}

const METADATA_UPDATE_INTERVAL = 60000; // 1 minute

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const retryOperation = async <T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000
): Promise<T> => {
  let lastError: any;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;
      
      // Si ce n'est pas une erreur de limite de taux, ne pas réessayer
      if (!error.message?.includes('rate_limit')) {
        throw error;
      }
      
      // Attendre avant de réessayer avec un délai exponentiel
      await delay(baseDelay * Math.pow(2, i));
    }
  }
  
  throw lastError;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  loading: true,
  lastMetadataUpdate: 0,
  signIn: async (email: string, password: string) => {
    const { error, data } = await retryOperation(() => 
      supabase.auth.signInWithPassword({
        email,
        password,
      })
    );
    
    if (error) throw error;

    set({ user: data.user, session: data.session });
  },
  signUp: async (email: string, password: string, firstName: string, lastName: string) => {
    // Créer l'utilisateur sans vérification d'email
    const { error: signUpError, data } = await retryOperation(() =>
      supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      })
    );

    if (signUpError) throw signUpError;

    if (!data.user) {
      throw new Error('Une erreur est survenue lors de la création du compte');
    }

    // Créer le profil immédiatement après la création de l'utilisateur
    const { error: profileError } = await retryOperation(() =>
      supabase
        .from('profiles')
        .upsert([
          {
            id: data.user.id,
            first_name: firstName,
            last_name: lastName,
            email: email,
            is_instructor: false
          }
        ])
    );

    if (profileError) {
      console.error('Error creating profile:', profileError);
      // Si la création du profil échoue, on supprime l'utilisateur
      await supabase.auth.admin.deleteUser(data.user.id);
      throw new Error('Erreur lors de la création du profil');
    }

    // Connecter l'utilisateur directement
    set({ user: data.user, session: data.session });
  },
  signOut: async () => {
    try {
      const { error } = await retryOperation(() => supabase.auth.signOut());
      if (error) throw error;
      set({ user: null, session: null, lastMetadataUpdate: 0 });
    } catch (error) {
      console.error('Error signing out:', error);
      // On réinitialise quand même l'état
      set({ user: null, session: null, lastMetadataUpdate: 0 });
    }
  },
  resetPassword: async (email: string) => {
    const { error } = await retryOperation(() =>
      supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/account?reset=true',
      })
    );
    if (error) throw error;
  },
  setSession: async (session) => {
    const user = session?.user ?? null;
    set({ session, user, loading: false });
  },
  updateUserMetadata: async () => {
    const state = get();
    const now = Date.now();

    // Ne mettre à jour que si la dernière mise à jour date de plus d'une minute
    if (now - state.lastMetadataUpdate < METADATA_UPDATE_INTERVAL) {
      return;
    }

    try {
      const { data: { user } } = await retryOperation(() => supabase.auth.getUser());
      if (!user) return;

      // Récupérer le profil de l'utilisateur
      const { data: profile, error: profileError } = await retryOperation(() =>
        supabase
          .from('profiles')
          .select('is_instructor')
          .eq('id', user.id)
          .single()
      );

      if (profileError) {
        // Si le profil n'existe pas, on le crée
        if (profileError.code === 'PGRST116') {
          const { error: insertError } = await retryOperation(() =>
            supabase
              .from('profiles')
              .upsert([
                {
                  id: user.id,
                  first_name: user.user_metadata.first_name || '',
                  last_name: user.user_metadata.last_name || '',
                  email: user.email || '',
                  is_instructor: false
                }
              ])
          );

          if (insertError) throw insertError;
        } else {
          throw profileError;
        }
      }

      if (profile) {
        // Mettre à jour les métadonnées de l'utilisateur
        const { data: updatedUser } = await retryOperation(() =>
          supabase.auth.updateUser({
            data: {
              ...user.user_metadata,
              is_instructor: profile.is_instructor
            }
          })
        );

        if (updatedUser.user) {
          set({ user: updatedUser.user, lastMetadataUpdate: now });
        }
      }
    } catch (error) {
      console.error('Error updating user metadata:', error);
    }
  },
}));

// Initialiser la session au chargement
supabase.auth.getSession().then(({ data: { session } }) => {
  useAuthStore.getState().setSession(session);
});

// Écouter les changements de session
supabase.auth.onAuthStateChange((_event, session) => {
  useAuthStore.getState().setSession(session);
  // Mettre à jour les métadonnées uniquement après un changement de session
  if (session) {
    useAuthStore.getState().updateUserMetadata();
  }
});