export const person = {
  name: 'Tanvir Ahmed Aadeef',
  role: 'Detection engineer',
  place: 'Melbourne',
  email: 't.ahmedaadeef@gmail.com',
  linkedin: 'https://www.linkedin.com/in/tanvir-ahmed-aadeef/',
  github: 'https://github.com/SyntheticSovereign',
  scholar: 'https://scholar.google.com/citations?user=YSsWnuUAAAAJ',
  resume: '/Tanvir-Ahmed-Aadeef-Resume.pdf',
  lede:
    'I write detections, attack them with adversary emulation, and keep only what fires. Elastic, Splunk and Sentinel, mapped to MITRE ATT&CK.',
};

export const counters = [
  { value: '150+', label: 'detection rules written in Elastic Security' },
  { value: '222', label: 'OpenAEV attack actions built' },
  { value: '158', label: 'injects in one threat-actor exercise' },
  { value: '155', label: 'KQL queries in the Azure SOC lab' },
];

export type Severity = 'high' | 'medium' | 'low';
export type Verdict = 'detected' | 'blocked' | 'validated';

export interface Alert {
  technique: string;
  title: string;
  source: string;
  severity: Severity;
  verdict: Verdict;
  host: string;
  detail: string;
  caseSlug: string;
}

export const alerts: Alert[] = [
  {
    technique: 'T1059.001',
    title: 'PowerShell launched from WindowsApps',
    source: 'Defender for Endpoint',
    severity: 'high',
    verdict: 'detected',
    host: 'WIN-EP-04',
    detail: 'Hunting query for a FIN7 execution pattern: PowerShell running out of the WindowsApps folder.',
    caseSlug: 'azure-soc',
  },
  {
    technique: 'T1059',
    title: 'Hades Interitus inject chain started',
    source: 'OpenAEV → Elastic',
    severity: 'high',
    verdict: 'validated',
    host: 'TRINITY-WIN-01',
    detail: 'A 158-inject threat-actor scenario run against Windows endpoints, each inject checked against the alert it should raise.',
    caseSlug: 'trinity',
  },
  {
    technique: 'T1562.001',
    title: 'Microsoft Defender disabled',
    source: 'Defender for Endpoint',
    severity: 'high',
    verdict: 'detected',
    host: 'WIN-EP-02',
    detail: 'Detection for an attacker turning off endpoint protection before the payload runs.',
    caseSlug: 'azure-soc',
  },
  {
    technique: 'AML.T0051',
    title: 'Prompt injection stopped at the gateway',
    source: 'Aegis Ward',
    severity: 'medium',
    verdict: 'blocked',
    host: 'LLM-GW-01',
    detail: 'Policy enforcement in front of a locally hosted model, tested with a 20-technique MITRE ATLAS pack.',
    caseSlug: 'aegis-ward',
  },
  {
    technique: 'T1219',
    title: 'NetSupport RAT on an endpoint',
    source: 'Defender for Endpoint',
    severity: 'high',
    verdict: 'detected',
    host: 'WIN-EP-07',
    detail: 'Remote access tool detection modelled on FIN7 tradecraft.',
    caseSlug: 'azure-soc',
  },
  {
    technique: 'T1027.010',
    title: 'Encoded PowerShell command',
    source: 'Microsoft Sentinel',
    severity: 'medium',
    verdict: 'detected',
    host: 'WIN-EP-03',
    detail: 'KQL rule that finds base64-encoded PowerShell and decodes it for the analyst.',
    caseSlug: 'azure-soc',
  },
  {
    technique: 'T1071',
    title: 'Solorigate network beacon',
    source: 'Microsoft Sentinel',
    severity: 'high',
    verdict: 'detected',
    host: 'SRV-DC-01',
    detail: 'Incidents 01003 and 01005: command-and-control beaconing, triaged and written up as case files.',
    caseSlug: 'azure-soc',
  },
  {
    technique: 'T1204.002',
    title: 'XWorm loader from invoice.pdf.js',
    source: 'ANY.RUN → Sentinel',
    severity: 'high',
    verdict: 'detected',
    host: 'WIN-EP-05',
    detail: 'Incident 03005: a JavaScript loader dropping the XWorm RAT, detonated in ANY.RUN and pivoted back into Sentinel.',
    caseSlug: 'azure-soc',
  },
  {
    technique: 'T1127.001',
    title: 'MSBuild making a network connection',
    source: 'Defender for Endpoint',
    severity: 'medium',
    verdict: 'detected',
    host: 'WIN-EP-06',
    detail: 'Trusted developer utility used to proxy execution and call out.',
    caseSlug: 'azure-soc',
  },
  {
    technique: 'T1566',
    title: 'Phishing email triaged by Cerebro',
    source: 'Copilot Studio',
    severity: 'low',
    verdict: 'detected',
    host: 'MAIL-01',
    detail: 'An AI assistant that analyses suspicious emails and logs, checks IP and domain reputation and suggests a playbook.',
    caseSlug: 'cerebro',
  },
  {
    technique: 'T1543',
    title: 'Azure Arc persistence',
    source: 'Defender for Endpoint',
    severity: 'medium',
    verdict: 'detected',
    host: 'SRV-ARC-01',
    detail: 'Detection modelled on Peach Sandstorm using Azure Arc to keep access.',
    caseSlug: 'azure-soc',
  },
  {
    technique: 'T1499',
    title: 'Pod killed by Chaos Mesh, service recovered',
    source: 'Hubble · Tetragon',
    severity: 'low',
    verdict: 'validated',
    host: 'K3S-NODE-02',
    detail: 'Controlled chaos experiments on K3s, watched through Cilium Hubble flows and Tetragon eBPF events.',
    caseSlug: 'trinity',
  },
];

export const profile = {
  paragraphs: [
    "Most detections get written once and trusted forever. Mine get attacked. I build the rule, run the real technique against it, and watch what the SIEM actually sees. If it stays quiet, that's a gap I close before an adversary finds it.",
    'At Triskele Labs I wrote more than 150 Elastic Security rules mapped to MITRE ATT&CK and ran purple-team exercises in OpenAEV. At home I run Project Trinity, my own security operations centre with three SIEMs, threat intelligence, case management and a gateway that protects AI models from attack.',
    'Before my Master of Cybersecurity at La Trobe, I studied computer science in Dhaka and spent two years researching how blockchain can make systems more secure and transparent, work published in two IEEE conference papers.',
  ],
  offClock:
    'Gaming, mostly Counter-Strike, New World and Enshrouded. Away from the screen I love sightseeing, and Melbourne keeps giving me new places to explore.',
};

