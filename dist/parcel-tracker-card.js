/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */


function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$2=globalThis,e$4=t$2.ShadowRoot&&(void 0===t$2.ShadyCSS||t$2.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s$2=Symbol(),o$4=new WeakMap;let n$3 = class n{constructor(t,e,o){if(this._$cssResult$=true,o!==s$2)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e;}get styleSheet(){let t=this.o;const s=this.t;if(e$4&&void 0===t){const e=void 0!==s&&1===s.length;e&&(t=o$4.get(s)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&o$4.set(s,t));}return t}toString(){return this.cssText}};const r$4=t=>new n$3("string"==typeof t?t:t+"",void 0,s$2),i$3=(t,...e)=>{const o=1===t.length?t[0]:e.reduce((e,s,o)=>e+(t=>{if(true===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[o+1],t[0]);return new n$3(o,t,s$2)},S$1=(s,o)=>{if(e$4)s.adoptedStyleSheets=o.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of o){const o=document.createElement("style"),n=t$2.litNonce;void 0!==n&&o.setAttribute("nonce",n),o.textContent=e.cssText,s.appendChild(o);}},c$2=e$4?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return r$4(e)})(t):t;

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:i$2,defineProperty:e$3,getOwnPropertyDescriptor:h$1,getOwnPropertyNames:r$3,getOwnPropertySymbols:o$3,getPrototypeOf:n$2}=Object,a$1=globalThis,c$1=a$1.trustedTypes,l$1=c$1?c$1.emptyScript:"",p$1=a$1.reactiveElementPolyfillSupport,d$1=(t,s)=>t,u$1={toAttribute(t,s){switch(s){case Boolean:t=t?l$1:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t);}return t},fromAttribute(t,s){let i=t;switch(s){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t);}catch(t){i=null;}}return i}},f$1=(t,s)=>!i$2(t,s),b$1={attribute:true,type:String,converter:u$1,reflect:false,useDefault:false,hasChanged:f$1};Symbol.metadata??=Symbol("metadata"),a$1.litPropertyMetadata??=new WeakMap;let y$1 = class y extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t);}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,s=b$1){if(s.state&&(s.attribute=false),this._$Ei(),this.prototype.hasOwnProperty(t)&&((s=Object.create(s)).wrapped=true),this.elementProperties.set(t,s),!s.noAccessor){const i=Symbol(),h=this.getPropertyDescriptor(t,i,s);void 0!==h&&e$3(this.prototype,t,h);}}static getPropertyDescriptor(t,s,i){const{get:e,set:r}=h$1(this.prototype,t)??{get(){return this[s]},set(t){this[s]=t;}};return {get:e,set(s){const h=e?.call(this);r?.call(this,s),this.requestUpdate(t,h,i);},configurable:true,enumerable:true}}static getPropertyOptions(t){return this.elementProperties.get(t)??b$1}static _$Ei(){if(this.hasOwnProperty(d$1("elementProperties")))return;const t=n$2(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties);}static finalize(){if(this.hasOwnProperty(d$1("finalized")))return;if(this.finalized=true,this._$Ei(),this.hasOwnProperty(d$1("properties"))){const t=this.properties,s=[...r$3(t),...o$3(t)];for(const i of s)this.createProperty(i,t[i]);}const t=this[Symbol.metadata];if(null!==t){const s=litPropertyMetadata.get(t);if(void 0!==s)for(const[t,i]of s)this.elementProperties.set(t,i);}this._$Eh=new Map;for(const[t,s]of this.elementProperties){const i=this._$Eu(t,s);void 0!==i&&this._$Eh.set(i,t);}this.elementStyles=this.finalizeStyles(this.styles);}static finalizeStyles(s){const i=[];if(Array.isArray(s)){const e=new Set(s.flat(1/0).reverse());for(const s of e)i.unshift(c$2(s));}else void 0!==s&&i.push(c$2(s));return i}static _$Eu(t,s){const i=s.attribute;return  false===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=false,this.hasUpdated=false,this._$Em=null,this._$Ev();}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this));}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.();}removeController(t){this._$EO?.delete(t);}_$E_(){const t=new Map,s=this.constructor.elementProperties;for(const i of s.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t);}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return S$1(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(true),this._$EO?.forEach(t=>t.hostConnected?.());}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.());}attributeChangedCallback(t,s,i){this._$AK(t,i);}_$ET(t,s){const i=this.constructor.elementProperties.get(t),e=this.constructor._$Eu(t,i);if(void 0!==e&&true===i.reflect){const h=(void 0!==i.converter?.toAttribute?i.converter:u$1).toAttribute(s,i.type);this._$Em=t,null==h?this.removeAttribute(e):this.setAttribute(e,h),this._$Em=null;}}_$AK(t,s){const i=this.constructor,e=i._$Eh.get(t);if(void 0!==e&&this._$Em!==e){const t=i.getPropertyOptions(e),h="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:u$1;this._$Em=e;const r=h.fromAttribute(s,t.type);this[e]=r??this._$Ej?.get(e)??r,this._$Em=null;}}requestUpdate(t,s,i,e=false,h){if(void 0!==t){const r=this.constructor;if(false===e&&(h=this[t]),i??=r.getPropertyOptions(t),!((i.hasChanged??f$1)(h,s)||i.useDefault&&i.reflect&&h===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,i))))return;this.C(t,s,i);} false===this.isUpdatePending&&(this._$ES=this._$EP());}C(t,s,{useDefault:i,reflect:e,wrapped:h},r){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??s??this[t]),true!==h||void 0!==r)||(this._$AL.has(t)||(this.hasUpdated||i||(s=void 0),this._$AL.set(t,s)),true===e&&this._$Em!==t&&(this._$Eq??=new Set).add(t));}async _$EP(){this.isUpdatePending=true;try{await this._$ES;}catch(t){Promise.reject(t);}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,s]of this._$Ep)this[t]=s;this._$Ep=void 0;}const t=this.constructor.elementProperties;if(t.size>0)for(const[s,i]of t){const{wrapped:t}=i,e=this[s];true!==t||this._$AL.has(s)||void 0===e||this.C(s,void 0,i,e);}}let t=false;const s=this._$AL;try{t=this.shouldUpdate(s),t?(this.willUpdate(s),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(s)):this._$EM();}catch(s){throw t=false,this._$EM(),s}t&&this._$AE(s);}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=true,this.firstUpdated(t)),this.updated(t);}_$EM(){this._$AL=new Map,this.isUpdatePending=false;}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return  true}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM();}updated(t){}firstUpdated(t){}};y$1.elementStyles=[],y$1.shadowRootOptions={mode:"open"},y$1[d$1("elementProperties")]=new Map,y$1[d$1("finalized")]=new Map,p$1?.({ReactiveElement:y$1}),(a$1.reactiveElementVersions??=[]).push("2.1.2");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$1=globalThis,i$1=t=>t,s$1=t$1.trustedTypes,e$2=s$1?s$1.createPolicy("lit-html",{createHTML:t=>t}):void 0,h="$lit$",o$2=`lit$${Math.random().toFixed(9).slice(2)}$`,n$1="?"+o$2,r$2=`<${n$1}>`,l=document,c=()=>l.createComment(""),a=t=>null===t||"object"!=typeof t&&"function"!=typeof t,u=Array.isArray,d=t=>u(t)||"function"==typeof t?.[Symbol.iterator],f="[ \t\n\f\r]",v=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,_=/-->/g,m=/>/g,p=RegExp(`>|${f}(?:([^\\s"'>=/]+)(${f}*=${f}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),g=/'/g,$=/"/g,y=/^(?:script|style|textarea|title)$/i,x=t=>(i,...s)=>({_$litType$:t,strings:i,values:s}),b=x(1),E=Symbol.for("lit-noChange"),A=Symbol.for("lit-nothing"),C=new WeakMap,P=l.createTreeWalker(l,129);function V(t,i){if(!u(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==e$2?e$2.createHTML(i):i}const N=(t,i)=>{const s=t.length-1,e=[];let n,l=2===i?"<svg>":3===i?"<math>":"",c=v;for(let i=0;i<s;i++){const s=t[i];let a,u,d=-1,f=0;for(;f<s.length&&(c.lastIndex=f,u=c.exec(s),null!==u);)f=c.lastIndex,c===v?"!--"===u[1]?c=_:void 0!==u[1]?c=m:void 0!==u[2]?(y.test(u[2])&&(n=RegExp("</"+u[2],"g")),c=p):void 0!==u[3]&&(c=p):c===p?">"===u[0]?(c=n??v,d=-1):void 0===u[1]?d=-2:(d=c.lastIndex-u[2].length,a=u[1],c=void 0===u[3]?p:'"'===u[3]?$:g):c===$||c===g?c=p:c===_||c===m?c=v:(c=p,n=void 0);const x=c===p&&t[i+1].startsWith("/>")?" ":"";l+=c===v?s+r$2:d>=0?(e.push(a),s.slice(0,d)+h+s.slice(d)+o$2+x):s+o$2+(-2===d?i:x);}return [V(t,l+(t[s]||"<?>")+(2===i?"</svg>":3===i?"</math>":"")),e]};class S{constructor({strings:t,_$litType$:i},e){let r;this.parts=[];let l=0,a=0;const u=t.length-1,d=this.parts,[f,v]=N(t,i);if(this.el=S.createElement(f,e),P.currentNode=this.el.content,2===i||3===i){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes);}for(;null!==(r=P.nextNode())&&d.length<u;){if(1===r.nodeType){if(r.hasAttributes())for(const t of r.getAttributeNames())if(t.endsWith(h)){const i=v[a++],s=r.getAttribute(t).split(o$2),e=/([.?@])?(.*)/.exec(i);d.push({type:1,index:l,name:e[2],strings:s,ctor:"."===e[1]?I:"?"===e[1]?L:"@"===e[1]?z:H}),r.removeAttribute(t);}else t.startsWith(o$2)&&(d.push({type:6,index:l}),r.removeAttribute(t));if(y.test(r.tagName)){const t=r.textContent.split(o$2),i=t.length-1;if(i>0){r.textContent=s$1?s$1.emptyScript:"";for(let s=0;s<i;s++)r.append(t[s],c()),P.nextNode(),d.push({type:2,index:++l});r.append(t[i],c());}}}else if(8===r.nodeType)if(r.data===n$1)d.push({type:2,index:l});else {let t=-1;for(;-1!==(t=r.data.indexOf(o$2,t+1));)d.push({type:7,index:l}),t+=o$2.length-1;}l++;}}static createElement(t,i){const s=l.createElement("template");return s.innerHTML=t,s}}function M(t,i,s=t,e){if(i===E)return i;let h=void 0!==e?s._$Co?.[e]:s._$Cl;const o=a(i)?void 0:i._$litDirective$;return h?.constructor!==o&&(h?._$AO?.(false),void 0===o?h=void 0:(h=new o(t),h._$AT(t,s,e)),void 0!==e?(s._$Co??=[])[e]=h:s._$Cl=h),void 0!==h&&(i=M(t,h._$AS(t,i.values),h,e)),i}class R{constructor(t,i){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=i;}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:i},parts:s}=this._$AD,e=(t?.creationScope??l).importNode(i,true);P.currentNode=e;let h=P.nextNode(),o=0,n=0,r=s[0];for(;void 0!==r;){if(o===r.index){let i;2===r.type?i=new k(h,h.nextSibling,this,t):1===r.type?i=new r.ctor(h,r.name,r.strings,this,t):6===r.type&&(i=new Z(h,this,t)),this._$AV.push(i),r=s[++n];}o!==r?.index&&(h=P.nextNode(),o++);}return P.currentNode=l,e}p(t){let i=0;for(const s of this._$AV) void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,i),i+=s.strings.length-2):s._$AI(t[i])),i++;}}class k{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,i,s,e){this.type=2,this._$AH=A,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=s,this.options=e,this._$Cv=e?.isConnected??true;}get parentNode(){let t=this._$AA.parentNode;const i=this._$AM;return void 0!==i&&11===t?.nodeType&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=M(this,t,i),a(t)?t===A||null==t||""===t?(this._$AH!==A&&this._$AR(),this._$AH=A):t!==this._$AH&&t!==E&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):d(t)?this.k(t):this._(t);}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t));}_(t){this._$AH!==A&&a(this._$AH)?this._$AA.nextSibling.data=t:this.T(l.createTextNode(t)),this._$AH=t;}$(t){const{values:i,_$litType$:s}=t,e="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=S.createElement(V(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===e)this._$AH.p(i);else {const t=new R(e,this),s=t.u(this.options);t.p(i),this.T(s),this._$AH=t;}}_$AC(t){let i=C.get(t.strings);return void 0===i&&C.set(t.strings,i=new S(t)),i}k(t){u(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let s,e=0;for(const h of t)e===i.length?i.push(s=new k(this.O(c()),this.O(c()),this,this.options)):s=i[e],s._$AI(h),e++;e<i.length&&(this._$AR(s&&s._$AB.nextSibling,e),i.length=e);}_$AR(t=this._$AA.nextSibling,s){for(this._$AP?.(false,true,s);t!==this._$AB;){const s=i$1(t).nextSibling;i$1(t).remove(),t=s;}}setConnected(t){ void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t));}}class H{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,i,s,e,h){this.type=1,this._$AH=A,this._$AN=void 0,this.element=t,this.name=i,this._$AM=e,this.options=h,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=A;}_$AI(t,i=this,s,e){const h=this.strings;let o=false;if(void 0===h)t=M(this,t,i,0),o=!a(t)||t!==this._$AH&&t!==E,o&&(this._$AH=t);else {const e=t;let n,r;for(t=h[0],n=0;n<h.length-1;n++)r=M(this,e[s+n],i,n),r===E&&(r=this._$AH[n]),o||=!a(r)||r!==this._$AH[n],r===A?t=A:t!==A&&(t+=(r??"")+h[n+1]),this._$AH[n]=r;}o&&!e&&this.j(t);}j(t){t===A?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"");}}class I extends H{constructor(){super(...arguments),this.type=3;}j(t){this.element[this.name]=t===A?void 0:t;}}class L extends H{constructor(){super(...arguments),this.type=4;}j(t){this.element.toggleAttribute(this.name,!!t&&t!==A);}}class z extends H{constructor(t,i,s,e,h){super(t,i,s,e,h),this.type=5;}_$AI(t,i=this){if((t=M(this,t,i,0)??A)===E)return;const s=this._$AH,e=t===A&&s!==A||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,h=t!==A&&(s===A||e);e&&this.element.removeEventListener(this.name,this,s),h&&this.element.addEventListener(this.name,this,t),this._$AH=t;}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t);}}class Z{constructor(t,i,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=s;}get _$AU(){return this._$AM._$AU}_$AI(t){M(this,t);}}const B=t$1.litHtmlPolyfillSupport;B?.(S,k),(t$1.litHtmlVersions??=[]).push("3.3.3");const D=(t,i,s)=>{const e=s?.renderBefore??i;let h=e._$litPart$;if(void 0===h){const t=s?.renderBefore??null;e._$litPart$=h=new k(i.insertBefore(c(),t),t,void 0,s??{});}return h._$AI(t),h};

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const s=globalThis;class i extends y$1{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0;}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const r=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=D(r,this.renderRoot,this.renderOptions);}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(true);}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(false);}render(){return E}}i._$litElement$=true,i["finalized"]=true,s.litElementHydrateSupport?.({LitElement:i});const o$1=s.litElementPolyfillSupport;o$1?.({LitElement:i});(s.litElementVersions??=[]).push("4.2.2");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t=t=>(e,o)=>{ void 0!==o?o.addInitializer(()=>{customElements.define(t,e);}):customElements.define(t,e);};

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const o={attribute:true,type:String,converter:u$1,reflect:false,hasChanged:f$1},r$1=(t=o,e,r)=>{const{kind:n,metadata:i}=r;let s=globalThis.litPropertyMetadata.get(i);if(void 0===s&&globalThis.litPropertyMetadata.set(i,s=new Map),"setter"===n&&((t=Object.create(t)).wrapped=true),s.set(r.name,t),"accessor"===n){const{name:o}=r;return {set(r){const n=e.get.call(this);e.set.call(this,r),this.requestUpdate(o,n,t,true,r);},init(e){return void 0!==e&&this.C(o,void 0,t,e),e}}}if("setter"===n){const{name:o}=r;return function(r){const n=this[o];e.call(this,r),this.requestUpdate(o,n,t,true,r);}}throw Error("Unsupported decorator location: "+n)};function n(t){return (e,o)=>"object"==typeof o?r$1(t,e,o):((t,e,o)=>{const r=e.hasOwnProperty(o);return e.constructor.createProperty(o,t),r?Object.getOwnPropertyDescriptor(e,o):void 0})(t,e,o)}

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function r(r){return n({...r,state:true,attribute:false})}

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const e$1=(e,t,c)=>(c.configurable=true,c.enumerable=true,Reflect.decorate&&"object"!=typeof t&&Object.defineProperty(e,t,c),c);

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function e(e,r){return (n,s,i)=>{const o=t=>t.renderRoot?.querySelector(e)??null;return e$1(n,s,{get(){return o(this)}})}}

