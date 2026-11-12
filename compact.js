/* Contained calendars and a drawer with a permanent close control. */
const compactCalendarOriginal=window.calendar;
window.calendar=function(big=false){const html=compactCalendarOriginal(big);return `<div class="calendar-frame">${current==='dnes'&&diaryMode==='month'?html.replace(/<div class="calendarhead">[\s\S]*?<\/div>/,`<h2 class="calendar-caption">${esc(month.toLocaleDateString('cs-CZ',{month:'long',year:'numeric'}))}</h2>`):html}</div>`;};
function filterChildEvents(owner){eventView='people';eventPeople=[owner];render();}
const compactEventsOriginal=window.eventsPage;
window.eventsPage=function(){return `<div class="child-event-actions"><div class="child-event-filter"><button class="child-filter maty-filter" type="button" onclick="filterChildEvents('Maty')">${mmIcon('person')}<span>Maty</span></button><button class="smallbtn" type="button" onclick="openEvent(null,'event','Maty')">＋ Událost pro Matyho</button></div><div class="child-event-filter"><button class="child-filter vojta-filter" type="button" onclick="filterChildEvents('Vojta')">${mmIcon('person')}<span>Vojta</span></button><button class="smallbtn" type="button" onclick="openEvent(null,'event','Vojta')">＋ Událost pro Vojtu</button></div></div>${compactEventsOriginal()}`;};
const menuClose=document.createElement('button');menuClose.type='button';menuClose.className='menu-close';menuClose.innerHTML=mmIcon('back')+'<span>Zpět</span>';menuClose.onclick=()=>toggleMobileMenu(false);document.getElementById('bottom-bar').append(menuClose);
const compactRenderOriginal=window.render;
window.render=function(){compactRenderOriginal();document.body.classList.toggle('compact-home',current==='dnes');document.body.classList.toggle('compact-day',current==='dnes'&&diaryMode==='day');};
render();
