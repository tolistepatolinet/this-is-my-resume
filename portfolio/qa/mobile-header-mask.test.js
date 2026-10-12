import test from 'node:test';
import assert from 'node:assert/strict';
import { createMobileHeaderMask } from '../src/interactions/mobile-header-mask.js';
test('Mobile contrast preserves one mask and image resource while scroll geometry updates', () => {
  class Element {
    constructor(name){this.name=name;this.attributes={};this.style={};this.children=[];}
    setAttribute(key,value){this.attributes[key]=String(value);}
    getAttribute(key){return this.attributes[key] ?? null;}
    removeAttribute(key){delete this.attributes[key];}
    append(...nodes){for(const node of nodes){node.parentElement=this;this.children.push(node);}}
    replaceChildren(){this.children=[];}
    remove(){}
  }
  const body=new Element('body');
  globalThis.document={body,createElementNS:(_,name)=>new Element(name),createRange:()=>({})};
  globalThis.innerWidth=390;globalThis.innerHeight=844;
  globalThis.getComputedStyle=()=>({visibility:'visible',display:'block',objectFit:'cover',borderTopLeftRadius:'0'});
  const layer=new Element('layer');
  const rect={left:300,right:360,top:8,bottom:60};
  const base={getBoundingClientRect:()=>rect,querySelector:()=>({getBoundingClientRect:()=>({...rect,bottom:280})})};
  const image={complete:true,naturalWidth:390,currentSrc:'/photo.webp',getBoundingClientRect:()=>({left:0,right:390,top:0,bottom:400})};
  let y=0;
  const geometry=()=>({width:390,height:400,matrix:{a:1,b:0,c:0,d:1,e:0,f:y}});
  const mask=createMobileHeaderMask({layer,base,images:[image],blocks:[],textNodes:[],geometry,main:{}});
  mask.update();
  const defs=body.children[0].children[0];
  const maskNode=defs.children[0];
  const imageNode=maskNode.children[0].children[0].children[0].children[0];
  assert.equal(imageNode.name,'image');
  const url=layer.style.maskImage;
  for(let i=0;i<30;i++){y=-i*.375;mask.update();}
  assert.equal(layer.style.maskImage,url);
  assert.equal(body.children.length,1);
  assert.equal(defs.children.length,2);
  assert.equal(maskNode.children[0].children[0].children[0].children[0],imageNode);
  assert.equal(imageNode.getAttribute('transform'),'matrix(1 0 0 1 0 -10.875)');
  assert.equal(imageNode.getAttribute('href'),'/photo.webp');
});
