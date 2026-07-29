# Tests

La suite Vitest couvre :

- le chargement et l’unicité des six scénarios ;
- le chargement et l’unicité des huit cours ;
- la validité des vingt-quatre questions et des défis associés ;
- les trois niveaux de difficulté ;
- les sorties DNS, DHCP, pare-feu et ARP avant correction ;
- le changement de résultat après correction ;
- la commande inconnue ;
- la pondération et les pénalités du score ;
- la borne de score entre 0 et 100 ;
- la lecture, l’écriture et les erreurs de stockage local ;
- la conservation des meilleurs résultats de défis et de cours ;
- l’absence de dépendance Supabase dans `package.json`.

## Commandes

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

Le workflow `.github/workflows/ci.yml` exécute les quatre contrôles sur les branches configurées et les Pull Requests.
