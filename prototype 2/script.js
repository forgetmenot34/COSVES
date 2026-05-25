/* ============================================================
   Storage Decision Support System — Application Logic
   Aledon, Ballares & Ronde (2026) · USJ-R Research Prototype
   ============================================================ */

/* ── Slider live readouts ─────────────────────────────────── */
const uploadSlider   = document.getElementById('upload-speed');
const downloadSlider = document.getElementById('download-speed');
const uploadVal      = document.getElementById('upload-val');
const downloadVal    = document.getElementById('download-val');

uploadSlider.addEventListener('input',   () => uploadVal.textContent   = uploadSlider.value   + ' Mbps');
downloadSlider.addEventListener('input', () => downloadVal.textContent = downloadSlider.value + ' Mbps');

/* ── Toggle-button groups ─────────────────────────────────── */
function bindToggle(groupId) {
  const group = document.getElementById(groupId);
  group.querySelectorAll('.toggle-opt').forEach(opt => {
    opt.addEventListener('click', () => {
      group.querySelectorAll('.toggle-opt').forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
    });
  });
}

['sensitivity', 'remote-access', 'it-staff', 'external-share', 'compliance'].forEach(bindToggle);

/* Helper: get the active value of a toggle group */
function getToggle(groupId) {
  const active = document.querySelector('#' + groupId + ' .toggle-opt.active');
  return active ? active.dataset.val : '';
}

