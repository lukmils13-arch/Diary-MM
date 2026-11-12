/* Compact daily page, original whale and always-open daily notes. */
const mmIconPaths={
 calendar:'<rect x="4" y="5" width="16" height="16" rx="3"/><path d="M8 3v4m8-4v4M4 11h16"/>',
 week:'<rect x="4" y="5" width="16" height="16" rx="3"/><path d="M8 3v4m8-4v4M4 11h16m4 4h2m4 0h2m-8 3h2m4 0h2"/>',
 month:'<rect x="4" y="5" width="16" height="16" rx="3"/><path d="M8 3v4m8-4v4M4 11h16m-12 4h1m3 0h1m3 0h1m-9 3h1m3 0h1m3 0h1"/>',
 event:'<rect x="3" y="5" width="17" height="16" rx="3"/><path d="M7 3v4m9-4v4M3 11h17m-8 3v5m-2.5-2.5h5"/>',
 person:'<circle cx="10" cy="7" r="3"/><path d="M3 21v-3a7 7 0 0 1 14 0v3H3Zm14-17a3 3 0 0 1 0 6m3 11v-3a7 7 0 0 0-2-5"/>',
 note:'<path d="M5 3h14v18H5zM8 8h8m-8 4h8m-8 4h5"/>',
 back:'<path d="m10 5-7 7 7 7M3 12h18"/>',
 edit:'<path d="m15 4 5 5-10 10-6 1 1-6L15 4ZM13 6l5 5"/>',
 left:'<path d="m15 5-7 7 7 7"/>',right:'<path d="m9 5 7 7-7 7"/>'
};
function mmIcon(name){return `<svg class="mm-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${mmIconPaths[name]||mmIconPaths.calendar}</svg>`;}
function dailyInlineNote(date){return data.notes.find(n=>n.dailyInline===true&&n.date===date);}
function growDailyNote(input){input.style.height='auto';input.style.height=Math.max(116,input.scrollHeight)+'px';}
function saveDailyNote(date,body,input){
 if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||key(dateOf(date))!==date)return false;
 body=String(body).slice(0,30000);
 let note=dailyInlineNote(date);
 if(!note&&!body.trim()){if(input)growDailyNote(input);return true;}
 if(!note){note={id:uid(),title:'Poznámky · '+fmt(dateOf(date)),body:'',date,dailyInline:true};data.notes.unshift(note);}
 note.body=body;
 const saved=save();
 if(input)growDailyNote(input);
 const status=document.getElementById('daily-note-status');
 if(status)status.textContent=saved?'Uloženo automaticky':'Uložení se nezdařilo. Zkopírujte si text.';
 return saved;
}
function dailyNotesSection(date){const note=dailyInlineNote(date),other=data.notes.filter(n=>n.date===date&&!n.dailyInline);return `<section class="daily-notes-block" aria-labelledby="daily-note-label"><div class="daily-section-heading"><span class="section-symbol note-symbol">${mmIcon('note')}</span><label id="daily-note-label" for="daily-note-input">Poznámky</label></div><textarea id="daily-note-input" class="daily-note-input" rows="4" maxlength="30000" data-date="${date}" placeholder="Sem si můžeš rovnou napsat poznámku…" aria-describedby="daily-note-status" oninput="saveDailyNote(this.dataset.date,this.value,this)">${esc(note?.body||'')}</textarea><p id="daily-note-status" class="daily-note-status" role="status">${note?'Uloženo automaticky':'Ukládá se automaticky pro tento den'}</p>${other.length?`<div class="other-day-notes">${other.map(n=>`<button type="button" class="existing-day-note" onclick="openNote('${n.id}')"><strong>${esc(n.title)}</strong><span>${esc(n.body)}</span></button>`).join('')}</div>`:''}</section>`;}
const beforeRedesignDayPage=window.dayPage;
window.dayPage=function(){
 if(current!=='dnes'||diaryMode!=='day')return beforeRedesignDayPage();
 const d=dateOf(selected),holiday=holidayOn(selected),names=namedayNames(selected),weekday=d.toLocaleDateString('cs-CZ',{weekday:'short'});
 return `<article class="panel diarypage modern-day" id="diarypage">${periodControls()}<div class="modern-date-row"><button type="button" class="date-badge ${weekendClass(selected)}" onclick="resetPeriod()" aria-label="${esc(fmt(d))} · přejít na dnešek"><span>${esc(weekday)}</span><strong>${d.getDate()}</strong></button><div class="modern-date-details"><h2>${esc(d.toLocaleDateString('cs-CZ',{month:'long',year:'numeric'}))}</h2>${names.length?`<div class="modern-nameday">${mmIcon('person')}<span>Svátek má <strong>${esc(names.join(', '))}</strong></span></div>`:''}${holiday?`<p class="modern-holiday">${esc(holiday)}</p>`:''}</div></div><div class="day-actions modern-day-actions" aria-label="Přidat událost"><button class="bottom-term" type="button" onclick="openEvent()">${mmIcon('event')}<span>Nová událost</span></button><button class="bottom-maty" type="button" onclick="openEvent(null,'event','Maty')">${mmIcon('person')}<span>Maty</span></button><button class="bottom-vojta" type="button" onclick="openEvent(null,'event','Vojta')">${mmIcon('person')}<span>Vojta</span></button></div><div class="daily-sections"><section class="daily-events-block" aria-labelledby="daily-events-heading"><div class="daily-section-heading"><span class="section-symbol event-symbol">${mmIcon('calendar')}</span><h2 id="daily-events-heading">Události dne</h2></div>${occurrences(selected).length?eventRows(occurrences(selected)):'<p class="daily-events-empty">Žádné naplánované události.</p>'}</section>${dailyNotesSection(selected)}</div></article>`;
};
const beforeRedesignControls=window.periodControls;
window.periodControls=function(){return beforeRedesignControls().replace(/>Dnes<\/button>/,`>${mmIcon('calendar')}<span>Dnes</span></button>`).replace(/>Týden<\/button>/,`>${mmIcon('week')}<span>Týden</span></button>`).replace(/>Měsíc<\/button>/,`>${mmIcon('month')}<span>Měsíc</span></button>`).replace('>‹</button>',`>${mmIcon('left')}</button>`).replace('>›</button>',`>${mmIcon('right')}</button>`);};
const beforeRedesignRender=window.render;
window.render=function(){beforeRedesignRender();document.body.classList.add('modern-mm');const input=document.getElementById('daily-note-input');if(input)growDailyNote(input);};
quickBar.innerHTML=`<button type="button" onclick="navigateBack()">${mmIcon('back')}<span>Zpět</span></button><a href="#kalendar">${mmIcon('calendar')}<span>Kalendář</span></a><a href="#poznamky">${mmIcon('edit')}<span>Poznámky</span></a>`;
render();
