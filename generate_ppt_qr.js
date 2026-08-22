import QRCode from 'qrcode';
import path from 'path';

const githubUrl = 'https://github.com/samruddhiar2004/Anapoorna';

// 1. Generate GitHub Repository QR Code for PowerPoint (High Res 1000px)
QRCode.toFile('github_qr_code.png', githubUrl, {
  color: {
    dark: '#0f172a', // Premium dark slate
    light: '#ffffff'
  },
  width: 1000,
  margin: 2
}, function (err) {
  if (err) throw err;
  console.log(`GitHub QR Code generated: github_qr_code.png -> ${githubUrl}`);
});
