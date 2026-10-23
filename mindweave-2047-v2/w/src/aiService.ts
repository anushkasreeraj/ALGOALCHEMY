// Provider interface. Default = local deterministic demo logic (no keys needed).
// To go model-backed: set VITE_AI_ENDPOINT to YOUR serverless function (which holds the secret key). Never put keys in frontend code.
import {analyzeDemo,type Mirror} from './socialMoodMirror'
const endpoint=(import.meta as any).env?.VITE_AI_ENDPOINT as string|undefined
export const ai={
 mode:endpoint?'remote-model':'demo-rules',
 async analyze(text:string):Promise<Mirror>{
  if(endpoint){try{const r=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text})});if(r.ok)return{...(await r.json()),source:'remote-model'}}catch{}}
  return analyzeDemo(text)}}
