export type Age='BELONG'|'DISCOVER'|'BALANCE'|'RECONNECT'|'THRIVE'
export type User={id:string;username:string;displayName:string;bio:string;ageCategory:Age;interests:string[];hue:number}
export type Post={id:string;authorId:string;text:string;image?:string;timestamp:number;likes:string[];communityId?:string;tags:string[];context?:string}
export type Comment={id:string;postId:string;authorId:string;text:string;timestamp:number}
export type Community={id:string;name:string;description:string;category:string;members:string[];rules:string[];tags:string[];adult?:boolean}
export type Msg={id:string;conversationId:string;senderId:string;text:string;timestamp:number;reactions:string[]}
export type Notif={id:string;userId:string;type:'like'|'comment'|'follow'|'community'|'mention'|'request'|'message';actorId:string;text:string;timestamp:number;read:boolean}
export type Prefs={large:boolean;contrast:boolean;calm:boolean;quiet:boolean;hideMetrics:boolean;private:boolean}
export type Entry={id:string;userId:string;selectedMood?:string;timestamp:number;reflection:string}
export type Story={id:string;userId:string;text?:string;image?:string;timestamp:number}
export const H=3600e3
export const DEFAULT_PREFS:Prefs={large:false,contrast:false,calm:false,quiet:false,hideMetrics:false,private:false}
export const INTERESTS=['Learning','Technology','Art','Music','Books','Fitness','Career','Family','Community','Personal growth','Volunteering','Nature']
export const CONTEXTS=['Seeking support','Seeking connection','Seeking motivation','Sharing an achievement','Seeking advice','Sharing an experience','Seeking distraction','General social interaction']
const mk=(s:string,i:number):User=>{const[username,displayName,a,int,bio]=s.split('|');return{id:'u'+i,username,displayName,bio,ageCategory:a as Age,interests:int.split(','),hue:(i*47)%360}}
export const USERS=[
'aarav_k|Aarav Kumar|BELONG|Art,Music,Technology|Sketching, synths and the school robotics club.',
'meera.reads|Meera Iyer|DISCOVER|Books,Career,Learning|Final-year student. Chasing good books and first jobs.',
'rohan_builds|Rohan Shah|BALANCE|Technology,Fitness,Family|Engineer, dad, weekend cyclist. Trying to log off on time.',
'sunita_devi|Sunita Rao|RECONNECT|Community,Volunteering,Learning|Teacher turned mentor. Rebuilding my circle.',
'prof_krishnan|Dr. S. Krishnan|THRIVE|Books,Nature,Community|Retired professor. Garden, chai and stories.',
'zoya.draws|Zoya Khan|BELONG|Art,Music,Personal growth|Doodles daily. Kind people only.',
'kabir_codes|Kabir Mehta|BELONG|Technology,Learning,Fitness|Learning Python, playing football.',
'ananya.pm|Ananya Nair|DISCOVER|Career,Technology,Personal growth|Product intern. Always asking why.',
'dev_runs|Dev Patel|DISCOVER|Fitness,Music,Career|Marathon rookie and campus DJ.',
'nisha.moms|Nisha Verma|BALANCE|Family,Community,Art|Two kids, one sketchbook.',
'vikram.m|Vikram Menon|BALANCE|Career,Books,Nature|Switching careers at 38. Notes from the journey.',
'lata_garden|Lata Deshpande|RECONNECT|Nature,Family,Volunteering|Empty nest, full garden.',
'harish.mentor|Harish Gupta|RECONNECT|Career,Learning,Community|30 years in engineering. Happy to mentor.',
'kamala_stories|Kamala Ammal|THRIVE|Family,Books,Music|Grandmother of five. Story keeper.',
'raghav.sr|Raghav Sethi|THRIVE|Nature,Learning,Community|Birdwatcher. Learning to video call.'].map(mk)
const RULES=['Be kind and respectful.','No harassment or hate.',"Respect privacy: never share others' details."]
const mc=(s:string,i:number):Community=>{const[name,category,tags,description,adult]=s.split('|');return{id:'c'+(i+1),name,category,description,tags:tags.split(','),adult:adult==='1',rules:[...RULES,'Stay on topic for '+name+'.'],members:USERS.filter((_,k)=>(k+i)%3!==0).map(u=>u.id)}}
export const COMMUNITIES=[
'Campus Connections|Campus|peer,learning,career|Study groups, first-year tips and campus life.|0',
'Creative Minds|Creative|creative,peer,identity|Share art, music and works in progress.|0',
'Learning Together|Learning|learning,career,tech|Study circles and skill swaps for all ages.|0',
'Life Transitions|Life|transition,family,career|Moves, new jobs, parenthood and retirement. 18+|1',
'Intergenerational Stories|Connection|intergenerational,family,knowledge|Elders and youth swapping stories and skills.|0',
'Digital Wellbeing|Wellbeing|wellbeing,peer,balance|Healthy habits for a calmer online life.|0',
'Book and Art Circle|Creative|books,creative,knowledge|Monthly reads and gallery chats.|0',
'Mentors and Makers|Career|mentoring,career,tech|Experienced people guiding what is next. 18+|1'].map(mc)
const P=[
'0|c2|Sharing an experience|art,music|Finished my first synth track today. It is rough but it is mine.',
'5|c2|Sharing an achievement|art|Day 100 of drawing every day. Slow progress still counts.',
'6|c1|Seeking advice|learning,tech|Which Python project helped you most when you were starting out?',
'1|c1|Seeking advice|career,learning|Placement season is stressful. How are you all planning your week?',
'7|c3|Sharing an achievement|career,tech|Shipped my first feature at my internship. Small win, big smile.',
'8||Seeking motivation|fitness|Long run at 5am. Anyone else training for a half marathon?',
'2|c6|Sharing an experience|balance,wellbeing|Phone goes in a drawer after 8pm now. Evenings feel longer in a good way.',
'9|c4|Seeking connection|family,transition|New city, new routine, two kids. How did you find your people?',
'10|c4|Seeking advice|career,transition|Moving from finance to design at 38. Would love to hear your stories.',
'3|c8|Sharing an experience|mentoring,career|Mentoring three first-gen graduates this year. They teach me more than I teach them.',
'12|c8|Seeking connection|mentoring,learning|Retired engineers: keen to review student projects. Drop a message.',
'11|c5|Sharing an experience|family,nature|Taught my neighbour\'s grandson to grow tomatoes. He taught me to scan QR codes.',
'4|c7|Sharing an experience|books,knowledge|Reread Tagore this week. Some sentences feel new at 70.',
'13|c5|Sharing an experience|family,music|Teaching my grandchildren the lullabies my mother sang.',
'14|c5|Seeking advice|learning,nature|How do I join a video call without panicking? Patient teachers wanted.',
'0|c1|Seeking support|peer|Starting at a new school soon. A bit nervous. Any tips from people who did it?',
'5||Seeking connection|art,identity|Looking for friends who love animation. Comment if you want to swap sketches.',
'6||Seeking distraction|tech|Rate my desk setup. Be gentle.',
'1|c7|Sharing an experience|books|Book club pick this month: something slow and warm. Suggestions?',
'7||Seeking support|career,personal growth|I feel like everyone around me is doing better than me.',
'8|c3|Seeking motivation|learning|Cannot focus on studying today. What gets you started?',
'2||Seeking advice|tech,career|How do you handle on-call without burning out?',
'9||Sharing an achievement|art,family|Finished my first watercolour in two years. Kids said it looks like a dragon.',
'10|c3|Seeking advice|learning|Any good free resources for learning UX research?',
'11|c6|Seeking connection|wellbeing,family|Slow mornings and no phone until breakfast. Anyone else trying this?',
'12||Sharing an achievement|mentoring|One of my mentees got her first job offer today. Proud is an understatement.',
'3|c3|Seeking connection|learning,mentoring|Starting a weekly reading circle for teachers. All welcome.',
'4||Sharing an experience|nature,books|The jasmine bloomed early this year. Writing on the veranda again.',
'13|c7|Sharing an experience|books,music|Our local library started a large-print book club. Sharing the joy.',
'14||Sharing an achievement|nature|Spotted a Malabar trogon this morning. Seventy-two and still thrilled.']
export const POSTS:Post[]=P.map((l,i)=>{const[a,c,ctx,t,...x]=l.split('|');return{id:'p'+(i+1),authorId:'u'+a,communityId:c||undefined,context:ctx,tags:t.split(','),text:x.join('|'),image:i%2===0?`https://picsum.photos/seed/mw${i}/900/900`:undefined,timestamp:Date.now()-(i*5+1)*H,likes:USERS.filter((_,k)=>(k*7+i)%4===0).map(u=>u.id)}})
export const COMMENTS:Comment[]=POSTS.slice(0,14).flatMap((p,i)=>[{id:'cm'+i+'a',postId:p.id,authorId:USERS[(i+3)%15].id,text:['Love this!','You are not alone in this.','Great share, thank you.','Same here, happy to chat.'][i%4],timestamp:p.timestamp+H/2}])
export const STORIES:Story[]=USERS.slice(0,10).map((u,i)=>({id:'s'+i,userId:u.id,text:i%3===0?['Good morning!','Tiny win today','Evening walk','Reading time'][i%4]:undefined,image:i%3===0?undefined:`https://picsum.photos/seed/story${i}/600/1000`,timestamp:Date.now()-i*H}))
const MS=['Hey! Loved your last post.','Thanks for the follow back!','Are you joining the community meetup?','Sharing that resource you asked about.','Good luck with the week!']
export const MSGS:Msg[]=USERS.slice(0,15).flatMap((u,i)=>[{id:'m'+i+'a',conversationId:u.id,senderId:u.id,text:MS[i%5],timestamp:Date.now()-(i+1)*H,reactions:[]},...(i%2?[{id:'m'+i+'b',conversationId:u.id,senderId:'self',text:'Thank you, that means a lot!',timestamp:Date.now()-i*H/2,reactions:[]}]:[])])
const NT:[Notif['type'],string][]=[['like','liked your post'],['comment','commented on your post'],['follow','started following you'],['community','posted in a community you joined'],['mention','mentioned you in a comment'],['request','sent you a connection request'],['message','sent you a message']]
export const NOTIFS:Notif[]=Array.from({length:20},(_,i)=>({id:'n'+i,userId:'*',type:NT[i%7][0],text:NT[i%7][1],actorId:'u'+((i*4+1)%15),timestamp:Date.now()-(i*3+1)*H,read:i>5}))
