# Home Assistant Parcel Tracker Card — Spécifications

> Ce document décrit `parcel_tracker-card`, la carte Lovelace personnalisée du projet Parcel Tracker. Les spécifications du backend (intégration `parcel_tracker`) vivent dans le dépôt séparé `parcel-tracker` et ne sont pas reprises ici, sauf pour le contrat de données dont cette carte dépend.

---

## Vision

`parcel_tracker-card` est une carte Lovelace personnalisée offrant une expérience « clé en main » pour visualiser et gérer les colis suivis par l'intégration **`parcel_tracker`**.

Elle consomme les entités et attributs exposés par `parcel_tracker` — elle ne fait aucun appel direct à un transporteur ou service externe.

---

## Positionnement — package HACS séparé et optionnel

Deux packages HACS, découplés :

* **`parcel_tracker`** : intégration backend — détection/suivi, entités, services, événements. Fonctionne seule, sans aucune dépendance frontend.
* **`parcel_tracker-card`** (ce dépôt) : carte Lovelace personnalisée consommant les entités et attributs exposés par `parcel_tracker`. Optionnelle — un utilisateur peut se contenter des cartes HA standards (entities, glance, markdown) sans jamais installer ce second package.

Cette séparation garde le composant backend léger pour les utilisateurs qui composent leur propre dashboard, tout en offrant une carte dédiée pour ceux qui veulent une expérience intégrée.

La carte n'a pas de logique de suivi propre : elle est une pure vue sur les données produites par le coordinator de `parcel_tracker`.

---

## Contrat de données consommé

La carte s'appuie exclusivement sur la surface publique exposée par `parcel_tracker` : entités, attributs, capteurs globaux, services et événements. Toute évolution de ce contrat côté backend doit être répercutée ici.

### Entités colis

Chaque colis actif est une entité, par exemple :

```text
sensor.amazon_order
```

État :

```text
En livraison
```

Attributs disponibles :

* `tracking_number`
* `carrier`
* `history`
* `estimated_delivery`
* `last_update`
* `last_location`
* `days_since_shipping`
* `tracking_url`

Un colis archivé conserve son entité (désactivée) — elle n'apparaît plus dans les capteurs globaux ni dans les dashboards par défaut. La carte ne doit donc afficher, par défaut, que les colis non archivés (sauf action explicite de l'utilisateur pour consulter l'historique).

### Capteurs globaux

* `sensor.parcels_active`
* `sensor.parcels_delivered`
* `sensor.parcels_waiting`
* `sensor.parcels_today`
* `sensor.parcels_late`

Ces capteurs ne comptent que les colis **non archivés** — utilisables par la carte pour des vues de synthèse (compteurs, badges).

### Statuts supportés

* Créé
* Pris en charge
* En transit
* Arrivé au centre de tri
* En livraison
* Livré
* Retard
* Incident
* Retour expéditeur

### Historique par colis

Chaque événement de l'historique comprend :

* Date
* Heure
* Libellé
* Localisation (si disponible)

### Services Home Assistant appelables depuis la carte

* `parcel_tracker.add`
* `parcel_tracker.remove`
* `parcel_tracker.refresh`
* `parcel_tracker.archive`
* `parcel_tracker.get_history` — retourne l'historique des colis (actifs et archivés), filtrable par mois, année et transporteur. Voie d'accès principale pour une vue « archives » dans la carte, le registre d'entités HA n'étant pas prévu pour ce type de requête.

### Événements Home Assistant

Utilisables par la carte pour se rafraîchir en temps réel ou déclencher des mises en avant visuelles (ex. badge « nouveau »/« livré ») :

* `parcel_added`
* `parcel_updated`
* `parcel_delivered`
* `parcel_removed`
* `parcel_error`

---

## Roadmap

La carte est positionnée en **V2** dans la roadmap globale du projet, une fois le backend MVP (provider La Poste, gestion des colis, entités/services/événements) stabilisé.

---

## Principes techniques

* Distribution via HACS, en package séparé de `parcel_tracker`
* Aucune logique de suivi ou d'appel transporteur dans la carte — lecture seule des entités/attributs, actions via services HA
* Compatible avec les colis archivés en lecture (via `parcel_tracker.get_history`), non affichés par défaut
* Suit les évolutions du contrat de données du backend documenté ci-dessus
