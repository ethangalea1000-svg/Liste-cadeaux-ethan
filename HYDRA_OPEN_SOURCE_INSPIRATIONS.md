# HYDRA VM — Inspirations WebOS open source

Cette page documente les projets étudiés pour améliorer l'interface HYDRA VM. Aucun code tiers n'est copié ici : HYDRA reprend des concepts d'architecture et d'ergonomie et conserve son propre code.

## Projets étudiés

- OS.js — plateforme de web desktop avec window manager, API d'applications, toolkit GUI et abstractions filesystem. Licence annoncée : MIT. https://github.com/os-js/OS.js/
- Martin-R-D/WebOS — desktop navigateur avec fenêtres redimensionnables, VFS, explorateur, terminal, éditeur et persistance. Licence annoncée : MIT. https://github.com/Martin-R-D/WebOS
- BJH-OS — WebOS vanilla avec gestion des fenêtres, taskbar, menu d'applications, persistance, PWA et marché d'applications. Licence annoncée : AGPL-3.0. https://github.com/Haris16-code/BJH-OS
- NovaOS — desktop web client-side/offline en JavaScript vanilla. Licence à vérifier avant toute réutilisation de code. https://github.com/runnova/NovaOS
- YukiOS — desktop web multi-environnements avec de nombreuses intégrations et bibliothèques. Licence annoncée : MIT ; attribution requise si du code, design, thème ou asset est repris. https://github.com/Reeyuki/YukiOS
- Open Web Desktop — framework modulaire de desktop web basé sur Nuxt/Vue. https://github.com/owdproject/client
- WebDEX — desktop vanilla avec fenêtres redimensionnables, snapping, taskbar et start menu. Licence à vérifier avant réutilisation de code. https://github.com/mobinh8585/WebDEX
- OS(KO) — architecture WebOS avec apps séparées, stockage local et noyau client-side. Licence annoncée : MIT. https://github.com/cmdkolab/osko

## Ce qui est intégré dans HYDRA

- gestionnaire de fenêtres et VM plein écran ;
- bureau + icônes + taskbar + menu applications ;
- applications internes montées dans la VM ;
- configuration WebOS externe dans `hydra-webos-config.json` ;
- configuration Terminal externe dans `hydra-terminal-config.json` ;
- mails narratifs injectés depuis la configuration ;
- fichiers de bureau ouvrables depuis la VM ;
- terminal piloté par configuration ;
- persistance locale et PWA déjà présentes ;
- palette de commandes et navigation clavier ;
- mode hors-ligne / cache local ;
- séparation claire entre simulation narrative et système réel.

## Règle de licence

Avant d'importer directement du code, des assets ou des composants d'un projet tiers, vérifier sa licence et conserver les notices d'auteur demandées. Les projets GPL/AGPL ne doivent pas être traités comme s'ils étaient MIT.