export interface PathEntry {
  when: string;
  title: string;
  where: string;
  text: string;
}

export const method: { step: string; title: string; text: string }[] = [
  { step: '01', title: 'Study the adversary', text: 'Start from real threat intelligence in OpenCTI and the MITRE ATT&CK techniques an actor actually uses.' },
  { step: '02', title: 'Write the detection', text: 'Rules as code in Git, mapped to ATT&CK and checked by CI before they reach a SIEM.' },
  { step: '03', title: 'Run the attack', text: 'Emulate the technique on a real endpoint with OpenAEV, Atomic Red Team or a hand-written command.' },
  { step: '04', title: 'Prove it, or fix it', text: 'Line the attack up against the telemetry and the alert. If it stayed quiet or fired late, tune and run it again.' },
];

export const community: { title: string; where: string; when: string; text: string }[] = [
  {
    title: 'Professional memberships',
    where: 'ACS · ISACA · AISA',
    when: 'Member',
    text: 'Member of the Australian Computer Society, ISACA and the Australian Information Security Association, to stay close to the people and standards shaping security in Australia.',
  },
  {
    title: 'Mentor, Sustainability and Innovation Immersion Day',
    where: 'La Trobe University · Nangak Tamboree Wildlife Sanctuary',
    when: 'Oct 2026',
    text: 'Coached Year 10 to 12 students through design thinking, from user needs to a final pitch. The team I mentored won.',
  },
  {
    title: 'Australian Cyber Security Games 2025',
    where: 'Cyber Security Education Australia (CySEA)',
    when: 'Jul 2025',
    text: 'Competed in the national capture-the-flag, solving hands-on attack and defence challenges against the clock.',
  },
  {
    title: 'Student Representative Committee member',
    where: 'SCEMS Student Engagement and Employability, La Trobe',
    when: '2025',
    text: 'Chosen for the school’s student committee on engagement and employability, giving student feedback on career readiness and belonging for 2025 and 2026.',
  },
  {
    title: 'Deloitte x ServiceNow Challenge',
    where: 'La Trobe Bendigo, with Bendigo Bank',
    when: '2025',
    text: 'Designed fraud detection for the Bendigo Bank app on the ServiceNow platform, with Deloitte and ServiceNow mentors.',
  },
  {
    title: 'Cyber BlueCon threat hunting workshop',
    where: 'Stone & Chalk, Melbourne',
    when: '2025',
    text: 'Hunted through central log data in Azure Data Explorer with KQL, led by a Trustwave threat hunter.',
  },
];

export const publications: {
  title: string;
  authors: string[];
  venue: string;
  venueShort: string;
  place: string;
  when: string;
  doi: string;
  pdf?: string;
  text: string;
}[] = [
  {
    title: 'Trust-Centric User Authentication on Neo Blockchain: The Integration of zk-SNARKs Verification',
    authors: ['Md Masum Musfique', 'Tanvir Ahmed Aadeef', 'Md Samiur Rahman', 'Monosij Kanti Sarker', 'Md Fahad Monir'],
    venue: 'IEEE International Conference on Enabling Technologies: Infrastructure for Collaborative Enterprises (WETICE)',
    venueShort: 'IEEE WETICE',
    place: 'Paris, France',
    when: 'Dec 2023',
    doi: '10.1109/WETICE57085.2023.10477832',
    text: 'A private-blockchain authentication scheme for IoT networks on Neo. zk-SNARK verification and fog nodes shut out man-in-the-middle and phishing attacks without slowing down constrained devices.',
  },
  {
    title: 'Educational Certification on Ethereum Blockchain: Analysis on How BCert and UZHBC Differ',
    authors: ['Tanvir Ahmed Aadeef', 'Md Fahad Monir', 'Sanzar Adnan Alam'],
    venue: 'IEEE EUROCON 2023, 20th International Conference on Smart Technologies',
    venueShort: 'IEEE EUROCON',
    place: 'Turin, Italy',
    when: 'Jul 2023',
    doi: '10.1109/EUROCON56442.2023.10198929',
    text: 'As first author: a comparison of two ways to issue tamper-proof academic certificates on Ethereum, BCert and the University of Zurich blockchain, down to their hashing algorithms, with improvements proposed for each.',
  },
];

export const experience: {
  role: string;
  org: string;
  place: string;
  when: string;
  logo: 'triskele' | 'latrobe';
  note?: string;
  points: string[];
  tools: string[];
}[] = [
  {
    role: 'Detection Engineer Intern',
    org: 'Triskele Labs',
    place: 'Melbourne',
    when: 'Jul – Oct 2026',
    logo: 'triskele',
    points: [
      'Wrote 150+ Elastic Security detection rules mapped to MITRE ATT&CK, across execution, persistence, discovery, privilege escalation and defence evasion.',
      'Tuned existing rules, from query logic to ECS field mappings, to cut false positives.',
      'Ran purple-team exercises in OpenAEV, including the 158-inject Hades Interitus scenario, and built 222 Threat Arsenal attack actions.',
      'Built Python integrations that line up threat intel, attack execution, Windows process and registry telemetry and SIEM alerts, to find missed or late detections.',
      'Built a 20-technique MITRE ATLAS red-team pack for AI systems and validated it in Elastic.',
    ],
    tools: ['Elastic Security', 'OpenAEV', 'OpenCTI', 'MITRE ATT&CK', 'MITRE ATLAS', 'Python', 'Nuclei'],
  },
  {
    role: 'Lead Careers Consultant',
    org: 'La Trobe University',
    place: 'Melbourne',
    when: 'Jan – Oct 2026',
    logo: 'latrobe',
    note: 'Promoted to lead in July 2026.',
    points: [
      'Led and coordinated the Career Ready Ambassador team: rosters, workshops, events, weekly online drop-ins and campus stalls.',
      'Mentored fellow ambassadors, building their confidence in engaging students and running events.',
      'Acted as the link between the ambassadors and the Employability team, carrying feedback both ways.',
      'Planned outreach to raise awareness of La Trobe’s career-development programs.',
      'Helped hundreds of students a semester get ready for internships and graduate roles.',
      'Guided students to career resources, from internships to networking events.',
      'Supported the Employability Expo, with more than 40 exhibitors.',
      'Reported on student engagement across three periods.',
    ],
    tools: ['Team leadership', 'Mentoring', 'Student engagement', 'Outreach', 'Events', 'Reporting'],
  },
];

