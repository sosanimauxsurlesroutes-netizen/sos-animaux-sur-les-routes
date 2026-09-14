import fs from 'node:fs';
const file='www/index.html';
const key=String(process.env.SOS_SUPABASE_PUBLISHABLE_KEY||'').trim();
if(!key){
  console.log('Aucune clé Supabase fournie : le mode configuration manuelle restera disponible.');
  process.exit(0);
}
if(!key.startsWith('sb_publishable_')){
  console.error('La variable SOS_SUPABASE_PUBLISHABLE_KEY doit commencer par sb_publishable_.');
  process.exit(1);
}
let html=fs.readFileSync(file,'utf8');
const marker='__SOS_SUPABASE_PUBLISHABLE_KEY__';
if(!html.includes(marker)){
  console.error('Marqueur Supabase introuvable dans www/index.html');
  process.exit(1);
}
html=html.replaceAll(marker,key);
fs.writeFileSync(file,html);
console.log('Clé Publishable Supabase injectée dans la version Android.');
