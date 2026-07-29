# Scénarios

| Identifiant | Niveau | Cause | Preuve centrale | Correction |
|---|---|---|---|---|
| `dns-incorrect` | Débutant | Ancien serveur DNS | Ping IP réussi, nslookup en échec | DNS `10.50.0.10` |
| `gateway-error` | Débutant | Passerelle `10.10.0.254` | Route par défaut incorrecte | Passerelle `10.10.0.1` |
| `wrong-vlan` | Intermédiaire | Port dans le VLAN 30 | Adresse `10.30.0.x` sur le poste comptable | Port dans le VLAN 20 |
| `dhcp-exhausted` | Intermédiaire | Étendue pleine | APIPA et renouvellement en échec | Étendre la plage puis renouveler |
| `firewall-block` | Avancé | TCP 445 bloqué | Ping réussi, port 445 en échec | Règle SMB ciblée |
| `ip-conflict` | Avancé | IPv4 dupliquée | Deux MAC pour `10.30.0.62` | Retirer le doublon |

Chaque scénario possède un contexte, un témoignage, trois indices, des journaux, des commandes attendues, des corrections possibles, une explication et des mesures préventives.

## Ajouter un scénario

Ajouter un objet conforme au type `Scenario`, puis vérifier :

- la présence d’un identifiant unique ;
- trois indices du général au précis ;
- au moins trois commandes pertinentes ;
- une seule action correcte ;
- au moins quatre événements de journal ;
- le résultat avant et après correction dans `lib/terminal.ts` ;
- les tests associés.

