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
* `notify_target`
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
* `parcel_tracker.update` — édite nom, notes, transporteur et/ou numéro de suivi d'un colis existant, sans recréer son entité. Nécessite `parcel_id`.
* `parcel_tracker.remove`
* `parcel_tracker.refresh` — rafraîchit tous les colis actifs ; pas de variante par colis.
* `parcel_tracker.archive`
* `parcel_tracker.get_history` — retourne l'historique des colis (actifs et archivés), filtrable par mois, année et transporteur. Voie d'accès principale pour une vue « archives » dans la carte, le registre d'entités HA n'étant pas prévu pour ce type de requête.
* `parcel_tracker.get_configured_carriers` — retourne les transporteurs dont les identifiants sont configurés sur l'entrée (`{"carriers": [...]}`). Utilisé par le dialogue Ajouter/Modifier pour ne proposer que ces transporteurs dans le sélecteur — la carte n'a pas accès aux données de la config entry (clés API) pour le déterminer elle-même.
* `parcel_tracker.get_notify_targets` — retourne les cibles de notification disponibles (`{"targets": [...]}`) : entités du domaine `notify` et services legacy encore enregistrés sous ce domaine. Utilisé par le dialogue Ajouter/Modifier pour peupler le sélecteur `notify_target`.

`parcel_id` correspond au `unique_id` de l'entité (exposé par le registre d'entités HA), pas au `tracking_number`.

`parcel_tracker.add` et `parcel_tracker.update` (quand `tracking_number`/`carrier` changent) attendent la réponse du transporteur avant de retourner. Une erreur transporteur (numéro invalide, API indisponible) ne fait pas échouer l'appel de service : le colis est créé/mis à jour quand même, et l'échec est signalé de façon asynchrone via l'événement `parcel_error`, corrélé par `tracking_number` (le service ne renvoie pas le `parcel_id`).

### Événements Home Assistant

Utilisables par la carte pour se rafraîchir en temps réel ou déclencher des mises en avant visuelles (ex. badge « nouveau »/« livré ») :

* `parcel_added`
* `parcel_updated`
* `parcel_delivered`
* `parcel_removed`
* `parcel_error`

---

## Gestion depuis la carte (ajout, modification, suppression, archivage)

La carte ne se contente pas d'afficher les colis : elle permet de les gérer directement, sans passer par Outils de développement (conforme à la vision « visualiser et gérer »).

### Points d'entrée

* **En-tête de la carte** : une icône « + » ouvre le dialogue d'ajout ; une icône « refresh » déclenche `parcel_tracker.refresh` (global — il n'y a pas de rafraîchissement par colis côté service).
* **Par ligne de colis** : le clic sur la ligne garde son comportement actuel (ouverture du dialogue `more-info` standard de HA). Un bouton menu (⋮), affiché en permanence sur chaque ligne — pas seulement au survol, pour rester utilisable au tactile — donne accès aux actions :
  * **Modifier** — toujours disponible.
  * **Archiver** — visible uniquement quand le colis est au statut « Livré » (`parcel_tracker.archive` n'impose aucune restriction côté service, mais aucun service de désarchivage n'existe ; la carte réserve donc cette action au cas d'usage prévu). Déclenchée directement, sans confirmation : contrairement à la suppression, aucune donnée n'est perdue.
  * **Supprimer** — toujours disponible, avec confirmation (voir plus bas).
* **État vide** (« Aucun colis suivi ») : reste cliquable comme point d'entrée additionnel vers l'ajout.
* Option de configuration `editable` (booléen, défaut `true`) : si `false`, masque le bouton « + », l'icône refresh et le menu ⋮ de chaque ligne, pour un usage tableau de bord en lecture seule (ex. affichage partagé/kiosque). Aucune vérification des permissions HA de l'utilisateur n'est faite côté carte — un appel de service refusé échoue normalement via le mécanisme d'erreur standard de HA.

### Dialogue Ajouter / Modifier

Un unique dialogue « upsert », implémenté avec `ha-dialog` (fourni par le frontend HA au runtime, déjà utilisé de facto via `ha-icon`/`ha-card`), réutilisé pré-rempli en mode modification (appelle `update` avec le `parcel_id` au lieu d'`add`).

Le sélecteur de transporteur n'affiche que les transporteurs configurés (appel à `parcel_tracker.get_configured_carriers` à l'ouverture du dialogue), à l'exception du transporteur déjà sélectionné en mode modification : celui-ci reste proposé même si ses identifiants ont depuis été retirés de la configuration, pour ne pas forcer un changement de transporteur non désiré en modifiant un autre champ — même règle que `ParcelTrackerOptionsFlow.async_step_edit_parcel` côté backend. Si l'appel échoue ou si aucun transporteur n'est configuré, la carte retombe sur la liste complète plutôt que de bloquer le formulaire.

Le sélecteur de cible de notification suit la même logique (appel à `parcel_tracker.get_notify_targets`, avec un premier choix « Aucune notification » correspondant à une valeur vide) : la cible déjà sélectionnée en mode modification reste proposée même si elle a disparu de la liste retournée (entité/service supprimé depuis), pour ne pas l'effacer silencieusement en modifiant un autre champ.

Champs, alignés sur ceux acceptés par les services `add`/`update` :

* `tracking_number` — requis.
* `carrier` — sélection fermée parmi `laposte`, `fedex`, `dhl`, `ups`, `mondial_relay`.
* `name`
* `notes`
* `notify_target` — sélection parmi les cibles retournées par `parcel_tracker.get_notify_targets`, ou « Aucune notification ».

Comportement à la soumission :

1. Le bouton de soumission passe en état de chargement ; le dialogue reste ouvert et bloqué jusqu'à la réponse du service (potentiellement plusieurs secondes, le temps de l'appel transporteur).
2. Une fois le service résolu, le dialogue écoute l'événement `parcel_error` (corrélé par `tracking_number`) pendant ~5 secondes avant de se fermer :
   * rien ne survient → fermeture silencieuse (succès) ;
   * `parcel_error` survient → message d'erreur affiché dans le dialogue, qui reste ouvert pour correction.
   * Cette écoute s'applique aussi bien à l'ajout qu'à la modification (dès que `tracking_number`/`carrier` changent), les deux cas pouvant déclencher un rafraîchissement transporteur dont l'échec est avalé côté service.

### Suppression

`parcel_tracker.remove` efface définitivement les données et l'entité du colis. La carte affiche donc un dialogue de confirmation dédié (« Supprimer définitivement [nom] ? ») avant d'appeler le service.

### Hors périmètre (délibérément non traité par cette itération)

* Rafraîchissement par colis (nécessiterait une évolution du service `parcel_tracker.refresh` côté backend).
* Mises en avant visuelles (badges « nouveau »/« livré ») sur les événements `parcel_added`/`parcel_delivered` — la carte ne s'abonne qu'à `parcel_error` pour les besoins du dialogue d'ajout/modification.
* Désarchivage (aucun service backend correspondant).

## Roadmap

La carte est positionnée en **V2** dans la roadmap globale du projet, une fois le backend MVP (provider La Poste, gestion des colis, entités/services/événements) stabilisé.

---

## Principes techniques

* Distribution via HACS, en package séparé de `parcel_tracker`
* Aucune logique de suivi ou d'appel transporteur dans la carte — lecture seule des entités/attributs, actions via services HA
* Compatible avec les colis archivés en lecture (via `parcel_tracker.get_history`), non affichés par défaut
* Suit les évolutions du contrat de données du backend documenté ci-dessus