export const path: PathEntry[] = [
  {
    when: '2019 – 2024',
    title: 'BSc Computer Science and Engineering',
    where: 'Independent University, Bangladesh · Dhaka',
    text: 'Network engineering, cloud infrastructure and algorithms.',
  },
  {
    when: 'Aug 2022 – Jun 2024',
    title: 'Undergraduate research assistant',
    where: 'Independent University, Bangladesh',
    text: 'Research on blockchain for security and transparency, published at IEEE EUROCON and IEEE WETICE in 2023.',
  },
  {
    when: 'Jul 2025',
    title: "People's Choice Award",
    where: 'La Trobe x NAB Innovation Challenge',
    text: 'Voted the room favourite for a voice banking assistant that lets customers with a disability bank on their own.',
  },
  {
    when: 'Jul 2025',
    title: 'Australian Cyber Security Games 2025',
    where: 'Cyber Security Education Australia (CySEA)',
    text: 'Competed in the national capture-the-flag, solving hands-on attack and defence challenges against the clock.',
  },
  {
    when: 'Sep 2025',
    title: "Judges' Commendation",
    where: 'Google x La Trobe Innovation Sprint',
    text: 'For SewerSense AI, a sustainability idea pitched to four La Trobe judges.',
  },
  {
    when: 'Dec 2025 – Jul 2026',
    title: 'Azure SOC AI-enhanced homelab',
    where: 'Own project',
    text: 'A cloud SOC on Microsoft Sentinel and Defender XDR, with 155 KQL queries, six response playbooks and AI-written incident summaries.',
  },
  {
    when: 'Jan – Oct 2026',
    title: 'Lead Careers Consultant',
    where: 'La Trobe University',
    text: 'Promoted to lead in July. Ran ambassador rosters and supported an employability expo with 40+ exhibitors.',
  },
  {
    when: 'Jul – Oct 2026',
    title: 'Detection Engineer Intern',
    where: 'Triskele Labs · Melbourne',
    text: '150+ Elastic Security rules, 222 OpenAEV attack actions, a 158-inject purple-team exercise and Python integrations that tie simulated attacks to the alerts they raised.',
  },
  {
    when: 'Sep 2026',
    title: 'Professional Impact Award',
    where: 'La Trobe University',
    text: 'Awarded by La Trobe University.',
  },
  {
    when: 'Sep – Oct 2026',
    title: 'SC-200 and Splunk Cybersecurity Defense Engineer',
    where: 'Microsoft · Splunk',
    text: 'Certified on both of the SIEM platforms I use most, a month apart.',
  },
  {
    when: '2025 – 2026',
    title: 'Master of Cybersecurity',
    where: 'La Trobe University',
    text: 'Coursework in network security, machine learning, cyber risk management and governance.',
  },
];

export interface CaseImage {
  src: string;
  alt: string;
}

export interface CaseFile {
  slug: string;
  id: string;
  title: string;
  short: string;
  period: string;
  role: string;
  status: string;
  stack: string[];
  summary: string;
  sections: { heading: string; points: string[]; images?: CaseImage[]; scorecard?: boolean }[];
  outcome: string;
  outcomePoints?: string[];
  images?: CaseImage[];
  link?: { label: string; href: string };
}

export type ScenarioStatus = 'validated' | 'issues' | 'scan';
export interface Scenario {
  name: string;
  chain?: string;
  runs: number;
  techniques: string;
  executed: string;
  detected: string;
  status: ScenarioStatus;
  note?: string;
}

export const scenarioResults = {
  date: '22 Sep 2026',
  file: '/Tanvir-Ahmed-Aadeef-OpenAEV-Scenarios.xlsx',
  size: '16 KB',
  scenarios: [
    { name: 'Hades Interitus', runs: 2, techniques: '158 (316 tests)', executed: '310 of 316', detected: '312 of 312', status: 'issues', note: '4 tests not applicable; T1020 and T1115 failed to complete' },
    { name: 'Lazarus Group', chain: 'Windows intrusion chain', runs: 1, techniques: '40', executed: '39 of 40', detected: '40 of 40', status: 'issues', note: 'T1529 failed to complete' },
    { name: 'Volt Typhoon', chain: 'Windows living-off-the-land chain', runs: 1, techniques: '39', executed: '38 of 39', detected: '39 of 39', status: 'issues', note: 'T1592 failed to complete' },
    { name: 'APT41', chain: 'Windows espionage chain', runs: 1, techniques: '35', executed: '35 of 35', detected: '35 of 35', status: 'validated' },
    { name: 'Kimsuky', chain: 'Windows espionage and collection chain', runs: 1, techniques: '33', executed: '32 of 33', detected: '33 of 33', status: 'issues', note: 'T1557 failed to complete' },
    { name: 'OilRig (APT34)', chain: 'Windows espionage chain', runs: 1, techniques: '32', executed: '31 of 32', detected: '32 of 32', status: 'issues', note: 'T1115 failed to complete' },
    { name: 'FIN8', chain: 'Windows financial intrusion chain', runs: 1, techniques: '31', executed: '31 of 31', detected: '31 of 31', status: 'validated' },
    { name: 'Gamaredon', chain: 'Windows espionage and propagation chain', runs: 1, techniques: '31', executed: '31 of 31', detected: '31 of 31', status: 'validated' },
    { name: 'Mustang Panda', chain: 'Windows espionage chain', runs: 1, techniques: '30', executed: '30 of 30', detected: '30 of 30', status: 'validated' },
    { name: 'APT28', chain: 'Windows espionage and exfiltration chain', runs: 1, techniques: '29', executed: '29 of 29', detected: '29 of 29', status: 'validated' },
    { name: 'Sandworm (APT44)', chain: 'Windows destructive intrusion chain', runs: 1, techniques: '29', executed: '29 of 29', detected: '29 of 29', status: 'validated' },
    { name: '032 Mendicant Bias', runs: 2, techniques: '20 (21 tests)', executed: '21 of 21', detected: '21 of 21', status: 'validated' },
    { name: 'Pegasus', runs: 2, techniques: '10', executed: '10 of 10', detected: '10 of 10', status: 'validated' },
    { name: 'Sauron', chain: 'CVE scanning workflow', runs: 4, techniques: '5 scans', executed: '5 of 5', detected: 'Scan alerts seen', status: 'scan', note: 'ATT&CK coverage does not apply' },
  ] as Scenario[],
};

