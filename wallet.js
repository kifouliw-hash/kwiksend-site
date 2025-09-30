<script>
(() => {
  const {read, write, fmt, flag, quote, exportCSV, RATES, refreshRates, getPinHash, setPinHash, hash, toast, lang} = KS;

  /* ===== Langue select ===== */
  const langSel = document.getElementById('lang');
  if(langSel){ langSel.value = KS.lang; langSel.addEventListener('change', e=>{
    const u = new URL(location.href); u.searchParams.set('lang', e.target.value); location.href = u.toString();
  }); }

  /* ===== UI elements ===== */
  const balCFA = document.getElementById('balanceCFA');
  const balEUR = document.getElementById('balanceEUR');

  const simAmount = document.getElementById('sim_amount');
  const simDir    = document.getElementById('sim_dir');
  const simCh     = document.getElementById('sim_channel');
  const simGo     = document.getElementById('sim_go');
  const simRes    = document.getElementById('sim_result');

  const fType  = document.getElementById('f_type');
  const fStat  = document.getElementById('f_status');
  const fFrom  = document.getElementById('f_from');
  const fTo    = document.getElementById('f_to');
  const fQ     = document.getElementById('f_q');
  const btnCSV = document.getElementById('btn_export');
  const btnReset = document.getElementById('btn_reset');

  const tblBody = document.querySelector('#tbl tbody');
  const totIn = document.getElementById('tot_in');
  const totOut = document.getElementById('tot_out');
  const totBal = document.getElementById('tot_bal');

  /* ===== Data ===== */
  let wallet = read('ks_wallet', {balanceCFA:20000,balanceEUR:30});
  let tx = read('ks_tx', []);

  const drawBalances = () => {
    balCFA.textContent = fmt(wallet.balanceCFA,'FCFA');
    balEUR.textContent = `≈ ${fmt(wallet.balanceEUR,'EUR')}`;
  };

  /* ===== Actions quick (cards) ===== */
  document.querySelectorAll('.action').forEach(card=>{
    card.addEventListener('click', ()=>{
      const act = card.dataset.action;
      if(act==='send'){
        // redirection vers transferts AE
        goTransfer({dir:'AE'});
      }else if(act==='withdraw'){
        goTransfer({dir:'EA', channel:'IBAN'});
      }else if(act==='receive'){
        toast('Votre IBAN / Mobile Money sera disponible dans la prochaine version 🙂');
      }else{
        toast('Carte virtuelle : geler/dégeler, plafond… (à venir)');
      }
    });
  });

  const goTransfer = (opts={})=>{
    const u = new URL('transferts.html', location.href);
    u.searchParams.set('lang', KS.lang);
    if(opts.dir) u.searchParams.set('dir', opts.dir);
    if(opts.channel) u.searchParams.set('channel', opts.channel);
    location.href = u.toString();
  };

  /* ===== Simulateur inline ===== */
  const runSim = ()=>{
    const amount = Number(simAmount.value||0);
    if(!amount){ simRes.textContent='Entrez un montant'; return; }
    const q = quote({amount, dir:simDir.value, channel:simCh.value});
    simRes.innerHTML = `
      <div><b>Frais:</b> ${fmt(q.fee, q.sendCurrency)}</div>
      <div><b>Taux:</b> 1 ${q.sendCurrency} → ${q.sendCurrency==='FCFA' ? q.rate.toFixed(5)+' EUR' : q.rate.toFixed(0)+' FCFA'}</div>
      <div><b>Reçu:</b> ${fmt(q.received, q.recvCurrency)}</div>
      <div><b>Arrivée:</b> ${q.eta}</div>
      <div style="margin-top:8px">
        <a class="cta" href="transferts.html?dir=${simDir.value}&channel=${simCh.value}&amount=${amount}&lang=${KS.lang}">Continuer →</a>
      </div>`;
  };
  [simAmount, simDir, simCh].forEach(el=> el.addEventListener('input', runSim));
  simGo.addEventListener('click', runSim);

  /* ===== Historique + filtres ===== */
  const passFilters = (r)=>{
    if(fType.value && r.type !== fType.value) return false;
    if(fStat.value && r.status !== fStat.value) return false;

    if(fFrom.value){ const d = new Date(r.dateISO); if(d < new Date(fFrom.value)) return false; }
    if(fTo.value){ const d = new Date(r.dateISO); if(d > new Date(fTo.value + 'T23:59:59')) return false; }

    if(fQ.value){
      const q = fQ.value.toLowerCase();
      const blob = (r.label+' '+r.ref+' '+r.type+' '+r.channel).toLowerCase();
      if(!blob.includes(q)) return false;
    }
    return true;
  };

  const drawTable = ()=>{
    tblBody.innerHTML='';
    let inSum=0, outSum=0;
    [...tx].sort((a,b)=> new Date(b.dateISO)-new Date(a.dateISO)).forEach(r=>{
      if(!passFilters(r)) return;
      const tr = document.createElement('tr');
      const amt = r.amountCFA;
      if(amt>=0) inSum += amt; else outSum += amt;

      tr.innerHTML = `
        <td>${new Date(r.dateISO).toLocaleString()}</td>
        <td>${r.icon||''} ${r.type}</td>
        <td>${r.label}</td>
        <td style="font-weight:700;${amt<0?'color:#d33030':''}">${fmt(amt)}</td>
        <td><span class="badge ${r.status==='Completed'?'ok':(r.status==='Pending'?'pending':'err')}">${r.status}</span></td>
        <td>${r.ref||''}</td>
        <td>${flag(r.countryFrom)} → ${flag(r.countryTo)}</td>`;
      tblBody.append(tr);
    });
    totIn.textContent = fmt(inSum);
    totOut.textContent = fmt(outSum);
    totBal.textContent = fmt(wallet.balanceCFA);
  };

  [fType,fStat,fFrom,fTo,fQ].forEach(el=> el.addEventListener('input', drawTable));
  btnCSV.addEventListener('click', ()=> {
    const rows = tx.filter(passFilters);
    KS.exportCSV(rows);
  });
  btnReset.addEventListener('click', ()=>{
    localStorage.removeItem('ks_seed_done');
    location.reload();
  });

  /* ===== PIN modal ===== */
  const pinBack = document.getElementById('pin_back');
  const pinInputs = pinBack.querySelectorAll('input');
  const pinCancel = document.getElementById('pin_cancel');
  const pinOK = document.getElementById('pin_ok');

  const openPin = () => { pinBack.style.display='flex'; pinInputs.forEach(i=>i.value=''); pinInputs[0].focus(); };
  const closePin = () => pinBack.style.display='none';

  pinInputs.forEach((i,idx)=>{
    i.addEventListener('input', ()=>{
      if(i.value && idx<3) pinInputs[idx+1].focus();
    });
  });
  pinCancel.addEventListener('click', closePin);

  pinOK.addEventListener('click', ()=>{
    const code = [...pinInputs].map(i=>i.value).join('');
    if(code.length<4) return;
    const h = KS.getPinHash();
    if(!h){
      KS.setPinHash(KS.hash(code));
      KS.toast('PIN défini 👍');
      closePin();
    }else{
      if(h === KS.hash(code)){
        KS.toast('Validé ✅');
        closePin();
      }else{
        KS.toast('PIN incorrect ❌');
      }
    }
  });

  /* ===== Init ===== */
  drawBalances();
  drawTable();
  // Lien “Home” déjà réécrit avec ?lang
})();
</script>
