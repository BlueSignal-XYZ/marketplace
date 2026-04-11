// ── BlueSignal Pipeline Dashboard v3 ──────────────────────
// Sidebar nav, embedded terminal, 17 data sections.

const DATA_BASE = 'data';
console.log('BlueSignal Dashboard v3 loaded');

// ── Utilities ─────────────────────────────────────────────
function $(id) { return document.getElementById(id); }
function formatCurrency(n) {
  if (n >= 1000000) return '$' + (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return '$' + (n / 1000).toFixed(0) + 'K';
  return '$' + n.toFixed(2);
}
function pill(label, cls) { return `<span class="pill pill-${cls}">${label}</span>`; }
function escapeHtml(s) { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }
async function fetchJSON(file) {
  const r = await fetch(`${DATA_BASE}/${file}`);
  if (!r.ok) throw new Error(`${file}: ${r.status}`);
  return r.json();
}

// ── Sidebar Navigation ────────────────────────────────────
function setupSidebar() {
  const sidebar = $('sidebar');
  const overlay = $('sidebar-overlay');
  const toggle = $('menu-toggle');
  const close = $('sidebar-close');
  const items = document.querySelectorAll('.nav-item');
  const title = $('page-title');

  function openSidebar() { sidebar.classList.add('open'); }
  function closeSidebar() { sidebar.classList.remove('open'); }

  toggle.addEventListener('click', openSidebar);
  close.addEventListener('click', closeSidebar);
  overlay.addEventListener('click', closeSidebar);

  items.forEach(item => {
    item.addEventListener('click', (e) => {
      items.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      title.textContent = item.querySelector('.nav-label').textContent;
      closeSidebar();
    });
  });

  // Scroll spy
  const panels = document.querySelectorAll('.panel');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        items.forEach(i => {
          i.classList.toggle('active', i.dataset.section === id);
          if (i.dataset.section === id) {
            title.textContent = i.querySelector('.nav-label').textContent;
          }
        });
      }
    });
  }, { rootMargin: '-60px 0px -70% 0px', root: $('content') });
  panels.forEach(p => observer.observe(p));
}

// ── Terminal ──────────────────────────────────────────────
function setupTerminal() {
  const input = $('terminal-input');
  const output = $('terminal-output');
  const bar = $('terminal-bar');
  const wrapper = $('terminal-wrapper');
  const clearBtn = $('term-clear');
  const toggleBtn = $('term-toggle');
  let history = [];
  let histIdx = -1;

  function addLine(text, cls) {
    const div = document.createElement('div');
    div.className = 'term-line ' + (cls || '');
    div.textContent = text;
    output.appendChild(div);
    output.scrollTop = output.scrollHeight;
  }

  function addHtml(html, cls) {
    const div = document.createElement('div');
    div.className = 'term-line ' + (cls || '');
    div.innerHTML = html;
    output.appendChild(div);
    output.scrollTop = output.scrollHeight;
  }

  async function exec(cmd) {
    addLine(cmd, 'term-cmd');
    history.unshift(cmd);
    histIdx = -1;
    if (history.length > 100) history.pop();

    try {
      const r = await fetch('/api/exec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: cmd })
      });
      const data = await r.json();
      if (data.stdout) addLine(data.stdout, 'term-output');
      if (data.stderr) addLine(data.stderr, 'term-error');
      if (data.error) addLine(data.error, 'term-error');
    } catch (e) {
      addLine('Connection error: ' + e.message, 'term-error');
    }
  }

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && input.value.trim()) {
      exec(input.value.trim());
      input.value = '';
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (histIdx < history.length - 1) { histIdx++; input.value = history[histIdx]; }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (histIdx > 0) { histIdx--; input.value = history[histIdx]; }
      else { histIdx = -1; input.value = ''; }
    }
  });

  bar.addEventListener('click', () => wrapper.classList.toggle('collapsed'));
  toggleBtn.addEventListener('click', (e) => { e.stopPropagation(); wrapper.classList.toggle('collapsed'); });
  clearBtn.addEventListener('click', (e) => { e.stopPropagation(); output.innerHTML = ''; });

  // Start collapsed
  wrapper.classList.add('collapsed');
}

// ── Render Functions ──────────────────────────────────────
function renderNeedsAction(data) {
  $('action-count').textContent = data.length;
  const nb = $('nav-action-count'); if (nb) nb.textContent = data.length || '';
  if (!data.length) { $('needs-action-body').innerHTML = ''; return; }
  $('needs-action-body').innerHTML = data.map(item => `
    <div class="action-item">
      <div>${pill(item.priority, item.priority)}</div>
      <div class="action-item-content">
        <div class="action-item-title">${escapeHtml(item.title)}</div>
        <div class="action-item-meta">${item.account ? escapeHtml(item.account) + ' &middot; ' : ''}${escapeHtml(item.notes)}</div>
      </div>
    </div>`).join('');
}

