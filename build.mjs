import {cp,rm,readFile,writeFile} from 'node:fs/promises';
import {build} from 'esbuild';
await rm('www',{recursive:true,force:true});
await cp('../dist','www',{recursive:true});
let html=await readFile('www/index.html','utf8');
html=html.replace('</head>','<link rel="stylesheet" href="mobile.css"></head>').replace('</body>','<script src="native.js"></script></body>');
await writeFile('www/index.html',html);
let css=await readFile('www/style.css','utf8');
css=css.replace(/@import url\([^;]+;/g,'');
await writeFile('www/style.css',css);
let js=await readFile('www/app.js','utf8');
js=js.replaceAll('Kalendáře iPhonu','kalendáře telefonu').replaceAll('Kalendáři iPhonu','kalendáři telefonu').replaceAll('Kalendář iPhonu','kalendář telefonu').replaceAll('upozornění pro iPhone','soubor pro kalendář telefonu');
// Await the native share sheet: report success only after the plugin succeeds.
js=js.replace('function exportEvent(id){','async function exportEvent(id){').replace("download(folded,'udalost-MM.ics','text/calendar;charset=utf-8');toast('Otevřete soubor v Kalendáři a potvrďte přidání.')","try{await download(folded,'udalost-MM.ics','text/calendar;charset=utf-8')}catch{toast('Soubor se nepodařilo sdílet. Zkuste to znovu.')}" );
js=js.replace("function backup(){download(JSON.stringify({version:2,...data},null,2),'osobni-diar-MM-zaloha.json','application/json');toast('Záloha je připravena ke stažení')}","async function backup(){try{await download(JSON.stringify({version:2,...data},null,2),'osobni-diar-MM-zaloha.json','application/json')}catch{toast('Zálohu se nepodařilo sdílet. Zkuste to znovu.')}}");
await writeFile('www/app.js',js);
await cp('src/mobile.css','www/mobile.css');
await build({entryPoints:['src/native.js'],bundle:true,format:'iife',outfile:'www/native.js',target:['safari15','chrome105']});
