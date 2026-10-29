const toggle=document.querySelector('.menu-toggle');
toggle?.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));document.querySelector('header').classList.toggle('menu-open',open);toggle.querySelector('span').textContent=open?'−':'＋';});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&toggle?.getAttribute('aria-expanded')==='true'){toggle.click();toggle.focus();}});
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
if('IntersectionObserver' in window&&!reduced.matches){
 const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target);}}),{threshold:.08});
 document.querySelectorAll('.reveal').forEach(el=>{el.classList.add('will-reveal');observer.observe(el);});
 const chapters=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){document.querySelector('.chapter-label').textContent=e.target.dataset.chapter;const step=Array.from(e.target.parentNode.children).indexOf(e.target);const visual=document.querySelector('.story-visual');if(visual){visual.style.setProperty('--chapter',step);visual.querySelector('.visual-word').textContent=['ascolto','consapevolezza','percorso'][step];}document.querySelectorAll('[data-chapter]').forEach(el=>el.classList.toggle('current-chapter',el===e.target));}}),{rootMargin:'-30% 0px -30% 0px'});
 document.querySelectorAll('[data-chapter]').forEach(el=>chapters.observe(el));
}
let ticking=false;window.addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(()=>{document.querySelector('header').classList.toggle('compact',scrollY>40);if(!reduced.matches&&innerWidth>900){const art=document.querySelector('.hero .sculpture');if(art)art.style.setProperty('--scroll',`${Math.min(scrollY*.09,65)}px`);}ticking=false;});ticking=true;}},{passive:true});

// Native dialog keeps the telephone actions explicit and restores focus on close.
const appointment=document.querySelector('#appointment-dialog');
if(appointment&&typeof appointment.showModal==='function'){
 document.querySelectorAll('[data-appointment], .nav-cta').forEach(a=>a.addEventListener('click',e=>{if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;e.preventDefault();appointment.showModal();}));
 appointment.querySelector('.close-dialog').addEventListener('click',()=>appointment.close());
 appointment.addEventListener('click',e=>{if(e.target===appointment){const r=appointment.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)appointment.close();}});
}
// Accessible interest tabs, with keyboard navigation and meaningful content.
const interests=[...document.querySelectorAll('.interest-tabs [role="tab"]')];
function selectInterest(tab,focus=false){interests.forEach(t=>{const active=t===tab;t.setAttribute('aria-selected',String(active));t.tabIndex=active?0:-1;document.getElementById(t.getAttribute('aria-controls')).hidden=!active;});if(focus)tab.focus();}
interests.forEach((tab,i)=>{tab.addEventListener('click',()=>selectInterest(tab));tab.addEventListener('keydown',e=>{let index=i;if(['ArrowDown','ArrowRight'].includes(e.key))index=(i+1)%interests.length;else if(['ArrowUp','ArrowLeft'].includes(e.key))index=(i-1+interests.length)%interests.length;else if(e.key==='Home')index=0;else if(e.key==='End')index=interests.length-1;else return;e.preventDefault();selectInterest(interests[index],true);});});
const cards=[...document.querySelectorAll('[data-category]')], search=document.querySelector('#treatment-search');let category='tutti';
const normalize=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
function filterTreatments(){const query=normalize(search.value.trim());let count=0;cards.forEach(card=>{const show=(category==='tutti'||card.dataset.category===category)&&normalize(card.textContent).includes(query);card.hidden=!show;if(show)count++;});document.querySelector('#filter-count').textContent=`${count} ${count===1?'argomento da esplorare':'argomenti da esplorare'}`;document.querySelector('.empty-results').hidden=count>0;}
if(search){search.addEventListener('input',filterTreatments);document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{category=button.dataset.filter;document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));filterTreatments();}));}
const checks=[...document.querySelectorAll('.visit-checklist input')];checks.forEach(c=>c.addEventListener('change',()=>{const count=checks.filter(c=>c.checked).length;document.querySelector('#checklist-status').textContent=`${count} di 4 punti preparati${count===4?' · Sei pronto per il primo contatto.':''}`;}));
document.querySelector('.print-guide')?.addEventListener('click',()=>window.print());
let motionFrame=false;function updateScroll(){const max=document.documentElement.scrollHeight-innerHeight;document.querySelector('.reading-progress').style.transform=`scaleX(${max>0?scrollY/max:0})`;if(!reduced.matches){document.documentElement.style.setProperty('--page-scroll',`${Math.min(scrollY*.12,90)}px`);}motionFrame=false;}
window.addEventListener('scroll',()=>{if(!motionFrame){motionFrame=true;requestAnimationFrame(updateScroll);}},{passive:true});updateScroll();
document.querySelector('#motion-control')?.addEventListener('click',e=>{const paused=document.body.classList.toggle('motion-paused');e.currentTarget.setAttribute('aria-pressed',String(paused));e.currentTarget.setAttribute('aria-label',paused?'Riprendi animazioni':'Pausa animazioni');e.currentTarget.querySelector('span').textContent=paused?'▶':'❚❚';});

