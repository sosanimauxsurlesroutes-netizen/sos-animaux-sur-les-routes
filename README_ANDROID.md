# SOS Animaux sur les Routes — Android V7.15.2

Cette version transforme la V7.15.2 en projet Android Capacitor.

## 1. Réglage Supabase indispensable pour Google/Facebook sur Android

Dans Supabase > Authentication > URL Configuration > Redirect URLs, ajoutez :

`sosanimaux://login-callback`

Conservez aussi l’URL web Vercel déjà utilisée.

Meta/Google continuent d’utiliser le callback Supabase HTTPS. Il n’est pas nécessaire de remplacer ce callback par le schéma Android.

## 2. Générer l’application avec Android Studio

Prérequis : Node.js, Java et Android Studio.

```bash
npm install
npx cap add android
npx cap sync android
node scripts/patch-android.mjs
npx cap open android
```

Dans Android Studio, utilisez Build > Build APK(s).

## 3. Générer automatiquement un APK avec GitHub Actions

Le workflow `build-android-apk.yml` peut générer un APK de test automatiquement.
Dans le dépôt principal, placez ce dossier sous `android-app/` et placez le workflow sous `.github/workflows/`.
Ouvrez ensuite GitHub > Actions > Build Android APK > Run workflow.
L’APK apparaît dans Artifacts sous le nom `SOS-Animaux-Android-debug`.

## Fonctionnalités Android préparées

- Application native Capacitor avec la V7.15.2 embarquée.
- GPS Android (permissions fine/coarse location).
- Caméra Android.
- Accès Internet pour Supabase, cartes et services en ligne.
- Connexion Google/Facebook via navigateur système et retour dans l’application avec `sosanimaux://login-callback`.
- Toutes les fonctionnalités web existantes restent dans `www/index.html`.

## Avant publication Play Store

Le debug APK sert aux tests. Pour le Play Store, il faudra ensuite :
- générer une clé de signature Android ;
- produire un fichier AAB signé ;
- ajouter icône 512×512 et visuels Play Store ;
- politique de confidentialité et fiche de sécurité des données ;
- tester GPS, photo, notifications et OAuth sur plusieurs téléphones.