const STATUS_META = {
    created: { icon: "mdi:package-variant-closed", color: "var(--disabled-text-color)" },
    taken_in_charge: { icon: "mdi:hand-back-right-outline", color: "var(--info-color)" },
    in_transit: { icon: "mdi:truck-fast-outline", color: "var(--info-color)" },
    at_sorting_center: { icon: "mdi:warehouse", color: "var(--info-color)" },
    out_for_delivery: { icon: "mdi:truck-delivery-outline", color: "var(--info-color)" },
    delivered: { icon: "mdi:package-variant-closed-check", color: "var(--success-color)" },
    delayed: { icon: "mdi:clock-alert-outline", color: "var(--warning-color)" },
    incident: { icon: "mdi:alert-circle-outline", color: "var(--error-color)" },
    returned_to_sender: { icon: "mdi:keyboard-return", color: "var(--error-color)" },
};
const DEFAULT_STATUS_META = {
    icon: "mdi:package-variant",
    color: "var(--disabled-text-color)",
};
// Overrides STATUS_META when a parcel's last refresh failed (e.g. a
// rejected carrier API key) — takes priority over the delivery status,
// which is stale until the next successful refresh.
const ERROR_STATUS_META = {
    icon: "mdi:alert-circle",
    color: "var(--error-color)",
};
const GLOBAL_COUNTER_ICONS = {
    parcels_active: "mdi:truck-fast-outline",
    parcels_delivered: "mdi:package-variant-closed-check",
    parcels_waiting: "mdi:package-variant-closed",
    parcels_today: "mdi:calendar-check-outline",
    parcels_late: "mdi:clock-alert-outline",
};
const GLOBAL_COUNTER_COLORS = {
    parcels_active: "var(--info-color)",
    parcels_delivered: "var(--success-color)",
    parcels_waiting: "var(--disabled-text-color)",
    parcels_today: "var(--success-color)",
    parcels_late: "var(--warning-color)",
};
const GLOBAL_COUNTER_TRANSLATION_KEYS = Object.keys(GLOBAL_COUNTER_ICONS);
function globalCounterIcon(translationKey) {
    return GLOBAL_COUNTER_ICONS[translationKey] ?? "mdi:counter";
}
function globalCounterColor(translationKey) {
    return GLOBAL_COUNTER_COLORS[translationKey] ?? "var(--disabled-text-color)";
}

