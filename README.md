# Parcel Tracker Card

Carte Lovelace personnalisée pour visualiser et gérer les colis suivis par l'intégration Home Assistant [`parcel_tracker`](https://github.com/MaximeBranger/parcel-tracker).

Ce package HACS est **optionnel et séparé** de l'intégration backend : il ne fait aucun appel direct à un transporteur, il consomme uniquement les entités, attributs, services et événements exposés par `parcel_tracker`.

Voir [SPECIFICATIONS.md](SPECIFICATIONS.md) pour la spécification complète.

## Installation

Via [HACS](https://hacs.xyz), en ajoutant ce dépôt comme dépôt personnalisé (catégorie « Plugin »). Nécessite l'intégration [`parcel_tracker`](https://github.com/MaximeBranger/parcel-tracker) installée et configurée.

## Développement

```bash
npm install
npm run build
```

## License

MIT — voir [LICENSE](LICENSE).
