(function(){
  const C='vezemo_cookie_consent', U='vezemo_utm_data';
  const S={runtime:null,pixelLoaded:false,pageView:false,form:false,quote:false,leadId:null};
  const consent=()=>{try{return JSON.parse(localStorage.getItem(C)||'null')}catch{return null}};
  const cookie=n=>{const m=document.cookie.match(new RegExp('(?:^|; )'+n.replace(/[$()*+.?[\\\]^{|}]/g,'\\$&')+'=([^;]*)'));return m?decodeURIComponent(m[1]):''};
  const setCookie=(n,v,d=90)=>document.cookie=`${n}=${encodeURIComponent(v)}; path=/; SameSite=Lax; max-age=${d*86400}${location.protocol==='https:'?'; Secure':''}`;
  const utm=()=>{try{return JSON.parse(localStorage.getItem(U)||'{}')}catch{return{}}};
  const saveUtm=()=>{const q=new URL(location.href).searchParams,d=utm();['utm_source','utm_medium','utm_campaign','utm_content','utm_term','fbclid'].forEach(k=>{const v=q.get(k);if(v)d[k]=v});if(d.fbclid&&!cookie('_fbc'))setCookie('_fbc',`fb.1.${Date.now()}.${d.fbclid}`);localStorage.setItem(U,JSON.stringify(d))};
  const runtime=async()=>{if(S.runtime)return S.runtime;try{const r=await fetch('/api/runtime');if(r.ok)S.runtime=await r.json()}catch{}return S.runtime||{metaPixelId:'',trackingEnabled:false}};
  const loadPixel=async()=>{const c=consent(),r=await runtime();if(!c?.marketing||!r.metaPixelId||S.pixelLoaded)return;window.fbq=window.fbq||function(){(window.fbq.q=window.fbq.q||[]).push(arguments)};window.fbq.loaded=false;window.fbq.version='2.0';const s=document.createElement('script');s.async=true;s.src='https://connect.facebook.net/en_US/fbevents.js';s.onload=()=>{fbq('init',r.metaPixelId);fbq('consent','grant');S.pixelLoaded=true;if(!S.pageView){fbq('track','PageView');S.pageView=true}};document.head.appendChild(s)};
  const custom=(n,p)=>{if(S.pixelLoaded&&window.fbq)fbq('trackCustom',n,p||{})};
  const lead=(id)=>{if(S.pixelLoaded&&window.fbq)fbq('track','Lead',{},id?{eventID:id}:{})};
  const banner=()=>{if(consent()){loadPixel();return}const b=document.createElement('div');b.id='vezemo-consent';b.innerHTML='<div><strong>Налаштування сайту</strong><span>Ми використовуємо необхідні технології для стабільної роботи сайту. За вашою згодою додаткові дані допомагають нам покращувати сервіс і оцінювати ефективність наших оголошень.</span><section><button data-c="0">Лише необхідні</button><button data-c="1">Дозволити</button></section></div>';const st=document.createElement('style');st.textContent='#vezemo-consent{position:fixed;z-index:9999;left:16px;right:16px;bottom:16px;background:rgba(15,23,42,.96);color:white;border-radius:18px;box-shadow:0 20px 60px #0003}#vezemo-consent>div{max-width:1100px;margin:auto;padding:15px 18px;display:flex;gap:15px;align-items:center}#vezemo-consent strong{font-size:16px}#vezemo-consent span{font-size:13px;flex:1;opacity:.85}#vezemo-consent section{display:flex;gap:8px}#vezemo-consent button{border:0;border-radius:999px;padding:10px 14px;font-weight:600}#vezemo-consent button[data-c="1"]{background:#2563eb;color:white}@media(max-width:700px){#vezemo-consent>div{flex-direction:column;align-items:stretch}#vezemo-consent section button{flex:1}}';document.head.appendChild(st);document.body.appendChild(b);b.onclick=e=>{const x=e.target.closest('button[data-c]');if(!x)return;localStorage.setItem(C,JSON.stringify({essential:true,marketing:x.dataset.c==='1',updatedAt:new Date().toISOString()}));b.remove();loadPixel()}};
  saveUtm();
  const original=window.fetch.bind(window);window.fetch=async function(input,init){const url=typeof input==='string'?input:(input&&input.url)||'';let next=init;if(url.includes('/api/orders')&&init?.body instanceof FormData){const f=new FormData();init.body.forEach((v,k)=>f.append(k,v));Object.entries(utm()).forEach(([k,v])=>{if(v&&!f.has(k))f.append(k,v)});const fbp=cookie('_fbp'),fbc=cookie('_fbc');if(fbp)f.append('_fbp',fbp);if(fbc)f.append('_fbc',fbc);S.leadId=`lead_${Date.now()}_${Math.random().toString(36).slice(2,9)}`;f.append('metaEventId',S.leadId);next={...init,body:f}}const r=await original(input,next);if(url.includes('/api/quote')&&r.ok&&!S.quote){S.quote=true;custom('QuoteCalculated')}if(url.includes('/api/orders')&&r.ok)lead(S.leadId);return r};
  document.addEventListener('DOMContentLoaded',()=>{document.addEventListener('focusin',e=>{if(!S.form&&e.target?.matches?.('input,textarea,select')){S.form=true;custom('FormStart')}},true);document.addEventListener('click',e=>{const a=e.target.closest?.('a');if(!a)return;const h=a.getAttribute('href')||'';if(h.startsWith('tel:'))custom('PhoneClick');if(/wa\.me|whatsapp|viber|telegram/i.test(h))custom('ContactClick')},true);banner();loadPixel()});
})();

