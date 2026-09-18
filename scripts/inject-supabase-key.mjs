import fs from 'node:fs';

const key = String(
  process.env.SOS_SUPABASE_PUBLISHABLE_KEY || ''
).trim();

if (!key) {
  console.log(
    'Aucune clé Supabase fournie : le mode configuration manuelle restera disponible.'
  );
  process.exit(0);
}

if (!key.startsWith('sb_publishable_')) {
  console.error(
    'La variable SOS_SUPABASE_PUBLISHABLE_KEY doit commencer par sb_publishable_.'
  );
  process.exit(1);
}

const files = [
  'index.html',
  'www/index.html'
];

const marker = '__SOS_SUPABASE_PUBLISHABLE_KEY__';

let modified = 0;

for (const file of files) {
  if (!fs.existsSync(file)) {
    console.log(`${file} introuvable : ignoré.`);
    continue;
  }

  let html = fs.readFileSync(file, 'utf8');

  if (!html.includes(marker)) {
    console.log(`Marqueur Supabase absent dans ${file} : ignoré.`);
    continue;
  }

  // Remplace une seule occurrence afin de conserver
  // la sentinelle utilisée par l'application.
  html = html.replace(marker, key);

  fs.writeFileSync(file, html);
  modified++;

  console.log(`Clé Supabase injectée dans ${file}.`);
}

console.log(`${modified} fichier(s) préparé(s) pour Supabase.`);
