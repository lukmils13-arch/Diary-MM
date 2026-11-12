/* Calendars use normal document scrolling, with no inner scroll handles. */
function isNaturalCalendar(){return current==='kalendar'||(current==='dnes'&&diaryMode==='month');}
const renderBeforeCalendarScroll=window.render;
window.render=function(){renderBeforeCalendarScroll();document.body.classList.toggle('natural-calendar',isNaturalCalendar());};
render();
