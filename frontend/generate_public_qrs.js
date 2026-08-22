import QRCode from 'qrcode';

const publicBaseUrl = 'https://anapoorna-app.loca.lt';

const targets = [
  { name: 'public_qr_app.png', url: publicBaseUrl },
  { name: 'public_qr_register_all.png', url: `${publicBaseUrl}/register` },
  { name: 'public_qr_register_donor.png', url: `${publicBaseUrl}/register?role=DONOR` },
  { name: 'public_qr_register_ngo.png', url: `${publicBaseUrl}/register?role=NGO` },
  { name: 'public_qr_register_volunteer.png', url: `${publicBaseUrl}/register?role=VOLUNTEER` }
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
    console.log(`Public QR generated: ${t.name} -> ${t.url}`);
  });
});
