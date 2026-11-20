import { readFuel, recordObservedFuel, fuelStation, stationUrl, reserveUrl } from "./fuel.js";

const version="2026-07-28";
const info={name:"zr-auto-gbo",version:"1.0.0"};
const props={
  source:{type:"string",enum:[stationUrl,reserveUrl],description:"Ссылка на настроенный источник и его АЗС АСКО"},
  petrolPrice:{type:"number",exclusiveMinimum:0,maximum:500,description:"АИ-95, рублей за литр"},
  gasPrice:{type:"number",exclusiveMinimum:0,maximum:500,description:"СУГ/пропан, рублей за литр"},
  petrolDate:{type:"string",format:"date",description:"Дата цены АИ-95 из раздела «Цены»"},
  gasDate:{type:"string",format:"date",description:"Дата цены пропана из раздела «Цены»"},
};
const tools=[
  {name:"get_station_prices",description:"Показать используемые в калькуляторе цены и время их последней сверки.",inputSchema:{type:"object",properties:{},additionalProperties:false},annotations:{readOnlyHint:true}},
  {name:"record_station_prices",description:"Записать проверенные в карточке АСКО цены АИ-95 и пропана для калькулятора. Доступно только владельцу. Более ранние даты отклоняются.",inputSchema:{type:"object",properties:props,required:Object.keys(props),additionalProperties:false},annotations:{destructiveHint:false,idempotentHint:true}},
];

export async function fuelMcp(request,env,owner){
  if(request.method!=="POST")return new Response(null,{status:405,headers:{Allow:"POST"}});
  const headers={"Cache-Control":"private,no-store"};
  let rpc;
  try{rpc=await request.json();}catch{return Response.json({jsonrpc:"2.0",id:null,error:{code:-32700,message:"Invalid JSON"}},{status:400,headers});}
  const send=body=>Response.json({jsonrpc:"2.0",id:rpc?.id??null,...body},{headers});
  if(!rpc||rpc.jsonrpc!=="2.0")return send({error:{code:-32600,message:"Invalid request"}});
  if(rpc.method==="server/discover")return send({result:{supportedVersions:[version],capabilities:{tools:{}}}});
  if(rpc.method==="initialize")return send({result:{protocolVersion:version,serverInfo:info,capabilities:{tools:{}}}});
  if(rpc.method==="notifications/initialized")return new Response(null,{status:202,headers});
  if(rpc.method==="ping")return send({result:{}});
  if(rpc.method==="tools/list")return send({result:{tools}});
  if(rpc.method!=="tools/call")return send({error:{code:-32601,message:"Unknown method"}});
  const name=rpc.params?.name;
  if(!tools.some(tool=>tool.name===name))return send({error:{code:-32602,message:"Unknown tool"}});
  const reply=(text,isError=false)=>send({result:{content:[{type:"text",text}],isError}});
  if(name==="record_station_prices"&&!owner)return reply("Для обновления нужен аккаунт владельца сайта.",true);
  try{
    const state=name==="get_station_prices"?await readFuel(env.DB):await recordObservedFuel(env.DB,rpc.params.arguments);
    const station=fuelStation(state.rates);
    return reply(JSON.stringify({station:station.name,source:station.url,...state.rates,checkedAt:state.checkedAt}));
  }catch(error){return reply(error.message,true);}
}
