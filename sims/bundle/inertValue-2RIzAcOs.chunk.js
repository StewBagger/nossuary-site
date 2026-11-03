import{r as e,t}from"./rolldown-runtime-hePW80VL.chunk.js";import{n,r,t as i}from"./defineProperty-CFDeBpCh.chunk.js";var a=t((e=>{var t=r();function n(e,t){return e===t&&(e!==0||1/e==1/t)||e!==e&&t!==t}var i=typeof Object.is==`function`?Object.is:n,a=t.useState,o=t.useEffect,s=t.useLayoutEffect,c=t.useDebugValue;function l(e,t){var n=t(),r=a({inst:{value:n,getSnapshot:t}}),i=r[0].inst,l=r[1];return s(function(){i.value=n,i.getSnapshot=t,u(i)&&l({inst:i})},[e,n,t]),o(function(){return u(i)&&l({inst:i}),e(function(){u(i)&&l({inst:i})})},[e]),c(n),n}function u(e){var t=e.getSnapshot;e=e.value;try{var n=t();return!i(e,n)}catch{return!0}}function d(e,t){return t()}var f=typeof window>`u`||window.document===void 0||window.document.createElement===void 0?d:l;e.useSyncExternalStore=t.useSyncExternalStore===void 0?f:t.useSyncExternalStore})),o=t(((e,t)=>{t.exports=a()})),s=e(r(),1),c=(0,s.createContext)(null),l=()=>(0,s.useContext)(c),u=t((e=>{var t=r();function n(e){var t=`https://react.dev/errors/`+e;if(1<arguments.length){t+=`?args[]=`+encodeURIComponent(arguments[1]);for(var n=2;n<arguments.length;n++)t+=`&args[]=`+encodeURIComponent(arguments[n])}return`Minified React error #`+e+`; visit `+t+` for the full message or use the non-minified dev environment for full errors and additional helpful warnings.`}function i(){}var a={d:{f:i,r:function(){throw Error(n(522))},D:i,C:i,L:i,m:i,X:i,S:i,M:i},p:0,findDOMNode:null},o=Symbol.for(`react.portal`),s=Symbol.for(`react.recoverable`),c=Symbol.for(`react.optimistic_key`);function l(e,t,n){var r=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:o,key:r==null?null:r===c?c:``+r,children:e,containerInfo:t,implementation:n}}var u=t.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;function d(e,t){if(e===`font`)return``;if(typeof t==`string`)return t===`use-credentials`?t:``}e.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=a,e.browser=function(e){return{$$typeof:s,_reason:e}},e.createPortal=function(e,t){var r=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11)throw Error(n(299));return l(e,t,null,r)},e.flushSync=function(e){var t=u.T,n=a.p;try{if(u.T=null,a.p=2,e)return e()}finally{u.T=t,a.p=n,a.d.f()}},e.preconnect=function(e,t){typeof e==`string`&&(t?(t=t.crossOrigin,t=typeof t==`string`?t===`use-credentials`?t:``:void 0):t=null,a.d.C(e,t))},e.prefetchDNS=function(e){typeof e==`string`&&a.d.D(e)},e.preinit=function(e,t){if(typeof e==`string`&&t&&typeof t.as==`string`){var n=t.as,r=d(n,t.crossOrigin),i=typeof t.integrity==`string`?t.integrity:void 0,o=typeof t.fetchPriority==`string`?t.fetchPriority:void 0;n===`style`?a.d.S(e,typeof t.precedence==`string`?t.precedence:void 0,{crossOrigin:r,integrity:i,fetchPriority:o}):n===`script`&&a.d.X(e,{crossOrigin:r,integrity:i,fetchPriority:o,nonce:typeof t.nonce==`string`?t.nonce:void 0})}},e.preinitModule=function(e,t){if(typeof e==`string`){if(typeof t==`object`&&t){if(t.as==null||t.as===`script`){var n=d(t.as,t.crossOrigin);a.d.M(e,{crossOrigin:n,integrity:typeof t.integrity==`string`?t.integrity:void 0,nonce:typeof t.nonce==`string`?t.nonce:void 0,fetchPriority:typeof t.fetchPriority==`string`?t.fetchPriority:void 0})}}else t??a.d.M(e)}},e.preload=function(e,t){if(typeof e==`string`&&typeof t==`object`&&t&&typeof t.as==`string`){var n=t.as,r=d(n,t.crossOrigin);a.d.L(e,n,{crossOrigin:r,integrity:typeof t.integrity==`string`?t.integrity:void 0,nonce:typeof t.nonce==`string`?t.nonce:void 0,type:typeof t.type==`string`?t.type:void 0,fetchPriority:typeof t.fetchPriority==`string`?t.fetchPriority:void 0,referrerPolicy:typeof t.referrerPolicy==`string`?t.referrerPolicy:void 0,imageSrcSet:typeof t.imageSrcSet==`string`?t.imageSrcSet:void 0,imageSizes:typeof t.imageSizes==`string`?t.imageSizes:void 0,media:typeof t.media==`string`?t.media:void 0})}},e.preloadModule=function(e,t){if(typeof e==`string`){if(t){var n=d(t.as,t.crossOrigin);a.d.m(e,{as:typeof t.as==`string`&&t.as!==`script`?t.as:void 0,crossOrigin:n,integrity:typeof t.integrity==`string`?t.integrity:void 0,nonce:typeof t.nonce==`string`?t.nonce:void 0,fetchPriority:typeof t.fetchPriority==`string`?t.fetchPriority:void 0})}else a.d.m(e)}},e.requestFormReset=function(e){a.d.r(e)},e.unstable_batchedUpdates=function(e,t){return e(t)},e.useFormState=function(e,t,n){return u.H.useFormState(e,t,n)},e.useFormStatus=function(){return u.H.useHostTransitionStatus()},e.version=`19.3.0`})),d=t(((e,t)=>{function n(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>`u`||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!=`function`))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n)}catch(e){console.error(e)}}n(),t.exports=u()}));function f(){return typeof window<`u`}function p(e){return g(e)?(e.nodeName||``).toLowerCase():`#document`}function m(e){var t;return(e==null||(t=e.ownerDocument)==null?void 0:t.defaultView)||window}function h(e){return((g(e)?e.ownerDocument:e.document)||window.document)?.documentElement}function g(e){return f()?e instanceof Node||e instanceof m(e).Node:!1}function _(e){return f()?e instanceof Element||e instanceof m(e).Element:!1}function v(e){return f()?e instanceof HTMLElement||e instanceof m(e).HTMLElement:!1}function y(e){return!f()||typeof ShadowRoot>`u`?!1:e instanceof ShadowRoot||e instanceof m(e).ShadowRoot}function b(e){let{overflow:t,overflowX:n,overflowY:r,display:i}=C(e);return/auto|scroll|overlay|hidden|clip/.test(t+r+n)&&i!==`inline`&&i!==`contents`}function ee(e){return/^(table|td|th)$/.test(p(e))}function x(e){try{if(e.matches(`:popover-open`))return!0}catch{}try{return e.matches(`:modal`)}catch{return!1}}var te=/transform|translate|scale|rotate|perspective|filter/,ne=/paint|layout|strict|content/,S=e=>!!e&&e!==`none`,re;function ie(e){let t=_(e)?C(e):e;return S(t.transform)||S(t.translate)||S(t.scale)||S(t.rotate)||S(t.perspective)||!oe()&&(S(t.backdropFilter)||S(t.filter))||te.test(t.willChange||``)||ne.test(t.contain||``)}function ae(e){let t=ce(e);for(;v(t)&&!se(t);){if(ie(t))return t;if(x(t))return null;t=ce(t)}return null}function oe(){return re??(re=typeof CSS<`u`&&CSS.supports&&CSS.supports(`-webkit-backdrop-filter`,`none`)),re}function se(e){return/^(html|body|#document)$/.test(p(e))}function C(e){return m(e).getComputedStyle(e)}function w(e){return _(e)?{scrollLeft:e.scrollLeft,scrollTop:e.scrollTop}:{scrollLeft:e.scrollX,scrollTop:e.scrollY}}function ce(e){if(p(e)===`html`)return e;let t=e.assignedSlot||e.parentNode||y(e)&&e.host||h(e);return y(t)?t.host:t}function le(e){let t=ce(e);return se(t)?(e.ownerDocument||e).body:v(t)&&b(t)?t:le(t)}function ue(e,t,n){t===void 0&&(t=[]),n===void 0&&(n=!0);let r=le(e),i=r===e.ownerDocument?.body,a=m(r);if(i){let e=de(a);return t.concat(a,a.visualViewport||[],b(r)?r:[],e&&n?ue(e):[])}return t.concat(r,ue(r,[],n))}function de(e){return e.parent&&Object.getPrototypeOf(e.parent)?e.frameElement:null}var fe={...s},pe={};function T(e,t){let n=s.useRef(pe);return n.current===pe&&(n.current=e(t)),n}var me=fe.useInsertionEffect,he=me&&me!==fe.useLayoutEffect?me:e=>e();function E(e){let t=T(ge).current;return t.next=e,he(t.effect),t.trampoline}function ge(){let e={next:void 0,callback:_e,trampoline:(...t)=>e.callback?.(...t),effect:()=>{e.callback=e.next}};return e}function _e(){}var D=typeof document<`u`?s.useLayoutEffect:()=>{};function ve(e,t){if(e&&!t)return e;if(!e&&t)return t;if(e||t)return{...e,...t}}var ye={};function be(e,t,n,r,i){if(!n&&!r&&!i&&!e)return Se(t);let a=Se(e);return t&&(a=Ce(a,t)),n&&(a=Ce(a,n)),r&&(a=Ce(a,r)),i&&(a=Ce(a,i)),a}function xe(e){if(e.length===0)return ye;if(e.length===1)return Se(e[0]);let t=Se(e[0]);for(let n=1;n<e.length;n+=1)t=Ce(t,e[n]);return t}function Se(e){return De(e)?{...Oe(e,ye)}:we(e)}function Ce(e,t){return De(t)?Oe(t,e):Te(e,t)}function we(e){let t={...e};for(let e in t){let n=t[e];Ee(e,n)&&(t[e]=Ae(n))}return t}function Te(e,t){if(!t)return e;for(let n in t){let r=t[n];switch(n){case`style`:e[n]=ve(e.style,r);break;case`className`:e[n]=Me(e.className,r);break;default:e[n]=Ee(n,r)?ke(e[n],r):r}}return e}function Ee(e,t){let n=e.charCodeAt(0),r=e.charCodeAt(1),i=e.charCodeAt(2);return n===111&&r===110&&i>=65&&i<=90&&(typeof t==`function`||t===void 0)}function De(e){return typeof e==`function`}function Oe(e,t){return De(e)?e(t):e??ye}function ke(e,t){return t?e?(...n)=>{let r=n[0];if(Ne(r)){let i=r;je(i);let a=t(...n);return i.baseUIHandlerPrevented||e?.(...n),a}let i=t(...n);return e?.(...n),i}:Ae(t):e}function Ae(e){return e&&((...t)=>{let n=t[0];return Ne(n)&&je(n),e(...t)})}function je(e){return e.preventBaseUIHandler=()=>{e.baseUIHandlerPrevented=!0},e}function Me(e,t){return t?e?t+` `+e:t:e}function Ne(e){return typeof e==`object`&&!!e&&`nativeEvent`in e}function Pe(e,t){return function(n,...r){let i=new URL(e);return i.searchParams.set(`code`,n.toString()),r.forEach(e=>i.searchParams.append(`args[]`,e)),`${t} error #${n}; visit ${i} for the full message.`}}var Fe=Pe(`https://base-ui.com/production-error`,`Base UI`),Ie=s.createContext(void 0);function Le(e=!1){let t=s.useContext(Ie);if(t===void 0&&!e)throw Error(Fe(16));return t}function Re(e){let{focusableWhenDisabled:t,disabled:n,composite:r=!1,tabIndex:i=0,isNativeButton:a}=e,o=r&&t!==!1,c=r&&t===!1;return{props:s.useMemo(()=>{let e={onKeyDown(e){n&&t&&e.key!==`Tab`&&e.preventDefault()}};return r||(e.tabIndex=i,!a&&n&&(e.tabIndex=t?i:-1)),(a&&(t||o)||!a&&n)&&(e[`aria-disabled`]=n),a&&(!t||c)&&(e.disabled=n),e},[r,n,t,o,c,a,i])}}function ze(e){return e?.ownerDocument||document}function Be(e,t,{detail:n=0}={}){e.dispatchEvent(new(m(e)).PointerEvent(`click`,{bubbles:!0,cancelable:!0,composed:!0,detail:n,shiftKey:t.shiftKey,ctrlKey:t.ctrlKey,altKey:t.altKey,metaKey:t.metaKey}))}function Ve(e={}){let{disabled:t=!1,focusableWhenDisabled:n,tabIndex:r=0,native:i=!0,composite:a}=e,o=s.useRef(null),c=Le(!0),l=a??c!==void 0,{props:u}=Re({focusableWhenDisabled:n,disabled:t,composite:l,tabIndex:r,isNativeButton:i}),d=s.useCallback(()=>{let e=o.current;He(e)&&l&&t&&u.disabled===void 0&&e.disabled&&(e.disabled=!1)},[t,u.disabled,l]);return D(d,[d]),{getButtonProps:s.useCallback((e={})=>{let{onClick:n,onMouseDown:r,onKeyUp:a,onKeyDown:o,onPointerDown:s,...c}=e;return be({onClick(e){if(t){e.preventDefault();return}n?.(e)},onMouseDown(e){t||r?.(e)},onKeyDown(e){if(t||(je(e),o?.(e),e.baseUIHandlerPrevented))return;let n=e.target===e.currentTarget,r=e.currentTarget,a=He(r),s=!i&&Ue(r),c=n&&(i?a:!s),u=e.key===`Enter`,d=e.key===` `,f=r.getAttribute(`role`),p=f?.startsWith(`menuitem`)||f===`option`||f===`gridcell`;if(n&&l&&d){if(e.defaultPrevented&&p)return;e.preventDefault(),(!i||a)&&(e.preventBaseUIHandler(),Be(r,e));return}if(!c||i||!d&&!u){n&&s&&d&&e.preventDefault();return}e.defaultPrevented||(e.preventDefault(),u&&(e.preventBaseUIHandler(),Be(r,e)))},onKeyUp(e){if(!t){if(je(e),a?.(e),e.target===e.currentTarget&&i&&l&&He(e.currentTarget)&&e.key===` `){e.preventDefault();return}e.baseUIHandlerPrevented||e.target===e.currentTarget&&!i&&!l&&!e.defaultPrevented&&e.key===` `&&(e.preventBaseUIHandler(),Be(e.currentTarget,e))}},onPointerDown(e){if(t){e.preventDefault();return}s?.(e)}},i?{type:`button`}:{role:`button`},u,c)},[t,u,l,i]),buttonRef:E(e=>{o.current=e,d()})}}function He(e){return v(e)&&e.tagName===`BUTTON`}function Ue(e){return v(e)&&e.tagName===`A`&&!!e.href}function We(e,t,n,r){let i=T(Ke).current;return qe(i,e,t,n,r)&&Ye(i,[e,t,n,r]),i.callback}function Ge(e){let t=T(Ke).current;return Je(t,e)&&Ye(t,e),t.callback}function Ke(){return{callback:null,cleanup:null,refs:[]}}function qe(e,t,n,r,i){return e.refs[0]!==t||e.refs[1]!==n||e.refs[2]!==r||e.refs[3]!==i}function Je(e,t){return e.refs.length!==t.length||e.refs.some((e,n)=>e!==t[n])}function Ye(e,t){if(e.refs=t,t.every(e=>e==null)){e.callback=null;return}e.callback=n=>{if(e.cleanup&&(e.cleanup(),e.cleanup=null),n!=null){let r=Array(t.length).fill(null);for(let e=0;e<t.length;e+=1){let i=t[e];if(i!=null)switch(typeof i){case`function`:{let t=i(n);typeof t==`function`&&(r[e]=t);break}case`object`:i.current=n}}e.cleanup=()=>{for(let e=0;e<t.length;e+=1){let n=t[e];if(n!=null)switch(typeof n){case`function`:{let t=r[e];typeof t==`function`?t():n(null);break}case`object`:n.current=null}}}}}}var Xe=19;function Ze(e){return Xe>=e}function Qe(e){if(!s.isValidElement(e))return null;let t=e,n=t.props;return(Ze(19)?n?.ref:t.ref)??null}function $e(){}var et=Object.freeze([]),O=Object.freeze({});function tt(e,t){let n={};for(let r in e){let i=e[r];if(t?.hasOwnProperty(r)){let e=t[r](i);e!=null&&Object.assign(n,e);continue}i===!0?n[`data-${r.toLowerCase()}`]=``:i&&(n[`data-${r.toLowerCase()}`]=i.toString())}return n}function nt(e,t){return typeof e==`function`?e(t):e}function rt(e,t){return typeof e==`function`?e(t):e}function it(e,t,n={}){let r=t.render;n.enabled!==!1&&(r=ct(r));let i=at(t,n,r);if(n.enabled===!1)return null;let a=n.state??O;return lt(e,r,i,a)}function at(e,t,n){let{className:r,style:i}=e,{state:a=O,ref:o,props:s,stateAttributesMapping:c,enabled:l=!0}=t,u=l?nt(r,a):void 0,d=l?rt(i,a):void 0,f=l?tt(a,c):O,p=l&&s?ot(s):void 0,m=l?ve(f,p)??{}:O;return typeof document<`u`&&(l?m.ref=Array.isArray(o)?Ge([m.ref,Qe(n),...o]):We(m.ref,Qe(n),o):We(null,null)),l?(u!==void 0&&(m.className=Me(m.className,u)),d!==void 0&&(m.style=ve(m.style,d)),m):O}function ot(e){return Array.isArray(e)?xe(e):be(void 0,e)}var st=Symbol.for(`react.lazy`);function ct(e){if(e?.$$typeof!==st)return e;let t=s.Children.toArray(e)[0];return s.isValidElement(t)?t:e}function lt(e,t,n,r){if(t){if(typeof t==`function`)return t(n,r);let e=be(n,t.props);return e.ref=n.ref,s.cloneElement(t,e)}if(e&&typeof e==`string`)return ut(e,n);throw Error(Fe(8))}function ut(e,t){return e===`button`?(0,s.createElement)(`button`,{type:`button`,...t,key:t.key}):e===`img`?(0,s.createElement)(`img`,{alt:``,...t,key:t.key}):s.createElement(e,t)}var dt=s.forwardRef(function(e,t){let{render:n,className:r,disabled:i=!1,focusableWhenDisabled:a=!1,nativeButton:o=!0,style:s,...c}=e,{getButtonProps:l,buttonRef:u}=Ve({disabled:i,focusableWhenDisabled:a,native:o});return it(`button`,e,{state:{disabled:i},ref:[t,u],props:[c,l]})}),ft=[`noopener`,`noreferrer`],pt=e=>{if(!e)return!1;if(e.startsWith(`//`))return!0;let t=/^([a-z][a-z0-9+.-]*):/i.exec(e)?.[1].toLowerCase();return t===`http`||t===`https`},mt=(e,t)=>{if(!pt(e))return t;let n=t?t.split(/\s+/).filter(Boolean):[];return ft.forEach(e=>{n.includes(e)||n.push(e)}),n.join(` `)},ht=(0,s.createContext)(null),gt=()=>{let e=(0,s.useContext)(ht);if(e===null)throw Error(`A Field part must be rendered inside a Field.Root.`);return e},_t=()=>(0,s.useContext)(ht)?.describedBy,vt=e=>{let t=(0,s.useContext)(ht)?.size;return e??t??`sm`};function yt(e){var t,n,r=``;if(typeof e==`string`||typeof e==`number`)r+=e;else if(typeof e==`object`){if(Array.isArray(e)){var i=e.length;for(t=0;t<i;t++)e[t]&&(n=yt(e[t]))&&(r&&(r+=` `),r+=n)}else for(n in e)e[n]&&(r&&(r+=` `),r+=n)}return r}function bt(){for(var e,t,n=0,r=``,i=arguments.length;n<i;n++)(e=arguments[n])&&(t=yt(e))&&(r&&(r+=` `),r+=t);return r}var k=n(),xt=({size:e=`md`,tone:t=`default`,label:n,className:r,testId:i=`loader`})=>(0,k.jsx)(`div`,{"data-testid":i,"data-size":e,"data-tone":t==="default"?void 0:t,role:n?`img`:void 0,"aria-label":n,className:bt(`ui-spinner rounded-full`,r)}),St=e=>e.href!==void 0,Ct=e=>{let t=vt(e.size===`none`?void 0:e.size),n=e.variant===void 0?e.iconOnly?null:`primary`:e.variant,r=n===`link`||n===`link-danger`,i=e.iconOnly?`ui-button-icon`:r?`ui-button-link`:`ui-button`,a=n===`unstyled`||e.iconOnly||e.size===`none`?void 0:r?e.size:t,o=n===`unstyled`?e.className:bt(i,n&&(n!==`link`||e.iconOnly)&&`ui-button-${n}`,e.className),s=e.loading||void 0,c=e.loading?(0,k.jsxs)(k.Fragment,{children:[(0,k.jsx)(`span`,{className:`invisible contents`,"data-hidden":``,children:e.children}),(0,k.jsx)(xt,{size:`xs`,className:`ui-button-spinner`})]}):e.children;if(e.as===`label`){let{as:t,variant:n,size:r,iconOnly:i,loading:l,className:u,children:d,...f}=e;return(0,k.jsx)(`label`,{className:o,"data-size":a,"aria-busy":s,...f,children:c})}if(St(e)){let{as:t,variant:n,size:r,iconOnly:i,loading:l,className:u,children:d,...f}=e;return(0,k.jsx)(`a`,{className:o,"data-size":a,"aria-busy":s,...f,rel:mt(f.href,f.rel),children:c})}let{as:l,variant:u,size:d,iconOnly:f,loading:p,className:m,children:h,type:g=`button`,..._}=e;return(0,k.jsx)(dt,{className:o,type:g,"data-size":a,"aria-busy":s,..._,children:c})},wt=e=>e===void 0||e.type===`button`||e.type===Ct&&e.props.href===void 0,Tt={prefix:`fab`,iconName:`discord`,icon:[576,512,[],`f392`,`M492.5 69.8c-.2-.3-.4-.6-.8-.7-38.1-17.5-78.4-30-119.7-37.1-.4-.1-.8 0-1.1 .1s-.6 .4-.8 .8c-5.5 9.9-10.5 20.2-14.9 30.6-44.6-6.8-89.9-6.8-134.4 0-4.5-10.5-9.5-20.7-15.1-30.6-.2-.3-.5-.6-.8-.8s-.7-.2-1.1-.2c-41.3 7.1-81.6 19.6-119.7 37.1-.3 .1-.6 .4-.8 .7-76.2 113.8-97.1 224.9-86.9 334.5 0 .3 .1 .5 .2 .8s.3 .4 .5 .6c44.4 32.9 94 58 146.8 74.2 .4 .1 .8 .1 1.1 0s.7-.4 .9-.7c11.3-15.4 21.4-31.8 30-48.8 .1-.2 .2-.5 .2-.8s0-.5-.1-.8-.2-.5-.4-.6-.4-.3-.7-.4c-15.8-6.1-31.2-13.4-45.9-21.9-.3-.2-.5-.4-.7-.6s-.3-.6-.3-.9 0-.6 .2-.9 .3-.5 .6-.7c3.1-2.3 6.2-4.7 9.1-7.1 .3-.2 .6-.4 .9-.4s.7 0 1 .1c96.2 43.9 200.4 43.9 295.5 0 .3-.1 .7-.2 1-.2s.7 .2 .9 .4c2.9 2.4 6 4.9 9.1 7.2 .2 .2 .4 .4 .6 .7s.2 .6 .2 .9-.1 .6-.3 .9-.4 .5-.6 .6c-14.7 8.6-30 15.9-45.9 21.8-.2 .1-.5 .2-.7 .4s-.3 .4-.4 .7-.1 .5-.1 .8 .1 .5 .2 .8c8.8 17 18.8 33.3 30 48.8 .2 .3 .6 .6 .9 .7s.8 .1 1.1 0c52.9-16.2 102.6-41.3 147.1-74.2 .2-.2 .4-.4 .5-.6s.2-.5 .2-.8c12.3-126.8-20.5-236.9-86.9-334.5zm-302 267.7c-29 0-52.8-26.6-52.8-59.2s23.4-59.2 52.8-59.2c29.7 0 53.3 26.8 52.8 59.2 0 32.7-23.4 59.2-52.8 59.2zm195.4 0c-29 0-52.8-26.6-52.8-59.2s23.4-59.2 52.8-59.2c29.7 0 53.3 26.8 52.8 59.2 0 32.7-23.2 59.2-52.8 59.2z`]},Et={prefix:`fab`,iconName:`github`,icon:[512,512,[],`f09b`,`M216.5 362.5c-66-8-112.5-55.5-112.5-117 0-25 9-52 24-70-6.5-16.5-5.5-51.5 2-66 20-2.5 47 8 63 22.5 19-6 39-9 63.5-9s44.5 3 62.5 8.5c15.5-14 43-24.5 63-22 7 13.5 8 48.5 1.5 65.5 16 19 24.5 44.5 24.5 70.5 0 61.5-46.5 108-113.5 116.5 17 11 28.5 35 28.5 62.5l0 52C323 491.5 335.5 500 350.5 494 441 459.5 512 369 512 257 512 115.5 397 0 255.5 0S0 115.5 0 257c0 111 70.5 203 165.5 237.5 13.5 5 26.5-4 26.5-17.5l0-40c-7 3-16 5-24 5-33 0-52.5-18-66.5-51.5-5.5-13.5-11.5-21.5-23-23-6-.5-8-3-8-6 0-6 10-10.5 20-10.5 14.5 0 27 9 40 27.5 10 14.5 20.5 21 33 21s20.5-4.5 32-16c8.5-8.5 15-16 21-21z`]},Dt={prefix:`fab`,iconName:`patreon`,icon:[512,512,[],`f3d9`,`M490 153.8c-.1-65.4-51-119-110.7-138.3-74.2-24-172-20.5-242.9 12.9-85.8 40.5-112.8 129.3-113.8 217.8-.8 72.8 6.4 264.4 114.6 265.8 80.3 1 92.3-102.5 129.5-152.3 26.4-35.5 60.5-45.5 102.4-55.9 72-17.8 121.1-74.7 121-150l-.1 0z`]},Ot={prefix:`far`,iconName:`eye`,icon:[576,512,[128065],`f06e`,`M288 80C222.8 80 169.2 109.6 128.1 147.7 89.6 183.5 63 226 49.4 256 63 286 89.6 328.5 128.1 364.3 169.2 402.4 222.8 432 288 432s118.8-29.6 159.9-67.7C486.4 328.5 513 286 526.6 256 513 226 486.4 183.5 447.9 147.7 406.8 109.6 353.2 80 288 80zM95.4 112.6C142.5 68.8 207.2 32 288 32s145.5 36.8 192.6 80.6c46.8 43.5 78.1 95.4 93 131.1 3.3 7.9 3.3 16.7 0 24.6-14.9 35.7-46.2 87.7-93 131.1-47.1 43.7-111.8 80.6-192.6 80.6S142.5 443.2 95.4 399.4c-46.8-43.5-78.1-95.4-93-131.1-3.3-7.9-3.3-16.7 0-24.6 14.9-35.7 46.2-87.7 93-131.1zM288 336c44.2 0 80-35.8 80-80 0-29.6-16.1-55.5-40-69.3-1.4 59.7-49.6 107.9-109.3 109.3 13.8 23.9 39.7 40 69.3 40zm-79.6-88.4c2.5 .3 5 .4 7.6 .4 35.3 0 64-28.7 64-64 0-2.6-.2-5.1-.4-7.6-37.4 3.9-67.2 33.7-71.1 71.1zm45.6-115c10.8-3 22.2-4.5 33.9-4.5 8.8 0 17.5 .9 25.8 2.6 .3 .1 .5 .1 .8 .2 57.9 12.2 101.4 63.7 101.4 125.2 0 70.7-57.3 128-128 128-61.6 0-113-43.5-125.2-101.4-1.8-8.6-2.8-17.5-2.8-26.6 0-11 1.4-21.8 4-32 .2-.7 .3-1.3 .5-1.9 11.9-43.4 46.1-77.6 89.5-89.5z`]},kt={prefix:`far`,iconName:`circle-question`,icon:[512,512,[62108,`question-circle`],`f059`,`M464 256a208 208 0 1 0 -416 0 208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0 256 256 0 1 1 -512 0zm256-80c-17.7 0-32 14.3-32 32 0 13.3-10.7 24-24 24s-24-10.7-24-24c0-44.2 35.8-80 80-80s80 35.8 80 80c0 47.2-36 67.2-56 74.5l0 3.8c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-8.1c0-20.5 14.8-35.2 30.1-40.2 6.4-2.1 13.2-5.5 18.2-10.3 4.3-4.2 7.7-10 7.7-19.6 0-17.7-14.3-32-32-32zM224 368a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z`]},At={prefix:`far`,iconName:`user`,icon:[448,512,[128100,62144,62470,`user-alt`,`user-large`],`f007`,`M144 128a80 80 0 1 1 160 0 80 80 0 1 1 -160 0zm208 0a128 128 0 1 0 -256 0 128 128 0 1 0 256 0zM48 480c0-70.7 57.3-128 128-128l96 0c70.7 0 128 57.3 128 128l0 8c0 13.3 10.7 24 24 24s24-10.7 24-24l0-8c0-97.2-78.8-176-176-176l-96 0C78.8 304 0 382.8 0 480l0 8c0 13.3 10.7 24 24 24s24-10.7 24-24l0-8z`]},jt={prefix:`far`,iconName:`circle-check`,icon:[512,512,[61533,`check-circle`],`f058`,`M256 512a256 256 0 1 1 0-512 256 256 0 1 1 0 512zm0-464a208 208 0 1 0 0 416 208 208 0 1 0 0-416zm70.7 121.9c7.8-10.7 22.8-13.1 33.5-5.3 10.7 7.8 13.1 22.8 5.3 33.5L243.4 366.1c-4.1 5.7-10.5 9.3-17.5 9.8-7 .5-13.9-2-18.8-6.9l-55.9-55.9c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l36 36 105.6-145.2z`]},Mt={prefix:`far`,iconName:`star`,icon:[576,512,[11088,61446],`f005`,`M288.1-32c9 0 17.3 5.1 21.4 13.1L383 125.3 542.9 150.7c8.9 1.4 16.3 7.7 19.1 16.3s.5 18-5.8 24.4L441.7 305.9 467 465.8c1.4 8.9-2.3 17.9-9.6 23.2s-17 6.1-25 2L288.1 417.6 143.8 491c-8 4.1-17.7 3.3-25-2s-11-14.2-9.6-23.2L134.4 305.9 20 191.4c-6.4-6.4-8.6-15.8-5.8-24.4s10.1-14.9 19.1-16.3l159.9-25.4 73.6-144.2c4.1-8 12.4-13.1 21.4-13.1zm0 76.8L230.3 158c-3.5 6.8-10 11.6-17.6 12.8l-125.5 20 89.8 89.9c5.4 5.4 7.9 13.1 6.7 20.7l-19.8 125.5 113.3-57.6c6.8-3.5 14.9-3.5 21.8 0l113.3 57.6-19.8-125.5c-1.2-7.6 1.3-15.3 6.7-20.7l89.8-89.9-125.5-20c-7.6-1.2-14.1-6-17.6-12.8L288.1 44.8z`]},Nt={prefix:`far`,iconName:`copy`,icon:[448,512,[],`f0c5`,`M384 336l-192 0c-8.8 0-16-7.2-16-16l0-256c0-8.8 7.2-16 16-16l133.5 0c4.2 0 8.3 1.7 11.3 4.7l58.5 58.5c3 3 4.7 7.1 4.7 11.3L400 320c0 8.8-7.2 16-16 16zM192 384l192 0c35.3 0 64-28.7 64-64l0-197.5c0-17-6.7-33.3-18.7-45.3L370.7 18.7C358.7 6.7 342.5 0 325.5 0L192 0c-35.3 0-64 28.7-64 64l0 256c0 35.3 28.7 64 64 64zM64 128c-35.3 0-64 28.7-64 64L0 448c0 35.3 28.7 64 64 64l192 0c35.3 0 64-28.7 64-64l0-16-48 0 0 16c0 8.8-7.2 16-16 16L64 464c-8.8 0-16-7.2-16-16l0-256c0-8.8 7.2-16 16-16l16 0 0-48-16 0z`]},Pt={prefix:`far`,iconName:`eye-slash`,icon:[576,512,[],`f070`,`M41-24.9c-9.4-9.4-24.6-9.4-33.9 0S-2.3-.3 7 9.1l528 528c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-96.4-96.4c2.7-2.4 5.4-4.8 8-7.2 46.8-43.5 78.1-95.4 93-131.1 3.3-7.9 3.3-16.7 0-24.6-14.9-35.7-46.2-87.7-93-131.1-47.1-43.7-111.8-80.6-192.6-80.6-56.8 0-105.6 18.2-146 44.2L41-24.9zM176.9 111.1c32.1-18.9 69.2-31.1 111.1-31.1 65.2 0 118.8 29.6 159.9 67.7 38.5 35.7 65.1 78.3 78.6 108.3-13.6 30-40.2 72.5-78.6 108.3-3.1 2.8-6.2 5.6-9.4 8.4L393.8 328c14-20.5 22.2-45.3 22.2-72 0-70.7-57.3-128-128-128-26.7 0-51.5 8.2-72 22.2l-39.1-39.1zm182 182l-108-108c11.1-5.8 23.7-9.1 37.1-9.1 44.2 0 80 35.8 80 80 0 13.4-3.3 26-9.1 37.1zM103.4 173.2l-34-34c-32.6 36.8-55 75.8-66.9 104.5-3.3 7.9-3.3 16.7 0 24.6 14.9 35.7 46.2 87.7 93 131.1 47.1 43.7 111.8 80.6 192.6 80.6 37.3 0 71.2-7.9 101.5-20.6L352.2 422c-20 6.4-41.4 10-64.2 10-65.2 0-118.8-29.6-159.9-67.7-38.5-35.7-65.1-78.3-78.6-108.3 10.4-23.1 28.6-53.6 54-82.8z`]},Ft={"arrow-left":{prefix:`fas`,iconName:`arrow-left`,icon:[512,512,[8592],`f060`,`M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 288 480 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-370.7 0 105.4-105.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z`]},"arrow-right":{prefix:`fas`,iconName:`arrow-right`,icon:[512,512,[8594],`f061`,`M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l370.7 0-105.4 105.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z`]},"arrow-right-arrow-left":{prefix:`fas`,iconName:`arrow-right-arrow-left`,icon:[512,512,[8644,`exchange`],`f0ec`,`M502.6 150.6l-96 96c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L402.7 160 32 160c-17.7 0-32-14.3-32-32S14.3 96 32 96l370.7 0-41.4-41.4c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l96 96c12.5 12.5 12.5 32.8 0 45.3zm-397.3 352l-96-96c-12.5-12.5-12.5-32.8 0-45.3l96-96c12.5-12.5 32.8-12.5 45.3 0s12.5 32.8 0 45.3L109.3 352 480 352c17.7 0 32 14.3 32 32s-14.3 32-32 32l-370.7 0 41.4 41.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0z`]},"arrow-right-from-bracket":{prefix:`fas`,iconName:`arrow-right-from-bracket`,icon:[512,512,[`sign-out`],`f08b`,`M160 96c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 32C43 32 0 75 0 128L0 384c0 53 43 96 96 96l64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l64 0zM502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224 192 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l210.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128z`]},"arrow-rotate-left":{prefix:`fas`,iconName:`arrow-rotate-left`,icon:[512,512,[8634,`arrow-left-rotate`,`arrow-rotate-back`,`arrow-rotate-backward`,`undo`],`f0e2`,`M256 64c-56.8 0-107.9 24.7-143.1 64l47.1 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 192c-17.7 0-32-14.3-32-32L0 32C0 14.3 14.3 0 32 0S64 14.3 64 32l0 54.7C110.9 33.6 179.5 0 256 0 397.4 0 512 114.6 512 256S397.4 512 256 512c-87 0-163.9-43.4-210.1-109.7-10.1-14.5-6.6-34.4 7.9-44.6s34.4-6.6 44.6 7.9c34.8 49.8 92.4 82.3 157.6 82.3 106 0 192-86 192-192S362 64 256 64z`]},"arrow-up":{prefix:`fas`,iconName:`arrow-up`,icon:[384,512,[8593],`f062`,`M214.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 109.3 160 480c0 17.7 14.3 32 32 32s32-14.3 32-32l0-370.7 105.4 105.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z`]},"arrows-rotate":{prefix:`fas`,iconName:`arrows-rotate`,icon:[512,512,[128472,`refresh`,`sync`],`f021`,`M65.9 228.5c13.3-93 93.4-164.5 190.1-164.5 53 0 101 21.5 135.8 56.2 .2 .2 .4 .4 .6 .6l7.6 7.2-47.9 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l128 0c17.7 0 32-14.3 32-32l0-128c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 53.4-11.3-10.7C390.5 28.6 326.5 0 256 0 127 0 20.3 95.4 2.6 219.5 .1 237 12.2 253.2 29.7 255.7s33.7-9.7 36.2-27.1zm443.5 64c2.5-17.5-9.7-33.7-27.1-36.2s-33.7 9.7-36.2 27.1c-13.3 93-93.4 164.5-190.1 164.5-53 0-101-21.5-135.8-56.2-.2-.2-.4-.4-.6-.6l-7.6-7.2 47.9 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L32 320c-8.5 0-16.7 3.4-22.7 9.5S-.1 343.7 0 352.3l1 127c.1 17.7 14.6 31.9 32.3 31.7S65.2 496.4 65 478.7l-.4-51.5 10.7 10.1c46.3 46.1 110.2 74.7 180.7 74.7 129 0 235.7-95.4 253.4-219.5z`]},ban:{prefix:`fas`,iconName:`ban`,icon:[512,512,[128683,`cancel`],`f05e`,`M367.2 412.5L99.5 144.8c-22.4 31.4-35.5 69.8-35.5 111.2 0 106 86 192 192 192 41.5 0 79.9-13.1 111.2-35.5zm45.3-45.3c22.4-31.4 35.5-69.8 35.5-111.2 0-106-86-192-192-192-41.5 0-79.9 13.1-111.2 35.5L412.5 367.2zM0 256a256 256 0 1 1 512 0 256 256 0 1 1 -512 0z`]},bars:{prefix:`fas`,iconName:`bars`,icon:[448,512,[`navicon`],`f0c9`,`M0 96C0 78.3 14.3 64 32 64l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 128C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32L32 448c-17.7 0-32-14.3-32-32s14.3-32 32-32l384 0c17.7 0 32 14.3 32 32z`]},book:{prefix:`fas`,iconName:`book`,icon:[448,512,[128212],`f02d`,`M384 512L96 512c-53 0-96-43-96-96L0 96C0 43 43 0 96 0L400 0c26.5 0 48 21.5 48 48l0 288c0 20.9-13.4 38.7-32 45.3l0 66.7c17.7 0 32 14.3 32 32s-14.3 32-32 32l-32 0zM96 384c-17.7 0-32 14.3-32 32s14.3 32 32 32l256 0 0-64-256 0zm32-232c0 13.3 10.7 24 24 24l176 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-176 0c-13.3 0-24 10.7-24 24zm24 72c-13.3 0-24 10.7-24 24s10.7 24 24 24l176 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-176 0z`]},bug:{prefix:`fas`,iconName:`bug`,icon:[576,512,[],`f188`,`M192 96c0-53 43-96 96-96s96 43 96 96l0 3.6c0 15.7-12.7 28.4-28.4 28.4l-135.1 0c-15.7 0-28.4-12.7-28.4-28.4l0-3.6zm345.6 12.8c10.6 14.1 7.7 34.2-6.4 44.8l-97.8 73.3c5.3 8.9 9.3 18.7 11.8 29.1l98.8 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-96 0 0 32c0 2.6-.1 5.3-.2 7.9l83.4 62.5c14.1 10.6 17 30.7 6.4 44.8s-30.7 17-44.8 6.4l-63.1-47.3c-23.2 44.2-66.5 76.2-117.7 83.9L312 280c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 230.2c-51.2-7.7-94.5-39.7-117.7-83.9L83.2 473.6c-14.1 10.6-34.2 7.7-44.8-6.4s-7.7-34.2 6.4-44.8l83.4-62.5c-.1-2.6-.2-5.2-.2-7.9l0-32-96 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l98.8 0c2.5-10.4 6.5-20.2 11.8-29.1L44.8 153.6c-14.1-10.6-17-30.7-6.4-44.8s30.7-17 44.8-6.4L192 184c12.3-5.1 25.8-8 40-8l112 0c14.2 0 27.7 2.8 40 8l108.8-81.6c14.1-10.6 34.2-7.7 44.8 6.4z`]},bullseye:{prefix:`fas`,iconName:`bullseye`,icon:[512,512,[],`f140`,`M448 256a192 192 0 1 0 -384 0 192 192 0 1 0 384 0zM0 256a256 256 0 1 1 512 0 256 256 0 1 1 -512 0zm256 80a80 80 0 1 0 0-160 80 80 0 1 0 0 160zm0-224a144 144 0 1 1 0 288 144 144 0 1 1 0-288zM224 256a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z`]},calculator:{prefix:`fas`,iconName:`calculator`,icon:[384,512,[128425],`f1ec`,`M64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-384c0-35.3-28.7-64-64-64L64 0zM96 64l192 0c17.7 0 32 14.3 32 32l0 32c0 17.7-14.3 32-32 32L96 160c-17.7 0-32-14.3-32-32l0-32c0-17.7 14.3-32 32-32zm16 168a24 24 0 1 1 -48 0 24 24 0 1 1 48 0zm80 24a24 24 0 1 1 0-48 24 24 0 1 1 0 48zm128-24a24 24 0 1 1 -48 0 24 24 0 1 1 48 0zM88 352a24 24 0 1 1 0-48 24 24 0 1 1 0 48zm128-24a24 24 0 1 1 -48 0 24 24 0 1 1 48 0zm80 24a24 24 0 1 1 0-48 24 24 0 1 1 0 48zM64 424c0-13.3 10.7-24 24-24l112 0c13.3 0 24 10.7 24 24s-10.7 24-24 24L88 448c-13.3 0-24-10.7-24-24zm232-24c13.3 0 24 10.7 24 24s-10.7 24-24 24-24-10.7-24-24 10.7-24 24-24z`]},"caret-down":{prefix:`fas`,iconName:`caret-down`,icon:[320,512,[],`f0d7`,`M140.3 376.8c12.6 10.2 31.1 9.5 42.8-2.2l128-128c9.2-9.2 11.9-22.9 6.9-34.9S301.4 192 288.5 192l-256 0c-12.9 0-24.6 7.8-29.6 19.8S.7 237.5 9.9 246.6l128 128 2.4 2.2z`]},"caret-right":{prefix:`fas`,iconName:`caret-right`,icon:[256,512,[],`f0da`,`M249.3 235.8c10.2 12.6 9.5 31.1-2.2 42.8l-128 128c-9.2 9.2-22.9 11.9-34.9 6.9S64.5 396.9 64.5 384l0-256c0-12.9 7.8-24.6 19.8-29.6s25.7-2.2 34.9 6.9l128 128 2.2 2.4z`]},check:{prefix:`fas`,iconName:`check`,icon:[448,512,[10003,10004],`f00c`,`M434.8 70.1c14.3 10.4 17.5 30.4 7.1 44.7l-256 352c-5.5 7.6-14 12.3-23.4 13.1s-18.5-2.7-25.1-9.3l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l101.5 101.5 234-321.7c10.4-14.3 30.4-17.5 44.7-7.1z`]},"chevron-down":{prefix:`fas`,iconName:`chevron-down`,icon:[448,512,[],`f078`,`M201.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 338.7 54.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z`]},"chevron-left":{prefix:`fas`,iconName:`chevron-left`,icon:[320,512,[9001],`f053`,`M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z`]},"chevron-right":{prefix:`fas`,iconName:`chevron-right`,icon:[320,512,[9002],`f054`,`M311.1 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L243.2 256 73.9 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z`]},"circle-check":{prefix:`fas`,iconName:`circle-check`,icon:[512,512,[61533,`check-circle`],`f058`,`M256 512a256 256 0 1 1 0-512 256 256 0 1 1 0 512zM374 145.7c-10.7-7.8-25.7-5.4-33.5 5.3L221.1 315.2 169 263.1c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l72 72c5 5 11.8 7.5 18.8 7s13.4-4.1 17.5-9.8L379.3 179.2c7.8-10.7 5.4-25.7-5.3-33.5z`]},"circle-exclamation":{prefix:`fas`,iconName:`circle-exclamation`,icon:[512,512,[`exclamation-circle`],`f06a`,`M256 512a256 256 0 1 1 0-512 256 256 0 1 1 0 512zm0-192a32 32 0 1 0 0 64 32 32 0 1 0 0-64zm0-192c-18.2 0-32.7 15.5-31.4 33.7l7.4 104c.9 12.6 11.4 22.3 23.9 22.3 12.6 0 23-9.7 23.9-22.3l7.4-104c1.3-18.2-13.1-33.7-31.4-33.7z`]},"circle-info":{prefix:`fas`,iconName:`circle-info`,icon:[512,512,[`info-circle`],`f05a`,`M256 512a256 256 0 1 0 0-512 256 256 0 1 0 0 512zM224 160a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm-8 64l48 0c13.3 0 24 10.7 24 24l0 88 8 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-80 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l24 0 0-64-24 0c-13.3 0-24-10.7-24-24s10.7-24 24-24z`]},"circle-question":{prefix:`fas`,iconName:`circle-question`,icon:[512,512,[62108,`question-circle`],`f059`,`M256 512a256 256 0 1 0 0-512 256 256 0 1 0 0 512zm0-336c-17.7 0-32 14.3-32 32 0 13.3-10.7 24-24 24s-24-10.7-24-24c0-44.2 35.8-80 80-80s80 35.8 80 80c0 47.2-36 67.2-56 74.5l0 3.8c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-8.1c0-20.5 14.8-35.2 30.1-40.2 6.4-2.1 13.2-5.5 18.2-10.3 4.3-4.2 7.7-10 7.7-19.6 0-17.7-14.3-32-32-32zM224 368a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z`]},clipboard:{prefix:`fas`,iconName:`clipboard`,icon:[384,512,[128203],`f328`,`M320 32l-8.6 0C300.4 12.9 279.7 0 256 0L128 0C104.3 0 83.6 12.9 72.6 32L64 32C28.7 32 0 60.7 0 96L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-352c0-35.3-28.7-64-64-64zM136 112c-13.3 0-24-10.7-24-24s10.7-24 24-24l112 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-112 0z`]},copy:{prefix:`fas`,iconName:`copy`,icon:[448,512,[],`f0c5`,`M192 0c-35.3 0-64 28.7-64 64l0 256c0 35.3 28.7 64 64 64l192 0c35.3 0 64-28.7 64-64l0-200.6c0-17.4-7.1-34.1-19.7-46.2L370.6 17.8C358.7 6.4 342.8 0 326.3 0L192 0zM64 128c-35.3 0-64 28.7-64 64L0 448c0 35.3 28.7 64 64 64l192 0c35.3 0 64-28.7 64-64l0-16-64 0 0 16-192 0 0-256 16 0 0-64-16 0z`]},discord:Tt,download:{prefix:`fas`,iconName:`download`,icon:[448,512,[],`f019`,`M256 32c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 210.7-41.4-41.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l96 96c12.5 12.5 32.8 12.5 45.3 0l96-96c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 242.7 256 32zM64 320c-35.3 0-64 28.7-64 64l0 32c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-32c0-35.3-28.7-64-64-64l-46.9 0-56.6 56.6c-31.2 31.2-81.9 31.2-113.1 0L110.9 320 64 320zm304 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z`]},ellipsis:{prefix:`fas`,iconName:`ellipsis`,icon:[448,512,[`ellipsis-h`],`f141`,`M0 256a56 56 0 1 1 112 0 56 56 0 1 1 -112 0zm168 0a56 56 0 1 1 112 0 56 56 0 1 1 -112 0zm224-56a56 56 0 1 1 0 112 56 56 0 1 1 0-112z`]},expand:{prefix:`fas`,iconName:`expand`,icon:[448,512,[],`f065`,`M32 32C14.3 32 0 46.3 0 64l0 96c0 17.7 14.3 32 32 32s32-14.3 32-32l0-64 64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L32 32zM64 352c0-17.7-14.3-32-32-32S0 334.3 0 352l0 96c0 17.7 14.3 32 32 32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0 0-64zM320 32c-17.7 0-32 14.3-32 32s14.3 32 32 32l64 0 0 64c0 17.7 14.3 32 32 32s32-14.3 32-32l0-96c0-17.7-14.3-32-32-32l-96 0zM448 352c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 64-64 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l96 0c17.7 0 32-14.3 32-32l0-96z`]},eye:{prefix:`fas`,iconName:`eye`,icon:[576,512,[128065],`f06e`,`M288 32c-80.8 0-145.5 36.8-192.6 80.6-46.8 43.5-78.1 95.4-93 131.1-3.3 7.9-3.3 16.7 0 24.6 14.9 35.7 46.2 87.7 93 131.1 47.1 43.7 111.8 80.6 192.6 80.6s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1 3.3-7.9 3.3-16.7 0-24.6-14.9-35.7-46.2-87.7-93-131.1-47.1-43.7-111.8-80.6-192.6-80.6zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64-11.5 0-22.3-3-31.7-8.4-1 10.9-.1 22.1 2.9 33.2 13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-12.2-45.7-55.5-74.8-101.1-70.8 5.3 9.3 8.4 20.1 8.4 31.7z`]},"eye-slash":{prefix:`fas`,iconName:`eye-slash`,icon:[576,512,[],`f070`,`M41-24.9c-9.4-9.4-24.6-9.4-33.9 0S-2.3-.3 7 9.1l528 528c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-96.4-96.4c2.7-2.4 5.4-4.8 8-7.2 46.8-43.5 78.1-95.4 93-131.1 3.3-7.9 3.3-16.7 0-24.6-14.9-35.7-46.2-87.7-93-131.1-47.1-43.7-111.8-80.6-192.6-80.6-56.8 0-105.6 18.2-146 44.2L41-24.9zM204.5 138.7c23.5-16.8 52.4-26.7 83.5-26.7 79.5 0 144 64.5 144 144 0 31.1-9.9 59.9-26.7 83.5l-34.7-34.7c12.7-21.4 17-47.7 10.1-73.7-13.7-51.2-66.4-81.6-117.6-67.9-8.6 2.3-16.7 5.7-24 10l-34.7-34.7zM325.3 395.1c-11.9 3.2-24.4 4.9-37.3 4.9-79.5 0-144-64.5-144-144 0-12.9 1.7-25.4 4.9-37.3L69.4 139.2c-32.6 36.8-55 75.8-66.9 104.5-3.3 7.9-3.3 16.7 0 24.6 14.9 35.7 46.2 87.7 93 131.1 47.1 43.7 111.8 80.6 192.6 80.6 37.3 0 71.2-7.9 101.5-20.6l-64.2-64.2z`]},"file-arrow-up":{prefix:`fas`,iconName:`file-arrow-up`,icon:[384,512,[`file-upload`],`f574`,`M0 64C0 28.7 28.7 0 64 0L213.5 0c17 0 33.3 6.7 45.3 18.7L365.3 125.3c12 12 18.7 28.3 18.7 45.3L384 448c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 64zm208-5.5l0 93.5c0 13.3 10.7 24 24 24L325.5 176 208 58.5zM209 263c-9.4-9.4-24.6-9.4-33.9 0l-64 64c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l23-23 0 86.1c0 13.3 10.7 24 24 24s24-10.7 24-24l0-86.1 23 23c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-64-64z`]},filter:{prefix:`fas`,iconName:`filter`,icon:[512,512,[],`f0b0`,`M32 64C19.1 64 7.4 71.8 2.4 83.8S.2 109.5 9.4 118.6L192 301.3 192 416c0 8.5 3.4 16.6 9.4 22.6l64 64c9.2 9.2 22.9 11.9 34.9 6.9S320 492.9 320 480l0-178.7 182.6-182.6c9.2-9.2 11.9-22.9 6.9-34.9S492.9 64 480 64L32 64z`]},"gauge-high":{prefix:`fas`,iconName:`gauge-high`,icon:[512,512,[62461,`tachometer-alt`,`tachometer-alt-fast`],`f625`,`M0 256a256 256 0 1 1 512 0 256 256 0 1 1 -512 0zM288 96a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zM256 416c35.3 0 64-28.7 64-64 0-16.2-6-31.1-16-42.3l69.5-138.9c5.9-11.9 1.1-26.3-10.7-32.2s-26.3-1.1-32.2 10.7L261.1 288.2c-1.7-.1-3.4-.2-5.1-.2-35.3 0-64 28.7-64 64s28.7 64 64 64zM176 144a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zM96 288a32 32 0 1 0 0-64 32 32 0 1 0 0 64zm352-32a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z`]},gear:{prefix:`fas`,iconName:`gear`,icon:[512,512,[9881,`cog`],`f013`,`M195.1 9.5C198.1-5.3 211.2-16 226.4-16l59.8 0c15.2 0 28.3 10.7 31.3 25.5L332 79.5c14.1 6 27.3 13.7 39.3 22.8l67.8-22.5c14.4-4.8 30.2 1.2 37.8 14.4l29.9 51.8c7.6 13.2 4.9 29.8-6.5 39.9L447 233.3c.9 7.4 1.3 15 1.3 22.7s-.5 15.3-1.3 22.7l53.4 47.5c11.4 10.1 14 26.8 6.5 39.9l-29.9 51.8c-7.6 13.1-23.4 19.2-37.8 14.4l-67.8-22.5c-12.1 9.1-25.3 16.7-39.3 22.8l-14.4 69.9c-3.1 14.9-16.2 25.5-31.3 25.5l-59.8 0c-15.2 0-28.3-10.7-31.3-25.5l-14.4-69.9c-14.1-6-27.2-13.7-39.3-22.8L73.5 432.3c-14.4 4.8-30.2-1.2-37.8-14.4L5.8 366.1c-7.6-13.2-4.9-29.8 6.5-39.9l53.4-47.5c-.9-7.4-1.3-15-1.3-22.7s.5-15.3 1.3-22.7L12.3 185.8c-11.4-10.1-14-26.8-6.5-39.9L35.7 94.1c7.6-13.2 23.4-19.2 37.8-14.4l67.8 22.5c12.1-9.1 25.3-16.7 39.3-22.8L195.1 9.5zM256.3 336a80 80 0 1 0 -.6-160 80 80 0 1 0 .6 160z`]},github:Et,globe:{prefix:`fas`,iconName:`globe`,icon:[512,512,[127760],`f0ac`,`M351.9 280l-190.9 0c2.9 64.5 17.2 123.9 37.5 167.4 11.4 24.5 23.7 41.8 35.1 52.4 11.2 10.5 18.9 12.2 22.9 12.2s11.7-1.7 22.9-12.2c11.4-10.6 23.7-28 35.1-52.4 20.3-43.5 34.6-102.9 37.5-167.4zM160.9 232l190.9 0C349 167.5 334.7 108.1 314.4 64.6 303 40.2 290.7 22.8 279.3 12.2 268.1 1.7 260.4 0 256.4 0s-11.7 1.7-22.9 12.2c-11.4 10.6-23.7 28-35.1 52.4-20.3 43.5-34.6 102.9-37.5 167.4zm-48 0C116.4 146.4 138.5 66.9 170.8 14.7 78.7 47.3 10.9 131.2 1.5 232l111.4 0zM1.5 280c9.4 100.8 77.2 184.7 169.3 217.3-32.3-52.2-54.4-131.7-57.9-217.3L1.5 280zm398.4 0c-3.5 85.6-25.6 165.1-57.9 217.3 92.1-32.7 159.9-116.5 169.3-217.3l-111.4 0zm111.4-48C501.9 131.2 434.1 47.3 342 14.7 374.3 66.9 396.4 146.4 399.9 232l111.4 0z`]},"grip-lines":{prefix:`fas`,iconName:`grip-lines`,icon:[448,512,[],`f7a4`,`M32 288c-17.7 0-32 14.3-32 32s14.3 32 32 32l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L32 288zm0-128c-17.7 0-32 14.3-32 32s14.3 32 32 32l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L32 160z`]},"list-check":{prefix:`fas`,iconName:`list-check`,icon:[512,512,[`tasks`],`f0ae`,`M133.8 36.3c10.9 7.6 13.5 22.6 5.9 33.4l-56 80c-4.1 5.8-10.5 9.5-17.6 10.1S52 158 47 153L7 113C-2.3 103.6-2.3 88.4 7 79S31.6 69.7 41 79l19.8 19.8 39.6-56.6c7.6-10.9 22.6-13.5 33.4-5.9zm0 160c10.9 7.6 13.5 22.6 5.9 33.4l-56 80c-4.1 5.8-10.5 9.5-17.6 10.1S52 318 47 313L7 273c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l19.8 19.8 39.6-56.6c7.6-10.9 22.6-13.5 33.4-5.9zM224 96c0-17.7 14.3-32 32-32l224 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-224 0c-17.7 0-32-14.3-32-32zm0 160c0-17.7 14.3-32 32-32l224 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-224 0c-17.7 0-32-14.3-32-32zM160 416c0-17.7 14.3-32 32-32l288 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-288 0c-17.7 0-32-14.3-32-32zM64 376a40 40 0 1 1 0 80 40 40 0 1 1 0-80z`]},lock:{prefix:`fas`,iconName:`lock`,icon:[384,512,[128274],`f023`,`M128 96l0 64 128 0 0-64c0-35.3-28.7-64-64-64s-64 28.7-64 64zM64 160l0-64C64 25.3 121.3-32 192-32S320 25.3 320 96l0 64c35.3 0 64 28.7 64 64l0 224c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 224c0-35.3 28.7-64 64-64z`]},"magnifying-glass-minus":{prefix:`fas`,iconName:`magnifying-glass-minus`,icon:[512,512,[`search-minus`],`f010`,`M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376C296.3 401.1 253.9 416 208 416 93.1 416 0 322.9 0 208S93.1 0 208 0 416 93.1 416 208zM136 184c-13.3 0-24 10.7-24 24s10.7 24 24 24l144 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-144 0z`]},"magnifying-glass-plus":{prefix:`fas`,iconName:`magnifying-glass-plus`,icon:[512,512,[`search-plus`],`f00e`,`M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376C296.3 401.1 253.9 416 208 416 93.1 416 0 322.9 0 208S93.1 0 208 0 416 93.1 416 208zM208 112c-13.3 0-24 10.7-24 24l0 48-48 0c-13.3 0-24 10.7-24 24s10.7 24 24 24l48 0 0 48c0 13.3 10.7 24 24 24s24-10.7 24-24l0-48 48 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-48 0 0-48c0-13.3-10.7-24-24-24z`]},"map-pin":{prefix:`fas`,iconName:`map-pin`,icon:[320,512,[128205],`f276`,`M192 284.4C256.1 269.9 304 212.5 304 144 304 64.5 239.5 0 160 0S16 64.5 16 144c0 68.5 47.9 125.9 112 140.4L128 480c0 17.7 14.3 32 32 32s32-14.3 32-32l0-195.6zM168 96c-30.9 0-56 25.1-56 56 0 13.3-10.7 24-24 24s-24-10.7-24-24c0-57.4 46.6-104 104-104 13.3 0 24 10.7 24 24s-10.7 24-24 24z`]},paste:{prefix:`fas`,iconName:`paste`,icon:[512,512,[`file-clipboard`],`f0ea`,`M64 0C28.7 0 0 28.7 0 64L0 384c0 35.3 28.7 64 64 64l112 0 0-224c0-61.9 50.1-112 112-112l64 0 0-48c0-35.3-28.7-64-64-64L64 0zM248 112l-144 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l144 0c13.3 0 24 10.7 24 24s-10.7 24-24 24zm40 48c-35.3 0-64 28.7-64 64l0 224c0 35.3 28.7 64 64 64l160 0c35.3 0 64-28.7 64-64l0-165.5c0-17-6.7-33.3-18.7-45.3l-58.5-58.5c-12-12-28.3-18.7-45.3-18.7L288 160z`]},patreon:Dt,pause:{prefix:`fas`,iconName:`pause`,icon:[384,512,[9208],`f04c`,`M48 32C21.5 32 0 53.5 0 80L0 432c0 26.5 21.5 48 48 48l64 0c26.5 0 48-21.5 48-48l0-352c0-26.5-21.5-48-48-48L48 32zm224 0c-26.5 0-48 21.5-48 48l0 352c0 26.5 21.5 48 48 48l64 0c26.5 0 48-21.5 48-48l0-352c0-26.5-21.5-48-48-48l-64 0z`]},paw:{prefix:`fas`,iconName:`paw`,icon:[512,512,[],`f1b0`,`M234.5 92.9c14.3 42.9-.3 86.2-32.6 96.8s-70.1-15.6-84.4-58.5 .3-86.2 32.6-96.8 70.1 15.6 84.4 58.5zM100.4 198.6c18.9 32.4 14.3 70.1-10.2 84.1s-59.7-.9-78.5-33.3-14.3-70.1 10.2-84.1 59.7 .9 78.5 33.3zM69.2 401.2C121.6 259.9 214.7 224 256 224s134.4 35.9 186.8 177.2c3.6 9.7 5.2 20.1 5.2 30.5l0 1.6c0 25.8-20.9 46.7-46.7 46.7-11.5 0-22.9-1.4-34-4.2l-88-22c-15.3-3.8-31.3-3.8-46.6 0l-88 22c-11.1 2.8-22.5 4.2-34 4.2-25.8 0-46.7-20.9-46.7-46.7l0-1.6c0-10.4 1.6-20.8 5.2-30.5zM421.8 282.7c-24.5-14-29.1-51.7-10.2-84.1s54-47.3 78.5-33.3 29.1 51.7 10.2 84.1-54 47.3-78.5 33.3zM310.1 189.7c-32.3-10.6-46.9-53.9-32.6-96.8s52.1-69.1 84.4-58.5 46.9 53.9 32.6 96.8-52.1 69.1-84.4 58.5z`]},pencil:{prefix:`fas`,iconName:`pencil`,icon:[512,512,[9999,61504,`pencil-alt`],`f303`,`M36.4 353.2c4.1-14.6 11.8-27.9 22.6-38.7l181.2-181.2 33.9-33.9c16.6 16.6 51.3 51.3 104 104l33.9 33.9-33.9 33.9-181.2 181.2c-10.7 10.7-24.1 18.5-38.7 22.6L30.4 510.6c-8.3 2.3-17.3 0-23.4-6.2S-1.4 489.3 .9 481L36.4 353.2zm55.6-3.7c-4.4 4.7-7.6 10.4-9.3 16.6l-24.1 86.9 86.9-24.1c6.4-1.8 12.2-5.1 17-9.7L91.9 349.5zm354-146.1c-16.6-16.6-51.3-51.3-104-104L308 65.5C334.5 39 349.4 24.1 352.9 20.6 366.4 7 384.8-.6 404-.6S441.6 7 455.1 20.6l35.7 35.7C504.4 69.9 512 88.3 512 107.4s-7.6 37.6-21.2 51.1c-3.5 3.5-18.4 18.4-44.9 44.9z`]},play:{prefix:`fas`,iconName:`play`,icon:[448,512,[9654],`f04b`,`M91.2 36.9c-12.4-6.8-27.4-6.5-39.6 .7S32 57.9 32 72l0 368c0 14.1 7.5 27.2 19.6 34.4s27.2 7.5 39.6 .7l336-184c12.8-7 20.8-20.5 20.8-35.1s-8-28.1-20.8-35.1l-336-184z`]},plus:{prefix:`fas`,iconName:`plus`,icon:[448,512,[10133,61543,`add`],`2b`,`M256 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 160-160 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l160 0 0 160c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160 160 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-160 0 0-160z`]},"plus-minus":{prefix:`fas`,iconName:`plus-minus`,icon:[384,512,[],`e43c`,`M224 32c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 128-128 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l128 0 0 128c0 17.7 14.3 32 32 32s32-14.3 32-32l0-128 128 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-128 0 0-128zM0 480c0 17.7 14.3 32 32 32l320 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L32 448c-17.7 0-32 14.3-32 32z`]},"right-from-bracket":{prefix:`fas`,iconName:`right-from-bracket`,icon:[512,512,[`sign-out-alt`],`f2f5`,`M505 273c9.4-9.4 9.4-24.6 0-33.9L361 95c-6.9-6.9-17.2-8.9-26.2-5.2S320 102.3 320 112l0 80-112 0c-26.5 0-48 21.5-48 48l0 32c0 26.5 21.5 48 48 48l112 0 0 80c0 9.7 5.8 18.5 14.8 22.2s19.3 1.7 26.2-5.2L505 273zM160 96c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 32C43 32 0 75 0 128L0 384c0 53 43 96 96 96l64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l64 0z`]},"rotate-left":{prefix:`fas`,iconName:`rotate-left`,icon:[512,512,[`rotate-back`,`rotate-backward`,`undo-alt`],`f2ea`,`M24 192l144 0c9.7 0 18.5-5.8 22.2-14.8s1.7-19.3-5.2-26.2l-46.7-46.7c75.3-58.6 184.3-53.3 253.5 15.9 75 75 75 196.5 0 271.5s-196.5 75-271.5 0c-10.2-10.2-19-21.3-26.4-33-9.5-14.9-29.3-19.3-44.2-9.8s-19.3 29.3-9.8 44.2C49.7 408.7 61.4 423.5 75 437 175 537 337 537 437 437S537 175 437 75C342.8-19.3 193.3-24.7 92.7 58.8L41 7C34.1 .2 23.8-1.9 14.8 1.8S0 14.3 0 24L0 168c0 13.3 10.7 24 24 24z`]},"scale-balanced":{prefix:`fas`,iconName:`scale-balanced`,icon:[640,512,[9878,`balance-scale`],`f24e`,`M384 32l128 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L398.4 96c-5.2 25.8-22.9 47.1-46.4 57.3l0 294.7 160 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-384 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l160 0 0-294.7c-23.5-10.3-41.2-31.6-46.4-57.3L128 96c-17.7 0-32-14.3-32-32s14.3-32 32-32l128 0c14.6-19.4 37.8-32 64-32s49.4 12.6 64 32zm55.6 288L584.4 320 512 195.8 439.6 320zM512 416c-62.9 0-115.2-34-126-78.9-2.6-11 1-22.3 6.7-32.1l95.2-163.2c5-8.6 14.2-13.8 24.1-13.8s19.1 5.3 24.1 13.8l95.2 163.2c5.7 9.8 9.3 21.1 6.7 32.1-10.8 44.8-63.1 78.9-126 78.9zM126.8 195.8L54.4 320 199.3 320 126.8 195.8zM.9 337.1c-2.6-11 1-22.3 6.7-32.1l95.2-163.2c5-8.6 14.2-13.8 24.1-13.8s19.1 5.3 24.1 13.8l95.2 163.2c5.7 9.8 9.3 21.1 6.7 32.1-10.8 44.8-63.1 78.9-126 78.9S11.7 382 .9 337.1z`]},"screwdriver-wrench":{prefix:`fas`,iconName:`screwdriver-wrench`,icon:[576,512,[`tools`],`f7d9`,`M70.8-6.7c5.4-5.4 13.8-6.2 20.2-2L209.9 70.5c8.9 5.9 14.2 15.9 14.2 26.6l0 49.6 90.8 90.8c33.3-15 73.9-8.9 101.2 18.5L542.2 382.1c18.7 18.7 18.7 49.1 0 67.9l-60.1 60.1c-18.7 18.7-49.1 18.7-67.9 0L288.1 384c-27.4-27.4-33.5-67.9-18.5-101.2l-90.8-90.8-49.6 0c-10.7 0-20.7-5.3-26.6-14.2L23.4 58.9c-4.2-6.3-3.4-14.8 2-20.2L70.8-6.7zm145 303.5c-6.3 36.9 2.3 75.9 26.2 107.2l-94.9 95c-28.1 28.1-73.7 28.1-101.8 0s-28.1-73.7 0-101.8l135.4-135.5 35.2 35.1zM384.1 0c20.1 0 39.4 3.7 57.1 10.5 10 3.8 11.8 16.5 4.3 24.1L388.8 91.3c-3 3-4.7 7.1-4.7 11.3l0 41.4c0 8.8 7.2 16 16 16l41.4 0c4.2 0 8.3-1.7 11.3-4.7l56.7-56.7c7.6-7.5 20.3-5.7 24.1 4.3 6.8 17.7 10.5 37 10.5 57.1 0 43.2-17.2 82.3-45 111.1l-49.1-49.1c-33.1-33-78.5-45.7-121.1-38.4l-56.8-56.8 0-29.7-.2-5c-.8-12.4-4.4-24.3-10.5-34.9 29.4-35 73.4-57.2 122.7-57.3z`]},shirt:{prefix:`fas`,iconName:`shirt`,icon:[640,512,[128085,`t-shirt`,`tshirt`],`f553`,`M320.2 112c44.2 0 80-35.8 80-80l53.5 0c17 0 33.3 6.7 45.3 18.7L617.6 169.4c12.5 12.5 12.5 32.8 0 45.3l-50.7 50.7c-12.5 12.5-32.8 12.5-45.3 0l-41.4-41.4 0 224c0 35.3-28.7 64-64 64l-192 0c-35.3 0-64-28.7-64-64l0-224-41.4 41.4c-12.5 12.5-32.8 12.5-45.3 0L22.9 214.6c-12.5-12.5-12.5-32.8 0-45.3L141.5 50.7c12-12 28.3-18.7 45.3-18.7l53.5 0c0 44.2 35.8 80 80 80z`]},spinner:{prefix:`fas`,iconName:`spinner`,icon:[512,512,[],`f110`,`M208 48a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm0 416a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zM48 208a48 48 0 1 1 0 96 48 48 0 1 1 0-96zm368 48a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zM75 369.1A48 48 0 1 1 142.9 437 48 48 0 1 1 75 369.1zM75 75A48 48 0 1 1 142.9 142.9 48 48 0 1 1 75 75zM437 369.1A48 48 0 1 1 369.1 437 48 48 0 1 1 437 369.1z`]},stairs:{prefix:`fas`,iconName:`stairs`,icon:[576,512,[],`e289`,`M384 64c0-17.7 14.3-32 32-32l128 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-96 0 0 96c0 17.7-14.3 32-32 32l-96 0 0 96c0 17.7-14.3 32-32 32l-96 0 0 96c0 17.7-14.3 32-32 32L32 480c-17.7 0-32-14.3-32-32s14.3-32 32-32l96 0 0-96c0-17.7 14.3-32 32-32l96 0 0-96c0-17.7 14.3-32 32-32l96 0 0-96z`]},star:{prefix:`fas`,iconName:`star`,icon:[576,512,[11088,61446],`f005`,`M309.5-18.9c-4.1-8-12.4-13.1-21.4-13.1s-17.3 5.1-21.4 13.1L193.1 125.3 33.2 150.7c-8.9 1.4-16.3 7.7-19.1 16.3s-.5 18 5.8 24.4l114.4 114.5-25.2 159.9c-1.4 8.9 2.3 17.9 9.6 23.2s16.9 6.1 25 2L288.1 417.6 432.4 491c8 4.1 17.7 3.3 25-2s11-14.2 9.6-23.2L441.7 305.9 556.1 191.4c6.4-6.4 8.6-15.8 5.8-24.4s-10.1-14.9-19.1-16.3L383 125.3 309.5-18.9z`]},"table-cells":{prefix:`fas`,iconName:`table-cells`,icon:[448,512,[`th`],`f00a`,`M384 96l0 64-64 0 0-64 64 0zm0 128l0 64-64 0 0-64 64 0zm0 128l0 64-64 0 0-64 64 0zM256 288l-64 0 0-64 64 0 0 64zm-64 64l64 0 0 64-64 0 0-64zm-64-64l-64 0 0-64 64 0 0 64zM64 352l64 0 0 64-64 0 0-64zm0-192l0-64 64 0 0 64-64 0zm128 0l0-64 64 0 0 64-64 0zM64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L64 32z`]},"triangle-exclamation":{prefix:`fas`,iconName:`triangle-exclamation`,icon:[512,512,[9888,`exclamation-triangle`,`warning`],`f071`,`M256 0c14.7 0 28.2 8.1 35.2 21l216 400c6.7 12.4 6.4 27.4-.8 39.5S486.1 480 472 480L40 480c-14.1 0-27.2-7.4-34.4-19.5s-7.5-27.1-.8-39.5l216-400c7-12.9 20.5-21 35.2-21zm0 352a32 32 0 1 0 0 64 32 32 0 1 0 0-64zm0-192c-18.2 0-32.7 15.5-31.4 33.7l7.4 104c.9 12.5 11.4 22.3 23.9 22.3 12.6 0 23-9.7 23.9-22.3l7.4-104c1.3-18.2-13.1-33.7-31.4-33.7z`]},user:{prefix:`fas`,iconName:`user`,icon:[448,512,[128100,62144,62470,`user-alt`,`user-large`],`f007`,`M224 248a120 120 0 1 0 0-240 120 120 0 1 0 0 240zm-29.7 56C95.8 304 16 383.8 16 482.3 16 498.7 29.3 512 45.7 512l356.6 0c16.4 0 29.7-13.3 29.7-29.7 0-98.5-79.8-178.3-178.3-178.3l-59.4 0z`]},wow:{prefix:`fab`,iconName:`wow`,icon:[20,20,[],``,`M20 10.027a10.3 10.3 0 0 0 -1.752 -5.686V1.894a0.143 0.143 0 0 0 -0.133 -0.133H15.667a9.953 9.953 0 0 0 -11.3 0H1.919a0.118 0.118 0 0 0 -0.133 0.133v2.414a10 10 0 0 0 0 11.4v2.414a0.143 0.143 0 0 0 0.133 0.133h2.448a10.061 10.061 0 0 0 11.371 -0.033h2.414a0.153 0.153 0 0 0 0.133 -0.167h0V15.646A9.913 9.913 0 0 0 20 10.027Zm-18.676 0a8.662 8.662 0 1 1 8.662 8.662h0A8.647 8.647 0 0 1 1.324 10.027ZM4.233 5.332h3.271a6.129 6.129 0 0 0 -0.1 1.124c0.133 1.452 1.09 5.486 1.09 5.486l1.552 -6.276l1.59 6.148s0.957 -5.424 0.957 -5.786a1.014 1.014 0 0 0 -0.4 -0.7h3.471a3.57 3.57 0 0 0 -0.99 1.586c-0.3 1.19 -1.357 7.2 -1.357 7.571a2.213 2.213 0 0 0 0.4 1.09h-3.238a4.052 4.052 0 0 0 0.1 -0.89c0 -0.562 -0.5 -3.171 -0.5 -3.171s-0.662 2.71 -0.662 3.2a1.9 1.9 0 0 0 0.2 0.857h-3.271s0.629 -0.462 0.629 -0.89c-0.067 -1.224 -1.786 -7.6 -1.919 -8.1A2.071 2.071 0 0 0 4.233 5.332Z`]},xmark:{prefix:`fas`,iconName:`xmark`,icon:[384,512,[128473,10005,10006,10060,215,`close`,`multiply`,`remove`,`times`],`f00d`,`M55.1 73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L147.2 256 9.9 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192.5 301.3 329.9 438.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.8 256 375.1 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192.5 210.7 55.1 73.4z`]}},It={"circle-check":jt,"circle-question":kt,copy:Nt,eye:Ot,"eye-slash":Pt,star:Mt,user:At},Lt=(e,t)=>t===`regular`&&It[e]||Ft[e];function Rt(e,t){(t==null||t>e.length)&&(t=e.length);for(var n=0,r=Array(t);n<t;n++)r[n]=e[n];return r}function zt(e){if(Array.isArray(e))return e}function Bt(e){if(Array.isArray(e))return Rt(e)}function Vt(e,t){if(!(e instanceof t))throw TypeError(`Cannot call a class as a function`)}function Ht(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,`value`in r&&(r.writable=!0),Object.defineProperty(e,Qt(r.key),r)}}function Ut(e,t,n){return t&&Ht(e.prototype,t),n&&Ht(e,n),Object.defineProperty(e,"prototype",{writable:!1}),e}function Wt(e,t){var n=typeof Symbol<`u`&&e[Symbol.iterator]||e[`@@iterator`];if(!n){if(Array.isArray(e)||(n=en(e))||t&&e&&typeof e.length==`number`){n&&(e=n);var r=0,i=function(){};return{s:i,n:function(){return r>=e.length?{done:!0}:{done:!1,value:e[r++]}},e:function(e){throw e},f:i}}throw TypeError(`Invalid attempt to iterate non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}var a,o=!0,s=!1;return{s:function(){n=n.call(e)},n:function(){var e=n.next();return o=e.done,e},e:function(e){s=!0,a=e},f:function(){try{o||n.return==null||n.return()}finally{if(s)throw a}}}}function A(e,t,n){return(t=Qt(t))in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function Gt(e){if(typeof Symbol<`u`&&e[Symbol.iterator]!=null||e[`@@iterator`]!=null)return Array.from(e)}function Kt(e,t){var n=e==null?null:typeof Symbol<`u`&&e[Symbol.iterator]||e[`@@iterator`];if(n!=null){var r,i,a,o,s=[],c=!0,l=!1;try{if(a=(n=n.call(e)).next,t===0){if(Object(n)!==n)return;c=!1}else for(;!(c=(r=a.call(n)).done)&&(s.push(r.value),s.length!==t);c=!0);}catch(e){l=!0,i=e}finally{try{if(!c&&n.return!=null&&(o=n.return(),Object(o)!==o))return}finally{if(l)throw i}}return s}}function qt(){throw TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function Jt(){throw TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function Yt(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function j(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]==null?{}:arguments[t];t%2?Yt(Object(n),!0).forEach(function(t){A(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):Yt(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}function Xt(e,t){return zt(e)||Kt(e,t)||en(e,t)||qt()}function M(e){return Bt(e)||Gt(e)||en(e)||Jt()}function Zt(e,t){if(typeof e!=`object`||!e)return e;var n=e[Symbol.toPrimitive];if(n!==void 0){var r=n.call(e,t||`default`);if(typeof r!=`object`)return r;throw TypeError(`@@toPrimitive must return a primitive value.`)}return(t===`string`?String:Number)(e)}function Qt(e){var t=Zt(e,`string`);return typeof t==`symbol`?t:t+``}function $t(e){"@babel/helpers - typeof";return $t=typeof Symbol==`function`&&typeof Symbol.iterator==`symbol`?function(e){return typeof e}:function(e){return e&&typeof Symbol==`function`&&e.constructor===Symbol&&e!==Symbol.prototype?`symbol`:typeof e},$t(e)}function en(e,t){if(e){if(typeof e==`string`)return Rt(e,t);var n={}.toString.call(e).slice(8,-1);return n===`Object`&&e.constructor&&(n=e.constructor.name),n===`Map`||n===`Set`?Array.from(e):n===`Arguments`||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?Rt(e,t):void 0}}var tn=function(){},nn={},rn={},an=null,on={mark:tn,measure:tn};try{typeof window<`u`&&(nn=window),typeof document<`u`&&(rn=document),typeof MutationObserver<`u`&&(an=MutationObserver),typeof performance<`u`&&(on=performance)}catch{}var sn=(nn.navigator||{}).userAgent,cn=sn===void 0?``:sn,N=nn,P=rn,ln=an,un=on;N.document;var F=!!P.documentElement&&!!P.head&&typeof P.addEventListener==`function`&&typeof P.createElement==`function`,dn=~cn.indexOf(`MSIE`)||~cn.indexOf(`Trident/`),fn,pn=/fa(k|kd|s|r|l|t|d|dr|dl|dt|b|slr|slpr|wsb|tl|ns|nds|es|gt|jr|jfr|jdr|usb|ufsb|udsb|cr|ss|sr|sl|st|sds|sdr|sdl|sdt|sldr|slpdr|pr|ms|vs)?[\-\ ]/,mn=/Font ?Awesome ?([567 ]*)(Solid|Regular|Light|Thin|Duotone|Brands|Free|Pro|Sharp Duotone|Sharp|Kit|Notdog Duo|Notdog|Chisel|Etch|Graphite|Thumbprint|Jelly Fill|Jelly Duo|Jelly|Utility|Utility Fill|Utility Duo|Slab Press|Slab|Slab Duo|Slab Press Duo|Pixel|Mosaic|Vellum|Whiteboard)?.*/i,hn={classic:{fa:`solid`,fas:`solid`,"fa-solid":`solid`,far:`regular`,"fa-regular":`regular`,fal:`light`,"fa-light":`light`,fat:`thin`,"fa-thin":`thin`,fab:`brands`,"fa-brands":`brands`},duotone:{fa:`solid`,fad:`solid`,"fa-solid":`solid`,"fa-duotone":`solid`,fadr:`regular`,"fa-regular":`regular`,fadl:`light`,"fa-light":`light`,fadt:`thin`,"fa-thin":`thin`},sharp:{fa:`solid`,fass:`solid`,"fa-solid":`solid`,fasr:`regular`,"fa-regular":`regular`,fasl:`light`,"fa-light":`light`,fast:`thin`,"fa-thin":`thin`},"sharp-duotone":{fa:`solid`,fasds:`solid`,"fa-solid":`solid`,fasdr:`regular`,"fa-regular":`regular`,fasdl:`light`,"fa-light":`light`,fasdt:`thin`,"fa-thin":`thin`},slab:{"fa-regular":`regular`,faslr:`regular`},"slab-press":{"fa-regular":`regular`,faslpr:`regular`},"slab-duo":{"fa-regular":`regular`,fasldr:`regular`},"slab-press-duo":{"fa-regular":`regular`,faslpdr:`regular`},thumbprint:{"fa-light":`light`,fatl:`light`},vellum:{"fa-solid":`solid`,favs:`solid`},pixel:{"fa-regular":`regular`,fapr:`regular`},mosaic:{"fa-solid":`solid`,fams:`solid`},whiteboard:{"fa-semibold":`semibold`,fawsb:`semibold`},notdog:{"fa-solid":`solid`,fans:`solid`},"notdog-duo":{"fa-solid":`solid`,fands:`solid`},etch:{"fa-solid":`solid`,faes:`solid`},graphite:{"fa-thin":`thin`,fagt:`thin`},jelly:{"fa-regular":`regular`,fajr:`regular`},"jelly-fill":{"fa-regular":`regular`,fajfr:`regular`},"jelly-duo":{"fa-regular":`regular`,fajdr:`regular`},chisel:{"fa-regular":`regular`,facr:`regular`},utility:{"fa-semibold":`semibold`,fausb:`semibold`},"utility-duo":{"fa-semibold":`semibold`,faudsb:`semibold`},"utility-fill":{"fa-semibold":`semibold`,faufsb:`semibold`}},gn={GROUP:`duotone-group`,SWAP_OPACITY:`swap-opacity`,PRIMARY:`primary`,SECONDARY:`secondary`},_n=[`fa-classic`,`fa-duotone`,`fa-sharp`,`fa-sharp-duotone`,`fa-thumbprint`,`fa-whiteboard`,`fa-notdog`,`fa-notdog-duo`,`fa-chisel`,`fa-etch`,`fa-graphite`,`fa-jelly`,`fa-jelly-fill`,`fa-jelly-duo`,`fa-slab`,`fa-slab-press`,`fa-slab-press-duo`,`fa-slab-duo`,`fa-mosaic`,`fa-pixel`,`fa-vellum`,`fa-utility`,`fa-utility-duo`,`fa-utility-fill`],I=`classic`,vn=`duotone`,yn=`sharp`,bn=`sharp-duotone`,xn=`chisel`,Sn=`etch`,Cn=`graphite`,wn=`jelly`,Tn=`jelly-duo`,En=`jelly-fill`,Dn=`mosaic`,On=`notdog`,kn=`notdog-duo`,An=`pixel`,jn=`slab`,Mn=`slab-duo`,Nn=`slab-press`,Pn=`slab-press-duo`,Fn=`thumbprint`,In=`utility`,Ln=`utility-duo`,Rn=`utility-fill`,zn=`vellum`,Bn=`whiteboard`,Vn=`Classic`,Hn=`Duotone`,Un=`Sharp`,Wn=`Sharp Duotone`,Gn=`Chisel`,Kn=`Etch`,qn=`Graphite`,Jn=`Jelly`,Yn=`Jelly Duo`,Xn=`Jelly Fill`,Zn=`Mosaic`,Qn=`Notdog`,$n=`Notdog Duo`,er=`Pixel`,tr=`Slab`,nr=`Slab Duo`,rr=`Slab Press`,ir=`Slab Press Duo`,ar=`Thumbprint`,or=`Utility`,sr=`Utility Duo`,cr=`Utility Fill`,lr=`Vellum`,ur=`Whiteboard`,dr=[I,vn,yn,bn,xn,Sn,Cn,wn,Tn,En,Dn,On,kn,An,jn,Mn,Nn,Pn,Fn,In,Ln,Rn,zn,Bn];fn={},A(A(A(A(A(A(A(A(A(A(fn,I,Vn),vn,Hn),yn,Un),bn,Wn),xn,Gn),Sn,Kn),Cn,qn),wn,Jn),Tn,Yn),En,Xn),A(A(A(A(A(A(A(A(A(A(fn,Dn,Zn),On,Qn),kn,$n),An,er),jn,tr),Mn,nr),Nn,rr),Pn,ir),Fn,ar),In,or),A(A(A(A(fn,Ln,sr),Rn,cr),zn,lr),Bn,ur);var fr={classic:{900:`fas`,400:`far`,normal:`far`,300:`fal`,100:`fat`},duotone:{900:`fad`,400:`fadr`,300:`fadl`,100:`fadt`},sharp:{900:`fass`,400:`fasr`,300:`fasl`,100:`fast`},"sharp-duotone":{900:`fasds`,400:`fasdr`,300:`fasdl`,100:`fasdt`},slab:{400:`faslr`},"slab-press":{400:`faslpr`},"slab-duo":{400:`fasldr`},"slab-press-duo":{400:`faslpdr`},vellum:{900:`favs`},mosaic:{900:`fams`},pixel:{400:`fapr`},whiteboard:{600:`fawsb`},thumbprint:{300:`fatl`},notdog:{900:`fans`},"notdog-duo":{900:`fands`},etch:{900:`faes`},graphite:{100:`fagt`},chisel:{400:`facr`},jelly:{400:`fajr`},"jelly-fill":{400:`fajfr`},"jelly-duo":{400:`fajdr`},utility:{600:`fausb`},"utility-duo":{600:`faudsb`},"utility-fill":{600:`faufsb`}},pr={"Font Awesome 7 Free":{900:`fas`,400:`far`},"Font Awesome 7 Pro":{900:`fas`,400:`far`,normal:`far`,300:`fal`,100:`fat`},"Font Awesome 7 Brands":{400:`fab`,normal:`fab`},"Font Awesome 7 Duotone":{900:`fad`,400:`fadr`,normal:`fadr`,300:`fadl`,100:`fadt`},"Font Awesome 7 Sharp":{900:`fass`,400:`fasr`,normal:`fasr`,300:`fasl`,100:`fast`},"Font Awesome 7 Sharp Duotone":{900:`fasds`,400:`fasdr`,normal:`fasdr`,300:`fasdl`,100:`fasdt`},"Font Awesome 7 Jelly":{400:`fajr`,normal:`fajr`},"Font Awesome 7 Jelly Fill":{400:`fajfr`,normal:`fajfr`},"Font Awesome 7 Jelly Duo":{400:`fajdr`,normal:`fajdr`},"Font Awesome 7 Slab":{400:`faslr`,normal:`faslr`},"Font Awesome 7 Slab Press":{400:`faslpr`,normal:`faslpr`},"Font Awesome 7 Slab Duo":{400:`fasldr`,normal:`fasldr`},"Font Awesome 7 Slab Press Duo":{400:`faslpdr`,normal:`faslpdr`},"Font Awesome 7 Pixel":{400:`fapr`,normal:`fapr`},"Font Awesome 7 Mosaic":{900:`fams`,normal:`fams`},"Font Awesome 7 Vellum":{900:`favs`,normal:`favs`},"Font Awesome 7 Thumbprint":{300:`fatl`,normal:`fatl`},"Font Awesome 7 Notdog":{900:`fans`,normal:`fans`},"Font Awesome 7 Notdog Duo":{900:`fands`,normal:`fands`},"Font Awesome 7 Etch":{900:`faes`,normal:`faes`},"Font Awesome 7 Graphite":{100:`fagt`,normal:`fagt`},"Font Awesome 7 Chisel":{400:`facr`,normal:`facr`},"Font Awesome 7 Whiteboard":{600:`fawsb`,normal:`fawsb`},"Font Awesome 7 Utility":{600:`fausb`,normal:`fausb`},"Font Awesome 7 Utility Duo":{600:`faudsb`,normal:`faudsb`},"Font Awesome 7 Utility Fill":{600:`faufsb`,normal:`faufsb`}},mr=new Map([[`classic`,{defaultShortPrefixId:`fas`,defaultStyleId:`solid`,styleIds:[`solid`,`regular`,`light`,`thin`,`brands`],futureStyleIds:[],defaultFontWeight:900}],[`duotone`,{defaultShortPrefixId:`fad`,defaultStyleId:`solid`,styleIds:[`solid`,`regular`,`light`,`thin`],futureStyleIds:[],defaultFontWeight:900}],[`sharp`,{defaultShortPrefixId:`fass`,defaultStyleId:`solid`,styleIds:[`solid`,`regular`,`light`,`thin`],futureStyleIds:[],defaultFontWeight:900}],[`sharp-duotone`,{defaultShortPrefixId:`fasds`,defaultStyleId:`solid`,styleIds:[`solid`,`regular`,`light`,`thin`],futureStyleIds:[],defaultFontWeight:900}],[`chisel`,{defaultShortPrefixId:`facr`,defaultStyleId:`regular`,styleIds:[`regular`],futureStyleIds:[],defaultFontWeight:400}],[`etch`,{defaultShortPrefixId:`faes`,defaultStyleId:`solid`,styleIds:[`solid`],futureStyleIds:[],defaultFontWeight:900}],[`graphite`,{defaultShortPrefixId:`fagt`,defaultStyleId:`thin`,styleIds:[`thin`],futureStyleIds:[],defaultFontWeight:100}],[`jelly`,{defaultShortPrefixId:`fajr`,defaultStyleId:`regular`,styleIds:[`regular`],futureStyleIds:[],defaultFontWeight:400}],[`jelly-duo`,{defaultShortPrefixId:`fajdr`,defaultStyleId:`regular`,styleIds:[`regular`],futureStyleIds:[],defaultFontWeight:400}],[`jelly-fill`,{defaultShortPrefixId:`fajfr`,defaultStyleId:`regular`,styleIds:[`regular`],futureStyleIds:[],defaultFontWeight:400}],[`mosaic`,{defaultShortPrefixId:`fams`,defaultStyleId:`solid`,styleIds:[`solid`],futureStyleIds:[],defaultFontWeight:900}],[`notdog`,{defaultShortPrefixId:`fans`,defaultStyleId:`solid`,styleIds:[`solid`],futureStyleIds:[],defaultFontWeight:900}],[`notdog-duo`,{defaultShortPrefixId:`fands`,defaultStyleId:`solid`,styleIds:[`solid`],futureStyleIds:[],defaultFontWeight:900}],[`pixel`,{defaultShortPrefixId:`fapr`,defaultStyleId:`regular`,styleIds:[`regular`],futureStyleIds:[],defaultFontWeight:400}],[`slab`,{defaultShortPrefixId:`faslr`,defaultStyleId:`regular`,styleIds:[`regular`],futureStyleIds:[],defaultFontWeight:400}],[`slab-duo`,{defaultShortPrefixId:`fasldr`,defaultStyleId:`regular`,styleIds:[`regular`],futureStyleIds:[],defaultFontWeight:400}],[`slab-press`,{defaultShortPrefixId:`faslpr`,defaultStyleId:`regular`,styleIds:[`regular`],futureStyleIds:[],defaultFontWeight:400}],[`slab-press-duo`,{defaultShortPrefixId:`faslpdr`,defaultStyleId:`regular`,styleIds:[`regular`],futureStyleIds:[],defaultFontWeight:400}],[`thumbprint`,{defaultShortPrefixId:`fatl`,defaultStyleId:`light`,styleIds:[`light`],futureStyleIds:[],defaultFontWeight:300}],[`utility`,{defaultShortPrefixId:`fausb`,defaultStyleId:`semibold`,styleIds:[`semibold`],futureStyleIds:[],defaultFontWeight:600}],[`utility-duo`,{defaultShortPrefixId:`faudsb`,defaultStyleId:`semibold`,styleIds:[`semibold`],futureStyleIds:[],defaultFontWeight:600}],[`utility-fill`,{defaultShortPrefixId:`faufsb`,defaultStyleId:`semibold`,styleIds:[`semibold`],futureStyleIds:[],defaultFontWeight:600}],[`vellum`,{defaultShortPrefixId:`favs`,defaultStyleId:`solid`,styleIds:[`solid`],futureStyleIds:[],defaultFontWeight:900}],[`whiteboard`,{defaultShortPrefixId:`fawsb`,defaultStyleId:`semibold`,styleIds:[`semibold`],futureStyleIds:[],defaultFontWeight:600}]]),hr={chisel:{regular:`facr`},classic:{brands:`fab`,light:`fal`,regular:`far`,solid:`fas`,thin:`fat`},duotone:{light:`fadl`,regular:`fadr`,solid:`fad`,thin:`fadt`},etch:{solid:`faes`},graphite:{thin:`fagt`},jelly:{regular:`fajr`},"jelly-duo":{regular:`fajdr`},"jelly-fill":{regular:`fajfr`},mosaic:{solid:`fams`},notdog:{solid:`fans`},"notdog-duo":{solid:`fands`},pixel:{regular:`fapr`},sharp:{light:`fasl`,regular:`fasr`,solid:`fass`,thin:`fast`},"sharp-duotone":{light:`fasdl`,regular:`fasdr`,solid:`fasds`,thin:`fasdt`},slab:{regular:`faslr`},"slab-duo":{regular:`fasldr`},"slab-press":{regular:`faslpr`},"slab-press-duo":{regular:`faslpdr`},thumbprint:{light:`fatl`},utility:{semibold:`fausb`},"utility-duo":{semibold:`faudsb`},"utility-fill":{semibold:`faufsb`},vellum:{solid:`favs`},whiteboard:{semibold:`fawsb`}},gr=[`fak`,`fa-kit`,`fakd`,`fa-kit-duotone`],_r={kit:{fak:`kit`,"fa-kit":`kit`},"kit-duotone":{fakd:`kit-duotone`,"fa-kit-duotone":`kit-duotone`}},vr=[`kit`];A(A({},`kit`,`Kit`),`kit-duotone`,`Kit Duotone`);var yr={kit:{"fa-kit":`fak`},"kit-duotone":{"fa-kit-duotone":`fakd`}},br={"Font Awesome Kit":{400:`fak`,normal:`fak`},"Font Awesome Kit Duotone":{400:`fakd`,normal:`fakd`}},xr={kit:{fak:`fa-kit`},"kit-duotone":{fakd:`fa-kit-duotone`}},Sr={kit:{kit:`fak`},"kit-duotone":{"kit-duotone":`fakd`}},Cr,wr={GROUP:`duotone-group`,SWAP_OPACITY:`swap-opacity`,PRIMARY:`primary`,SECONDARY:`secondary`},Tr=[`fa-classic`,`fa-duotone`,`fa-sharp`,`fa-sharp-duotone`,`fa-thumbprint`,`fa-whiteboard`,`fa-notdog`,`fa-notdog-duo`,`fa-chisel`,`fa-etch`,`fa-graphite`,`fa-jelly`,`fa-jelly-fill`,`fa-jelly-duo`,`fa-slab`,`fa-slab-press`,`fa-slab-press-duo`,`fa-slab-duo`,`fa-mosaic`,`fa-pixel`,`fa-vellum`,`fa-utility`,`fa-utility-duo`,`fa-utility-fill`];Cr={},A(A(A(A(A(A(A(A(A(A(Cr,`classic`,`Classic`),`duotone`,`Duotone`),`sharp`,`Sharp`),`sharp-duotone`,`Sharp Duotone`),`chisel`,`Chisel`),`etch`,`Etch`),`graphite`,`Graphite`),`jelly`,`Jelly`),`jelly-duo`,`Jelly Duo`),`jelly-fill`,`Jelly Fill`),A(A(A(A(A(A(A(A(A(A(Cr,`mosaic`,`Mosaic`),`notdog`,`Notdog`),`notdog-duo`,`Notdog Duo`),`pixel`,`Pixel`),`slab`,`Slab`),`slab-duo`,`Slab Duo`),`slab-press`,`Slab Press`),`slab-press-duo`,`Slab Press Duo`),`thumbprint`,`Thumbprint`),`utility`,`Utility`),A(A(A(A(Cr,`utility-duo`,`Utility Duo`),`utility-fill`,`Utility Fill`),`vellum`,`Vellum`),`whiteboard`,`Whiteboard`),A(A({},`kit`,`Kit`),`kit-duotone`,`Kit Duotone`);var Er={classic:{"fa-brands":`fab`,"fa-duotone":`fad`,"fa-light":`fal`,"fa-regular":`far`,"fa-solid":`fas`,"fa-thin":`fat`},duotone:{"fa-regular":`fadr`,"fa-light":`fadl`,"fa-thin":`fadt`},sharp:{"fa-solid":`fass`,"fa-regular":`fasr`,"fa-light":`fasl`,"fa-thin":`fast`},"sharp-duotone":{"fa-solid":`fasds`,"fa-regular":`fasdr`,"fa-light":`fasdl`,"fa-thin":`fasdt`},slab:{"fa-regular":`faslr`},"slab-press":{"fa-regular":`faslpr`},"slab-duo":{"fa-regular":`fasldr`},"slab-press-duo":{"fa-regular":`faslpdr`},pixel:{"fa-regular":`fapr`},mosaic:{"fa-solid":`fams`},vellum:{"fa-solid":`favs`},whiteboard:{"fa-semibold":`fawsb`},thumbprint:{"fa-light":`fatl`},notdog:{"fa-solid":`fans`},"notdog-duo":{"fa-solid":`fands`},etch:{"fa-solid":`faes`},graphite:{"fa-thin":`fagt`},jelly:{"fa-regular":`fajr`},"jelly-fill":{"fa-regular":`fajfr`},"jelly-duo":{"fa-regular":`fajdr`},chisel:{"fa-regular":`facr`},utility:{"fa-semibold":`fausb`},"utility-duo":{"fa-semibold":`faudsb`},"utility-fill":{"fa-semibold":`faufsb`}},Dr={classic:[`fas`,`far`,`fal`,`fat`,`fad`],duotone:[`fadr`,`fadl`,`fadt`],sharp:[`fass`,`fasr`,`fasl`,`fast`],"sharp-duotone":[`fasds`,`fasdr`,`fasdl`,`fasdt`],slab:[`faslr`],"slab-press":[`faslpr`],"slab-duo":[`fasldr`],"slab-press-duo":[`faslpdr`],pixel:[`fapr`],mosaic:[`fams`],vellum:[`favs`],whiteboard:[`fawsb`],thumbprint:[`fatl`],notdog:[`fans`],"notdog-duo":[`fands`],etch:[`faes`],graphite:[`fagt`],jelly:[`fajr`],"jelly-fill":[`fajfr`],"jelly-duo":[`fajdr`],chisel:[`facr`],utility:[`fausb`],"utility-duo":[`faudsb`],"utility-fill":[`faufsb`]},Or={classic:{fab:`fa-brands`,fad:`fa-duotone`,fal:`fa-light`,far:`fa-regular`,fas:`fa-solid`,fat:`fa-thin`},duotone:{fadr:`fa-regular`,fadl:`fa-light`,fadt:`fa-thin`},sharp:{fass:`fa-solid`,fasr:`fa-regular`,fasl:`fa-light`,fast:`fa-thin`},"sharp-duotone":{fasds:`fa-solid`,fasdr:`fa-regular`,fasdl:`fa-light`,fasdt:`fa-thin`},slab:{faslr:`fa-regular`},"slab-press":{faslpr:`fa-regular`},"slab-duo":{fasldr:`fa-regular`},"slab-press-duo":{faslpdr:`fa-regular`},pixel:{fapr:`fa-regular`},mosaic:{fams:`fa-solid`},vellum:{favs:`fa-solid`},whiteboard:{fawsb:`fa-semibold`},thumbprint:{fatl:`fa-light`},notdog:{fans:`fa-solid`},"notdog-duo":{fands:`fa-solid`},etch:{faes:`fa-solid`},graphite:{fagt:`fa-thin`},jelly:{fajr:`fa-regular`},"jelly-fill":{fajfr:`fa-regular`},"jelly-duo":{fajdr:`fa-regular`},chisel:{facr:`fa-regular`},utility:{fausb:`fa-semibold`},"utility-duo":{faudsb:`fa-semibold`},"utility-fill":{faufsb:`fa-semibold`}},kr=`fa.fas.far.fal.fat.fad.fadr.fadl.fadt.fab.fass.fasr.fasl.fast.fasds.fasdr.fasdl.fasdt.faslr.faslpr.fasldr.faslpdr.fapr.fams.favs.fawsb.fatl.fans.fands.faes.fagt.fajr.fajfr.fajdr.facr.fausb.faudsb.faufsb`.split(`.`).concat(Tr,[`fa-solid`,`fa-regular`,`fa-light`,`fa-thin`,`fa-duotone`,`fa-brands`,`fa-semibold`]),Ar=[`solid`,`regular`,`light`,`thin`,`duotone`,`brands`,`semibold`],jr=[1,2,3,4,5,6,7,8,9,10],Mr=jr.concat([11,12,13,14,15,16,17,18,19,20]),Nr=[].concat(M(Object.keys(Dr)),Ar,[`aw`,`fw`,`pull-left`,`pull-right`],[`2xs`,`xs`,`sm`,`lg`,`xl`,`2xl`,`beat`,`beat-fade`,`border`,`bounce`,`buzz`,`canvas-square`,`canvas-roomy`,`fade`,`flip-360`,`flip-both`,`flip-horizontal`,`flip-vertical`,`flip`,`float`,`inverse`,`jello`,`layers`,`layers-bottom-left`,`layers-bottom-right`,`layers-counter`,`layers-text`,`layers-top-left`,`layers-top-right`,`li`,`pull-end`,`pull-start`,`pulse`,`rotate-180`,`rotate-270`,`rotate-90`,`rotate-by`,`shake`,`spin-pulse`,`spin-reverse`,`spin`,`spin-snap`,`spin-snap-4`,`spin-snap-8`,`stack-1x`,`stack-2x`,`stack`,`swing`,`ul`,`wag`,`width-auto`,`width-fixed`,wr.GROUP,wr.SWAP_OPACITY,wr.PRIMARY,wr.SECONDARY],jr.map(function(e){return`${e}x`}),Mr.map(function(e){return`w-${e}`})),Pr={"Font Awesome 5 Free":{900:`fas`,400:`far`},"Font Awesome 5 Pro":{900:`fas`,400:`far`,normal:`far`,300:`fal`},"Font Awesome 5 Brands":{400:`fab`,normal:`fab`},"Font Awesome 5 Duotone":{900:`fad`}},L=`___FONT_AWESOME___`,Fr=16,Ir=`fa`,Lr=`svg-inline--fa`,R=`data-fa-i2svg`,Rr=`data-fa-pseudo-element`,zr=`data-fa-pseudo-element-pending`,Br=`data-prefix`,Vr=`data-icon`,Hr=`fontawesome-i2svg`,Ur=`async`,Wr=[`HTML`,`HEAD`,`STYLE`,`SCRIPT`],Gr=[`::before`,`::after`,`:before`,`:after`],Kr=function(){try{return!0}catch{return!1}}();function qr(e){return new Proxy(e,{get:function(e,t){return t in e?e[t]:e[I]}})}var Jr=j({},hn);Jr[I]=j(j(j(j({},{"fa-duotone":`duotone`}),hn[I]),_r.kit),_r[`kit-duotone`]);var Yr=qr(Jr),Xr=j({},hr);Xr[I]=j(j(j(j({},{duotone:`fad`}),Xr[I]),Sr.kit),Sr[`kit-duotone`]);var Zr=qr(Xr),Qr=j({},Or);Qr[I]=j(j({},Qr[I]),xr.kit);var $r=qr(Qr),ei=j({},Er);ei[I]=j(j({},ei[I]),yr.kit),qr(ei);var ti=pn,ni=`fa-layers-text`,ri=mn;qr(j({},fr));var ii=[`class`,`data-prefix`,`data-icon`,`data-fa-transform`,`data-fa-mask`],ai=gn,oi=[].concat(M(vr),M(Nr)),si=N.FontAwesomeConfig||{};function ci(e){var t=P.querySelector(`script[`+e+`]`);if(t)return t.getAttribute(e)}function li(e){return e===``?!0:e===`false`?!1:e===`true`||e}P&&typeof P.querySelector==`function`&&[[`data-family-prefix`,`familyPrefix`],[`data-css-prefix`,`cssPrefix`],[`data-family-default`,`familyDefault`],[`data-style-default`,`styleDefault`],[`data-replacement-class`,`replacementClass`],[`data-auto-replace-svg`,`autoReplaceSvg`],[`data-auto-add-css`,`autoAddCss`],[`data-search-pseudo-elements`,`searchPseudoElements`],[`data-search-pseudo-elements-warnings`,`searchPseudoElementsWarnings`],[`data-search-pseudo-elements-full-scan`,`searchPseudoElementsFullScan`],[`data-observe-mutations`,`observeMutations`],[`data-mutate-approach`,`mutateApproach`],[`data-keep-original-source`,`keepOriginalSource`],[`data-measure-performance`,`measurePerformance`],[`data-show-missing-icons`,`showMissingIcons`]].forEach(function(e){var t=Xt(e,2),n=t[0],r=t[1],i=li(ci(n));i!=null&&(si[r]=i)});var ui={styleDefault:`solid`,familyDefault:I,cssPrefix:Ir,replacementClass:Lr,autoReplaceSvg:!0,autoAddCss:!0,searchPseudoElements:!1,searchPseudoElementsWarnings:!0,searchPseudoElementsFullScan:!1,observeMutations:!0,mutateApproach:`async`,keepOriginalSource:!0,measurePerformance:!1,showMissingIcons:!0};si.familyPrefix&&(si.cssPrefix=si.familyPrefix);var di=j(j({},ui),si);di.autoReplaceSvg||(di.observeMutations=!1);var z={};Object.keys(ui).forEach(function(e){Object.defineProperty(z,e,{enumerable:!0,set:function(t){di[e]=t,fi.forEach(function(e){return e(z)})},get:function(){return di[e]}})}),Object.defineProperty(z,"familyPrefix",{enumerable:!0,set:function(e){di.cssPrefix=e,fi.forEach(function(e){return e(z)})},get:function(){return di.cssPrefix}}),N.FontAwesomeConfig=z;var fi=[];function pi(e){return fi.push(e),function(){fi.splice(fi.indexOf(e),1)}}var B=Fr,V={size:16,x:0,y:0,rotate:0,flipX:!1,flipY:!1};function mi(e){if(!(!e||!F)){var t=P.createElement(`style`);t.setAttribute(`type`,`text/css`),t.innerHTML=e;for(var n=P.head.childNodes,r=null,i=n.length-1;i>-1;i--){var a=n[i],o=(a.tagName||``).toUpperCase();[`STYLE`,`LINK`].indexOf(o)>-1&&(r=a)}return P.head.insertBefore(t,r),e}}var hi=`0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ`;function gi(){for(var e=12,t=``;e-->0;)t+=hi[Math.random()*62|0];return t}function H(e){for(var t=[],n=(e||[]).length>>>0;n--;)t[n]=e[n];return t}function _i(e){return e.classList?H(e.classList):(e.getAttribute(`class`)||``).split(` `).filter(function(e){return e})}function vi(e){return`${e}`.replace(/&/g,`&amp;`).replace(/"/g,`&quot;`).replace(/'/g,`&#39;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`)}function yi(e){return Object.keys(e||{}).reduce(function(t,n){return t+`${n}="${vi(e[n])}" `},``).trim()}function bi(e){return Object.keys(e||{}).reduce(function(t,n){return t+`${n}: ${e[n].trim()};`},``)}function xi(e){return e.size!==V.size||e.x!==V.x||e.y!==V.y||e.rotate!==V.rotate||e.flipX||e.flipY}function Si(e){var t=e.transform,n=e.containerWidth,r=e.iconWidth;return{outer:{transform:`translate(${n/2} 256)`},inner:{transform:`${`translate(${t.x*32}, ${t.y*32}) `} ${`scale(${t.size/16*(t.flipX?-1:1)}, ${t.size/16*(t.flipY?-1:1)}) `} ${`rotate(${t.rotate} 0 0)`}`},path:{transform:`translate(${r/2*-1} -256)`}}}function Ci(e){var t=e.transform,n=e.width,r=n===void 0?Fr:n,i=e.height,a=i===void 0?Fr:i,o=e.startCentered,s=o!==void 0&&o,c=``;return c+=s&&dn?`translate(${t.x/B-r/2}em, ${t.y/B-a/2}em) `:s?`translate(calc(-50% + ${t.x/B}em), calc(-50% + ${t.y/B}em)) `:`translate(${t.x/B}em, ${t.y/B}em) `,c+=`scale(${t.size/B*(t.flipX?-1:1)}, ${t.size/B*(t.flipY?-1:1)}) `,c+=`rotate(${t.rotate}deg) `,c}var wi=`:root, :host {
  --fa-font-solid: normal 900 1em/1 'Font Awesome 7 Free';
  --fa-font-regular: normal 400 1em/1 'Font Awesome 7 Free';
  --fa-font-light: normal 300 1em/1 'Font Awesome 7 Pro';
  --fa-font-thin: normal 100 1em/1 'Font Awesome 7 Pro';
  --fa-font-duotone: normal 900 1em/1 'Font Awesome 7 Duotone';
  --fa-font-duotone-regular: normal 400 1em/1 'Font Awesome 7 Duotone';
  --fa-font-duotone-light: normal 300 1em/1 'Font Awesome 7 Duotone';
  --fa-font-duotone-thin: normal 100 1em/1 'Font Awesome 7 Duotone';
  --fa-font-brands: normal 400 1em/1 'Font Awesome 7 Brands';
  --fa-font-sharp-solid: normal 900 1em/1 'Font Awesome 7 Sharp';
  --fa-font-sharp-regular: normal 400 1em/1 'Font Awesome 7 Sharp';
  --fa-font-sharp-light: normal 300 1em/1 'Font Awesome 7 Sharp';
  --fa-font-sharp-thin: normal 100 1em/1 'Font Awesome 7 Sharp';
  --fa-font-sharp-duotone-solid: normal 900 1em/1 'Font Awesome 7 Sharp Duotone';
  --fa-font-sharp-duotone-regular: normal 400 1em/1 'Font Awesome 7 Sharp Duotone';
  --fa-font-sharp-duotone-light: normal 300 1em/1 'Font Awesome 7 Sharp Duotone';
  --fa-font-sharp-duotone-thin: normal 100 1em/1 'Font Awesome 7 Sharp Duotone';
  --fa-font-slab-regular: normal 400 1em/1 'Font Awesome 7 Slab';
  --fa-font-slab-press-regular: normal 400 1em/1 'Font Awesome 7 Slab Press';
  --fa-font-slab-duo-regular: normal 400 1em/1 'Font Awesome 7 Slab Duo';
  --fa-font-slab-press-duo-regular: normal 400 1em/1 'Font Awesome 7 Slab Press Duo';
  --fa-font-pixel-regular: normal 400 1em/1 'Font Awesome 7 Pixel';
  --fa-font-mosaic-solid: normal 900 1em/1 'Font Awesome 7 Mosaic';
  --fa-font-vellum-solid: normal 900 1em/1 'Font Awesome 7 Vellum';
  --fa-font-whiteboard-semibold: normal 600 1em/1 'Font Awesome 7 Whiteboard';
  --fa-font-thumbprint-light: normal 300 1em/1 'Font Awesome 7 Thumbprint';
  --fa-font-notdog-solid: normal 900 1em/1 'Font Awesome 7 Notdog';
  --fa-font-notdog-duo-solid: normal 900 1em/1 'Font Awesome 7 Notdog Duo';
  --fa-font-etch-solid: normal 900 1em/1 'Font Awesome 7 Etch';
  --fa-font-graphite-thin: normal 100 1em/1 'Font Awesome 7 Graphite';
  --fa-font-jelly-regular: normal 400 1em/1 'Font Awesome 7 Jelly';
  --fa-font-jelly-fill-regular: normal 400 1em/1 'Font Awesome 7 Jelly Fill';
  --fa-font-jelly-duo-regular: normal 400 1em/1 'Font Awesome 7 Jelly Duo';
  --fa-font-chisel-regular: normal 400 1em/1 'Font Awesome 7 Chisel';
  --fa-font-utility-semibold: normal 600 1em/1 'Font Awesome 7 Utility';
  --fa-font-utility-duo-semibold: normal 600 1em/1 'Font Awesome 7 Utility Duo';
  --fa-font-utility-fill-semibold: normal 600 1em/1 'Font Awesome 7 Utility Fill';
}

.svg-inline--fa {
  box-sizing: content-box;
  display: var(--fa-display, inline-block);
  height: 1em;
  overflow: visible;
  vertical-align: -0.125em;
  width: var(--fa-width, 1.25em);
}
.svg-inline--fa.fa-2xs {
  vertical-align: 0.1em;
}
.svg-inline--fa.fa-xs {
  vertical-align: 0em;
}
.svg-inline--fa.fa-sm {
  vertical-align: -0.0714285714em;
}
.svg-inline--fa.fa-lg {
  vertical-align: -0.2em;
}
.svg-inline--fa.fa-xl {
  vertical-align: -0.25em;
}
.svg-inline--fa.fa-2xl {
  vertical-align: -0.3125em;
}
.svg-inline--fa.fa-pull-left,
.svg-inline--fa .fa-pull-start {
  float: inline-start;
  margin-inline-end: var(--fa-pull-margin, 0.3em);
}
.svg-inline--fa.fa-pull-right,
.svg-inline--fa .fa-pull-end {
  float: inline-end;
  margin-inline-start: var(--fa-pull-margin, 0.3em);
}
.svg-inline--fa.fa-li {
  width: var(--fa-li-width, 2em);
  inset-inline-start: calc(-1 * var(--fa-li-width, 2em));
  inset-block-start: 0.25em; /* syncing vertical alignment with Web Font rendering */
}

.fa-layers-counter, .fa-layers-text {
  display: inline-block;
  position: absolute;
  text-align: center;
}

.fa-layers {
  display: inline-block;
  height: 1em;
  position: relative;
  text-align: center;
  vertical-align: -0.125em;
  width: var(--fa-width, 1.25em);
}
.fa-layers .svg-inline--fa {
  inset: 0;
  margin: auto;
  position: absolute;
  transform-origin: center center;
}

.fa-layers-text {
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  transform-origin: center center;
}

.fa-layers-counter {
  background-color: var(--fa-counter-background-color, #ff253a);
  border-radius: var(--fa-counter-border-radius, 1em);
  box-sizing: border-box;
  color: var(--fa-inverse, #fff);
  line-height: var(--fa-counter-line-height, 1);
  max-width: var(--fa-counter-max-width, 5em);
  min-width: var(--fa-counter-min-width, 1.5em);
  overflow: hidden;
  padding: var(--fa-counter-padding, 0.25em 0.5em);
  right: var(--fa-right, 0);
  text-overflow: ellipsis;
  top: var(--fa-top, 0);
  transform: scale(var(--fa-counter-scale, 0.25));
  transform-origin: top right;
}

.fa-layers-bottom-right {
  bottom: var(--fa-bottom, 0);
  right: var(--fa-right, 0);
  top: auto;
  transform: scale(var(--fa-layers-scale, 0.25));
  transform-origin: bottom right;
}

.fa-layers-bottom-left {
  bottom: var(--fa-bottom, 0);
  left: var(--fa-left, 0);
  right: auto;
  top: auto;
  transform: scale(var(--fa-layers-scale, 0.25));
  transform-origin: bottom left;
}

.fa-layers-top-right {
  top: var(--fa-top, 0);
  right: var(--fa-right, 0);
  transform: scale(var(--fa-layers-scale, 0.25));
  transform-origin: top right;
}

.fa-layers-top-left {
  left: var(--fa-left, 0);
  right: auto;
  top: var(--fa-top, 0);
  transform: scale(var(--fa-layers-scale, 0.25));
  transform-origin: top left;
}

.fa-1x {
  font-size: 1em;
}

.fa-2x {
  font-size: 2em;
}

.fa-3x {
  font-size: 3em;
}

.fa-4x {
  font-size: 4em;
}

.fa-5x {
  font-size: 5em;
}

.fa-6x {
  font-size: 6em;
}

.fa-7x {
  font-size: 7em;
}

.fa-8x {
  font-size: 8em;
}

.fa-9x {
  font-size: 9em;
}

.fa-10x {
  font-size: 10em;
}

.fa-2xs {
  font-size: calc(10 / 16 * 1em); /* converts a 10px size into an em-based value that's relative to the scale's 16px base */
  line-height: calc(1 / 10 * 1em); /* sets the line-height of the icon back to that of it's parent */
  vertical-align: calc((6 / 10 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */
}

.fa-xs {
  font-size: calc(12 / 16 * 1em); /* converts a 12px size into an em-based value that's relative to the scale's 16px base */
  line-height: calc(1 / 12 * 1em); /* sets the line-height of the icon back to that of it's parent */
  vertical-align: calc((6 / 12 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */
}

.fa-sm {
  font-size: calc(14 / 16 * 1em); /* converts a 14px size into an em-based value that's relative to the scale's 16px base */
  line-height: calc(1 / 14 * 1em); /* sets the line-height of the icon back to that of it's parent */
  vertical-align: calc((6 / 14 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */
}

.fa-lg {
  font-size: calc(20 / 16 * 1em); /* converts a 20px size into an em-based value that's relative to the scale's 16px base */
  line-height: calc(1 / 20 * 1em); /* sets the line-height of the icon back to that of it's parent */
  vertical-align: calc((6 / 20 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */
}

.fa-xl {
  font-size: calc(24 / 16 * 1em); /* converts a 24px size into an em-based value that's relative to the scale's 16px base */
  line-height: calc(1 / 24 * 1em); /* sets the line-height of the icon back to that of it's parent */
  vertical-align: calc((6 / 24 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */
}

.fa-2xl {
  font-size: calc(32 / 16 * 1em); /* converts a 32px size into an em-based value that's relative to the scale's 16px base */
  line-height: calc(1 / 32 * 1em); /* sets the line-height of the icon back to that of it's parent */
  vertical-align: calc((6 / 32 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */
}

.fa-width-auto {
  --fa-width: auto;
}

.fa-fw,
.fa-width-fixed {
  --fa-width: 1.25em;
}

.fa-canvas-square {
  padding-block: 0.125em;
  margin-block-end: -0.125em;
}

.fa-canvas-roomy {
  padding-block: 0.25em;
  padding-inline: 0.125em;
  margin-block-end: -0.25em;
  box-sizing: content-box;
}

.fa-ul {
  list-style-type: none;
  margin-inline-start: var(--fa-li-margin, 2.5em);
  padding-inline-start: 0;
}
.fa-ul > li {
  position: relative;
}

.fa-li {
  inset-inline-start: calc(-1 * var(--fa-li-width, 2em));
  position: absolute;
  text-align: center;
  width: var(--fa-li-width, 2em);
  line-height: inherit;
}

/* Heads Up: Bordered Icons will not be supported in the future!
  - This feature will be deprecated in the next major release of Font Awesome (v8)!
  - You may continue to use it in this version *v7), but it will not be supported in Font Awesome v8.
*/
/* Notes:
* --@{v.$css-prefix}-border-width = 1/16 by default (to render as ~1px based on a 16px default font-size)
* --@{v.$css-prefix}-border-padding =
  ** 3/16 for vertical padding (to give ~2px of vertical whitespace around an icon considering it's vertical alignment)
  ** 4/16 for horizontal padding (to give ~4px of horizontal whitespace around an icon)
*/
.fa-border {
  border-color: var(--fa-border-color, #eee);
  border-radius: var(--fa-border-radius, 0.1em);
  border-style: var(--fa-border-style, solid);
  border-width: var(--fa-border-width, 0.0625em);
  box-sizing: var(--fa-border-box-sizing, content-box);
  padding: var(--fa-border-padding, 0.1875em 0.25em);
}

.fa-pull-left,
.fa-pull-start {
  float: inline-start;
  margin-inline-end: var(--fa-pull-margin, 0.3em);
}

.fa-pull-right,
.fa-pull-end {
  float: inline-end;
  margin-inline-start: var(--fa-pull-margin, 0.3em);
}

.fa-beat {
  animation-name: fa-beat;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, ease-in-out);
}

.fa-bounce {
  animation-name: fa-bounce;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.28, 0.84, 0.42, 1));
}

.fa-fade {
  animation-name: fa-fade;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, ease-in-out);
}

.fa-beat-fade {
  animation-name: fa-beat-fade;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, ease-in-out);
}

.fa-flip {
  animation-name: fa-flip;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1.5s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, ease-in-out);
}

.fa-flip-360 {
  animation-name: fa-flip-360;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, ease-in-out);
}

.fa-shake {
  animation-name: fa-shake;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 0.75s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, ease-in-out);
}

.fa-spin {
  animation-name: fa-spin;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 2s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, linear);
}

.fa-spin-reverse {
  --fa-animation-direction: reverse;
}

.fa-pulse,
.fa-spin-pulse {
  animation-name: fa-spin;
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, steps(8));
}

.fa-spin-snap {
  animation-name: fa-spin-snap;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 3s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, linear);
}

.fa-spin-snap-4 {
  animation-name: fa-spin-snap-4;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 2.4s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, linear);
}

.fa-spin-snap-8 {
  animation-name: fa-spin-snap-8;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 4s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, linear);
}

.fa-buzz {
  animation-name: fa-buzz;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 0.6s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, linear);
}

.fa-wag {
  animation-name: fa-wag;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 0.9s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, ease-out);
  transform-origin: bottom center;
}

.fa-float {
  animation-name: fa-float;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 3s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, ease-in-out);
  will-change: transform;
}

