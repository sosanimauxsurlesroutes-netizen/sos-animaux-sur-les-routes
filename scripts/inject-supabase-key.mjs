import fs from 'node:fs';

const key = String(
  process.env.SOS_SUPABASE_PUBLISHABLE_KEY || ''
).trim();

if (!key) {
  console.log('Aucune clé Supabase fournie.');
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

const cleanupMarker = 'data-sos-cloud-ui-cleanup';

const cleanupScript = `
<script data-sos-cloud-ui-cleanup>
(() => {
  const clean = (value) =>
    String(value || '')
      .replace(/\\s+/g, ' ')
     
