import {create} from 'zustand'
import {persist} from 'zustand/middleware'
import {AGE} from './developmentalWellbeingEngine'
import {COMMENTS,COMMUNITIES,Comment,Community,DEFAULT_PREFS,Entry,MSGS,Msg,NOTIFS,Notif,POSTS,Post,Prefs,STORIES,Story,USERS,User,Age} from './data'
const seedPrefs=()=>Object.fromEntries(USERS.map(u=>[u.id,{...DEFAULT_PREFS,...AGE[u.ageCategory].ui}]))
const seedFollow=()=>Object.fromEntries(USERS.map((u,i)=>[u.id,[1,3,4,6,8].map(k=>USERS[(i*3+k)%15].id).filter(x=>x!==u.id)]))
const seedJoin=()=>Object.fromEntries(USERS.map((u,i)=>[u.id,COMMUNITIES.filter(c=>c.members.includes(u.id)&&!(u.ageCategory==='BELONG'&&c.adult)).slice(0,3).map(c=>c.id)]))
const fresh=()=>({meId:'u1',onboarded:false,users:USERS,posts:POSTS,comments:COMMENTS,communities:COMMUNITIES,following:seedFollow() as Record<string,string[]>,joined:seedJoin() as Record<string,string[]>,saved:{} as Record<string,string[]>,msgs:MSGS,unread:{u3:2,u5:1,u8:3} as Record<string,number>,notifs:NOTIFS,wellbeing:[] as Entry[],prefsBy:seedPrefs() as Record<string,Prefs>,expBy:{} as Record<string,string[]>,seen:[] as string[],stories:STORIES,blocked:[] as string[],reports:[] as string[],resources:[] as string[],dismissed:false,toast:''})
type S=ReturnType<typeof fresh>&{
 say:(m:string)=>void;logout:()=>void;receive:(from:string,t:string)=>void;switchDemo:(id:string)=>void;finish:(d:{name:string;age:Age;ints:string[];exp:string[];ui:string[]})=>void
 like:(id:string)=>void;comment:(pid:string,t:string)=>void;save:(id:string)=>void;follow:(id:string)=>void
 addPost:(p:Partial<Post>&{text:string})=>void;editPost:(id:string,t:string)=>void;delPost:(id:string)=>void
 join:(id:string)=>void;addCommunity:(c:{name:string;description:string;category:string})=>void
 send:(to:string,t:string)=>void;react:(mid:string,e:string)=>void;open:(cid:string)=>void
 read:(id?:string)=>void;setPrefs:(p:Partial<Prefs>)=>void;setAge:(a:Age)=>void;editProfile:(p:Partial<User>)=>void
 addEntry:(mood:string|undefined,r:string)=>void;delEntry:(id:string)=>void;viewStory:(id:string)=>void;addStory:(s:Partial<Story>)=>void
 block:(id:string)=>void;unblock:(id:string)=>void;report:(id:string)=>void;toggleRes:(id:string)=>void;dismiss:()=>void;reset:()=>void}
