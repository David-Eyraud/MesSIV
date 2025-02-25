import React from 'react';
import ScrollToTop from '../components/ScrollToTop';

const About = () => {
  return (
    <div className="max-w-5xl mx-auto px-2 py-2">
      <ScrollToTop />
      <div className="text-center mb-3">
        <h1 className="text-3xl font-bold text-primary mb-1">À Propos</h1>
      </div>

      <div className="space-y-8">
        {/* À propos de l'application */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">À propos de l'application</h2>
          <div className="prose max-w-none text-gray-700 space-y-4">
            <p>
              Mes SIV est une application conçue pour vous accompagner dans votre progression lors de vos stages SIV (Simulation d'Incidents en Vol).
              Vous pouvez suivre votre progression sur de très nombreux exercices et en garder une trace.
            </p>
            
            <div className="space-y-2">
              <p>
                <strong>Pour commencer :</strong>
              </p>
              <ol className="list-decimal list-inside space-y-2">
                <li>Commencez par créer votre compte en allant sur la page Mon compte.</li>
                <li>Ensuite créez un stage. Rendez-vous sur la page Mes stages et remplissez le formulaire. Si vous ne créez pas de stage avec la date et la structure, votre moniteur ne pourra pas vous évaluer.</li>
              </ol>
            </div>

            <p>
              La page « Ma Progression » affiche tous les exercices dans une carte avec les principales informations. Si vous cliquez sur la carte, vous obtenez davantage d'informations sur l'exercice en question.
            </p>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-medium mb-2">Vous pouvez vous auto-évaluer sur chaque manœuvre :</p>
              <ul className="list-disc list-inside space-y-1">
                <li>0 : Pas encore travaillé</li>
                <li>1 : Vu mais pas maîtrisé du tout</li>
                <li>2 : Irrégulier (je commence à comprendre mais je commets encore souvent des erreurs)</li>
                <li>3 : Compris mais il faut encore travailler</li>
                <li>4 : Assez bien maîtrisé</li>
                <li>5 : Parfaitement maîtrisé durant ce stage</li>
              </ul>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-medium mb-2">Votre moniteur peut vous donner son évaluation finale en fin de stage. Un logo apparaît alors pour chaque exercice travaillé avec une mention :</p>
              <ul className="list-disc list-inside space-y-1">
                <li>1 : Vu mais pas maîtrisé du tout : il faut revenir en stage pour poursuivre le travail.</li>
                <li>2 : Compris mais irrégulier : il faut travailler soit en stage, soit « à la maison » mais à vos risques et périls.</li>
                <li>3 : Maîtrisé : bravo, vous avez fait preuve d'une bonne maîtrise de cet exercice au cours de ce stage.</li>
              </ul>
            </div>

            <p>
              Vous gardez ainsi une trace précise de vos acquis d'un stage à l'autre.
            </p>

            <p>
              L'application vous permet d'afficher les exercices travaillés au cours de chaque stage que vous avez renseigné. Vous pouvez également afficher votre progression globale, c'est-à-dire le mélange de tous les stages. Dans ce cas, si un exercice a été réalisé sur plusieurs stages, l'évaluation qui apparaît est celle du stage le plus récent.
            </p>

            <p>
              Vous pouvez filtrer les exercices pour que l'application n'affiche pas une trop longue liste, par exemple vous pouvez trier par niveau (Brevet de pilote, brevet de pilote confirmé, voltige).
            </p>

            <p>
              Mes SIV devient ainsi votre carnet de progression personnalisé, vous accompagnant dans votre développement en tant que pilote, stage après stage.
            </p>
          </div>
        </div>

        {/* À propos de l'auteur */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">À propos de l'auteur</h2>
          <div className="prose max-w-none text-gray-700 space-y-6">
            <p>
              L'application a été développée par David Eyraud en collaboration avec d'autres moniteurs spécialisés en SIV.
              David à plus de 25 ans d'expérience dans les stages de SIV.
            </p>

            <p>
              A l'origine de la réforme des techniques d'enseignement du pilotage, David est le père fondateur des stages de pilotage. Il est également à l'origine de la reconnaissance de la voltige en France mais aussi au niveau international.
            </p>

            <p>
              David découvre le parapente en 1988, avec une bande de copains. Complètement mordu, il enchaîne les vols et devient vite un pionnier de la voltige. David consacre plus de 10 ans à ne vivre que de vol et d'eau fraîche. Il travaille pour quelques marques comme technicien commercial et pilote d'essai. David participe à de nombreuses démonstrations aux quatre coins du monde et aux premières compétitions d' « acrobatie » à partir des années 1995 où il se place souvent sur les podiums. Il se fait remarquer par son style très fluide et très propre.
            </p>

            <div>
              <h3 className="text-xl font-medium text-gray-900 mb-3">David et l'enseignement du pilotage</h3>
              <p>
                David est rapidement convaincu que le savoir faire des pilotes de voltige peut s'avérer d'une grande utilité pour la pratique de monsieur tout le monde. Notamment, par exemple, avec la compréhension du décrochage et de la marche arrière. David fut le premier à réaliser des stages dits de « pilotage » très différents des stages de SIV de l'époque. En 2003, il est à l'initiative d'un séminaire de réflexion avec les cadres techniques de la FFVL et autres spécialistes motivés pour faire évoluer l'apprentissage du pilotage. Il en déboucha une modernisation des techniques d'enseignement du pilotage. La formation des moniteurs a également fortement évolué. David continue de former de futurs moniteurs capables d'enseigner le pilotage.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-medium text-gray-900 mb-3">David et la reconnaissance de la voltige</h3>
              <p>
                David s'est fortement investi pour la reconnaissance de cette forme de pratique et l'intérêt qu'elle apporte dans le domaine du pilotage. Dès 1998, il collabore avec la FFVL pour la reconnaissance de la voltige en France à l'occasion de la première « compétition de voltige » en France (Mad Masters, Vars), où il se classe premier Français. A partir de 2000, David intègre la FAI pour la reconnaissance de la voltige au niveau mondial. Il participe très activement à la mise en place du règlement international et à la formation des juges. En 2003, David participe à l'organisation des premiers championnats de France de voltige (AcroLac, Aiguebelette). En 2006, il est le directeur d'épreuve aux premiers championnats du monde de voltige en parapente (Vertigo, Suisse). En 2005 et 2006, David est également organisateur des Acrofolies (coupe du monde de voltige sur le lac d'Annecy) qui connurent un bref mais grand succès.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;