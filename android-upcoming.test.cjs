const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
function harness(){const element={innerHTML:'',textContent:'',classList:{add(){},remove(){}},addEventListener(){}};const context=vm.createContext({document:{querySelector:()=>element},localStorage:{getItem:()=>null},Date,URL,crypto:require('crypto').webcrypto,TextEncoder,window:{},setTimeout:()=>0,clearTimeout(){}});let app=fs.readFileSync(path.join(root,'dist/app.js'),'utf8').split("window.addEventListener('hashchange'")[0];let groups=fs.readFileSync(path.join(root,'mobile/src/upcoming.js'),'utf8').replace('export function','function');vm.runInContext(fs.readFileSync(path.join(root,'dist/namedays.js'),'utf8')+fs.readFileSync(path.join(root,'dist/extras.js'),'utf8')+app+'\n'+groups,context);return code=>vm.runInContext(code,context);}
const base={id:'a',title:'Kontrola',owner:'Maty',category:'Lékař',date:'2026-11-10',time:'10:00',kind:'event',repeat:'none',repeatUntil:'',note:'',reminder:'0'};
const events=[base,{...base,id:'b',title:'Trénink',category:'Trénink',owner:'Vojta',date:'2026-12-01',repeat:'weekly',repeatUntil:'2026-12-15'},{...base,id:'c',title:'Alena',owner:'',kind:'birthday',date:'1980-11-08'},{...base,id:'d',date:'2025-01-01'}];
function results(mode){const run=harness();return JSON.parse(run(`JSON.stringify(groupedUpcoming(${JSON.stringify(events)},'${mode}',{nextEventDate,effectiveRepeat,eventLabel,key,reference:new Date('2026-11-06T12:00:00')}))`));}
test('Categories include birthday and all recurring training dates, excluding past one-offs',()=>{const g=results('category');assert.deepEqual(g.map(x=>x.label),['Lékař','Narozeniny','Trénink']);assert.equal(g[0].items.length,1);assert.equal(g[1].items[0].event.title,'Alena');assert.equal(g[2].items.length,3);assert.deepEqual(g[2].items.map(x=>x.date.slice(0,10)),['2026-12-01','2026-12-08','2026-12-15']);});
test('Persons use child owner and birthday name without changing events',()=>{const g=results('person');assert.deepEqual(g.map(x=>x.label),['Alena','Maty','Vojta']);assert.equal(g[2].items.length,3);});
test('Months stay chronological and each column sorts dates nearest first',()=>{const g=results('month');assert.deepEqual(g.map(x=>x.key),['2026-11','2026-12']);assert.deepEqual(g[0].items.map(x=>x.event.id),['c','a']);});
test('Daily series fills a bounded year without top-five truncation',()=>{const run=harness();assert.equal(run(`groupedUpcoming([{...${JSON.stringify(base)},date:'2026-11-06',repeat:'daily'}],'category',{nextEventDate,effectiveRepeat,eventLabel,key,reference:new Date('2026-11-06T00:00:00')})[0].items.length`),365);});
