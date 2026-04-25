const CATEGORIES = {
  Food:{emoji:'🍽',color:'#f46a6a'},
  Transport:{emoji:'🚌',color:'#5aabff'},
  Shopping:{emoji:'🛍',color:'#a394ff'},
  Health:{emoji:'💊',color:'#3ecf8e'},
  Entertainment:{emoji:'🎬',color:'#f9b44a'},
  Bills:{emoji:'📄',color:'#36c6c6'},
  Education:{emoji:'📚',color:'#ff8fa3'},
  'Home & Rent':{emoji:'🏠',color:'#72e4b8'},
  Salary:{emoji:'💼',color:'#3ecf8e'},
  Freelance:{emoji:'💻',color:'#a394ff'},
  Investment:{emoji:'📈',color:'#5aabff'},
  Other:{emoji:'✦',color:'#9ba3b4'},
};

let transactions = JSON.parse(localStorage.getItem('sw_txns')||'[]');
let budget = parseFloat(localStorage.getItem('sw_budget')||'0');
let activeType = 'expense';
let activeCat = 'Food';
let filter = 'all';

function save(){localStorage.setItem('sw_txns',JSON.stringify(transactions));localStorage.setItem('sw_budget',budget)}
function fmt(n){return '₹'+Number(n).toLocaleString('en-IN',{minimumFractionDigits:0,maximumFractionDigits:0})}
function toast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2500)}

function setType(type){
  activeType = type;
  const btnE = document.getElementById('btn-expense');
  const btnI = document.getElementById('btn-income');
  // Reset both buttons first
  btnE.className = 'type-btn';
  btnI.className = 'type-btn';
  // Apply active style to the selected one
  if(type === 'expense') btnE.className = 'type-btn active-expense';
  else btnI.className = 'type-btn active-income';
  buildCatChips();
}

function buildCatChips(){
  const cats = activeType==='income'
    ? ['Salary','Freelance','Investment','Other']
    : Object.keys(CATEGORIES).filter(c=>!['Salary','Freelance','Investment'].includes(c));
  if(!cats.includes(activeCat)) activeCat = cats[0];
  const container = document.getElementById('cat-chips');
  container.innerHTML = cats.map(c=>`<button class="cat-chip" onclick="selectCat('${c}')"
    style="${activeCat===c ? `background:${CATEGORIES[c].color}22;border-color:${CATEGORIES[c].color};color:${CATEGORIES[c].color}` : ''}"
    >${CATEGORIES[c].emoji} ${c}</button>`).join('');
}

function selectCat(c){activeCat=c;buildCatChips()}

function setFilter(f,el){
  filter=f;
  document.querySelectorAll('.filter-chip').forEach(e=>e.classList.remove('active'));
  el.classList.add('active');
  render();
}

function addTransaction(){
  const name=document.getElementById('inp-name').value.trim();
  const amount=parseFloat(document.getElementById('inp-amount').value);
  const date=document.getElementById('inp-date').value;
  const payment=document.getElementById('inp-payment').value;
  if(!name){toast('Enter a description');return}
  if(!amount||amount<=0){toast('Enter a valid amount');return}
  if(!date){toast('Select a date');return}
  transactions.unshift({id:Date.now(),name,amount,date,payment,category:activeCat,type:activeType});
  save();
  document.getElementById('inp-name').value='';
  document.getElementById('inp-amount').value='';
  toast('Transaction added!');
  render();renderStats();renderCatChart();renderBudget();
}

function deleteTransaction(id){
  transactions=transactions.filter(t=>t.id!==id);
  save();render();renderStats();renderCatChart();renderBudget();
  toast('Deleted');
}

function clearAll(){if(!confirm('Clear all transactions?'))return;transactions=[];save();render();renderStats();renderCatChart();renderBudget();toast('All cleared')}

function render(){
  const q=document.getElementById('search').value.toLowerCase();
  let list=transactions.filter(t=>{
    if(filter==='expense'&&t.type!=='expense')return false;
    if(filter==='income'&&t.type!=='income')return false;
    if(q&&!t.name.toLowerCase().includes(q)&&!t.category.toLowerCase().includes(q))return false;
    return true;
  });
  const el=document.getElementById('expense-list');
  if(!list.length){el.innerHTML=`<div class="empty"><div class="empty-icon">💸</div><div>No transactions yet</div></div>`;return}
  el.innerHTML=list.map(t=>{
    const cat=CATEGORIES[t.category]||CATEGORIES.Other;
    const d=new Date(t.date);
    const ds=d.toLocaleDateString('en-IN',{day:'numeric',month:'short'});
    return`<div class="expense-item">
      <div class="expense-icon" style="background:${cat.color}22">${cat.emoji}</div>
      <div class="expense-info">
        <div class="expense-name">${t.name}</div>
        <div class="expense-meta">
          <span>${ds}</span>
          <span style="color:${cat.color}">${t.category}</span>
          <span style="background:var(--surface3);padding:1px 6px;border-radius:4px">${t.payment}</span>
        </div>
      </div>
      <span class="expense-amount${t.type==='income'?' income':''}">${t.type==='income'?'+':'-'}${fmt(t.amount)}</span>
      <button class="del-btn" onclick="deleteTransaction(${t.id})">×</button>
    </div>`;
  }).join('');
}

