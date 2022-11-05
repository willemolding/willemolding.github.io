"use strict";(self.webpackChunkwillemolding_github_io=self.webpackChunkwillemolding_github_io||[]).push([[3245],{3905:(e,t,a)=>{a.d(t,{Zo:()=>h,kt:()=>m});var n=a(7294);function i(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function o(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function r(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?o(Object(a),!0).forEach((function(t){i(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):o(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function s(e,t){if(null==e)return{};var a,n,i=function(e,t){if(null==e)return{};var a,n,i={},o=Object.keys(e);for(n=0;n<o.length;n++)a=o[n],t.indexOf(a)>=0||(i[a]=e[a]);return i}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)a=o[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(i[a]=e[a])}return i}var l=n.createContext({}),c=function(e){var t=n.useContext(l),a=t;return e&&(a="function"==typeof e?e(t):r(r({},t),e)),a},h=function(e){var t=c(e.components);return n.createElement(l.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},u=n.forwardRef((function(e,t){var a=e.components,i=e.mdxType,o=e.originalType,l=e.parentName,h=s(e,["components","mdxType","originalType","parentName"]),u=c(a),m=i,d=u["".concat(l,".").concat(m)]||u[m]||p[m]||o;return a?n.createElement(d,r(r({ref:t},h),{},{components:a})):n.createElement(d,r({ref:t},h))}));function m(e,t){var a=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var o=a.length,r=new Array(o);r[0]=u;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s.mdxType="string"==typeof e?e:i,r[1]=s;for(var c=2;c<o;c++)r[c]=a[c];return n.createElement.apply(null,r)}return n.createElement.apply(null,a)}u.displayName="MDXCreateElement"},765:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>l,contentTitle:()=>r,default:()=>p,frontMatter:()=>o,metadata:()=>s,toc:()=>c});var n=a(7462),i=(a(7294),a(3905));const o={title:"What is a Pre-image Oracle and why is it awesome?",slug:"preimge-oracle",authors:"willem",tags:["bridges","provable computation","fraud-proofs"]},r=void 0,s={permalink:"/blog/preimge-oracle",source:"@site/blog/2022-10-10-preimage-oracle.md",title:"What is a Pre-image Oracle and why is it awesome?",description:"A pre-image oracle is a way to lookup any piece of data (pre-image) by its hash. While this sounds impossible (and in the general case is) it is possible to write code assuming such a thing exists if it operates in a context where execution cannot continue unless the pre-image is provided by an external party.",date:"2022-10-10T00:00:00.000Z",formattedDate:"October 10, 2022",tags:[{label:"bridges",permalink:"/blog/tags/bridges"},{label:"provable computation",permalink:"/blog/tags/provable-computation"},{label:"fraud-proofs",permalink:"/blog/tags/fraud-proofs"}],readingTime:3.075,hasTruncateMarker:!0,authors:[{name:"Willem Olding",title:"Computer Systems Engineer, PhD",url:"https://github.com/willemolding",imageURL:"https://github.com/willemolding.png",key:"willem"}],frontMatter:{title:"What is a Pre-image Oracle and why is it awesome?",slug:"preimge-oracle",authors:"willem",tags:["bridges","provable computation","fraud-proofs"]},prevItem:{title:"On the feasibility of a Fault-proof Based Blockchain Bridge",permalink:"/blog/feasibility-fault-proof-bridges"},nextItem:{title:"Right now there is no such thing as web3\xa0gaming (Opinion)",permalink:"/blog/issues-with-gaming"}},l={authorsImageUrls:[void 0]},c=[{value:"Cannon Overview",id:"cannon-overview",level:2},{value:"What about external data?",id:"what-about-external-data",level:2}],h={toc:c};function p(e){let{components:t,...a}=e;return(0,i.kt)("wrapper",(0,n.Z)({},h,a,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"A pre-image oracle is a way to lookup any piece of data (pre-image) by its hash. While this sounds impossible (and in the general case is) it is possible to write code assuming such a thing exists if it operates in a context where execution cannot continue unless the pre-image is provided by an external party."),(0,i.kt)("h2",{id:"cannon-overview"},"Cannon Overview"),(0,i.kt)("p",null,"At a high level Optimism Cannon works by compiling some computation to the MIPS instruction set (the instruction set itself isn't important, this was just the one they picked). This computation takes some input and produces some output."),(0,i.kt)("p",null,"A full proof of a computation could be considered as the ",(0,i.kt)("em",{parentName:"p"},"trace")," of the execution of this code. That is the snapshot of the memory + registers (state) after the execution of each opcode from some initial state."),(0,i.kt)("p",null,"Proving fraud in a computation can be reduced to finding two adjacent states in the trace where both parties agree on the former state but disagree on the latter. The transition between these states can be verified by executing a single MIPS opcode to verify who is correct. This is small enough for a blockchain to execute and act as the final arbitrator."),(0,i.kt)("p",null,"Since the state may be large we don't want to submit the whole thing on-chain. Each snapshot can be turned into a Merkle tree and only the root hash posted on-chain. Since they are merklized it is enough just to submit the roots and additionally provide proofs for:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"The opcode."),(0,i.kt)("li",{parentName:"ul"},"Any memory or registers the opcode reads from.")),(0,i.kt)("p",null,"These can be posted on-chain by either party and one of them is always incentivised to do so (the correct one)."),(0,i.kt)("h2",{id:"what-about-external-data"},"What about external data?"),(0,i.kt)("p",null,"This is where the magic of the pre-image oracle comes in. Conceptually a pre-image oracle is a magic device that can return a piece of data given its hash. You can think of this as similar to how an IPFS PID is uniquely generated from data and can be used to retrieve the data from the network. ",(0,i.kt)("strong",{parentName:"p"},"Importantly, you can always check if the oracle is lying by hashing the provided data and ensuring it matches the hash you requested.")),(0,i.kt)("p",null,"In Cannon the proving code can pretend that such an oracle exists. It works as follows:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"The code places the hash of the data it wishes to access in a special memory slot"),(0,i.kt)("li",{parentName:"ul"},"The host environment will then magically, and instantly, place the pre-image of this hash in another designated memory range")),(0,i.kt)("p",null,"From the code's perspective it has the ability to retrieve any data in existance given its hash. How is this possible!? "),(0,i.kt)("p",null,"This can be seen in the ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/ethereum-optimism/cannon/blob/dfac3fb2e09bb974e77e6563a64d898d049a2a90/contracts/MIPSMemory.sol#L201"},"code for reading the MIPS memory"),". It checks if the program is reading from the pre-defined pre-image oracle range ",(0,i.kt)("inlineCode",{parentName:"p"},"[0x31000000, 0x32000000]")," and if so it checks that the hash of the data matches the hash in the hash stored in the special location (",(0,i.kt)("inlineCode",{parentName:"p"},"0x30001000"),")."),(0,i.kt)("p",null,"It works because the host environment will simply not continue to execute if the pre-image is not provided by some actor off-chain. Since the case where the pre-image is not provided can never exist, the code can live in the happy reality where it always does."),(0,i.kt)("p",null,"This has an important implication:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("strong",{parentName:"li"},"If an execution requests the pre-image of a hash where the pre-image is not available then a fraud proof can never be completed.")," Special care must be taken to ensure this cannot happen by ensuring the data is available in the history of the host chain (including calldata). ")),(0,i.kt)("p",null,"But also an amazing upside:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("strong",{parentName:"li"},"Verifyable computation code can access any data in the host chain history or state including anything submitted in calldata!"))))}p.isMDXComponent=!0}}]);