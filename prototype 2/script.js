const uploadSlider = document.getElementById('upload-speed');
const downloadSlider = document.getElementById('download-speed');

const uploadVal = document.getElementById('upload-val');
const downloadVal = document.getElementById('download-val');

uploadSlider.addEventListener('input', () => {
  uploadVal.textContent = uploadSlider.value + ' Mbps';
});

downloadSlider.addEventListener('input', () => {
  downloadVal.textContent = downloadSlider.value + ' Mbps';
});

function bindToggle(groupId){

  const group = document.getElementById(groupId);

  group.querySelectorAll('.toggle-opt').forEach(opt => {

    opt.addEventListener('click', () => {

      group.querySelectorAll('.toggle-opt')
      .forEach(o => o.classList.remove('active'));

      opt.classList.add('active');

    });

  });

}

[
  'sensitivity',
  'remote-access',
  'it-staff',
  'external-share',
  'compliance'
].forEach(bindToggle);

function getToggle(groupId){

  const active = document.querySelector(
    '#' + groupId + ' .toggle-opt.active'
  );

  return active ? active.dataset.val : '';

}

function analyze(){

  const sensitivity = getToggle('sensitivity');
  const remoteAccess = getToggle('remote-access');
  const compliance = getToggle('compliance');

  let recommendation = '';
  let summary = '';
  let badgeClass = '';

  if(
    sensitivity === 'critical' ||
    compliance === 'strict'
  ){

    recommendation = '🖥 On-Premise Recommended';
    badgeClass = 'badge-onprem';

    summary =
      'Your organization prioritizes direct data control, strict compliance, and stronger privacy governance.';

  }
  else if(remoteAccess === 'yes'){

    recommendation = '☁ Cloud Storage Recommended';
    badgeClass = 'badge-cloud';

    summary =
      'Your organization benefits from remote accessibility, collaboration, and scalable infrastructure.';

  }
  else{

    recommendation = '⇄ Hybrid Approach Recommended';
    badgeClass = 'badge-hybrid';

    summary =
      'A hybrid infrastructure balances security, accessibility, and operational flexibility.';

  }

  document.getElementById('result-badge').textContent =
    recommendation;

  document.getElementById('result-badge').className =
    'result-badge ' + badgeClass;

  document.getElementById('result-summary').textContent =
    summary;

  document.getElementById('score-grid').innerHTML = `
    <div class="score-item">
      <div class="s-label">Accessibility</div>

      <div class="bar-row">
        <span class="bar-tag">Cloud</span>

        <div class="bar-track">
          <div
            class="bar-fill"
            style="width:92%;background:var(--cloud)"
          ></div>
        </div>

        <span class="bar-num">92</span>
      </div>

      <div class="score-verdict">
        Cloud infrastructure excels in remote access and distributed collaboration.
      </div>
    </div>

    <div class="score-item">
      <div class="s-label">Privacy Control</div>

      <div class="bar-row">
        <span class="bar-tag">On-Prem</span>

        <div class="bar-track">
          <div
            class="bar-fill"
            style="width:95%;background:var(--onprem)"
          ></div>
        </div>

        <span class="bar-num">95</span>
      </div>

      <div class="score-verdict">
        On-premise systems provide stronger direct governance and local control.
      </div>
    </div>
  `;

  document.getElementById('sec-note-text').textContent =
    'Research findings indicate that cloud platforms provide accessibility advantages, while on-premise infrastructure maintains stronger direct data governance and revocation control.';

  document.getElementById('risk-list').innerHTML = `
    <div class="risk-item">
      ⚠ Public link sharing may increase exposure risks in cloud environments.
    </div>

    <div class="risk-item">
      ⚠ Strict compliance environments require stronger governance policies.
    </div>
  `;

  document.getElementById('findings-list').innerHTML = `
    <div class="finding-item">
      ✓ Your organization profile suggests balanced operational scalability.
    </div>

    <div class="finding-item">
      ✓ Infrastructure performance depends heavily on network conditions and accessibility requirements.
    </div>
  `;

  document.getElementById('ref-note').textContent =
    'Sources: Aledon, Ballares & Ronde (2026), Hoang & Kim (2021), Rittinghouse & Ransome (2016), Itoo et al. (2024).';

  document.getElementById('placeholder').style.display = 'none';

  document.getElementById('result-panel')
    .classList.add('show');

  document.getElementById('result-panel')
    .scrollIntoView({
      behavior:'smooth'
    });

}