function setBudget(){
  const v=parseFloat(document.getElementById('budget-input').value);
  if(!v||v<=0){toast('Enter a valid budget');return}
  budget=v;save();renderBudget();
  document.getElementById('budget-input').value='';
  toast('Budget set to '+fmt(v));
}

function renderStats(){
  const income=transactions.filter(t=>t.type==='income').reduce((s,t)=>s+t.amount,0);
  const expenses=transactions.filter(t=>t.type==='expense').reduce((s,t)=>s+t.amount,0);
  const net=income-expenses;
  document.getElementById('total-income').textContent=fmt(income);
  document.getElementById('total-expenses').textContent=fmt(expenses);
  document.getElementById('income-count').textContent=transactions.filter(t=>t.type==='income').length+' transactions';
  document.getElementById('expense-count').textContent=transactions.filter(t=>t.type==='expense').length+' transactions';
  const nb=document.getElementById('net-balance');
  nb.textContent=fmt(net);
  nb.style.color=net>=0?'var(--green)':'var(--red)';
  const exp=transactions.filter(t=>t.type==='expense');
  if(exp.length){
    const biggest=exp.reduce((a,b)=>b.amount>a.amount?b:a);
    document.getElementById('biggest-expense').textContent=fmt(biggest.amount);
    document.getElementById('biggest-cat').textContent=biggest.category;
  }
  else{
    document.getElementById('biggest-expense').textContent=fmt(0);
    document.getElementById('biggest-cat').textContent='NA';
  }
  renderStreak();
}

function renderCatChart(){
  const totals={};
  transactions.filter(t=>t.type==='expense').forEach(t=>{totals[t.category]=(totals[t.category]||0)+t.amount});
  const sorted=Object.entries(totals).sort((a,b)=>b[1]-a[1]).slice(0,7);
  const max=sorted[0]?.[1]||1;
  const el=document.getElementById('cat-chart');
  if(!sorted.length){el.innerHTML='<div style="color:var(--text3);font-size:13px">No expense data yet</div>';return}
  el.innerHTML=sorted.map(([cat,val])=>{
    const c=CATEGORIES[cat]||CATEGORIES.Other;
    const pct=Math.round(val/max*100);
    return`<div class="bar-row">
      <div class="bar-label">${c.emoji} ${cat}</div>
      <div class="bar-track"><div class="bar-fill" style="width:${pct}%;background:${c.color}"></div></div>
      <div class="bar-val">${fmt(val)}</div>
    </div>`;
  }).join('');
}

function renderBudget(){
  const spent=transactions.filter(t=>t.type==='expense').reduce((s,t)=>s+t.amount,0);
  document.getElementById('budget-spent').textContent=fmt(spent);
  document.getElementById('budget-set').textContent=budget?fmt(budget):'Not set';
  if(budget){
    const pct=Math.min(100,Math.round(spent/budget*100));
    const bar=document.getElementById('budget-bar');
    bar.style.width=pct+'%';
    bar.className='big-bar-fill'+(pct>=100?' danger':pct>=75?' warn':'');
    document.getElementById('budget-pct').textContent=pct+'% of budget used';
  }
}

function renderStreak(){
  const days=new Set(transactions.map(t=>t.date));
  document.getElementById('streak-info').innerHTML=`
    <div style="margin-bottom:6px"><span style="font-size:22px;font-weight:600;color:var(--amber)">${days.size}</span> <span style="color:var(--text3)">days tracked</span></div>
    <div style="color:var(--text3)">${transactions.length} total transactions</div>
  `;
}

function exportCSV(){
  if(!transactions.length){toast('No transactions to export');return}
  const header='Date,Description,Category,Type,Amount,Payment\n';
  const rows=transactions.map(t=>`${t.date},"${t.name}",${t.category},${t.type},${t.amount},${t.payment}`).join('\n');
  const blob=new Blob([header+rows],{type:'text/csv'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);
  a.download='spendwise-export.csv';a.click();
  toast('CSV exported!');
}

// Init
document.getElementById('inp-date').value=new Date().toISOString().split('T')[0];
document.getElementById('month-label').textContent=new Date().toLocaleString('en-IN',{month:'long',year:'numeric'});
buildCatChips();
render();renderStats();renderCatChart();renderBudget();