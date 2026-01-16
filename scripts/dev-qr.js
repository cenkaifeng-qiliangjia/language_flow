const qrcode = require('qrcode-terminal');
const os = require('os');

// 获取本地 IP 地址
const networks = os.networkInterfaces();
let localIp = 'localhost';

for (const name of Object.keys(networks)) {
  for (const net of networks[name]) {
    // 过滤出 IPv4 且非内部回路地址
    if (net.family === 'IPv4' && !net.internal) {
      localIp = net.address;
      break;
    }
  }
}

const port = 3000;
const url = `http://${localIp}:${port}`;

console.log('\n\x1b[36m%s\x1b[0m', '─────────────────────────────────────────────────');
console.log('\x1b[32m%s\x1b[0m', '  📱 手机扫码即可访问局域网地址进行测试:');
console.log('\x1b[33m%s\x1b[0m', `  ${url}`);
console.log('\x1b[36m%s\x1b[0m', '─────────────────────────────────────────────────\n');

qrcode.generate(url, { small: true });
