# Parcel Tracker Card

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-41BDF5.svg)](https://github.com/hacs/integration)
[![Validate](https://github.com/MaximeBranger/parcel-tracker_card/actions/workflows/validate.yaml/badge.svg)](https://github.com/MaximeBranger/parcel-tracker_card/actions/workflows/validate.yaml)

Carte Lovelace personnalisée pour visualiser et gérer les colis suivis par l'intégration Home Assistant [`parcel_tracker`](https://github.com/MaximeBranger/parcel-tracker).

Ce package HACS est **optionnel et séparé** de l'intégration backend : il ne fait aucun appel direct à un transporteur, il consomme uniquement les entités, attributs, services et événements exposés par `parcel_tracker`.

Voir [SPECIFICATIONS.md](SPECIFICATIONS.md) pour la spécification complète.

> [!NOTE]
> Ce projet est entièrement « vibe codé » avec [Claude](https://claude.com) (Anthropic) : le code, la documentation et la configuration ont été générés par IA à partir de spécifications, avec relecture humaine.

## Prérequis

* Une instance Home Assistant avec [HACS](https://hacs.xyz) installé.
* L'intégration [`parcel_tracker`](https://github.com/MaximeBranger/parcel-tracker) installée et configurée (cette carte n'affiche rien sans elle).

## Installation

### Via HACS (recommandé)

1. Dans Home Assistant : **HACS → menu (⋮) → Dépôts personnalisés**.
2. Ajouter l'URL `https://github.com/MaximeBranger/parcel-tracker_card`, catégorie **Plugin**.
3. Rechercher **Parcel Tracker Card** dans HACS et l'installer.
4. Redémarrer Home Assistant si demandé.
5. Dans **Paramètres → Tableaux de bord → Ressources**, vérifier que `parcel-tracker-card.js` a bien été ajouté automatiquement par HACS (sinon, l'ajouter manuellement en type « Module JavaScript »).

### Installation manuelle

1. Télécharger `dist/parcel-tracker-card.js` depuis ce dépôt (ou compiler le projet, voir [Développement](#développement)).
2. Copier ce fichier dans `config/www/parcel-tracker-card.js` de votre instance Home Assistant.
3. Ajouter la ressource dans **Paramètres → Tableaux de bord → Ressources** :
   * URL : `/local/parcel-tracker-card.js`
   * Type : **Module JavaScript**
4. Recharger l'interface (vider le cache navigateur si la carte ne s'affiche pas).

## Utilisation

Ajouter la carte à un tableau de bord via l'éditeur de dashboard (**Ajouter une carte → Parcel Tracker Card**) ou en YAML :

```yaml
type: custom:parcel-tracker-card
```

La carte affiche automatiquement les colis actifs exposés par l'intégration `parcel_tracker` (aucune configuration d'entité n'est requise). Elle permet aussi d'ajouter, modifier, archiver et supprimer des colis directement depuis son interface (bouton « + » et icône de rafraîchissement dans l'en-tête, menu ⋮ sur chaque ligne).

Options de configuration (toutes facultatives) :

| Option | Type | Défaut | Description |
| --- | --- | --- | --- |
| `title` | string | `Parcel Tracker` | Titre affiché dans l'en-tête de la carte. |
| `editable` | boolean | `true` | Si `false`, masque les actions de gestion (ajout, modification, archivage, suppression, rafraîchissement) pour un usage en lecture seule (ex. tableau de bord partagé/kiosque). |

## Développement

Cloner le dépôt puis :

```bash
npm install
npm run build
```

Le fichier compilé est généré dans `dist/parcel-tracker-card.js`. Pour recompiler automatiquement à chaque modification :

```bash
npm run watch
```

Pour tester les changements dans Home Assistant, pointez la ressource Lovelace vers ce fichier compilé (voir [Installation manuelle](#installation-manuelle)) et rechargez la page après chaque build.

## License

MIT — voir [LICENSE](LICENSE).
