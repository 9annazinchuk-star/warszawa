(()=>{const langs=['uk','pl','ru','en'];const path=location.pathname;const lang=path.startsWith('/pl')?'pl':path.startsWith('/ru')?'ru':path.startsWith('/en')?'en':'uk';const labels={uk:['Головна','Послуги','Варшава та околиці','Про нас','Ціни','Як це працює','FAQ','Контакти'],pl:['Główna','Usługi','Warszawa i okolice','O nas','Ceny','Jak to działa','FAQ','Kontakt'],ru:['Главная','Услуги','Варшава и окрестности','О нас','Цены','Как это работает','FAQ','Контакты'],en:['Home','Services','Warsaw and surroundings','About us','Prices','How it works','FAQ','Contact']}[lang];const slugs={uk:['/','/poslugy','/warszawa-ta-okolytsi','/pro-nas','/ciny','/yak-ce-pracyuye','/faq','/kontakty'],pl:['/pl/','/pl/uslugi','/pl/warszawa-i-okolice','/pl/o-nas','/pl/ceny','/pl/jak-to-dziala','/pl/faq','/pl/kontakt'],ru:['/ru/','/ru/uslugi','/ru/varshava-i-okrestnosti','/ru/o-nas','/ru/ceny','/ru/kak-eto-rabotaet','/ru/faq','/ru/kontakty'],en:['/en/','/en/services','/en/warsaw-and-surroundings','/en/about-us','/en/prices','/en/how-it-works','/en/faq','/en/contact']}[lang];
function drawer(){if(document.querySelector('.vz-drawer'))return;const b=document.createElement('div');b.className='vz-drawer-backdrop';const d=document.createElement('aside');d.className='vz-drawer';d.setAttribute('aria-hidden','true');d.innerHTML=`<div class="vz-drawer-head"><a href="${slugs[0]}"><img class="vz-drawer-logo" src="/vezemo-logo.png" alt="Vezemo"></a><button class="vz-close" aria-label="Close">×</button></div><nav class="vz-links">${labels.map((x,i)=>`<a href="${slugs[i]}">${x}</a>`).join('')}</nav><div class="vz-lang">${langs.map(l=>`<a class="${l===lang?'active':''}" href="${l==='uk'?'/':'/'+l+'/'}">${l==='uk'?'UA':l.toUpperCase()}</a>`).join('')}</div><a class="vz-phone" href="tel:+48500600700">+48 500 600 700</a>`;document.body.append(b,d);const close=()=>{d.classList.remove('open');b.classList.remove('open');d.setAttribute('aria-hidden','true');document.documentElement.style.overflow=''};window.vzOpen=()=>{d.classList.add('open');b.classList.add('open');d.setAttribute('aria-hidden','false');document.documentElement.style.overflow='hidden'};d.querySelector('.vz-close').onclick=close;b.onclick=close;d.querySelectorAll('a').forEach(a=>a.addEventListener('click',close));addEventListener('keydown',e=>{if(e.key==='Escape')close()})}
function equivalentPath(targetLang){
  const groups=[
    {uk:'/',pl:'/pl/',ru:'/ru/',en:'/en/'},
    {uk:'/poslugy',pl:'/pl/uslugi',ru:'/ru/uslugi',en:'/en/services'},
    {uk:'/warszawa-ta-okolytsi',pl:'/pl/warszawa-i-okolice',ru:'/ru/varshava-i-okrestnosti',en:'/en/warsaw-and-surroundings'},
    {uk:'/pro-nas',pl:'/pl/o-nas',ru:'/ru/o-nas',en:'/en/about-us'},
    {uk:'/ciny',pl:'/pl/ceny',ru:'/ru/ceny',en:'/en/prices'},
    {uk:'/yak-ce-pracyuye',pl:'/pl/jak-to-dziala',ru:'/ru/kak-eto-rabotaet',en:'/en/how-it-works'},
    {uk:'/faq',pl:'/pl/faq',ru:'/ru/faq',en:'/en/faq'},
    {uk:'/kontakty',pl:'/pl/kontakt',ru:'/ru/kontakty',en:'/en/contact'}
  ];
  const clean=location.pathname.length>1?location.pathname.replace(/\/$/,''):location.pathname;
  const group=groups.find(g=>Object.values(g).some(v=>(v.length>1?v.replace(/\/$/,''):v)===clean));
  return group?group[targetLang]:(targetLang==='uk'?'/':'/'+targetLang+'/');
}
function addButton(){
  drawer();
  const topbar=document.querySelector('header.topbar')||document.querySelector('.topbar');
  if(!topbar)return false;
  if(topbar.querySelector('.vz-header-tools'))return true;

  const tools=document.createElement('div');
  tools.className='vz-header-tools';

  const langWrap=document.createElement('label');
  langWrap.className='vz-header-lang';
  langWrap.setAttribute('aria-label','Мова сайту');
  const select=document.createElement('select');
  select.className='vz-lang-select';
  select.setAttribute('aria-label','Мова сайту');
  [['uk','UA'],['pl','PL'],['ru','RU'],['en','EN']].forEach(([value,label])=>{
    const o=document.createElement('option');o.value=value;o.textContent=label;o.selected=value===lang;select.appendChild(o)
  });
  select.addEventListener('change',()=>{location.href=equivalentPath(select.value)});
  langWrap.appendChild(select);

  const btn=document.createElement('button');
  btn.type='button';
  btn.className='vz-menu-btn';
  btn.setAttribute('aria-label',lang==='pl'?'Menu':lang==='ru'?'Меню':lang==='en'?'Menu':'Меню');
  btn.setAttribute('aria-haspopup','dialog');
  btn.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>';
  btn.onclick=()=>window.vzOpen();

  tools.append(langWrap,btn);
  topbar.appendChild(tools);
  return true;
}
function ensureHeaderControls(){
  if(addButton())return;
  const root=document.getElementById('root')||document.body;
  const observer=new MutationObserver(()=>{if(addButton())observer.disconnect()});
  observer.observe(root,{childList:true,subtree:true});
  setTimeout(()=>observer.disconnect(),10000);
}
const translations={pl:{'Швидка заявка':'Szybkie zgłoszenie','Ваше ім’я':'Twoje imię','Номер телефону':'Numer telefonu','Як з вами зв’язатися?':'Jak się z Tobą skontaktować?','Адреса завантаження':'Adres odbioru','Адреса доставки':'Adres dostawy','Що перевозимо?':'Co przewozimy?','Дата перевезення':'Data przeprowadzki','Бажаний час':'Preferowana godzina','Коментар':'Komentarz','Додати фото':'Dodaj zdjęcia','Надіслати заявку':'Wyślij zgłoszenie','Не потрібні':'Niepotrzebni','Потрібні 2 вантажники':'Potrzebnych 2 tragarzy'},ru:{'Швидка заявка':'Быстрая заявка','Ваше ім’я':'Ваше имя','Номер телефону':'Номер телефона','Як з вами зв’язатися?':'Как с вами связаться?','Адреса завантаження':'Адрес загрузки','Адреса доставки':'Адрес доставки','Що перевозимо?':'Что перевозим?','Дата перевезення':'Дата переезда','Бажаний час':'Желаемое время','Коментар':'Комментарий','Додати фото':'Добавить фото','Надіслати заявку':'Отправить заявку','Не потрібні':'Не нужны','Потрібні 2 вантажники':'Нужны 2 грузчика'},en:{'Швидка заявка':'Quick request','Ваше ім’я':'Your name','Номер телефону':'Phone number','Як з вами зв’язатися?':'How should we contact you?','Адреса завантаження':'Pickup address','Адреса доставки':'Delivery address','Що перевозимо?':'What are you moving?','Дата перевезення':'Moving date','Бажаний час':'Preferred time','Коментар':'Comment','Додати фото':'Add photos','Надіслати заявку':'Send request','Не потрібні':'Not needed','Потрібні 2 вантажники':'2 movers needed'}};
function translate(){const dict=translations[lang];if(!dict)return;const walk=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;while(n=walk.nextNode()){if(n.parentElement?.closest('.vz-drawer'))continue;let t=n.nodeValue;for(const [a,b] of Object.entries(dict))if(t.includes(a))t=t.replaceAll(a,b);n.nodeValue=t}document.documentElement.lang=lang==='uk'?'uk':lang}
addEventListener('DOMContentLoaded',()=>{ensureHeaderControls();translate();if(lang!=='uk'){new MutationObserver(()=>translate()).observe(document.getElementById('root')||document.body,{childList:true,subtree:true})}});setTimeout(ensureHeaderControls,700)})();
