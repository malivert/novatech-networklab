<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Contrat de stabilité NovaTech NetworkLab

Ces règles s’appliquent à toute amélioration réalisée par un agent ou par ChatGPT :

1. Travailler depuis la branche `main` à jour dans une branche courte dédiée.
2. Ne jamais modifier ni mélanger le dépôt `helpdesk-novatech`.
3. Centraliser toute nouvelle route dans `lib/navigation.ts`.
4. Ajouter ou adapter les tests correspondant à chaque changement de comportement.
5. Exécuter `npm run verify` avec Node.js 22 avant toute publication.
6. Ne jamais publier ni promouvoir un déploiement dont un contrôle échoue.
7. Mettre GitHub à jour avant Vercel et conserver le dernier déploiement fonctionnel pour le retour arrière.
8. Ne jamais ajouter de secret, de compte obligatoire ou de dépendance distante sans demande explicite.

Si une vérification est impossible dans l’environnement courant, arrêter la publication et signaler
précisément le contrôle manquant. Une amélioration incomplète ne doit pas remplacer la production.
