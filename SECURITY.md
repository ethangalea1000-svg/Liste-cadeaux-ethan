# Sécurité

## Principes

HYDRA est une application web statique avec un backend Supabase. La sécurité repose notamment sur :

- Row Level Security (RLS) ;
- politiques Postgres ;
- séparation des fonctions publiques et administratives ;
- vérification des codes d'accès ;
- absence de clé `service_role` dans le frontend ;
- CSP et `referrer-policy` ;
- limitation des données collectées ;
- validation côté serveur des données persistées.

Supabase recommande d'activer RLS sur les tables exposées et de limiter les grants aux opérations réellement nécessaires. citeturn0search0turn0search13

## Données et secrets

Ne jamais committer :

- mot de passe ;
- clé secrète ;
- clé `service_role` Supabase ;
- token GitHub ;
- identifiant privé ;
- données personnelles non nécessaires.

Une clé publishable/anon Supabase n'est pas un secret, mais elle doit être protégée par RLS et des privilèges minimaux. Une clé service-role ne doit jamais être exposée au navigateur. citeturn0search8

## Caméra

Le mode caméra réelle utilise l'API caméra du navigateur. Le site ne doit pas présenter une séquence fictive comme une captation réelle.

Les flux CCTV fictifs sont générés localement et portent la mention `FICTION`.

Pour une caméra réellement utilisée dans un événement privé, les personnes filmées doivent être informées et leur vie privée doit être respectée. La CNIL rappelle notamment qu'une caméra à domicile ne doit pas filmer la voie publique et que le droit à l'image des invités doit être respecté. citeturn0search3

## Signalement

Pour signaler un problème de sécurité, utiliser le canal de contact du responsable du projet. Ne pas publier de secret, token ou donnée personnelle dans une issue publique.

## Limite importante

Ce fichier décrit les mesures techniques prévues par le projet. Il ne constitue pas une certification de sécurité ni un audit indépendant.