// Submission UX guard: surface validation and server errors next to the submit button.
(function () {
  function getSubmitButton() {
    return document.querySelector('form button[type="submit"]');
  }
  function ensureHelper() {
    const button = getSubmitButton();
    if (!button) return null;
    let helper = document.getElementById('vezemo-submit-helper');
    if (!helper) {
      helper = document.createElement('div');
      helper.id = 'vezemo-submit-helper';
      helper.setAttribute('role', 'status');
      helper.setAttribute('aria-live', 'polite');
      helper.style.cssText = 'display:none;margin-top:10px;padding:11px 13px;border-radius:14px;background:#fff5f5;border:1px solid #fecaca;color:#991b1b;font-size:13px;line-height:1.4;font-weight:600;';
      button.insertAdjacentElement('afterend', helper);
    }
    return helper;
  }
  function showHelper(message) {
    const helper = ensureHelper();
    if (!helper || !message) return;
    helper.textContent = message;
    helper.style.display = 'block';
  }
  function clearHelper() {
    const helper = document.getElementById('vezemo-submit-helper');
    if (helper) helper.style.display = 'none';
  }
  function labelFor(field) {
    const id = field && field.id;
    const label = id ? document.querySelector(`label[for="${CSS.escape(id)}"]`) : null;
    return label?.textContent?.trim() || 'обов’язкове поле';
  }

  document.addEventListener('invalid', function (event) {
    const form = event.target?.closest?.('form');
    if (!form) return;
    showHelper(`Заповніть поле «${labelFor(event.target)}».`);
    setTimeout(() => event.target.scrollIntoView({ behavior: 'smooth', block: 'center' }), 0);
  }, true);

  document.addEventListener('input', clearHelper, true);
  document.addEventListener('change', clearHelper, true);

  document.addEventListener('click', function (event) {
    const button = event.target?.closest?.('form button[type="submit"]');
    if (!button) return;
    clearHelper();
    const form = button.closest('form');
    const invalid = form?.querySelector(':invalid');
    if (invalid) {
      showHelper(`Заповніть поле «${labelFor(invalid)}».`);
      setTimeout(() => invalid.scrollIntoView({ behavior: 'smooth', block: 'center' }), 0);
      return;
    }
    setTimeout(() => {
      const error = document.querySelector('.form-card .alert.error');
      const routeError = document.querySelector('.route-summary-card .field-error');
      const priceMissing = document.querySelector('.form-card .price-placeholder');
      if (error?.textContent?.trim()) {
        showHelper(error.textContent.trim());
      } else if (routeError?.textContent?.trim()) {
        showHelper(routeError.textContent.trim());
      } else if (priceMissing) {
        showHelper('Перевірте адреси та виберіть хоча б один вид вантажу. Якщо маршрут ще рахується, зачекайте кілька секунд і натисніть ще раз.');
      }
    }, 250);
  }, true);

  const observer = new MutationObserver(() => {
    const error = document.querySelector('.form-card .alert.error');
    if (error?.textContent?.trim()) showHelper(error.textContent.trim());
  });
  document.addEventListener('DOMContentLoaded', () => {
    const formCard = document.querySelector('.form-card');
    if (formCard) observer.observe(formCard, { childList: true, subtree: true, characterData: true });
  });
})();
