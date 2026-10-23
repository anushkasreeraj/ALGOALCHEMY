// Explainable, deterministic rules. Age category is USER-SELECTED. Never infers health conditions.
import type {Age,Community,Post,Prefs,User} from './data'
export const AGE:Record<Age,{name:string;range:string;focus:string[];feed:string[];tags:string[];ui:Partial<Prefs>;blurb:string}>={
BELONG:{name:'BELONG',range:'13–17',focus:['Belonging','Safe peer communities','Identity-positive content','Reduced popularity emphasis','Privacy-first'],feed:['Peer','Creative','Learning'],tags:['peer','identity','creative','wellbeing'],ui:{hideMetrics:true,private:true},blurb:'Peer-centred, privacy-first, no like counts.'},
DISCOVER:{name:'DISCOVER',range:'18–25',focus:['Discovery','Learning','Career and academic communities','Peer mentorship','Social comparison reflection'],feed:['Learning','Career','Tech'],tags:['learning','career','tech','peer','mentoring'],ui:{},blurb:'Learning, careers and mentorship.'},
BALANCE:{name:'BALANCE',range:'26–45',focus:['Work-life balance','Relationships','Interest-based communities','Life transitions','Flexible notifications'],feed:['Balance','Family','Creative'],tags:['balance','family','transition','wellbeing','creative'],ui:{quiet:true},blurb:'Interests, transitions and calmer notifications.'},
RECONNECT:{name:'RECONNECT',range:'46–59',focus:['Purpose','Mentoring','Social reconnection','Life transitions','Knowledge sharing'],feed:['Mentoring','Knowledge','Family'],tags:['mentoring','knowledge','transition','intergenerational','family'],ui:{},blurb:'Mentoring, reconnection and shared knowledge.'},
THRIVE:{name:'THRIVE',range:'60+',focus:['Accessibility','Connection','Knowledge sharing','Intergenerational communities','Larger text, simple interaction'],feed:['Family','Books','Intergenerational'],tags:['intergenerational','knowledge','books','family'],ui:{large:true},blurb:'Larger text, simple controls, intergenerational spaces.'}}
const low=(s:string[])=>s.map(x=>x.toLowerCase())
export type Rec={community:Community;score:number;reasons:string[]}
export function getRecommendations(i:{user:User;experience:string[];prefs:Prefs;communities:Community[];checkin?:string}){
 const cfg=AGE[i.user.ageCategory],ints=low(i.user.interests)
 const communities:Rec[]=i.communities.filter(c=>!(i.user.ageCategory==='BELONG'&&c.adult)&&!(c.adult&&false)).map(c=>{
  const reasons:string[]=[];let score=0
  const a=c.tags.filter(t=>cfg.tags.includes(t));if(a.length){score+=a.length*2;reasons.push(`Fits your ${cfg.name} experience (${a.join(', ')})`)}
  const b=ints.filter(x=>c.category.toLowerCase().includes(x)||c.tags.some(t=>x.includes(t)||t.includes(x.split(' ')[0])));if(b.length){score+=b.length*3;reasons.push(`Matches your interest in ${b.join(', ')}`)}
  if(i.experience.includes('Join supportive communities')&&c.tags.some(t=>['peer','wellbeing'].includes(t))){score+=2;reasons.push('You asked for supportive communities')}
  if(i.checkin&&['Low','Tired'].includes(i.checkin)&&c.tags.includes('wellbeing')){score+=1;reasons.push('Optional: a calm space, shown because you chose to check in')}
  return{community:c,score,reasons:reasons.length?reasons:['Popular with people near your interests']}}).sort((x,y)=>y.score-x.score)
 return{feedCategories:cfg.feed,communities,interactions:cfg.focus,
  tools:[...(i.checkin&&['Low','Tired'].includes(i.checkin)?['Write a private reflection','Take a short screen break']:['Optional mood check-in']),...(i.user.ageCategory==='DISCOVER'?['Social comparison reflection']:[])],
  ui:cfg.ui}}
export function scorePost(p:Post,u:User,joined:string[],following:string[],posts?:Post[]){
 let s=0;const r:string[]=[];const ints=low(u.interests),cfg=AGE[u.ageCategory]
 if(p.tags.some(t=>ints.some(x=>x.includes(t)||t.includes(x.split(' ')[0])))){s+=3;r.push('matches your interests')}
 if(p.tags.some(t=>cfg.tags.includes(t))){s+=2;r.push(`fits ${cfg.name}`)}
 if(p.communityId&&joined.includes(p.communityId)){s+=3;r.push('from a community you joined')}
 if(following.includes(p.authorId)){s+=2;r.push('from someone you follow')}
 s+=Math.max(0,3-(Date.now()-p.timestamp)/(24*3600e3))
 if(u.ageCategory!=='BELONG')s+=p.likes.length*.05
 return{score:s,reason:r.length?'Suggested because it '+r.join(' and '):''}}
