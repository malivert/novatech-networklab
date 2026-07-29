# Architecture

NovaTech NetworkLab est une application Next.js App Router dont la simulation s’exécute entièrement dans le navigateur.

## Découpage

- `app/` : routes, métadonnées et styles globaux ;
- `components/network/` : topologie React Flow et trajet du paquet ;
- `components/terminal/` : saisie, historique et affichage des commandes ;
- `components/courses/` : navigation des modules, leçons et quiz ;
- `data/` : cours, équipements, VLAN et scénarios ;
- `lib/terminal.ts` : interprétation déterministe des commandes ;
- `lib/scoring.ts` : calcul du score sur 100 ;
- `lib/storage.ts` : lecture, écriture et fusion de la progression locale ;
- `types/` : contrats TypeScript ;
- `tests/` : tests du catalogue, du terminal, du score et du stockage.

## Flux d’une intervention

1. Le visiteur choisit un scénario.
2. Le terminal produit des sorties selon le scénario et son état corrigé ou non.
3. Les journaux et la topologie apportent des preuves complémentaires.
4. Le visiteur applique une action.
5. Le trajet du paquet valide le retour du service.
6. Le moteur de score valorise diagnostic, correction, validation et méthode.
7. Le rapport est généré depuis l’historique de la session.

## Flux pédagogique

1. Le visiteur choisit l’un des huit modules.
2. Trois sections présentent les notions et exemples essentiels.
3. Un quiz de trois questions vérifie la compréhension.
4. Un score d’au moins 67 % valide le module.
5. Le visiteur lance le défi pratique associé.
6. Le meilleur score et le nombre de tentatives restent disponibles localement.

## Persistance

Seuls le thème, les meilleurs résultats des défis et les scores des cours sont conservés dans `localStorage`. Une erreur de quota, de sécurité ou de JSON est interceptée et ne bloque jamais l’application.

## Sécurité et confidentialité

L’application n’utilise aucune authentification, aucune base distante, aucune variable d’environnement et aucune clé. Les commandes sont simulées et ne lancent aucun processus sur la machine du visiteur.