// Rotate each chapter's graphic according to its own position, never hijacking scroll.
const chapterScenes=[...document.querySelectorAll('.chapter-hero')];let sceneFrame=false;
function updateScenes(){if(!reduced.matches&&!document.body.classList.contains('motion-paused')){chapterScenes.forEach(scene=>{const r=scene.getBoundingClientRect();if(r.bottom>0&&r.top<innerHeight){const progress=Math.min(1,Math.max(0,(innerHeight-r.top)/(innerHeight+r.height)));scene.style.setProperty('--scene-progress',progress.toFixed(3));}});}sceneFrame=false;}
if(chapterScenes.length){window.addEventListener('scroll',()=>{if(!sceneFrame){sceneFrame=true;requestAnimationFrame(updateScenes);}},{passive:true});updateScenes();}

// Video is local, silent and optional. Reduced-motion and data-saving users see the poster.
const heroVideo=document.querySelector('#hero-video'),videoToggle=document.querySelector('#video-toggle');let videoUserPaused=false;
if(heroVideo){
 const updateVideoButton=()=>{videoToggle.setAttribute('aria-label',heroVideo.paused?'Riproduci video':'Pausa video');videoToggle.querySelector('span').textContent=heroVideo.paused?'▶':'❚❚';videoToggle.setAttribute('aria-pressed',String(!heroVideo.paused));};
 const loadVideo=()=>{if(!heroVideo.getAttribute('src')){heroVideo.src=heroVideo.dataset.src;heroVideo.load();}heroVideo.muted=true;};
 const startVideo=()=>{loadVideo();heroVideo.play().catch(()=>updateVideoButton());};
 heroVideo.addEventListener('play',updateVideoButton);heroVideo.addEventListener('pause',updateVideoButton);heroVideo.addEventListener('error',()=>{videoToggle.setAttribute('aria-label','Video non disponibile');videoToggle.querySelector('span').textContent='—';videoToggle.disabled=true;});
 videoToggle.addEventListener('click',()=>{if(heroVideo.paused){videoUserPaused=false;startVideo();}else{videoUserPaused=true;heroVideo.pause();}});
 if(!reduced.matches&&!navigator.connection?.saveData)startVideo();
 reduced.addEventListener('change',e=>{if(e.matches){heroVideo.pause();}});
 document.querySelector('#motion-control')?.addEventListener('click',()=>{if(document.body.classList.contains('motion-paused'))heroVideo.pause();else if(!reduced.matches&&!videoUserPaused)startVideo();});
 if('IntersectionObserver' in window){new IntersectionObserver(entries=>entries.forEach(e=>{if(!e.isIntersecting)heroVideo.pause();else if(!reduced.matches&&!navigator.connection?.saveData&&!videoUserPaused&&!document.body.classList.contains('motion-paused'))startVideo();}),{threshold:.1}).observe(document.querySelector('.cinema-hero'));}
}
const parallaxElements=[...document.querySelectorAll('[data-parallax]')];let parallaxFrame=false;
function updateParallax(){if(!reduced.matches&&!document.body.classList.contains('motion-paused')&&innerWidth>700){parallaxElements.forEach(el=>{const parent=el.parentElement.getBoundingClientRect();if(parent.bottom>0&&parent.top<innerHeight){const amount=Math.max(-65,Math.min(65,-parent.top*Number(el.dataset.parallax)));el.style.transform=`translate3d(0,${amount.toFixed(2)}px,0)`;}});}parallaxFrame=false;}
window.addEventListener('scroll',()=>{if(!parallaxFrame){parallaxFrame=true;requestAnimationFrame(updateParallax);}},{passive:true});updateParallax();