function renderTopAccounts(data) {
  if (!data.length) { $('top-accounts-body').innerHTML = ''; return; }
  $('top-accounts-body').innerHTML = `<table class="data-table"><thead><tr><th>#</th><th>Account</th><th>Health</th><th>Revenue</th><th>Last Contact</th><th>Next Action</th></tr></thead><tbody>${data.map(a => `<tr><td class="text-dim">${a.rank}</td><td class="text-bold">${escapeHtml(a.name)}</td><td>${pill(a.health, a.health)}</td><td class="text-right text-nowrap">${a.revenue ? formatCurrency(a.revenue) : '—'}</td><td class="text-muted text-small">${escapeHtml(a.lastContact)}</td><td class="text-small">${escapeHtml(a.nextAction)}</td></tr>`).join('')}</tbody></table>`;
}

function renderAgenda(data) {
  if (!data.length) { $('agenda-body').innerHTML = ''; return; }
  $('agenda-body').innerHTML = data.map(i => `<div class="agenda-item"><div class="agenda-time">${i.time}</div><div class="agenda-content"><div class="agenda-title">${escapeHtml(i.title)}</div><div class="agenda-meta">${i.duration}min${i.type ? ' &middot; ' + i.type : ''}${i.notes ? ' &middot; ' + escapeHtml(i.notes) : ''}</div></div></div>`).join('');
}

function renderDealerCalls(data) {
  $('calls-week').textContent = data.week || '';
  if (!data.calls || !data.calls.length) { $('dealer-calls-body').innerHTML = ''; return; }
  $('dealer-calls-body').innerHTML = `<table class="data-table"><thead><tr><th>Day</th><th>Time</th><th>Dealer</th><th>Status</th><th>Outcome</th><th>Follow-up</th></tr></thead><tbody>${data.calls.map(c => `<tr><td class="text-nowrap">${c.day}<br><span class="text-dim text-small">${c.date}</span></td><td>${c.time}</td><td class="text-bold">${escapeHtml(c.dealer)}</td><td>${pill(c.status, c.status)}</td><td class="text-small text-muted">${c.outcome || '—'}</td><td class="text-small">${escapeHtml(c.followUp)}</td></tr>`).join('')}</tbody></table>`;
}

function renderInitiatives(data) {
  if (!data.length) { $('initiatives-body').innerHTML = ''; return; }
  $('initiatives-body').innerHTML = `<div class="initiative-grid">${data.map(init => {
    const pc = init.progress >= 60 ? 'green' : init.progress >= 30 ? 'yellow' : 'blue';
    const ms = init.milestones.map(m => {
      const cls = m.status === 'done' ? 'done' : m.status === 'in-progress' ? 'active' : 'pending';
      const icon = m.status === 'done' ? '&#10003;' : m.status === 'in-progress' ? '&#9679;' : '&#9675;';
      return `<div class="milestone milestone-${cls}"><span class="milestone-icon">${icon}</span> ${escapeHtml(m.name)}</div>`;
    }).join('');
    return `<div class="initiative-card"><div class="initiative-header"><div class="initiative-name">${escapeHtml(init.name)}</div>${pill(init.status, init.status)}</div><div class="initiative-desc">${escapeHtml(init.description)}</div><div class="initiative-target">Target: ${init.target}</div><div class="progress-bar"><div class="progress-fill progress-fill-${pc}" style="width:${init.progress}%"></div></div><div class="progress-label">${init.progress}%</div><div class="milestone-list">${ms}</div></div>`;
  }).join('')}</div>`;
}

function renderPipeline(data) {
  const s = data.summary;
  if (!s || !s.totalPipeline) { $('pipeline-body').innerHTML = ''; return; }
  const stats = `<div class="pipeline-summary"><div class="pipeline-stat"><div class="pipeline-stat-label">Total Pipeline</div><div class="pipeline-stat-value">${formatCurrency(s.totalPipeline)}</div></div><div class="pipeline-stat"><div class="pipeline-stat-label">Weighted</div><div class="pipeline-stat-value">${formatCurrency(s.weightedPipeline)}</div></div><div class="pipeline-stat"><div class="pipeline-stat-label">Won YTD</div><div class="pipeline-stat-value text-green">${formatCurrency(s.closedWonYTD)}</div><div class="pipeline-stat-sub">Win: ${s.winRate}%</div></div><div class="pipeline-stat"><div class="pipeline-stat-label">Avg Deal</div><div class="pipeline-stat-value">${formatCurrency(s.avgDealSize)}</div><div class="pipeline-stat-sub">${s.avgCycleLength}d cycle</div></div></div>`;
  const colors = ['#4f8ff7','#6366f1','#a78bfa','#fbbf24','#34d399','#f87171'];
  const total = data.stages.reduce((s, st) => s + st.value, 0);
  const stages = total ? `<div class="pipeline-stages">${data.stages.map((st, i) => { const p = st.value / total * 100; return `<div class="pipeline-stage-bar" style="flex:${p};background:${colors[i]}" title="${st.name}: ${formatCurrency(st.value)}">${p > 10 ? st.name : ''}</div>`; }).join('')}</div>` : '';
  const rows = data.deals.map(d => `<tr><td class="text-bold">${escapeHtml(d.name)}</td><td class="text-muted">${escapeHtml(d.account)}</td><td class="text-right text-nowrap">${formatCurrency(d.value)}</td><td class="text-right">${d.probability}%</td><td class="text-muted text-nowrap">${d.closeDate}</td></tr>`).join('');
  $('pipeline-body').innerHTML = `${stats}${stages}<table class="data-table"><thead><tr><th>Deal</th><th>Account</th><th>Value</th><th>Prob</th><th>Close</th></tr></thead><tbody>${rows}</tbody></table>`;
}

