// DEMO: deterministic keyword rules. Not a model. Not a clinical assessment.
export type Mirror={context:string;signal:string;intent:string;tags:string[];reflection:string;action:string;source:'demo-rules'|'remote-model'}
const R:[RegExp,string,string,string,string[],string,string][]=[
[/everyone.*(better|ahead)|compar|behind|not as good/i,'Seeking support','Social comparison','Seeking perspective or connection',['peer','wellbeing','learning'],'What is one thing you have learned recently?','Explore a supportive discussion'],
[/not sure|confus|uncertain|don'?t know what|unsure/i,'Seeking advice','Uncertainty','Looking for guidance',['mentoring','learning','career'],'What would make the next step feel smaller?','Ask a community for perspectives'],
[/frustrat|annoy|fed up|stuck|angry/i,'Seeking support','Frustration','Wanting to be heard',['peer','wellbeing'],'What part of this is within your control today?','Share with a supportive community or take a break'],
[/finished|shipped|proud|achiev|got the job|won |completed/i,'Sharing an achievement','Positive achievement','Sharing a win',['creative','career','learning'],'Who helped you get here?','Celebrate with a community'],
[/lonely|new city|looking for friends|find my people|new school|alone/i,'Seeking connection','Desire for connection','Seeking connection',['peer','transition','family'],'What kind of people would you like to meet?','Join a community that fits an interest'],
[/help|advice|how (do|can|should)|any tips|suggest/i,'Seeking advice','Request for support','Seeking advice',['learning','mentoring'],'What have you already tried?','Post your question in a community'],
[/motivat|focus|procrastin|cannot start|can'?t start/i,'Seeking motivation','Uncertainty','Seeking a push',['learning','wellbeing'],'What is the smallest first step?','Try a study or habit circle'],
[/bored|distract|rate my|memes?/i,'Seeking distraction','Light social interaction','Seeking distraction',['creative','tech'],'Is there something playful you would like to try?','Browse a creative community']]
export function analyzeDemo(text:string):Mirror{
 const m=R.find(r=>r[0].test(text));
 if(m)return{context:m[1],signal:m[2],intent:m[3],tags:m[4],reflection:m[5],action:m[6],source:'demo-rules'}
 return{context:/\bi (went|saw|tried|visited)\b|today|yesterday/i.test(text)?'Sharing an experience':'General social interaction',signal:'No specific signal found',intent:'General sharing',tags:['peer','creative'],reflection:'What would you like to hear back from others?',action:'Share it with a community you like',source:'demo-rules'}}
