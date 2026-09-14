import fs from 'node:fs';

const path = 'android/app/src/main/AndroidManifest.xml';
if (!fs.existsSync(path)) throw new Error('AndroidManifest.xml introuvable. Lancez d’abord: npx cap add android');
let xml = fs.readFileSync(path, 'utf8');

const permissions = [
  '<uses-permission android:name="android.permission.INTERNET" />',
  '<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />',
  '<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />',
  '<uses-permission android:name="android.permission.CAMERA" />'
];
for (const permission of permissions) {
  if (!xml.includes(permission)) xml = xml.replace('<application', `${permission}\n    <application`);
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

fs.writeFileSync(path, xml);
console.log('AndroidManifest.xml configuré: GPS, caméra, Internet et OAuth deep link.');