function renderSPAAlerts(data) {
  const high = data.filter(a => a.severity === 'high').length;
  $('spa-count').textContent = high;
  const nb = $('nav-spa-count'); if (nb) nb.textContent = high || '';
  if (!data.length) { $('spa-body').innerHTML = ''; return; }
  $('spa-body').innerHTML = data.map(a => `<div class="action-item"><div>${pill(a.type.replace('-', ' '), a.type)}</div><div class="action-item-content"><div class="action-item-title">${escapeHtml(a.dealer)}${a.spaNumber ? ' &middot; ' + a.spaNumber : ''}</div><div class="action-item-meta">${a.daysRemaining != null ? a.daysRemaining + 'd left &middot; ' : ''}${a.currentDiscount ? a.currentDiscount + '% &middot; ' : ''}${formatCurrency(a.annualVolume)}/yr</div><div class="action-item-meta text-small" style="margin-top:3px">${escapeHtml(a.action)}</div></div></div>`).join('');
}

function renderDealerHealth(data) {
  if (!data.dealers || !data.dealers.length) { $('dealer-health-body').innerHTML = ''; return; }
  $('dealer-health-body').innerHTML = data.dealers.sort((a, b) => b.score - a.score).map(d => {
    const c = d.score >= 80 ? 'var(--green)' : d.score >= 60 ? 'var(--yellow)' : 'var(--red)';
    const ti = d.trend === 'up' ? '&#9650;' : d.trend === 'down' ? '&#9660;' : '&#9644;';
    const tc = d.trend === 'up' ? 'text-green' : d.trend === 'down' ? 'text-red' : 'text-dim';
    return `<div class="health-row"><div class="health-name">${escapeHtml(d.name)}</div><div class="health-bar-wrap"><div class="health-bar-fill" style="width:${d.score}%;background:${c}"></div></div><div class="health-score" style="color:${c}">${d.score}</div><div class="health-meta"><span class="${tc} text-small">${ti}</span> ${pill(d.health, d.health)}</div></div>`;
  }).join('');
}

function renderOpenLoops(data) {
  $('loops-count').textContent = data.length;
  const nb = $('nav-loops-count'); if (nb) nb.textContent = data.length || '';
  if (!data.length) { $('open-loops-body').innerHTML = ''; return; }
  $('open-loops-body').innerHTML = `<table class="data-table"><thead><tr><th>Item</th><th>Account</th><th>Priority</th><th>Age</th><th>Next Step</th></tr></thead><tbody>${data.map(l => `<tr><td class="text-bold">${escapeHtml(l.title)}</td><td class="text-muted">${escapeHtml(l.account)}</td><td>${pill(l.priority, l.priority)}</td><td class="text-dim text-nowrap">${l.age}d</td><td class="text-small">${escapeHtml(l.nextStep)}</td></tr>`).join('')}</tbody></table>`;
}

function renderForecast(data) {
  const fc = data.forecast;
  if (!fc) { $('forecast-body').innerHTML = ''; return; }
  function rq(key, label) {
    const q = fc[key]; if (!q || !q.target) return '';
    const pc = Math.min(100, q.committed / q.target * 100);
    const pb = Math.min(100, q.bestCase / q.target * 100);
    const deals = q.deals.map(d => `<tr><td class="text-bold text-small">${escapeHtml(d.name)}</td><td class="text-right text-nowrap">${formatCurrency(d.value)}</td><td class="text-right">${d.probability}%</td><td class="text-muted text-nowrap">${d.close}</td></tr>`).join('');
    return `<div class="forecast-quarter"><div class="forecast-quarter-title">${label}</div><div style="display:flex;justify-content:space-between"><span class="text-small text-muted">Target: ${formatCurrency(q.target)}</span><span class="text-small ${q.gap > 0 ? 'text-red' : 'text-green'}">Gap: ${formatCurrency(q.gap)}</span></div><div class="forecast-bar-outer"><div class="forecast-bar-committed" style="width:${pb}%;background:rgba(79,143,247,0.2)"></div><div class="forecast-bar-committed" style="width:${pc}%;background:var(--green)"></div></div><div class="forecast-legend"><div class="forecast-legend-item"><div class="forecast-legend-dot" style="background:var(--green)"></div>Committed: ${formatCurrency(q.committed)}</div><div class="forecast-legend-item"><div class="forecast-legend-dot" style="background:var(--accent)"></div>Best: ${formatCurrency(q.bestCase)}</div></div><table class="data-table" style="margin-top:10px"><thead><tr><th>Deal</th><th>Value</th><th>Prob</th><th>Close</th></tr></thead><tbody>${deals}</tbody></table></div>`;
  }
  $('forecast-body').innerHTML = `<div class="forecast-grid">${rq('q2', data.currentQuarter || 'Current')}${rq('q3', data.nextQuarter || 'Next')}</div>`;
}

