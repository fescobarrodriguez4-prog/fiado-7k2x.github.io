var KEY="libreta-fiado-v1",db={clients:[]},view=null,q="";
try{var s=localStorage.getItem(KEY);if(s)db=clean(JSON.parse(s))}catch(e){}
function save(){try{localStorage.setItem(KEY,JSON.stringify(db))}catch(e){}}
var TKEY="libreta-tema",theme="auto";
try{theme=localStorage.getItem(TKEY)||"auto"}catch(e){}
function applyTheme(t){var r=document.documentElement;if(t==="light"||t==="dark")r.setAttribute("data-theme",t);else r.removeAttribute("data-theme");
 var dark=t==="dark"||(t!=="light"&&matchMedia("(prefers-color-scheme: dark)").matches);
 var m=document.querySelector('meta[name="theme-color"]');if(m)m.content=dark?"#1a2226":"#f2f5f3"}
applyTheme(theme);
try{matchMedia("(prefers-color-scheme: dark)").addEventListener("change",function(){applyTheme(theme)})}catch(e){}
function seg(){return '<div class="seg" role="group" aria-label="Tema">'+[["auto","Automático"],["light","Claro"],["dark","Oscuro"]].map(function(o){return '<button data-t="'+o[0]+'" aria-pressed="'+(theme===o[0])+'">'+o[1]+'</button>'}).join('')+'</div>'}
function dl(name,text){
 function fb(){var a=document.createElement("a");a.href=URL.createObjectURL(new Blob([text]));a.download=name;document.body.appendChild(a);a.click();a.remove()}
 var p=window.claude&&claude.use?claude.use("downloads"):Promise.resolve(null);
 return p.then(function(d){if(!d){fb();return"saved"}return d.save({filename:name,data:text}).then(function(r){return r.status})}).catch(function(){return"error"})}