// Mirrors ALL_CARRIERS / CARRIER_LABELS in the parcel_tracker integration's const.py.
const CARRIERS = [
    { value: "laposte", label: "La Poste" },
    { value: "fedex", label: "FedEx" },
    { value: "dhl", label: "DHL" },
    { value: "ups", label: "UPS" },
    { value: "mondial_relay", label: "Mondial Relay" },
    { value: "postnord", label: "PostNord" },
    { value: "dpd", label: "DPD" },
];

const DOMAIN = "parcel_tracker";
let ParcelTrackerUpsertDialog = class ParcelTrackerUpsertDialog extends i {
    constructor() {
        super(...arguments);
        this._open = false;
        this._parcelId = null;
        this._trackingNumber = "";
        this._carrier = CARRIERS[0].value;
        this._name = "";
        this._notes = "";
        this._notifyTarget = "";
        this._submitting = false;
        this._error = null;
        this._availableCarriers = CARRIERS;
        this._notifyTargets = [];
        this._originalTrackingNumber = "";
        this._originalCarrier = CARRIERS[0].value;
    }
    openForAdd() {
        this._parcelId = null;
        this._trackingNumber = "";
        this._originalTrackingNumber = "";
        this._carrier = CARRIERS[0].value;
        this._originalCarrier = CARRIERS[0].value;
        this._name = "";
        this._notes = "";
        this._notifyTarget = "";
        this._error = null;
        this._availableCarriers = CARRIERS;
        this._notifyTargets = [];
        this._open = true;
        void this._loadAvailableCarriers();
        void this._loadNotifyTargets();
    }
    openForEdit(target) {
        this._parcelId = target.parcelId;
        this._trackingNumber = target.trackingNumber;
        this._originalTrackingNumber = target.trackingNumber;
        this._carrier = target.carrier;
        this._originalCarrier = target.carrier;
        this._name = target.name;
        this._notes = target.notes;
        this._notifyTarget = target.notifyTarget;
        this._error = null;
        this._availableCarriers = CARRIERS;
        this._notifyTargets = [];
        this._open = true;
        void this._loadAvailableCarriers();
        void this._loadNotifyTargets();
    }
    async _loadAvailableCarriers() {
        if (!this.hass)
            return;
        const openedFor = this._parcelId;
        let configured = CARRIERS.map((carrier) => carrier.value);
        try {
            const result = await this.hass.callService(DOMAIN, "get_configured_carriers", {}, undefined, true, true);
            if (result?.response?.carriers)
                configured = result.response.carriers;
        }
        catch (err) {
            console.error("parcel_tracker.get_configured_carriers failed", err);
        }
        // The dialog may have been closed and reopened for a different parcel
        // (or for add) while this call was in flight.
        if (!this._open || this._parcelId !== openedFor)
            return;
        const carriers = CARRIERS.filter((carrier) => configured.includes(carrier.value));
        if (this._parcelId !== null && !carriers.some((carrier) => carrier.value === this._carrier)) {
            // Editing a parcel whose carrier's credentials were since removed must
            // still offer that carrier, so saving unrelated fields doesn't force
            // an unwanted carrier change (mirrors
            // ParcelTrackerOptionsFlow.async_step_edit_parcel in the backend).
            const current = CARRIERS.find((carrier) => carrier.value === this._carrier);
            if (current)
                carriers.unshift(current);
        }
        else if (this._parcelId === null &&
            carriers.length > 0 &&
            !carriers.some((carrier) => carrier.value === this._carrier)) {
            this._carrier = carriers[0].value;
        }
        this._availableCarriers = carriers.length > 0 ? carriers : CARRIERS;
    }
    async _loadNotifyTargets() {
        if (!this.hass)
            return;
        const openedFor = this._parcelId;
        let targets = [];
        try {
            const result = await this.hass.callService(DOMAIN, "get_notify_targets", {}, undefined, true, true);
            if (result?.response?.targets)
                targets = result.response.targets;
        }
        catch (err) {
            console.error("parcel_tracker.get_notify_targets failed", err);
        }
        // The dialog may have been closed and reopened for a different parcel
        // while this call was in flight.
        if (!this._open || this._parcelId !== openedFor)
            return;
        // A parcel's stored notify_target may no longer be a valid target (its
        // entity/service was since removed) — keep it selectable so saving
        // unrelated fields doesn't silently clear it.
        if (this._notifyTarget && !targets.includes(this._notifyTarget)) {
            targets = [this._notifyTarget, ...targets];
        }
        this._notifyTargets = targets;
    }
    _close() {
        this._open = false;
        this._submitting = false;
    }
    async _submit() {
        if (this._submitting)
            return;
        if (!this._trackingNumber.trim()) {
            this._error = "Le numéro de suivi est requis.";
            return;
        }
        if (!this.hass)
            return;
        this._submitting = true;
        this._error = null;
        const isEdit = this._parcelId !== null;
        // Only add/update calls that actually (re-)look up the carrier can
        // surface a fresh error; a pure name/notes edit mustn't resurface a
        // stale last_error left over from an unrelated background refresh.
        const willRefresh = !isEdit ||
            this._trackingNumber !== this._originalTrackingNumber ||
            this._carrier !== this._originalCarrier;
        try {
            const result = await this.hass.callService(DOMAIN, isEdit ? "update" : "add", isEdit
                ? {
                    parcel_id: this._parcelId,
                    tracking_number: this._trackingNumber,
                    carrier: this._carrier,
                    name: this._name,
                    notes: this._notes,
                    notify_target: this._notifyTarget,
                }
                : {
                    tracking_number: this._trackingNumber,
                    carrier: this._carrier,
                    name: this._name,
                    notes: this._notes,
                    notify_target: this._notifyTarget,
                }, undefined, true, true);
            const error = willRefresh ? result?.response?.error : null;
            if (error) {
                this._submitting = false;
                this._error = error;
                return;
            }
        }
        catch (err) {
            this._submitting = false;
            this._error = err instanceof Error ? err.message : String(err);
            return;
        }
        this._close();
    }
    _renderField(id, label, value, onInput, required = false) {
        return b `<div class="field">
      <label for=${id}>${label}${required ? " *" : ""}</label>
      <input
        id=${id}
        .value=${value}
        ?required=${required}
        @input=${(ev) => onInput(ev.target.value)}
      />
    </div>`;
    }
    render() {
        const isEdit = this._parcelId !== null;
        return b `<ha-dialog
      .open=${this._open}
      .heading=${isEdit ? "Modifier le colis" : "Ajouter un colis"}
      @closed=${() => this._close()}
    >
      <div class="fields">
        ${this._renderField("tracking_number", "Numéro de suivi", this._trackingNumber, (v) => (this._trackingNumber = v), true)}
        <div class="field">
          <label for="carrier">Transporteur</label>
          <select
            id="carrier"
            .value=${this._carrier}
            @change=${(ev) => (this._carrier = ev.target.value)}
          >
            ${this._availableCarriers.map((carrier) => b `<option value=${carrier.value} ?selected=${carrier.value === this._carrier}>
                  ${carrier.label}
                </option>`)}
          </select>
        </div>
        ${this._renderField("name", "Nom", this._name, (v) => (this._name = v))}
        ${this._renderField("notes", "Notes", this._notes, (v) => (this._notes = v))}
        <div class="field">
          <label for="notify_target">Notifier à chaque changement de statut</label>
          <select
            id="notify_target"
            .value=${this._notifyTarget}
            @change=${(ev) => (this._notifyTarget = ev.target.value)}
          >
            <option value="" ?selected=${this._notifyTarget === ""}>Aucune notification</option>
            ${this._notifyTargets.map((target) => b `<option value=${target} ?selected=${target === this._notifyTarget}>
                  ${target}
                </option>`)}
          </select>
        </div>
        ${this._error ? b `<p class="error">${this._error}</p>` : A}
      </div>
      <ha-dialog-footer slot="footer">
        <button slot="secondaryAction" ?disabled=${this._submitting} @click=${() => this._close()}>
          Annuler
        </button>
        <button slot="primaryAction" ?disabled=${this._submitting} @click=${() => this._submit()}>
          ${this._submitting ? "…" : isEdit ? "Enregistrer" : "Ajouter"}
        </button>
      </ha-dialog-footer>
    </ha-dialog>`;
    }
};
ParcelTrackerUpsertDialog.styles = i$3 `
    .fields {
      display: flex;
      flex-direction: column;
      gap: 12px;
      min-width: 280px;
    }

    .field {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    label {
      font-size: 0.85em;
      color: var(--secondary-text-color);
    }

    input,
    select {
      font: inherit;
      color: var(--primary-text-color);
      background: var(--card-background-color, #fff);
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 4px;
      padding: 8px;
    }

    .error {
      color: var(--error-color);
      margin: 0;
    }

    button[slot="primaryAction"] {
      color: var(--primary-color);
    }

    button {
      font: inherit;
      background: none;
      border: none;
      padding: 8px 12px;
      cursor: pointer;
    }

    button[disabled] {
      opacity: 0.5;
      cursor: default;
    }
  `;
