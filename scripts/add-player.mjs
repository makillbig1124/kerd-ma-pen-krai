// เพิ่มผู้เล่นที่ทุกเครื่องเห็น
// วิธีใช้:  node scripts/add-player.mjs            (ถามชื่อและ PIN ทีละขั้น)
//           node scripts/add-player.mjs "ชื่อ"     (ไม่มี PIN)
// เสร็จแล้ว push ขึ้นเว็บ: git commit -am "เพิ่มผู้เล่น" && git push
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import { readPlayers, writePlayers, pinHash, randLook, printList } from './players-lib.mjs';

async function askHidden(rl, q) {
  // ซ่อนตัวเลข PIN ตอนพิมพ์
  const write = rl._writeToOutput.bind(rl);
  rl._writeToOutput = s => write(s.startsWith(q) ? s : s.replace(/[^\r\n]/g, '*'));
  const v = await rl.question(q);
  rl._writeToOutput = write;
  return v;
}

let name = process.argv[2], pin = '';
if (!name) {
  const rl = createInterface({ input: stdin, output: stdout });
  name = (await rl.question('ชื่อผู้เล่น: ')).trim();
  pin = (await askHidden(rl, 'PIN 4 หลัก (กด Enter ถ้าไม่ต้องการ): ')).trim();
  rl.close();
}
name = (name || '').trim().slice(0, 14);
if (!name) { console.error('ต้องใส่ชื่อผู้เล่น'); process.exit(1); }
if (pin && !/^\d{4}$/.test(pin)) { console.error('PIN ต้องเป็นตัวเลข 4 หลัก'); process.exit(1); }

const list = readPlayers();
if (list.some(p => p.name === name)) { console.error(`มีผู้เล่นชื่อ "${name}" อยู่แล้ว`); process.exit(1); }
list.push({ id: 's' + Date.now().toString(36), name, pin: pin ? pinHash(pin) : null, look: randLook() });
writePlayers(list);
console.log(`เพิ่ม "${name}" แล้ว${pin ? ' (มี PIN)' : ''}`);
printList(list);
console.log('\nอย่าลืม push ขึ้นเว็บ: git commit -am "เพิ่มผู้เล่น" && git push');