function renderProducts(data) {
  if (!data.products || !data.products.length) { $('products-body').innerHTML = ''; return; }
  const rows = data.products.map(p => `<tr><td class="text-bold">${escapeHtml(p.name)}</td><td class="text-dim">${p.sku}</td><td class="text-right text-nowrap">${formatCurrency(p.listPrice)}${p.billing ? '/' + p.billing.replace('monthly','mo').replace('per-transaction','txn') : ''}</td><td class="text-right text-nowrap">${formatCurrency(p.dealerPrice)}${p.billing ? '/' + p.billing.replace('monthly','mo').replace('per-transaction','txn') : ''}</td><td class="text-right">${p.margin}%</td><td>${pill(p.status, p.status)}</td></tr>`).join('');
  const changes = data.recentChanges.map(c => `<div class="text-small text-muted" style="padding:2px 0"><span class="text-dim">${c.date}</span> — ${escapeHtml(c.change)}</div>`).join('');
  $('products-body').innerHTML = `<table class="data-table"><thead><tr><th>Product</th><th>SKU</th><th>List</th><th>Dealer</th><th>Margin</th><th>Status</th></tr></thead><tbody>${rows}</tbody></table>${changes ? '<div style="margin-top:10px;padding-top:8px;border-top:1px solid var(--border)"><div class="text-small text-bold" style="margin-bottom:3px">Recent Changes</div>' + changes + '</div>' : ''}`;
}

function renderCompetitive(data) {
  if (!data.competitors || !data.competitors.length) { $('competitive-body').innerHTML = ''; return; }
  const cards = data.competitors.map(c => `<div class="competitor-card"><div class="competitor-header"><div class="competitor-name">${escapeHtml(c.name)}</div>${pill(c.threat, c.threat)}</div><div class="competitor-section-title">Strengths</div><ul class="competitor-list">${c.strengths.map(s => `<li>${escapeHtml(s)}</li>`).join('')}</ul><div class="competitor-section-title">Weaknesses</div><ul class="competitor-list">${c.weaknesses.map(w => `<li>${escapeHtml(w)}</li>`).join('')}</ul><div class="competitor-section-title">Our Response</div><div class="text-small text-muted" style="padding-left:2px">${escapeHtml(c.ourResponse)}</div></div>`).join('');
  const bcs = data.battleCards.map(b => `<div class="battle-card"><div class="battle-scenario">${escapeHtml(b.scenario)}</div><div class="battle-response">${escapeHtml(b.response)}</div></div>`).join('');
  $('competitive-body').innerHTML = `<div class="competitor-grid">${cards}</div>${bcs ? '<div class="text-small text-bold" style="margin-top:12px">Battle Cards</div>' + bcs : ''}`;
}

function renderStale(data) {
  $('stale-count').textContent = data.length;
  const nb = $('nav-stale-count'); if (nb) nb.textContent = data.length || '';
  if (!data.length) { $('stale-body').innerHTML = ''; return; }
  $('stale-body').innerHTML = data.map(i => `<div class="action-item"><div style="min-width:32px;text-align:center"><span class="text-red text-bold">${i.age}d</span></div><div class="action-item-content"><div class="action-item-title">${escapeHtml(i.title)}</div><div class="action-item-meta">${i.account ? escapeHtml(i.account) + ' &middot; ' : ''}${escapeHtml(i.reason)}</div><div class="action-item-meta text-small" style="margin-top:2px">${escapeHtml(i.suggestedAction)}</div></div></div>`).join('');
}

function renderTerritory(data) {
  if (!data.dealers || !data.dealers.length) { $('territory-body').innerHTML = ''; return; }
  const icons = { active: '&#9679;', 'at-risk': '&#9888;', watch: '&#9679;', prospect: '&#9734;' };
  $('territory-body').innerHTML = `<div style="margin-bottom:10px"><span class="text-small text-muted">${data.dealers.length} locations &middot; ${data.dealers.reduce((s, d) => s + d.sensors, 0)} sensors</span></div><div class="territory-grid">${data.dealers.map(d => `<div class="territory-card"><div class="territory-icon territory-icon-${d.status}">${icons[d.status] || '&#9679;'}</div><div class="territory-info"><div class="territory-name">${escapeHtml(d.name)}</div><div class="territory-city">${escapeHtml(d.city)}</div></div><div style="text-align:right">${pill(d.status, d.status === 'active' ? 'healthy' : d.status)}<div class="territory-sensors">${d.sensors > 0 ? d.sensors + ' sensors' : ''}</div></div></div>`).join('')}</div>`;
}

