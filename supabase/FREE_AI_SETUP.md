# Recherche IA gratuite des cadeaux

Le site utilise une combinaison **Tavily + OpenRouter** côté serveur :

- **Tavily** : recherche Web en temps réel.
- **OpenRouter `openrouter/free`** : analyse et synthèse avec des modèles gratuits.

Tavily propose actuellement 1 000 crédits API gratuits par mois sans carte bancaire. citeturn295926search11

OpenRouter propose actuellement des modèles gratuits et le routeur `openrouter/free` ; son offre gratuite indique 50 requêtes par jour. citeturn295926search0turn295926search1turn295926search2

## Secrets Supabase

Dans Supabase → Edge Functions → Secrets, ajoute :

```text
TAVILY_API_KEY=ta_cle_tavily
OPENROUTER_API_KEY=ta_cle_openrouter
```

Ces clés restent côté serveur.

## Fonction

```text
supabase/functions/gift-search/index.ts
```

Endpoint utilisé par le site :

```text
https://ckasbsnzxgwfwfnctioe.supabase.co/functions/v1/gift-search
```

## Fonctionnement

Quand on clique sur **Comparer les prix** :

1. Tavily recherche plusieurs requêtes sur le Web.
2. Les résultats sont regroupés.
3. Le modèle gratuit d’OpenRouter analyse les résultats.
4. Le site affiche directement dans la fiche :
   - produit identifié ;
   - résumé ;
   - offres ;
   - prix ;
   - disponibilité quand elle est vérifiable ;
   - liens ;
   - sources.

Il n'y a donc plus de nouvel onglet vers un service d'IA.

### Limites du gratuit

Les quotas gratuits sont limités. OpenRouter indique actuellement 50 requêtes par jour sur son offre Free, tandis que Tavily fournit 1 000 crédits API gratuits par mois. citeturn295926search1turn295926search11

Si le quota est atteint, le site affiche une erreur au lieu de faire payer automatiquement une requête.
