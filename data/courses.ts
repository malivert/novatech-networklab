export type CourseIcon =
  | "network"
  | "binary"
  | "dhcp"
  | "dns"
  | "routing"
  | "terminal"
  | "security"
  | "quiz";

export interface CourseSection {
  title: string;
  text: string;
  points: string[];
  example?: string;
}

export interface CourseQuizQuestion {
  id: string;
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export interface NetworkCourse {
  id: string;
  number: number;
  title: string;
  shortTitle: string;
  description: string;
  level: "Fondamentaux" | "Intermédiaire" | "Avancé";
  durationMinutes: number;
  icon: CourseIcon;
  objectives: string[];
  sections: CourseSection[];
  quiz: CourseQuizQuestion[];
  scenarioId: string;
  scenarioLabel: string;
}

export const networkCourses: NetworkCourse[] = [
  {
    id: "bases-reseau",
    number: 1,
    title: "Les bases d’un réseau informatique",
    shortTitle: "Bases du réseau",
    description:
      "Comprendre comment les équipements, les adresses et les protocoles coopèrent pour transporter une information.",
    level: "Fondamentaux",
    durationMinutes: 12,
    icon: "network",
    objectives: [
      "Distinguer LAN, WAN et Internet",
      "Identifier le rôle des principaux équipements",
      "Comprendre le trajet général d’une donnée",
    ],
    sections: [
      {
        title: "À quoi sert un réseau ?",
        text: "Un réseau relie des équipements pour échanger des données et partager des services. Dans une entreprise, il permet par exemple d’accéder aux fichiers, aux imprimantes, aux applications internes et à Internet.",
        points: [
          "Un LAN couvre une zone limitée : bureau, bâtiment ou campus.",
          "Un WAN relie plusieurs sites géographiquement éloignés.",
          "Un protocole définit les règles communes utilisées pour communiquer.",
        ],
      },
      {
        title: "Les équipements essentiels",
        text: "Le commutateur relie les appareils d’un même réseau local. Le routeur fait circuler les paquets entre plusieurs réseaux. Le point d’accès connecte les clients Wi-Fi, tandis qu’un serveur fournit un service.",
        points: [
          "Le switch travaille principalement avec les adresses MAC.",
          "Le routeur choisit une route à partir des adresses IP.",
          "Le pare-feu autorise ou bloque les flux selon des règles.",
        ],
      },
      {
        title: "Du poste au service",
        text: "Avant d’envoyer une requête, le poste détermine si la destination est locale. Si elle est distante, il transmet le paquet à sa passerelle. Chaque couche ajoute les informations nécessaires au transport.",
        points: [
          "Une trame circule sur le réseau local.",
          "Un paquet IP peut traverser plusieurs réseaux.",
          "TCP ou UDP transporte les données de l’application.",
        ],
        example: "Navigateur → DNS → passerelle → routeur → serveur web → réponse",
      },
    ],
    quiz: [
      {
        id: "bases-1",
        question: "Quel équipement relie principalement plusieurs appareils dans un même LAN ?",
        options: ["Un commutateur", "Un modem 4G", "Un serveur DNS"],
        answerIndex: 0,
        explanation: "Le commutateur relie les équipements du réseau local et transmet les trames.",
      },
      {
        id: "bases-2",
        question: "Quel équipement permet de joindre un autre réseau IP ?",
        options: ["Un point d’accès", "Un routeur", "Une imprimante"],
        answerIndex: 1,
        explanation: "Le routeur achemine les paquets entre des réseaux différents.",
      },
      {
        id: "bases-3",
        question: "Que définit un protocole réseau ?",
        options: ["La marque du câble", "Les règles de communication", "Le nom de l’utilisateur"],
        answerIndex: 1,
        explanation: "Un protocole fixe un langage et des règles communes entre les systèmes.",
      },
    ],
    scenarioId: "ip-conflict",
    scenarioLabel: "Conflit d’adresses IP",
  },
  {
    id: "ipv4-sous-reseaux",
    number: 2,
    title: "Adressage IPv4 et masque de sous-réseau",
    shortTitle: "IPv4 et sous-réseaux",
    description:
      "Lire une configuration IPv4, reconnaître le réseau local et comprendre le rôle de la passerelle.",
    level: "Fondamentaux",
    durationMinutes: 15,
    icon: "binary",
    objectives: [
      "Lire une adresse IPv4 et un préfixe",
      "Déterminer si deux hôtes sont dans le même réseau",
      "Repérer une configuration incohérente",
    ],
    sections: [
      {
        title: "Adresse, réseau et hôte",
        text: "Une adresse IPv4 contient 32 bits. Le masque sépare la partie réseau de la partie hôte. Deux postes communiquent directement lorsqu’ils appartiennent au même sous-réseau.",
        points: [
          "255.255.255.0 correspond au préfixe /24.",
          "Dans 10.20.0.34/24, le réseau est 10.20.0.0.",
          "Les adresses réseau et broadcast ne sont pas attribuées aux postes.",
        ],
        example: "10.20.0.34/24 et 10.20.0.80/24 sont dans le même sous-réseau.",
      },
      {
        title: "La passerelle par défaut",
        text: "La passerelle est l’adresse du routeur utilisée pour sortir du sous-réseau. Elle doit être joignable localement et appartenir au même réseau que le poste.",
        points: [
          "Une mauvaise passerelle bloque les destinations distantes.",
          "Les communications locales peuvent continuer à fonctionner.",
          "La route 0.0.0.0 désigne généralement la route par défaut.",
        ],
      },
      {
        title: "Méthode de vérification",
        text: "Contrôlez d’abord l’adresse, le masque et la passerelle. Comparez ensuite la configuration avec le plan d’adressage, puis testez une destination locale et une destination distante.",
        points: [
          "ipconfig /all affiche la configuration détaillée.",
          "ping teste la joignabilité d’une adresse.",
          "route print affiche la table de routage Windows.",
        ],
        example: "ipconfig /all → ping 10.10.0.1 → tracert 10.50.0.20",
      },
    ],
    quiz: [
      {
        id: "ipv4-1",
        question: "Quel masque correspond à un préfixe /24 ?",
        options: ["255.255.0.0", "255.255.255.0", "255.255.255.252"],
        answerIndex: 1,
        explanation: "Un /24 réserve 24 bits à la partie réseau : 255.255.255.0.",
      },
      {
        id: "ipv4-2",
        question: "Un poste joint son imprimante locale, mais pas Internet. Que vérifier en priorité ?",
        options: ["La passerelle par défaut", "Le nom du poste", "La vitesse du clavier"],
        answerIndex: 0,
        explanation: "Le trafic local fonctionne sans routeur ; la sortie du réseau dépend de la passerelle.",
      },
      {
        id: "ipv4-3",
        question: "À quoi sert le masque de sous-réseau ?",
        options: ["À chiffrer les paquets", "À séparer réseau et hôte", "À attribuer un nom DNS"],
        answerIndex: 1,
        explanation: "Le masque indique quels bits identifient le réseau et lesquels identifient l’hôte.",
      },
    ],
    scenarioId: "gateway-error",
    scenarioLabel: "Mauvaise passerelle",
  },
  {
    id: "dhcp",
    number: 3,
    title: "DHCP et attribution des adresses IP",
    shortTitle: "DHCP",
    description:
      "Comprendre l’attribution automatique d’une configuration IP et diagnostiquer un échec de bail.",
    level: "Fondamentaux",
    durationMinutes: 12,
    icon: "dhcp",
    objectives: [
      "Expliquer les quatre étapes DORA",
      "Reconnaître une adresse APIPA",
      "Diagnostiquer une étendue épuisée",
    ],
    sections: [
      {
        title: "Le rôle du DHCP",
        text: "DHCP fournit automatiquement une adresse IP, un masque, une passerelle, des serveurs DNS et une durée de bail. Il réduit les erreurs de saisie et centralise la configuration.",
        points: [
          "Discover : le client cherche un serveur.",
          "Offer : le serveur propose une adresse.",
          "Request puis Acknowledge : le bail est demandé et confirmé.",
        ],
        example: "DORA = Discover, Offer, Request, Acknowledge",
      },
      {
        title: "Étendues, baux et relais",
        text: "Une étendue définit la plage d’adresses distribuables et les options associées. Un relais DHCP transmet les demandes entre VLAN, car les diffusions ne traversent normalement pas un routeur.",
        points: [
          "Les exclusions protègent les adresses réservées.",
          "La durée du bail influence la consommation de l’étendue.",
          "Une réservation associe une adresse à une adresse MAC.",
        ],
      },
      {
        title: "Reconnaître une panne DHCP",
        text: "Sous Windows, une adresse 169.254.x.x indique souvent que le client n’a pas reçu de bail. Il faut vérifier la liaison, le VLAN, le relais, le service et le nombre d’adresses disponibles.",
        points: [
          "ipconfig /release libère le bail courant.",
          "ipconfig /renew demande un nouveau bail.",
          "Les journaux du serveur confirment une étendue saturée.",
        ],
      },
    ],
    quiz: [
      {
        id: "dhcp-1",
        question: "Quelle adresse suggère un échec d’attribution DHCP sous Windows ?",
        options: ["169.254.18.4", "10.20.0.42", "192.0.2.10"],
        answerIndex: 0,
        explanation: "Windows utilise une adresse APIPA 169.254.0.0/16 quand aucun bail n’est obtenu.",
      },
      {
        id: "dhcp-2",
        question: "Dans DORA, quelle étape suit l’offre du serveur ?",
        options: ["Request", "Discover", "Release"],
        answerIndex: 0,
        explanation: "Le client répond à l’offre par une demande DHCP Request.",
      },
      {
        id: "dhcp-3",
        question: "Pourquoi utilise-t-on un relais DHCP entre deux VLAN ?",
        options: ["Pour chiffrer les baux", "Pour transporter les demandes entre réseaux", "Pour remplacer le DNS"],
        answerIndex: 1,
        explanation: "Le relais transmet les demandes DHCP au serveur situé dans un autre réseau.",
      },
    ],
    scenarioId: "dhcp-exhausted",
    scenarioLabel: "Étendue DHCP épuisée",
  },
  {
    id: "dns",
    number: 4,
    title: "DNS et résolution de noms",
    shortTitle: "DNS",
    description:
      "Suivre une résolution de nom, lire les principaux enregistrements et isoler une panne DNS.",
    level: "Fondamentaux",
    durationMinutes: 10,
    icon: "dns",
    objectives: [
      "Distinguer connectivité IP et résolution DNS",
      "Connaître les enregistrements usuels",
      "Tester un serveur DNS avec nslookup",
    ],
    sections: [
      {
        title: "Pourquoi le DNS est indispensable",
        text: "Le DNS traduit un nom lisible en adresse IP. Une connexion peut donc fonctionner vers une adresse tout en échouant vers un nom si la résolution est mal configurée.",
        points: [
          "Un enregistrement A associe un nom à une adresse IPv4.",
          "Un CNAME crée un alias vers un autre nom.",
          "Un enregistrement MX indique les serveurs de messagerie.",
        ],
      },
      {
        title: "Résolution et cache",
        text: "Le poste consulte d’abord ses informations locales et son cache, puis interroge le serveur DNS configuré. Le serveur peut répondre depuis sa zone, son cache ou interroger d’autres serveurs.",
        points: [
          "Le cache accélère les réponses répétées.",
          "Le TTL indique combien de temps une réponse peut être conservée.",
          "Une ancienne adresse DNS peut provoquer des délais d’attente.",
        ],
      },
      {
        title: "Diagnostic différentiel",
        text: "Comparez un test vers une adresse IP avec un test vers un nom. Si l’adresse répond et que le nom échoue, inspectez la configuration DNS et interrogez explicitement le bon serveur.",
        points: [
          "ping 8.8.8.8 vérifie une partie de la connectivité IP.",
          "nslookup nom serveur teste une résolution précise.",
          "ipconfig /flushdns vide le cache DNS Windows.",
        ],
        example: "nslookup intranet.novatech.local 10.50.0.10",
      },
    ],
    quiz: [
      {
        id: "dns-1",
        question: "Quel enregistrement associe un nom à une adresse IPv4 ?",
        options: ["A", "MX", "TXT"],
        answerIndex: 0,
        explanation: "L’enregistrement A contient l’adresse IPv4 associée au nom.",
      },
      {
        id: "dns-2",
        question: "8.8.8.8 répond, mais aucun site ne s’ouvre par son nom. Quelle piste est prioritaire ?",
        options: ["Le DNS", "Le câble écran", "Le serveur DHCP uniquement"],
        answerIndex: 0,
        explanation: "La connectivité IP existe ; il faut vérifier la résolution de noms.",
      },
      {
        id: "dns-3",
        question: "Quelle commande interroge directement le DNS ?",
        options: ["tracert", "nslookup", "arp -a"],
        answerIndex: 1,
        explanation: "nslookup envoie une requête DNS et affiche la réponse du serveur.",
      },
    ],
    scenarioId: "dns-incorrect",
    scenarioLabel: "Serveur DNS incorrect",
  },
  {
    id: "routage-vlan",
    number: 5,
    title: "Routeurs, commutateurs et VLAN",
    shortTitle: "Routage et VLAN",
    description:
      "Segmenter un réseau avec des VLAN et comprendre comment les flux passent d’un réseau à l’autre.",
    level: "Intermédiaire",
    durationMinutes: 18,
    icon: "routing",
    objectives: [
      "Distinguer commutation et routage",
      "Comprendre ports access et trunk",
      "Diagnostiquer une mauvaise affectation VLAN",
    ],
    sections: [
      {
        title: "Commutation dans le LAN",
        text: "Le switch apprend les adresses MAC sources et construit une table. Il transmet ensuite les trames vers le port associé à la destination, au lieu de les diffuser partout.",
        points: [
          "La table MAC relie une adresse à un port.",
          "Une destination inconnue est diffusée dans le VLAN.",
          "ARP permet de découvrir la MAC associée à une IPv4 locale.",
        ],
      },
      {
        title: "Séparer avec des VLAN",
        text: "Un VLAN crée un domaine de diffusion logique. Un port access transporte généralement un seul VLAN pour un poste ; un trunk transporte plusieurs VLAN entre équipements.",
        points: [
          "Deux VLAN sont deux réseaux IP distincts.",
          "Le marquage 802.1Q identifie le VLAN sur un trunk.",
          "Une mauvaise affectation peut fournir une adresse du mauvais service.",
        ],
      },
      {
        title: "Routage inter-VLAN",
        text: "Pour communiquer entre VLAN, les paquets passent par un routeur ou un switch de niveau 3. Les routes et les règles de sécurité déterminent ensuite les destinations autorisées.",
        points: [
          "Chaque VLAN possède normalement une passerelle.",
          "tracert aide à voir les sauts traversés.",
          "La configuration du port doit correspondre au plan réseau.",
        ],
        example: "PC VLAN 20 → passerelle VLAN 20 → routage → serveur VLAN 50",
      },
    ],
    quiz: [
      {
        id: "vlan-1",
        question: "Quel type de port transporte plusieurs VLAN entre deux switches ?",
        options: ["Access", "Trunk", "Console"],
        answerIndex: 1,
        explanation: "Un trunk utilise notamment 802.1Q pour transporter plusieurs VLAN.",
      },
      {
        id: "vlan-2",
        question: "Que faut-il pour communiquer entre deux VLAN ?",
        options: ["Du routage", "Uniquement ARP", "Un câble USB"],
        answerIndex: 0,
        explanation: "Deux VLAN sont des réseaux distincts ; un équipement de niveau 3 doit les router.",
      },
      {
        id: "vlan-3",
        question: "Un poste reçoit une adresse du mauvais service après un déménagement. Que vérifier ?",
        options: ["Le port VLAN du switch", "La résolution de l’écran", "Le mot de passe Windows"],
        answerIndex: 0,
        explanation: "Le port access peut avoir été affecté au mauvais VLAN.",
      },
    ],
    scenarioId: "wrong-vlan",
    scenarioLabel: "Mauvais VLAN",
  },
  {
    id: "commandes-diagnostic",
    number: 6,
    title: "Commandes de diagnostic réseau",
    shortTitle: "Commandes de diagnostic",
    description:
      "Construire un diagnostic efficace avec ipconfig, ping, tracert, nslookup et les tables locales.",
    level: "Intermédiaire",
    durationMinutes: 14,
    icon: "terminal",
    objectives: [
      "Choisir une commande selon l’hypothèse",
      "Interpréter les sorties essentielles",
      "Suivre une démarche du local vers le distant",
    ],
    sections: [
      {
        title: "Observer avant de modifier",
        text: "Une bonne intervention commence par les faits. Relevez la configuration et le symptôme avant toute correction afin d’éviter une action intrusive ou sans rapport avec la cause.",
        points: [
          "ipconfig /all : adresse, masque, passerelle, DNS et DHCP.",
          "arp -a : voisins IPv4 connus sur le réseau local.",
          "route print : routes et passerelle utilisées par Windows.",
        ],
      },
      {
        title: "Tester par étapes",
        text: "Commencez près du poste, puis éloignez-vous : pile locale, passerelle, serveur interne, adresse externe et enfin nom DNS. Le premier échec aide à localiser la panne.",
        points: [
          "ping teste une joignabilité ICMP, si elle est autorisée.",
          "tracert affiche les sauts vers une destination.",
          "Test-NetConnection teste aussi un port TCP.",
        ],
        example: "ping 127.0.0.1 → passerelle → serveur → IP externe → nom DNS",
      },
      {
        title: "Prouver la résolution",
        text: "Après la correction, répétez le test qui échouait et vérifiez le service attendu. Une modification sans test de validation ne démontre pas que l’incident est résolu.",
        points: [
          "Conservez les commandes et résultats utiles.",
          "Comparez l’état avant et après correction.",
          "Documentez la cause, l’action et la prévention.",
        ],
      },
    ],
    quiz: [
      {
        id: "cmd-1",
        question: "Quelle commande affiche la passerelle et les DNS configurés sous Windows ?",
        options: ["ipconfig /all", "hostname", "tasklist"],
        answerIndex: 0,
        explanation: "ipconfig /all fournit la configuration réseau détaillée des interfaces.",
      },
      {
        id: "cmd-2",
        question: "Quelle commande montre les sauts vers une destination ?",
        options: ["nslookup", "tracert", "ipconfig /renew"],
        answerIndex: 1,
        explanation: "tracert augmente progressivement la durée de vie des paquets pour révéler les sauts.",
      },
      {
        id: "cmd-3",
        question: "Après une correction, quelle action est indispensable ?",
        options: ["Redémarrer tous les switches", "Valider le service", "Supprimer les journaux"],
        answerIndex: 1,
        explanation: "Il faut reproduire le test fonctionnel pour prouver le rétablissement.",
      },
    ],
    scenarioId: "gateway-error",
    scenarioLabel: "Mauvaise passerelle",
  },
  {
    id: "securite-parefeu",
    number: 7,
    title: "Sécurité réseau et pare-feu",
    shortTitle: "Sécurité et pare-feu",
    description:
      "Filtrer les flux avec précision, appliquer le moindre privilège et diagnostiquer un port bloqué.",
    level: "Avancé",
    durationMinutes: 15,
    icon: "security",
    objectives: [
      "Lire une règle de filtrage",
      "Appliquer le principe du moindre privilège",
      "Tester un service TCP sans désactiver la sécurité",
    ],
    sections: [
      {
        title: "Une règle décrit un flux",
        text: "Une règle de pare-feu examine notamment la source, la destination, le protocole, le port et l’action. L’ordre des règles et leur périmètre peuvent modifier le résultat.",
        points: [
          "Entrant et sortant décrivent le sens du trafic.",
          "TCP 445 est notamment utilisé par SMB.",
          "Le journal du pare-feu aide à identifier la règle appliquée.",
        ],
      },
      {
        title: "Moindre privilège",
        text: "La bonne correction autorise uniquement le flux nécessaire. Désactiver le pare-feu restaure parfois le service, mais expose inutilement l’ensemble du système.",
        points: [
          "Limiter la source au VLAN réellement concerné.",
          "Limiter la destination au serveur attendu.",
          "Limiter le protocole et le port au service nécessaire.",
        ],
      },
      {
        title: "Tester sans fragiliser",
        text: "Test-NetConnection vérifie l’accès à un port TCP précis. Combinez ce résultat avec les journaux et la configuration pour distinguer un service arrêté d’un filtrage réseau.",
        points: [
          "Un ping réussi ne prouve pas qu’un port applicatif est ouvert.",
          "Un port fermé et un port filtré peuvent produire des symptômes différents.",
          "La validation doit être réalisée depuis la source concernée.",
        ],
        example: "Test-NetConnection 10.50.0.20 -Port 445",
      },
    ],
    quiz: [
      {
        id: "sec-1",
        question: "Quelle correction respecte le mieux le moindre privilège ?",
        options: ["Désactiver le pare-feu", "Autoriser le flux précis nécessaire", "Autoriser tous les ports"],
        answerIndex: 1,
        explanation: "Une règle ciblée restaure le service sans élargir inutilement l’exposition.",
      },
      {
        id: "sec-2",
        question: "Quel outil PowerShell teste un port TCP précis ?",
        options: ["Test-NetConnection", "format", "whoami"],
        answerIndex: 0,
        explanation: "Test-NetConnection accepte une destination et un port TCP.",
      },
      {
        id: "sec-3",
        question: "Un ping réussi prouve-t-il que TCP 445 est accessible ?",
        options: ["Oui, toujours", "Non", "Seulement avec DHCP"],
        answerIndex: 1,
        explanation: "ICMP et TCP sont différents ; le port applicatif doit être testé directement.",
      },
    ],
    scenarioId: "firewall-block",
    scenarioLabel: "Règle pare-feu bloquante",
  },
  {
    id: "revision-finale",
    number: 8,
    title: "Révision finale et méthode d’incident",
    shortTitle: "Révision finale",
    description:
      "Relier toutes les notions dans une démarche de diagnostic claire, reproductible et documentée.",
    level: "Avancé",
    durationMinutes: 10,
    icon: "quiz",
    objectives: [
      "Structurer une intervention de bout en bout",
      "Choisir les tests les plus discriminants",
      "Présenter une conclusion professionnelle",
    ],
    sections: [
      {
        title: "Qualifier le symptôme",
        text: "Commencez par préciser qui est touché, depuis quand, sur quel équipement et pour quel service. Distinguez un incident individuel, un VLAN, un site ou l’ensemble de l’entreprise.",
        points: [
          "Reproduire le problème si possible.",
          "Identifier ce qui fonctionne encore.",
          "Évaluer l’impact et l’urgence.",
        ],
      },
      {
        title: "Tester une hypothèse",
        text: "Chaque commande doit répondre à une question. Un test utile sépare deux hypothèses : réseau local ou distant, adresse IP ou nom, service ou filtrage, poste ou infrastructure.",
        points: [
          "Partir du plus simple et du moins intrusif.",
          "Noter les résultats avant toute modification.",
          "Éviter les redémarrages sans preuve.",
        ],
      },
      {
        title: "Corriger, valider, documenter",
        text: "Appliquez une correction ciblée, répétez le test initial puis vérifiez le service de bout en bout. Le rapport final doit permettre à un autre technicien de comprendre l’incident.",
        points: [
          "Cause racine et correction doivent être liées.",
          "La validation doit correspondre au besoin utilisateur.",
          "Une mesure préventive réduit le risque de récidive.",
        ],
        example: "Symptôme → hypothèses → tests → cause → correction → validation → prévention",
      },
    ],
    quiz: [
      {
        id: "final-1",
        question: "Une adresse IP externe répond, mais pas les noms. Quel test est le plus discriminant ?",
        options: ["nslookup", "Redémarrer le switch", "Changer le masque"],
        answerIndex: 0,
        explanation: "nslookup vérifie directement l’hypothèse d’un problème de résolution DNS.",
      },
      {
        id: "final-2",
        question: "Le poste obtient 169.254.77.14. Quelle hypothèse est prioritaire ?",
        options: ["Échec DHCP", "Erreur DNS uniquement", "Port TCP 445 bloqué"],
        answerIndex: 0,
        explanation: "Une adresse APIPA indique généralement qu’aucun bail DHCP n’a été reçu.",
      },
      {
        id: "final-3",
        question: "Quelle conclusion d’intervention est la plus complète ?",
        options: [
          "Ça remarche",
          "Le serveur a été redémarré",
          "Cause identifiée, correction ciblée, service validé et prévention proposée",
        ],
        answerIndex: 2,
        explanation: "Une conclusion professionnelle relie les faits, l’action, la validation et la prévention.",
      },
    ],
    scenarioId: "ip-conflict",
    scenarioLabel: "Conflit d’adresses IP",
  },
];

export function getCourse(id: string): NetworkCourse {
  return networkCourses.find((course) => course.id === id) ?? networkCourses[0];
}