function renderEvents(data) {
  if ((!data.events || !data.events.length) && (!data.programs || !data.programs.length)) { $('events-body').innerHTML = ''; return; }
  const evts = (data.events || []).map(e => {
    const d = new Date(e.date), m = d.toLocaleString('en', { month: 'short' }).toUpperCase(), day = d.getDate();
    return `<div class="event-card"><div class="event-date-block"><div class="event-date-month">${m}</div><div class="event-date-day">${day}</div></div><div class="event-content"><div class="event-title">${escapeHtml(e.name)} ${pill(e.status, e.status === 'registered' ? 'active' : e.status === 'planning' ? 'planning' : 'watch')}</div><div class="event-meta">${escapeHtml(e.location)}${e.booth ? ' &middot; Booth' : ''} &middot; ${formatCurrency(e.budget)}</div>${e.notes ? '<div class="event-meta">' + escapeHtml(e.notes) + '</div>' : ''}</div></div>`;
  }).join('');
  const progs = (data.programs || []).map(p => {
    const tiers = p.tiers.length ? `<div class="program-tiers">${p.tiers.map(t => `<div class="program-tier">${t.threshold}: ${t.rebate}</div>`).join('')}</div>` : '';
    return `<div class="program-card"><div style="display:flex;justify-content:space-between;align-items:center"><div class="program-name">${escapeHtml(p.name)}</div>${pill(p.status, p.status)}</div><div class="program-desc">${escapeHtml(p.description)}</div><div class="text-small text-dim" style="margin-bottom:4px">${p.startDate} to ${p.endDate} &middot; ${formatCurrency(p.budget)}</div>${tiers}</div>`;
  }).join('');
  $('events-body').innerHTML = (evts ? '<div class="events-section-title">Events</div>' + evts : '') + (progs ? '<div class="events-section-title">Programs</div>' + progs : '');
}

// ── Server Persistence ───────────────────────────────────

