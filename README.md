# HelloHumans – Documentation complète

## 1. Présentation du projet

**HelloHumans** est une application web dont l’objectif est de fournir :

1. Un **widget de chat** à intégrer sur un site client (ex : chat box pour support, marketing, etc.).
2. Un **panel d’administration** pour gérer les utilisateurs, les projets, la configuration du chat, l’abonnement payant, l’usage, etc.

Le projet est organisé en deux parties principales :

- **backend/** : Framework [AdonisJS](https://adonisjs.com/) v6 (TypeScript), relié à [Supabase](https://supabase.com/) pour la base de données et l’authentification.
- **frontend/** : Framework [Nuxt 3](https://v3.nuxtjs.org/) (TypeScript), avec [Pinia](https://pinia.vuejs.org/) pour la gestion d’état, [vue-i18n](https://vue-i18n.intlify.dev/) pour la traduction, [Stripe](https://stripe.com/) côté client (Elements ou Checkout) pour le paiement.

Le projet **HelloHumans** comporte :

- **Chat** : composant widget / pages Chat
- **Panel** : tableau de bord, gestion projet, upgrade payant, settings

---

## 2. Organisation du dépôt Git

```
helloHumans/
├─ .git/
├─ .idea/              // Config JetBrains
├─ backend/            // AdonisJS + Supabase
│  ├─ app/
│  │  ├─ controllers/Chat       (ClientsController, VisitorsController, MessagesController...)
│  │  ├─ controllers/Panel      (AuthController, SubscriptionController, StripeWebhookController, etc.)
│  │  ├─ exceptions/            (ErrorList.ts, handler.ts)
│  │  ├─ middleware/            (panel_ensure_user, panel_ensure_project, etc.)
│  │  └─ services/              (stripeService, supabaseService, mailService, usageService, etc.)
│  ├─ config/
│  ├─ contracts/
│  ├─ resources/
│  ├─ start/
│  ├─ tests/
│  ├─ .env
│  ├─ package.json
│  ├─ tsconfig.json
│  └─ ...
├─ frontend/           // Nuxt 3 + Pinia + vue-i18n
│  ├─ pages/panel       (login.vue, register.vue, forgot-password.vue, etc.)
│  ├─ components/panel  (menuPage.vue, sideMenu.vue, baseModal.vue, etc.)
│  ├─ stores            (panelStore.ts, publicStore.ts, upgradeStore.ts)
│  ├─ composables       (usePanelApi.ts, useStripeElements.ts, etc.)
│  ├─ assets            (icons, css)
│  ├─ plugins           (vue-datepicker, etc.)
│  ├─ nuxt.config.ts
│  └─ ...
├─ deploy.sh
├─ README.md
└─ ...
```

---

## 3. Backend – AdonisJS

### 3.1 Architecture

- **Framework** : AdonisJS 6 / TypeScript
- **Config** : `config/*`
- **Chargement** : `start/kernel.ts` (middlewares), `start/routes.ts` (définition des routes)
- **Base de données** : Supabase (PostgreSQL derrière), via `supabaseService.ts`

### 3.2 Contrôleurs (dossier `app/controllers`)

1. **Chat**
     - `ClientsController`, `VisitorsController`, `MessagesController`
     - Routes `/chat/...` pour la logique du widget chat

2. **Panel**
     - `AuthController` : login, register, forgot-password, reset-password
     - `ClientController` : gestion de `clients`, `client_projects`
     - `UserController` : gère l’utilisateur interne
     - `SubscriptionController` : logiques d’abonnement Stripe (create, update, cancel, preview)
     - `StripeWebhookController` : reçoit les webhooks Stripe
     - `UpgradeController` : renvoie les plans/modules pour l’UI
     - `UsageController` : gestion de l’usage (ex: interactions par mois)

### 3.3 Services (`app/services/*`)

- **`supabaseService.ts`** : Connexion et appels à Supabase (tables `users`, `client_projects`, etc.).
- **`stripeService.ts`** : Gère la facturation Stripe (createCustomer, createSubscription, updateSubscription…).
- **`mailService.ts`** : Envoi de mails (mot de passe oublié, inscription, etc.).
- **`usageService.ts`** : Calcul/stockage de l’usage mensuel.
- Etc.

### 3.4 Middlewares (`app/middleware/*`)

- **`panel_ensure_user_middleware.ts`** : Vérifie token Supabase, stocke `ctx.auth.user`.
- **`panel_ensure_project_middleware.ts`** : Vérifie que l’utilisateur est `owner/admin` sur le projet.
- **`chat_security_middleware.ts`** : (optionnel) anti-spam pour `/chat/*`.

### 3.5 Routes (`start/routes.ts`)

- **`/chat/*`** : routes du widget chat
- **`/panel/auth/*`** : login, register, forgot-password
- **`/panel/*`** (protégé par `panel_ensure_user_middleware`) : usage, client, user
- **`/panel/stripe/*`** (protégé par `panel_ensure_project_middleware`) : create-subscription, update, etc.
- **`/panel/webhook/*`** (non protégé) : Stripe webhooks

---

## 4. Base de données (Supabase)

### 4.1 Tables principales

1. **`users`**
     - `id`, `auth_uuid`, `lang`
2. **`clients`**
     - `id`
3. **`client_projects`**
     - `id`, `client_id`, `website`
4. **`client_users`**
     - `id`, `client_id`, `user_id`, `auth_id`, `role`
5. **`client_project_subscriptions`**
     - `id`, `project_id`
     - `stripe_customer_id`, `stripe_subscription_id`
     - `current_plan_id`, `current_modules`, `status`, `billing_cycle`
     - `current_period_end`, `is_trial`, `trial_end_at`, `payment_failed`
6. **`subscription_plans`**
     - `id` (ex: free, starter, growth, etc.)
     - `stripe_price_id_month`, `stripe_price_id_year`
     - `name`, `description`, `monthlyPrice`, `discountMonths`, etc.

### 4.2 Authentification via Supabase

- `supabaseService.auth.signUp(...)`, etc.
- Les middlewares Adonis vérifient ensuite la validité du token.

### 4.3 Abonnements

- Au moment de s’inscrire, on met l’utilisateur sur un `plan_id = free`.
- Quand on fait `/panel/stripe/create-subscription`, on :

     1. Récupère le `stripe_price_id_month` ou `stripe_price_id_year` dans `subscription_plans`.
     2. Crée/maj un abonnement Stripe via `stripeService`.
     3. Met à jour `client_project_subscriptions` (status, plan, etc.).

---

## 5. Frontend – Nuxt 3

### 5.1 Architecture

- **`pages/panel/*`** : login.vue, register.vue, forgot-password.vue, dashboard, usage, etc.
- **`components/panel/*`** : sideMenu, baseModal, subscriptionSummary, etc.
- **`stores/*`** : Pinia stores (`panelStore.ts`, `publicStore.ts`, `upgradeStore.ts`).
- **`composables/*`** : hooks/fonctions (ex: `usePanelApi`, `useStripeElements`).
- **`assets/*`** : icônes, feuilles CSS
- **`plugins/*`** : ex. vue-datepicker.js, etc.

### 5.2 Stores Pinia

- **`publicStore.ts`** : Gère la partie non connectée (login, register)
- **`panelStore.ts`** : Gère l’utilisateur connecté, la liste de projets, usage, etc.
- **`upgradeStore.ts`** : Mémorise le plan choisi, billingCycle, modules, total, etc.

### 5.3 Composables API

- **`usePanelApi.ts`** : fait un `fetch('/panel/...')` + token Bearer
- **`usePublicApi.ts`** : fait un `fetch('/auth/...')` si l’utilisateur n’est pas logué
- **`useStripeElements.ts`** : si on intègre Stripe Elements côté frontend

### 5.4 Pages panel importantes

- **`login.vue`, `register.vue`** : Auth
- **`forgot-password.vue`, `reset-password.vue`** : Mot de passe oublié
- **`dashboard.vue`** : Tableau de bord
- **`upgrade/index.vue`, `upgrade/modules.vue`** : Choix d’un plan payant + modules
- **`settings/*`** : configuration du chat, profil utilisateur, etc.

---

## 6. Système d’abonnements Stripe

### 6.1 Processus

1. **Choix plan + cycle** (ex: `growth`, `year`)
2. **Appel** `/panel/stripe/create-subscription` → on trouve `stripe_price_id_year` dans `subscription_plans`, on appelle `StripeService.createSubscription(...)`.
3. **Mise à jour** dans `client_project_subscriptions` (status, plan, period_end).

### 6.2 Webhooks

- **`StripeWebhookController.handle`** :
     - événements ex: `invoice.payment_succeeded` → on met `payment_failed = false`
     - `customer.subscription.deleted` → `status = 'canceled'`
     - etc.

### 6.3 Middlewares

- Sur `/panel/stripe/*`, on utilise `panel_ensure_project_middleware` pour être sûr que l’utilisateur a le droit de souscrire/annuler sur ce projet.

---

## 7. Sécurité / Middlewares

1. **`panel_ensure_user_middleware.ts`**
     - Vérifie token Supabase, stocke `ctx.auth.user`.
     - Protège `/panel/*`.

2. **`panel_ensure_project_middleware.ts`**
     - Vérifie que `project_id` appartient au client de l’utilisateur (`role = admin/owner`).
     - Protège `/panel/stripe/*`.

3. **Éventuels**
     - `chat_security_middleware.ts` (anti spam), etc.

---

## 8. Éléments clés d’intégration

1. **Mail** : via `mailService.ts`, templates Edge dans `app/services/mail/templates/*.edge`.
2. **i18n** : `resources/lang/fr.json` côté backend, + `i18n/locales/*.json` côté frontend.
3. **Rate-limiting** : à implémenter si besoin sur `/chat/visitors`, `/chat/messages`, etc.
4. **Stats d’usage** : `usageService.ts` + `UsageController`.

---

## 9. Prochaines étapes ou idées d’amélioration

- **Gestion PaymentMethods** : route `/panel/stripe/payment-methods` pour lister / attacher / supprimer des cartes.
- **Interface Facturation** : voir les factures, PDF, etc.
- **Historique Subscriptions** : table `client_project_subscriptions_history` pour conserver un log complet.
- **Onboarding plus poussé** : un wizard post-inscription pour configurer le chat.
- **Gestion plus fine** : ex. “Trial + modules payants” (certains modules payants même en période d’essai).
- **Documentation e2e** : un doc + scripts pour tester l’inscription, la souscription, la résiliation.

---

## 10. Conclusion

Ce document récapitule **toute l’architecture** du projet **HelloHumans** :

- **Frontend** (Nuxt 3) : pages panel, composables, pinia.
- **Backend** (AdonisJS) : controllers panel/chat, middlewares, services (stripe/supabase).
- **Base** (Supabase) : tables `client_project_subscriptions`, `subscription_plans`, etc.
- **Stripe** : gère la facturation, l’abonnement, le prorata, + webhooks pour MAJ.
- **Sécurité** : token Supabase Auth, middlewares, ACL sur projets.

Toute personne reprenant le projet peut **développer, corriger, ou étendre** HelloHumans en **gardant la même logique et la même structure**.
