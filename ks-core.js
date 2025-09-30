<script>
/* ========= KS Core (noyau commun) ========= */
window.KS = (() => {
  /* ---- Langue persistante + liens réécrits ---- */
  const getLang = () => {
    const url = new URL(location.href);
    const q = url.searchParams.get('lang');
    if (q){ localStorage.setItem('lang', q); return q; }
    return localStorage.getItem('lang') || 'fr';
  };
  const lang = getLang();

  const rewriteLinksWithLang = () => {
    document.querySelectorAll('a[href]').forEach(a=>{
      const href = a.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
      const u = new URL(href, location.origin);
      u.searchParams.set('lang', lang);
      a.setAttribute('href', u.toString());
    });
  };

  /* ---- Helpers stockage ---- */
  const read = (k, def) => {
    try{ return JSON.parse(localStorage.getItem(k)) ?? def; } catch(e){ return def; }
  };
  const write = (k, v) => localStorage.setItem(k, JSON.stringify(v));

  /* ---- Flags (emoji pays) ---- */
  const flag = code => {
    if(!code) return '🌍';
    const cc = code.toUpperCase();
    const A=0x1F1E6, base=65;
    return String.fromCodePoint(...[...cc].map(c=>A+c.charCodeAt(0)-base));
  };

  /* ---- Format nombre/devise ---- */
  const fmt = (n, cur='FCFA') => {
    if(cur==='FCFA') return `${Number(n).toLocaleString('fr-FR')} FCFA`;
    if(cur==='EUR')  return `${Number(n).toLocaleString('en-GB',{minimumFractionDigits:2,maximumFractionDigits:2})} €`;
    return String(n);
  };

  /* ---- Frais & Taux (mock dynamiques) ---- */
  const FEES = {
    MOBILE:{ fixed:200, percent:1.5 },
    IBAN  :{ fixed:300, percent:1.2 },
    P2P   :{ fixed:0,   percent:0   }
  };
  const RATES = read('ks_rates', { 'FCFA_EUR': 0.00152, 'EUR_FCFA': 655.0 });
  const refreshRates = () => {
    // petite variation random simulée
    RATES.FCFA_EUR = +(RATES.FCFA_EUR * (0.99 + Math.random()*0.02)).toFixed(5);
    RATES.EUR_FCFA = +(RATES.EUR_FCFA * (0.99 + Math.random()*0.02)).toFixed(2);
    write('ks_rates', RATES);
  };

  /* ---- Quote (simulation frais+taux+montant reçu) ----
     dir: 'AE' (Afrique->Europe) ou 'EA' (Europe->Afrique)
     channel: 'MOBILE' | 'IBAN' | 'P2P'
  */
  const quote = ({amount, dir, channel})=>{
    amount = Number(amount)||0;
    const f = FEES[channel]||{fixed:0,percent:0};
    const fee = +(f.fixed + amount*f.percent/100).toFixed(2);

    let sendCurrency, recvCurrency, rate, received;
    if(dir==='AE'){ // FCFA -> EUR
      sendCurrency='FCFA'; recvCurrency='EUR'; rate = RATES.FCFA_EUR;
      received = +((amount - fee)*rate).toFixed(2);
    }else{ // EA : EUR -> FCFA
      sendCurrency='EUR'; recvCurrency='FCFA'; rate = RATES.EUR_FCFA;
      received = +((amount - fee)*rate).toFixed(0);
    }

    const eta = channel==='P2P' ? 'Instantané'
              : channel==='MOBILE' ? '< 1h'
              : '< 24h';
    return { amount, fee, rate, sendCurrency, recvCurrency, received, eta };
  };

  /* ---- Seed (données démo) ---- */
  const seedIfNeeded = () => {
    if(read('ks_seed_done', false)) return;
    const wallet = { balanceCFA:20000, balanceEUR:30 };
    const tx = [
      {id:1,dateISO:'2025-01-26T10:12:00Z',type:'TopUp',amountCFA:10000,label:'Orange Money',status:'Completed',icon:'📥',ref:'OM-7821',channel:'MOBILE',countryFrom:'CI',countryTo:'CI',feesCFA:0,rate:null,note:''},
      {id:2,dateISO:'2025-01-25T18:31:00Z',type:'Withdraw',amountCFA:-16375,label:'Retrait IBAN (25€)',status:'Completed',icon:'🏦',ref:'IB-5299',channel:'IBAN',countryFrom:'CI',countryTo:'FR',feesCFA:375,rate:655,note:''},
      {id:3,dateISO:'2025-01-25T09:20:00Z',type:'P2P',amountCFA:-5000,label:'Transfert KwikSend',status:'Completed',icon:'👥',ref:'P2P-1032',channel:'P2P',countryFrom:'CI',countryTo:'CI',feesCFA:0,rate:null,note:''}
    ];
    write('ks_wallet', wallet);
    write('ks_tx', tx);
    write('ks_beneficiaries', [
      {name:'Awa Diop', alias:'awa', country:'SN', channel:'MOBILE', account:'771234567'},
      {name:'Lucas Martin', alias:'lucas', country:'FR', channel:'IBAN', account:'FR76 3000 4000 5000 6000 7000 123'}
    ]);
    write('ks_seed_done', true);
  };

  /* ---- Export CSV ---- */
  const exportCSV = (rows, filename='transactions.csv')=>{
    const head = ['Date','Type','Label','Amount(CFA)','Status','Ref','Channel','From','To','Fees(CFA)','Rate','Note'];
    const csv = [head.join(',')]
      .concat( rows.map(r=>[
        new Date(r.dateISO).toLocaleString(),
        r.type, r.label, r.amountCFA, r.status, r.ref, r.channel,
        r.countryFrom, r.countryTo, r.feesCFA, r.rate??'', `"${(r.note||'').replace(/"/g,'""')}"`].join(','))
      ).join('\n');

    const blob = new Blob([csv],{type:'text/csv;charset=utf-8;'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  };

  /* ---- PIN (front, hash simplifié) ---- */
  const getPinHash = ()=> read('ks_pin', null);
  const setPinHash = h => write('ks_pin', h);
  const hash = s => btoa(unescape(encodeURIComponent(s))).split('').reverse().join('');

  /* ---- Toast ---- */
  const toast = (msg) => {
    let holder = document.querySelector('.toast');
    if(!holder){ holder = document.createElement('div'); holder.className='toast'; document.body.append(holder); }
    const t=document.createElement('div'); t.className='t'; t.textContent=msg;
    holder.append(t); setTimeout(()=>t.remove(), 2800);
  };

  /* ---- Exports ---- */
  seedIfNeeded();
  rewriteLinksWithLang();

  return {
    lang, getLang,
    read, write,
    flag, fmt,
    FEES, RATES, refreshRates, quote,
    exportCSV,
    getPinHash, setPinHash, hash,
    toast
  };
})();
</script>
