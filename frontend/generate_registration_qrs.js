import QRCode from 'qrcode';

const localIp = '172.16.2.65';
const baseUrl = `http://${localIp}:5173`;

const targets = [
  { name: 'qr_register_all.png', url: `${baseUrl}/register` },
  { name: 'qr_register_donor.png', url: `${baseUrl}/register?role=DONOR` },
  { name: 'qr_register_ngo.png', url: `${baseUrl}/register?role=NGO` },
  { name: 'qr_register_volunteer.png', url: `${baseUrl}/register?role=VOLUNTEER` }
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
    console.log(`Generated: ${t.name} -> ${t.url}`);
  });
});