/* ── Main analysis function ───────────────────────────────── */
function analyze() {

  /* --- Read inputs --- */
  const upload       = parseInt(uploadSlider.value);
  const download     = parseInt(downloadSlider.value);
  const orgType      = document.getElementById('org-type').value;
  const fileSize     = document.getElementById('file-size').value;
  const sensitivity  = getToggle('sensitivity');
  const remoteAccess = getToggle('remote-access');
  const itStaff      = getToggle('it-staff');
  const extShare     = getToggle('external-share');
  const budget       = document.getElementById('budget').value;
  const compliance   = getToggle('compliance');

  /* --- Scoring: cs = cloud score, op = on-premise score --- */
  let cs = 0, op = 0;

  // Speed vs. file-size suitability
  if (upload >= 50)   cs += 2; else op += 2;
  if (download >= 100) cs += 1; else op += 2;

  if (fileSize === 'small')        cs += 2;
  else if (fileSize === 'medium')  { cs += 1; op += 1; }
  else if (fileSize === 'large')   op += 2;
  else /* xlarge */                op += 3;

  // Data sensitivity (core privacy weighting)
  if (sensitivity === 'low')       cs += 2;
  else if (sensitivity === 'medium') { cs += 1; op += 1; }
  else if (sensitivity === 'high') op += 2;
  else /* critical */              op += 4;

  // External sharing raises cloud public-exposure risk
  if (extShare === 'often')        { cs += 1; op += 1; }
  else if (extShare === 'never')   op += 1;

  // Remote access need
  if (remoteAccess === 'yes') cs += 3; else op += 2;

  // IT staff availability
  if (itStaff === 'none')          cs += 3;
  else if (itStaff === 'limited')  { cs += 1; op += 1; }
  else /* full */                  op += 2;

  // Budget
  if (budget === 'minimal')        cs += 3;
  else if (budget === 'moderate')  { cs += 1; op += 1; }
  else /* high */                  op += 2;

  // Compliance requirements
  if (compliance === 'none')       cs += 1;
  else if (compliance === 'moderate') { cs += 1; op += 1; }
  else /* strict */                op += 3;

  // Organisation-type bonus
  if (['healthcare', 'gov'].includes(orgType)) op += 2;
  else if (orgType === 'small')    cs += 2;
  else if (orgType === 'academic') cs += 1;

  const total = cs + op;
  const diff  = cs - op;

  /* --- Recommendation --- */
  let rec, badgeClass, summary;

  if (diff >= 5) {
    rec        = '☁  Cloud Storage Recommended';
    badgeClass = 'badge-cloud';
    summary    = 'Cloud storage is better aligned with your organizational profile. Your connectivity level, team structure, and budget favor the scalability and remote accessibility that platforms like Google Drive provide. Manage the identified privacy risks (see below) through strict sharing policies.';
  } else if (diff <= -5) {
    rec        = '🖥  On-Premise Server Recommended';
    badgeClass = 'badge-onprem';
    summary    = 'An on-premise server is the stronger fit for your organization. Your sensitivity level, compliance needs, and available IT staff support local infrastructure — which our research demonstrated provides stronger direct data control, instant access revocation, and zero public exposure risk.';
  } else {
    rec        = '⇄  Hybrid Approach Recommended';
    badgeClass = 'badge-hybrid';
    summary    = 'Your profile sits between both models. Use on-premise storage for sensitive or regulated data where direct control matters, and cloud storage for accessible collaboration. This approach leverages the strengths of both systems as identified in the research.';
  }

  /* --- Score bars --- */
  const sensitivityIndex = { low: 0, medium: 1, high: 2, critical: 3 };
  const si = sensitivityIndex[sensitivity] || 0;

  const scores = [
    {
      label: 'Transfer performance',
      c: upload >= 100 ? 70 : upload >= 50 ? 50 : 25,
      o: upload < 50 ? 90 : 65,
      note: 'Research: 100MB upload — Cloud avg 41s, On-Prem avg 1.5s. 500MB — Cloud 100s, On-Prem 5.8s.'
    },
    {
      label: 'Privacy & data control',
      c: [70, 55, 30, 15][si],
      o: [60, 75, 88, 96][si],
      note: 'On-premise showed zero public exposure risk; cloud allowed publicly accessible links in testing.'
    },
    {
      label: 'Security management',
      c: itStaff === 'none' ? 75 : 65,
      o: itStaff === 'full' ? 90 : itStaff === 'limited' ? 70 : 45,
      note: 'Both systems passed authentication and access control tests. On-premise revoked access instantly; cloud had synchronization delay.'
    },
    {
      label: 'Accessibility & collab.',
      c: remoteAccess === 'yes' ? 92 : 55,
      o: remoteAccess === 'yes' ? 35 : 80,
      note: 'Cloud provides built-in remote accessibility and collaboration features not available in basic on-premise setup.'
    }
  ];

  document.getElementById('score-grid').innerHTML = scores.map(s => `
    <div class="score-item">
      <div class="s-label">${s.label}</div>
      <div class="bar-pair">
        <div class="bar-row">
          <span class="bar-tag">Cloud</span>
          <div class="bar-track">
  <div class="bar-fill" style="width:${s.c}%; background:${s.c >= 75 ? 'linear-gradient(90deg,#0b4650,#1a8060)' : s.c >= 55 ? 'linear-gradient(90deg,#1a7a4a,#27ae60)' : s.c >= 35 ? 'linear-gradient(90deg,#d4a017,#e6c319)' : 'linear-gradient(90deg,#c0392b,#e74c3c)'}"></div>
</div>
<span class="bar-num">${s.c}</span>
        </div>
        <div class="bar-row">
          <span class="bar-tag">On-prem</span>
         <div class="bar-track">
  <div class="bar-fill" style="width:${s.o}%; background:${s.o >= 75 ? 'linear-gradient(90deg,#0b4650,#1a8060)' : s.o >= 55 ? 'linear-gradient(90deg,#1a7a4a,#27ae60)' : s.o >= 35 ? 'linear-gradient(90deg,#d4a017,#e6c319)' : 'linear-gradient(90deg,#c0392b,#e74c3c)'}"></div>
</div>
<span class="bar-num">${s.o}</span>
        </div>
      </div>
      <div class="score-verdict">
        ${s.c > s.o ? '→ Cloud leads' : s.o > s.c ? '→ On-prem leads' : '→ Comparable'} · ${s.note}
      </div>
    </div>
  `).join('');

  /* --- Contextual security note --- */
  let secNote;

  if (sensitivity === 'high' || sensitivity === 'critical') {
    secNote = '⚠ Your HIGH sensitivity data requires careful attention to the public exposure risk found in cloud testing. The research recorded that Google Drive files could be set to publicly accessible via link sharing. On-premise had no such exposure within the local network. For critical data, the instant revocation and zero public exposure of on-premise is strongly preferred.';
  } else if (extShare === 'often' && (sensitivity === 'medium' || sensitivity === 'high')) {
    secNote = '⚠ You indicated frequent external sharing. The research found that Google Drive\'s public link-sharing configuration created a privacy exposure risk, and permission revocation had a synchronization delay. Implement strict sharing policies and audit link permissions regularly if using cloud.';
  } else if (compliance === 'strict') {
    secNote = '⚠ Strict regulatory compliance (e.g., HIPAA, GDPR) requires full data control. The research found cloud storage introduces third-party handling and public exposure risks that may conflict with strict compliance mandates. On-premise provides direct governance over all data.';
  } else {
    secNote = 'Both systems passed core authentication and access control tests in the research. Key differentiator: cloud showed a public link exposure risk and revocation delay; on-premise provided instant control with no external exposure.';
  }

  document.getElementById('sec-note-text').textContent = secNote;

  /* --- Privacy risk list (profile-specific) --- */
  const risks = [];

  if (extShare === 'often' || extShare === 'sometimes') {
    risks.push({
      level: 'rd-high',
      text: 'PUBLIC EXPOSURE RISK (Cloud) — Research confirmed Google Drive files can be made publicly accessible through link-sharing configurations. With frequent external sharing, this risk is elevated. On-premise had no public exposure in testing.'
    });
  }

  if (sensitivity === 'high' || sensitivity === 'critical') {
    risks.push({
      level: 'rd-high',
      text: 'DATA CONTROL RISK (Cloud) — High-sensitivity data stored with a third-party provider reduces direct governance. Rittinghouse & Ransome (2016) note on-premise provides full organizational control over sensitive data.'
    });
  }

  risks.push({
    level: 'rd-med',
    text: 'REVOCATION DELAY (Cloud) — The research observed a synchronization delay between when access was revoked and when the restriction was enforced in Google Drive. On-premise applied revocation instantly with no delay.'
  });

  if (itStaff === 'none' || itStaff === 'limited') {
    risks.push({
      level: 'rd-med',
      text: 'MAINTENANCE RISK (On-Premise) — On-premise security depends entirely on internal IT practices. With limited staff, security patches, access audits, and backup management may be inconsistent (Rittinghouse & Ransome, 2016).'
    });
  }

  risks.push({
    level: 'rd-low',
    text: 'AUTHENTICATION (Both) — Both systems required valid credentials and blocked incorrect login attempts in all test trials. Neither system allowed login bypass during testing.'
  });

  risks.push({
    level: 'rd-low',
    text: 'RECOVERY (On-Premise advantage) — On-premise successfully recovered deleted files in testing; Google Drive did not restore files in the same recovery test. For data integrity, on-premise holds an advantage.'
  });

  if (compliance === 'strict') {
    risks.push({
      level: 'rd-high',
      text: 'COMPLIANCE RISK (Cloud) — Third-party data handling in cloud systems may conflict with HIPAA, GDPR, or sector-specific data residency requirements. Itoo et al. (2024) emphasize the need for GDPR-compliant architectures with explicit data control policies.'
    });
  }

  document.getElementById('risk-list').innerHTML = risks.map(r => `
    <div class="risk-item">
      <div class="risk-dot ${r.level}">
        ${r.level === 'rd-high' ? '!' : r.level === 'rd-med' ? '~' : '✓'}
      </div>
      <span>${r.text}</span>
    </div>
  `).join('');

  /* --- Operational findings --- */
  const findings = [];

  if (upload < 20) {
    findings.push({
      icon: 'fi-con',
      text: `Your upload speed (${upload} Mbps) is low. Research recorded cloud upload of 100 MB averaging 41 seconds on a stable connection — at lower speeds this will be significantly slower. On-premise achieved the same transfer in 1.5 seconds locally.`
    });
  } else {
    findings.push({
      icon: 'fi-note',
      text: `Your upload speed (${upload} Mbps) supports cloud operations for ${fileSize === 'small' ? 'small' : fileSize === 'medium' ? 'medium' : 'larger'} files, though on-premise will always be faster within the local network (research: 27× faster for 100 MB).`
    });
  }

  if (remoteAccess === 'yes') {
    findings.push({
      icon: 'fi-pro',
      text: 'Remote access is needed. Cloud storage provides this natively. On-premise requires additional configuration (VPN, port forwarding) to enable remote access securely.'
    });
  } else {
    findings.push({
      icon: 'fi-pro',
      text: 'No remote access needed. On-premise performs best in purely local environments — local network transfers remove all internet dependency, giving the speed advantage found in research testing.'
    });
  }

  if (budget === 'minimal') {
    findings.push({
      icon: 'fi-pro',
      text: 'Minimal budget favors cloud — subscription-based pricing avoids hardware capital expenditure. On-premise requires upfront hardware, maintenance costs, and IT personnel (Alharthi & Goodwin, 2023).'
    });
  } else if (budget === 'high') {
    findings.push({
      icon: 'fi-pro',
      text: 'Your budget supports on-premise infrastructure investment. This covers hardware, network setup, and IT staff — unlocking the stronger privacy control and performance advantages found in the research.'
    });
  }

  const differentiator =
    diff >= 5
      ? "cloud's accessibility and lower cost outweigh the privacy trade-offs at your sensitivity level."
      : diff <= -5
        ? "on-premise's direct data control and instant revocation are critical at your sensitivity level."
        : "neither system dominates — a hybrid approach manages the trade-offs best.";

  findings.push({
    icon: 'fi-note',
    text: `Both systems enforced access control and blocked unauthorized access in all research test trials. The key differentiator for your profile is: ${differentiator}`
  });

  document.getElementById('findings-list').innerHTML = findings.map(f => `
    <div class="finding-item">
      <div class="finding-icon ${f.icon}">
        ${f.icon === 'fi-pro' ? '✓' : f.icon === 'fi-con' ? '!' : '↗'}
      </div>
      <span>${f.text}</span>
    </div>
  `).join('');

  /* --- Reference note --- */
  document.getElementById('ref-note').textContent =
    'Sources: Aledon, Ballares & Ronde (2026) — USJ-R Research Paper; Alharthi & Goodwin (2023); Rittinghouse & Ransome (2016); Hoang & Kim (2021); Itoo et al. (2024). All security test results are from the paper\'s experimental findings.';

  /* --- Update recommendation badge & summary --- */
  document.getElementById('result-badge').textContent  = rec;
  document.getElementById('result-badge').className    = 'result-badge ' + badgeClass;
  document.getElementById('result-summary').textContent = summary;

  /* --- Show result panel --- */
  document.getElementById('placeholder').style.display = 'none';
  const rp = document.getElementById('result-panel');
  rp.classList.add('show');
  rp.scrollIntoView({ behavior: 'smooth', block: 'start' });
}