import fs from 'node:fs';

const manifestPath = 'android/app/src/main/AndroidManifest.xml';
if (!fs.existsSync(manifestPath)) {
  throw new Error('AndroidManifest.xml introuvable. Lancez d’abord: npx cap add android');
}

let xml = fs.readFileSync(manifestPath, 'utf8');

const permissions = [
  '<uses-permission android:name="android.permission.INTERNET" />',
  '<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />',
  '<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />',
  '<uses-permission android:name="android.permission.CAMERA" />'
];

for (const permission of permissions) {
  if (!xml.includes(permission)) {
    xml = xml.replace('<application', `${permission}\n    <application`);
  }
}

const deepLink = `
            <intent-filter>
                <action android:name="android.intent.action.VIEW" />
                <category android:name="android.intent.category.DEFAULT" />
                <category android:name="android.intent.category.BROWSABLE" />
                <data android:scheme="sosanimaux" android:host="login-callback" />
            </intent-filter>`;

if (!xml.includes('android:scheme="sosanimaux"')) {
  const activityEnd = xml.indexOf('</activity>');
  if (activityEnd === -1) throw new Error('Balise </activity> introuvable');
  xml = xml.slice(0, activityEnd) + deepLink + '\n        ' + xml.slice(activityEnd);
}

// Nouveau logo officiel SOS Animaux
const sourceIcon = 'icons/icon-512.png';
const drawableDir = 'android/app/src/main/res/drawable';
const targetIcon = `${drawableDir}/sos_animaux_icon.png`;

if (!fs.existsSync(sourceIcon)) {
  throw new Error('icons/icon-512.png introuvable');
}

fs.mkdirSync(drawableDir, { recursive: true });
fs.copyFileSync(sourceIcon, targetIcon);

if (/android:icon="[^"]*"/.test(xml)) {
  xml = xml.replace(
    /android:icon="[^"]*"/,
    'android:icon="@drawable/sos_animaux_icon"'
  );
}

if (/android:roundIcon="[^"]*"/.test(xml)) {
  xml = xml.replace(
    /android:roundIcon="[^"]*"/,
    'android:roundIcon="@drawable/sos_animaux_icon"'
  );
}

fs.writeFileSync(manifestPath, xml);

console.log(
  'Android configuré : GPS, caméra, OAuth et nouveau logo officiel SOS Animaux.'
);
