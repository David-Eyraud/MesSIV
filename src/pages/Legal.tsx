import React from 'react';
import ScrollToTop from '../components/ScrollToTop';

const Legal = () => {
  return (
    <div className="max-w-5xl mx-auto px-2 py-2">
      <ScrollToTop />
      <div className="text-center mb-3">
        <h1 className="text-3xl font-bold text-primary mb-1">Mentions Légales</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="prose max-w-none">
          <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Éditeur de l'application</h2>
            <p className="text-gray-700">
              L'application mobile Mes SIV est éditée par :<br />
              David EYRAUD EI<br />
              376 route Simon de Verthier<br />
              74210 Doussard<br />
              Téléphone : 06 62 32 37 41<br />
              Email : david@pilotage-parapente.com<br />
              SIRET : 432 184 240 00021<br />
              Profession libérale
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Hébergement</h2>
            <p className="text-gray-700">
              L'application est hébergée par :<br />
              Netlify, Inc.<br />
              44 Montgomery Street, Suite 300<br />
              San Francisco, California 94104<br />
              United States<br />
              <a href="https://www.netlify.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-600">
                www.netlify.com
              </a>
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Cookies</h2>
            <p className="text-gray-700 mb-3">
              Un cookie est un petit fichier texte déposé sur votre terminal (ordinateur, tablette ou mobile) lors de la visite d'un site web.
            </p>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Cookies utilisés :</h3>
            <ul className="list-disc list-inside mb-3 text-gray-700">
              <li>Cookies de session : nécessaires au fonctionnement de l'application et à votre authentification</li>
              <li>Cookies de préférences : stockent vos choix et préférences d'utilisation</li>
              <li>Cookies de suivi de progression : permettent de sauvegarder votre progression dans les exercices</li>
            </ul>
            <p className="text-gray-700 mb-3">
              <strong>Durée de conservation :</strong> Les cookies sont conservés pour une durée maximale de 13 mois.
            </p>
            <p className="text-gray-700 mb-3">
              <strong>Gestion des cookies :</strong> Vous pouvez à tout moment choisir de désactiver ces cookies depuis votre compte en cliquant sur "Gérer les cookies". Votre navigateur peut également être paramétré pour vous signaler les cookies qui sont déposés dans votre terminal et vous demander de les accepter ou non.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Protection des données personnelles (RGPD)</h2>
            <p className="text-gray-700 mb-3">
              Conformément au Règlement Général sur la Protection des Données (RGPD), nous vous informons que :
            </p>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Les données personnelles collectées sont :</h3>
            <ul className="list-disc list-inside mb-3 text-gray-700">
              <li>Nom et prénom</li>
              <li>Adresse email</li>
              <li>Données liées à l'utilisation de l'application (exercices, stages, évaluations)</li>
            </ul>
            <p className="text-gray-700 mb-3">
              <strong>Finalité du traitement :</strong> Ces données sont nécessaires au bon fonctionnement de l'application et au suivi de votre progression en SIV.
            </p>
            <p className="text-gray-700 mb-3">
              <strong>Durée de conservation :</strong> Les données sont conservées pendant toute la durée d'activité de votre compte. La suppression de votre compte depuis la page "Mon compte" entraîne l'effacement définitif de toutes vos données personnelles de nos serveurs.
            </p>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Droits des utilisateurs :</h3>
            <p className="text-gray-700 mb-3">
              Conformément à la réglementation en vigueur, vous disposez des droits suivants concernant vos données personnelles :
            </p>
            <ul className="list-disc list-inside mb-3 text-gray-700">
              <li>Droit d'accès</li>
              <li>Droit de rectification</li>
              <li>Droit d'effacement</li>
              <li>Droit à la limitation du traitement</li>
              <li>Droit à la portabilité des données</li>
              <li>Droit d'opposition</li>
            </ul>
            <p className="text-gray-700">
              Pour exercer ces droits ou pour toute question relative au traitement de vos données, vous pouvez :
            </p>
            <ul className="list-disc list-inside mb-3 text-gray-700">
              <li>Utiliser la fonction de suppression de compte dans la page "Mon compte" de l'application</li>
              <li>Contacter directement : David EYRAUD - Email : david@pilotage-parapente.com</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Propriété intellectuelle</h2>
            <p className="text-gray-700">
              L'ensemble des éléments constituant l'application Mes SIV (textes, images, logiciels, etc.) est protégé par les lois relatives à la propriété intellectuelle. Toute reproduction ou représentation, en tout ou partie, est interdite sans l'autorisation préalable de David EYRAUD.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Limitation de responsabilité</h2>
            <p className="text-gray-700">
              Les informations contenues dans l'application sont aussi précises que possible et régulièrement mises à jour. Toutefois, elles ne sauraient engager la responsabilité de l'éditeur. L'utilisateur est seul responsable de l'utilisation qu'il fait des informations et contenus présents dans l'application.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Modifications</h2>
            <p className="text-gray-700">
              L'éditeur se réserve le droit de modifier les présentes mentions légales à tout moment. L'utilisateur est invité à les consulter régulièrement.
            </p>
            <p className="text-gray-700 mt-3">
              Dernière mise à jour : 21 février 2025
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Legal;