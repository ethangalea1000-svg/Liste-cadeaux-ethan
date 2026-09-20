# Recherche IA des cadeaux avec Perplexity

Le site utilise une **Supabase Edge Function** pour appeler l’**API Agent de Perplexity** côté serveur. La clé Perplexity n’est jamais placée dans `index.html`.

L’API Agent de Perplexity permet d’utiliser la recherche Web avec des presets et des outils de recherche. La documentation actuelle présente notamment `pro-search` et le tool `web_search`. citeturn644179search0turn644179search2

## 1. Secret Supabase

Dans Supabase → Edge Functions → Secrets, ajoute :

```text
PERPLEXITY_API_KEY=ta_cle_perplexity
```

La clé doit rester côté serveur.

## 2. Déployer la fonction

Déploie :

```text
supabase/functions/gift-search/index.ts
```

avec :

```text
supabase/config.toml
```

L’endpoint utilisé par le site est :

```text
https://ckasbsnzxgwfwfnctioe.supabase.co/functions/v1/gift-search
```

## 3. Résultat

Quand on clique sur le bouton de comparaison dans une fiche cadeau, le navigateur appelle la fonction Supabase.

La fonction demande à Perplexity de :

- rechercher largement sur le Web ;
- vérifier le produit avec le nom et la description ;
- privilégier les vendeurs disponibles en France ;
- comparer les prix visibles ;
- vérifier la disponibilité quand elle est identifiable ;
- retourner des liens et des sources ;
- rechercher des pages d’images pertinentes.

Le résultat est ensuite **affiché directement dans la carte du cadeau**, sans ouvrir Perplexity dans un nouvel onglet.

### Important

Ne mets jamais la clé `PERPLEXITY_API_KEY` dans GitHub, dans `index.html` ou dans un fichier public.

Perplexity documente actuellement l’Agent API comme adapté aux workflows avec outils, et son outil `web_search` permet de filtrer les résultats et d’appliquer un contexte géographique. citeturn644179search0turn644179search2

> Note : l’ancien Sonar API évolue vers l’Agent API ; l’annonce Perplexity indique un retrait des endpoints Sonar le 27 septembre 2026. citeturn521260search1
