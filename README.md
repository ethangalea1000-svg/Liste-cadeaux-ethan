# 🎁 La liste d’Ethan

Site web personnel de liste de cadeaux pour **Noël et l’anniversaire 2026**.

Le site fonctionne comme une petite application privée : accès par code d’invitation, catalogue de cadeaux, réservations, participations, suggestions, communauté et modules spéciaux pour l’anniversaire.

## 🌐 Site

**Site public :**  
https://ethangalea1000-svg.github.io/Liste-cadeaux-ethan/

**Confidentialité :**  
https://ethangalea1000-svg.github.io/Liste-cadeaux-ethan/confidentialite.html

**Communauté :**  
https://ethangalea1000-svg.github.io/Liste-cadeaux-ethan/communaute.html

**Administration :**  
https://ethangalea1000-svg.github.io/Liste-cadeaux-ethan/admin.html

> L’espace d’administration n’est pas exposé dans la navigation publique et repose sur une vérification côté Supabase.

## ✨ Fonctionnalités

### 🔐 Accès privé

- Accès au catalogue après vérification d’un **code d’invitation actif**
- Codes d’accès désactivables depuis l’administration
- Conservation de la session côté navigateur pendant son utilisation
- Protection anti-brute-force sur les tentatives d’accès
- Génération d’un lien partageable contenant le code dans le fragment de l’URL
- Possibilité de demander un accès avant d’entrer dans la liste

### 📨 Demandes de création d’accès

Depuis l’écran verrouillé, une personne peut envoyer une demande avec :

- prénom / nom utilisé sur la liste
- relation avec Ethan
- avatar facultatif
- courte présentation facultative

La demande reste **en attente** jusqu’à décision de l’administrateur.

L’administrateur peut :

- consulter les demandes en attente ;
- créer l’accès correspondant ;
- refuser une demande ;
- récupérer le code et le lien générés après approbation.

Une demande n’accorde donc pas automatiquement l’accès au catalogue.

### 🎁 Liste de cadeaux

- Recherche par nom, description et catégorie
- Filtrage par catégorie
- Statistiques : total, disponibles, réservés
- Réservations partagées entre les visiteurs autorisés
- Déréservation avec vérification du prénom
- Réduction partielle d’une participation à un cadeau
- Retrait complet d’une participation
- Liens d’achat officiels ou externes
- Comparaison d’offres
- Recherche d’images
- Interface responsive ordinateur / mobile

### 🛒 Recherche de produits

- Liens vers Amazon, Google Shopping, eBay, Fnac et d’autres services
- Liens officiels lorsqu’ils sont disponibles
- Recherche d’images basée sur le produit
- Bouton **🤖 Chercher sur le Web avec l’IA**
- Recherche orientée comparaison des prix, boutiques, disponibilité et sources

> Les prix, stocks, liens et résultats externes peuvent évoluer. Le site ne garantit pas qu’une offre restera disponible.

### 💡 Suggestions et idées

- Proposition d’un cadeau
- Nom, lien et message facultatifs selon le formulaire
- Nouvelles suggestions placées en attente
- Validation ou refus depuis l’administration
- Suppression de certaines propositions avec vérification du prénom
- Boîte à idées séparée

### 💶 Participations et cagnottes

- Cagnottes avec objectif financier
- Validation administrative des nouvelles cagnottes
- Progression de financement
- Participations rattachées à un cadeau ou une cagnotte
- Réduction partielle ou retrait d’une participation lorsque les conditions du site le permettent
- Suppression sécurisée des participations classiques

> Le site enregistre des **participations annoncées**. Il ne réalise pas de paiement bancaire en ligne.

### 🎂 Anniversaire 2026

L’interface anniversaire regroupe plusieurs modules :

- ⏳ compte à rebours jusqu’à l’anniversaire
- 🕐 heure de naissance pour personnaliser le décompte
- 🎉 mode anniversaire
- 📅 programme / chronologie
- ❓ quiz **« Qui connaît Ethan ? »**
- 🗳️ vote en direct
- 🎯 défis secrets
- 💬 mur de messages
- 📸 galerie photo privée
- 🕰️ timeline / souvenirs
- 🧩 Murder Party spéciale **Hydra**

