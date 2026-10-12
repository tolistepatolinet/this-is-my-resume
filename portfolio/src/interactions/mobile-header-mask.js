// Keep one mask resource alive. All geometry is read before SVG attributes are
// written; scrolling never replaces a PNG URL or resizes the mask's coordinate space.
export function createMobileHeaderMask({ layer, base, images, blocks, textNodes, geometry, main }) {
  const ns = 'http://www.w3.org/2000/svg';
  const boundaryTolerance = 1.5;
  const make = name => document.createElementNS(ns, name);
  const svg = make('svg');
  svg.setAttribute('aria-hidden', 'true');
  svg.style.cssText = 'position:absolute;width:0;height:0;pointer-events:none';
  const defs = make('defs');
  const mask = make('mask');
  mask.id = 'mobile-header-foreground-mask';
  mask.setAttribute('maskUnits', 'userSpaceOnUse');
  mask.setAttribute('maskContentUnits', 'userSpaceOnUse');
  mask.setAttribute('x', '0'); mask.setAttribute('y', '0');
  mask.setAttribute('width', '100%'); mask.setAttribute('height', '100%');
  mask.style.maskType = 'alpha';
  defs.append(mask); svg.append(defs); document.body.append(svg);
  layer.style.maskImage = 'url(#mobile-header-foreground-mask)';
  const entries = new Map();
  const range = document.createRange();
  const matrixValue = m => `matrix(${m.a} ${m.b} ${m.c} ${m.d} ${m.e} ${m.f})`;
  const overlaps = (r, h) => r.right + boundaryTolerance > h.left && r.left - boundaryTolerance < h.right && r.bottom + boundaryTolerance > h.top && r.top - boundaryTolerance < h.bottom;
  function clips(element) {
    const result = [];
    for (let parent = element.parentElement; parent && parent !== main.parentElement; parent = parent.parentElement) {
      const css = getComputedStyle(parent);
      if (['hidden','clip','scroll','auto'].includes(css.overflowX) || ['hidden','clip','scroll','auto'].includes(css.overflowY)) {
        result.push({ ...geometry(parent), radius: parseFloat(css.borderTopLeftRadius) || 0 });
      }
    }
    return result;
  }
  function read() {
    // Stable bounds include the entire menu even when closed. Visibility remains
    // governed by the synchronized header animation, not mask resource changes.
    const icon = base.getBoundingClientRect();
    const menu = base.querySelector('nav').getBoundingClientRect();
    const header = { left: Math.min(icon.left,menu.left), right: Math.max(icon.right,menu.right), top: Math.min(icon.top,menu.top), bottom: Math.max(icon.bottom,menu.bottom) };
    const plans = [];
    plans.viewport = { width: innerWidth, height: innerHeight };
    for (const image of images) {
      if (!image.complete || !image.naturalWidth || !overlaps(image.getBoundingClientRect(),header)) continue;
      const css = getComputedStyle(image);
      if (css.visibility !== 'visible' || css.display === 'none') continue;
      plans.push({ key: image, type: 'image', href: image.currentSrc || image.src, ...geometry(image), clips: clips(image), fit: css.objectFit, radius: parseFloat(css.borderTopLeftRadius) || 0 });
    }
    for (const block of blocks) {
      if (overlaps(block.getBoundingClientRect(),header)) plans.push({key:block,type:'rect',...geometry(block),clips:clips(block),radius:parseFloat(getComputedStyle(block).borderTopLeftRadius)||0});
    }
    for (const node of textNodes) {
      const element = node.parentElement;
      if (!element || !node.isConnected || !overlaps(element.getBoundingClientRect(),header)) continue;
      const css = getComputedStyle(element);
      if (css.visibility !== 'visible' || css.display === 'none') continue;
      range.selectNodeContents(node);
      if (!overlaps(range.getBoundingClientRect(),header)) continue;
      const g = geometry(element);
      if (Math.abs(g.matrix.b) > .0001 || Math.abs(g.matrix.c) > .0001) continue;
      const lines = [];
      for (let i=0;i<node.length;i++) {
        range.setStart(node,i);range.setEnd(node,i+1);
        const rect=range.getBoundingClientRect();
        if (!rect.height) continue;
        let line=lines.at(-1);
        if (!line || Math.abs(line.top-rect.top) > .5) {line={left:rect.left,top:rect.top,text:''};lines.push(line);}
        line.text+=node.textContent[i];
      }
      plans.push({key:node,type:'text',lines,clips:clips(element),font:css.fontFamily,size:css.fontSize,weight:css.fontWeight,spacing:css.letterSpacing});
    }
    return plans;
  }
  let serial=0;
  function create(plan) {
    const group=make('g');mask.append(group);
    return {group,content:make('g'),clipNodes:[],text:[]};
  }
  function write(plans) {
    mask.setAttribute('width', plans.viewport.width); mask.setAttribute('height', plans.viewport.height);
    const active=new Set(plans.map(plan=>plan.key));
    for (const [key,entry] of entries) {
      if (!active.has(key)) {entry.group.setAttribute('display','none');continue;}
    }
    for (const plan of plans) {
      let entry=entries.get(plan.key);
      if (!entry) {entry=create(plan);entries.set(plan.key,entry);}
      entry.group.removeAttribute('display');
      // Clip chain is stable per foreground object; only its measured matrices update.
      const ownClip=plan.type==='image'?[{width:plan.width,height:plan.height,matrix:plan.matrix,radius:plan.radius}]:[];
      const allClips=[...plan.clips,...ownClip];
      if(entry.clipNodes.length!==allClips.length){
        entry.clipNodes.forEach(c=>c.path.remove());entry.clipNodes=[];entry.group.replaceChildren();
        let parent=entry.group;
        for(const c of allClips){
          const path=make('clipPath'),rect=make('rect'),group=make('g');
          path.id=`mobile-header-clip-${++serial}`;path.setAttribute('clipPathUnits','userSpaceOnUse');path.append(rect);defs.append(path);
          group.setAttribute('clip-path',`url(#${path.id})`);parent.append(group);parent=group;entry.clipNodes.push({path,rect});
        }
        parent.append(entry.content);
      }else if(!entry.content.parentElement)entry.group.append(entry.content);
      allClips.forEach((c,i)=>{
        const rect=entry.clipNodes[i].rect;
        rect.setAttribute('x','-1');rect.setAttribute('y','-1');rect.setAttribute('width',c.width+2);rect.setAttribute('height',c.height+2);rect.setAttribute('rx',c.radius);rect.setAttribute('transform',matrixValue(c.matrix));
      });
      if(plan.type==='text'){
        while(entry.text.length<plan.lines.length){const text=make('text');text.setAttribute('fill','#fff');text.setAttribute('dominant-baseline','text-before-edge');entry.content.append(text);entry.text.push(text);}
        entry.text.forEach((text,i)=>{const line=plan.lines[i];text.setAttribute('display',line?'inline':'none');if(!line)return;
          if(text.textContent!==line.text)text.textContent=line.text;text.setAttribute('x',line.left);text.setAttribute('y',line.top);text.setAttribute('font-family',plan.font);text.setAttribute('font-size',plan.size);text.setAttribute('font-weight',plan.weight);text.setAttribute('letter-spacing',plan.spacing==='normal'?'0':plan.spacing);
        });
      }else{
        if(!entry.visual){entry.visual=make(plan.type);entry.content.append(entry.visual);}
        const visual=entry.visual;visual.setAttribute('transform',matrixValue(plan.matrix));visual.setAttribute('width',plan.width);visual.setAttribute('height',plan.height);
        if(plan.type==='image'){if(visual.getAttribute('href')!==plan.href)visual.setAttribute('href',plan.href);visual.setAttribute('preserveAspectRatio',plan.fit==='cover'?'xMidYMid slice':plan.fit==='contain'?'xMidYMid meet':'none');}
        else{visual.setAttribute('fill','#fff');visual.setAttribute('rx',plan.radius);}
      }
    }
  }
  return { update(){const plans=read();write(plans);}, destroy(){svg.remove();} };
}
