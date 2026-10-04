'use strict';
const songs = window.HASH_SONGS;
const key = 'madrid-hhh-songbook-v1';
const validIds = new Set(songs.map(song => song.id));
let sung = new Set();
try { const saved = JSON.parse(localStorage.getItem(key) || '[]'); if (Array.isArray(saved)) sung = new Set(saved.filter(id => validIds.has(id))); } catch {}
let filter = 'remaining', openId = null, undoState = null, toastTimer, lyricSize = 20;
const $ = id => document.getElementById(id);
const normalize = text => text.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9\s]/g,' ').replace(/\s+/g,' ').trim();
const sorted = [...songs].sort((a,b) => a.title.localeCompare(b.title,'en'));
function save() { try { localStorage.setItem(key, JSON.stringify([...sung])); } catch {} }
function element(tag, className, text) { const el = document.createElement(tag); if(className) el.className = className; if(text !== undefined) el.textContent = text; return el; }
function showToast(message, previous) {
  undoState = previous; $('toast-message').textContent = message; $('toast').hidden = false;
  clearTimeout(toastTimer); toastTimer = setTimeout(() => { $('toast').hidden = true; undoState = null; },8000);
}
function toggleSung(song, focusTarget) {
  const previous = new Set(sung);
  if(sung.has(song.id)) sung.delete(song.id); else sung.add(song.id);
  save(); render(); showToast(sung.has(song.id) ? 'Marked as sung.' : 'Back in the circle.',previous);
  // When a filtered row disappears, keep keyboard focus in the song list.
  (document.getElementById(focusTarget) || document.querySelector('.toggle') || $('search')).focus({preventScroll:true});
}
function render() {
  const terms = normalize($('search').value).split(' ').filter(Boolean);
  const visible = sorted.filter(song => (filter === 'all' || (filter === 'sung') === sung.has(song.id)) && terms.every(term => normalize([song.title,song.firstLine || '',song.lyrics || ''].join(' ')).includes(term)));
  $('remaining-count').textContent = songs.length-sung.size; $('sung-count').textContent = sung.size;
  $('results').textContent = `${visible.length} ${visible.length === 1 ? 'song' : 'songs'}${terms.length ? ' found' : ' · tap to open'}`;
  $('reset').disabled = !sung.size;
  $('songs').replaceChildren();
  for(const song of visible) {
    const article = element('article','song' + (openId === song.id ? ' open' : ''));
    const heading = element('div','song-heading');
    const h2 = element('h2'); h2.style.cssText='margin:0;flex:1;min-width:0';
    const toggle = element('button','toggle'); toggle.id = `toggle-${song.id}`; toggle.setAttribute('aria-expanded',String(openId === song.id)); toggle.setAttribute('aria-controls',`lyrics-${song.id}`);
    const titles = element('span'); titles.append(element('span','song-title',song.title),element('span','first-line',song.firstLine || 'Opening line to be added'));
    const arrow = element('span','chevron',openId === song.id ? '−' : '+'); arrow.setAttribute('aria-hidden','true');
    toggle.append(titles,arrow);
    toggle.addEventListener('click',()=> {openId = openId === song.id ? null : song.id; render(); document.getElementById(toggle.id).focus({preventScroll:true});});
    h2.append(toggle);
    const label = element('label','sung-label'); const check = element('input'); check.type='checkbox'; check.id=`sung-${song.id}`; check.checked=sung.has(song.id); check.setAttribute('aria-label',`Mark ${song.title} as sung`);
    check.addEventListener('change',()=>toggleSung(song,check.id)); label.append(check,element('span','', 'Sung')); heading.append(h2,label);
    const panel = element('section','lyrics-panel'); panel.id=`lyrics-${song.id}`; panel.hidden = openId !== song.id; panel.setAttribute('aria-labelledby',toggle.id);
    if(song.lyrics) {
      const reader = element('div','reader-tools'); reader.append(element('small','', 'A little louder, a little larger.'));
      const size = element('button','',lyricSize === 20 ? 'A+' : 'A−'); size.setAttribute('aria-label',lyricSize === 20 ? 'Increase lyric text size' : 'Use standard lyric text size');
      size.addEventListener('click',()=>{lyricSize=lyricSize===20?26:20; document.documentElement.style.setProperty('--lyric-size',`${lyricSize}px`);render();document.getElementById(panel.id).querySelector('button').focus({preventScroll:true});});
      reader.append(size); panel.append(reader);
      if(song.note) panel.append(element('p','lyric-note',song.note));
      panel.append(element('p','lyrics',song.lyrics));
    } else {
      const missing = element('p','missing','Lyrics aren’t included in this preview yet. '); const source = element('a','', 'Read this song in the current hymnals ↗'); source.href='https://madridhhh.com/hash-hymnals/'; source.target='_blank';source.rel='noopener';missing.append(source);panel.append(missing);
    }
    const done = element('button','primary',sung.has(song.id)?'↶ Not sung yet':'✓ We’ve sung this'); done.addEventListener('click',()=>toggleSung(song,toggle.id)); panel.append(done); article.append(heading,panel); $('songs').append(article);
  }
  if(!visible.length) {
    const empty = element('div','empty'); empty.append(element('strong','',terms.length?'No matching songs.':filter==='sung'?'The circle is just getting started.':'You’ve sung the whole songbook!'),element('p','',terms.length?'Try another phrase, or check the All tab.':filter==='sung'?'Tick a song after you’ve sung it.':'Start a new circle to bring every song back.')); $('songs').append(empty);
  }
}
$('search').addEventListener('input', render);
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{filter=button.dataset.filter;document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));render();}));
$('undo').addEventListener('click',()=>{if(undoState){sung=new Set(undoState);save();render();} clearTimeout(toastTimer);$('toast').hidden=true;undoState=null;$('search').focus({preventScroll:true});});
$('reset').addEventListener('click',()=>$('reset-dialog').showModal());
$('confirm-reset').addEventListener('click',()=>{const previous=new Set(sung);sung.clear();save();$('reset-dialog').close();render();showToast('A fresh circle. On on!',previous);$('search').focus({preventScroll:true});});
document.querySelectorAll('dialog .close').forEach(button=>button.addEventListener('click',()=>button.closest('dialog').close()));
$('share').addEventListener('click',()=>{
  const url = new URL(location.href); url.hash=''; url.search='';
  $('share-url').value=url.href; $('copy-status').textContent='';
  $('local-note').hidden=!['localhost','127.0.0.1',''].includes(url.hostname);
  const qr = qrcode(0,'M'); qr.addData(url.href);qr.make();$('qr').innerHTML=qr.createSvgTag({cellSize:6,margin:24,scalable:true});
  $('qr').querySelector('svg').setAttribute('role','img');$('qr').querySelector('svg').setAttribute('aria-label','Scan to open this songbook');$('share-dialog').showModal();
});
$('copy').addEventListener('click',async()=>{try{await navigator.clipboard.writeText($('share-url').value);$('copy-status').textContent='Link copied.';}catch{$('share-url').select();$('copy-status').textContent='Select and copy the link above.';}});
render();