export const cases: CaseFile[] = [
  {
    slug: 'trinity',
    id: 'CASE-001',
    title: 'Project Trinity',
    short: 'A self-hosted MSSP that attacks itself to prove its detections work.',
    period: '2026',
    role: 'Architect and sole engineer',
    status: 'Running',
    stack: ['Elastic Security', 'Splunk ES', 'AegisForge (Wazuh)', 'Sysmon', 'OpenAEV', 'Atomic Red Team', 'OpenCTI', 'TheHive', 'Grafana', 'Python', 'Forgejo Actions', 'Docker', 'K3s', 'Cilium', 'Hubble', 'Tetragon', 'Chaos Mesh', 'Headlamp', 'Tailscale', 'Aegis Ward', 'Qwen', 'OpenTelemetry', 'Data Prepper', 'MITRE ATT&CK', 'MITRE ATLAS'],
    summary:
      'Trinity is a security operations centre I built and run myself. Three SIEMs watch the same Windows endpoints while OpenAEV attacks them, and every attack is checked against the alert it should have raised. It exists to answer one question: when a technique runs, can the stack see it, detect it, and prove the control worked?',
    sections: [
      {
        heading: 'Purple teaming and adversary emulation',
        scorecard: true,
        points: [
          '170 handwritten attack commands and 222 OpenAEV Threat Arsenal Actions, all mapped to MITRE ATT&CK.',
          'Multi-stage threat-actor scenarios, including Hades Interitus with 158 attack injects, built with OpenAEV, Atomic Red Team, PowerShell and Nuclei.',
          'OpenCTI threat intelligence feeds the scenarios, so the attacks follow real actor behaviour.',
          'Custom collectors separate four outcomes that usually get blurred together: the action executed, the telemetry arrived, the alert fired, and the prevention held.',
          '517 techniques across 13 threat-actor scenarios, from APT28 and Sandworm to Volt Typhoon and Lazarus. Every applicable technique was detected.',
          'Six attack actions across five scenarios failed to complete, yet their alerts still fired. Those scenarios are marked validated with issues rather than counted as clean passes.',
          'A missing alert is treated as something to investigate, not an automatic rule failure. Execution failure, collection gaps, ingestion delay, schema mismatch and rule scheduling are ruled out before a rule is blamed.',
        ],
        images: [
          { src: 'openaev-overview', alt: 'OpenAEV adversarial exposure overview: 873 attack injects, 853 detected, 100% prevention and detection resilience, and MITRE ATT&CK coverage across the kill chain.' },
          { src: 'openaev-scenario', alt: 'An OpenAEV threat-actor scenario with its injects laid out across MITRE ATT&CK tactics and a 100% detection result.' },
          { src: 'opencti-dashboard', alt: 'OpenCTI dashboard with 260 intrusion sets, 1.09K malware entries, 51.12K indicators, the most active threat actors and a map of targeted countries.' },
        ],
      },
      {
        heading: 'Detection engineering across three SIEMs',
        points: [
          '150+ detection rules, tuned and versioned as detection-as-code in Forgejo.',
          'Elastic Security, Splunk Enterprise Security and AegisForge, a Wazuh-based SIEM with custom collectors.',
          'Python collectors that line up each attack, its endpoint telemetry and the SIEM alert, so a missed or late detection shows up as evidence.',
          'One T1594 reconnaissance exercise in OpenAEV produced matching detections in Elastic, Splunk and AegisForge.',
          'The Elastic collector tracks each attack from pending to waiting for an alert to detected or not detected. It only reports a miss once it has proven its own health; otherwise it fails closed and reports an error.',
          'A match must prove the rule, the target host, the exact implant signature and fresh source events. An alert’s creation time is never accepted as proof, and every call to the SIEM is read-only.',
          'The AegisForge collector carries 242 detection specifications mapped to 255 attack actions. Until each translated rule has been reviewed, it refuses to report a miss rather than guess.',
        ],
        images: [
          { src: 'elastic-alert', alt: 'Elastic Security alert for T1594 synthetic victim website reconnaissance, mapped to MITRE ATT&CK, with host and user details redacted.' },
          { src: 'aegisforge-command-center', alt: 'AegisForge command centre: 1,118 alerts in the window, alert activity by severity, an investigation queue, endpoint health and ATT&CK activity.' },
        ],
      },
      {
        heading: 'Detection-as-code and CI/CD',
        points: [
          'Everything lives in Git on a self-hosted Forgejo: the platform, the OpenAEV scenarios and injectors, and a Detection-as-Code repository of rules, mappings, collectors, security policies and tests.',
          'Forgejo Actions run on my own runner and check every change: Python source, test fixtures, detection mappings, YAML and Compose configuration, and repository hygiene. The pipelines validate rather than deploy, so nothing reaches the stack without passing first.',
          'Releases are tagged and changelogged (Trinity Platform v0.1.0), Grafana dashboards are versioned as exports, and recovery runbooks and sanitised templates mean the platform can be rebuilt from the repository. Credentials and live data stay out of source control.',
          'Current detection mappings are checked against a strict schema, while older mapping snapshots are kept unchanged and verified by SHA-256 hash, so past results can still be reproduced.',
        ],
        images: [
          { src: 'forgejo-repo', alt: 'The trinity-platform repository in Forgejo, with workflows, the alert router, Kubernetes resilience manifests and services, tagged chaos-mesh, cilium and tetragon.' },
        ],
      },
      {
        heading: 'SOC automation',
        points: [
          'A custom alert router normalises alerts from all three SIEMs into TheHive for case management, with Grafana for visibility.',
          'Tiered AI triage for a one-person SOC: Laya, a System 1 classification model, works as the L1 analyst and clears false positives and benign alerts. Anything genuine escalates to Qwen and Azrael, custom L2 and L3 models, with a human approving the outcome.',
          'Demo records are labelled apart from genuine detections, so the dashboards never pass off a showcase as a real alert.',
        ],
        images: [
          { src: 'grafana-soc', alt: 'Grafana Trinity security operations dashboard: 9 alerts, 6 open cases, 3 AI-triaged, a mean time to detect of 3.76 seconds, and detections split across Elastic, Splunk and AegisForge.' },
          { src: 'thehive-cases', alt: 'TheHive case list with Trinity SOC cases from each SIEM, tagged azrael-triaged, and a Laya L1 to Azrael L2 re-review case.' },
        ],
      },
      {
        heading: 'AI security',
        points: [
          'Aegis Ward puts policy controls around a local Qwen model: on what goes in, what it retrieves, what it executes and what comes out.',
          'Every allow or block decision becomes a structured security event, sent through OpenTelemetry and Data Prepper into AegisForge, so attacks on the model land in the same SOC as attacks on an endpoint.',
          'OpenTelemetry carries two signals with different jobs. Security events in OTLP logs are the evidence the validation collector trusts, while traces are kept for explanation and never decide a result. Both pass through an OpenTelemetry Collector and mutual TLS into separate daily AegisForge indices.',
          'The AI collector resolves each OpenAEV test from that evidence by matching its marker, the AegisForge AI detection ID, the ATLAS technique and the execution window. It fails closed when anything is ambiguous, and prompt content never leaves the gateway.',
          'A direct prompt-injection test was blocked before it reached the model, and OpenAEV confirmed both the detection and the prevention. Exercises are mapped to MITRE ATLAS.',
        ],
      },
      {
        heading: 'Chaos engineering',
        points: [
          'A SOC is only useful if it keeps running when something breaks, so I break it on purpose. Chaos Mesh injects faults into a dedicated trinity-resilience namespace: an API, a frontend, a cache and a worker, with a traffic generator keeping real requests flowing the whole time.',
          'Three kinds of fault: network attacks that add latency and packet loss to the API, a stress test that puts the worker under CPU pressure, and pod faults that kill the frontend to prove it comes back.',
          'Experiments run on schedules and as multi-step workflows, so resilience is re-tested continuously rather than checked once: 6 experiments, 3 schedules and 3 workflows, all completed.',
          'Health-validator jobs run every five minutes and check the services through each fault. Hubble shows the blast radius live, flow by flow, between the worker, cache, frontend and API.',
          'Every experiment ends with Chaos Mesh rolling the fault back, so recovery is a recorded result, not an assumption.',
        ],
        images: [
          { src: 'chaos-mesh-experiments', alt: 'Chaos Mesh experiments, all completed: API latency and packet loss network attacks, a worker CPU stress test and a frontend pod failure.' },
          { src: 'chaos-mesh-dashboard', alt: 'Chaos Mesh dashboard with 6 experiments, 3 schedules and 3 workflows, a timeline of experiment runs and recent recovery events.' },
          { src: 'hubble-service-map', alt: 'Cilium Hubble service map of the trinity-resilience namespace: traffic generator, worker and health validators calling the cache, frontend and API at 72.3 flows per second.' },
        ],
      },
      {
        heading: 'Cloud-native platform',
        points: [
          'Split across a Linux services host, a separate analytics and inference environment, and isolated test endpoints.',
          'K3s and Docker workloads on Cilium, observed through Hubble flows, Tetragon eBPF events and Headlamp.',
          'Locked down with UFW policies and reached only over Tailscale.',
        ],
        images: [
          { src: 'headlamp-workloads', alt: 'Headlamp Kubernetes workloads view: 34 healthy pods, 18 deployments and 23 replica sets running, with health-validator jobs in the trinity-resilience namespace.' },
        ],
      },
      {
        heading: 'What made it hard',
        points: [
          'Attack commands never stayed fixed. A command that executed cleanly in one run could fail the next, so the 170 handwritten commands were rewritten again and again to keep every technique doing what it claimed to.',
          'Cleanup was its own engineering problem. Attacks leave secondary artefacts that Windows creates on its own, beyond the files and keys a command makes directly, such as Prefetch entries, registry traces from scheduled tasks and services, and files dropped by child processes. Cleanup commands had to be rewritten to find and remove them, or the next run started from a dirty endpoint and its results could not be trusted.',
          'Endpoint fatigue. Hundreds of attack injects against the same Windows endpoints wear them down: leftover state builds up, defences start reacting to the residue rather than the test, and the machine drifts from its baseline. Endpoints had to be brought back to a clean state between campaigns to keep results comparable.',
          'Not every technique fits a lab. Some need conditions a test endpoint does not have, so techniques such as T1021.006 and T1553 were marked not applicable instead of being forced into a misleading pass.',
          'A failed action is not a failed detection. Telling apart an attack that did not run, telemetry that arrived late, and a rule that genuinely missed took deliberate design, so that every result points at the right fix.',
        ],
      },
    ],
    outcome:
      'Trinity turns "we have a rule for that" into a test result: the attack ran, the alert fired or it did not, and any gap goes back into tuning until the next run proves it is closed.',
    outcomePoints: [
      'Coverage that is measured, not assumed: 517 techniques across 13 threat-actor scenarios, every applicable technique detected, and every exception recorded rather than hidden.',
      'Detections that are not tied to one vendor: the same T1594 exercise was detected in Elastic, Splunk and AegisForge.',
      'Attacks on AI land in the same SOC as attacks on endpoints: a direct prompt injection was blocked before it reached the model, with the evidence indexed next to endpoint telemetry.',
      'A SOC that keeps working when parts of it break: chaos experiments inject network, CPU and pod faults, and recovery is a recorded result.',
      'A one-person SOC that scales: AI triage clears the noise, and a human approves every outcome that matters.',
      'Everything is reproducible: the platform, scenarios and detections live in Git, so any result can be rerun and the platform rebuilt from the repository.',
    ],
  },
  {
    slug: 'aegis-ward',
    id: 'CASE-002',
    title: 'Aegis Ward',
    short: 'A security gateway that stops prompt injection before it reaches a local LLM.',
    period: '2026',
    role: 'Designer and engineer',
    status: 'Running inside Trinity',
    stack: ['Python', 'FastAPI', 'NeMo Guardrails', 'Qwen', 'OpenTelemetry', 'OpenTelemetry Collector', 'Data Prepper', 'MITRE ATLAS', 'OpenAEV', 'Elastic', 'AegisForge'],
    summary:
      'Aegis Ward sits in front of locally hosted model inference. It inspects prompts, enforces policy, and writes structured security telemetry so the SOC can see attacks on the model like any other attack.',
    sections: [
      {
        heading: 'What it does',
        points: [
          'Applies policy at five stages around the model: the prompt going in, retrieved content, the dialogue, tool execution and the answer coming out.',
          'Each stage can allow, detect, transform or block, and every decision, including an allow, is recorded.',
          'A blocked prompt never reaches the model at all.',
        ],
      },
      {
        heading: 'How the telemetry works',
        points: [
          'Aegis Ward is instrumented with the OpenTelemetry SDK and emits two signals. Logs carry the AI security event, the authoritative record of a decision. Traces carry spans that explain how the request moved through the gateway.',
          'Every security event follows a fixed schema: the stage, the decision, whether the attack was detected and prevented, a reason code, whether the model was invoked, whether a tool was requested or executed, whether a response was released, the MITRE ATLAS technique, and the trace and span IDs that tie it back to its trace.',
          'Telemetry is content-minimised by design. Message-content capture is switched off, and prompts, responses and tool arguments are never stored, so the SIEM sees what happened without holding sensitive text.',
          'Events leave over OTLP into an OpenTelemetry Collector, which applies a memory limit and batching, then forwards them over mutual TLS to Data Prepper.',
          'Data Prepper runs two pipelines into AegisForge, one for security events and one for traces, each written to its own daily index. Detections and dashboards query the events, and analysts use the traces to explain them.',
        ],
      },
      {
        heading: 'How it detects',
        points: [
          'Two deterministic detectors: direct prompt-injection signatures for instruction override, prompt extraction and role hijacking, and a behavioural detector mapped to MITRE ATLAS techniques.',
          'Prompts are normalised before inspection: invisible Unicode characters stripped, base64 payloads decoded and leetspeak reversed, so simple obfuscation does not slip past.',
          'Separate patterns tell someone discussing prompt injection apart from someone attempting it, to keep false positives down.',
        ],
      },
      {
        heading: 'How it was tested',
        points: [
          'A 20-technique MITRE ATLAS pack run through OpenAEV against Qwen, from direct and indirect injection and jailbreaks to system-prompt extraction, data leakage, RAG poisoning and agent tool poisoning.',
          'Techniques are tiered by what they need: eleven run against a plain model, the rest need retrieval, chat history or a tool-enabled agent, and all use synthetic fixtures such as canary system prompts and fake secrets.',
          'OpenAEV correlation markers are deliberately kept out of detection, so a test cannot pass just by being recognised as a test, and real attacks without markers are still caught.',
          'Each result checked against indexed telemetry, not just the gateway log, with unit tests for both detectors and the event format.',
        ],
      },
    ],
    outcome: 'Attacks on the model show up in the SOC with the same evidence trail as attacks on an endpoint.',
  },
  {
    slug: 'azure-soc',
    id: 'CASE-003',
    title: 'Azure SOC AI-enhanced homelab',
    short: 'A cloud SOC on Sentinel and Defender XDR, with case files, playbooks and risk reports.',
    period: 'Dec 2025 – Jul 2026',
    role: 'Built and documented end to end',
    status: 'Published on GitHub',
    stack: ['Microsoft Sentinel', 'KQL', 'Defender XDR', 'Entra ID', 'Logic Apps', 'ANY.RUN', 'Velociraptor', 'Zeek', 'Suricata', 'Azure OpenAI'],
    summary:
      'A small enterprise in Azure, attacked with phishing and business email compromise, and defended the way an Australian SOC would: correlated detections, enrichment, containment, and a written case file for every incident.',
    sections: [
      {
        heading: 'Telemetry',
        points: [
          'Windows endpoints in an Azure virtual network send Sysmon, Windows event logs and Defender for Endpoint signals; Entra ID adds sign-ins, risky authentications and cloud audit logs.',
          'A Linux network sensor runs Zeek and Suricata for DNS, HTTP, TLS and flow visibility, so detections can lean on the network as well as the host.',
          'Velociraptor collects endpoint artefacts and runs live hunts during an investigation.',
        ],
      },
      {
        heading: 'Detection and hunting',
        points: [
          '155 KQL queries and 108 Defender for Endpoint hunting queries covering living-off-the-land tools, ransomware, Sliver C2, FIN7 and Qakbot.',
          '67 DFIR pivots across Defender for Endpoint, Identity and Office, Entra ID and unified audit logs.',
          '33 vulnerability management queries, including CISA known exploited vulnerabilities.',
          '120 queries mapped to MITRE ATT&CK across 12 tactics, deepest in defence evasion (28) and discovery (23).',
          'Living-off-the-land hunts drawn from LOLBAS, GTFOBins and LOLDrivers, plus ASR, SmartScreen and USB telemetry.',
        ],
      },
      {
        heading: 'Response',
        points: [
          'Six incident response playbooks: phishing, malware, ransomware, account compromise, data loss and critical incidents, each drawn from detect to post-incident.',
          'Case files for Solorigate beacons, a phishing attempt and an XWorm RAT loader, with ANY.RUN malware analysis.',
          'Each case file keeps the extracted indicators, the attack graph and the AI summary beside the analyst’s own report, so the two can be compared.',
        ],
      },
      {
        heading: 'AI with guardrails',
        points: [
          'A Logic App sends each new incident to Azure OpenAI and posts a structured summary back as a comment.',
          'The model must cite the incident fields it used, answer "unknown" instead of guessing, and fail if it names an entity that is not in the input. An analyst approves before any containment.',
          'Prompt templates for hypothesis-driven KQL drafting and plain-language containment notices, run at a temperature of 0 to 0.3 with every input and output logged for audit.',
        ],
      },
      {
        heading: 'Risk and compliance',
        points: [
          'Risk and compliance reports for AEMO, Capital One and SingHealth.',
          'Templates for asset inventories, risk registers and control mapping across ISO 27001 and 27005, COBIT 2019 and NIST CSF.',
          'An ACSC Essential Eight control matrix with evidence playbooks.',
          'An Essential Eight gap register: current and target maturity, an owner and a validation test for every gap, backed by dated evidence packs.',
        ],
      },
    ],
    outcome: 'Low-confidence signals become high-confidence incidents through correlation, and every incident ends as a document someone else could audit.',
    images: [
      { src: 'sentinel-overview', alt: 'Microsoft Sentinel overview showing 24.2K events, 17 alerts and 3 incidents, with a Solorigate network beacon at high severity.' },
      { src: 'defender-incidents', alt: 'Microsoft Defender incident queue listing Solorigate network beacon, malicious inbox rule and suspicious sign-in incidents.' },
      { src: 'anyrun-xworm-03005', alt: 'ANY.RUN analysis of invoice-1645080830.pdf.js, flagged as an XWorm loader with PowerShell child processes and network trojan alerts.' },
    ],
    link: { label: 'Read the repository', href: 'https://github.com/SyntheticSovereign/Azure-SOC-AI-Enhanced-Homelab' },
  },
  {
    slug: 'aemo',
    id: 'CASE-004',
    title: 'AEMO cyber governance framework',
    short: 'A 40-page GRC framework for the Australian Energy Market Operator, from board to branch.',
    period: 'Oct 2026',
    role: 'Author',
    status: 'Published on GitHub',
    stack: ['NIST CSF 2.0', 'COBIT 2019', 'ISO/IEC 27001', 'ISO/IEC 27002', 'CIS Controls v8', 'ASD ISM', 'AESCSF', 'SOCI Act'],
    summary:
      'AEMO runs the electricity and gas markets, so it is treated as SOCI-regulated critical infrastructure. The report assesses its cyber governance against NIST CSF 2.0, COBIT 2019 and ISO 27001, and lays out how to move it from Initial maturity to Defined and Managed within 18 months.',
    sections: [
      {
        heading: 'Governance model',
        points: [
          'A federated model across six branches: Melbourne headquarters, Sydney, Brisbane, Perth, Adelaide and London.',
          'One enterprise baseline for every branch, with compliance overlays: SOCI, the Privacy Act and the ASD ISM in Australia, UK GDPR and the Data Protection Act 2018 in London.',
          'A RASCI model from the board down: the board owns risk appetite, the CISO owns programme performance, and branch coordinators own local evidence.',
          'Policies written as testable control statements: MFA and privileged access management on every privileged account, no critical system in production without an owner, and annual due diligence on every critical supplier.',
        ],
      },
      {
        heading: 'Risk and reporting',
        points: [
          'A live cyber risk register: identify, assess, assign an owner, treat, monitor, escalate.',
          'Risk scenarios specific to a market operator: ransomware on market-supporting systems, privileged account compromise, supplier compromise and data-integrity attacks on market data.',
          'KPIs with a formula, a target, an owner and an escalation trigger, such as 100% MFA on privileged accounts (any gap escalates), 98% coverage of critical assets in the inventory and a phishing failure rate below 5%.',
          'A board cyber dashboard that reports risk and control coverage, not malware counts and firewall events.',
          'Continuous monitoring split into technical, governance and compliance streams, with a fixed escalation path to the Board Risk and Audit Committee.',
        ],
      },
      {
        heading: 'Roadmap',
        points: [
          'Six-, 12- and 18-month targets for governance, asset management and risk management.',
          'A Plan-Do-Check-Act cycle with monthly risk register reviews, quarterly branch attestations and quarterly board reporting.',
          'Branches are judged on whether they can show evidence that a control is working, not on whether they have adopted the policy.',
        ],
      },
      {
        heading: 'Technical assurance',
        points: [
          'A six-stage assessment method: mobilise, discover, test the design, test the operation, evaluate and challenge, then report and retest.',
          'Control tests with real sampling rules. For example, every privileged account is reconciled against MFA logs, with 15 normal, 5 admin and all break-glass accounts sampled.',
          'A treatment register with owners and deadlines, such as a critical service with no SIEM ingestion, fixed within 30 days by the SOC Manager.',
          'AI risks covered as well: no AI agent may take privileged actions on the strength of untrusted retrieved content, and every AI use case is inventoried and red-teamed.',
          'Operational technology is assessed only with non-intrusive methods, following NIST SP 800-82 Rev. 3, with safety approval before any active discovery.',
          'Board indicators that measure risk rather than noise: log freshness of at least 98%, and witnessed end-to-end restores instead of "all backups green".',
          'Written as a methodology, not an audit: nothing in it is presented as an observed AEMO weakness.',
        ],
      },
    ],
    outcome: 'A governance framework a board could adopt: who owns which risk, how it is measured, and what changes at 6, 12 and 18 months.',
    images: [
      { src: 'aemo-overview', alt: 'Executive cyber governance overview for AEMO: business objectives, the governance framework from board to standards baseline, branches, critical assets and regulatory overlays.' },
      { src: 'aemo-structure', alt: 'Cyber governance structure for AEMO, from the Board of Directors through the CISO and Head of Cyber GRC to the SOC, legal, procurement, internal audit and six branches.' },
      { src: 'aemo-dashboard', alt: 'Board cyber dashboard for AEMO with control coverage, a monthly performance trend, a residual risk heat map and branch compliance status.' },
      { src: 'aemo-monitoring', alt: 'Continuous monitoring model for AEMO: technical, governance and compliance monitoring feeding a live risk register and escalation path.' },
    ],
    link: {
      label: 'Read the report',
      href: 'https://github.com/SyntheticSovereign/Azure-SOC-AI-Enhanced-Homelab/blob/main/Cyber%20Risk%20Management/Risk%20and%20Compliance%20Reports/AEMO_Governance_V1.0.pdf',
    },
  },
  {
    slug: 'elevatex',
    id: 'CASE-005',
    title: 'ElevateX',
    short: 'An ERC-20 token on Ethereum priced from a Chainlink gold feed.',
    period: 'Earlier work',
    role: 'Smart contract developer',
    status: 'Archived',
    stack: ['Solidity', 'Chainlink', 'Truffle', 'Remix', 'JavaScript'],
    summary:
      'ElevateX is an ERC-20 token whose price follows gold. Holders can transfer, buy and sell it, and the price is refreshed from a Chainlink price feed.',
    sections: [
      {
        heading: 'Contracts',
        points: [
          'ElevateX.sol: transfer, buy() and sell() at the current price, and updatePrice() pulling from the oracle.',
          'Separate owner, storage and loan contracts to keep access control and state apart.',
        ],
      },
      {
        heading: 'Status',
        points: ['The oracle scripts were left unfinished after regulatory and use-case changes. The contracts are published as they stand.'],
      },
    ],
    outcome: 'Contracts that hold value, written with ownership, storage and pricing kept apart.',
    link: { label: 'Read the repository', href: 'https://github.com/SyntheticSovereign/ElevateX' },
  },
  {
    slug: 'cerebro',
    id: 'CASE-006',
    title: 'Cerebro',
    short: 'An AI assistant in Copilot Studio that works like a junior SOC analyst.',
    period: 'Earlier work',
    role: 'Agent designer',
    status: 'Prototype',
    stack: ['Microsoft Copilot Studio', 'Generative AI'],
    summary:
      'Cerebro helps people analyse system logs, check IP and domain reputation, review suspicious emails and pick an incident response playbook, in plain security language.',
    sections: [
      {
        heading: 'What it handles',
        points: [
          'Log analysis for signs of compromise.',
          'IP and domain reputation checks.',
          'Phishing email analysis.',
          'Playbook recommendations for the next response step.',
        ],
      },
    ],
    outcome: 'A guided first pass for people who are not security analysts, without pretending to replace one.',
  },
];