__decorate([
    n({ attribute: false })
], ParcelTrackerUpsertDialog.prototype, "hass", void 0);
__decorate([
    r()
], ParcelTrackerUpsertDialog.prototype, "_open", void 0);
__decorate([
    r()
], ParcelTrackerUpsertDialog.prototype, "_parcelId", void 0);
__decorate([
    r()
], ParcelTrackerUpsertDialog.prototype, "_trackingNumber", void 0);
__decorate([
    r()
], ParcelTrackerUpsertDialog.prototype, "_carrier", void 0);
__decorate([
    r()
], ParcelTrackerUpsertDialog.prototype, "_name", void 0);
__decorate([
    r()
], ParcelTrackerUpsertDialog.prototype, "_notes", void 0);
__decorate([
    r()
], ParcelTrackerUpsertDialog.prototype, "_notifyTarget", void 0);
__decorate([
    r()
], ParcelTrackerUpsertDialog.prototype, "_submitting", void 0);
__decorate([
    r()
], ParcelTrackerUpsertDialog.prototype, "_error", void 0);
__decorate([
    r()
], ParcelTrackerUpsertDialog.prototype, "_availableCarriers", void 0);
__decorate([
    r()
], ParcelTrackerUpsertDialog.prototype, "_notifyTargets", void 0);
ParcelTrackerUpsertDialog = __decorate([
    t("parcel-tracker-upsert-dialog")
], ParcelTrackerUpsertDialog);

