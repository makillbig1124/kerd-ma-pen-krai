// ลบผู้เล่นที่ทุกเครื่องเห็น (เซฟเกมในเครื่องของคนนั้นจะไม่ถูกเปิดอีก)
// วิธีใช้: node scripts/remove-player.mjs "ชื่อ"
// ไม่ใส่ชื่อ = แสดงรายชื่อทั้งหมด
import { readPlayers, writePlayers, printList } from './players-lib.mjs';

const name = (process.argv[2] || '').trim();
const list = readPlayers();
if (!name) { printList(list); process.exit(0); }
const next = list.filter(p => p.name !== name);
if (next.length === list.length) { console.error(`ไม่พบผู้เล่นชื่อ "${name}"`); printList(list); process.exit(1); }
writePlayers(next);
console.log(`ลบ "${name}" แล้ว`);
printList(next);
console.log('\nอย่าลืม push ขึ้นเว็บ: git commit -am "ลบผู้เล่น" && git push');
