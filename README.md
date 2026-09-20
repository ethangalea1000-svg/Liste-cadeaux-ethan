# 🎁 La liste d’Ethan

Site web personnel de liste de cadeaux pour **Noël et l’anniversaire 2026**.

Le site permet de consulter les cadeaux, rechercher des produits, voir des liens d’achat, réserver un cadeau, proposer des idées et participer à des cagnottes.

## 🌐 Site

**Site public :**  
https://ethangalea1000-svg.github.io/Liste-cadeaux-ethan/

**Communauté :**  
https://ethangalea1000-svg.github.io/Liste-cadeaux-ethan/communaute.html

**Administration :**  
https://ethangalea1000-svg.github.io/Liste-cadeaux-ethan/admin.html

> La page d’administration n’est pas affichée dans la navigation publique. Elle reste protégée par le mot de passe administrateur côté Supabase.

## ✨ Fonctionnalités

### 🎁 Liste de cadeaux
- Recherche par nom, description et catégorie
- Filtrage par catégorie
- Statistiques : nombre total, disponibles et réservés
- Réservations partagées entre les visiteurs
- Déréservation avec vérification du prénom
- Partage de la liste
- Interface responsive ordinateur / mobile

### 🛒 Recherche de produits
- Liens automatiques vers Amazon, Google Shopping, eBay et Fnac
- Liens directs vers certains services officiels
- Images de produits générées automatiquement à partir du nom et de la description
- Recherche d’images avec le nom + la légende/description
- Bouton **🤖 Chercher sur le Web avec l’IA**
- Recherche IA demandant de comparer les offres, les prix, les boutiques, la disponibilité et les sources

> Les liens, prix, stocks et résultats de recherche peuvent changer. Le site ne garantit pas qu’une offre affichée reste disponible.

### 💡 Suggestions
- Proposition d’un nouveau cadeau
- Nom, lien et message facultatifs
- Les nouvelles suggestions passent en attente de validation
- Validation ou refus depuis l’espace administrateur
- Suppression d’une suggestion avec vérification du prénom utilisé

### 💶 Cagnottes
- Création de nouvelles cagnottes
- Validation obligatoire des nouvelles cagnottes par l’administrateur
- Objectif financier
- Progression de la cagnotte
- Participations rattachées à une cagnotte
- Suppression d’une participation avec vérification du prénom
- Cagnotte initiale : **💻 Ordinateur pour le lycée — Seconde**
- Objectif initial de la cagnotte ordinateur : **1 000 €**

> Le site enregistre des participations annoncées. Il ne réalise pas de paiement en ligne.

### 💬 Communauté
- Publications publiques
- Réactions ❤️ 👍 😂 🎉 😮
- Vérification du prénom pour les réactions
- Suppression d’un message avec vérification du prénom
- Liens externes
- Images, GIF, vidéos, audio et documents
- Fichiers stockés dans Supabase Storage

### 🔐 Boîte à messages
- Envoi de messages privés à Ethan
- Les messages ne sont pas affichés publiquement aux visiteurs

## 🛠️ Technologies

- HTML5
- CSS3
- JavaScript
- GitHub Pages
- Supabase
  - Database / PostgreSQL
  - Row Level Security
  - RPC / fonctions SQL
  - Supabase Storage
- Recherche Web et recherche d’images via liens externes

## 📁 Structure

```text
/
├── index.html          # Liste principale, réservations, suggestions, cagnottes
├── communaute.html     # Discussion publique, réactions et fichiers
├── admin.html          # Validation des suggestions et cagnottes
├── supabase.sql        # Schéma, RLS, fonctions RPC et stockage
└── README.md           # Documentation du projet
```

## 🗄️ Supabase

Le projet utilise Supabase pour les données partagées.

Principales tables / ressources :

- `reservations`
- `gift_suggestions`
- `contributions`
- `fundraisers`
- `ideas`
- `messages`
- `community_posts`
- `community_reactions`
- `site_admin`
- Storage : `community-files`

Les opérations sensibles de suppression et de validation passent par des fonctions SQL RPC avec vérification du prénom ou du mot de passe administrateur.

## 🔒 Sécurité

- Les règles RLS limitent les accès aux tables Supabase.
- Les suggestions et cagnottes restent privées jusqu’à validation.
- Les messages privés ne sont pas lisibles par les visiteurs anonymes.
- La suppression des publications et participations vérifie le prénom fourni.
- Le mot de passe administrateur n’est pas enregistré dans les pages HTML.

> Le masquage d’un lien d’administration n’est pas une mesure de sécurité suffisante à lui seul : la protection repose sur l’authentification / vérification côté Supabase.

## 🚀 Publication

Le site est publié avec **GitHub Pages** depuis la branche `main` et le dossier racine `/(root)`.

Toute modification de `index.html`, `communaute.html`, `admin.html` ou `supabase.sql` doit être testée après publication.

---

**Liste de cadeaux d’Ethan — 2026**  
Projet personnel réalisé avec HTML, CSS, JavaScript, GitHub et Supabase.
