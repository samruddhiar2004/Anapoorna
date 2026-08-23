import QRCode from 'qrcode';

const localIp = '172.16.2.65';
const localUrl = `http://${localIp}:5173`;

QRCode.toFile('qr_code.png', localUrl, {
  color: {
    dark: '#0f172a',
    light: '#ffffff'
  },
  width: 500
}, function (err) {
  if (err) throw err;
  console.log(`QR Code successfully saved to qr_code.png for URL: ${localUrl}`);
});