async function saveJSON(filename, data) {
  try {
    const r = await fetch(`${DATA_BASE}/${filename}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await r.json();
    if (result.error) console.error(`Save ${filename}:`, result.error);
    return result;
  } catch (e) {
    console.error(`Save ${filename} failed:`, e.message);
    return null;
  }
}

// ── CRM Customers ────────────────────────────────────────

const PIPELINE_STAGES = ['Prospect', 'Aware', 'Onboarding', 'Installing', 'Engaged', 'Retention', 'Re-Engage'];

let customersData = [];

function saveCustomers() {
  saveJSON('customers.json', customersData);
}

function renderCRM(data) {
  customersData = data;

  const stageCounts = {};
  PIPELINE_STAGES.forEach(s => { stageCounts[s] = 0; });
  customersData.forEach(c => { if (stageCounts[c.stage] !== undefined) stageCounts[c.stage]++; });

  const stagesHtml = PIPELINE_STAGES.map(s => `
    <div class="crm-stage${stageCounts[s] > 0 ? ' active' : ''}">
      <div class="crm-stage-count">${stageCounts[s]}</div>
      <div class="crm-stage-label">${s}</div>
    </div>
  `).join('');

  const stageOptions = PIPELINE_STAGES.map(s => `<option value="${s}">${s}</option>`).join('');

  const rows = customersData.map((c, i) => `
    <tr>
      <td class="text-bold">${escapeHtml(c.name)}</td>
      <td class="text-muted">${escapeHtml(c.contact || '')}</td>
      <td class="text-muted text-small">${escapeHtml(c.type || '')}</td>
      <td>
        <select class="stage-select" data-action="stage-change" data-idx="${i}">
          ${PIPELINE_STAGES.map(s => `<option value="${s}"${s === c.stage ? ' selected' : ''}>${s}</option>`).join('')}
        </select>
      </td>
      <td class="text-right text-nowrap">${c.dealValue ? formatCurrency(c.dealValue) : '—'}</td>
      <td class="text-muted text-nowrap">${c.lastContact || '—'}</td>
      <td class="text-small">${escapeHtml(c.notes || '')}</td>
      <td class="text-center"><button class="btn-delete" data-action="delete-customer" data-idx="${i}" title="Delete">&#10005;</button></td>
    </tr>
  `).join('');

  $('customers-body').innerHTML = `
    <div class="crm-stages">${stagesHtml}</div>
    <div class="inline-form" id="customer-form">
      <div class="form-row">
        <div class="form-field"><label class="form-label">Name</label><input class="form-input" id="cf-name" placeholder="Company name"></div>
        <div class="form-field"><label class="form-label">Contact</label><input class="form-input" id="cf-contact" placeholder="Contact person"></div>
        <div class="form-field"><label class="form-label">Type</label><input class="form-input" id="cf-type" placeholder="e.g. Aquaculture"></div>
        <div class="form-field"><label class="form-label">Stage</label><select class="form-select" id="cf-stage">${stageOptions}</select></div>
        <div class="form-field"><label class="form-label">Deal Value</label><input class="form-input" id="cf-value" type="number" placeholder="0"></div>
        <div class="form-field" style="flex:0 0 auto">
          <label class="form-label">&nbsp;</label>
          <div style="display:flex;gap:6px">
            <button class="form-btn" data-action="add-customer">Add</button>
            <button class="form-btn form-btn-cancel" data-action="toggle-form" data-form="customer-form">Cancel</button>
          </div>
        </div>
      </div>
    </div>
    <table class="data-table">
      <thead><tr>
        <th>Customer</th><th>Contact</th><th>Type</th><th>Stage</th><th>Deal Value</th><th>Last Contact</th><th>Notes</th><th></th>
      </tr></thead>
      <tbody>${rows || '<tr><td colspan="8" class="text-muted">No customers yet. Click "+ Add Customer" to begin.</td></tr>'}</tbody>
    </table>
  `;
}

function toggleForm(formId) {
  const form = document.getElementById(formId);
  if (!form) return;
  if (form.style.display === 'block') {
    form.style.display = 'none';
  } else {
    form.style.display = 'block';
  }
}

function addCustomer() {
  const name = $('cf-name').value.trim();
  if (!name) return;
  customersData.push({
    name: name,
    contact: $('cf-contact').value.trim(),
    type: $('cf-type').value.trim(),
    stage: $('cf-stage').value,
    dealValue: parseFloat($('cf-value').value) || 0,
    lastContact: new Date().toISOString().slice(0, 10),
    notes: ''
  });
  saveCustomers();
  renderCRM(customersData);
}

// ── Team & Cap Table ─────────────────────────────────────

let teamData = { members: [], capTable: { authorized: 0, rounds: [] } };

function saveTeam() {
  saveJSON('team-cap-table.json', teamData);
}

function renderTeamCap(data) {
  teamData = data;

  const cap = teamData.capTable;
  const rounds = cap.rounds || [];
  const issuedShares = rounds.filter(r => r.status === 'issued' || r.status === 'reserved').reduce((s, r) => s + (r.shares || 0), 0);

  // Team table
  const memberRows = teamData.members.map((m, i) => `
    <tr>
      <td class="text-bold">${escapeHtml(m.name)}</td>
      <td>${escapeHtml(m.role)}</td>
      <td class="text-right">${m.equity != null ? m.equity + '%' : '—'}</td>
      <td class="text-muted text-nowrap">${m.startDate || '—'}</td>
      <td class="text-small text-muted">${escapeHtml(m.vesting || '')}</td>
      <td class="text-center"><button class="btn-delete" data-action="delete-member" data-idx="${i}" title="Delete">&#10005;</button></td>
    </tr>
  `).join('');

  // Cap table bar
  const colors = ['#22c55e', '#3b82f6', '#a855f7', '#eab308', '#f97316', '#ef4444', '#06b6d4'];
  const total = cap.authorized || 10000000;
  const barSegments = rounds.map((r, i) => {
    const pct = ((r.shares || r.targetShares || 0) / total * 100);
    if (pct < 0.5) return '';
    const isPlanned = r.status === 'planned';
    return `<div class="cap-bar-segment${isPlanned ? ' cap-bar-planned' : ''}" style="flex:${pct};background:${isPlanned ? 'transparent' : colors[i % colors.length]}" title="${r.name}: ${(r.shares || r.targetShares || 0).toLocaleString()} shares">${pct > 6 ? r.name : ''}</div>`;
  }).join('');

  // Rounds table — editable
  const statusOpts = ['issued', 'reserved', 'planned'];
  const roundRows = rounds.map((r, i) => {
    const valuation = r.price && r.shares ? formatCurrency(r.price * total) : r.targetValuation ? formatCurrency(r.targetValuation) : '—';
    const dilution = r.shares ? (r.shares / total * 100).toFixed(1) + '%' : r.targetShares ? (r.targetShares / total * 100).toFixed(1) + '%' : '—';
    return `
      <tr>
        <td><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${r.status === 'planned' ? 'transparent;border:2px dashed ' + colors[i % colors.length] : colors[i % colors.length]};margin-right:6px;vertical-align:middle"></span><input class="inline-edit" value="${escapeHtml(r.name)}" data-action="edit-round" data-idx="${i}" data-field="name"></td>
        <td class="text-right"><input class="inline-edit inline-edit-num" type="number" value="${r.shares || 0}" data-action="edit-round" data-idx="${i}" data-field="shares"></td>
        <td class="text-right"><input class="inline-edit inline-edit-num" type="number" step="0.0001" value="${r.price || ''}" placeholder="—" data-action="edit-round" data-idx="${i}" data-field="price"></td>
        <td class="text-right text-nowrap text-muted">${valuation}</td>
        <td class="text-right text-muted">${dilution}</td>
        <td><select class="stage-select" data-action="edit-round" data-idx="${i}" data-field="status">${statusOpts.map(s => `<option value="${s}"${s === r.status ? ' selected' : ''}>${s}</option>`).join('')}</select></td>
        <td class="text-right"><input class="inline-edit inline-edit-num" type="number" value="${r.targetRaise || ''}" placeholder="—" data-action="edit-round" data-idx="${i}" data-field="targetRaise"></td>
        <td class="text-center"><button class="btn-delete" data-action="delete-round" data-idx="${i}" title="Delete">&#10005;</button></td>
      </tr>
    `;
  }).join('');

  $('team-cap-body').innerHTML = `
    <div class="team-section-title">Team Members</div>
    <div class="inline-form" id="member-form">
      <div class="form-row">
        <div class="form-field"><label class="form-label">Name</label><input class="form-input" id="mf-name" placeholder="Full name"></div>
        <div class="form-field"><label class="form-label">Role</label><input class="form-input" id="mf-role" placeholder="e.g. CTO"></div>
        <div class="form-field" style="max-width:100px"><label class="form-label">Equity %</label><input class="form-input" id="mf-equity" type="number" step="0.1" placeholder="0"></div>
        <div class="form-field" style="max-width:140px"><label class="form-label">Start Date</label><input class="form-input" id="mf-date" type="date"></div>
        <div class="form-field"><label class="form-label">Vesting</label><input class="form-input" id="mf-vesting" placeholder="e.g. 4yr/1yr cliff"></div>
        <div class="form-field" style="flex:0 0 auto">
          <label class="form-label">&nbsp;</label>
          <div style="display:flex;gap:6px">
            <button class="form-btn" data-action="add-member">Add</button>
            <button class="form-btn form-btn-cancel" data-action="toggle-form" data-form="member-form">Cancel</button>
          </div>
        </div>
      </div>
    </div>
    <table class="data-table">
      <thead><tr>
        <th>Name</th><th>Role</th><th>Equity</th><th>Start Date</th><th>Vesting</th><th></th>
      </tr></thead>
      <tbody>${memberRows || '<tr><td colspan="6" class="text-muted">No team members yet.</td></tr>'}</tbody>
    </table>

    <div class="team-section-title" style="margin-top:24px">
      Cap Table — <input class="inline-edit inline-edit-num" type="number" value="${cap.authorized || 10000000}" data-action="edit-authorized" style="width:110px"> Authorized Shares
    </div>
    <div class="cap-bar-outer">${barSegments}</div>
    <div class="inline-form" id="round-form">
      <div class="form-row">
        <div class="form-field"><label class="form-label">Round Name</label><input class="form-input" id="rf-name" placeholder="e.g. Seed"></div>
        <div class="form-field" style="max-width:120px"><label class="form-label">Shares</label><input class="form-input" id="rf-shares" type="number" placeholder="0"></div>
        <div class="form-field" style="max-width:100px"><label class="form-label">Price/Share</label><input class="form-input" id="rf-price" type="number" step="0.0001" placeholder="0"></div>
        <div class="form-field" style="max-width:100px"><label class="form-label">Status</label><select class="form-select" id="rf-status"><option value="planned">planned</option><option value="reserved">reserved</option><option value="issued">issued</option></select></div>
        <div class="form-field" style="max-width:120px"><label class="form-label">Target Raise</label><input class="form-input" id="rf-raise" type="number" placeholder="0"></div>
        <div class="form-field" style="flex:0 0 auto"><label class="form-label">&nbsp;</label><div style="display:flex;gap:6px"><button class="form-btn" data-action="add-round">Add</button><button class="form-btn form-btn-cancel" data-action="toggle-form" data-form="round-form">Cancel</button></div></div>
      </div>
    </div>
    <table class="data-table">
      <thead><tr>
        <th>Round</th><th>Shares</th><th>Price/Share</th><th>Valuation</th><th>Ownership</th><th>Status</th><th>Target Raise</th><th></th>
      </tr></thead>
      <tbody>${roundRows}</tbody>
    </table>
  `;
}

function addMember() {
  const name = $('mf-name').value.trim();
  if (!name) return;
  const role = $('mf-role').value.trim();
  const equity = parseFloat($('mf-equity').value) || 0;
  const startDate = $('mf-date').value || new Date().toISOString().slice(0, 10);
  const vesting = $('mf-vesting').value.trim();

  teamData.members.push({ name, role, equity, startDate, vesting });
  saveTeam();

  // Also write a Knowledge/People/Team profile markdown file
  const filename = name.replace(/[^a-zA-Z0-9]/g, '-').replace(/-+/g, '-');
  const md = `# ${name}\n\n## Role\n${role || 'TBD'}\n\n## Equity\n${equity}%\n\n## Start Date\n${startDate}\n\n## Vesting\n${vesting || 'TBD'}\n`;
  fetch('/api/exec', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ command: `mkdir -p Knowledge/People/Team && cat > "Knowledge/People/Team/${filename}.md" << 'PROFILE'\n${md}PROFILE` })
  }).catch(() => {});

  renderTeamCap(teamData);
}

