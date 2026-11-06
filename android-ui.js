import {groupedUpcoming} from './upcoming.js';
export function installAndroidUI(){
  document.body.classList.add('android-ui');
  let mode='category';
  try{const saved=localStorage.getItem('mm-upcoming-group');if(['category','person','month'].includes(saved))mode=saved;}catch{}
  const originalRender=window.render;
  window.homeBook=function(){return `<section class="android-home"><div class="android-calendar"><a class="primary" href="#kalendar">Kalendář</a></div><section class="book-right" aria-label="Denní stránka">${dayPage()}</section></section>`;};
  window.setUpcomingGroup=function(value){
    if(!['category','person','month'].includes(value))return;
    mode=value;try{localStorage.setItem('mm-upcoming-group',value);}catch{}
    render();
  };
  window.openUpcomingOccurrence=function(id,date){
    selected=date;month=new Date(dateOf(date).getFullYear(),dateOf(date).getMonth(),1);
    location.hash='dnes';
  };
  window.render=function(){
    originalRender();
    const link=document.querySelector('#nav a[href="#vyroci"]');
    if(link){link.setAttribute('aria-label','Nejbližší termíny');link.querySelector('span').textContent='Nejbližší termíny';}
    if(current!=='vyroci')return;
    document.querySelector('#heading').textContent='Nejbližší termíny';
    const groups=groupedUpcoming(data.events,mode,{nextEventDate,effectiveRepeat,eventLabel,key});
    document.querySelector('#content').innerHTML=`<div class="group-toolbar"><label for="upcoming-group">Seskupit podle</label><select id="upcoming-group" onchange="setUpcomingGroup(this.value)">${[['category','Kategorií'],['person','Osob'],['month','Měsíců']].map(([v,t])=>`<option value="${v}" ${mode===v?'selected':''}>${t}</option>`).join('')}</select><div class="toolbar"><button class="primary" onclick="openEvent()">＋ Termín</button><button onclick="openEvent(null,'birthday')">＋ Narozeniny</button><button onclick="openEvent(null,'nameday')">＋ Svátek</button></div><p class="help">Následujících 12 měsíců · od nejbližšího data</p></div>${groups.length?`<div class="upcoming-columns" aria-label="Skupiny nejbližších termínů">${groups.map(group=>`<section class="upcoming-column"><h2>${esc(group.label)}</h2><ul>${group.items.map(({event:e,date,label})=>`<li><button class="occurrence" onclick="openUpcomingOccurrence('${e.id}','${key(date)}')"><time>${esc(date.toLocaleDateString('cs-CZ',{day:'numeric',month:'numeric',year:'numeric'}))}${e.time?' · '+esc(e.time):''}</time><strong>${esc(label)}</strong></button><button class="smallbtn" aria-label="Upravit ${esc(label)}" onclick="openEvent('${e.id}')">Upravit</button></li>`).join('')}</ul></section>`).join('')}</div>`:'<p class="empty">V následujících 12 měsících nejsou žádné termíny.</p>'}`;
  };
  render();
}
