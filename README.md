# NovaTech NetworkLab

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![CI](https://github.com/Malivert/novatech-networklab/actions/workflows/ci.yml/badge.svg)](https://github.com/Malivert/novatech-networklab/actions/workflows/ci.yml)

Plateforme pédagogique et simulateur interactif de diagnostic des incidents réseau d’une PME fictive, conçue pour démontrer les compétences **BTS SIO option SISR** en TCP/IP, DNS, DHCP, VLAN, pare-feu et résolution de pannes.

> Apprenez une notion, validez-la avec un quiz, puis diagnostiquez une panne réaliste directement depuis votre navigateur.

## Démonstration en ligne

[Ouvrir NovaTech NetworkLab](https://novatech-networklab.vercel.app)

## Aperçu

L’application propose huit cours réseau avec quiz, un centre de supervision, une topologie réseau interactive, un terminal PowerShell simulé, des journaux techniques filtrables, des corrections et un rapport d’intervention.

Les captures de l’accueil et du centre de supervision sont conservées dans `public/screenshots/` lors de la publication.

## Fonctionnalités

- topologie interactive de onze équipements avec zoom, déplacement et inspection ;
- six VLAN réalistes de la Direction au Wi-Fi invités ;
- six scénarios entièrement fonctionnels sur trois difficultés ;
- huit cours structurés, vingt-quatre questions de quiz et une progression locale ;
- passage direct de chaque cours vers un défi pratique associé ;
- terminal simulant `ipconfig`, `ping`, `nslookup`, `tracert`, `arp`, `route`, `netstat` et `Test-NetConnection` ;
- sorties différentes avant et après correction ;
- trajet de paquet animé qui s’arrête sur l’équipement en cause ;
- journaux Windows, DNS, DHCP, pare-feu, switch et connexion ;
- actions de correction avec pénalités en cas d’erreur ;
- score sur 100 valorisant la méthode plus que la vitesse ;
- progression locale, thème clair/sombre et mode recruteur de moins de deux minutes ;
- rapport d’intervention copiable et imprimable en PDF ;
- interface accessible et responsive.

## Scénarios

1. Serveur DNS incorrect — Débutant
2. Mauvaise passerelle par défaut — Débutant
3. Mauvais VLAN — Intermédiaire
4. Étendue DHCP épuisée — Intermédiaire
5. Règle de pare-feu bloquante — Avancé
6. Conflit d’adresses IP — Avancé

## Cours

1. Les bases d’un réseau informatique
2. Adressage IPv4 et masque de sous-réseau
3. DHCP et attribution des adresses IP
4. DNS et résolution de noms
5. Routeurs, commutateurs et VLAN
6. Commandes de diagnostic réseau
7. Sécurité réseau et pare-feu
8. Révision finale et méthode d’incident

## Technologies

- Next.js App Router, React et TypeScript strict ;
- `@xyflow/react` pour la topologie ;
- Lucide React pour les icônes ;
- CSS responsive personnalisé ;
- `localStorage` pour les préférences et la progression ;
- Vitest, ESLint et GitHub Actions ;
- Vercel pour l’hébergement.

Aucune base distante ni authentification n’est utilisée. Supabase ne fait pas partie des dépendances du projet.

## Installation locale

Prérequis : Node.js 20.9 ou supérieur et npm.

```bash
git clone https://github.com/Malivert/novatech-networklab.git
cd novatech-networklab
npm ci
npm run dev
```

Ouvrir ensuite `http://localhost:3000`.

## Commandes

```bash
npm run dev        # développement
npm run lint       # qualité ESLint
npm run typecheck  # TypeScript strict
npm test           # tests automatisés
npm run build      # compilation de production
```

## Architecture

```text
app/                     routes et styles
components/network/      topologie et paquets
components/terminal/     terminal interactif
components/courses/      parcours pédagogique et quiz
data/                    cours, équipements et scénarios
lib/terminal.ts          moteur de commandes
lib/scoring.ts           score sur 100
lib/storage.ts           progression locale
types/                   contrats TypeScript
tests/                   tests automatisés
documentation/           architecture et guides
```

Voir [l’architecture](documentation/architecture.md), [les scénarios](documentation/scenarios.md) et [les tests](documentation/tests.md).

## Fonctionnement du terminal

Le moteur normalise la commande puis produit une sortie déterministe selon le scénario courant et l’état de la correction. Par exemple, le ping vers `8.8.8.8` fonctionne dans la panne DNS tandis que `nslookup` expire. Après la bonne correction, `nslookup` retourne le serveur `10.50.0.10`.

Le terminal prend en charge l’historique avec les flèches, une autocomplétion simple avec Tab, la copie et l’effacement.

## Fonctionnement du score

- diagnostic pertinent : 40 points ;
- bonne correction : 30 points ;
- validation finale : 15 points ;
- méthode logique : 15 points ;
- indices, mauvaises corrections et répétitions : pénalités.

## Compétences BTS SIO SISR

- répondre aux incidents et demandes d’assistance ;
- exploiter et dépanner un réseau IP ;
- mettre à disposition et valider un service ;
- sécuriser une infrastructure ;
- documenter une intervention ;
- travailler en mode projet ;
- organiser son développement professionnel.

## Parcours recruteur

Le bouton dédié lance une panne DNS courte :

1. lire l’incident ;
2. exécuter `ping` et `nslookup` ;
3. observer le trajet du paquet ;
4. corriger le DNS ;
5. vérifier le retour du service ;
6. consulter le score et le rapport.

## Limites et améliorations

Le trafic, les équipements et les commandes sont simulés : l’application n’envoie aucun paquet réel. Les prochaines évolutions possibles sont un éditeur de scénarios, un mode équipe et davantage de protocoles.

## Auteur

**Christian Malivert** — étudiant BTS SIO option SISR.

## Licence

Projet distribué sous licence MIT.
