<script>
(() => {
  const {read, write, fmt, flag, quote, toast, getPinHash, setPinHash, hash, lang, isValidIBAN} = KS;

  /* Langue persistante */
  const langSel = document.getElementById('lang');
  if(langSel){ langSel.value = KS.lang; langSel.addEventListener('change', e=>{
    const u = new URL(location.href); u.searchParams.set('lang', e.target.value); location.href = u.toString();
  }); }

  /* Form elements */
  const dir = document.getElementById('dir');
  const channel = document.getElementById('channel');
  const benef = document.getElementById('benef');
  const benefList = document.getElementById('benef_list');
  const amount = document.getElementById('amount');
  const from = document.getElementById('from');
  const to = document.getElementById('to');
  const ref = document.getElementById('ref');
  const note = document.getElementById('note');

  const btnPrev = document.getElementById('btn_preview');
  const btnSend = document.getElementById('btn_send');
  const pv = document.getElementById('pv_body');

  /* Prefill via query */
  const q = new URL(location.href).searchParams;
  if(q.get('dir')) dir.value = q.get('dir');
  if(q.get('channel')) channel.value = q.get('channel');
  if(q.get('amount')) amount.value = q.get('amount');
  if(q.get('to')) to.value = q.get('to');
  if(q.get('benef')) benef.value = q.get('benef');

  /* Contacts list for datalist */
  const ben = read('ks_beneficiaries', []);
  const loadBenef = () => {
    benefList.innerHTML='';
    ben.forEach(b=>{
      const o = document.createElement('option');
      o.value = `${b.name} (${b.alias}) – ${b.account}`;
      benefList.append(o);
    });
  };
  loadBenef();

  const parseBenef = (txt) => {
    const m = txt.match(/^(.*?)\s*\((.*?)\)\s*–\s*(.+)$/);
    if(m) return {name:m[1].trim(), alias:m[2].trim(), account:m[3].trim()};
    return {name:txt.trim(), alias:txt.trim().toLowerCase().replace(/\s+/g,''), account:txt.trim()};
  };

  const renderPreview = ()=>{
    const A = Number(amount.value||0);
    if(!A){ pv.textContent='Entrez un montant'; btnSend.disabled=true; return; }
    if(!benef.value){ pv.textContent='Sélectionnez ou saisissez un bénéficiaire'; btnSend.disabled=true; return; }
    if(!from.value || !to.value){ pv.textContent='Renseignez les pays (ex: CI → FR)'; btnSend.disabled=true; return; }

    const b = parseBenef(benef.value);
    if(channel.value==='IBAN' && !isValidIBAN(b.account)){ pv.textContent='IBAN invalide (checksum failed)'; btnSend.disabled=true; return; }

    const qv = quote({amount:A, dir:dir.value, channel:channel.value});
    pv.innerHTML = `
      <div><b>Direction:</b> ${dir.value==='AE'?'Afrique → Europe':'Europe → Afrique'}</div>
      <div><b>Canal:</b> ${channel.value}</div>
      <div><b>Montant envoyé:</b> ${fmt(A, qv.sendCurrency)}</div>
      <div><b>Frais:</b> ${fmt(qv.fee, qv.sendCurrency)}</div>
      <div><b>Taux:</b> ${qv.sendCurrency==='FCFA' ? '1 FCFA → '+qv.rate.toFixed(5)+' €' : '1 € → '+qv.rate.toFixed(0)+' FCFA'}</div>
      <div><b>Montant reçu:</b> ${fmt(qv.received, qv.recvCurrency)}</div>
      <div><b>Arrivée estimée:</b> ${qv.eta}</div>
      <hr>
      <div><b>Bénéficiaire:</b> ${b.name} (${b.alias})</div>
      <div><b>Compte:</b> ${b.account}</div>
      <div><b>Itinéraire:</b> ${flag(from.value)} → ${flag(to.value)}</div>
      ${ref.value?`<div><b>Référence:</b> ${ref.value}</div>`:''}
      ${note.value?`<div><b>Note:</b> ${note.value}</div>`:''}
    `;
    btnSend.disabled=false;
  };

  [dir,channel,benef,amount,from,to,ref,note].forEach(el=> el.addEventListener('input', renderPreview));
  btnPrev.addEventListener('click', renderPreview);

  /* PIN modal */
  const pinBack = document.getElementById('pin_back');
  const pinInputs = pinBack.querySelectorAll('input');
  const pinCancel = document.getElementById('pin_cancel');
  const pinOK = document.getElementById('pin_ok');
  const openPin = () => { pinBack.style.display='flex'; pinInputs.forEach(i=>i.value=''); pinInputs[0].focus(); };
  const closePin = () => pinBack.style.display='none';
  pinInputs.forEach((i,idx)=> i.addEventListener('input', ()=>{ if(i.value && idx<3) pinInputs[idx+1].focus(); }) );
  pinCancel.addEventListener('click', closePin);

  btnSend.addEventListener('click', ()=>{
    renderPreview();
    if(btnSend.disabled) return;
    openPin();
  });

  pinOK.addEventListener('click', ()=>{
    const code = [...pinInputs].map(i=>i.value).join('');
    if(code.length<4) return;
    const h = KS.getPinHash();
    if(!h){
      KS.setPinHash(KS.hash(code));
      KS.toast('PIN défini 👍');
      proceed();
    }else{
      if(h === KS.hash(code)) proceed();
      else KS.toast('PIN incorrect ❌');
    }
  });

  const proceed = ()=>{
    const A = Number(amount.value);
    const qv = quote({amount:A, dir:dir.value, channel:channel.value});
    const b = parseBenef(benef.value);

    // enregistrer contact si nouveau
    const list = read('ks_beneficiaries', []);
    if(!list.find(x=>x.alias===b.alias || x.account===b.account)){
      list.push({name:b.name, alias:b.alias, country:to.value.toUpperCase(), channel:channel.value, account:b.account});
      write('ks_beneficiaries', list);
    }

    const wallet = read('ks_wallet', {balanceCFA:20000,balanceEUR:30});
    if(dir.value==='AE'){
      wallet.balanceCFA = Math.max(0, wallet.balanceCFA - A);
      write('ks_wallet', wallet);
    }else{
      wallet.balanceCFA += qv.received;
      write('ks_wallet', wallet);
    }

    const tx = read('ks_tx', []);
    const id = (tx.at(-1)?.id || 0) + 1;
    tx.push({
      id, dateISO:new Date().toISOString(),
      type: dir.value==='AE' ? 'Send' : 'Withdraw',
      amountCFA: dir.value==='AE' ? -A : qv.received,
      label: `${b.name} – ${channel.value}`,
      status:'Completed', icon: dir.value==='AE' ? '📤' : '🏦',
      ref: ref.value || (channel.value==='IBAN'?'IB-':'TR-') + String(Math.random()).slice(2,6),
      channel: channel.value,
      countryFrom: from.value.toUpperCase(), countryTo: to.value.toUpperCase(),
      feesCFA: dir.value==='AE' ? Math.round(qv.fee) : 0,
      rate: qv.rate, note: note.value || ''
    });
    write('ks_tx', tx);

    KS.toast('Transfert simulé ✅');
    closePin();
    setTimeout(()=> location.href = 'portefeuille.html?lang='+KS.lang, 600);
  };

  renderPreview();
})();
</script>