function deleteMember(idx) {
  if (idx >= 0 && idx < teamData.members.length) {
    teamData.members.splice(idx, 1);
    saveTeam();
    renderTeamCap(teamData);
  }
}

function editRound(idx, field, value) {
  if (idx >= 0 && idx < teamData.capTable.rounds.length) {
    if (field === 'shares' || field === 'targetRaise') {
      teamData.capTable.rounds[idx][field] = parseInt(value) || 0;
    } else if (field === 'price') {
      teamData.capTable.rounds[idx][field] = parseFloat(value) || null;
    } else {
      teamData.capTable.rounds[idx][field] = value;
    }
    saveTeam();
    renderTeamCap(teamData);
  }
}

function deleteRound(idx) {
  if (idx >= 0 && idx < teamData.capTable.rounds.length) {
    teamData.capTable.rounds.splice(idx, 1);
    saveTeam();
    renderTeamCap(teamData);
  }
}

function addRound() {
  const name = $('rf-name').value.trim();
  if (!name) return;
  teamData.capTable.rounds.push({
    name: name,
    shares: parseInt($('rf-shares').value) || 0,
    price: parseFloat($('rf-price').value) || null,
    status: $('rf-status').value,
    targetRaise: parseInt($('rf-raise').value) || null,
    targetValuation: null,
    targetShares: null
  });
  saveTeam();
  renderTeamCap(teamData);
}

