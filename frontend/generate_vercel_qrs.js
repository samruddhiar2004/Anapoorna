import QRCode from 'qrcode';

const vercelBaseUrl = 'https://anapoorna.vercel.app';

const targets = [
  { name: 'vercel_qr_app.png', url: vercelBaseUrl },
  { name: 'vercel_qr_register_all.png', url: `${vercelBaseUrl}/register` },
  { name: 'vercel_qr_register_donor.png', url: `${vercelBaseUrl}/register?role=DONOR` },
  { name: 'vercel_qr_register_ngo.png', url: `${vercelBaseUrl}/register?role=NGO` }
];

targets.forEach(t => {
  QRCode.toFile(t.name, t.url, {
    color: {
      dark: '#0f172a',
      light: '#ffffff'
    },
    width: 1000,
    margin: 2
  }, function (err) {
    if (err) throw err;
    console.log(`Vercel QR generated: ${t.name} -> ${t.url}`);
  });
});
