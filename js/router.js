export function parseHash(){
  const raw=(location.hash||"#/").slice(1);
  const [path]=raw.split("?");
  const parts=path.split("/").filter(Boolean);
  if(!parts.length)return {name:"home",param:null};
  const [name,param]=parts;
  return {name,param:decodeURIComponent(param||"")||null};
}
export function navigate(path){location.hash=path.startsWith("#")?path:`#${path.startsWith("/")?path:"/"+path}`}