.fa-swing {
  animation-name: fa-swing;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1.2s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, ease-out);
  transform-origin: top center;
}

.fa-jello {
  animation-name: fa-jello;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 0.9s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, ease-out);
}

@media (prefers-reduced-motion: reduce) {
  .fa-beat,
  .fa-bounce,
  .fa-fade,
  .fa-beat-fade,
  .fa-flip,
  .fa-flip-360,
  .fa-pulse,
  .fa-shake,
  .fa-spin,
  .fa-spin-pulse,
  .fa-buzz,
  .fa-float,
  .fa-jello,
  .fa-spin-snap,
  .fa-spin-snap-4,
  .fa-spin-snap-8,
  .fa-swing,
  .fa-wag {
    animation: none !important;
    transition: none !important;
  }
}
@keyframes fa-beat {
  0% {
    transform: scale(1);
  }
  25% {
    transform: scale(calc(1.25 * var(--fa-beat-scale, 1.25)));
  }
  45% {
    transform: scale(calc(1.22 * var(--fa-beat-scale, 1.22)));
  }
  65% {
    transform: scale(calc(1.25 * var(--fa-beat-scale, 1.25)));
  }
  90% {
    transform: scale(1);
  }
}
@keyframes fa-bounce {
  0% {
    transform: scale(1, 1) translateY(0);
    animation-timing-function: var(--fa-animation-timing);
  }
  14% {
    transform: scale(var(--fa-bounce-start-scale-x, 1.06), var(--fa-bounce-start-scale-y, 0.94)) translateY(var(--fa-bounce-anticipation, 3px));
    animation-timing-function: cubic-bezier(0.33, 0, 0.66, 0.33);
  }
  32% {
    transform: scale(var(--fa-bounce-jump-scale-x, 0.94), var(--fa-bounce-jump-scale-y, 1.12)) translateY(calc(-1 * var(--fa-bounce-height, 0.5em)));
    animation-timing-function: cubic-bezier(0.33, 0.66, 0.66, 1);
  }
  52% {
    transform: scale(1, 1) translateY(calc(-1 * var(--fa-bounce-height, 0.5em) * 1.1));
    animation-timing-function: cubic-bezier(0.5, 0, 1, 0.5);
  }
  70% {
    transform: scale(var(--fa-bounce-land-scale-x, 1.06), var(--fa-bounce-land-scale-y, 0.92)) translateY(0);
    animation-timing-function: cubic-bezier(0.33, 0.33, 0.66, 1);
  }
  85% {
    transform: scale(0.98, 1.04) translateY(calc(-2px * var(--fa-bounce-rebound, 1)));
    animation-timing-function: cubic-bezier(0.33, 0, 0.66, 1);
  }
  100% {
    transform: scale(1, 1) translateY(0);
  }
}
@keyframes fa-fade {
  0% {
    opacity: 1;
    transform: scale(1);
    animation-timing-function: cubic-bezier(0.2, 0, 0.4, 1);
  }
  40% {
    opacity: var(--fa-fade-opacity, 0.4);
    transform: scale(0.98);
    animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
@keyframes fa-beat-fade {
  0% {
    opacity: var(--fa-beat-fade-opacity, 0.4);
    transform: scale(1);
    animation-timing-function: cubic-bezier(0.2, 0, 0.4, 1);
  }
  25% {
    opacity: calc(var(--fa-beat-fade-opacity, 0.4) + 0.4);
    transform: scale(var(--fa-beat-fade-scale, 1.28));
    animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
  }
  45% {
    opacity: 1;
    transform: scale(var(--fa-beat-fade-scale, 1.25));
    animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  }
  65% {
    opacity: calc(var(--fa-beat-fade-opacity, 0.4) + 0.4);
    transform: scale(var(--fa-beat-fade-scale, 1.28));
    animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
  }
  100% {
    opacity: var(--fa-beat-fade-opacity, 0.4);
    transform: scale(1);
  }
}
@keyframes fa-flip {
  0% {
    transform: perspective(2em) scale(1) rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), 0deg);
    animation-timing-function: cubic-bezier(0.2, 0, 0.4, 1);
  }
  8% {
    transform: perspective(2em) scale(var(--fa-flip-anticipation-scale, 0.95)) rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), 0deg);
    animation-timing-function: cubic-bezier(0.33, 0, 0.66, 0.33);
  }
  35% {
    transform: perspective(2em) scale(1) rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), calc(var(--fa-flip-angle, -360deg) * 0.6));
    animation-timing-function: linear;
  }
  65% {
    transform: perspective(2em) scale(1) rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), calc(var(--fa-flip-angle, -360deg) * 0.5));
    animation-timing-function: cubic-bezier(0.33, 0.66, 0.66, 1);
  }
  92% {
    transform: perspective(2em) scale(1) rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), calc(var(--fa-flip-angle, -360deg) * var(--fa-flip-overshoot, 1.04)));
    animation-timing-function: cubic-bezier(0.33, 0, 0.66, 1);
  }
  100% {
    transform: perspective(2em) scale(1) rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), var(--fa-flip-angle, -360deg));
  }
}
@keyframes fa-flip-360 {
  0% {
    transform: perspective(2em) scale(1) rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), 0deg);
    animation-timing-function: cubic-bezier(0.2, 0, 0.4, 1);
  }
  8% {
    transform: perspective(2em) scale(var(--fa-flip-anticipation-scale, 0.95)) rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), 0deg);
    animation-timing-function: cubic-bezier(0.33, 0, 0.66, 0.33);
  }
  50% {
    transform: perspective(2em) scale(1) rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), calc(var(--fa-flip-angle, -360deg) * 0.6));
    animation-timing-function: cubic-bezier(0.33, 0.66, 0.66, 1);
  }
  80% {
    transform: perspective(2em) scale(1) rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), calc(var(--fa-flip-angle, -360deg) * var(--fa-flip-overshoot, 1.04)));
    animation-timing-function: cubic-bezier(0.33, 0, 0.66, 1);
  }
  100% {
    transform: perspective(2em) scale(1) rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), var(--fa-flip-angle, -360deg));
  }
}
@keyframes fa-shake {
  0% {
    transform: rotate(0deg);
    animation-timing-function: cubic-bezier(0.2, 0, 0.8, 1);
  }
  8% {
    transform: rotate(35deg) translateX(1px);
    animation-timing-function: cubic-bezier(0.3, 0, 0.7, 1);
  }
  20% {
    transform: rotate(-22deg) translateX(-1px);
    animation-timing-function: cubic-bezier(0.3, 0, 0.7, 1);
  }
  35% {
    transform: rotate(15deg) translateX(1px);
    animation-timing-function: cubic-bezier(0.3, 0, 0.7, 1);
  }
  50% {
    transform: rotate(-9deg);
    animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
  }
  65% {
    transform: rotate(5deg);
    animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
  }
  78% {
    transform: rotate(-3deg);
    animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
  }
  90% {
    transform: rotate(1deg);
    animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  }
  100% {
    transform: rotate(0deg);
  }
}
@keyframes fa-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
@keyframes fa-spin-snap {
  0% {
    transform: rotate(0deg);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
  12% {
    transform: rotate(60deg);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  16.67% {
    transform: rotate(60deg);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
  28.67% {
    transform: rotate(120deg);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  33.33% {
    transform: rotate(120deg);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
  45.33% {
    transform: rotate(180deg);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: rotate(180deg);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
  62% {
    transform: rotate(240deg);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  66.67% {
    transform: rotate(240deg);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
  78.67% {
    transform: rotate(300deg);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  83.33% {
    transform: rotate(300deg);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
  95.33% {
    transform: rotate(360deg);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  100% {
    transform: rotate(360deg);
  }
}
@keyframes fa-spin-snap-4 {
  0% {
    transform: rotate(0deg);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
  15% {
    transform: rotate(90deg);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  25% {
    transform: rotate(90deg);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
  40% {
    transform: rotate(180deg);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: rotate(180deg);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
  65% {
    transform: rotate(270deg);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  75% {
    transform: rotate(270deg);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
  90% {
    transform: rotate(360deg);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  100% {
    transform: rotate(360deg);
  }
}
@keyframes fa-spin-snap-8 {
  0% {
    transform: rotate(0deg);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
  9% {
    transform: rotate(45deg);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  12.5% {
    transform: rotate(45deg);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
  21.5% {
    transform: rotate(90deg);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  25% {
    transform: rotate(90deg);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
  34% {
    transform: rotate(135deg);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  37.5% {
    transform: rotate(135deg);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
  46.5% {
    transform: rotate(180deg);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: rotate(180deg);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
  59% {
    transform: rotate(225deg);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  62.5% {
    transform: rotate(225deg);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
  71.5% {
    transform: rotate(270deg);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  75% {
    transform: rotate(270deg);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
  84% {
    transform: rotate(315deg);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  87.5% {
    transform: rotate(315deg);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
  96.5% {
    transform: rotate(360deg);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  100% {
    transform: rotate(360deg);
  }
}
@keyframes fa-buzz {
  0% {
    transform: translateX(0) rotate(0deg);
    animation-timing-function: cubic-bezier(0.1, 0, 0.9, 1);
  }
  5% {
    transform: translateX(var(--fa-buzz-distance, 4px)) rotate(0.5deg);
  }
  10% {
    transform: translateX(calc(-1 * var(--fa-buzz-distance, 4px))) rotate(-0.5deg);
  }
  15% {
    transform: translateX(var(--fa-buzz-distance, 4px)) rotate(0.3deg);
  }
  20% {
    transform: translateX(calc(-1 * var(--fa-buzz-distance, 4px))) rotate(-0.3deg);
  }
  25% {
    transform: translateX(calc(var(--fa-buzz-distance, 4px) * 0.7)) rotate(0.2deg);
  }
  30% {
    transform: translateX(calc(-1 * var(--fa-buzz-distance, 4px) * 0.7)) rotate(-0.2deg);
  }
  35% {
    transform: translateX(calc(var(--fa-buzz-distance, 4px) * 0.4)) rotate(0.1deg);
  }
  40% {
    transform: translateX(0) rotate(0deg);
  }
  100% {
    transform: translateX(0) rotate(0deg);
  }
}
@keyframes fa-wag {
  0% {
    transform: rotate(0deg);
    animation-timing-function: cubic-bezier(0.2, 0, 0.6, 1);
  }
  12% {
    transform: rotate(var(--fa-wag-angle, 12deg));
    animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  }
  24% {
    transform: rotate(2deg);
    animation-timing-function: cubic-bezier(0.2, 0, 0.6, 1);
  }
  36% {
    transform: rotate(calc(var(--fa-wag-angle, 12deg) * 0.85));
    animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  }
  48% {
    transform: rotate(1deg);
    animation-timing-function: cubic-bezier(0.2, 0, 0.6, 1);
  }
  58% {
    transform: rotate(calc(var(--fa-wag-angle, 12deg) * 0.6));
    animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  }
  68% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(0deg);
  }
}
@keyframes fa-float {
  0% {
    transform: translateY(0) translateX(0) rotate(0deg) scale(var(--fa-float-squash-x, 1.02), var(--fa-float-squash-y, 0.98));
    animation-timing-function: cubic-bezier(0.33, 0, 0.66, 0.33);
  }
  15% {
    transform: translateY(calc(-0.4 * var(--fa-float-height, 6px))) translateX(var(--fa-float-drift, 1px)) rotate(var(--fa-float-tilt, 1deg)) scale(1, 1);
    animation-timing-function: cubic-bezier(0.33, 0.66, 0.66, 1);
  }
  35% {
    transform: translateY(calc(-1 * var(--fa-float-height, 6px))) translateX(0) rotate(0deg) scale(var(--fa-float-stretch-x, 0.98), var(--fa-float-stretch-y, 1.03));
    animation-timing-function: cubic-bezier(0.5, 0, 0.5, 0);
  }
  50% {
    transform: translateY(calc(-0.92 * var(--fa-float-height, 6px))) translateX(calc(-0.5 * var(--fa-float-drift, 1px))) rotate(calc(-0.5 * var(--fa-float-tilt, 1deg))) scale(0.995, 1.01);
    animation-timing-function: cubic-bezier(0.33, 0, 0.66, 0.33);
  }
  70% {
    transform: translateY(calc(-0.3 * var(--fa-float-height, 6px))) translateX(calc(-1 * var(--fa-float-drift, 1px))) rotate(calc(-1 * var(--fa-float-tilt, 1deg))) scale(1, 1);
    animation-timing-function: cubic-bezier(0.33, 0.66, 0.66, 1);
  }
  90% {
    transform: translateY(calc(0.05 * var(--fa-float-height, 6px))) translateX(0) rotate(0deg) scale(var(--fa-float-squash-x, 1.02), var(--fa-float-squash-y, 0.98));
    animation-timing-function: cubic-bezier(0.33, 0, 0.66, 1);
  }
  100% {
    transform: translateY(0) translateX(0) rotate(0deg) scale(var(--fa-float-squash-x, 1.02), var(--fa-float-squash-y, 0.98));
  }
}
@keyframes fa-swing {
  0% {
    transform: rotate(0deg);
    animation-timing-function: cubic-bezier(0.2, 0, 0.8, 1);
  }
  8% {
    transform: rotate(var(--fa-swing-angle, 22deg));
    animation-timing-function: cubic-bezier(0.3, 0, 0.7, 1);
  }
  18% {
    transform: rotate(calc(-1 * var(--fa-swing-angle, 22deg) * 0.85));
    animation-timing-function: cubic-bezier(0.3, 0, 0.7, 1);
  }
  28% {
    transform: rotate(calc(var(--fa-swing-angle, 22deg) * 0.65));
    animation-timing-function: cubic-bezier(0.35, 0, 0.65, 1);
  }
  38% {
    transform: rotate(calc(-1 * var(--fa-swing-angle, 22deg) * 0.45));
    animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
  }
  48% {
    transform: rotate(calc(var(--fa-swing-angle, 22deg) * 0.25));
    animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
  }
  56% {
    transform: rotate(calc(-1 * var(--fa-swing-angle, 22deg) * 0.1));
    animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
  }
  64% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(0deg);
  }
}
@keyframes fa-jello {
  0% {
    transform: scale(1, 1);
    animation-timing-function: cubic-bezier(0.2, 0, 0.8, 1);
  }
  12% {
    transform: scale(var(--fa-jello-scale-x, 1.15), calc(2 - var(--fa-jello-scale-x, 1.15)));
    animation-timing-function: cubic-bezier(0.3, 0, 0.7, 1);
  }
  24% {
    transform: scale(calc(2 - var(--fa-jello-scale-y, 1.12)), var(--fa-jello-scale-y, 1.12));
    animation-timing-function: cubic-bezier(0.3, 0, 0.7, 1);
  }
  36% {
    transform: scale(calc(1 + (var(--fa-jello-scale-x, 1.15) - 1) * 0.5), calc(2 - (1 + (var(--fa-jello-scale-x, 1.15) - 1) * 0.5)));
    animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
  }
  48% {
    transform: scale(calc(2 - (1 + (var(--fa-jello-scale-y, 1.12) - 1) * 0.3)), calc(1 + (var(--fa-jello-scale-y, 1.12) - 1) * 0.3));
    animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
  }
  58% {
    transform: scale(1.02, 0.98);
    animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  }
  68% {
    transform: scale(1, 1);
  }
  100% {
    transform: scale(1, 1);
  }
}
.fa-rotate-90 {
  transform: rotate(90deg);
}

.fa-rotate-180 {
  transform: rotate(180deg);
}

.fa-rotate-270 {
  transform: rotate(270deg);
}

.fa-flip-horizontal {
  transform: scale(-1, 1);
}

.fa-flip-vertical {
  transform: scale(1, -1);
}

.fa-flip-both,
.fa-flip-horizontal.fa-flip-vertical {
  transform: scale(-1, -1);
}

.fa-rotate-by {
  transform: rotate(var(--fa-rotate-angle, 0));
}

.svg-inline--fa .fa-primary {
  fill: var(--fa-primary-color, currentColor);
  opacity: var(--fa-primary-opacity, 1);
}

.svg-inline--fa .fa-secondary {
  fill: var(--fa-secondary-color, currentColor);
  opacity: var(--fa-secondary-opacity, 0.4);
}

.svg-inline--fa.fa-swap-opacity .fa-primary {
  opacity: var(--fa-secondary-opacity, 0.4);
}

.svg-inline--fa.fa-swap-opacity .fa-secondary {
  opacity: var(--fa-primary-opacity, 1);
}

.svg-inline--fa mask .fa-primary,
.svg-inline--fa mask .fa-secondary {
  fill: black;
}

.svg-inline--fa.fa-inverse {
  fill: var(--fa-inverse, #fff);
}

.fa-stack {
  display: inline-block;
  height: 2em;
  line-height: 2em;
  position: relative;
  vertical-align: middle;
  width: 2.5em;
}

.fa-inverse {
  color: var(--fa-inverse, #fff);
}

.svg-inline--fa.fa-stack-1x {
  --fa-width: 1.25em;
  height: 1em;
  width: var(--fa-width);
}
.svg-inline--fa.fa-stack-2x {
  --fa-width: 2.5em;
  height: 2em;
  width: var(--fa-width);
}

.fa-stack-1x,
.fa-stack-2x {
  inset: 0;
  margin: auto;
  position: absolute;
  z-index: var(--fa-stack-z-index, auto);
}`;function Ti(){var e=Ir,t=Lr,n=z.cssPrefix,r=z.replacementClass,i=wi;if(n!==e||r!==t){var a=RegExp(`\\.${e}\\-`,`g`),o=RegExp(`\\--${e}\\-`,`g`),s=RegExp(`\\.${t}`,`g`);i=i.replace(a,`.${n}-`).replace(o,`--${n}-`).replace(s,`.${r}`)}return i}var Ei=!1;function Di(){z.autoAddCss&&!Ei&&(mi(Ti()),Ei=!0)}var Oi={mixout:function(){return{dom:{css:Ti,insertCss:Di}}},hooks:function(){return{beforeDOMElementCreation:function(){Di()},beforeI2svg:function(){Di()}}}},U=N||{};U[L]||(U[L]={}),U[L].styles||(U[L].styles={}),U[L].hooks||(U[L].hooks={}),U[L].shims||(U[L].shims=[]);var W=U[L],ki=[],Ai=function(){P.removeEventListener(`DOMContentLoaded`,Ai),ji=1,ki.map(function(e){return e()})},ji=!1;F&&(ji=(P.documentElement.doScroll?/^loaded|^c/:/^loaded|^i|^c/).test(P.readyState),ji||P.addEventListener(`DOMContentLoaded`,Ai));function Mi(e){F&&(ji?setTimeout(e,0):ki.push(e))}function Ni(e){var t=e.tag,n=e.attributes,r=n===void 0?{}:n,i=e.children,a=i===void 0?[]:i;return typeof e==`string`?vi(e):`<${t} ${yi(r)}>${a.map(Ni).join(``)}</${t}>`}function Pi(e,t,n){if(e&&e[t]&&e[t][n])return{prefix:t,iconName:n,icon:e[t][n]}}var Fi=function(e,t){return function(n,r,i,a){return e.call(t,n,r,i,a)}},Ii=function(e,t,n,r){var i=Object.keys(e),a=i.length,o=r===void 0?t:Fi(t,r),s,c,l;for(n===void 0?(s=1,l=e[i[0]]):(s=0,l=n);s<a;s++)c=i[s],l=o(l,e[c],c,e);return l};function Li(e){return M(e).length===1?e.codePointAt(0).toString(16):null}function Ri(e){return Object.keys(e).reduce(function(t,n){var r=e[n];return r.icon?t[r.iconName]=r.icon:t[n]=r,t},{})}function zi(e,t){var n=(arguments.length>2&&arguments[2]!==void 0?arguments[2]:{}).skipHooks,r=n!==void 0&&n,i=Ri(t);typeof W.hooks.addPack==`function`&&!r?W.hooks.addPack(e,Ri(t)):W.styles[e]=j(j({},W.styles[e]||{}),i),e===`fas`&&zi(`fa`,t)}var Bi=W.styles,Vi=W.shims,Hi=Object.keys($r),Ui=Hi.reduce(function(e,t){return e[t]=Object.keys($r[t]),e},{}),Wi=null,Gi={},Ki={},qi={},Ji={},Yi={};function Xi(e){return~oi.indexOf(e)}function Zi(e,t){var n=t.split(`-`),r=n[0],i=n.slice(1).join(`-`);return r===e&&i!==``&&!Xi(i)?i:null}var Qi=function(){var e=function(e){return Ii(Bi,function(t,n,r){return t[r]=Ii(n,e,{}),t},{})};Gi=e(function(e,t,n){return t[3]&&(e[t[3]]=n),t[2]&&t[2].filter(function(e){return typeof e==`number`}).forEach(function(t){e[t.toString(16)]=n}),e}),Ki=e(function(e,t,n){return e[n]=n,t[2]&&t[2].filter(function(e){return typeof e==`string`}).forEach(function(t){e[t]=n}),e}),Yi=e(function(e,t,n){var r=t[2];return e[n]=n,r.forEach(function(t){e[t]=n}),e});var t=`far`in Bi||z.autoFetchSvg,n=Ii(Vi,function(e,n){var r=n[0],i=n[1],a=n[2];return i===`far`&&!t&&(i=`fas`),typeof r==`string`&&(e.names[r]={prefix:i,iconName:a}),typeof r==`number`&&(e.unicodes[r.toString(16)]={prefix:i,iconName:a}),e},{names:{},unicodes:{}});qi=n.names,Ji=n.unicodes,Wi=aa(z.styleDefault,{family:z.familyDefault})};pi(function(e){Wi=aa(e.styleDefault,{family:z.familyDefault})}),Qi();function $i(e,t){return(Gi[e]||{})[t]}function ea(e,t){return(Ki[e]||{})[t]}function G(e,t){return(Yi[e]||{})[t]}function ta(e){return qi[e]||{prefix:null,iconName:null}}function na(e){var t=Ji[e],n=$i(`fas`,e);return t||(n?{prefix:`fas`,iconName:n}:null)||{prefix:null,iconName:null}}function K(){return Wi}var ra=function(){return{prefix:null,iconName:null,rest:[]}};function ia(e){var t=I,n=Hi.reduce(function(e,t){return e[t]=`${z.cssPrefix}-${t}`,e},{});return dr.forEach(function(r){(e.includes(n[r])||e.some(function(e){return Ui[r].includes(e)}))&&(t=r)}),t}function aa(e){var t=(arguments.length>1&&arguments[1]!==void 0?arguments[1]:{}).family,n=t===void 0?I:t,r=Yr[n][e];if(n===vn&&!e)return`fad`;var i=Zr[n][e]||Zr[n][r],a=e in W.styles?e:null;return i||a||null}function oa(e){var t=[],n=null;return e.forEach(function(e){var r=Zi(z.cssPrefix,e);r?n=r:e&&t.push(e)}),{iconName:n,rest:t}}function sa(e){return e.sort().filter(function(e,t,n){return n.indexOf(e)===t})}var ca=kr.concat(gr);function la(e){var t=(arguments.length>1&&arguments[1]!==void 0?arguments[1]:{}).skipLookups,n=t!==void 0&&t,r=null,i=sa(e.filter(function(e){return ca.includes(e)})),a=sa(e.filter(function(e){return!ca.includes(e)})),o=Xt(i.filter(function(e){return r=e,!_n.includes(e)}),1)[0],s=o===void 0?null:o,c=ia(i),l=j(j({},oa(a)),{},{prefix:aa(s,{family:c})});return j(j(j({},l),pa({values:e,family:c,styles:Bi,config:z,canonical:l,givenPrefix:r})),ua(n,r,l))}function ua(e,t,n){var r=n.prefix,i=n.iconName;if(e||!r||!i)return{prefix:r,iconName:i};var a=t===`fa`?ta(i):{},o=G(r,i);return i=a.iconName||o||i,r=a.prefix||r,r===`far`&&!Bi.far&&Bi.fas&&!z.autoFetchSvg&&(r=`fas`),{prefix:r,iconName:i}}var da=dr.filter(function(e){return e!==I||e!==vn}),fa=Object.keys(Or).filter(function(e){return e!==I}).map(function(e){return Object.keys(Or[e])}).flat();function pa(e){var t=e.values,n=e.family,r=e.canonical,i=e.givenPrefix,a=i===void 0?``:i,o=e.styles,s=o===void 0?{}:o,c=e.config,l=c===void 0?{}:c,u=n===vn,d=t.includes(`fa-duotone`)||t.includes(`fad`),f=l.familyDefault===`duotone`,p=r.prefix===`fad`||r.prefix===`fa-duotone`;return!u&&(d||f||p)&&(r.prefix=`fad`),(t.includes(`fa-brands`)||t.includes(`fab`))&&(r.prefix=`fab`),!r.prefix&&da.includes(n)&&(Object.keys(s).find(function(e){return fa.includes(e)})||l.autoFetchSvg)&&(r.prefix=mr.get(n).defaultShortPrefixId,r.iconName=G(r.prefix,r.iconName)||r.iconName),(r.prefix===`fa`||a===`fa`)&&(r.prefix=K()||`fas`),r}var ma=function(){function e(){Vt(this,e),this.definitions={}}return Ut(e,[{key:`add`,value:function(){var e=this,t=[...arguments].reduce(this._pullDefinitions,{});Object.keys(t).forEach(function(n){e.definitions[n]=j(j({},e.definitions[n]||{}),t[n]),zi(n,t[n]);var r=$r[I][n];r&&zi(r,t[n]),Qi()})}},{key:`reset`,value:function(){this.definitions={}}},{key:`_pullDefinitions`,value:function(e,t){var n=t.prefix&&t.iconName&&t.icon?{0:t}:t;return Object.keys(n).map(function(t){var r=n[t],i=r.prefix,a=r.iconName,o=r.icon,s=o[2];e[i]||(e[i]={}),s.length>0&&s.forEach(function(t){typeof t==`string`&&(e[i][t]=o)}),e[i][a]=o}),e}}])}(),ha=[],ga={},_a={},va=Object.keys(_a);function ya(e,t){var n=t.mixoutsTo;return ha=e,ga={},Object.keys(_a).forEach(function(e){va.indexOf(e)===-1&&delete _a[e]}),ha.forEach(function(e){var t=e.mixout?e.mixout():{};if(Object.keys(t).forEach(function(e){typeof t[e]==`function`&&(n[e]=t[e]),$t(t[e])===`object`&&Object.keys(t[e]).forEach(function(r){n[e]||(n[e]={}),n[e][r]=t[e][r]})}),e.hooks){var r=e.hooks();Object.keys(r).forEach(function(e){ga[e]||(ga[e]=[]),ga[e].push(r[e])})}e.provides&&e.provides(_a)}),n}function ba(e,t){var n=[...arguments].slice(2);return(ga[e]||[]).forEach(function(e){t=e.apply(null,[t].concat(n))}),t}function q(e){var t=[...arguments].slice(1);(ga[e]||[]).forEach(function(e){e.apply(null,t)})}function J(){var e=arguments[0],t=Array.prototype.slice.call(arguments,1);return _a[e]?_a[e].apply(null,t):void 0}function xa(e){e.prefix===`fa`&&(e.prefix=`fas`);var t=e.iconName,n=e.prefix||K();if(t)return t=G(n,t)||t,Pi(Sa.definitions,n,t)||Pi(W.styles,n,t)}var Sa=new ma,Y={noAuto:function(){z.autoReplaceSvg=!1,z.observeMutations=!1,q(`noAuto`)},config:z,dom:{i2svg:function(){var e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};return F?(q(`beforeI2svg`,e),J(`pseudoElements2svg`,e),J(`i2svg`,e)):Promise.reject(Error(`Operation requires a DOM of some kind.`))},watch:function(){var e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},t=e.autoReplaceSvgRoot;z.autoReplaceSvg===!1&&(z.autoReplaceSvg=!0),z.observeMutations=!0,Mi(function(){Ca({autoReplaceSvgRoot:t}),q(`watch`,e)})}},parse:{icon:function(e){if(e===null)return null;if($t(e)===`object`&&e.prefix&&e.iconName)return{prefix:e.prefix,iconName:G(e.prefix,e.iconName)||e.iconName};if(Array.isArray(e)&&e.length===2){var t=e[1].indexOf(`fa-`)===0?e[1].slice(3):e[1],n=aa(e[0]);return{prefix:n,iconName:G(n,t)||t}}if(typeof e==`string`&&(e.indexOf(`${z.cssPrefix}-`)>-1||e.match(ti))){var r=la(e.split(` `),{skipLookups:!0});return{prefix:r.prefix||K(),iconName:G(r.prefix,r.iconName)||r.iconName}}if(typeof e==`string`){var i=K();return{prefix:i,iconName:G(i,e)||e}}}},library:Sa,findIconDefinition:xa,toHtml:Ni},Ca=function(){var e=(arguments.length>0&&arguments[0]!==void 0?arguments[0]:{}).autoReplaceSvgRoot,t=e===void 0?P:e;(Object.keys(W.styles).length>0||z.autoFetchSvg)&&F&&z.autoReplaceSvg&&Y.dom.i2svg({node:t})};function wa(e,t){return Object.defineProperty(e,"abstract",{get:t}),Object.defineProperty(e,"html",{get:function(){return e.abstract.map(function(e){return Ni(e)})}}),Object.defineProperty(e,"node",{get:function(){if(F){var t=P.createElement(`div`);return t.innerHTML=e.html,t.children}}}),e}function Ta(e){var t=e.children,n=e.main,r=e.mask,i=e.attributes,a=e.styles,o=e.transform;if(xi(o)&&n.found&&!r.found){var s={x:n.width/n.height/2,y:.5};i.style=bi(j(j({},a),{},{"transform-origin":`${s.x+o.x/16}em ${s.y+o.y/16}em`}))}return[{tag:`svg`,attributes:i,children:t}]}function Ea(e){var t=e.prefix,n=e.iconName,r=e.children,i=e.attributes,a=e.symbol,o=a===!0?`${t}-${z.cssPrefix}-${n}`:a;return[{tag:`svg`,attributes:{style:`display: none;`},children:[{tag:`symbol`,attributes:j(j({},i),{},{id:o}),children:r}]}]}function Da(e){return[`aria-label`,`aria-labelledby`,`title`,`role`].some(function(t){return t in e})}function Oa(e){var t=e.icons,n=t.main,r=t.mask,i=e.prefix,a=e.iconName,o=e.transform,s=e.symbol,c=e.maskId,l=e.extra,u=e.watchable,d=u!==void 0&&u,f=r.found?r:n,p=f.width,m=f.height,h=[z.replacementClass,a?`${z.cssPrefix}-${a}`:``].filter(function(e){return l.classes.indexOf(e)===-1}).filter(function(e){return e!==``||!!e}).concat(l.classes).join(` `),g={children:[],attributes:j(j({},l.attributes),{},{"data-prefix":i,"data-icon":a,class:h,role:l.attributes.role||`img`,viewBox:`0 0 ${p} ${m}`})};!Da(l.attributes)&&!l.attributes[`aria-hidden`]&&(g.attributes[`aria-hidden`]=`true`),d&&(g.attributes[R]=``);var _=j(j({},g),{},{prefix:i,iconName:a,main:n,mask:r,maskId:c,transform:o,symbol:s,styles:j({},l.styles)}),v=r.found&&n.found?J(`generateAbstractMask`,_)||{children:[],attributes:{}}:J(`generateAbstractIcon`,_)||{children:[],attributes:{}},y=v.children,b=v.attributes;return _.children=y,_.attributes=b,s?Ea(_):Ta(_)}function ka(e){var t=e.content,n=e.width,r=e.height,i=e.transform,a=e.extra,o=e.watchable,s=o!==void 0&&o,c=j(j({},a.attributes),{},{class:a.classes.join(` `)});s&&(c[R]=``);var l=j({},a.styles);xi(i)&&(l.transform=Ci({transform:i,startCentered:!0,width:n,height:r}),l[`-webkit-transform`]=l.transform);var u=bi(l);u.length>0&&(c.style=u);var d=[];return d.push({tag:`span`,attributes:c,children:[t]}),d}function Aa(e){var t=e.content,n=e.extra,r=j(j({},n.attributes),{},{class:n.classes.join(` `)}),i=bi(n.styles);i.length>0&&(r.style=i);var a=[];return a.push({tag:`span`,attributes:r,children:[t]}),a}var ja=W.styles;function Ma(e){var t=e[0],n=e[1],r=Xt(e.slice(4),1)[0],i=null;return i=Array.isArray(r)?{tag:`g`,attributes:{class:`${z.cssPrefix}-${ai.GROUP}`},children:[{tag:`path`,attributes:{class:`${z.cssPrefix}-${ai.SECONDARY}`,fill:`currentColor`,d:r[0]}},{tag:`path`,attributes:{class:`${z.cssPrefix}-${ai.PRIMARY}`,fill:`currentColor`,d:r[1]}}]}:{tag:`path`,attributes:{fill:`currentColor`,d:r}},{found:!0,width:t,height:n,icon:i}}var Na={found:!1,width:512,height:512};function Pa(e,t){!Kr&&!z.showMissingIcons&&e&&console.error(`Icon with name "${e}" and prefix "${t}" is missing.`)}function Fa(e,t){var n=t;return t===`fa`&&z.styleDefault!==null&&(t=K()),new Promise(function(r,i){if(n===`fa`){var a=ta(e)||{};e=a.iconName||e,t=a.prefix||t}if(e&&t&&ja[t]&&ja[t][e]){var o=ja[t][e];return r(Ma(o))}Pa(e,t),r(j(j({},Na),{},{icon:z.showMissingIcons&&e&&J(`missingIconAbstract`)||{}}))})}var Ia=function(){},La=z.measurePerformance&&un&&un.mark&&un.measure?un:{mark:Ia,measure:Ia},Ra=`FA "7.3.1"`,za=function(e){return La.mark(`${Ra} ${e} begins`),function(){return Ba(e)}},Ba=function(e){La.mark(`${Ra} ${e} ends`),La.measure(`${Ra} ${e}`,`${Ra} ${e} begins`,`${Ra} ${e} ends`)},Va={begin:za,end:Ba},Ha=function(){};function Ua(e){return typeof(e.getAttribute?e.getAttribute(R):null)==`string`}function Wa(e){var t=e.getAttribute?e.getAttribute(Br):null,n=e.getAttribute?e.getAttribute(Vr):null;return t&&n}function Ga(e){return e&&e.classList&&e.classList.contains&&e.classList.contains(z.replacementClass)}function Ka(){return z.autoReplaceSvg===!0?Za.replace:Za[z.autoReplaceSvg]||Za.replace}function qa(e){return P.createElementNS(`http://www.w3.org/2000/svg`,e)}function Ja(e){return P.createElement(e)}function Ya(e){var t=(arguments.length>1&&arguments[1]!==void 0?arguments[1]:{}).ceFn,n=t===void 0?e.tag===`svg`?qa:Ja:t;if(typeof e==`string`)return P.createTextNode(e);var r=n(e.tag);return Object.keys(e.attributes||[]).forEach(function(t){r.setAttribute(t,e.attributes[t])}),(e.children||[]).forEach(function(e){r.appendChild(Ya(e,{ceFn:n}))}),r}function Xa(e){var t=` ${e.outerHTML} `;return t=`${t}Font Awesome fontawesome.com `,t}var Za={replace:function(e){var t=e[0];if(t.parentNode){if(e[1].forEach(function(e){t.parentNode.insertBefore(Ya(e),t)}),t.getAttribute(R)===null&&z.keepOriginalSource){var n=P.createComment(Xa(t));t.parentNode.replaceChild(n,t)}else t.remove()}},nest:function(e){var t=e[0],n=e[1];if(~_i(t).indexOf(z.replacementClass))return Za.replace(e);var r=RegExp(`${z.cssPrefix}-.*`);if(delete n[0].attributes.id,n[0].attributes.class){var i=n[0].attributes.class.split(` `).reduce(function(e,t){return t===z.replacementClass||t.match(r)?e.toSvg.push(t):e.toNode.push(t),e},{toNode:[],toSvg:[]});n[0].attributes.class=i.toSvg.join(` `),i.toNode.length===0?t.removeAttribute(`class`):t.setAttribute(`class`,i.toNode.join(` `))}var a=n.map(function(e){return Ni(e)}).join(`
`);t.setAttribute(R,``),t.innerHTML=a}};function Qa(e){e()}function $a(e,t){var n=typeof t==`function`?t:Ha;if(e.length===0)n();else{var r=Qa;z.mutateApproach===Ur&&(r=N.requestAnimationFrame||Qa),r(function(){var t=Ka(),r=Va.begin(`mutate`);e.map(t),r(),n()})}}var eo=!1;function to(){eo=!0}function no(){eo=!1}var ro=null;function io(e){if(ln&&z.observeMutations){var t=e.treeCallback,n=t===void 0?Ha:t,r=e.nodeCallback,i=r===void 0?Ha:r,a=e.pseudoElementsCallback,o=a===void 0?Ha:a,s=e.observeMutationsRoot,c=s===void 0?P:s;ro=new ln(function(e){if(!eo){var t=K();H(e).forEach(function(e){if(e.type===`childList`&&e.addedNodes.length>0&&!Ua(e.addedNodes[0])&&(z.searchPseudoElements&&o(e.target),n(e.target)),e.type===`attributes`&&e.target.parentNode&&z.searchPseudoElements&&o([e.target],!0),e.type===`attributes`&&Ua(e.target)&&~ii.indexOf(e.attributeName)){if(e.attributeName===`class`&&Wa(e.target)){var r=la(_i(e.target)),a=r.prefix,s=r.iconName;e.target.setAttribute(Br,a||t),s&&e.target.setAttribute(Vr,s)}else Ga(e.target)&&i(e.target)}})}}),F&&ro.observe(c,{childList:!0,attributes:!0,characterData:!0,subtree:!0})}}function ao(){ro&&ro.disconnect()}function oo(e){var t=e.getAttribute(`style`),n=[];return t&&(n=t.split(`;`).reduce(function(e,t){var n=t.split(`:`),r=n[0],i=n.slice(1);return r&&i.length>0&&(e[r]=i.join(`:`).trim()),e},{})),n}function so(e){var t=e.getAttribute(`data-prefix`),n=e.getAttribute(`data-icon`),r=e.innerText===void 0?``:e.innerText.trim(),i=la(_i(e));return i.prefix||(i.prefix=K()),t&&n&&(i.prefix=t,i.iconName=n),i.iconName&&i.prefix?i:(i.prefix&&r.length>0&&(i.iconName=ea(i.prefix,e.innerText)||$i(i.prefix,Li(e.innerText))),!i.iconName&&z.autoFetchSvg&&e.firstChild&&e.firstChild.nodeType===Node.TEXT_NODE&&(i.iconName=e.firstChild.data),i)}function co(e){return H(e.attributes).reduce(function(e,t){return e.name!==`class`&&e.name!==`style`&&(e[t.name]=t.value),e},{})}function lo(){return{iconName:null,prefix:null,transform:V,symbol:!1,mask:{iconName:null,prefix:null,rest:[]},maskId:null,extra:{classes:[],styles:{},attributes:{}}}}function uo(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{styleParser:!0},n=so(e),r=n.iconName,i=n.prefix,a=n.rest,o=co(e),s=ba(`parseNodeAttributes`,{},e);return j({iconName:r,prefix:i,transform:V,mask:{iconName:null,prefix:null,rest:[]},maskId:null,symbol:!1,extra:{classes:a,styles:t.styleParser?oo(e):[],attributes:o}},s)}var fo=W.styles;function po(e){var t=z.autoReplaceSvg===`nest`?uo(e,{styleParser:!1}):uo(e);return~t.extra.classes.indexOf(ni)?J(`generateLayersText`,e,t):J(`generateSvgReplacementMutation`,e,t)}function mo(){return[].concat(M(gr),M(kr))}function ho(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:null;if(!F)return Promise.resolve();var n=P.documentElement.classList,r=function(e){return n.add(`${Hr}-${e}`)},i=function(e){return n.remove(`${Hr}-${e}`)},a=z.autoFetchSvg?mo():_n.concat(Object.keys(fo));a.includes(`fa`)||a.push(`fa`);var o=[`.${ni}:not([${R}])`].concat(a.map(function(e){return`.${e}:not([${R}])`})).join(`, `);if(o.length===0)return Promise.resolve();var s=[];try{s=H(e.querySelectorAll(o))}catch{}if(s.length>0)r(`pending`),i(`complete`);else return Promise.resolve();var c=Va.begin(`onTree`),l=s.reduce(function(e,t){try{var n=po(t);n&&e.push(n)}catch(e){Kr||e.name===`MissingIcon`&&console.error(e)}return e},[]);return new Promise(function(e,n){Promise.all(l).then(function(n){$a(n,function(){r(`active`),r(`complete`),i(`pending`),typeof t==`function`&&t(),c(),e()})}).catch(function(e){c(),n(e)})})}function go(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:null;po(e).then(function(e){e&&$a([e],t)})}function _o(e){return function(t){var n=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},r=(t||{}).icon?t:xa(t||{}),i=n.mask;return i&&(i=(i||{}).icon?i:xa(i||{})),e(r,j(j({},n),{},{mask:i}))}}var vo=function(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},n=t.transform,r=n===void 0?V:n,i=t.symbol,a=i!==void 0&&i,o=t.mask,s=o===void 0?null:o,c=t.maskId,l=c===void 0?null:c,u=t.classes,d=u===void 0?[]:u,f=t.attributes,p=f===void 0?{}:f,m=t.styles,h=m===void 0?{}:m;if(e){var g=e.prefix,_=e.iconName,v=e.icon;return wa(j({type:`icon`},e),function(){return q(`beforeDOMElementCreation`,{iconDefinition:e,params:t}),Oa({icons:{main:Ma(v),mask:s?Ma(s.icon):{found:!1,width:null,height:null,icon:{}}},prefix:g,iconName:_,transform:j(j({},V),r),symbol:a,maskId:l,extra:{attributes:p,styles:h,classes:d}})})}},yo={mixout:function(){return{icon:_o(vo)}},hooks:function(){return{mutationObserverCallbacks:function(e){return e.treeCallback=ho,e.nodeCallback=go,e}}},provides:function(e){e.i2svg=function(e){var t=e.node,n=t===void 0?P:t,r=e.callback;return ho(n,r===void 0?function(){}:r)},e.generateSvgReplacementMutation=function(e,t){var n=t.iconName,r=t.prefix,i=t.transform,a=t.symbol,o=t.mask,s=t.maskId,c=t.extra;return new Promise(function(t,l){Promise.all([Fa(n,r),o.iconName?Fa(o.iconName,o.prefix):Promise.resolve({found:!1,width:512,height:512,icon:{}})]).then(function(o){var l=Xt(o,2),u=l[0],d=l[1];t([e,Oa({icons:{main:u,mask:d},prefix:r,iconName:n,transform:i,symbol:a,maskId:s,extra:c,watchable:!0})])}).catch(l)})},e.generateAbstractIcon=function(e){var t=e.children,n=e.attributes,r=e.main,i=e.transform,a=e.styles,o=bi(a);o.length>0&&(n.style=o);var s;return xi(i)&&(s=J(`generateAbstractTransformGrouping`,{main:r,transform:i,containerWidth:r.width,iconWidth:r.width})),t.push(s||r.icon),{children:t,attributes:n}}}},bo={mixout:function(){return{layer:function(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},n=t.classes,r=n===void 0?[]:n;return wa({type:`layer`},function(){q(`beforeDOMElementCreation`,{assembler:e,params:t});var n=[];return e(function(e){Array.isArray(e)?e.map(function(e){n=n.concat(e.abstract)}):n=n.concat(e.abstract)}),[{tag:`span`,attributes:{class:[`${z.cssPrefix}-layers`].concat(M(r)).join(` `)},children:n}]})}}}},xo={mixout:function(){return{counter:function(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},n=t.title,r=n===void 0?null:n,i=t.classes,a=i===void 0?[]:i,o=t.attributes,s=o===void 0?{}:o,c=t.styles,l=c===void 0?{}:c;return wa({type:`counter`,content:e},function(){return q(`beforeDOMElementCreation`,{content:e,params:t}),Aa({content:e.toString(),title:r,extra:{attributes:s,styles:l,classes:[`${z.cssPrefix}-layers-counter`].concat(M(a))}})})}}}},So={mixout:function(){return{text:function(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},n=t.transform,r=n===void 0?V:n,i=t.classes,a=i===void 0?[]:i,o=t.attributes,s=o===void 0?{}:o,c=t.styles,l=c===void 0?{}:c;return wa({type:`text`,content:e},function(){return q(`beforeDOMElementCreation`,{content:e,params:t}),ka({content:e,transform:j(j({},V),r),extra:{attributes:s,styles:l,classes:[`${z.cssPrefix}-layers-text`].concat(M(a))}})})}}},provides:function(e){e.generateLayersText=function(e,t){var n=t.transform,r=t.extra,i=null,a=null;if(dn){var o=parseInt(getComputedStyle(e).fontSize,10),s=e.getBoundingClientRect();i=s.width/o,a=s.height/o}return Promise.resolve([e,ka({content:e.innerHTML,width:i,height:a,transform:n,extra:r,watchable:!0})])}}},Co=RegExp(`"`,`ug`),wo=[1105920,1112319],To=j(j(j(j({},{FontAwesome:{normal:`fas`,400:`fas`}}),pr),Pr),br),Eo=Object.keys(To).reduce(function(e,t){return e[t.toLowerCase()]=To[t],e},{}),Do=Object.keys(Eo).reduce(function(e,t){var n=Eo[t];return e[t]=n[900]||M(Object.entries(n))[0][1],e},{});function Oo(e){return Li(M(e.replace(Co,``))[0]||``)}function ko(e){var t=e.getPropertyValue(`font-feature-settings`).includes(`ss01`),n=e.getPropertyValue(`content`).replace(Co,``),r=n.codePointAt(0),i=r>=wo[0]&&r<=wo[1],a=n.length===2&&n[0]===n[1];return i||a||t}function Ao(e,t){var n=e.replace(/^['"]|['"]$/g,``).toLowerCase(),r=parseInt(t),i=isNaN(r)?`normal`:r;return(Eo[n]||{})[i]||Do[n]}function jo(e,t){var n=`${zr}${t.replace(`:`,`-`)}`;return new Promise(function(r,i){if(e.getAttribute(n)!==null)return r();var a=H(e.children).filter(function(e){return e.getAttribute(Rr)===t})[0],o=N.getComputedStyle(e,t),s=o.getPropertyValue(`font-family`),c=s.match(ri),l=o.getPropertyValue(`font-weight`),u=o.getPropertyValue(`content`);if(a&&!c)return e.removeChild(a),r();if(c&&u!==`none`&&u!==``){var d=o.getPropertyValue(`content`),f=Ao(s,l),p=Oo(d),m=c[0].startsWith(`FontAwesome`),h=ko(o),g=$i(f,p),_=g;if(m){var v=na(p);v.iconName&&v.prefix&&(g=v.iconName,f=v.prefix)}if(g&&!h&&(!a||a.getAttribute(Br)!==f||a.getAttribute(Vr)!==_)){e.setAttribute(n,_),a&&e.removeChild(a);var y=lo(),b=y.extra;b.attributes[Rr]=t,Fa(g,f).then(function(i){var a=Oa(j(j({},y),{},{icons:{main:i,mask:ra()},prefix:f,iconName:_,extra:b,watchable:!0})),o=P.createElementNS(`http://www.w3.org/2000/svg`,`svg`);t===`::before`?e.insertBefore(o,e.firstChild):e.appendChild(o),o.outerHTML=a.map(function(e){return Ni(e)}).join(`
`),e.removeAttribute(n),r()}).catch(i)}else r()}else r()})}function Mo(e){return Promise.all([jo(e,`::before`),jo(e,`::after`)])}function No(e){return e.parentNode!==document.head&&!~Wr.indexOf(e.tagName.toUpperCase())&&!e.getAttribute(Rr)&&(!e.parentNode||e.parentNode.tagName!==`svg`)}var Po=function(e){return!!e&&Gr.some(function(t){return e.includes(t)})},Fo=function(e){if(!e)return[];var t=new Set,n=e.split(/,(?![^()]*\))/).map(function(e){return e.trim()});n=n.flatMap(function(e){return e.includes(`(`)?e:e.split(`,`).map(function(e){return e.trim()})});var r=Wt(n),i;try{for(r.s();!(i=r.n()).done;){var a=i.value;if(Po(a)){var o=Gr.reduce(function(e,t){return e.replace(t,``)},a);o!==``&&o!==`*`&&t.add(o)}}}catch(e){r.e(e)}finally{r.f()}return t};function Io(e){var t=arguments.length>1&&arguments[1]!==void 0&&arguments[1];if(F){var n;if(t)n=e;else if(z.searchPseudoElementsFullScan)n=e.querySelectorAll(`*`);else{var r=new Set,i=Wt(document.styleSheets),a;try{for(i.s();!(a=i.n()).done;){var o=a.value;try{var s=Wt(o.cssRules),c;try{for(s.s();!(c=s.n()).done;){var l=c.value,u=Wt(Fo(l.selectorText)),d;try{for(u.s();!(d=u.n()).done;){var f=d.value;r.add(f)}}catch(e){u.e(e)}finally{u.f()}}}catch(e){s.e(e)}finally{s.f()}}catch(e){z.searchPseudoElementsWarnings&&console.warn(`Font Awesome: cannot parse stylesheet: ${o.href} (${e.message})
If it declares any Font Awesome CSS pseudo-elements, they will not be rendered as SVG icons. Add crossorigin="anonymous" to the <link>, enable searchPseudoElementsFullScan for slower but more thorough DOM parsing, or suppress this warning by setting searchPseudoElementsWarnings to false.`)}}}catch(e){i.e(e)}finally{i.f()}if(!r.size)return;var p=Array.from(r).join(`, `);try{n=e.querySelectorAll(p)}catch{}}return new Promise(function(e,t){var r=H(n).filter(No).map(Mo),i=Va.begin(`searchPseudoElements`);to(),Promise.all(r).then(function(){i(),no(),e()}).catch(function(){i(),no(),t()})})}}var Lo={hooks:function(){return{mutationObserverCallbacks:function(e){return e.pseudoElementsCallback=Io,e}}},provides:function(e){e.pseudoElements2svg=function(e){var t=e.node,n=t===void 0?P:t;z.searchPseudoElements&&Io(n)}}},Ro=!1,zo={mixout:function(){return{dom:{unwatch:function(){to(),Ro=!0}}}},hooks:function(){return{bootstrap:function(){io(ba(`mutationObserverCallbacks`,{}))},noAuto:function(){ao()},watch:function(e){var t=e.observeMutationsRoot;Ro?no():io(ba(`mutationObserverCallbacks`,{observeMutationsRoot:t}))}}}},Bo=function(e){return e.toLowerCase().split(` `).reduce(function(e,t){var n=t.toLowerCase().split(`-`),r=n[0],i=n.slice(1).join(`-`);if(r&&i===`h`)return e.flipX=!0,e;if(r&&i===`v`)return e.flipY=!0,e;if(i=parseFloat(i),isNaN(i))return e;switch(r){case`grow`:e.size+=i;break;case`shrink`:e.size-=i;break;case`left`:e.x-=i;break;case`right`:e.x+=i;break;case`up`:e.y-=i;break;case`down`:e.y+=i;break;case`rotate`:e.rotate+=i}return e},{size:16,x:0,y:0,flipX:!1,flipY:!1,rotate:0})},Vo={mixout:function(){return{parse:{transform:function(e){return Bo(e)}}}},hooks:function(){return{parseNodeAttributes:function(e,t){var n=t.getAttribute(`data-fa-transform`);return n&&(e.transform=Bo(n)),e}}},provides:function(e){e.generateAbstractTransformGrouping=function(e){var t=e.main,n=e.transform,r=e.containerWidth,i=e.iconWidth,a={outer:{transform:`translate(${r/2} 256)`},inner:{transform:`${`translate(${n.x*32}, ${n.y*32}) `} ${`scale(${n.size/16*(n.flipX?-1:1)}, ${n.size/16*(n.flipY?-1:1)}) `} ${`rotate(${n.rotate} 0 0)`}`},path:{transform:`translate(${i/2*-1} -256)`}};return{tag:`g`,attributes:j({},a.outer),children:[{tag:`g`,attributes:j({},a.inner),children:[{tag:t.icon.tag,children:t.icon.children,attributes:j(j({},t.icon.attributes),a.path)}]}]}}}},Ho={x:0,y:0,width:`100%`,height:`100%`};function Uo(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!0;return e.attributes&&(e.attributes.fill||t)&&(e.attributes.fill=`black`),e}function Wo(e){return e.tag===`g`?e.children:[e]}ya([Oi,yo,bo,xo,So,Lo,zo,Vo,{hooks:function(){return{parseNodeAttributes:function(e,t){var n=t.getAttribute(`data-fa-mask`),r=n?la(n.split(` `).map(function(e){return e.trim()})):ra();return r.prefix||(r.prefix=K()),e.mask=r,e.maskId=t.getAttribute(`data-fa-mask-id`),e}}},provides:function(e){e.generateAbstractMask=function(e){var t=e.children,n=e.attributes,r=e.main,i=e.mask,a=e.maskId,o=e.transform,s=r.width,c=r.icon,l=i.width,u=i.icon,d=Si({transform:o,containerWidth:l,iconWidth:s}),f={tag:`rect`,attributes:j(j({},Ho),{},{fill:`white`})},p=c.children?{children:c.children.map(Uo)}:{},m={tag:`g`,attributes:j({},d.inner),children:[Uo(j({tag:c.tag,attributes:j(j({},c.attributes),d.path)},p))]},h={tag:`g`,attributes:j({},d.outer),children:[m]},g=`mask-${a||gi()}`,_=`clip-${a||gi()}`,v={tag:`mask`,attributes:j(j({},Ho),{},{id:g,maskUnits:`userSpaceOnUse`,maskContentUnits:`userSpaceOnUse`}),children:[f,h]},y={tag:`defs`,children:[{tag:`clipPath`,attributes:{id:_},children:Wo(u)},v]};return t.push(y,{tag:`rect`,attributes:j({fill:`currentColor`,"clip-path":`url(#${_})`,mask:`url(#${g})`},Ho)}),{children:t,attributes:n}}}},{provides:function(e){var t=!1;N.matchMedia&&(t=N.matchMedia(`(prefers-reduced-motion: reduce)`).matches),e.missingIconAbstract=function(){var e=[],n={fill:`currentColor`},r={attributeType:`XML`,repeatCount:`indefinite`,dur:`2s`};e.push({tag:`path`,attributes:j(j({},n),{},{d:`M156.5,447.7l-12.6,29.5c-18.7-9.5-35.9-21.2-51.5-34.9l22.7-22.7C127.6,430.5,141.5,440,156.5,447.7z M40.6,272H8.5 c1.4,21.2,5.4,41.7,11.7,61.1L50,321.2C45.1,305.5,41.8,289,40.6,272z M40.6,240c1.4-18.8,5.2-37,11.1-54.1l-29.5-12.6 C14.7,194.3,10,216.7,8.5,240H40.6z M64.3,156.5c7.8-14.9,17.2-28.8,28.1-41.5L69.7,92.3c-13.7,15.6-25.5,32.8-34.9,51.5 L64.3,156.5z M397,419.6c-13.9,12-29.4,22.3-46.1,30.4l11.9,29.8c20.7-9.9,39.8-22.6,56.9-37.6L397,419.6z M115,92.4 c13.9-12,29.4-22.3,46.1-30.4l-11.9-29.8c-20.7,9.9-39.8,22.6-56.8,37.6L115,92.4z M447.7,355.5c-7.8,14.9-17.2,28.8-28.1,41.5 l22.7,22.7c13.7-15.6,25.5-32.9,34.9-51.5L447.7,355.5z M471.4,272c-1.4,18.8-5.2,37-11.1,54.1l29.5,12.6 c7.5-21.1,12.2-43.5,13.6-66.8H471.4z M321.2,462c-15.7,5-32.2,8.2-49.2,9.4v32.1c21.2-1.4,41.7-5.4,61.1-11.7L321.2,462z M240,471.4c-18.8-1.4-37-5.2-54.1-11.1l-12.6,29.5c21.1,7.5,43.5,12.2,66.8,13.6V471.4z M462,190.8c5,15.7,8.2,32.2,9.4,49.2h32.1 c-1.4-21.2-5.4-41.7-11.7-61.1L462,190.8z M92.4,397c-12-13.9-22.3-29.4-30.4-46.1l-29.8,11.9c9.9,20.7,22.6,39.8,37.6,56.9 L92.4,397z M272,40.6c18.8,1.4,36.9,5.2,54.1,11.1l12.6-29.5C317.7,14.7,295.3,10,272,8.5V40.6z M190.8,50 c15.7-5,32.2-8.2,49.2-9.4V8.5c-21.2,1.4-41.7,5.4-61.1,11.7L190.8,50z M442.3,92.3L419.6,115c12,13.9,22.3,29.4,30.5,46.1 l29.8-11.9C470,128.5,457.3,109.4,442.3,92.3z M397,92.4l22.7-22.7c-15.6-13.7-32.8-25.5-51.5-34.9l-12.6,29.5 C370.4,72.1,384.4,81.5,397,92.4z`})});var i=j(j({},r),{},{attributeName:`opacity`}),a={tag:`circle`,attributes:j(j({},n),{},{cx:`256`,cy:`364`,r:`28`}),children:[]};return t||a.children.push({tag:`animate`,attributes:j(j({},r),{},{attributeName:`r`,values:`28;14;28;28;14;28;`})},{tag:`animate`,attributes:j(j({},i),{},{values:`1;0;1;1;0;1;`})}),e.push(a),e.push({tag:`path`,attributes:j(j({},n),{},{opacity:`1`,d:`M263.7,312h-16c-6.6,0-12-5.4-12-12c0-71,77.4-63.9,77.4-107.8c0-20-17.8-40.2-57.4-40.2c-29.1,0-44.3,9.6-59.2,28.7 c-3.9,5-11.1,6-16.2,2.4l-13.1-9.2c-5.6-3.9-6.9-11.8-2.6-17.2c21.2-27.2,46.4-44.7,91.2-44.7c52.3,0,97.4,29.8,97.4,80.2 c0,67.6-77.4,63.5-77.4,107.8C275.7,306.6,270.3,312,263.7,312z`}),children:t?[]:[{tag:`animate`,attributes:j(j({},i),{},{values:`1;0;0;0;0;1;`})}]}),t||e.push({tag:`path`,attributes:j(j({},n),{},{opacity:`0`,d:`M232.5,134.5l7,168c0.3,6.4,5.6,11.5,12,11.5h9c6.4,0,11.7-5.1,12-11.5l7-168c0.3-6.8-5.2-12.5-12-12.5h-23 C237.7,122,232.2,127.7,232.5,134.5z`}),children:[{tag:`animate`,attributes:j(j({},i),{},{values:`0;0;1;1;0;0;`})}]}),{tag:`g`,attributes:{class:`missing`},children:e}}}},{hooks:function(){return{parseNodeAttributes:function(e,t){var n=t.getAttribute(`data-fa-symbol`);return e.symbol=n===null?!1:n===``||n,e}}}}],{mixoutsTo:Y}),Y.noAuto;var X=Y.config;Y.library,Y.dom;var Go=Y.parse;Y.findIconDefinition,Y.toHtml;var Ko=Y.icon;Y.layer,Y.text,Y.counter;function qo(e){return e-=0,e===e}function Jo(e){return qo(e)?e:(e=e.replace(/[_-]+(.)?/g,(e,t)=>t?t.toUpperCase():``),e.charAt(0).toLowerCase()+e.slice(1))}var Yo=(e,t)=>s.createElement(`stop`,{key:`${t}-${e.offset}`,offset:e.offset,stopColor:e.color,...e.opacity!==void 0&&{stopOpacity:e.opacity}});function Xo(e){return e.charAt(0).toUpperCase()+e.slice(1)}var Zo=new Map,Qo=1e3;function $o(e){if(Zo.has(e))return Zo.get(e);let t={},n=0,r=e.length;for(;n<r;){let i=e.indexOf(`;`,n),a=i===-1?r:i,o=e.slice(n,a).trim();if(o){let e=o.indexOf(`:`);if(e>0){let n=o.slice(0,e).trim(),r=o.slice(e+1).trim();if(n&&r){let e=Jo(n);t[e.startsWith(`webkit`)?Xo(e):e]=r}}}n=a+1}if(Zo.size===Qo){let e=Zo.keys().next().value;e&&Zo.delete(e)}return Zo.set(e,t),t}function es(e,t,n={}){if(typeof t==`string`)return t;let r=(t.children||[]).map(t=>{let r=t;return(`fill`in n||n.gradientFill)&&t.tag===`path`&&`fill`in t.attributes&&(r={...t,attributes:{...t.attributes,fill:void 0}}),es(e,r)}),i=t.attributes||{},a={};for(let[e,t]of Object.entries(i))switch(!0){case e===`class`:a.className=t;break;case e===`style`:a.style=$o(String(t));break;case e.startsWith(`aria-`):case e.startsWith(`data-`):a[e.toLowerCase()]=t;break;default:a[Jo(e)]=t}let{style:o,role:s,"aria-label":c,gradientFill:l,...u}=n;if(o&&(a.style=a.style?{...a.style,...o}:o),s&&(a.role=s),c&&(a[`aria-label`]=c,a[`aria-hidden`]=`false`),l){a.fill=`url(#${l.id})`;let{type:t,stops:n=[],...i}=l;r.unshift(e(t===`linear`?`linearGradient`:`radialGradient`,{...i,id:l.id},n.map(Yo)))}return e(t.tag,{...a,...u},...r)}var ts=es.bind(null,s.createElement),ns=(e,t)=>{let n=(0,s.useId)();return e||(t?n:void 0)},rs=class{constructor(e=`react-fontawesome`){this.enabled=!1;let t=!1;try{t=typeof process<`u`&&!1}catch{}this.scope=e,this.enabled=t}log(...e){this.enabled&&console.log(`[${this.scope}]`,...e)}warn(...e){this.enabled&&console.warn(`[${this.scope}]`,...e)}error(...e){this.enabled&&console.error(`[${this.scope}]`,...e)}};typeof process<`u`&&{}.FA_VERSION;var is=`searchPseudoElementsFullScan`in X&&typeof X.searchPseudoElementsFullScan==`boolean`?`7.0.0`:`6.0.0`,as=Number.parseInt(is)>=7,os=()=>as,ss=`fa`,Z={beat:`fa-beat`,fade:`fa-fade`,beatFade:`fa-beat-fade`,bounce:`fa-bounce`,shake:`fa-shake`,spin:`fa-spin`,spinPulse:`fa-spin-pulse`,spinReverse:`fa-spin-reverse`,pulse:`fa-pulse`,flip360:`fa-flip-360`,buzz:`fa-buzz`,float:`fa-float`,jello:`fa-jello`,spinSnap:`fa-spin-snap`,spinSnap4:`fa-spin-snap-4`,spinSnap8:`fa-spin-snap-8`,swing:`fa-swing`,wag:`fa-wag`},cs={left:`fa-pull-left`,right:`fa-pull-right`},ls={90:`fa-rotate-90`,180:`fa-rotate-180`,270:`fa-rotate-270`},us={"2xs":`fa-2xs`,xs:`fa-xs`,sm:`fa-sm`,lg:`fa-lg`,xl:`fa-xl`,"2xl":`fa-2xl`,"1x":`fa-1x`,"2x":`fa-2x`,"3x":`fa-3x`,"4x":`fa-4x`,"5x":`fa-5x`,"6x":`fa-6x`,"7x":`fa-7x`,"8x":`fa-8x`,"9x":`fa-9x`,"10x":`fa-10x`},Q={border:`fa-border`,fixedWidth:`fa-fw`,flip:`fa-flip`,flipHorizontal:`fa-flip-horizontal`,flipVertical:`fa-flip-vertical`,inverse:`fa-inverse`,rotateBy:`fa-rotate-by`,swapOpacity:`fa-swap-opacity`,widthAuto:`fa-width-auto`,canvasSquare:`fa-canvas-square`,canvasRoomy:`fa-canvas-roomy`},ds={default:`fa-layers`};function fs(e){let t=X.cssPrefix||X.familyPrefix||ss;return t===ss?e:e.replace(new RegExp(String.raw`(?<=^|\s)${ss}-`,`g`),`${t}-`)}function ps(e){let{beat:t,fade:n,beatFade:r,bounce:i,shake:a,spin:o,spinPulse:s,spinReverse:c,pulse:l,fixedWidth:u,inverse:d,border:f,flip:p,size:m,rotation:h,pull:g,swapOpacity:_,rotateBy:v,widthAuto:y,canvasSquare:b,canvasRoomy:ee,flip360:x,buzz:te,float:ne,jello:S,spinSnap:re,spinSnap4:ie,spinSnap8:ae,swing:oe,wag:se,className:C}=e,w=[];return C&&w.push(...C.split(` `)),t&&w.push(Z.beat),n&&w.push(Z.fade),r&&w.push(Z.beatFade),i&&w.push(Z.bounce),a&&w.push(Z.shake),o&&w.push(Z.spin),c&&w.push(Z.spinReverse),s&&w.push(Z.spinPulse),l&&w.push(Z.pulse),u&&w.push(Q.fixedWidth),d&&w.push(Q.inverse),f&&w.push(Q.border),p===!0&&w.push(Q.flip),(p===`horizontal`||p===`both`)&&w.push(Q.flipHorizontal),(p===`vertical`||p===`both`)&&w.push(Q.flipVertical),m!=null&&w.push(us[m]),h!=null&&h!==0&&w.push(ls[h]),g!=null&&w.push(cs[g]),_&&w.push(Q.swapOpacity),os()?(v&&w.push(Q.rotateBy),y&&w.push(Q.widthAuto),b&&w.push(Q.canvasSquare),ee&&w.push(Q.canvasRoomy),x&&w.push(Z.flip360),te&&w.push(Z.buzz),ne&&w.push(Z.float),S&&w.push(Z.jello),re&&w.push(Z.spinSnap),ie&&w.push(Z.spinSnap4),ae&&w.push(Z.spinSnap8),oe&&w.push(Z.swing),se&&w.push(Z.wag),(X.cssPrefix||X.familyPrefix||ss)===ss?w:w.map(fs)):w}var ms=e=>typeof e==`object`&&`icon`in e&&!!e.icon;function hs(e){if(e)return ms(e)?e:Go.icon(e)}function gs(e){return Object.keys(e)}var _s=new rs(`FontAwesomeIcon`),vs={border:!1,className:``,mask:void 0,maskId:void 0,fixedWidth:!1,inverse:!1,flip:!1,icon:void 0,listItem:!1,pull:void 0,pulse:!1,rotation:void 0,rotateBy:!1,size:void 0,spin:!1,spinPulse:!1,spinReverse:!1,beat:!1,fade:!1,beatFade:!1,bounce:!1,shake:!1,symbol:!1,title:``,titleId:void 0,transform:void 0,swapOpacity:!1,widthAuto:!1,canvasSquare:!1,canvasRoomy:!1,flip360:!1,buzz:!1,float:!1,jello:!1,spinSnap:!1,spinSnap4:!1,spinSnap8:!1,swing:!1,wag:!1},ys=new Set(Object.keys(vs)),bs=s.forwardRef((e,t)=>{let n={...vs,...e},{icon:r,mask:i,symbol:a,title:o,titleId:s,maskId:c,transform:l}=n,u=ns(c,!!i),d=ns(s,!!o),f=hs(r);if(!f)return _s.error(`Icon lookup is undefined`,r),null;let p=ps(n),m=typeof l==`string`?Go.transform(l):l,h=hs(i),g=Ko(f,{...p.length>0&&{classes:p},...m&&{transform:m},...h&&{mask:h},symbol:a,title:o,titleId:d,maskId:u});if(!g)return _s.error(`Could not find icon`,f),null;let{abstract:_}=g,v={ref:t};for(let e of gs(n))ys.has(e)||(v[e]=n[e]);return ts(_[0],v)});bs.displayName=`FontAwesomeIcon`,`${ds.default}${Q.fixedWidth}`,X.autoAddCss=!1;var xs=({name:e,style:t=`solid`,size:n,fixedWidth:r,className:i,title:a,testId:o,...s})=>{let c=Lt(e,t);return(0,k.jsx)(bs,{"data-testid":o,...s,icon:c,className:bt(`ui-icon`,i),"data-size":n,size:n,fixedWidth:r,widthAuto:!r,"aria-label":a})},Ss=`data-starting-style`,Cs=`data-ending-style`,ws={[Ss]:``},Ts={[Cs]:``},Es={transitionStatus(e){return e===`starting`?ws:e===`ending`?Ts:null}},Ds=`data-popup-open`,Os=`data-pressed`,ks=`none`,As=`trigger-press`,js=`trigger-hover`,Ms=`trigger-focus`,Ns=`outside-press`,Ps=`item-press`,Fs=`close-press`,Is=`input-change`,Ls=`input-clear`,Rs=`input-press`,zs=`focus-out`,Bs=`escape-key`,Vs=`close-watcher`,Hs=`list-navigation`,Us=`keyboard`,Ws=`pointer`,Gs=`cancel-open`,Ks=`sibling-open`,qs=`disabled`,Js=`missing`,Ys=`initial`,Xs=`imperative-action`,Zs=`swipe`,Qs=`window-resize`;function $s(){return typeof navigator>`u`?{userAgent:``,platform:``,maxTouchPoints:0}:{userAgent:navigator.userAgent,platform:navigator.platform??``,maxTouchPoints:navigator.maxTouchPoints??0}}var{userAgent:ec,platform:tc,maxTouchPoints:nc}=$s(),rc=ec.toLowerCase(),ic=tc.toLowerCase(),ac=/^i(os$|p)/.test(ic)||ic===`macintel`&&nc>1,oc=`android`,sc=ic===oc||rc.includes(oc),cc=!ac&&ic.startsWith(`mac`);ic.startsWith(`win`),!sc&&/^(linux|chrome os)/.test(ic);var lc=cc||ac,uc=typeof CSS<`u`&&!!CSS.supports?.(`-webkit-backdrop-filter:none`),dc=!uc&&rc.includes(`firefox`);!uc&&rc.includes(`chrom`);var fc=lc,pc=/jsdom|happydom/.test(rc),mc=e(d(),1),hc=0;function gc(e,t=`mui`){let[n,r]=s.useState(e),i=e||n;return s.useEffect(()=>{n??(hc+=1,r(`${t}-${hc}`))},[n,t]),i}var _c=fe.useId;function vc(e,t){if(_c!==void 0){let n=_c();return e??(t?`${t}-${n}`:n)}return gc(e,t)}function yc(e,t,n,r){let i=!1,a=!1,o=r??O;return{reason:e,event:t??new Event(`base-ui`),cancel(){i=!0},allowPropagation(){a=!0},get isCanceled(){return i},get isPropagationAllowed(){return a},trigger:n,...o}}function bc(e,t,n){let r=n??O;return{reason:e,event:t??new Event(`base-ui`),...r}}function xc(e){s.useEffect(e,et)}var Sc=null;globalThis.requestAnimationFrame;var Cc=new class{constructor(){i(this,`callbacks`,[]),i(this,`callbacksCount`,0),i(this,`nextId`,1),i(this,`startId`,1),i(this,`isScheduled`,!1),i(this,`tick`,e=>{this.isScheduled=!1;let t=this.callbacks,n=this.callbacksCount;if(this.callbacks=[],this.callbacksCount=0,this.startId=this.nextId,n>0)for(let n=0;n<t.length;n+=1)t[n]?.(e)})}request(e){let t=this.nextId;return this.nextId+=1,this.callbacks.push(e),this.callbacksCount+=1,this.isScheduled||(requestAnimationFrame(this.tick),this.isScheduled=!0),t}cancel(e){let t=e-this.startId;t<0||t>=this.callbacks.length||this.callbacks[t]!==null&&(this.callbacks[t]=null,--this.callbacksCount)}},wc=class e{constructor(){i(this,`currentId`,Sc),i(this,`cancel`,()=>{this.currentId!==Sc&&(Cc.cancel(this.currentId),this.currentId=Sc)}),i(this,`disposeEffect`,()=>this.cancel)}static create(){return new e}static request(e){return Cc.request(e)}static cancel(e){return Cc.cancel(e)}request(e){this.cancel(),this.currentId=Cc.request(()=>{this.currentId=Sc,e()})}};function Tc(){let e=T(wc.create).current;return xc(e.disposeEffect),e}function Ec(e){return e==null?e:`current`in e?e.current:e}var Dc=null;function Oc(e){if(!Dc){let e=[];Dc=e,queueMicrotask(()=>{Dc=null,mc.flushSync(()=>{for(let t of e)t()})})}Dc.push(e)}function kc(e,t=!1,n=!1){let r=Tc();return E((i,a=null)=>{r.cancel();let o=Ec(e);if(o==null)return;let s=o,c=()=>{if(!n){mc.flushSync(i);return}Oc(()=>{a?.aborted||i()})};if(typeof s.getAnimations!=`function`||globalThis.BASE_UI_ANIMATIONS_DISABLED){i();return}function l(){Promise.all(s.getAnimations().map(e=>e.finished)).then(()=>{a?.aborted||c()},()=>{if(!a?.aborted){if(s.getAnimations().some(e=>e.pending||e.playState!==`finished`)){l();return}c()}})}if(t){let e=Ss;if(!s.hasAttribute(e)){r.request(l);return}let t=new MutationObserver(()=>{s.hasAttribute(e)||(t.disconnect(),l())});t.observe(s,{attributes:!0,attributeFilter:[e]}),a?.addEventListener(`abort`,()=>t.disconnect(),{once:!0});return}r.request(l)})}function Ac(e){let{enabled:t=!0,open:n,ref:r,batch:i=!1,onComplete:a}=e,o=E(a),c=kc(r,n,i);s.useEffect(()=>{if(!t)return;let e=new AbortController;return c(o,e.signal),()=>{e.abort()}},[t,n,o,c])}var jc=0,Mc=class e{constructor(){i(this,`currentId`,jc),i(this,`clear`,()=>{this.currentId!==jc&&(clearTimeout(this.currentId),this.currentId=jc)}),i(this,`disposeEffect`,()=>this.clear)}static create(){return new e}start(e,t){this.clear(),this.currentId=setTimeout(()=>{this.currentId=jc,t()},e)}isStarted(){return this.currentId!==jc}};function Nc(){let e=T(Mc.create).current;return xc(e.disposeEffect),e}function Pc(e){e.preventDefault(),e.stopPropagation()}function Fc(e){return`nativeEvent`in e}function Ic(e){return e.pointerType===``&&e.isTrusted?!0:sc&&e.pointerType?e.type===`click`&&e.buttons===1:e.detail===0&&!e.pointerType}function Lc(e){return pc?!1:!sc&&e.width===0&&e.height===0||sc&&e.width===1&&e.height===1&&e.pressure===0&&e.detail===0&&e.pointerType===`mouse`||e.width<1&&e.height<1&&e.pressure===0&&e.detail===0&&e.pointerType===`touch`}function Rc(e,t){let n=[`mouse`,`pen`];return t||n.push(``,void 0),n.includes(e)}function zc(e){let t=e.type;return t===`click`||t===`mousedown`||t===`keydown`||t===`keyup`}function Bc(e){let t=e.activeElement;for(;t?.shadowRoot?.activeElement!=null;)t=t.shadowRoot.activeElement;return t}function Vc(e,t){if(!e||!t)return!1;let n=t.getRootNode?.();if(e.contains(t))return!0;if(n&&y(n)){let n=t;for(;n;){if(e===n)return!0;n=n.parentNode||n.host}}return!1}function Hc(e){return`composedPath`in e?e.composedPath()[0]??e.target:e.target}var Uc=`data-base-ui-focusable`,Wc=`input:not([type='hidden']):not([disabled]),[contenteditable]:not([contenteditable='false']),textarea:not([disabled])`,Gc=`ArrowLeft`,Kc=`ArrowRight`,qc=`ArrowUp`,Jc=`ArrowDown`,Yc=`data-trigger-disabled`;function Xc(e,t){if(!_(e))return!1;let n=e;if(t.hasElement(n))return!n.hasAttribute(Yc);for(let[,e]of t.entries())if(Vc(e,n))return!e.hasAttribute(Yc);return!1}function Zc(e,t){if(t==null)return!1;if(`composedPath`in e)return e.composedPath().includes(t);let n=e;return n.target!=null&&t.contains(n.target)}function Qc(e){return e.matches(`html,body`)}function $c(e){return v(e)&&e.matches(`input:not([type='hidden']):not([disabled]),[contenteditable]:not([contenteditable='false']),textarea:not([disabled])`)}function el(e){return e?.closest(`button,a[href],[role="button"],select,[tabindex]:not([tabindex="-1"]),${Wc}`)!=null}function tl(e){return e?e.getAttribute(`role`)===`combobox`&&$c(e):!1}function nl(e){if(!e||pc)return!0;try{return e.matches(`:focus-visible`)}catch{return!0}}function rl(e){return e?e.hasAttribute(`data-base-ui-focusable`)?e:e.querySelector(`[data-base-ui-focusable]`)||e:null}function il(e,t,n,r){return e.addEventListener(t,n,r),()=>{e.removeEventListener(t,n,r)}}function al(...e){return()=>{for(let t=0;t<e.length;t+=1){let n=e[t];n&&n()}}}var ol={clipPath:`inset(50%)`,overflow:`hidden`,whiteSpace:`nowrap`,border:0,padding:0,width:1,height:1,margin:-1},sl={...ol,position:`fixed`,top:0,left:0},cl={...ol,position:`absolute`},ll=s.forwardRef(function(e,t){let[n,r]=s.useState();D(()=>{fc&&uc&&r(`button`)},[]);let i={tabIndex:0,role:n};return(0,k.jsx)(`span`,{...e,ref:t,style:sl,"aria-hidden":!n||void 0,...i,"data-base-ui-focus-guard":``})}),ul=Math.min,dl=Math.max,fl=Math.round,pl=Math.floor,ml=e=>({x:e,y:e}),hl={left:`right`,right:`left`,bottom:`top`,top:`bottom`};function gl(e,t,n){return dl(e,ul(t,n))}function _l(e,t){return typeof e==`function`?e(t):e}function vl(e){return e.split(`-`)[0]}function yl(e){return e.split(`-`)[1]}function bl(e){return e===`x`?`y`:`x`}function xl(e){return e===`y`?`height`:`width`}function Sl(e){let t=e[0];return t===`t`||t===`b`?`y`:`x`}function Cl(e){return bl(Sl(e))}function wl(e,t,n){n===void 0&&(n=!1);let r=yl(e),i=Cl(e),a=xl(i),o=i===`x`?r===(n?`end`:`start`)?`right`:`left`:r===`start`?`bottom`:`top`;return t.reference[a]>t.floating[a]&&(o=Nl(o)),[o,Nl(o)]}function Tl(e){let t=Nl(e);return[El(e),t,El(t)]}function El(e){return e.includes(`start`)?e.replace(`start`,`end`):e.replace(`end`,`start`)}var Dl=[`left`,`right`],Ol=[`right`,`left`],kl=[`top`,`bottom`],Al=[`bottom`,`top`];function jl(e,t,n){switch(e){case`top`:case`bottom`:return n?t?Ol:Dl:t?Dl:Ol;case`left`:case`right`:return t?kl:Al;default:return[]}}function Ml(e,t,n,r){let i=yl(e),a=jl(vl(e),n===`start`,r);return i&&(a=a.map(e=>e+`-`+i),t&&(a=a.concat(a.map(El)))),a}function Nl(e){let t=vl(e);return hl[t]+e.slice(t.length)}function Pl(e){return{top:e.top??0,right:e.right??0,bottom:e.bottom??0,left:e.left??0}}function Fl(e){return typeof e==`number`?{top:e,right:e,bottom:e,left:e}:Pl(e)}function Il(e){let{x:t,y:n,width:r,height:i}=e;return{width:r,height:i,top:n,left:t,right:t+r,bottom:n+i,x:t,y:n}}function Ll(e,t,n){return Math.floor(e/t)!==n}function Rl(e,t){return t<0||t>=e.length}function zl(e,t){return $(e.current,{disabledIndices:t})}function Bl(e,t){return $(e.current,{decrement:!0,startingIndex:e.current.length,disabledIndices:t})}function $(e,{startingIndex:t=-1,decrement:n=!1,disabledIndices:r,amount:i=1}={}){let a=t;do a+=n?-i:i;while(a>=0&&a<=e.length-1&&Hl(e,a,r));return a}function Vl(e,{event:t,orientation:n,loopFocus:r,onLoop:i,rtl:a,cols:o,disabledIndices:s,minIndex:c,maxIndex:l,prevIndex:u,stopEvent:d=!1}){let f=u,p;if(t.key===`ArrowUp`?p=`up`:t.key===`ArrowDown`&&(p=`down`),p){let n=[],a=[],m=!1,h=0;{let t=null,r=-1;e.forEach((e,i)=>{if(e==null)return;h+=1;let o=e.closest(`[role="row"]`);o&&(m=!0),(o!==t||r===-1)&&(t=o,r+=1,n[r]=[]),n[r].push(i),a[i]=r})}let g=!1,_=0;if(m)for(let e of n){let t=e.length;t>_&&(_=t),t!==o&&(g=!0)}let v=g&&h<e.length,y=_||o,b=o=>{if(!g||u===-1)return;let c=a[u];if(c==null)return;let l=n[c].indexOf(u),d=o===`up`?-1:1;for(let o=c+d,f=0;f<n.length;f+=1,o+=d){if(o<0||o>=n.length){if(!r||v)return;if(o=o<0?n.length-1:0,i){let e=Math.min(l,n[o].length-1),r=i(t,u,n[o][e]??n[o][0]);o=a[r]??o}}let c=n[o];for(let t=Math.min(l,c.length-1);t>=0;--t){let n=c[t];if(!Hl(e,n,s))return n}}},ee=t=>{if(!v||u===-1)return;let n=u%y,i=t===`up`?-y:y,a=l-l%y,o=pl(l/y)+1;for(let t=u-n+i,c=0;c<o;c+=1,t+=i){if(t<0||t>l){if(!r)return;t=t<0?a:0}let i=Math.min(t+y-1,l);for(let r=Math.min(t+n,i);r>=t;--r)if(!Hl(e,r,s))return r}};d&&Pc(t);let x=b(p)??ee(p);if(x!==void 0)f=x;else if(u===-1)f=p===`up`?l:c;else if(f=$(e,{startingIndex:u,amount:y,decrement:p===`up`,disabledIndices:s}),r){if(p===`up`&&(u-y<c||f<0)){let e=u%y,n=l%y,r=l-(n-e);f=n===e?l:n>e?r:r-y,i&&(f=i(t,u,f))}p===`down`&&u+y>l&&(f=$(e,{startingIndex:u%y-y,amount:y,disabledIndices:s}),i&&(f=i(t,u,f)))}Rl(e,f)&&(f=u)}if(n===`both`){let n=pl(u/o);t.key===(a?`ArrowLeft`:`ArrowRight`)&&(d&&Pc(t),u%o===o-1?r&&(f=$(e,{startingIndex:u-u%o-1,disabledIndices:s}),i&&(f=i(t,u,f))):(f=$(e,{startingIndex:u,disabledIndices:s}),r&&Ll(f,o,n)&&(f=$(e,{startingIndex:u-u%o-1,disabledIndices:s}),i&&(f=i(t,u,f)))),Ll(f,o,n)&&(f=u)),t.key===(a?`ArrowRight`:`ArrowLeft`)&&(d&&Pc(t),u%o===0?r&&(f=$(e,{startingIndex:u+(o-u%o),decrement:!0,disabledIndices:s}),i&&(f=i(t,u,f))):(f=$(e,{startingIndex:u,decrement:!0,disabledIndices:s}),r&&Ll(f,o,n)&&(f=$(e,{startingIndex:u+(o-u%o),decrement:!0,disabledIndices:s}),i&&(f=i(t,u,f)))),Ll(f,o,n)&&(f=u));let c=pl(l/o)===n;Rl(e,f)&&(r&&c?(f=t.key===(a?`ArrowRight`:`ArrowLeft`)?l:$(e,{startingIndex:u-u%o-1,disabledIndices:s}),i&&(f=i(t,u,f))):f=u)}return f}function Hl(e,t,n){if(typeof n==`function`?n(t):n?.includes(t)??!1)return!0;let r=e[t];return r?!Wl(r)||r.matches(`:disabled`)?!0:!n&&(r.hasAttribute(`disabled`)||r.getAttribute(`aria-disabled`)===`true`):!1}function Ul(e){return e.visibility===`hidden`||e.visibility===`collapse`}function Wl(e,t=e?C(e):null){return!e||!e.isConnected||!t||Ul(t)?!1:typeof e.checkVisibility==`function`?e.checkVisibility():t.display!==`none`&&t.display!==`contents`}var Gl=`a[href],button,input,select,textarea,summary,details,iframe,object,embed,[tabindex],[contenteditable]:not([contenteditable="false"]),audio[controls],video[controls]`;function Kl(e){let t=e.assignedSlot;if(t)return t;if(e.parentElement)return e.parentElement;let n=e.getRootNode();return y(n)?n.host:null}function ql(e){for(let t of Array.from(e.children))if(p(t)===`summary`)return t;return null}function Jl(e,t){let n=ql(t);return!!n&&(e===n||Vc(n,e))}function Yl(e){let t=e?p(e):``;return e!=null&&e.matches(Gl)&&(t!==`summary`||e.parentElement!=null&&p(e.parentElement)===`details`&&ql(e.parentElement)===e)&&(t!==`details`||ql(e)==null)&&(t!==`input`||e.type!==`hidden`)}function Xl(e){if(!Yl(e)||!e.isConnected||e.matches(`:disabled`))return!1;for(let t=e;t;t=Kl(t)){let n=t!==e,r=p(t)===`slot`;if(t.hasAttribute(`inert`)||n&&p(t)===`details`&&!t.open&&!Jl(e,t)||t.hasAttribute(`hidden`)||!r&&!Zl(t,n))return!1}return!0}function Zl(e,t){let n=C(e);return t?n.display!==`none`:Wl(e,n)}function Ql(e){let t=e.tabIndex;if(t<0){let t=p(e);if(t===`details`||t===`audio`||t===`video`||v(e)&&e.isContentEditable)return 0}return t}function $l(e){if(p(e)!==`input`)return null;let t=e;return t.type===`radio`&&t.name!==``?t:null}function eu(e,t){let n=$l(e);if(!n)return!0;let r=t.find(e=>{let t=$l(e);return t?.name===n.name&&t.form===n.form&&t.checked});return r?r===n:t.find(e=>{let t=$l(e);return t?.name===n.name&&t.form===n.form})===n}function tu(e){if(v(e)&&p(e)===`slot`){let t=e.assignedElements({flatten:!0});if(t.length>0)return t}return v(e)&&e.shadowRoot?Array.from(e.shadowRoot.children):Array.from(e.children)}function nu(e,t){tu(e).forEach(e=>{Yl(e)&&t.push(e),nu(e,t)})}function ru(e,t,n){tu(e).forEach(e=>{v(e)&&e.matches(t)&&n.push(e),ru(e,t,n)})}function iu(e){return Xl(e)&&Ql(e)>=0}function au(e){let t=[];return nu(e,t),t.filter(Xl)}function ou(e){let t=au(e);return t.filter(e=>Ql(e)>=0&&eu(e,t))}function su(e,t){let n=ou(e),r=n.length;if(r===0)return;let i=Bc(ze(e)),a=n.indexOf(i);return n[a===-1?t===1?0:r-1:a+t]}function cu(e){return su(ze(e).body,1)||e}function lu(e){return su(ze(e).body,-1)||e}function uu(e,t){if(!e)return null;let n=ou(ze(e).body),r=n.length;if(r===0)return null;let i=n.indexOf(e);return i===-1?null:n[(i+t+r)%r]}function du(e){return uu(e,1)}function fu(e){return uu(e,-1)}function pu(e,t){let n=t||e.currentTarget,r=e.relatedTarget;return!r||!Vc(n,r)}function mu(e){ou(e).forEach(e=>{e.dataset.tabindex=e.getAttribute(`tabindex`)||``,e.setAttribute(`tabindex`,`-1`)})}function hu(e){let t=[];ru(e,`[data-tabindex]`,t),t.forEach(e=>{let t=e.dataset.tabindex;delete e.dataset.tabindex,t?e.setAttribute(`tabindex`,t):e.removeAttribute(`tabindex`)})}function gu(e){return`data-base-ui-${e}`}var _u={style:{transition:`none`}},vu=`data-base-ui-click-trigger`,yu=`data-base-ui-swipe-ignore`,bu=`data-swipe-ignore`,xu=`[${yu}]`,Su=`[${bu}]`,Cu={fallbackAxisSide:`none`},wu={fallbackAxisSide:`end`},Tu={clipPath:`inset(50%)`,position:`fixed`,top:0,left:0},Eu=s.createContext(null),Du=()=>s.useContext(Eu),Ou=gu(`portal`);function ku(e={}){let{ref:t,container:n,componentProps:r=O,elementProps:i}=e,a=vc(),o=Du()?.portalNode,[c,l]=s.useState(null),[u,d]=s.useState(null),f=E(e=>{e!==null&&d(e)}),p=s.useRef(null);D(()=>{if(n===null){p.current&&(p.current=null,d(null),l(null));return}let e=(n&&(g(n)?n:n.current))??o??document.body;if(e==null){p.current&&(p.current=null,d(null),l(null));return}p.current!==e&&(p.current=e,d(null),l(e))},[n,o]);let m=it(`div`,r,{ref:[t,f],props:[{id:a,[Ou]:``},i]}),h=c&&m?mc.createPortal(m,c):null;return{node:u,nodeId:s.isValidElement(m)?m.props.id:void 0,subtree:h}}var Au=s.forwardRef(function(e,t){let{render:n,className:r,style:i,children:a,container:o,portalOwnerRole:c,...l}=e,{node:u,nodeId:d,subtree:f}=ku({container:o,ref:t,componentProps:e,elementProps:l}),p=s.useRef(null),m=s.useRef(null),h=s.useRef(null),g=s.useRef(null),[_,v]=s.useState(null),y=s.useRef(!1),b=_?.modal,ee=_?.open,x=!!_&&!_.modal&&_.open&&!!u;s.useEffect(()=>{if(!u||b)return;function e(e){u&&e.relatedTarget&&pu(e)&&(e.type===`focusin`?y.current&&(hu(u),y.current=!1):(mu(u),y.current=!0))}return al(il(u,`focusin`,e,!0),il(u,`focusout`,e,!0))},[u,b]),D(()=>{!u||ee!==!0||!y.current||(hu(u),y.current=!1)},[ee,u]);let te=s.useMemo(()=>({beforeOutsideRef:p,afterOutsideRef:m,beforeInsideRef:h,afterInsideRef:g,portalNode:u,setFocusManagerState:v}),[u]);return(0,k.jsxs)(s.Fragment,{children:[f,(0,k.jsxs)(Eu.Provider,{value:te,children:[x&&u&&(0,k.jsx)(ll,{"data-type":`outside`,ref:p,onFocus:e=>{pu(e,u)?h.current?.focus():lu(_?_.domReference:null)?.focus()}}),x&&u&&(0,k.jsx)(`span`,{role:c,"aria-owns":d,style:Tu}),u&&mc.createPortal(a,u),x&&u&&(0,k.jsx)(ll,{"data-type":`outside`,ref:m,onFocus:e=>{pu(e,u)?g.current?.focus():(cu(_?_.domReference:null)?.focus(),_?.closeOnFocusOut&&_?.onOpenChange(!1,yc(`focus-out`,e.nativeEvent)))}})]})]})}),ju=t((e=>{var t=r(),n=o();function i(e,t){return e===t&&(e!==0||1/e==1/t)||e!==e&&t!==t}var a=typeof Object.is==`function`?Object.is:i,s=n.useSyncExternalStore,c=t.useRef,l=t.useEffect,u=t.useMemo,d=t.useDebugValue;e.useSyncExternalStoreWithSelector=function(e,t,n,r,i){var o=c(null);if(o.current===null){var f={hasValue:!1,value:null};o.current=f}else f=o.current;o=u(function(){function e(e){if(!o){if(o=!0,s=e,e=r(e),i!==void 0&&f.hasValue){var t=f.value;if(i(t,e))return c=t}return c=e}if(t=c,a(s,e))return t;var n=r(e);return i!==void 0&&i(t,n)?(s=e,t):(s=e,c=n)}var o=!1,s,c,l=n===void 0?null:n;return[function(){return e(t())},l===null?void 0:function(){return e(l())}]},[t,n,r,i]);var p=s(e,o[0],o[1]);return l(function(){f.hasValue=!0,f.value=p},[p]),d(p),p}})),Mu=t(((e,t)=>{t.exports=ju()})),Nu=o(),Pu=Mu(),Fu=[],Iu=void 0;function Lu(){return Iu}function Ru(e){Fu.push(e)}function zu(e){let t=(t,n)=>{let r=T(Vu).current,i;try{Iu=r;for(let e of Fu)e.before(r);i=e(t,n);for(let e of Fu)e.after(r);r.didInitialize=!0}finally{Iu=void 0}return i};return t.displayName=e.displayName||e.name,t}function Bu(e){return s.forwardRef(zu(e))}function Vu(){return{didInitialize:!1}}var Hu=Ze(19)?Gu:Ku;function Uu(e,t,n,r,i){return Hu(e,t,n,r,i)}function Wu(e,t,n,r,i){let a=s.useCallback(()=>t(e.getSnapshot(),n,r,i),[e,t,n,r,i]);return(0,Nu.useSyncExternalStore)(e.subscribe,a,a)}Ru({before(e){e.syncIndex=0,e.didInitialize||(e.syncTick=1,e.syncHooks=[],e.didChangeStore=!0,e.getSnapshot=()=>{let t=!1;for(let n=0;n<e.syncHooks.length;n+=1){let r=e.syncHooks[n],i=r.selector(r.store.state,r.a1,r.a2,r.a3);Object.is(r.value,i)||(t=!0,r.value=i)}return t&&(e.syncTick+=1),e.syncTick})},after(e){e.syncHooks.length>0&&(e.didChangeStore&&(e.didChangeStore=!1,e.subscribe=t=>{let n=new Set;for(let t of e.syncHooks)n.add(t.store);let r=[];for(let e of n)r.push(e.subscribe(t));return()=>{for(let e of r)e()}}),(0,Nu.useSyncExternalStore)(e.subscribe,e.getSnapshot,e.getSnapshot))}});function Gu(e,t,n,r,i){let a=Lu();if(!a)return Wu(e,t,n,r,i);let o=a.syncIndex;a.syncIndex+=1;let s;return a.didInitialize?(s=a.syncHooks[o],(s.store!==e||s.selector!==t||!Object.is(s.a1,n)||!Object.is(s.a2,r)||!Object.is(s.a3,i))&&(s.store!==e&&(a.didChangeStore=!0),s.store=e,s.selector=t,s.a1=n,s.a2=r,s.a3=i,s.value=t(e.getSnapshot(),n,r,i))):(s={store:e,selector:t,a1:n,a2:r,a3:i,value:t(e.getSnapshot(),n,r,i)},a.syncHooks.push(s)),s.value}function Ku(e,t,n,r,i){return(0,Pu.useSyncExternalStoreWithSelector)(e.subscribe,e.getSnapshot,e.getSnapshot,e=>t(e,n,r,i))}var qu=class{static create(e){return new this(e)}constructor(e){i(this,`subscribe`,e=>(this.listeners.add(e),()=>{this.listeners.delete(e)})),i(this,`getSnapshot`,()=>this.state),this.state=e,this.listeners=new Set,this.updateTick=0}setState(e){if(this.state===e)return;this.state=e,this.updateTick+=1;let t=this.updateTick;for(let n of this.listeners){if(t!==this.updateTick)return;n(e)}}update(e){for(let t in e)if(!Object.is(this.state[t],e[t])){this.setState({...this.state,...e});return}}set(e,t){Object.is(this.state[e],t)||this.setState({...this.state,[e]:t})}notifyAll(){let e={...this.state};this.setState(e)}use(e,t,n,r){return Uu(this,e,t,n,r)}},Ju=class extends qu{constructor(e,t={},n){super(e),this.context=t,this.selectors=n}useSyncedValue(e,t){s.useDebugValue(e);let n=this;D(()=>{n.state[e]!==t&&n.set(e,t)},[n,e,t])}useSyncedValueWithCleanup(e,t){let n=this;D(()=>(n.state[e]!==t&&n.set(e,t),()=>{n.set(e,void 0)}),[n,e,t])}useSyncedValues(e){let t=this;D(()=>{t.update(e)},[t,...Object.values(e)])}useControlledProp(e,t){s.useDebugValue(e);let n=this,r=t!==void 0;D(()=>{r&&!Object.is(n.state[e],t)&&n.setState({...n.state,[e]:t})},[n,e,t,r])}select(e,t,n,r){let i=this.selectors[e];return i(this.state,t,n,r)}useState(e,t,n,r){return s.useDebugValue(e),Uu(this,this.selectors[e],t,n,r)}useContextCallback(e,t){s.useDebugValue(e);let n=E(t??$e);this.context[e]=n}useStateSetter(e){let t=s.useRef(void 0);return t.current===void 0&&(t.current=t=>{this.set(e,t)}),t.current}observe(e,t){let n;n=typeof e==`function`?e:this.selectors[e];let r=n(this.state);return t(r,r,this),this.subscribe(e=>{let i=n(e);if(!Object.is(r,i)){let e=r;r=i,t(i,e,this)}})}};function Yu(e){return Ze(19)?e:e?`true`:void 0}export{al as $,v as $n,Us as $t,Hl as A,$e as An,xc as At,bl as B,E as Bn,cc as Bt,ou as C,_t as Cn,Mc as Ct,zl as D,rt as Dn,Ec as Dt,Bl as E,it as En,kc as Et,yl as F,Ie as Fn,fc as Ft,Sl as G,de as Gn,Bs as Gt,Nl as H,C as Hn,Fs as Ht,Cl as I,Le as In,dc as It,Il as J,ue as Jn,Ys as Jt,dl as K,p as Kn,zs as Kt,wl as L,Fe as Ln,uc as Lt,ml as M,Ve as Mn,bc as Mt,_l as N,Be as Nn,vc as Nt,Wl as O,et as On,wc as Ot,pl as P,ze as Pn,pc as Pt,cl as Q,_ as Qn,Ps as Qt,xl as R,be as Rn,sc as Rt,iu as S,gt as Sn,Pc as St,Vl as T,mt as Tn,Ac as Tt,Fl as U,ae as Un,Vs as Ut,Ml as V,T as Vn,Gs as Vt,vl as W,h as Wn,qs as Wt,ll as X,m as Xn,Ls as Xt,fl as Y,ce as Yn,Is as Yt,sl as Z,ie as Zn,Rs as Zt,cu as _,wt as _n,zc as _t,Mu as a,Ks as an,oe as ar,Xc as at,fu as b,bt as bn,Ic as bt,Du as c,js as cn,l as cr,nl as ct,_u as d,Ds as dn,Kc as dt,Hs as en,se as er,il as et,Cu as f,Os as fn,qc as ft,au as g,xs as gn,Hc as gt,gu as h,Ss as hn,Vc as ht,Bu as i,Ws as in,x as ir,Qc as it,gl as j,We as jn,yc as jt,Rl as k,O as kn,Tc as kt,xu as l,As as ln,o as lr,Jc as lt,wu as m,Cs as mn,Bc as mt,Ju as n,ks as nn,y as nr,Zc as nt,Au as o,Zs as on,d as or,tl as ot,Su as p,Es as pn,Uc as pt,ul as q,w as qn,Xs as qt,zu as r,Ns as rn,ee as rr,el as rt,ku as s,Ms as sn,c as sr,$c as st,Yu as t,Js as tn,b as tr,rl as tt,vu as u,Qs as un,Gc as ut,lu as v,Ct as vn,Rc as vt,$ as w,ht as wn,Nc as wt,pu as x,vt as xn,Lc as xt,du as y,xt as yn,Fc as yt,Tl as z,D as zn,ac as zt};