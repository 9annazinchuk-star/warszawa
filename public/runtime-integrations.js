(function(){
  if (window.__vezemoRuntimeIntegrationsLoaded) return;
  window.__vezemoRuntimeIntegrationsLoaded = true;

  const U='vezemo_utm_data';
  const S=window.__vezemoMetaState||(window.__vezemoMetaState={
    form:false,
    quote:false,
    leadId:null
  });

  const cookie=n=>{
    const m=document.cookie.match(new RegExp('(?:^|; )'+n.replace(/[$()*+.?[\\\]^{|}]/g,'\\$&')+'=([^;]*)'));
    return m?decodeURIComponent(m[1]):'';
  };
  const setCookie=(n,v,d=90)=>document.cookie=`${n}=${encodeURIComponent(v)}; path=/; SameSite=Lax; max-age=${d*86400}${location.protocol==='https:'?'; Secure':''}`;
  const utm=()=>{try{return JSON.parse(localStorage.getItem(U)||'{}')}catch{return{}}};

  const saveUtm=()=>{
    const q=new URL(location.href).searchParams,d=utm();
    ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','fbclid'].forEach(k=>{
      const v=q.get(k); if(v) d[k]=v;
    });
    if(d.fbclid&&!cookie('_fbc')) setCookie('_fbc',`fb.1.${Date.now()}.${d.fbclid}`);
    localStorage.setItem(U,JSON.stringify(d));
  };

  const metaReady=()=>typeof window.fbq==='function';

  const custom=(name,params)=>{
    if(metaReady()) window.fbq('trackCustom',name,params||{});
  };

  const lead=(eventId)=>{
    if(metaReady()) window.fbq('track','Lead',{},eventId?{eventID:eventId}:{});
  };

  saveUtm();

  const originalFetch=window.fetch.bind(window);
  window.fetch=async function(input,init){
    const url=typeof input==='string'?input:(input&&input.url)||'';
    let next=init;

    if(url.includes('/api/orders')&&init?.body instanceof FormData){
      const f=new FormData();
      init.body.forEach((v,k)=>f.append(k,v));
      Object.entries(utm()).forEach(([k,v])=>{if(v&&!f.has(k))f.append(k,v)});
      const fbp=cookie('_fbp'),fbc=cookie('_fbc');
      if(fbp)f.append('_fbp',fbp);
      if(fbc)f.append('_fbc',fbc);
      S.leadId=`lead_${Date.now()}_${Math.random().toString(36).slice(2,9)}`;
      f.append('metaEventId',S.leadId);
      next={...init,body:f};
    }

    const response=await originalFetch(input,next);

    if(url.includes('/api/quote')&&response.ok&&!S.quote){
      S.quote=true;
      custom('QuoteCalculated');
    }

    if(url.includes('/api/orders')&&response.ok){
      lead(S.leadId);
    }

    return response;
  };

  document.addEventListener('DOMContentLoaded',()=>{
    document.addEventListener('focusin',e=>{
      if(!S.form&&e.target?.matches?.('input,textarea,select')){
        S.form=true;
        custom('FormStart');
      }
    },true);

    document.addEventListener('click',e=>{
      const a=e.target.closest?.('a');
      if(!a)return;
      const h=a.getAttribute('href')||'';
      if(h.startsWith('tel:')) custom('PhoneClick');
      if(/wa\.me|whatsapp|viber|telegram/i.test(h)) custom('ContactClick');
    },true);

    // Diagnostic object for quick browser checks.
    setTimeout(()=>{
      window.__vezemoMetaStatus={
        ok: typeof window.fbq==='function',
        pixelId:'2201396533755976',
        scriptCount:document.querySelectorAll('script[src*="fbevents.js"]').length,
        source:'single-head-snippet'
      };
      console.info('[Vezemo Meta Pixel]',window.__vezemoMetaStatus);
    },1200);
  });
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