export type Org = 'latrobe' | 'nab' | 'google';

export const orgNames: Record<Org, string> = {
  latrobe: 'La Trobe University',
  nab: 'NAB',
  google: 'Google',
};

export type AwardImage = 'impact' | 'google' | 'nab' | 'career-ready';

export const recognition: { title: string; by: string; when?: string; orgs: Org[]; text: string; image: AwardImage; alt: string }[] = [
  {
    title: 'Professional Impact Award',
    by: 'La Trobe University',
    when: 'Sep 2026',
    orgs: ['latrobe'],
    text: "Won at the first SCEMS Student Engagement and Employability Awards, for the work outside the classroom: leading the Career Ready Ambassadors, representing SCEMS students, and starting out in detection engineering at Triskele Labs.",
    image: 'impact',
    alt: 'Tanvir on stage receiving the Professional Impact Award, with the award title and Winner on the screen behind.',
  },
  {
    title: "People's Choice Award",
    by: 'La Trobe x NAB Innovation Challenge',
    when: 'Jul 2025',
    orgs: ['nab'],
    text: 'Voted the room favourite for a voice banking assistant built on the NAB app with a team of four: humanlike voice recognition that works on smart speakers and AR glasses, so customers with a disability can bank on their own.',
    image: 'nab',
    alt: 'The winning team on stage at the La Trobe x NAB Industry Challenge.',
  },
  {
    title: "Judges' Commendation",
    by: 'Google x La Trobe Innovation Sprint',
    when: 'Sep 2025',
    orgs: ['google'],
    text: 'For SewerSense AI, a sustainability idea pitched to four La Trobe judges after the Google Developer Group workshops on building and deploying with AI.',
    image: 'google',
    alt: "Tanvir receiving the Judges' Commendation certificate in front of the Google Developer Group backdrop.",
  },
  {
    title: 'Career Ready Advantage Platinum',
    by: 'La Trobe University',
    orgs: ['latrobe'],
    text: "Platinum in La Trobe's employability programme. I went on to become a Career Ready Ambassador, then Lead Ambassador in 2026, running drop-ins and expo stalls for hundreds of students a semester.",
    image: 'career-ready',
    alt: 'Tanvir pointing to the Career Ready sign on the La Trobe campus.',
  },
];

