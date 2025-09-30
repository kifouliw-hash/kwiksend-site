<script>
(() => {
  const {
    read, write, fmt, flag, quote, exportCSV, getPinHash, setPinHash, hash, toast,
    lang, getTheme, setTheme
  } = KS;

  /* ===== Lang & Theme ===== */
  const langSel = document.getElementById('lang');
  if(langSel){ langSel.value = KS.lang; langSel.addEventListener('change', e=>{
    const u = new URL(location.href); u.searchParams.set('lang', e.target.value); location.href = u.toString();
  }); }
  const themeBtn = document.getElementById('themeToggle');
  if(themeBtn){
    themeBtn.textContent = KS.getTheme()==='dark' ? '🌙' : '🌓';
    themeBtn.onclick = ()=>{
      KS.setTheme(KS.getTheme()==='dark'?'light':'dark');
      themeBtn.textContent = KS.getTheme()==='dark' ? '🌙' : '🌓';
    };
  }

  /* ===== UI ===== */
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

  const vcardView = document.getElementById('vcard_view');
  const btnFreeze = document.getElementById('btn_v_freeze');
  const btnReveal = document.getElementById('btn_v_reveal');
  const btnNew = document.getElementById('btn_v_new');

  const cList = document.getElementById('contacts_list');
  const cAdd = document.getElementById('c_add');
  const cName = document.getElementById('c_name');
  const cAlias = document.getElementById('c_alias');
  const cAcct = document.getElementById('c_acct');

  /* ===== Data ===== */
  let wallet = read('ks_wallet', {balanceCFA:20000,balanceEUR:30});
  let tx = read('ks_tx', []);
  let vcard = read('ks_vcard', {holder:'KWIKSEND USER', number:'5412 7512 3412 1234', exp:'12/27', cvv:'284', frozen:false, limitDaily:200000, spentToday:35000});
  let contacts = read('ks_beneficiaries', []);

  /* ===== Render ===== */
  const drawBalances = () => {
    balCFA.textContent = fmt(wallet.balanceCFA,'FCFA');
    balEUR.textContent = `≈ ${fmt(wallet.balanceEUR,'EUR')}`;
  };

  const maskNum = (n)=> n.replace(/\d(?=\d{4})/g,'*');
  let showCvv = false;
  const renderCard = ()=>{
    vcardView.innerHTML = `
      <div class="card-ui">
        <div class="brand">KwikSend</div>
        <div class="chip"></div>
        <div class="num">${vcard.frozen ? maskNum(vcard.number) : vcard.number}</div>
        <div class="meta">
          <div>EXP&nbsp;<b>${vcard.exp}</b></div>
          <div>CVV&nbsp;<b>${showCvv ? vcard.cvv : '***'}</b></div>
          <div>LIMITE&nbsp;<b>${fmt(vcard.limitDaily)}</b></div>
        </div>
        <div class="holder">${vcard.holder}</div>
        <div class="badges">
          <div class="badge2">${vcard.frozen ? '❄ Gelée' : '✓ Active'}</div>
          <div class="badge2">Dépensé&nbsp;${fmt(vcard.spentToday)}</div>
        </div>
      </div>`;
    btnFreeze.textContent = vcard.frozen ? 'Dégeler' : 'Geler';
    btnReveal.textContent = showCvv ? 'Masquer CVV' : 'Afficher CVV';
  };

  btnFreeze.onclick = ()=>{ vcard.frozen = !vcard.frozen; write('ks_vcard', vcard); renderCard(); toast(vcard.frozen?'Carte gelée':'Carte active'); };
  btnReveal.onclick = ()=>{ showCvv = !showCvv; renderCard(); };
  btnNew.onclick = ()=>{
    // simple génération locale
    const r4 = ()=> String(Math.floor(1000+Math.random()*9000));
    vcard.number = `5412 ${r4()} ${r4()} ${r4()}`;
    vcard.cvv = String(Math.floor(100+Math.random()*900));
    vcard.exp = '12/'+String(26+Math.floor(Math.random()*4));
    vcard.frozen=false;
    write('ks_vcard', vcard);
    renderCard();
    toast('Nouvelle carte générée ✅');
  };

  /* Contacts */
  const renderContacts = ()=>{
    cList.innerHTML = '';
    contacts.forEach((b,idx)=>{
      const row = document.createElement('div');
      row.style.cssText = 'display:flex;gap:10px;align-items:center;justify-content:space-between;padding:10px;border:1px solid #eee;border-radius:10px;margin:6px 0;background:var(--card)';
      row.innerHTML = `
        <div style="display:flex;gap:10px;align-items:center">
          <div>👤</div>
          <div><b>${b.name}</b> <small style="color:var(--muted)">(${b.alias})</small><br>
            <small>${b.channel} • ${b.account}</small>
          </div>
        </div>
        <div class="actions-row">
          <a class="btn ok" href="transferts.html?lang=${KS.lang}&channel=${b.channel}&dir=AE&amount=10000&to=${b.country}&benef=${encodeURIComponent(b.name+' ('+b.alias+') – '+b.account)}">Envoyer</a>
          <button data-i="${idx}" class="btn out c_del">Supprimer</button>
        </div>`;
      cList.append(row);
    });
    cList.querySelectorAll('.c_del').forEach(btn=>{
      btn.onclick = ()=>{
        const i = +btn.dataset.i;
        contacts.splice(i,1);
        write('ks_beneficiaries', contacts);
        renderContacts();
      };
    });
  };

  cAdd.onclick = ()=>{
    const name = cName.value.trim(); const alias = cAlias.value.trim(); const acct = cAcct.value.trim();
    if(!name || !alias || !acct){ toast('Champs manquants'); return; }
    contacts.push({name, alias, country:'CI', channel: acct.startsWith('FR') ? 'IBAN':'MOBILE', account:acct});
    write('ks_beneficiaries', contacts);
    cName.value=''; cAlias.value=''; cAcct.value='';
    renderContacts(); toast('Contact ajouté ✅');
  };

  /* ===== Actions quick ===== */
  document.querySelectorAll('.action').forEach(card=>{
    card.addEventListener('click', ()=>{
      const act = card.dataset.action;
      if(act==='send'){
        goTransfer({dir:'AE'});
      }else if(act==='withdraw'){
        goTransfer({dir:'EA', channel:'IBAN'});
      }else if(act==='receive'){
        toast('Votre RIB / Mobile Money sera disponible prochainement 🙂');
      }else{
        document.querySelector('#vcard_view').scrollIntoView({behavior:'smooth'});
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

  /* ===== Simulateur ===== */
  const runSim = ()=>{
    const amount = Number(simAmount.value||0);
    if(!amount){ simRes.textContent='Entrez un montant'; return; }
    const q = quote({amount, dir:simDir.value, channel:simCh.value});
    simRes.innerHTML = `
      <div><b>Frais:</b> ${fmt(q.fee, q.sendCurrency)}</div>
      <div><b>Taux:</b> ${q.sendCurrency==='FCFA' ? q.rate.toFixed(5)+' €' : q.rate.toFixed(0)+' FCFA'}</div>
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
    const rows = read('ks_tx', []).filter(passFilters);
    KS.exportCSV(rows);
  });
  btnReset.addEventListener('click', ()=>{
    localStorage.removeItem('ks_seed_done');
    location.reload();
  });

  /* ===== Init ===== */
  drawBalances();
  renderCard();
  renderContacts();
  drawTable();
})();
</script>