function wire(){
 function st(t){var e=$("st");if(e)e.textContent=t}
 [].forEach.call(document.querySelectorAll(".seg button"),function(b){b.onclick=function(){theme=b.dataset.t;try{localStorage.setItem(TKEY,theme)}catch(e){}applyTheme(theme);render()}});
 var stamp=new Date().toISOString().slice(0,10);
 $("bk1").onclick=function(){dl("respaldo-libreta-"+stamp+".json",JSON.stringify(db)).then(function(r){if(r==="saved"){db.lastBackup=Date.now();save();render()}else st("No se guardó el respaldo. Intenta de nuevo.")})};
 $("bk2").onclick=function(){var rows=[["Cliente","Telefono","Saldo"]].concat(db.clients.map(function(c){return[csvSafe(c.name),c.phone,bal(c)]}));
  var csv="\ufeff"+rows.map(function(r){return r.map(function(v){return'"'+String(v).replace(/"/g,'""')+'"'}).join(",")}).join("\r\n");
  dl("saldos-"+stamp+".csv",csv).then(function(r){if(r!=="saved")st("No se guardó el archivo.")})};
 $("bk3").onclick=function(){$("rf").click()};
 $("rf").onchange=function(e){var f=e.target.files[0];if(!f)return;var rd=new FileReader();
  rd.onload=function(){try{var d=JSON.parse(rd.result);if(!d||!Array.isArray(d.clients))throw 0;db=clean(d);save();view=null;render();st("Respaldo restaurado: "+db.clients.length+" clientes.")}catch(x){st("Ese archivo no es un respaldo válido.")}};rd.readAsText(f)};
}
var $=function(id){return document.getElementById(id)};
function csvSafe(v){v=String(v);return /^[=+\-@\t\r]/.test(v)?"'"+v:v}
function clean(d){if(!d||!Array.isArray(d.clients)||d.clients.length>5000)throw 0;
 var o={clients:[],lastBackup:+d.lastBackup||0};
 d.clients.forEach(function(c,i){if(!c||typeof c.name!=="string")return;var ms=Array.isArray(c.moves)?c.moves:[];
  o.clients.push({id:String(c.id||"").replace(/[^a-z0-9]/gi,"").slice(0,20)||Date.now().toString(36)+i,name:c.name.slice(0,80),
   phone:String(c.phone||"").replace(/\D/g,"").slice(0,15),
   moves:ms.slice(0,20000).map(function(m){m=m||{};return{t:+m.t||0,amt:+m.amt||0,note:String(m.note||"").slice(0,120)}}).filter(function(m){return isFinite(m.amt)&&m.amt!==0})})});
 return o}
function nrm(s){return String(s).normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase()}
function hue(s){var h=0;for(var i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))%360;return"hsl("+h+" 38% 74%)"}
function money(n){return n.toLocaleString("es-MX",{style:"currency",currency:"MXN"})}
function esc(t){return String(t).replace(/[&<>"']/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
function bal(c){return c.moves.reduce(function(a,m){return a+m.amt},0)}
function day(t){return new Date(t).toLocaleDateString("es-MX",{day:"numeric",month:"short"})}
function render(){var a=$("app");if(view===null)home(a);else detail(a)}
function home(a){
 var list=db.clients.filter(function(c){return nrm(c.name+" "+c.phone).indexOf(nrm(q.trim()))>-1}).sort(function(x,y){return bal(y)-bal(x)});
 var tot=db.clients.reduce(function(a,c){return a+Math.max(0,bal(c))},0);
 a.innerHTML=seg()+'<h1>Libreta de fiado</h1><p class="sub">Quién debe, cuánto y desde cuándo.</p>'+
 '<div class="total">Por cobrar<b>'+money(tot)+'</b></div>'+
 '<div class="row"><input id="nn" placeholder="Nombre del cliente nuevo" autocomplete="off"><button id="add">Agregar</button></div>'+
 (db.clients.length>0?'<input id="sq" type="search" placeholder="Buscar cliente por nombre o teléfono" aria-label="Buscar cliente" value="'+esc(q)+'" style="margin-top:12px">':'')+
 (list.length?list.map(function(c){var b=bal(c),last=c.moves.length?day(c.moves[c.moves.length-1].t):"";
  return '<button class="client" data-id="'+esc(c.id)+'"><i class="av" style="background:'+hue(c.name)+'">'+esc(c.name.trim().charAt(0).toUpperCase())+'</i><span class="nm"><strong>'+esc(c.name)+'</strong><small>'+(last?'Último movimiento: '+last:'Sin movimientos')+'</small></span><span class="debt'+(b<=0?' ok':'')+'">'+(b<=0?'Al corriente':money(b))+'</span></button>'}).join(''):
  '<p class="empty">'+(db.clients.length?'No hay clientes con ese nombre.':'Aún no hay clientes. Agrega el primero arriba.')+'</p>')+
 '<div class="panel" style="margin-top:22px"><strong>Respaldo</strong>'+(db.clients.length&&(!db.lastBackup||Date.now()-db.lastBackup>6048e5)?'<small style="color:var(--red)">'+(db.lastBackup?'Hace más de 7 días sin respaldo.':'Aún no has hecho un respaldo.')+' Descárgalo y guárdalo en tu correo o en Drive.</small>':(db.lastBackup?'<small style="color:var(--mute)">Último respaldo: '+day(db.lastBackup)+'</small>':''))+'<div class="row"><button id="bk1">Descargar respaldo</button><button id="bk3" class="ghost">Restaurar</button></div><button id="bk2" class="ghost">Exportar saldos a Excel</button><input id="rf" type="file" accept=".json,application/json" hidden><small id="st" role="status" style="color:var(--mute)"></small></div>'+
 '<p class="note">Los datos se guardan en este dispositivo. Si cambias de teléfono o borras los datos del navegador, se pierden: descarga un respaldo seguido.</p>';
 $("add").onclick=function(){var n=$("nn").value.trim();if(!n)return $("nn").focus();db.clients.push({id:Date.now().toString(36),name:n,phone:"",moves:[]});save();render()};
 $("nn").onkeydown=function(e){if(e.key==="Enter")$("add").click()};
 wire();
 if($("sq"))$("sq").onkeydown=function(e){if(e.key==="Enter"&&list.length===1){view=list[0].id;render();scrollTo(0,0)}};
 if($("sq"))$("sq").oninput=function(e){q=e.target.value;var p=e.target.selectionStart;render();$("sq").focus();$("sq").setSelectionRange(p,p)};
 [].forEach.call(a.querySelectorAll(".client"),function(b){b.onclick=function(){view=b.dataset.id;render();scrollTo(0,0)}});
}
function detail(a){
 var c=db.clients.filter(function(x){return x.id===view})[0];if(!c){view=null;return render()}
 var b=bal(c);
 a.innerHTML='<button class="back" id="bk">Volver a la lista</button><div style="display:flex;align-items:center;gap:12px;margin:8px 0 14px"><i class="av" style="background:'+hue(c.name)+'">'+esc(c.name.trim().charAt(0).toUpperCase())+'</i><h1 style="margin:0">'+esc(c.name)+'</h1></div>'+
 '<div class="total">'+(b>0?'Debe':'Saldo')+'<b style="color:var(--'+(b>0?'red':'green')+')">'+money(Math.abs(b))+'</b></div>'+
 '<div class="panel"><input id="am" type="number" inputmode="decimal" min="0" placeholder="Monto"><input id="cn" placeholder="Concepto (opcional)">'+
 '<div class="row"><button id="fi">Anotar fiado</button><button id="ab" class="paid">Registrar abono</button></div></div>'+
 '<div class="panel"><input id="ph" type="tel" inputmode="tel" placeholder="WhatsApp (10 dígitos)" value="'+esc(c.phone)+'">'+
 '<button class="ghost" id="wa">Recordar cobro por WhatsApp</button></div>'+
 '<div class="hist">'+(c.moves.length?c.moves.slice().reverse().map(function(m){return '<div><span>'+esc(m.note||(m.amt>0?'Fiado':'Abono'))+'<small>'+day(m.t)+'</small></span><span class="'+(m.amt>0?'plus':'minus')+'">'+(m.amt>0?'+':'−')+money(Math.abs(m.amt))+'</span></div>'}).join(''):'<div><span class="empty" style="padding:0">Sin movimientos todavía.</span></div>')+'</div>'+
 '<button class="ghost" id="del">Eliminar cliente</button>';
 $("bk").onclick=function(){view=null;render()};
 function mv(sign){var v=parseFloat($("am").value);if(!(v>0))return $("am").focus();
  c.moves.push({t:Date.now(),amt:sign*v,note:$("cn").value.trim()});save();render()}
 $("fi").onclick=function(){mv(1)};$("ab").onclick=function(){mv(-1)};
 $("ph").onchange=function(){c.phone=$("ph").value.replace(/\D/g,"");save()};
 $("wa").onclick=function(){c.phone=$("ph").value.replace(/\D/g,"");save();if(c.phone.length<10)return $("ph").focus();
  var t="Hola "+c.name+", te recuerdo que tienes un saldo pendiente de "+money(Math.max(0,b))+" en la tienda. ¡Gracias!";
  window.open("https://wa.me/52"+c.phone.slice(-10)+"?text="+encodeURIComponent(t),"_blank")};
 $("del").onclick=function(){var d=$("del");if(!d.dataset.sure){d.dataset.sure="1";d.textContent="Toca otra vez para eliminar a "+c.name+" y su historial";d.className="";d.style.background="var(--red)";d.style.color="#fff";d.style.width="100%";setTimeout(function(){if(d.isConnected&&d.dataset.sure)render()},5000);return}db.clients=db.clients.filter(function(x){return x!==c});save();view=null;render()};
}
render();
if("serviceWorker" in navigator&&(location.protocol==="https:"||location.hostname==="localhost"))addEventListener("load",function(){navigator.serviceWorker.register("sw.js").catch(function(){})});
