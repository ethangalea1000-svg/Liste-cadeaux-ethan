# Mise en place de la recherche IA

Le site utilise une Supabase Edge Function pour appeler Gemini côté serveur. La clé Gemini n'est jamais mise dans `index.html`.

## 1. Secret Supabase

Dans Supabase → Edge Functions → Secrets, ajoute :

```text
GEMINI_API_KEY=ta_cle_gemini
```

Supabase recommande de conserver les clés tierces dans les secrets des Edge Functions et non dans le code envoyé au navigateur. 

## 2. Déployer la fonction

Déploie le dossier :

```text
supabase/functions/gift-search/index.ts
```

avec la configuration de `supabase/config.toml`.

L'URL obtenue sera :

```text
https://ckasbsnzxgwfwfnctioe.supabase.co/functions/v1/gift-search
```

## 3. Ce que fait l'API

La fonction appelle Gemini avec la recherche Google Web et Google Images. Elle renvoie au site :

- une vérification du produit ;
- un résumé ;
- les offres et prix trouvés ;
- la disponibilité lorsqu'elle est vérifiable ;
- les sources ;
- les images trouvées et leurs pages sources.

Le site affiche ensuite les résultats directement dans la fiche du cadeau, sans ouvrir un nouvel onglet.

### Important

Ne mets jamais la clé Gemini dans GitHub, dans `index.html` ou dans un fichier public.

Google documente le grounding avec Google Search pour accéder au Web en temps réel et obtenir des citations ; la recherche d'images est disponible avec Gemini 3.1 Flash Image. Supabase documente l'utilisation de secrets dans les Edge Functions.
