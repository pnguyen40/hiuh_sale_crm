// Local Vietnam business date; the D-05 default uses the real system clock.
export function dateParts(now=new Date()) {
  const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Ho_Chi_Minh',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(now);
  return Object.fromEntries(parts.filter(p=>['year','month','day'].includes(p.type)).map(p=>[p.type,p.value]));
}
export function waitDefaults(c,now=new Date()) {
  const parts=dateParts(now),due=c.followUpAt||'';
  return {waitOn:c.waitOn||'',waitContent:c.waitContent||[...new Set([c.waitReason,c.nextStep].filter(Boolean))].join('\n'),followDay:due.slice(8,10),followMonth:due.slice(5,7)||parts.month,followYear:due.slice(0,4)||parts.year,followTime:due.slice(11,16)};
}
export function waitDue(data) {
  const {followDay:d,followMonth:m,followYear:y}=data;
  if(!/^\d{1,2}$/.test(d||'')||!/^\d{1,2}$/.test(m||'')||!/^\d{4}$/.test(y||''))throw Error('Nhập ngày, tháng và năm hẹn kiểm tra lại.');
  const date=`${y}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`,parsed=new Date(date+'T00:00:00Z');
  if(!Number(y)||isNaN(parsed)||parsed.toISOString().slice(0,10)!==date)throw Error('Ngày hẹn chưa hợp lệ. Kiểm tra ngày, tháng và năm.');
  const time=String(data.followTime||'').trim();
  if(time&&!/^([01]\d|2[0-3]):[0-5]\d$/.test(time))throw Error('Giờ hẹn chưa đúng định dạng giờ:phút.');
  return date+(time?'T'+time:'');
}
// Date precision expires at the END of the local day, never at 00:00.
export const followUpDeadline=c=>!c.followUpAt?null:Date.parse(c.followUpAt.length===10?c.followUpAt+'T23:59:59.999+07:00':c.followUpAt.length===16?c.followUpAt+':00+07:00':c.followUpAt);
