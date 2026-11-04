// ใช้ร่วมกันระหว่าง add-player / remove-player / list-players
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

export const FILE = join(dirname(fileURLToPath(import.meta.url)), '..', 'index.html');
const RE = /const PLAYERS=(\[.*?\]);\n/s;

export function readPlayers() {
  const html = readFileSync(FILE, 'utf8');
  const m = html.match(RE);
  if (!m) throw new Error('หาบรรทัด PLAYERS ใน index.html ไม่เจอ');
  return JSON.parse(m[1]);
}
export function writePlayers(list) {
  const html = readFileSync(FILE, 'utf8');
  writeFileSync(FILE, html.replace(RE, `const PLAYERS=${JSON.stringify(list)};\n`));
}
// ต้องตรงกับ pinHash() ใน index.html
export function pinHash(p) {
  let h = 5381;
  for (const c of 'blk:' + p) h = ((h << 5) + h + c.charCodeAt(0)) | 0;
  return (h >>> 0).toString(36);
}
const pick = a => a[Math.floor(Math.random() * a.length)];
export function randLook() {
  const g = Math.random() < 0.5 ? 'f' : 'm';
  return {
    g,
    skin: pick(['#f7d5b5', '#efc29b', '#dca77c', '#c08a5e', '#9e6b45']),
    hair: pick(g === 'm' ? ['short', 'spiky', 'side', 'short'] : ['long', 'pony', 'bob', 'long']),
    hairCol: pick(['#20140e', '#2b1a12', '#3a2416', '#1a1a22']),
    shirt: pick(['#ff7b5c', '#5a8ad0', '#53e0ae', '#c38bff', '#ffd166', '#e06b6b']),
  };
}
export function printList(list) {
  if (!list.length) return console.log('ยังไม่มีผู้เล่นที่ทุกเครื่องเห็น');
  console.log('ผู้เล่นที่ทุกเครื่องเห็น:');
  for (const p of list) console.log(` - ${p.name}${p.pin ? ' (มี PIN)' : ''}`);
}