const PLATFORM = "parcel_tracker";
const PARCEL_TRANSLATION_KEY = "parcel";
function fireEvent(target, type, detail) {
    target.dispatchEvent(new CustomEvent(type, { detail, bubbles: true, composed: true }));
}
const dateFormatter = new Intl.DateTimeFormat(undefined, { dateStyle: "medium" });
const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
});
function formatDate(value) {
    if (!value)
        return null;
    const date = new Date(value);
    if (Number.isNaN(date.getTime()))
        return null;
    return dateFormatter.format(date);
}
function formatDateTime(value) {
    if (!value)
        return null;
    const date = new Date(value);
    if (Number.isNaN(date.getTime()))
        return null;
    return dateTimeFormatter.format(date);
}
// Parcel entities aren't `has_entity_name`, but HA still prefixes the hub
// device's name onto their friendly_name. Strip it back off for display —
// the parcel's own name (e.g. "Leroy") is more useful here than "Parcel
// Tracker Leroy".
const DEVICE_NAME_PREFIX = "Parcel Tracker ";
function stripDevicePrefix(name) {
    return name.startsWith(DEVICE_NAME_PREFIX) ? name.slice(DEVICE_NAME_PREFIX.length) : name;
}
let ParcelTrackerCard = class ParcelTrackerCard extends i {
    constructor() {
        super(...arguments);
        this._openMenuEntityId = null;
        this._pendingDelete = null;
        this._deleteSubmitting = false;
        this._deleteError = null;
        this._historyInfo = null;
    }
    setConfig(config) {
        this._config = config;
    }
    get _editable() {
        return this._config?.editable ?? true;
    }
    static getStubConfig() {
        return { type: "custom:parcel-tracker-card" };
    }
    getCardSize() {
        return 1 + this._parcelEntities().length;
    }
    _entriesByTranslationKey(keys) {
        const hass = this.hass;
        if (!hass)
            return [];
        const result = [];
        for (const entry of Object.values(hass.entities)) {
            if (entry.platform !== PLATFORM)
                continue;
            if (keys && !keys.has(entry.translation_key ?? ""))
                continue;
            const stateObj = hass.states[entry.entity_id];
            if (stateObj)
                result.push(stateObj);
        }
        return result;
    }
    _globalCounters() {
        const keys = new Set(GLOBAL_COUNTER_TRANSLATION_KEYS);
        return this._entriesByTranslationKey(keys).sort((a, b) => GLOBAL_COUNTER_TRANSLATION_KEYS.indexOf(this._translationKey(a)) -
            GLOBAL_COUNTER_TRANSLATION_KEYS.indexOf(this._translationKey(b)));
    }
    _translationKey(stateObj) {
        return this.hass?.entities[stateObj.entity_id]?.translation_key ?? "";
    }
    _parcelEntities() {
        const parcels = this._entriesByTranslationKey(new Set([PARCEL_TRANSLATION_KEY]));
        return parcels.sort((a, b) => {
            const aDelivered = a.state === "delivered";
            const bDelivered = b.state === "delivered";
            if (aDelivered !== bDelivered)
                return aDelivered ? 1 : -1;
            const aEta = a.attributes.estimated_delivery;
            const bEta = b.attributes.estimated_delivery;
            if (aEta && bEta && aEta !== bEta)
                return aEta < bEta ? -1 : 1;
            if (aEta && !bEta)
                return -1;
            if (!aEta && bEta)
                return 1;
            const aName = String(a.attributes.friendly_name ?? "");
            const bName = String(b.attributes.friendly_name ?? "");
            return aName.localeCompare(bName);
        });
    }
    _formatState(stateObj) {
        if (this.hass?.formatEntityState) {
            return this.hass.formatEntityState(stateObj);
        }
        return stateObj.state;
    }
    _openMoreInfo(entityId) {
        fireEvent(this, "hass-more-info", { entityId });
    }
    _parcelId(stateObj) {
        // hass.entities is the lightweight entity-registry-for-display object;
        // it doesn't carry unique_id, so parcel_id has to come from the state
        // attribute the integration exposes instead.
        return stateObj.attributes.parcel_id ?? "";
    }
    _historyNewestFirst(attrs) {
        const history = attrs.history;
        if (!Array.isArray(history) || history.length === 0)
            return [];
        return [...history].reverse();
    }
    _showHistoryInfo(name, entries) {
        this._historyInfo = { name, entries };
    }
    _toggleMenu(entityId) {
        this._openMenuEntityId = this._openMenuEntityId === entityId ? null : entityId;
    }
    _openAdd() {
        this._openMenuEntityId = null;
        this._upsertDialog?.openForAdd();
    }
    _openEdit(stateObj) {
        const attrs = stateObj.attributes;
        // display_name (and thus friendly_name) falls back to the tracking
        // number when the parcel has no explicit name — an empty name can't be
        // told apart from a name that happens to equal the tracking number, but
        // that's an acceptable edge case for prefilling the edit form.
        const strippedName = stripDevicePrefix(String(stateObj.attributes.friendly_name ?? ""));
        const name = strippedName === attrs.tracking_number ? "" : strippedName;
        this._openMenuEntityId = null;
        this._upsertDialog?.openForEdit({
            parcelId: this._parcelId(stateObj),
            trackingNumber: attrs.tracking_number,
            carrier: attrs.carrier,
            name,
            notes: attrs.notes,
            notifyTarget: attrs.notify_target,
        });
    }
    async _archive(stateObj) {
        this._openMenuEntityId = null;
        try {
            await this.hass?.callService(PLATFORM, "archive", {
                parcel_id: this._parcelId(stateObj),
            });
        }
        catch (err) {
            console.error("parcel_tracker.archive failed", err);
        }
    }
    _confirmDelete(stateObj) {
        this._openMenuEntityId = null;
        const name = stripDevicePrefix(String(stateObj.attributes.friendly_name ?? stateObj.entity_id));
        this._deleteError = null;
        this._pendingDelete = {
            entityId: stateObj.entity_id,
            parcelId: this._parcelId(stateObj),
            name,
        };
    }
    async _confirmedDelete() {
        const pending = this._pendingDelete;
        if (!pending || this._deleteSubmitting)
            return;
        this._deleteSubmitting = true;
        this._deleteError = null;
        try {
            await this.hass?.callService(PLATFORM, "remove", { parcel_id: pending.parcelId });
            this._pendingDelete = null;
        }
        catch (err) {
            console.error("parcel_tracker.remove failed", err);
            this._deleteError = err instanceof Error ? err.message : String(err);
        }
        finally {
            this._deleteSubmitting = false;
        }
    }
    async _refresh() {
        try {
            await this.hass?.callService(PLATFORM, "refresh", {});
        }
        catch (err) {
            console.error("parcel_tracker.refresh failed", err);
        }
    }
    _counterLabel(stateObj) {
        const translationKey = this._translationKey(stateObj);
        const localized = this.hass?.localize?.(`component.${PLATFORM}.entity.sensor.${translationKey}.name`);
        return localized || String(stateObj.attributes.friendly_name ?? stateObj.entity_id);
    }
    _renderCounters() {
        const counters = this._globalCounters();
        if (counters.length === 0)
            return A;
        return b `<div class="counters">
      ${counters.map((stateObj) => {
            const color = globalCounterColor(this._translationKey(stateObj));
            return b `<div class="counter-tile">
          <div class="counter-icon" style="background: ${color}">
            <ha-icon icon=${globalCounterIcon(this._translationKey(stateObj))}></ha-icon>
          </div>
          <span class="counter-value">${stateObj.state}</span>
          <span class="counter-label">${this._counterLabel(stateObj)}</span>
        </div>`;
        })}
    </div>`;
    }
    _renderParcelRow(stateObj) {
        const attrs = stateObj.attributes;
        const hasError = Boolean(attrs.last_error);
        const meta = hasError ? ERROR_STATUS_META : STATUS_META[stateObj.state] ?? DEFAULT_STATUS_META;
        const name = stripDevicePrefix(String(stateObj.attributes.friendly_name ?? stateObj.entity_id));
        let secondary = attrs.carrier;
        if (hasError) {
            secondary += ` · ${attrs.last_error}`;
        }
        else if (stateObj.state === "delivered") {
            const delivered = formatDate(attrs.last_update);
            if (delivered)
                secondary += ` · Livré le ${delivered}`;
        }
        else {
            const eta = formatDate(attrs.estimated_delivery);
            if (eta) {
                secondary += ` · Livraison estimée le ${eta}`;
            }
            else if (attrs.days_since_shipping !== null) {
                secondary += ` · Depuis ${attrs.days_since_shipping} j.`;
            }
        }
        const menuOpen = this._openMenuEntityId === stateObj.entity_id;
        const historyEntries = this._historyNewestFirst(attrs);
        return b `<div class="parcel">
      <div
        class="parcel-row"
        role="button"
        tabindex="0"
        @click=${() => this._openMoreInfo(stateObj.entity_id)}
        @keydown=${(ev) => {
            if (ev.key === "Enter" || ev.key === " ")
                this._openMoreInfo(stateObj.entity_id);
        }}
      >
        <ha-icon icon=${meta.icon} style="color: ${meta.color}"></ha-icon>
        <div class="parcel-info">
          <span class="parcel-name">${name}</span>
          <span class="parcel-secondary" title=${hasError ? secondary : A}>${secondary}</span>
        </div>
        <span class="parcel-status" style="background: ${meta.color}">${this._formatState(stateObj)}</span>
        ${historyEntries.length > 0
            ? b `<button
              class="icon-button info-button"
              aria-label="Historique"
              title="Historique"
              @click=${(ev) => {
                ev.stopPropagation();
                this._showHistoryInfo(name, historyEntries);
            }}
            >
              <ha-icon icon="mdi:information-outline"></ha-icon>
            </button>`
            : A}
        ${this._editable
            ? b `<button
              class="icon-button"
              aria-label="Actions"
              @click=${(ev) => {
                ev.stopPropagation();
                this._toggleMenu(stateObj.entity_id);
            }}
            >
              <ha-icon icon="mdi:dots-vertical"></ha-icon>
            </button>`
            : A}
      </div>
      ${menuOpen ? this._renderRowActions(stateObj) : A}
    </div>`;
    }
    _renderRowActions(stateObj) {
        return b `<div class="parcel-actions">
      <button
        @click=${(ev) => {
            ev.stopPropagation();
            this._openEdit(stateObj);
        }}
      >
        <ha-icon icon="mdi:pencil-outline"></ha-icon>
        Modifier
      </button>
      ${stateObj.state === "delivered"
            ? b `<button
            @click=${(ev) => {
                ev.stopPropagation();
                this._archive(stateObj);
            }}
          >
            <ha-icon icon="mdi:archive-outline"></ha-icon>
            Archiver
          </button>`
            : A}
      <button
        class="danger"
        @click=${(ev) => {
            ev.stopPropagation();
            this._confirmDelete(stateObj);
        }}
      >
        <ha-icon icon="mdi:delete-outline"></ha-icon>
        Supprimer
      </button>
    </div>`;
    }
    render() {
        if (!this.hass || !this._config)
            return A;
        const parcels = this._parcelEntities();
        const editable = this._editable;
        return b `<ha-card>
      <div class="card-header">
        <div class="name">${this._config.title ?? "Parcel Tracker"}</div>
        ${editable
            ? b `<div class="header-actions">
              <button class="icon-button" title="Rafraîchir" @click=${() => this._refresh()}>
                <ha-icon icon="mdi:refresh"></ha-icon>
              </button>
              <button class="icon-button" title="Ajouter un colis" @click=${() => this._openAdd()}>
                <ha-icon icon="mdi:plus"></ha-icon>
              </button>
            </div>`
            : A}
      </div>
      <div class="card-content">
        ${this._renderCounters()}
        ${parcels.length === 0
            ? b `<div class="empty">
              ${editable
                ? b `<button class="link-button" @click=${() => this._openAdd()}>
                    Aucun colis suivi. Ajouter un colis.
                  </button>`
                : "Aucun colis suivi."}
            </div>`
            : b `<div class="parcels">${parcels.map((p) => this._renderParcelRow(p))}</div>`}
      </div>
    </ha-card>
    ${editable ? b `<parcel-tracker-upsert-dialog .hass=${this.hass}></parcel-tracker-upsert-dialog>` : A}
    ${this._renderDeleteConfirm()}
    ${this._renderHistoryInfo()}`;
    }
    _renderHistoryInfo() {
        const info = this._historyInfo;
        if (!info)
            return A;
        return b `<ha-dialog
      open
      .heading=${info.name}
      @closed=${() => {
            this._historyInfo = null;
        }}
    >
      <div class="history-list">
        ${info.entries.map((entry) => {
            const date = formatDateTime(entry.date);
            return b `<div class="history-entry">
            <p>${entry.label ?? "Aucun libellé disponible."}</p>
            ${date ? b `<p class="history-meta">${date}</p>` : A}
            ${entry.location ? b `<p class="history-meta">${entry.location}</p>` : A}
          </div>`;
        })}
      </div>
      <ha-dialog-footer slot="footer">
        <button slot="primaryAction" @click=${() => (this._historyInfo = null)}>Fermer</button>
      </ha-dialog-footer>
    </ha-dialog>`;
    }
    _renderDeleteConfirm() {
        if (!this._pendingDelete)
            return A;
        return b `<ha-dialog
      open
      .heading=${"Supprimer ce colis ?"}
      @closed=${() => {
            this._pendingDelete = null;
            this._deleteError = null;
        }}
    >
      <p>
        Supprimer définitivement « ${this._pendingDelete.name} » ? Cette action efface aussi son
        historique et ne peut pas être annulée.
      </p>
      ${this._deleteError ? b `<p class="error">${this._deleteError}</p>` : A}
      <ha-dialog-footer slot="footer">
        <button
          slot="secondaryAction"
          ?disabled=${this._deleteSubmitting}
          @click=${() => (this._pendingDelete = null)}
        >
          Annuler
        </button>
        <button
          class="danger"
          slot="primaryAction"
          ?disabled=${this._deleteSubmitting}
          @click=${() => this._confirmedDelete()}
        >
          ${this._deleteSubmitting ? "…" : "Supprimer"}
        </button>
      </ha-dialog-footer>
    </ha-dialog>`;
    }
};
ParcelTrackerCard.styles = i$3 `
    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 16px 0;
      font-size: 1.2em;
      font-weight: 400;
      color: var(--ha-card-header-color, var(--primary-text-color));
    }

    .header-actions {
      display: flex;
      gap: 4px;
    }

    .icon-button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border: none;
      background: none;
      color: var(--secondary-text-color);
      cursor: pointer;
    }

    .icon-button:hover {
      background: var(--secondary-background-color);
      color: var(--primary-text-color);
    }

    .link-button {
      font: inherit;
      background: none;
      border: none;
      padding: 0;
      color: var(--primary-color);
      cursor: pointer;
      text-align: left;
    }

    .card-content {
      padding: 0 0 8px;
    }

    .counters {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(90px, 1fr));
      gap: 8px;
      padding: 12px 16px 16px;
    }

    .counter-tile {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      padding: 12px 4px;
      border-radius: 12px;
      background: var(--secondary-background-color);
      text-align: center;
    }

    .counter-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      color: var(--card-background-color, #fff);
    }

    .counter-icon ha-icon {
      --mdc-icon-size: 18px;
    }

    .counter-value {
      font-size: 1.3em;
      font-weight: 600;
      color: var(--primary-text-color);
    }

    .counter-label {
      font-size: 0.75em;
      color: var(--secondary-text-color);
      line-height: 1.2;
    }

    .empty {
      padding: 8px 16px 16px;
      color: var(--secondary-text-color);
    }

    .parcels {
      display: flex;
      flex-direction: column;
    }

    .parcel-row {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 8px 16px;
      cursor: pointer;
    }

    .parcel-row:hover {
      background: var(--secondary-background-color);
    }

    .parcel-info {
      display: flex;
      flex-direction: column;
      flex: 1;
      min-width: 0;
    }

    .parcel-name {
      font-weight: 500;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .parcel-secondary {
      font-size: 0.85em;
      color: var(--secondary-text-color);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .parcel-status {
      font-size: 0.8em;
      font-weight: 500;
      white-space: nowrap;
      color: var(--card-background-color, #fff);
      padding: 3px 10px;
      border-radius: 999px;
    }

    .info-button {
      width: 32px;
      height: 32px;
      flex: none;
    }

    .info-button ha-icon {
      --mdc-icon-size: 20px;
    }

    .history-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
      max-height: 60vh;
      overflow-y: auto;
      min-width: 240px;
    }

    .history-entry {
      padding-bottom: 12px;
      border-bottom: 1px solid var(--divider-color, #ccc);
    }

    .history-entry:last-child {
      padding-bottom: 0;
      border-bottom: none;
    }

    .history-entry p {
      margin: 0;
    }

    ha-dialog p.history-meta {
      color: var(--secondary-text-color);
      font-size: 0.85em;
      margin-top: 4px;
    }

    .parcel-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      padding: 0 16px 8px 56px;
    }

    .parcel-actions button {
      display: flex;
      align-items: center;
      gap: 6px;
      font: inherit;
      font-size: 0.85em;
      background: var(--secondary-background-color);
      color: var(--primary-text-color);
      border: none;
      border-radius: 8px;
      padding: 6px 10px;
      cursor: pointer;
    }

    .parcel-actions button ha-icon {
      --mdc-icon-size: 16px;
    }

    ha-dialog button {
      font: inherit;
      background: none;
      border: none;
      padding: 8px 12px;
      cursor: pointer;
      color: var(--primary-color);
    }

    .parcel-actions button.danger,
    ha-dialog button.danger {
      color: var(--error-color);
    }

    ha-dialog p.error {
      color: var(--error-color);
    }
  `;
__decorate([
    n({ attribute: false })
], ParcelTrackerCard.prototype, "hass", void 0);
__decorate([
    r()
], ParcelTrackerCard.prototype, "_config", void 0);
__decorate([
    r()
], ParcelTrackerCard.prototype, "_openMenuEntityId", void 0);
__decorate([
    r()
], ParcelTrackerCard.prototype, "_pendingDelete", void 0);
__decorate([
    r()
], ParcelTrackerCard.prototype, "_deleteSubmitting", void 0);
__decorate([
    r()
], ParcelTrackerCard.prototype, "_deleteError", void 0);
__decorate([
    r()
], ParcelTrackerCard.prototype, "_historyInfo", void 0);
__decorate([
    e("parcel-tracker-upsert-dialog")
], ParcelTrackerCard.prototype, "_upsertDialog", void 0);
ParcelTrackerCard = __decorate([
    t("parcel-tracker-card")
], ParcelTrackerCard);
window.customCards = window.customCards || [];
window.customCards.push({
    type: "parcel-tracker-card",
    name: "Parcel Tracker Card",
    description: "Display and manage parcels tracked by the Parcel Tracker integration.",
});

export { ParcelTrackerCard };