let tm:any
export const useStore=create<S>()(persist((set,get)=>({...fresh(),
 say:m=>{set({toast:m});clearTimeout(tm);tm=setTimeout(()=>set({toast:''}),2600)},
 logout:()=>set({onboarded:false}),
 receive:(from,t)=>set(s=>({msgs:[...s.msgs,{id:'m'+Date.now(),conversationId:from,senderId:from,text:t,timestamp:Date.now(),reactions:[]}]})),
 switchDemo:id=>{set({meId:id,onboarded:true,dismissed:false});get().say('Switched profile')},
 finish:d=>{const slug=d.name.toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'')||'you'
  const u:User={id:'me',username:slug,displayName:d.name,bio:'New to MINDWEAVE.',ageCategory:d.age,interests:d.ints,hue:200}
  const p:Prefs={...DEFAULT_PREFS,...AGE[d.age].ui,large:!!AGE[d.age].ui.large||d.ui.includes('Larger text'),contrast:d.ui.includes('High contrast'),calm:d.ui.includes('Reduced motion')||d.exp.includes('Reduce social media overwhelm'),quiet:d.ui.includes('Quiet notifications')||!!AGE[d.age].ui.quiet,hideMetrics:d.age==='BELONG'||d.exp.includes('Reduce social media overwhelm')}
  set(s=>({users:[...s.users.filter(x=>x.id!=='me'),u],meId:'me',onboarded:true,prefsBy:{...s.prefsBy,me:p},expBy:{...s.expBy,me:d.exp},following:{...s.following,me:[]},joined:{...s.joined,me:[]}}))},
 like:id=>set(s=>({posts:s.posts.map(p=>p.id===id?{...p,likes:p.likes.includes(s.meId)?p.likes.filter(x=>x!==s.meId):[...p.likes,s.meId]}:p)})),
 comment:(pid,t)=>set(s=>({comments:[...s.comments,{id:'cm'+Date.now(),postId:pid,authorId:s.meId,text:t,timestamp:Date.now()}]})),
 save:id=>{const s=get(),l=s.saved[s.meId]||[];set({saved:{...s.saved,[s.meId]:l.includes(id)?l.filter(x=>x!==id):[...l,id]}});get().say(l.includes(id)?'Removed from saved':'Saved')},
 follow:id=>set(s=>{const l=s.following[s.meId]||[];return{following:{...s.following,[s.meId]:l.includes(id)?l.filter(x=>x!==id):[...l,id]}}}),
 addPost:p=>set(s=>({posts:[{id:'p'+Date.now(),authorId:s.meId,timestamp:Date.now(),likes:[],tags:[],...p},...s.posts]})),
 editPost:(id,t)=>set(s=>({posts:s.posts.map(p=>p.id===id?{...p,text:t}:p)})),
 delPost:id=>set(s=>({posts:s.posts.filter(p=>p.id!==id),comments:s.comments.filter(c=>c.postId!==id)})),
 join:id=>set(s=>{const l=s.joined[s.meId]||[],on=l.includes(id);return{joined:{...s.joined,[s.meId]:on?l.filter(x=>x!==id):[...l,id]},communities:s.communities.map(c=>c.id===id?{...c,members:on?c.members.filter(m=>m!==s.meId):[...c.members,s.meId]}:c)}}),
 addCommunity:c=>set(s=>{const id='c'+Date.now();return{communities:[{id,...c,tags:[c.category.toLowerCase()],rules:['Be kind and respectful.','No harassment or hate.'],members:[s.meId]},...s.communities],joined:{...s.joined,[s.meId]:[...(s.joined[s.meId]||[]),id]}}}),
 send:(to,t)=>set(s=>({msgs:[...s.msgs,{id:'m'+Date.now(),conversationId:to,senderId:'self',text:t,timestamp:Date.now(),reactions:[]}]})),
 react:(mid,e)=>set(s=>({msgs:s.msgs.map(m=>m.id===mid?{...m,reactions:m.reactions.includes(e)?m.reactions.filter(x=>x!==e):[...m.reactions,e]}:m)})),
 open:cid=>set(s=>({unread:{...s.unread,[cid]:0}})),
 read:id=>set(s=>({notifs:s.notifs.map(n=>!id||n.id===id?{...n,read:true}:n)})),
 setPrefs:p=>set(s=>({prefsBy:{...s.prefsBy,[s.meId]:{...(s.prefsBy[s.meId]||DEFAULT_PREFS),...p}}})),
 setAge:a=>set(s=>({users:s.users.map(u=>u.id===s.meId?{...u,ageCategory:a}:u),prefsBy:{...s.prefsBy,[s.meId]:{...DEFAULT_PREFS,...AGE[a].ui}}})),
 editProfile:p=>set(s=>({users:s.users.map(u=>u.id===s.meId?{...u,...p}:u)})),
 addEntry:(m,r)=>set(s=>({wellbeing:[{id:'w'+Date.now(),userId:s.meId,selectedMood:m,timestamp:Date.now(),reflection:r},...s.wellbeing]})),
 delEntry:id=>set(s=>({wellbeing:s.wellbeing.filter(w=>w.id!==id)})),
 viewStory:id=>set(s=>({seen:s.seen.includes(id)?s.seen:[...s.seen,id]})),
 addStory:st=>set(s=>({stories:[{id:'s'+Date.now(),userId:s.meId,timestamp:Date.now(),...st},...s.stories.filter(x=>x.userId!==s.meId)]})),
 block:id=>set(s=>({blocked:[...s.blocked,id],following:{...s.following,[s.meId]:(s.following[s.meId]||[]).filter(x=>x!==id)}})),
 unblock:id=>set(s=>({blocked:s.blocked.filter(x=>x!==id)})),
 report:id=>{set(s=>({reports:[...s.reports,id]}));get().say('Report recorded locally (demo: no moderation backend)')},
 toggleRes:id=>set(s=>({resources:s.resources.includes(id)?s.resources.filter(x=>x!==id):[...s.resources,id]})),
 dismiss:()=>set({dismissed:true}),
 reset:()=>set({...fresh()})}),{name:'mindweave-2047',version:1,
 merge:(p:any,c)=>{try{return p&&typeof p==='object'&&Array.isArray(p.users)&&Array.isArray(p.posts)?{...c,...p}:c}catch{return c}}}))
export const ago=(t:number)=>{const m=Math.floor((Date.now()-t)/6e4);return m<1?'now':m<60?m+'m':m<1440?Math.floor(m/60)+'h':Math.floor(m/1440)+'d'}
export const useMe=()=>{const s=useStore();const me=s.users.find(u=>u.id===s.meId)||s.users[0];return{s,me,prefs:s.prefsBy[s.meId]||DEFAULT_PREFS,exp:s.expBy[s.meId]||[]}}
