# Contribuer

Merci de contribuer à NovaTech NetworkLab.

1. Créer une branche courte depuis `main`.
2. Utiliser Node.js 22, version fixée par `.nvmrc` et `package.json`.
3. Ajouter ou modifier un scénario dans `data/scenarios.ts`.
4. Conserver une cause unique, trois indices progressifs et une correction vérifiable.
5. Déclarer toute nouvelle rubrique une seule fois dans `lib/navigation.ts`.
6. Ajouter les cas de test correspondants.
7. Exécuter `npm run verify`.
8. Ouvrir une Pull Request en expliquant le symptôme, la cause et la validation.

Les contributions ne doivent introduire ni secret, ni compte obligatoire, ni dépendance à un service distant.
La branche de production ne doit jamais être mise à jour si une vérification échoue.