Le **programme** est le seul module anniversaire masqué par défaut pour les invités. L’administrateur peut le publier ou le masquer en un clic.

### 🧩 Murder Party « Hydra »

Le module Hydra permet de gérer des dossiers individuels pour les participants.

Chaque joueur peut recevoir, selon son accès :

- un rôle ;
- un objectif ;
- des éléments de scénario ;
- un document ou indice spécial ;
- des fragments de scénario ;
- des informations propres à son personnage.

Les invités n’obtiennent que le dossier correspondant à leur accès, tandis que l’administration conserve la gestion du scénario.

### 💬 Communauté

- Publications
- Réactions ❤️ 👍 😂 🎉 😮
- Liens externes
- Images, GIF, vidéos, audio et documents
- Fichiers stockés via Supabase Storage
- Gestion des publications depuis les fonctions prévues par le site

### 🔒 Messages privés

- Envoi de messages privés à Ethan
- Les messages ne sont pas affichés publiquement aux autres visiteurs

### 📊 Télémétrie volontaire

Une extension séparée, **« Mes données — Liste d’Ethan »**, existe en version 1.2.0.

Après consentement explicite, elle peut enregistrer des événements liés au site, notamment :

- pages consultées ;
- clics ;
- titre de page ;
- langue et fuseau horaire ;
- taille d’écran et de fenêtre ;
- thème clair / sombre ;
- état en ligne ;
- informations de connexion disponibles au navigateur ;
- événements de visibilité, redimensionnement et réseau.

L’extension est conçue pour ne pas enregistrer les mots de passe, codes d’accès, contenus de formulaires ou messages privés.

### 🛠️ Interface et navigation

Le site utilise une organisation en quatre espaces principaux :

1. **🎁 Liste** — catalogue et recherches
2. **🎂 Anniversaire** — modules anniversaire
3. **💶 Participer** — cagnottes et financements
4. **💬 Communauté** — échanges et contenus partagés

L’interface conserve également la position de défilement lors des navigations prévues du site.

## 🛠️ Technologies

- HTML5
- CSS3
- JavaScript
- GitHub Pages
- Supabase
  - PostgreSQL
  - Row Level Security
  - fonctions SQL / RPC
  - stockage Supabase Storage
- Outils de recherche Web et d’images par liens externes
- Extension Chrome/Chromium Manifest V3
- Tauri pour le squelette d’applications natives

## 📁 Structure principale

```text
/
├── index.html                         # application publique
├── admin.html                         # administration
├── communaute.html                    # communauté
├── confidentialite.html               # informations de confidentialité
├── SUPABASE_A_COPIER_COLLER.sql       # schéma, fonctions RPC et sécurité Supabase
├── extension/
│   ├── manifest.json                  # extension
│   ├── popup.html
│   ├── popup.js
│   ├── site-tracker.js
│   └── background.js
├── app/
│   └── native-telemetry.js            # support télémétrie côté app native
├── src-tauri/                         # squelette Tauri Windows / Android / iOS
├── scripts/
│   └── prepare-native.mjs
├── .github/workflows/
│   └── build-native.yml
├── package.json
└── README.md
```

## 🗄️ Supabase

Le projet utilise Supabase pour les données partagées et les opérations serveur.

Selon les modules actuellement présents, la base contient notamment :

- `gift_catalog`
- `reservations`
- `gift_suggestions`
- `contributions`
- `gift_contributions`
- `fundraisers`
- `ideas`
- `messages`
- `community_posts`
- `community_reactions`
- `guest_profiles`
- `list_access_codes`
- `access_requests`
- `birthday_config`
- `birthday_interactions`
- `extension_telemetry_events`
- `site_settings`
- Supabase Storage pour certains fichiers de communauté

Les opérations sensibles utilisent des fonctions SQL/RPC avec des vérifications côté serveur.

## 🔒 Sécurité

Le projet applique plusieurs mécanismes complémentaires :

- Row Level Security sur les ressources Supabase concernées
- vérification serveur des codes d’accès
- contrôle administrateur via en-tête dédié
- vérification du prénom pour certaines suppressions / modifications
- messages privés non lisibles publiquement
- protection anti-brute-force des tentatives d’accès
- validation administrative des suggestions, cagnottes et demandes d’accès
- séparation entre données publiques et données réservées aux fonctions d’administration

