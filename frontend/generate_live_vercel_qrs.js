import QRCode from 'qrcode';

const liveUrl = 'https://anapoorna-xi.vercel.app';

const targets = [
  { name: 'anapoorna_live_vercel_qr.png', url: liveUrl },
  { name: 'anapoorna_live_donor_qr.png', url: `${liveUrl}/register?role=DONOR` },
  { name: 'anapoorna_live_ngo_qr.png', url: `${liveUrl}/register?role=NGO` }
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
    console.log(`Live Vercel QR generated: ${t.name} -> ${t.url}`);
  });
});
