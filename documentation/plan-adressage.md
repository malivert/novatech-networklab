# Plan d’adressage NovaTech

Ce document décrit la segmentation IPv4 utilisée par NovaTech NetworkLab. Il constitue une preuve
de conception réseau cohérente avec la topologie, les incidents et les commandes simulés.

## Choix de conception

- plages privées RFC 1918 dans le bloc `10.0.0.0/8` ;
- un VLAN par fonction métier ;
- sous-réseaux `/24` homogènes pour faciliter l’exploitation pédagogique ;
- passerelle logique en `.1` ;
- équipements d’infrastructure placés hors des plages DHCP ;
- serveurs uniquement en adresses fixes ;
- Wi-Fi invités isolé des services internes.

## Segmentation

| VLAN | Usage | Réseau | Masque | Passerelle | DHCP | Diffusion |
|---:|---|---|---|---|---|---|
| 10 | Direction | `10.10.0.0/24` | `255.255.255.0` | `10.10.0.1` | `10.10.0.20–10.10.0.199` | `10.10.0.255` |
| 20 | Comptabilité | `10.20.0.0/24` | `255.255.255.0` | `10.20.0.1` | `10.20.0.20–10.20.0.199` | `10.20.0.255` |
| 30 | Commercial | `10.30.0.0/24` | `255.255.255.0` | `10.30.0.1` | `10.30.0.20–10.30.0.199` | `10.30.0.255` |
| 40 | Informatique | `10.40.0.0/24` | `255.255.255.0` | `10.40.0.1` | `10.40.0.50–10.40.0.199` | `10.40.0.255` |
| 50 | Serveurs | `10.50.0.0/24` | `255.255.255.0` | `10.50.0.1` | aucune | `10.50.0.255` |
| 60 | Wi-Fi invités | `10.60.0.0/24` | `255.255.255.0` | `10.60.0.1` | `10.60.0.50–10.60.0.230` | `10.60.0.255` |

Chaque `/24` contient 256 adresses : une adresse réseau, 254 adresses utilisables et une adresse de
diffusion. La capacité totale documentée est donc de `6 × 254 = 1 524` adresses utilisables.

## Affectations

| Équipement | VLAN | Adresse | Attribution | Usage |
|---|---:|---|---|---|
| FW-NVT-01 | 50 | `10.50.0.1` | Statique | passerelle et filtrage des serveurs |
| RTR-NVT-01 | 40 | `10.40.0.1` | Statique | routage inter-VLAN et gestion |
| SW-CORE-01 | 40 | `10.40.0.2` | Statique | administration du commutateur |
| AP-NVT-01 | 40 | `10.40.0.21` | Statique | gestion de la borne, clients sur VLAN 60 |
| SRV-INFRA-01 | 50 | `10.50.0.10` | Statique | DNS, DHCP et NTP |
| SRV-FICHIERS-01 | 50 | `10.50.0.20` | Statique | SMB et sauvegardes |
| PC-DIR-01 | 10 | `10.10.0.34` | DHCP | Direction |
| PC-CPTA-07 | 20 | `10.20.0.47` | DHCP | Comptabilité |
| PC-COM-12 | 30 | `10.30.0.62` | DHCP | Commercial |
| PC-IT-02 | 40 | `10.40.0.18` | Statique | administration |

## Politique de flux

| Source | Destination | Décision | Justification |
|---|---|---|---|
| VLAN 10 Direction | services internes | autorisé et journalisé | besoins de pilotage |
| VLAN 20 Comptabilité | ERP, fichiers, DNS, DHCP | autorisé | accès limité aux services métier |
| VLAN 30 Commercial | CRM, DNS, DHCP, Internet | autorisé | besoins commerciaux |
| VLAN 40 Informatique | tous les VLAN | autorisé et journalisé | administration et diagnostic |
| VLAN 50 Serveurs | initiations vers postes clients | refusé par défaut | réduction de la surface d’attaque |
| VLAN 60 Invités | réseaux privés NovaTech | refusé | isolation des visiteurs |
| VLAN 60 Invités | Internet | autorisé avec NAT | accès invité contrôlé |

## Validation automatisée

Le fichier `tests/addressing.test.ts` vérifie :

1. l’unicité des VLAN et des réseaux ;
2. le masque, les bornes et la diffusion de chaque `/24` ;
3. la présence des plages DHCP dans leur sous-réseau ;
4. l’exclusion des passerelles et adresses fixes des plages DHCP ;
5. l’appartenance de chaque équipement au VLAN déclaré ;
6. la présence des postes dynamiques dans leur étendue ;
7. la cohérence des fichiers CSV publics avec les données de l’application.

## Livrables

- [`plan-vlans-novatech.csv`](../public/preuves/plan-vlans-novatech.csv) ;
- [`inventaire-ip-novatech.csv`](../public/preuves/inventaire-ip-novatech.csv) ;
- [`dossier-technique-adressage.md`](../public/preuves/dossier-technique-adressage.md).

## Limite explicite

NovaTech NetworkLab est une infrastructure fictive et un simulateur pédagogique. Ce plan est un
livrable technique réel de conception et de documentation, mais il n’est pas présenté comme une
capture de trafic réel ni comme un fichier Cisco Packet Tracer.