> Le fait de ne pas afficher une URL d’administration ne constitue pas une sécurité suffisante à lui seul. La protection repose sur les contrôles côté serveur.

## 🧪 Publication et maintenance

Le site est publié avec **GitHub Pages** depuis la branche `main`.

La base Supabase et le dépôt GitHub sont deux éléments distincts :

- modifier `SUPABASE_A_COPIER_COLLER.sql` dans GitHub **ne modifie pas automatiquement** la base Supabase ;
- les nouvelles fonctions SQL doivent être exécutées dans Supabase avant de pouvoir être utilisées par le site ;
- une modification de l’interface doit être testée après publication GitHub Pages ;
- une modification du schéma ou des RPC doit être vérifiée côté Supabase.

Pour les applications natives, le dépôt contient actuellement le squelette et les scripts Tauri nécessaires à la préparation / compilation ; cela ne signifie pas que des versions mobiles ou Windows signées sont déjà distribuées.

## 🔗 Documentation associée

- [Confidentialité](https://ethangalea1000-svg.github.io/Liste-cadeaux-ethan/confidentialite.html)
- [Communauté](https://ethangalea1000-svg.github.io/Liste-cadeaux-ethan/communaute.html)

---

**Liste de cadeaux d’Ethan — 2026**  
Projet personnel réalisé avec HTML, CSS, JavaScript, GitHub et Supabase.


## 📚 Documentation du projet

- [Politique de confidentialité](confidentialite.html)
- [Mentions légales](MENTIONS_LEGALES.md)
- [Sécurité](SECURITY.md)
- [Politique cookies et stockage local](POLITIQUE_COOKIES.md)
- [Architecture technique](ARCHITECTURE.md)

> Les documents de conformité décrivent le fonctionnement actuellement observé dans le dépôt. Les informations d'identité du responsable de publication et les durées de conservation définitives doivent être complétées et validées par le responsable du site avant une diffusion publique définitive.

## 🧱 Architecture actuelle

Le frontend est publié avec GitHub Pages et utilise Supabase pour les données applicatives, les RPC et certains fichiers. HYDRA VM ajoute un environnement interactif avec gestionnaire de fenêtres, terminal xterm.js, Monaco Editor, caméra navigateur et CCTV entièrement fictive.

### HYDRA CAM

Deux modes sont distincts :

- **Caméra réelle** : accès uniquement après autorisation du navigateur et action de l'utilisateur.
- **CCTV FICTION** : flux Canvas générés localement, explicitement marqués comme simulation.

Aucune vidéo fictive ne doit être présentée comme une captation réelle.

### Supabase

Les tables exposées à la Data API doivent être protégées par RLS et par des grants correspondant exactement aux opérations nécessaires. Supabase recommande cette approche pour les applications utilisant directement la Data API. citeturn0search0turn0search13

Les clés secrètes/service-role ne doivent jamais être placées dans le frontend. Une clé publishable/anon n'est pas un secret, mais elle nécessite des politiques RLS correctement configurées. citeturn0search8

## 🔧 Développement

Avant de publier une modification importante :

1. vérifier les erreurs JavaScript ;
2. vérifier les IDs HTML dupliqués ;
3. vérifier les RPC Supabase utilisés ;
4. vérifier les politiques RLS des tables modifiées ;
5. vérifier les pages d'information si une donnée ou un service change ;
6. vérifier les licences des dépendances externes.

## 🔒 Vie privée

Le projet applique le principe de minimisation : ne collecter que les données nécessaires aux fonctionnalités réellement utilisées. La CNIL recommande d'informer les personnes des finalités, de la base juridique, des catégories de données, des destinataires, des droits et, le cas échéant, des transferts hors UE. citeturn0search7turn0search14

Pour les caméras, les personnes filmées doivent être informées et leur vie privée ainsi que leur droit à l'image doivent être respectés. citeturn0search3

## 📌 Licence

Le dépôt contient des composants tiers. Chaque dépendance conserve sa propre licence. Toute redistribution du code doit respecter les licences et notices correspondantes.