export const arsenal = [
  {
    group: 'Detection and SIEM',
    items: ['Elastic Security', 'Kibana', 'Elastic Defend', 'Elastic Agent', 'Splunk Enterprise Security', 'Microsoft Sentinel', 'Microsoft Defender XDR', 'AegisForge (Wazuh)', 'Sysmon', 'Windows event logs', 'ECS'],
  },
  {
    group: 'Purple team and offence',
    items: ['MITRE ATT&CK', 'OpenAEV', 'Atomic Red Team', 'Nuclei', 'Breach and attack simulation', 'Adversary emulation', 'Kali Linux'],
  },
  {
    group: 'Threat intel and SOC automation',
    items: ['OpenCTI', 'TheHive', 'Grafana', 'Logic Apps', 'ANY.RUN', 'Velociraptor', 'Custom alert router', 'Custom SIEM collectors'],
  },
  {
    group: 'AI security',
    items: ['MITRE ATLAS', 'Aegis Ward', 'Prompt-injection defence', 'Local LLMs (Qwen)', 'OpenTelemetry', 'Data Prepper', 'Azure OpenAI', 'Copilot Studio'],
  },
  {
    group: 'Cloud and Kubernetes',
    items: ['Microsoft Azure', 'Entra ID', 'Docker', 'Docker Compose', 'Kubernetes (K3s)', 'Cilium', 'Hubble', 'Tetragon (eBPF)', 'Chaos Mesh', 'Headlamp'],
  },
  {
    group: 'Network and access',
    items: ['Zeek', 'Suricata', 'Tailscale', 'UFW'],
  },
  {
    group: 'Governance and frameworks',
    items: ['NIST CSF 2.0', 'ISO/IEC 27001 and 27002', 'COBIT 2019', 'CIS Controls v8', 'ASD ISM', 'AESCSF', 'SOCI Act'],
  },
  {
    group: 'Languages',
    items: ['Python', 'PowerShell', 'KQL', 'SPL', 'YAML', 'Solidity', 'JavaScript'],
  },
  {
    group: 'Engineering workflow',
    items: ['Git', 'Forgejo', 'Forgejo Actions', 'CI/CD', 'Detection-as-code', 'Truffle', 'Remix', 'Chainlink'],
  },
];

