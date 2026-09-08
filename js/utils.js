export const $=(s,root=document)=>root.querySelector(s);
export const $$=(s,root=document)=>[...root.querySelectorAll(s)];
export const uid=(prefix="id")=>`${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,7)}`;
export const esc=(value="")=>String(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
export const formatDate=(value)=>{if(!value)return "Not set";const d=new Date(value+"T12:00:00");return Number.isNaN(d.getTime())?value:d.toLocaleDateString(undefined,{year:"numeric",month:"short",day:"numeric"})};
export const debounce=(fn,wait=150)=>{let t;return(...args)=>{clearTimeout(t);t=setTimeout(()=>fn(...args),wait)}};
export const titleCase=s=>String(s||"").replace(/[-_]/g," ").replace(/\b\w/g,c=>c.toUpperCase());
export const safeJsonParse=(text,fallback)=>{try{return JSON.parse(text)}catch{return fallback}};
export function toast(message){const region=document.getElementById("toast-region");if(!region)return;const el=document.createElement("div");el.className="toast";el.textContent=message;region.appendChild(el);setTimeout(()=>el.remove(),2600)}
export function downloadJson(filename,data){const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=filename;a.click();URL.revokeObjectURL(a.href)}