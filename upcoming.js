// Expand occurrences over a visible, bounded twelve-month horizon.
export function groupedUpcoming(events,mode,{nextEventDate,effectiveRepeat,eventLabel,key,reference=new Date()}){
  const until=new Date(reference);until.setFullYear(until.getFullYear()+1);
  const groups=new Map();
  for(const event of events){
    let cursor=new Date(reference);
    while(cursor<until){
      const date=nextEventDate(event,cursor);
      if(!date||date>=until)break;
      const category=event.kind==='birthday'?'Narozeniny':event.kind==='nameday'?'Svátky':event.category||'Ostatní';
      const person=event.owner||(event.kind!=='event'?event.title:'Společné');
      const month=key(date).slice(0,7);
      const groupKey=mode==='person'?person:mode==='month'?month:category;
      const label=mode==='month'?date.toLocaleDateString('cs-CZ',{month:'long',year:'numeric'}):groupKey;
      if(!groups.has(groupKey))groups.set(groupKey,{key:groupKey,label,items:[]});
      groups.get(groupKey).items.push({event,date,label:eventLabel(event)});
      if(effectiveRepeat(event)==='none')break;
      const next=new Date(date.getFullYear(),date.getMonth(),date.getDate()+1);
      if(next<=cursor)break;
      cursor=next;
    }
  }
  return [...groups.values()].sort((a,b)=>mode==='month'?a.key.localeCompare(b.key):a.label.localeCompare(b.label,'cs')).map(group=>({...group,items:group.items.sort((a,b)=>a.date-b.date||a.label.localeCompare(b.label,'cs'))}));
}