export const certifications = [
  { name: 'Splunk Certified Cybersecurity Defense Engineer', issuer: 'Splunk', issued: 'Oct 2026', id: 'Cert-431277', valid: 'Valid to Oct 2029' },
  { name: 'Security Operations Analyst Associate (SC-200)', issuer: 'Microsoft', issued: 'Sep 2026', id: '826BEEF072B542E4', valid: 'Valid to Sep 2027' },
  { name: 'CyberOps Associate', issuer: 'Cisco Networking Academy', issued: 'May 2026', id: '50875e21-ddef-4979-a806-ce389ae55e53', valid: 'No expiry' },
  { name: 'Security, Compliance and Identity Fundamentals (SC-900)', issuer: 'Microsoft', issued: 'Jan 2026', id: '', valid: 'No expiry' },
  { name: 'Australian Cyber Security Games CTF', issuer: 'Cyber Security Education Australia', issued: 'Sep 2025', id: '', valid: 'Completed' },
  { name: 'IT Specialist: Python', issuer: 'Certiport', issued: 'Aug 2025', id: 'wMQAC-FaSQ', valid: 'Valid to Aug 2030' },
  { name: 'Google IT Support Professional Certificate', issuer: 'Google', issued: 'Aug 2025', id: 'EXZXA32XHKWA', valid: 'No expiry' },
  { name: 'Google Cybersecurity Professional Certificate', issuer: 'Google', issued: '', id: '', valid: 'No expiry' },
];