function editAuthorized(value) {
  teamData.capTable.authorized = parseInt(value) || 10000000;
  saveTeam();
  renderTeamCap(teamData);
}

// ── Navigation ────────────────────────────────────────────

function setupNav() {
  const links = document.querySelectorAll('.nav-link');
  const sections = [];

  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      const el = document.querySelector(href);
      if (el) sections.push({ link, el });
    }
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        const match = sections.find(s => s.el === entry.target);
        if (match) match.link.classList.add('active');
      }
    });
  }, { rootMargin: '-80px 0px -70% 0px' });

  sections.forEach(s => observer.observe(s.el));
}

// ── Load All Data ─────────────────────────────────────────

async function loadDashboard() {
  const now = new Date();
  $('header-date').textContent = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  const files = {
    action: 'needs-action-today.json', accounts: 'top-accounts.json',
    agenda: 'todays-agenda.json', calls: 'dealer-calls.json',
    initiatives: 'active-initiatives.json', pipeline: 'pipeline-snapshot.json',
    spa: 'spa-alerts.json', health: 'dealer-health.json',
    loops: 'open-loops.json', forecast: 'forecast.json',
    products: 'products-pricing.json', competitive: 'competitive-intel.json',
    stale: 'stale-items.json', territory: 'territory-map.json',
    events: 'events-programs.json', customers: 'customers.json',
    teamCap: 'team-cap-table.json'
  };

  const results = {};
  await Promise.all(Object.entries(files).map(async ([k, f]) => {
    try { results[k] = await fetchJSON(f); } catch (e) { results[k] = null; }
  }));

  if (results.action) renderNeedsAction(results.action);
  if (results.accounts) renderTopAccounts(results.accounts);
  if (results.agenda) renderAgenda(results.agenda);
  if (results.calls) renderDealerCalls(results.calls);
  if (results.initiatives) renderInitiatives(results.initiatives);
  if (results.pipeline) renderPipeline(results.pipeline);
  if (results.spa) renderSPAAlerts(results.spa);
  if (results.health) renderDealerHealth(results.health);
  if (results.loops) renderOpenLoops(results.loops);
  if (results.forecast) renderForecast(results.forecast);
  if (results.products) renderProducts(results.products);
  if (results.competitive) renderCompetitive(results.competitive);
  if (results.stale) renderStale(results.stale);
  if (results.territory) renderTerritory(results.territory);
  if (results.events) renderEvents(results.events);
  if (results.customers) renderCRM(results.customers);
  if (results.teamCap) renderTeamCap(results.teamCap);

}

// ── Event Delegation (iOS-safe: touchend + click) ────────

function handleAction(e) {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;
  const action = btn.dataset.action;
  const idx = parseInt(btn.dataset.idx);

  switch (action) {
    case 'delete-customer':
      if (idx >= 0 && idx < customersData.length) { customersData.splice(idx, 1); saveCustomers(); renderCRM(customersData); }
      break;
    case 'delete-member':
      if (idx >= 0 && idx < teamData.members.length) { teamData.members.splice(idx, 1); saveTeam(); renderTeamCap(teamData); }
      break;
    case 'delete-round':
      if (idx >= 0 && idx < teamData.capTable.rounds.length) { teamData.capTable.rounds.splice(idx, 1); saveTeam(); renderTeamCap(teamData); }
      break;
    case 'add-customer': addCustomer(); break;
    case 'add-member': addMember(); break;
    case 'add-round': addRound(); break;
    case 'toggle-form': toggleForm(btn.dataset.form); break;
  }
}
document.addEventListener('click', handleAction);

document.addEventListener('change', function(e) {
  const el = e.target.closest('[data-action]');
  if (!el) return;
  const action = el.dataset.action;
  const idx = parseInt(el.dataset.idx);

  if (action === 'stage-change' && customersData[idx]) {
    customersData[idx].stage = el.value;
    customersData[idx].lastContact = new Date().toISOString().slice(0, 10);
    saveCustomers();
    renderCRM(customersData);
  } else if (action === 'edit-round' && teamData.capTable.rounds[idx]) {
    const field = el.dataset.field;
    const val = el.value;
    if (field === 'shares' || field === 'targetRaise') teamData.capTable.rounds[idx][field] = parseInt(val) || 0;
    else if (field === 'price') teamData.capTable.rounds[idx][field] = parseFloat(val) || null;
    else teamData.capTable.rounds[idx][field] = val;
    saveTeam();
    renderTeamCap(teamData);
  } else if (action === 'edit-authorized') {
    teamData.capTable.authorized = parseInt(el.value) || 10000000;
    saveTeam();
    renderTeamCap(teamData);
  }
});

// Refresh button
var _r = $('btn-refresh'); if (_r) _r.onclick = loadDashboard;

// ── Init ──────────────────────────────────────────────────
try { setupSidebar(); } catch (e) { console.warn('Sidebar:', e); }
try { setupTerminal(); } catch (e) { console.warn('Terminal:', e); }
loadDashboard();
