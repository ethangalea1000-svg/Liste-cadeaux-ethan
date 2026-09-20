# Recherche Web + IA gratuite

La recherche intégrée du site utilise :

- **SearXNG** pour rechercher gratuitement sur le Web et les images.
- **Hugging Face Inference Providers** pour analyser et comparer les résultats.

SearXNG fournit une API HTTP de recherche et peut retourner des résultats JSON ; la liste publique de SearXNG recense les instances disponibles. citeturn885927search0turn885927search5

Hugging Face fournit une API compatible OpenAI pour les Inference Providers et chaque compte gratuit dispose actuellement de crédits mensuels limités ; la limite peut évoluer. citeturn862079search0turn647418search0

## Secret Supabase

Le seul secret nécessaire dans la configuration actuelle est :

```text
HF_TOKEN=ton_token_hugging_face
```

Il doit être enregistré dans **Supabase → Edge Functions → Secrets**.

La fonction ne met jamais le token dans `index.html`.

## Fonction

```text
supabase/functions/gift-search/index.ts
```

Endpoint :

```text
https://ckasbsnzxgwfwfnctioe.supabase.co/functions/v1/gift-search
```

## Fonctionnement

Quand tu cliques sur **🔎 Comparer les prix et vérifier les sites disponibles** :

1. La fonction cherche le cadeau sur un moteur SearXNG public.
2. Elle effectue une recherche générale en français et une recherche d'images.
3. Les résultats Web sont envoyés à Hugging Face.
4. Le modèle analyse les résultats sans inventer les prix ou les disponibilités.
5. La carte affiche directement :
   - produit identifié ;
   - résumé ;
   - offres trouvées ;
   - prix visibles ;
   - disponibilité lorsque le résultat la permet ;
   - liens ;
   - sources ;
   - images.

Il n'y a pas de nouvel onglet vers une IA.

## À savoir

Les instances SearXNG publiques peuvent être temporairement indisponibles ou limiter les requêtes. La fonction possède une seconde instance publique de secours.

Le crédit Hugging Face gratuit n’est pas illimité. La documentation actuelle indique **0,10 $ de crédits mensuels pour les comptes Free**, avec possibilité d'acheter des crédits supplémentaires. Le site n'effectue aucun achat automatiquement. citeturn647418search0
