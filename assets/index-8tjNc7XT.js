import{_ as h,a as v,l as N,b as S,u as M,e as _,r as w,i as C,f as p,C as P,h as j,j as m,k as L,m as R,n as z,p as F,P as B,o as Q,q as W,s as G,t as T}from"./index-DjMbzzM2.js";import{i as U}from"./is-plan-event-enabled-uEArfAWp.js";function k(i){return i.toLowerCase().replace(".","").replace(/\s+/g,"-")}function D(i,t){return t===void 0&&(t=!1),t?btoa(i).replace(/=/g,""):void 0}function V(i){return("Integration"in i?i.Integration:i).prototype.name}function H(i,t,r){var n,a;try{var e=((a=(n=window==null?void 0:window.performance)===null||n===void 0?void 0:n.getEntriesByName(i,"resource"))!==null&&a!==void 0?a:[])[0];e&&t.stats.gauge("legacy_destination_time",Math.round(e.duration),_([r],e.duration<100?["cached"]:[],!0))}catch{}}function J(i,t,r){var n;if("Integration"in i){var a={user:function(){return r.user()},addIntegration:function(){}};i(a),n=i.Integration}else n=i;var e=new n(t);return e.analytics=r,e}function K(i,t,r,n){return h(this,void 0,void 0,function(){var a,e,o,u,s,l;return v(this,function(c){switch(c.label){case 0:a=k(t),e=D(a,n),o=S(),u="".concat(o,"/integrations/").concat(e??a,"/").concat(r,"/").concat(e??a,".dynamic.js.gz"),c.label=1;case 1:return c.trys.push([1,3,,4]),[4,N(u)];case 2:return c.sent(),H(u,i,t),[3,4];case 3:throw s=c.sent(),i.stats.gauge("legacy_destination_time",-1,["plugin:".concat(t),"failed"]),s;case 4:return l=window["".concat(a,"Deps")],[4,Promise.all(l.map(function(g){return N(o+g+".gz")}))];case 5:return c.sent(),window["".concat(a,"Loader")](),[2,window["".concat(a,"Integration")]]}})})}function X(i,t,r){return h(this,void 0,void 0,function(){var n,a,e,o;return v(this,function(u){return n=S(),a=k(i),e=D(i,r),o="".concat(n,"/integrations/").concat(e??a,"/").concat(t,"/").concat(e??a,".dynamic.js.gz"),[2,M(o)]})})}function Y(i){var t,r,n,a;return(a=(r=(t=i==null?void 0:i.versionSettings)===null||t===void 0?void 0:t.override)!==null&&r!==void 0?r:(n=i==null?void 0:i.versionSettings)===null||n===void 0?void 0:n.version)!==null&&a!==void 0?a:"latest"}var Z=function(i,t){var r,n=t.type,a=t.bundlingStatus,e=t.versionSettings,o=a!=="unbundled"&&(n==="browser"||((r=e==null?void 0:e.componentTypes)===null||r===void 0?void 0:r.includes("browser")));return!i.startsWith("Segment")&&i!=="Iterable"&&o},$=function(i,t){var r=t.All===!1&&t[i]===void 0;return t[i]===!1||r};function q(i,t){return h(this,void 0,void 0,function(){var r,n=this;return v(this,function(a){switch(a.label){case 0:return r=[],C()?[2,t]:[4,F(function(){return t.length>0&&G()},function(){return h(n,void 0,void 0,function(){var e,o,u;return v(this,function(s){switch(s.label){case 0:return e=t.pop(),e?[4,W(e,i)]:[2];case 1:return o=s.sent(),u=o instanceof T,u||r.push(e),[2]}})})})];case 1:return a.sent(),r.map(function(e){return t.pushWithBackoff(e)}),[2,t]}})})}var x=function(){function i(t,r,n,a,e,o){a===void 0&&(a={}),this.options={},this.type="destination",this.middleware=[],this._ready=!1,this._initialized=!1,this.flushing=!1,this.name=t,this.version=r,this.settings=p({},a),this.disableAutoISOConversion=e.disableAutoISOConversion||!1,this.integrationSource=o,this.settings.type&&this.settings.type==="browser"&&delete this.settings.type,this.options=e,this.buffer=e.disableClientPersistence?new B(4,[]):new Q(4,"".concat(n,":dest-").concat(t)),this.scheduleFlush()}return i.prototype.isLoaded=function(){return this._ready},i.prototype.ready=function(){var t;return(t=this.onReady)!==null&&t!==void 0?t:Promise.resolve()},i.prototype.load=function(t,r){var n;return h(this,void 0,void 0,function(){var a,e,o=this;return v(this,function(u){switch(u.label){case 0:return this._ready||this.onReady!==void 0?[2]:(n=this.integrationSource)!==null&&n!==void 0?(e=n,[3,3]):[3,1];case 1:return[4,K(t,this.name,this.version,this.options.obfuscate)];case 2:e=u.sent(),u.label=3;case 3:a=e,this.integration=J(a,this.settings,r),this.onReady=new Promise(function(s){var l=function(){o._ready=!0,s(!0)};o.integration.once("ready",l)}),this.onInitialize=new Promise(function(s){var l=function(){o._initialized=!0,s(!0)};o.integration.on("initialize",l)});try{w(t,{integrationName:this.name,methodName:"initialize",type:"classic"}),this.integration.initialize()}catch(s){throw w(t,{integrationName:this.name,methodName:"initialize",type:"classic",didError:!0}),s}return[2]}})})},i.prototype.unload=function(t,r){return X(this.name,this.version,this.options.obfuscate)},i.prototype.addMiddleware=function(){for(var t,r=[],n=0;n<arguments.length;n++)r[n]=arguments[n];this.middleware=(t=this.middleware).concat.apply(t,r)},i.prototype.shouldBuffer=function(t){return t.event.type!=="page"&&(C()||this._ready===!1||this._initialized===!1)},i.prototype.send=function(t,r,n){var a,e;return h(this,void 0,void 0,function(){var o,u,s,l,c,g;return v(this,function(f){switch(f.label){case 0:if(this.shouldBuffer(t))return this.buffer.push(t),this.scheduleFlush(),[2,t];if(o=(e=(a=this.options)===null||a===void 0?void 0:a.plan)===null||e===void 0?void 0:e.track,u=t.event.event,o&&u&&this.name!=="Segment.io"){if(s=o[u],U(o,s))t.updateEvent("integrations",p(p({},t.event.integrations),s==null?void 0:s.integrations));else return t.updateEvent("integrations",p(p({},t.event.integrations),{All:!1,"Segment.io":!0})),t.cancel(new P({retry:!1,reason:"Event ".concat(u," disabled for integration ").concat(this.name," in tracking plan"),type:"Dropped by plan"})),[2,t];if(s!=null&&s.enabled&&(s==null?void 0:s.integrations[this.name])===!1)return t.cancel(new P({retry:!1,reason:"Event ".concat(u," disabled for integration ").concat(this.name," in tracking plan"),type:"Dropped by plan"})),[2,t]}return[4,j(this.name,t.event,this.middleware)];case 1:if(l=f.sent(),l===null)return[2,t];c=new r(l,{traverse:!this.disableAutoISOConversion}),w(t,{integrationName:this.name,methodName:n,type:"classic"}),f.label=2;case 2:return f.trys.push([2,5,,6]),this.integration?[4,this.integration.invoke.call(this.integration,n,c)]:[3,4];case 3:f.sent(),f.label=4;case 4:return[3,6];case 5:throw g=f.sent(),w(t,{integrationName:this.name,methodName:n,type:"classic",didError:!0}),g;case 6:return[2,t]}})})},i.prototype.track=function(t){return h(this,void 0,void 0,function(){return v(this,function(r){return[2,this.send(t,m.Track,"track")]})})},i.prototype.page=function(t){var r;return h(this,void 0,void 0,function(){var n=this;return v(this,function(a){return!((r=this.integration)===null||r===void 0)&&r._assumesPageview&&!this._initialized&&this.integration.initialize(),[2,this.onInitialize.then(function(){return n.send(t,m.Page,"page")})]})})},i.prototype.identify=function(t){return h(this,void 0,void 0,function(){return v(this,function(r){return[2,this.send(t,m.Identify,"identify")]})})},i.prototype.alias=function(t){return h(this,void 0,void 0,function(){return v(this,function(r){return[2,this.send(t,m.Alias,"alias")]})})},i.prototype.group=function(t){return h(this,void 0,void 0,function(){return v(this,function(r){return[2,this.send(t,m.Group,"group")]})})},i.prototype.scheduleFlush=function(){var t=this;this.flushing||setTimeout(function(){return h(t,void 0,void 0,function(){var r;return v(this,function(n){switch(n.label){case 0:return this.flushing=!0,r=this,[4,q(this,this.buffer)];case 1:return r.buffer=n.sent(),this.flushing=!1,this.buffer.todo>0&&this.scheduleFlush(),[2]}})})},Math.random()*5e3)},i}();function it(i,t,r,n,a,e){var o,u;if(r===void 0&&(r={}),n===void 0&&(n={}),L())return[];t.plan&&(n=n??{},n.plan=t.plan);var s=(u=(o=t.middlewareSettings)===null||o===void 0?void 0:o.routingRules)!==null&&u!==void 0?u:[],l=t.integrations,c=n.integrations,g=R(t,n??{}),f=e==null?void 0:e.reduce(function(d,b){var y;return p(p({},d),(y={},y[V(b)]=b,y))},{}),E=new Set(_(_([],Object.keys(l).filter(function(d){return Z(d,l[d])}),!0),Object.keys(f||{}).filter(function(d){return z(l[d])||z(c==null?void 0:c[d])}),!0));return Array.from(E).filter(function(d){return!$(d,r)}).map(function(d){var b=l[d],y=Y(b),I=new x(d,y,i,g[d],n,f==null?void 0:f[d]),O=s.filter(function(A){return A.destinationName===d});return O.length>0&&a&&I.addMiddleware(a),I})}export{x as LegacyDestination,it as ajsDestinations};