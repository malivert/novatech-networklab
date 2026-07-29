# Dossier technique — plan d’adressage NovaTech

Auteur : Christian Malivert
Projet : NovaTech NetworkLab
Périmètre : réseau pédagogique d’une PME fictive

## Objectif

Le plan sépare les fonctions métier dans six VLAN IPv4 privés. Chaque réseau utilise un préfixe
`/24`, soit le masque `255.255.255.0`, afin de rendre le laboratoire lisible et de conserver une
capacité d’évolution de 254 adresses utilisables par VLAN.

## Conventions

- l’adresse `.0` identifie le réseau ;
- l’adresse `.1` est réservée à la passerelle logique ;
- l’adresse `.255` est l’adresse de diffusion ;
- les équipements d’infrastructure utilisent des adresses fixes ;
- les postes utilisateurs sont attribués par DHCP, sauf le poste d’administration ;
- le VLAN 50 Serveurs ne possède aucune plage DHCP ;
- le VLAN 60 Wi-Fi invités ne peut atteindre que Internet.

## Plan synthétique

| VLAN | Usage | Réseau | Passerelle | DHCP | Diffusion |
|---:|---|---|---|---|---|
| 10 | Direction | 10.10.0.0/24 | 10.10.0.1 | 10.10.0.20–10.10.0.199 | 10.10.0.255 |
| 20 | Comptabilité | 10.20.0.0/24 | 10.20.0.1 | 10.20.0.20–10.20.0.199 | 10.20.0.255 |
| 30 | Commercial | 10.30.0.0/24 | 10.30.0.1 | 10.30.0.20–10.30.0.199 | 10.30.0.255 |
| 40 | Informatique | 10.40.0.0/24 | 10.40.0.1 | 10.40.0.50–10.40.0.199 | 10.40.0.255 |
| 50 | Serveurs | 10.50.0.0/24 | 10.50.0.1 | aucune | 10.50.0.255 |
| 60 | Wi-Fi invités | 10.60.0.0/24 | 10.60.0.1 | 10.60.0.50–10.60.0.230 | 10.60.0.255 |

## Contrôles réalisés

La suite de tests du dépôt vérifie automatiquement :

1. l’unicité des réseaux et des identifiants de VLAN ;
2. les bornes réseau, utilisables et diffusion de chaque `/24` ;
3. l’appartenance des passerelles et des plages DHCP au bon sous-réseau ;
4. l’absence de passerelle dans une plage DHCP ;
5. l’appartenance de chaque équipement interne à son VLAN documenté ;
6. la présence des postes DHCP dans leur étendue ;
7. la cohérence des fichiers CSV avec les données affichées dans l’application.

## Portée de la preuve

Ce document est une preuve de conception et de documentation réseau. NovaTech NetworkLab reste
un simulateur : il ne génère pas de trafic réel et ne prétend pas fournir une capture Wireshark ou
un fichier Cisco Packet Tracer.
