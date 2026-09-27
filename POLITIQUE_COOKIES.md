# Politique cookies et stockage local

## Principe

Le projet n'utilise pas de publicité comportementale.

Certaines fonctions utilisent le stockage du navigateur pour conserver temporairement l'état de l'interface, par exemple :

- onglet HYDRA actif ;
- position de défilement ;
- session de travail ;
- préférences ou états locaux nécessaires au fonctionnement.

Ces données restent dans le navigateur lorsqu'elles sont stockées avec `localStorage` ou `sessionStorage`.

## Traceurs tiers

Certaines bibliothèques de HYDRA VM sont chargées depuis jsDelivr. Leur chargement peut entraîner une requête réseau vers ce fournisseur lorsque la page concernée est ouverte.

Les pages doivent éviter d'ajouter des services d'analyse ou de publicité sans mettre à jour cette politique et le mécanisme d'information/consentement approprié.

La CNIL distingue les traceurs strictement nécessaires des traceurs nécessitant un consentement. citeturn0search5turn0search17

## Caméra

L'autorisation caméra est une permission du navigateur, distincte d'un cookie. Le mode caméra réelle ne doit pas activer la caméra sans action de l'utilisateur.

Les captures HYDRA CAM sont locales par défaut et ne sont pas automatiquement téléversées.

## Date de révision

27 septembre 2026.
