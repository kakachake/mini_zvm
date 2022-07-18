(()=>{"use strict";var e={137:(e,t,n)=>{function o(e){return Object.prototype.toString.call(e).slice(8,-1).toLowerCase()}n.d(t,{ri:()=>k});const s=Symbol("raw_key"),r=Symbol("iterate"),i=Symbol("map_key_iterate");var c;let a;!function(e){e[e.SET=0]="SET",e[e.ADD=1]="ADD",e[e.DELETE=2]="DELETE"}(c||(c={}));const p=new WeakMap,d=[];function u(e,t={}){const n=()=>{!function(e){if(e.deps){for(let t=0;t<e.deps.length;t++)e.deps[t].delete(e);e.deps.length=0}}(n),a=n,d.push(n);const t=e();return d.pop(),a=d[d.length-1],t};return n.options=t,n.deps=[],t.lazy||n(),n}function l(e,t){if(!a||!b)return;const n=p.get(e)||p.set(e,new Map).get(e),o=n.get(t)||n.set(t,new Set).get(t);o.add(a),a.deps?a.deps.push(o):(a.deps=[]).push(o)}function m(e,t,{type:n}){const s=p.get(e);if(!s)return;const d=new Set,u=s.get(t),l=s.get(r);if(u&&u.forEach((e=>{d.add(e)})),(n===c.ADD||n===c.DELETE||n===c.SET&&"map"===o(e))&&l&&l.forEach((e=>{e!=a&&d.add(e)})),(n===c.ADD||n===c.DELETE)&&"map"===o(e)){const e=s.get(i);e&&e.forEach((e=>{e!=a&&d.add(e)}))}if(n===c.ADD&&Array.isArray(e)){const e=s.get("length");e&&e.forEach((e=>{e!=a&&d.add(e)}))}d.forEach((e=>{a!==e&&(e.options&&e.options.scheduler?e.options.scheduler(e):e())}))}const h={add(e){const t=this[s],n=t.has(e),o=e[s]||e,r=t.add(o);return n||m(t,e,{type:c.ADD}),r},delete(e){const t=this[s],n=t.has(e),o=t.delete(e);return n&&m(t,e,{type:c.DELETE}),o},get(e){const t=this[s],n=t.has(e);if(l(t,e),n){const n=t.get(e);return"object"==typeof n?g(n):n}},set(e,t){const n=this[s],o=n.has(e),r=n.get(e),i=t[s]||t,a=n.set(e,i);return o?(r!==t||r==r&&t==t)&&m(n,e,{type:c.SET}):m(n,e,{type:c.ADD}),a},forEach(e,t){const n=this[s];return l(n,r),n.forEach(((t,n,o)=>e(f(t),f(n),o)),t)},[Symbol.iterator](){const e=this[s];l(e,r);const t=e[Symbol.iterator]();return{next(){const{value:e,done:n}=t.next();return{value:e?[f(e[0]),f(e[1])]:e,done:n}},[Symbol.iterator](){return this}}},entries(){return this[Symbol.iterator]()},values:function(){const e=this[s],t=e.values();return l(e,r),{next(){const{value:e,done:n}=t.next();return{value:e?f(e):e,done:n}},[Symbol.iterator](){return this}}},keys:function(){const e=this[s],t=e.keys();return l(e,i),{next(){const{value:e,done:n}=t.next();return{value:e?f(e):e,done:n}},[Symbol.iterator](){return this}}}},f=e=>"object"==typeof e?g(e):e,b=!0,y=new Map;function g(e){const t=y.get(e);if(t)return t;const n=function(e,{isShallow:t=!1}){const n=o(e);return new Proxy(e,{get(e,o,i){if("__isProxy__"===o)return!0;if(o===s)return e;if("set"===n||"map"===n)return"size"===o?(l(e,r),Reflect.get(e,o,e)):h[o]?h[o]:e[o].bind(e);"symbol"!=typeof o&&l(e,o);const c=Reflect.get(e,o,i);return t?c:"object"==typeof c&&null!==c?g(c):c},set(e,t,n,o){const s=e[t],r=Array.isArray(e)?Number(t)<e.length?c.SET:c.ADD:Object.prototype.hasOwnProperty.call(e,t)?c.SET:c.ADD,i=Reflect.set(e,t,n,o);return s!==n&&m(e,t,{type:r}),i},has:(e,t)=>(l(e,t),Reflect.has(e,t)),ownKeys:e=>(l(e,Array.isArray(e)?"length":r),Reflect.ownKeys(e)),deleteProperty(e,t){const n=Object.prototype.hasOwnProperty.call(e,t),o=Reflect.deleteProperty(e,t);return n&&o&&(Array.isArray(e)?m(e,t,{type:c.SET}):m(e,t,{type:c.DELETE})),o}})}(e,{});return y.set(e,n),n}function v(e,t,n={immediate:!1}){let o,s,r;function i(e){r=e}function c(){r&&r(),r=null,s=a(),t(s,o,i),o=s}const a=u((()=>"function"==typeof e?e():(console.log(e),E(e))),{lazy:!0,scheduler:()=>{"post"===n.flush?Promise.resolve().then(c):c()}});n.immediate?c():o=a()}function E(e,t=new Set){if("object"!=typeof e||null===e||t.has(e))return e;t.add(e);for(const n in e)E(e[n],t);return e}const w=/^z-/,C=/^z-for/,N=/^z-bind/;function A(e,t,n){const o=t.split("."),s=o.length;let r=0;for(;r<s-1;)e=e[o[r++]];e[o[r]]=n}function $(e,t,n){const o=new Function(t,"return "+function(e,t){t=t.replace(/\s/g,"");const n=/(true|false|null|undefined)/g;return(t=" "+t).replace(/([\(:,\s\+\-\*\/%&\|\^!\*~]\s*?)(([a-zA-Z_$][a-zA-Z_$0-9]*))/g,((t,o,s)=>n.test(s)?o+s:o+e+"."+s))}(t,n));return o(e)}const D={on(e,t,n,o){const s=(n=n.replace(/\s/g,"")).match(/^(\w+)?/);if(!s)return;const r=s[1],i=t.split(":")[1],c=e&&e[r];if(i&&c){const t=e.pubsub?.subscribe(i+o.vm.id,c);o.vm.$emit=(t,...n)=>{e.pubsub?.publish(t.toLowerCase()+o.vm.id,...n)},o.vm._unsubscribes.add(t)}},if(e,t,n,o){let s;v((()=>!!$(e,"scope",n)),(e=>{e?(s=o.createCompApp(),o.mount(s)):o.unmounted(s)}),{immediate:!0})},for(e,t,n,o){const s=(n=n.replace(/\s/g,"")).match(/([(](\w+(,\w+)?)[)]|(\w+))in(\w+)/);if(s){const[,,t,,,n]=s;let r,i=s[1];t&&([i,r]=t.split(","));const c=o.createCompApps(i,r);v((()=>{$(e,"scope",n+".length")}),(()=>{c($(e,"scope",n))}),{immediate:!0})}},bind(e,t,n,{props:o,attrs:s,componentProps:r}){const i=t.split(":"),c=i.length>1?i[1]:t;if(r.hasOwnProperty(c)){const t=$(e,"scope",n);Object(t)instanceof r[c].type?Object.defineProperty(o,c,{enumerable:!0,configurable:!0,get:()=>$(e,"scope",n)}):console.warn(`${c} is not a ${o[c].type.name}`)}else Object.defineProperty(s,c,{enumerable:!0,configurable:!0,get:()=>$(e,"scope",n)})}};class x{componentName;node;parentVm;comment;apps=new Set;attrs=new Map;props={};componentOptions;constructor(e,t){if(this.node=e,this.parentVm=t,this.componentName=e.nodeName.toLowerCase(),this.componentOptions=this.parentVm.$components?.[this.componentName],!this.componentOptions)throw new Error(`component ${this.componentName} not found`);this.initAttrs(),this.initApp()}createCompApp(){const e=k(this.componentOptions);return this.apps.add(e),e}createCompApps(e,t){return n=>{const o=document.createDocumentFragment();let s=0;const r=this.apps.size;this.apps.forEach((e=>{this.unmounted(e,{node:e.node,remove:s!=r-1}),s++})),n.forEach(((n,s)=>{const r=this.createCompApp(),i=L({template:this.comment,data:t?{[e]:n,[t]:s}:{[e]:n}},this.parentVm);r.node=this.mount(r,o,!1,i)})),this.node.parentNode?.replaceChild(o,this.node)}}mount(e,t,n=!0,o){return this.compileDirectives(e,o||this.parentVm),e.vm._runCompile(),e.vm.compile?.mount(t||this.node,n)}unmounted(e,t){e&&(e.destroy&&e.destroy(),this.apps.delete(e),t?.node?t.remove?t.node.parentNode?.removeChild(t.node):t.node.parentNode?.replaceChild(this.node,t.node):(this.node.parentNode?.replaceChild(this.comment,this.node),this.node=this.comment))}initApp(){if(this.attrs.get("z-if"))this.comment=document.createComment("z-if"),this.node.parentNode?.replaceChild(this.comment,this.node),this.node=this.comment,D.if(this.parentVm,"if",this.attrs.get("z-if")||"",this),this.attrs.delete("z-if");else if(this.attrs.get("z-for"))this.comment=document.createComment("z-for"),this.node.parentNode?.replaceChild(this.comment,this.node),this.node=this.comment,D.for(this.parentVm,"for",this.attrs.get("z-for")||"",this),this.attrs.delete("z-for");else{const e=this.createCompApp();this.mount(e)}}initAttrs(){Array.from(this.node.attributes).forEach((e=>{const t=e.nodeName,n=e.nodeValue||"";this.attrs.set(t,n)}))}compileDirectives(e,t){const n=e.vm.$props,o=e.vm.$attrs,s=e.vm.$options.props;this.attrs.forEach(((r,i)=>{if(N.test(i))D.bind(t,i,r,{props:n||{},attrs:o||{},componentProps:s||{}});else if(w.test(i)){const t=i,n=r;!function(e,t,n,o){const{name:s,arg:r}=function(e){const t=e.match(/^z-(\w+)\s*(:(\w*))?$/);return t?{name:t[1],arg:t[3]}:{}}(t);s&&r&&D[s]&&D[s](e,t,n,o)}(this.parentVm,t,n,e)}else e.vm.$attrs[i]=r}))}}const O={textRender:(e,t,n)=>{if("INPUT"===e.nodeName){const n=e.getAttribute("type");if("radio"===n){const n=e.value;return void(e.checked=t===n)}return"checkbox"===n?void(e.checked=!!t):void(e.value=t)}Object.hasOwn(e,"_textContent")||Object.defineProperty(e,"_textContent",{value:e.textContent});const o=e._textContent;e.textContent=n?o.replace(n,t)||"":void 0===t?"":t},classRender:(e,t)=>{for(const n in t)t[n]?e.classList.add(n):e.classList.remove(n)},attrRender:e=>(t,n)=>{!0===n?t.setAttribute(e,""):!1===n?t.removeAttribute(e):t.setAttribute(e,n)},forRender:e=>{const t=e.cloneNode(!0),n=e.parentNode,o=e.previousSibling,s=[];return n?.removeChild(e),(e,r,i,c)=>{s.forEach((e=>{n?.removeChild(e)})),s.length=0;let a=o;for(let o=0;o<i.length;o++){if(!i[o])continue;const u=t.cloneNode(!0);u.removeAttribute("z-for"),a?(p=u,(d=a)?.parentNode?.insertBefore(p,d.nextSibling)):n?.appendChild(u),a=u,s.push(u);const l=L({template:u,data:r?{[e]:i[o],[r]:o}:{[e]:i[o]}},c);new P(u,l,{compileRoot:!0}).mount(),a=u}var p,d}}},S={};function T(e,t){S[e.toLowerCase()]=t}const j={on(e,t,n,o){const s=(o=o.replace(/\s/g,"")).match(/^(\w+)([(]((,?[$'\w']+)+)[)])?/);if(!s)return;const r=s[1],i=[],c=/^'(.*)'$/,a=/(\$event)$/;let p=-1;s&&s[3]&&s[3].split(",").forEach((e=>{c.test(e)?i.push(e.replace(c,"$1")):a.test(e)?(i.push(e),p=i.length-1):i.push(function(e,t){const n=t.split("."),o=n.length;let s=0;for(;s<o;)e=e[n[s++]];return e}(t.$data,e))}));const d=n.split(":")[1],u=t&&t[r];d&&u&&e.addEventListener(d,(e=>(~p&&i.splice(p,1,e),i.length||i.push(e),u.call(t,...i))))},model(e,t,n,o){this.text(e,t,n,o),("INPUT"===e.tagName&&"text"===e.type||"TEXTAREA"===e.tagName)&&e.addEventListener("input",(e=>{A(t.$data,o,e.target.value),e.preventDefault()})),"INPUT"===e.tagName&&"checkbox"===e.type&&e.addEventListener("change",(e=>{A(t.$data,o,e.target.checked)})),"INPUT"===e.tagName&&"radio"===e.type&&e.addEventListener("change",(e=>{A(t.$data,o,e.target.value)}))},text(e,t,n,o,s=""){const r=O.textRender;r&&v((()=>$(t,"scope",o)),(t=>{r&&r(e,t,s)}),{immediate:!0})},if(e,t,n,o){const s=e.nextElementSibling;let r=null;s&&void 0!==s.getAttribute("z-else")&&(r=s),v((()=>!!$(t,"scope",o)),(t=>{t?(e.style.display="block",r&&(r.style.display="none")):(e.style.display="none",r&&(r.style.display="block"))}),{immediate:!0})},for(e,t,n,o){const s=(o=o.replace(/\s/g,"")).match(/([(](\w+(,\w+)?)[)]|(\w+))in(\w+)/);if(s){const[,,n,,,o]=s;let r,i=s[1];n&&([i,r]=n.split(","));const c=O.forRender(e);u((()=>{c(i,r,$(t,"scope",o),t)}))}},bind(e,t,n,o){const s=n.split(":"),r=s.length>1?s[1]:n;let i=O[r+"Render"];i||(i=O.attrRender(r)),i&&u((()=>{i(e,$(t,"scope",o))}))}};class P{node;vm;needDeepCompile=!0;frag;options;mountType;mountNode;parentNode;constructor(e,t,n={compileRoot:!1}){this.vm=t,this.options=n,this.frag=this.nodeToFragment(e),this.mountNode=e,this.node=this.frag.children[0],n.compileRoot&&this.compileNode(e,this.vm),this.compileFrag(this.frag,this.vm)}mount(e,t){return e&&"boolean"!=typeof e?("string"==typeof e&&(e=document.querySelector(e)||""),"string"!=typeof e?(e&&t?(this.parentNode=e.parentNode,this.parentNode?.replaceChild(this.frag,e)):e&&e.appendChild(this.frag),this.mountNode=e,this.mountType=t?"replace":"append",this.vm.pubsub?.publish("mounted"),this.node):void 0):(this.mountNode.appendChild(this.frag),this.vm.pubsub?.publish("mounted"),this.frag)}unmounted(){try{"append"===this.mountType?this.mountNode?.removeChild(this.node):(console.log(this.node),this.parentNode?.replaceChild(this.mountNode,this.node)),this.vm.pubsub?.publish("unmounted")}catch(e){}}removeChilds(e){for(;e.firstChild;)e.firstChild.childNodes.length&&this.removeChilds(e.firstChild),e.removeChild(e.firstChild)}getFragment(){return this.frag}nodeToFragment(e){const t=document.createDocumentFragment();let n;for(;n=e.firstChild;)t.appendChild(n);return t}compileFrag(e,t){const n=e.childNodes;Array.from(n).forEach((e=>{this.compileNode(e,t),e.childNodes&&e.childNodes.length&&this.needDeepCompile&&this.compileFrag(e,t),this.needDeepCompile=!0}))}compileNode(e,t){t.$components&&t.$components[e.nodeName.toLowerCase()]?new x(e,t):1===e.nodeType?this.compileElement(e,t):3===e.nodeType&&this.compileText(e,t)}compileText(e,t){const n=e.textContent;if(!n)return;const o=/\{\{(.*)\}\}/.exec(n);null!==o&&j.text(e,t,"text",o[1],o[0])}compileElement(e,t){const n=Array.from(e.attributes),o=n.findIndex((e=>C.test(e.nodeName)));if(~o)return this.needDeepCompile=!1,void this.compileDirective(e,t,n[o]);Array.from(e.attributes).forEach((n=>{this.compileDirective(e,t,n)}))}compileDirective(e,t,n){const o=n.nodeName,s=n.nodeValue||"";w.test(o)&&(function(e,t,n,o){const{name:s,arg:r}=function(e){const t=e.match(/^z-(\w+)\s*(:(\w*))?$/);return t?{name:t[1],arg:t[3]}:{}}(n);s&&(j[s]?j[s](e,t,n,o):S[s]&&t.pubsub?.subscribe("mounted",(()=>{v((()=>$(t,"scope",o)),(t=>{S[s](e,{arg:r,value:t})}),{immediate:!0})})))}(e,t,o,s),e.removeAttribute(o))}}class z{subscribers;constructor(){this.subscribers={}}subscribe(e,t){return this.subscribers[e]||(this.subscribers[e]=new Set),this.subscribers[e].add(t),()=>{this.undsubscribe(e,t)}}publish(e,t=""){this.subscribers[e]&&this.subscribers[e].forEach((e=>{e(t)}))}undsubscribe(e,t){this.subscribers[e]&&this.subscribers[e].delete(t)}}function L(e,t={},n=!0){const o=Object.create(t);if(o.id=Math.random().toString(36).substr(2),!e.template&&!e.render)throw new Error("template or render not found");var s,r;return e.template?o.$el="string"==typeof e.template?document.querySelector(e.template):e.template:e.render&&(o.$el=e.render.call(o,R)),e.props&&(o.$props={},s=o,r=e.props,Object.keys(r).forEach((e=>{r.hasOwnProperty(e)&&Object.defineProperty(s,e,{configurable:!0,enumerable:!0,get:()=>s.$props[e]||r[e].default})}))),e.data&&(o.$data="function"==typeof e.data?n?g(e.data()):e.data():n?g(e.data):e.data,function(e){Object.keys(e.$data).forEach((t=>{Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:()=>e.$data[t],set:n=>{e.$data[t]=n}})}))}(o)),e.components&&Object.keys(e.components).map((t=>{o.$components={...o.$components,[t.toLowerCase()]:e.components[t]}})),o.$options=e,o.pubsub=new z,o._unsubscribes=new Set,function(e,t){t.created&&e.pubsub?.subscribe("created",t.created.bind(e)),t.mounted&&e.pubsub?.subscribe("mounted",t.mounted.bind(e))}(o,e),e.methods&&Object.keys(e.methods).forEach((e=>{!function(e,t){Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:()=>e.$options?.methods?.[t].bind(e)})}(o,e)})),e.computed&&function(e,t){"object"==typeof t&&Object.keys(t).forEach((n=>{const o=function(e){let t,n=!0;const o=u(e,{lazy:!0,scheduler(){n||(n=!0,m(s,"value",{type:c.SET}))}}),s={get value(){return n&&(t=o(),n=!1),l(s,"value"),t}};return s}(t[n].bind(e));Object.defineProperty(e,n,{get:()=>o.value})}))}(o,e.computed),e.directives&&function(e,t){"object"==typeof t&&Object.keys(t).forEach((e=>{T(e,t[e])}))}(0,e.directives),o}function k(e){const t=L(e);t.pubsub?.publish("created"),t._runCompile=e=>{t.compile=new P(t.$el,t,e)};const n=function(e){return(t,n)=>{e.$components={...e.$components,[t.toLowerCase()]:n}}}(t);return{vm:t,mount:e=>{t._runCompile(),t.compile.mount(e)},directive:T,destroy:()=>{t.compile?.unmounted(),t._unsubscribes.forEach((e=>{e()}))},component:n}}function R(e){const t=document.createElement("div");return t.innerHTML=e,t}console.log("zvm 0.1.0")}},t={};function n(o){var s=t[o];if(void 0!==s)return s.exports;var r=t[o]={exports:{}};return e[o](r,r.exports,n),r.exports}n.d=(e,t)=>{for(var o in t)n.o(t,o)&&!n.o(e,o)&&Object.defineProperty(e,o,{enumerable:!0,get:t[o]})},n.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),(0,n(137).ri)({template:"#app",data:()=>({count:0,message:"hello"}),methods:{handleClick(){this.count++},countP(e){return this.count+e}}}).mount("#app")})();