# Architecture du projet

## Vue d'ensemble

```
GitHub Pages
   │
   ├── index.html
   ├── admin.html
   ├── hydra-interactive.html
   ├── communaute.html
   └── pages d'information
            │
            ▼
       Supabase Data API
            │
       ┌────┴─────────────┐
       │                  │
   PostgreSQL          Storage
       │                  │
       ├── accès          └── médias de communauté
       ├── réservations
       ├── suggestions
       ├── birthday_config
       ├── Hydra assignments
       └── événements
```

## HYDRA VM

HYDRA VM contient notamment :

- gestionnaire de fenêtres ;
- applications virtuelles ;
- xterm.js pour le terminal ;
- Monaco Editor pour HYDRA CODE ;
- HYDRA CAM ;
- faux flux CCTV générés localement ;
- recherche et applications d'enquête ;
- PWA/service worker.

## Source de vérité

### Configuration narrative
La configuration d'anniversaire est stockée dans `birthday_config`.

### Dossiers
Les assignations sont gérées par les structures Hydra dédiées et exposées au joueur par RPC.

### Sécurité
Le frontend ne doit pas être considéré comme une frontière de sécurité. Toute donnée sensible ou autorisation doit être contrôlée côté Supabase.

Supabase recommande de considérer RLS comme une couche essentielle de contrôle lorsque les tables sont exposées à la Data API. citeturn0search0turn0search8

## Médias

Les fichiers de communauté utilisent Supabase Storage lorsqu'ils sont activés. Les politiques Storage doivent limiter les opérations aux besoins réels ; Supabase recommande d'utiliser les politiques RLS sur `storage.objects`. citeturn0search1turn0search2

## Caméra

Deux modes sont séparés :

1. **Caméra réelle** : permission navigateur + flux local.
2. **CCTV fiction** : rendu Canvas local, sans caméra et sans vidéo réelle.

Cette distinction est volontaire afin d'éviter de présenter une simulation comme une captation réelle.
