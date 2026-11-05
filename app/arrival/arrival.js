(()=>{'use strict';const $=s=>document.querySelector(s),all=s=>[...document.querySelectorAll(s)],phone=$('#phone');const film=new URLSearchParams(location.search).has('film');document.body.classList.toggle('film',film);let ropeLength=40,rope=null,ropeTime=null,lastTap=null,knotFrom=null;let state={surface:'home',progress:0,time:0,expanded:false,met:false,tiedAt:null},playing=false,startTime=0,startProgress=0;const clamp=n=>Math.max(0,Math.min(1,n)),format=d=>d<.015?'도착':d<1?Math.round(d*1000)+' m':d.toFixed(1)+' km';function render(){const reduced=matchMedia('(prefers-reduced-motion:reduce)').matches;const p=clamp(state.progress),bus=6.4*Math.pow(1-p,1.08),metro=8.2*Math.pow(1-p,1.02),near=bus<=1&&metro<=1,arrived=p>=.999;phone.dataset.surface=state.surface;phone.classList.toggle('is-tying',state.met);const expanded=false;phone.classList.toggle('has-expanded',expanded);$('#island').classList.toggle('expanded',expanded);$('#island').setAttribute('aria-expanded',String(expanded));$('#island').setAttribute('aria-label','실 톡 건드리기');all('.bus-distance').forEach(e=>e.textContent=format(bus));all('.metro-distance').forEach(e=>e.textContent=format(metro));const later=Math.max(bus,metro);const compactPath=thread(2,34,later,8.2,true);$('#compact-thread').setAttribute('d',compactPath);$('.compact-leading svg').style.transform='none';all('.near-mark').forEach(e=>e.textContent=near&&!arrived?'!':arrived?'!':'');all('.arrival-status').forEach(e=>e.textContent=arrived?'바로 가까이에 있어요':near?'이제, 거의 다 왔어요':'만나러 가는 중');function thread(a,b,d,initial,mini=false){if(state.met&&state.tiedAt!==null){
 const age=Math.max(0,state.time-state.tiedAt),smooth=t=>{t=clamp(t);return t*t*(3-2*t)},gather=smooth(age/1.1),wrap=smooth((age-.7)/1.5),tight=smooth((age-2)/1.2),e=reduced?1:smooth(age/2.5),path=$('#tie-target'),length=path.getTotalLength(),N=160;
 const settle=reduced?0:Math.sin(Math.max(0,age-2.4)*7)*Math.exp(-Math.max(0,age-2.4)*2.8)*.55*tight;
 const pts=Array.from({length:N},(_,i)=>{const f=i/(N-1),at=f*(knotFrom.length-1),j=Math.min(knotFrom.length-2,Math.floor(at)),q=at-j,from={x:knotFrom[j].x*(1-q)+knotFrom[j+1].x*q,y:knotFrom[j].y*(1-q)+knotFrom[j+1].y*q};const target=path.getPointAtLength(length*f);
 // Open loops lift and turn, then draw gently into the final knot.
 const loose=1-tight,tx=18+(target.x-18)*(1+.18*loose),ty=11+(target.y-11)*(1+.25*loose),curl=Math.sin(Math.PI*f)*Math.sin(f*Math.PI*2+age*2.2)*3.2*Math.sin(Math.PI*wrap);
 const nx=from.x*(1-e)+tx*e,ny=from.y*(1-e)+ty*e+curl+settle*Math.sin(Math.PI*f);
 // Preserve the knot proportions on the lock screen instead of stretching it across the card.
 const oldX=a+(from.x-2)/32*(b-a),oldY=31+(from.y-11)*2,scale=3.2;
 return mini?{x:nx,y:ny}:{x:oldX*(1-gather)+((a+b)/2+(nx-18)*scale)*gather,y:oldY*(1-gather)+(34+(ny-11)*scale)*gather};});
 return pts.map((n,i)=>(i?'L':'M')+n.x.toFixed(2)+' '+n.y.toFixed(2)).join(' ')
 }const pull=clamp(1-d/initial),count=25;
if(!rope){rope=Array.from({length:count},(_,i)=>{const f=i/(count-1);return{x:2+32*f,y:11+9*Math.sin(Math.PI*f),vx:0,vy:0}});ropeTime=state.time;ropeLength=32.015+8*Math.pow(1-pull,1.35);}
let dt=Math.min(.05,Math.max(0,state.time-ropeTime));ropeTime=state.time;
if(state.tapAt!==undefined&&state.tapAt!==lastTap){lastTap=state.tapAt;for(let i=1;i<count-1;i++)rope[i].vy-=(32*(1-pull)+6)*Math.sin(Math.PI*i/(count-1));}
if(dt>0&&!reduced){const steps=Math.max(1,Math.ceil(dt/.008)),h=dt/steps;
for(let k=0;k<steps;k++){const old=rope.map(n=>({x:n.x,y:n.y}));
// Both hands tug together; excess length absorbs the tug until the rope is taut.
const slack=8*Math.pow(1-pull,1.35),cycle=(state.time%3.2)/3.2;
const tug=Math.pow(Math.max(0,Math.sin(Math.PI*cycle)),6);
const targetLength=32.015+slack*(1-.58*tug);
ropeLength+=(targetLength-ropeLength)*(1-Math.exp(-(3+8*pull)*h));
for(let i=1;i<count-1;i++){const n=rope[i],f=i/(count-1),envelope=Math.sin(Math.PI*f);
const surge=Math.sin(state.time*(2.0+4*pull));
const wave=Math.sin(Math.PI*f*2)*Math.sin(state.time*(2.5+5*pull));
n.vx+=(f-.5)*tug*30*envelope*h;
n.vy+=(14+(surge*38+wave*12)*(1-pull)*envelope)*h;
const drag=Math.exp(-(1.35+3*pull)*h);n.vx*=drag;n.vy*=drag;n.x+=n.vx*h;n.y+=n.vy*h;}
const segment=ropeLength/(count-1);
for(let pass=0;pass<24;pass++){rope[0].x=2;rope[0].y=11;rope[count-1].x=34;rope[count-1].y=11;
for(let i=1;i<count;i++){const l=rope[i-1],n=rope[i],dx=n.x-l.x,dy=n.y-l.y,len=Math.hypot(dx,dy)||1,fix=(len-segment)/len;
if(i===1){n.x-=dx*fix;n.y-=dy*fix;}else if(i===count-1){l.x+=dx*fix;l.y+=dy*fix;}else{l.x+=dx*fix*.5;l.y+=dy*fix*.5;n.x-=dx*fix*.5;n.y-=dy*fix*.5;}}}
for(let i=1;i<count-1;i++){rope[i].vx=(rope[i].x-old[i].x)/h;rope[i].vy=(rope[i].y-old[i].y)/h;}
rope[0]={x:2,y:11,vx:0,vy:0};rope[count-1]={x:34,y:11,vx:0,vy:0};}

}
if(reduced){for(let i=0;i<count;i++){let f=i/(count-1);rope[i].x=2+32*f;rope[i].y=11+10*(1-pull)*Math.sin(Math.PI*f);}}
// A brief, readable pluck every 4.2 seconds; pin both ends with the sine envelope.
const cuePhase=(state.time%4.2),cue=reduced||cuePhase>1.65?0:-Math.sin(cuePhase*(7+4*pull))*Math.exp(-cuePhase*(2.8+pull))*(7-2.5*pull);
return rope.map((n,i)=>{const displayY=n.y+cue*Math.sin(Math.PI*i/(count-1));const x=mini?n.x:a+(n.x-2)/32*(b-a),y=mini?displayY:31+(displayY-11)*2;return(i?'L':'M')+x.toFixed(2)+' '+y.toFixed(2)}).join(' ')}all('.left-thread').forEach(e=>e.setAttribute('d',thread(29,282,Math.max(bus,metro),8.2)));const ease=t=>t*t*(3-2*t),k=ease(p);for(const [name,x] of [['bus',38],['metro',292]]){const e=$('.route-'+name);e.setAttribute('cx',(x+(165-x)*k).toFixed(1));e.setAttribute('cy',(12+133*k).toFixed(1));}all('[data-born]').forEach(e=>e.classList.toggle('hidden',film&&state.time<Number(e.dataset.born)));all('.surface-tabs button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.surface===state.surface)));$('#expand-button').textContent='상대가 실 톡 건드리기';$('#expand-button').hidden=state.surface!=='home';$('#progress').value=p*100;$('#progress-value').textContent=arrived?'바로 가까이':near?'1 km 안':p===0?'출발':Math.round(p*100)+'%';renderMeeting();return{...state,busKm:bus,metroKm:metro,near,arrived,meetingDistanceMeters:meetingDistance(),meetingDays:[...meetingDays]};}
const MEET_RADIUS_METERS=50,RECORD_KEY='musubi.demo.meetingDays.v1';
let meetingDays=[],savedLocally=true,calendarSignature='';
try{if(!film){const data=JSON.parse(localStorage.getItem(RECORD_KEY)||'[]');if(Array.isArray(data))meetingDays=[...new Set(data.filter(d=>typeof d==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(d)))];}}catch{savedLocally=false;}
function todayKey(){const d=new Date();return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');}
function positions(){
 // Public example coordinates. The shared backend/GPS feed is not connected in this prototype.
 if(Object.hasOwn(state,'positions'))return state.positions;
 const remaining=Math.pow(1-clamp(state.progress),1.05);
 return {mine:{lat:35.1577+.045*remaining,lng:129.0591-.018*remaining},partner:{lat:35.1577-.055*remaining,lng:129.0591+.028*remaining}};
}
function meetingDistance(){const pair=positions(),a=pair?.mine,b=pair?.partner;const valid=p=>p&&Number.isFinite(p.lat)&&Number.isFinite(p.lng)&&Math.abs(p.lat)<=90&&Math.abs(p.lng)<=180;if(!valid(a)||!valid(b))return null;const rad=d=>d*Math.PI/180,dl=rad(b.lat-a.lat),dn=rad(b.lng-a.lng),h=Math.sin(dl/2)**2+Math.cos(rad(a.lat))*Math.cos(rad(b.lat))*Math.sin(dn/2)**2;return 6371000*2*Math.atan2(Math.sqrt(h),Math.sqrt(Math.max(0,1-h)));}
function renderCalendar(){const now=new Date(),year=now.getFullYear(),month=now.getMonth(),today=todayKey(),signature=year+'-'+month+meetingDays.join(',');if(calendarSignature===signature)return;calendarSignature=signature;$('#meeting-month').textContent=year+'년 '+(month+1)+'월';const grid=$('#meeting-calendar');grid.replaceChildren();for(let i=0;i<new Date(year,month,1).getDay();i++){const blank=document.createElement('span');blank.setAttribute('aria-hidden','true');grid.append(blank);}for(let day=1;day<=new Date(year,month+1,0).getDate();day++){const key=[year,String(month+1).padStart(2,'0'),String(day).padStart(2,'0')].join('-'),hit=meetingDays.includes(key),cell=document.createElement('span');cell.className=(hit?'met-day ':'')+(key===today?'today':'');cell.textContent=day+(hit?' ✓':'');cell.setAttribute('aria-label',(month+1)+'월 '+day+'일'+(hit?' 만난 날':''));grid.append(cell);}$('#meeting-count').textContent='함께 만난 날 '+meetingDays.length+'일';}
function renderMeeting(){const distance=meetingDistance(),eligible=distance!==null&&distance<=MEET_RADIUS_METERS,recorded=meetingDays.includes(todayKey());all('[data-meet]').forEach(b=>{b.disabled=state.met||!eligible;b.textContent=state.met?'오늘 만남 기록됨 ✓':'만났어요';});const message=state.met?(savedLocally?'오늘을 만난 날로 기록했어요.':'오늘을 표시했어요. 이 브라우저에서는 저장할 수 없어요.'):(distance===null?'두 사람의 위치를 확인하고 있어요.':eligible?'서로 가까이에 있어요. 한 사람만 눌러도 돼요.':'서로 50m 안에 가까워지면 누를 수 있어요.');if($('#meeting-status').textContent!==message)$('#meeting-status').textContent=message;$('#meeting-distance').textContent=distance===null?'위치 확인 중':'서로 '+(distance<1000?Math.round(distance)+'m':(distance/1000).toFixed(1)+'km');$('#today-meeting').textContent=recorded?'오늘 · 만난 날 ✓':'오늘 · 아직 기록 전';renderCalendar();if(state.met){all('.arrival-status').forEach(e=>e.textContent=state.time-state.tiedAt<3.2?'우리의 실을 묶는 중…':'우리, 만났어요.');all('.near-mark').forEach(e=>e.textContent='');}}
function confirmMeeting(){const distance=meetingDistance();if(state.met||distance===null||distance>MEET_RADIUS_METERS)return;stop();state.met=true;knotFrom=rope.map(n=>({x:n.x,y:n.y}));state.tiedAt=state.time;const day=todayKey();if(!meetingDays.includes(day))meetingDays.push(day);if(!film){try{localStorage.setItem(RECORD_KEY,JSON.stringify(meetingDays));savedLocally=true;}catch{savedLocally=false;}}render();}
function resetMeeting(){state.met=false;state.tiedAt=null;knotFrom=null;rope=null;render();}
all('[data-meet]').forEach(b=>b.addEventListener('click',confirmMeeting));$('#meeting-reset').addEventListener('click',resetMeeting);
function stop(){playing=false;$('#play-button').textContent='만나러 가는 과정 재생';}
function update(opts){Object.assign(state,opts);state.progress=clamp(Number(state.progress)||0);return render();}
$('#island').addEventListener('click',()=>update({tapAt:state.time}));$('#expand-button').addEventListener('click',()=>update({tapAt:state.time}));all('.surface-tabs button').forEach(b=>b.addEventListener('click',()=>update({surface:b.dataset.surface})));all('[data-progress]').forEach(b=>b.addEventListener('click',()=>{stop();update({progress:+b.dataset.progress});}));$('#progress').addEventListener('input',e=>{stop();update({progress:+e.target.value/100});});$('#play-button').addEventListener('click',()=>{if(playing){stop();return}if(state.progress>=.999)state.progress=0;playing=true;startTime=performance.now();startProgress=state.progress;$('#play-button').textContent='잠깐 멈추기';});function tick(ms){if(!film){state.time=ms/1000;if(playing){state.progress=clamp(startProgress+(ms-startTime)/24000);if(state.surface==='home'&&state.progress>.15)state.expanded=true;render();if(state.progress>=1)stop();}render();}requestAnimationFrame(tick)}if(!film)requestAnimationFrame(tick);window.arrivalDemo={frame:opts=>{stop();return update(opts)},state:()=>render(),reset:()=>{stop();state.met=false;state.tiedAt=null;knotFrom=null;rope=null;delete state.positions;return update({surface:'home',progress:0,time:0,expanded:false})}};render();})();
