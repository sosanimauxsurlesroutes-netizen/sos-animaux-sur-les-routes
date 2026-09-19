import fs from 'node:fs';

const key = String(
  process.env.SOS_SUPABASE_PUBLISHABLE_KEY || ''
).trim();

if (!key.startsWith('sb_publishable_')) {
  console.error('Clé Supabase absente ou invalide.');
  process.exit(1);
}

const file = 'www/index.html';
const marker = '__SOS_SUPABASE_PUBLISHABLE_KEY__';

let html = fs.readFileSync(file, 'utf8');

if (html.includes(marker)) {
  html = html.replace(marker, key);
  console.log('Clé Supabase injectée dans www/index.html');
}

const hideBlock = `
<script>
(() => {
  function hideCloudUI() {
    document.querySelectorAll('body *').forEach(el => {
      const t = (el.textContent || '')
        .replace(/\\s+/g, ' ')
        .trim()
        .toLowerCase()
        .replace(/^[^a-zà-ÿ]+/i, '');

      if (
        t === 'sos animaux en ligne' ||
        t === 'connecter' ||
        t === 'synchroniser' ||
        t.startsWith('lecture en ligne réussie') ||
        t.startsWith('base locale prête') ||
        t.startsWith('la synchronisation récupère')
      ) {
        el.style.display = 'none';
      }
    });
  }

  document.addEventListener('DOMContentLoaded', hideCloudUI);
  setTimeout(hideCloudUI, 500);
  setTimeout(hideCloudUI, 1500);
})();
</script>`;

if (!html.includes('hideCloudUI')) {
  html = html.replace('</body>', hideBlock + '</body>');
}

fs.writeFileSync(file, html);

console.log('Bloc SOS Animaux en ligne masqué.');
