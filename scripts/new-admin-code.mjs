// สร้างรหัสผู้ดูแลใหม่สำหรับเกม "เกิดมาเป็นใคร"
// วิธีใช้: node scripts/new-admin-code.mjs
// - ใส่ค่า hash ของรหัสลงใน index.html (ไม่มีรหัสจริงอยู่ในโค้ด)
// - เขียนรหัสจริงไว้ที่ admin-code.txt ในเครื่องนี้เท่านั้น (ไฟล์นี้ไม่ถูกอัปขึ้น GitHub)
import { readFileSync, writeFileSync } from 'node:fs';
import { randomBytes, randomInt, pbkdf2Sync } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const ALPHA = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // ตัดตัวที่สับสนง่ายออก (0/O, 1/I)
const raw = Array.from({ length: 12 }, () => ALPHA[randomInt(ALPHA.length)]).join('');
const code = raw.match(/.{4}/g).join('-');
const salt = randomBytes(16).toString('hex');
const hash = pbkdf2Sync(raw, salt, 150000, 32, 'sha256').toString('hex');

const file = join(root, 'index.html');
const html = readFileSync(file, 'utf8');
const re = /const ADMIN=\{salt:'[^']*',hash:'[^']*',iter:150000\};/;
if (!re.test(html)) { console.error('หาบรรทัด ADMIN ใน index.html ไม่เจอ'); process.exit(1); }
writeFileSync(file, html.replace(re, `const ADMIN={salt:'${salt}',hash:'${hash}',iter:150000};`));
writeFileSync(join(root, 'admin-code.txt'),
  `รหัสผู้ดูแลเกม "เกิดมาเป็นใคร"\n\n${code}\n\nใช้ตอนกด "ผู้ดูแล: เพิ่มหรือลบผู้เล่น" ที่หน้า login\nเก็บไฟล์นี้ไว้กับตัว อย่าส่งให้ใคร ไฟล์นี้ไม่ถูกอัปขึ้น GitHub\nถ้าอยากเปลี่ยนรหัส: node scripts/new-admin-code.mjs แล้ว push ขึ้นเว็บใหม่\n`);
console.log('สร้างรหัสผู้ดูแลใหม่แล้ว ดูรหัสได้ที่ admin-code.txt');
