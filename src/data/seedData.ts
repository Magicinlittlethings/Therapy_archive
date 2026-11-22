import {
  Session,
  SessionMaterial,
  RelatedSessionRef,
  PrivateTherapyNote,
  CommunitySubmission,
  TherapyNote,
  NoteReport,
  TrackIdInquiry,
  AttendanceScenario
} from '../types';

/**
 * Complete Historical Archive Sequence: GT-I to GT-XV
 * Verified sessions have 'confirmed' status with verified venues/dates.
 * Unverified historical gaps are honestly marked as 'awaiting_verification' or 'partial_record'.
 */
export const CURATED_SESSIONS: Session[] = [
  {
    id: 'gt-i',
    sessionCode: 'GT-I',
    title: 'Group Therapy I',
    date: '2023-08-12',
    city: 'Lagos',
    venue: null,
    branch: 'Group Therapy',
    description: 'The inaugural Group Therapy session. An intimate underground gathering that established the acoustic ritual.',
    artists: [
      { name: 'Aniko', role: 'Resident DJ', association: 'resident performance' }
    ],
    lineupStatus: 'pending',
    archivalStatus: 'awaiting_verification',
    confidence: 'low',
    verificationNote: 'Inaugural session. Original door check-in logs and master tape references currently undergoing reconciliation.',
    sourceUrls: [],
    isPublished: true,
    publishedAt: '2023-08-13'
  },
  {
    id: 'gt-ii',
    sessionCode: 'GT-II',
    title: 'Group Therapy II',
    date: '2023-11-18',
    city: 'Lagos',
    venue: null,
    branch: 'Group Therapy',
    description: 'Second session exploring minimal rolling percussions and sub-bass textures.',
    artists: [
      { name: 'WeAreAllChemicals', role: 'Resident DJ' },
      { name: 'Aniko', role: 'Resident DJ' }
    ],
    lineupStatus: 'pending',
    archivalStatus: 'awaiting_verification',
    confidence: 'low',
    verificationNote: 'Partial record. Lineup and venue verification pending confirmation from resident selectors.',
    sourceUrls: [],
    isPublished: true,
    publishedAt: '2023-11-19'
  },
  {
    id: 'gt-iii',
    sessionCode: 'GT-III',
    title: 'Group Therapy III',
    date: '2024-02-10',
    city: 'Lagos',
    venue: null,
    branch: 'Group Therapy',
    description: 'Early 2024 session establishing late-night tempo progressions and warehouse acoustic boundaries.',
    artists: [],
    lineupStatus: 'pending',
    archivalStatus: 'awaiting_verification',
    confidence: 'low',
    verificationNote: 'Archival record undergoing tape and guestlist reconciliation. Details will be updated upon curator verification.',
    sourceUrls: [],
    isPublished: true,
    publishedAt: '2024-02-11'
  },
  {
    id: 'gt-iv',
    sessionCode: 'GT-IV',
    title: 'Group Therapy IV',
    date: '2024-05-03',
    city: 'Lagos',
    venue: 'Ultima Studios, Lekki Phase 1',
    branch: 'Group Therapy',
    description: 'An intimate, deep exploration of foundational underground house textures and electronic rhythm in Lekki Phase 1.',
    artists: [
      { name: 'An.d', role: 'DJ' },
      { name: 'Moone', role: 'DJ' },
      { name: 'Aniko', role: 'Resident DJ' },
      { name: 'IMJ', role: 'DJ' },
      { name: 'RONR', role: 'DJ' }
    ],
    lineupStatus: 'confirmed',
    archivalStatus: 'confirmed',
    confidence: 'medium',
    verificationNote: 'Historical event listing verified against resident archive and Resident Advisor event records.',
    sourceUrls: ['https://ra.co/events/1912053'],
    isPublished: true,
    publishedAt: '2024-05-04'
  },
  {
    id: 'gt-v',
    sessionCode: 'GT-V',
    title: 'Group Therapy V (First Anniversary)',
    date: '2024-08-24',
    city: 'Lagos',
    venue: 'La Madison Event Centre',
    branch: 'Group Therapy',
    description: 'First Anniversary session celebrating one year of communal electronic exploration in Lagos, featuring a standout Yosa B2B Aniko performance.',
    artists: [
      { name: 'Celso Fabbri', role: 'DJ' },
      { name: 'Ahnansi', role: 'DJ' },
      { name: 'Yosa', role: 'DJ (B2B)' },
      { name: 'Aniko', role: 'Resident DJ (B2B)' },
      { name: 'Marina Rd Sound', role: 'DJ Collective' },
      { name: 'Weareallchemicals', role: 'Resident DJ' }
    ],
    lineupStatus: 'confirmed',
    archivalStatus: 'confirmed',
    confidence: 'high',
    verificationNote: 'Historical anniversary listing; Yosa B2B Aniko verified against RA event archive.',
    sourceUrls: ['https://ra.co/events/2170672'],
    isPublished: true,
    publishedAt: '2024-08-25'
  },
  {
    id: 'gt-vi',
    sessionCode: 'GT-VI',
    title: 'Group Therapy VI',
    date: '2024-11-16',
    city: 'Lagos',
    venue: null,
    branch: 'Group Therapy',
    description: 'Late 2024 session exploring stripped-back industrial club cuts and deep rhythmic pressure.',
    artists: [],
    lineupStatus: 'pending',
    archivalStatus: 'awaiting_verification',
    confidence: 'low',
    verificationNote: 'Archival record undergoing tape and guestlist reconciliation.',
    sourceUrls: [],
    isPublished: true,
    publishedAt: '2024-11-17'
  },
  {
    id: 'gt-vii',
    sessionCode: 'GT-VII',
    title: 'Group Therapy VII',
    date: '2025-02-22',
    city: 'Lagos',
    venue: null,
    branch: 'Group Therapy',
    description: 'Early 2025 gathering focusing on dense percussive pacing and warehouse acoustic isolation.',
    artists: [],
    lineupStatus: 'pending',
    archivalStatus: 'awaiting_verification',
    confidence: 'low',
    verificationNote: 'Awaiting verified lineup announcement and tape recovery from resident archive.',
    sourceUrls: [],
    isPublished: true,
    publishedAt: '2025-02-23'
  },
  {
    id: 'gt-viii',
    sessionCode: 'GT-VIII',
    title: 'Group Therapy VIII',
    date: '2025-05-23',
    city: 'Lagos',
    venue: 'Livespot Entertainment Centre, Lekki',
    branch: 'Group Therapy',
    description: 'A heavyweight gathering at Livespot marked by deep Afro-tech rhythms and sonic density.',
    artists: [
      { name: 'Dlala Thukzin', role: 'Guest Headliner' },
      { name: 'Frigid Armadillo', role: 'Guest DJ' },
      { name: 'Aniko', role: 'Resident DJ' },
      { name: 'Abiodun', role: 'DJ' },
      { name: 'Jarlight', role: 'DJ' },
      { name: 'Billysroom', role: 'DJ' }
    ],
    lineupStatus: 'confirmed',
    archivalStatus: 'confirmed',
    confidence: 'high',
    verificationNote: 'Historical event and recording references verified through official GT channels and RA.',
    sourceUrls: ['https://ra.co/events/2168551', 'https://linktr.ee/grouptherapyng'],
    isPublished: true,
    publishedAt: '2025-05-24'
  },
  {
    id: 'gt-ix',
    sessionCode: 'GT-IX',
    title: 'Group Therapy IX',
    date: '2025-08-16',
    city: 'Lagos',
    venue: null,
    branch: 'Group Therapy',
    description: 'Mid-2025 gathering bridging extended ambient introductions with driving 3-step percussive closers.',
    artists: [],
    lineupStatus: 'pending',
    archivalStatus: 'awaiting_verification',
    confidence: 'low',
    verificationNote: 'Historical records under curator reconciliation.',
    sourceUrls: [],
    isPublished: true,
    publishedAt: '2025-08-17'
  },
  {
    id: 'gt-x',
    sessionCode: 'GT-X',
    title: 'Group Therapy X',
    date: '2025-11-07',
    city: 'Lagos',
    venue: 'Livespot Entertainment Centre, Lekki',
    branch: 'Group Therapy',
    description: 'The milestone tenth session, diving deep into driving 3-step percussions and deep melodic electronic club cuts.',
    artists: [
      { name: 'Prince Kaybee', role: 'Guest Headliner' },
      { name: 'Funky QLA', role: 'Guest DJ' },
      { name: 'Aniko', role: 'Resident DJ' },
      { name: 'Sounds of Ace', role: 'DJ' },
      { name: 'YURIthekitty', role: 'DJ' },
      { name: 'Sons of Ubuntu', role: 'DJ Collective' }
    ],
    lineupStatus: 'confirmed',
    archivalStatus: 'confirmed',
    confidence: 'high',
    verificationNote: 'Milestone 10th session event listing; verified artist spellings and lineup via RA event archive.',
    sourceUrls: ['https://ra.co/events/2343012'],
    isPublished: true,
    publishedAt: '2025-11-08'
  },
  {
    id: 'gt-xi',
    sessionCode: 'GT-XI',
    title: 'Group Therapy XI',
    date: '2025-12-19',
    city: 'Lagos',
    venue: null,
    branch: 'Group Therapy',
    description: 'End-of-year 2025 session exploring intense sub-bass warmth and collective dancer synchronization.',
    artists: [],
    lineupStatus: 'pending',
    archivalStatus: 'awaiting_verification',
    confidence: 'low',
    verificationNote: 'Awaiting verified lineup records from promoter archive.',
    sourceUrls: [],
    isPublished: true,
    publishedAt: '2025-12-20'
  },
  {
    id: 'gt-xii',
    sessionCode: 'GT-XII',
    title: 'Group Therapy XII',
    date: '2026-02-27',
    city: 'Lagos',
    venue: 'Livespot Entertainment Centre, Lekki',
    branch: 'Group Therapy',
    description: 'A relentless late-night exploration of electronic underground rhythm with published recordings across international archives.',
    artists: [
      { name: 'Aniko', role: 'Resident DJ', association: 'resident performance' },
      { name: 'Jazzwrld & Thukuthela', role: 'Recorded DJ Set', association: 'published session recording' },
      { name: 'Abiodun', role: 'Recorded DJ Set', association: 'published session recording' },
      { name: 'SoundsofAce', role: 'Recorded DJ Set', association: 'published session recording' },
      { name: 'Azzi on the Beat', role: 'Recorded DJ Set', association: 'published session recording' },
      { name: 'Earthsurfing', role: 'Recorded DJ Set', association: 'published session recording' },
      { name: '2P2E', role: 'Recorded DJ Set', association: 'published session recording' }
    ],
    lineupStatus: 'recorded_only',
    archivalStatus: 'confirmed',
    confidence: 'medium',
    verificationNote: 'Artist list is based on published recordings and resident schedule. Complete lineup verified against ViewLagos and MixMachina.',
    sourceUrls: ['https://viewlagos.ng/event/group-therapy-xii/', 'https://www.mixmachina.com/source/group-therapy/'],
    isPublished: true,
    publishedAt: '2026-02-28'
  },
  {
    id: 'gt-xiii',
    sessionCode: 'GT-XIII',
    title: 'Group Therapy XIII',
    date: '2026-05-22',
    city: 'Lagos',
    venue: null,
    branch: 'Group Therapy',
    description: 'Mid-2026 gathering focusing on polyrhythmic drum arcs and rotary acoustic tuning.',
    artists: [],
    lineupStatus: 'pending',
    archivalStatus: 'awaiting_verification',
    confidence: 'low',
    verificationNote: 'Archival verification in progress.',
    sourceUrls: [],
    isPublished: true,
    publishedAt: '2026-05-23'
  },
  {
    id: 'gt-xiv',
    sessionCode: 'GT-XIV',
    title: 'Group Therapy XIV',
    date: '2026-08-14',
    city: 'Lagos',
    venue: null,
    branch: 'Group Therapy',
    description: 'Late summer gathering tracing Nigerian electronic club movements into deeper European dub textures.',
    artists: [],
    lineupStatus: 'pending',
    archivalStatus: 'awaiting_verification',
    confidence: 'low',
    verificationNote: 'Archival records undergoing curator reconciliation.',
    sourceUrls: [],
    isPublished: true,
    publishedAt: '2026-08-15'
  },
  {
    id: 'gt-xv',
    sessionCode: 'GT-XV',
    title: 'Group Therapy XV',
    date: '2026-11-06',
    city: 'Lagos',
    venue: 'Livespot Entertainment Centre, Lekki (Pending Official Clearance)',
    branch: 'Group Therapy',
    description: 'Recent session featuring broad electronic explorations from amapiano to deep tech and experimental Nigerian club music.',
    artists: [
      { name: 'Eunice Beckman', role: 'DJ' },
      { name: 'Jamiie', role: 'Guest DJ' },
      { name: 'Naija House Mafia', role: 'Collective' },
      { name: 'Aniko', role: 'Resident DJ' },
      { name: 'Monicashflow', role: 'DJ' },
      { name: 'Oko Madam', role: 'DJ' },
      { name: 'Muri Thunder', role: 'Live / DJ' },
      { name: 'Black Elektronika', role: 'DJ Collective' },
      { name: 'WeAreAllChemicals', role: 'Resident DJ' }
    ],
    lineupStatus: 'confirmed',
    archivalStatus: 'confirmed',
    confidence: 'medium',
    verificationNote: 'Publicly advertised lineup. Official recording releases currently undergoing rights clearance.',
    sourceUrls: [],
    isPublished: true,
    publishedAt: '2026-11-07'
  }
];

export const CURATED_MATERIALS: SessionMaterial[] = [
  {
    id: 'mat-1',
    sessionId: 'gt-xii',
    artistName: 'Jazzwrld & Thukuthela',
    title: 'Jazzwrld & Thukuthela: Live Recording from GT-XII',
    type: 'dj_set',
    externalUrl: 'https://www.mixmachina.com/source/group-therapy/',
    platform: 'mixmachina',
    rightsStatus: 'official_release',
    publishedDate: '2026-03-05',
    description: 'Official recorded session set capturing the deep 2-hour transition into the peak of the night.'
  },
  {
    id: 'mat-2',
    sessionId: 'gt-xii',
    artistName: 'SoundsofAce',
    title: 'SoundsofAce: GT-XII Recorded Set',
    type: 'dj_set',
    externalUrl: 'https://www.mixmachina.com/source/group-therapy/',
    platform: 'mixmachina',
    rightsStatus: 'official_release',
    publishedDate: '2026-03-12',
    description: 'High-energy rhythmic percussions and unreleased edits.'
  },
  {
    id: 'mat-3',
    sessionId: 'gt-viii',
    artistName: 'Dlala Thukzin',
    title: 'Dlala Thukzin Headliner Highlights',
    type: 'dj_set',
    externalUrl: 'https://linktr.ee/grouptherapyng',
    platform: 'direct',
    rightsStatus: 'authorized_embed',
    publishedDate: '2025-06-01',
    description: 'Sonic highlights from the headline set at Livespot Lekki.'
  },
  {
    id: 'mat-4',
    sessionId: 'gt-v',
    artistName: 'Yosa & Aniko',
    title: 'First Anniversary B2B Archive & Tracklist',
    type: 'tracklist',
    externalUrl: 'https://ra.co/events/2170672',
    platform: 'resident_advisor',
    rightsStatus: 'official_release',
    publishedDate: '2024-09-02',
    description: 'Curated tracklist and historical archive notes from the first anniversary session.'
  },
  {
    id: 'mat-5',
    sessionId: 'gt-xv',
    artistName: 'Group Therapy Archive',
    title: 'Group Therapy XV: Visual Recap & Photo Archive',
    type: 'gallery',
    externalUrl: 'https://linktr.ee/grouptherapyng',
    platform: 'direct',
    rightsStatus: 'authorized_embed',
    publishedDate: '2026-11-12',
    description: 'Selected authorized event photographs capturing the crowd and room ambience.'
  }
];

export const CURATED_RELATED_SESSIONS: RelatedSessionRef[] = [
  {
    id: 'rel-1',
    sessionId: 'gt-xii',
    relatedSessionId: 'gt-viii',
    relatedTitle: 'Group Therapy VIII',
    relatedCode: 'GT-VIII',
    relatedDate: '2025-05-23',
    relationshipType: 'shared_artist',
    explanation: 'Shared presence of Abiodun and sonic continuity in deep, driving Afro-tech transitions at Livespot.'
  },
  {
    id: 'rel-2',
    sessionId: 'gt-xii',
    relatedSessionId: 'gt-x',
    relatedTitle: 'Group Therapy X',
    relatedCode: 'GT-X',
    relatedDate: '2025-11-07',
    relationshipType: 'musical_direction',
    explanation: 'Exploration of dense rhythmic percussions and bassline weight established during Session X.'
  },
  {
    id: 'rel-3',
    sessionId: 'gt-v',
    relatedSessionId: 'gt-iv',
    relatedTitle: 'Group Therapy IV',
    relatedCode: 'GT-IV',
    relatedDate: '2024-05-03',
    relationshipType: 'milestone',
    explanation: 'Direct foundational predecessor that shaped the anniversary curation and resident B2B pairings.'
  },
  {
    id: 'rel-4',
    sessionId: 'gt-xv',
    relatedSessionId: 'gt-v',
    relatedTitle: 'Group Therapy V (First Anniversary)',
    relatedCode: 'GT-V',
    relatedDate: '2024-08-24',
    relationshipType: 'shared_artist',
    explanation: 'Continuous resident leadership from Aniko and WeAreAllChemicals connecting early sessions to recent history.'
  }
];

export const REFLECTION_PROMPTS = [
  "The exact moment the room shifted: a tempo drop, a breakdown, or an unreleased rhythm.",
  "Floor chemistry & unspoken etiquette: navigating crowd energy while protecting personal space.",
  "Nighttime intentions vs. daybreak reality: how the session unraveled from dusk till sunrise.",
  "The somatic memory: what the sub-bass pressure felt like in your chest hours later.",
  "Resident reverence: observing the booth from deep in the crowd as the sound took command."
];

export interface PolaroidPreset {
  id: string;
  name: string;
  imageUrl: string;
  defaultCaption: string;
}

export const POLAROID_PRESETS: PolaroidPreset[] = [
  {
    id: 'preset-strobes',
    name: 'Laser Fog & Strobes',
    imageUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%"><rect width="400" height="400" fill="%23080b08"/><defs><radialGradient id="smk" cx="50%" cy="60%" r="60%"><stop offset="0%" stop-color="%2304e539" stop-opacity="0.35"/><stop offset="60%" stop-color="%23152018" stop-opacity="0.6"/><stop offset="100%" stop-color="%23050805" stop-opacity="1"/></radialGradient><linearGradient id="lzr" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%23ffffff" stop-opacity="0.95"/><stop offset="40%" stop-color="%2304e539" stop-opacity="0.8"/><stop offset="100%" stop-color="%2304e539" stop-opacity="0"/></linearGradient></defs><rect width="400" height="400" fill="url(%23smk)"/><polygon points="200,0 60,400 80,400" fill="url(%23lzr)" opacity="0.85"/><polygon points="200,0 170,400 200,400" fill="url(%23lzr)" opacity="0.95"/><polygon points="200,0 310,400 340,400" fill="url(%23lzr)" opacity="0.75"/><circle cx="200" cy="180" r="140" fill="%2304e539" opacity="0.08"/><text x="24" y="375" fill="%2304e539" font-family="monospace" font-size="11" letter-spacing="2">GT-XII // 03:40 AM LASER HAZE</text></svg>`,
    defaultCaption: 'Strobes cutting through the haze // 03:40 AM'
  },
  {
    id: 'preset-cdjs',
    name: 'Resident Booth / Rotary Mixer',
    imageUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%"><rect width="400" height="400" fill="%230a0a0a"/><circle cx="200" cy="200" r="140" fill="%23141614" stroke="%23222" stroke-width="4"/><circle cx="200" cy="200" r="120" fill="%230d0f0d" stroke="%2304e539" stroke-width="1" stroke-dasharray="4,4"/><circle cx="200" cy="200" r="50" fill="%231b241c" stroke="%2304e539" stroke-width="2"/><circle cx="200" cy="200" r="14" fill="%2304e539"/><g transform="translate(40, 50)"><rect x="0" y="0" width="12" height="60" fill="%23111"/><rect x="0" y="20" width="12" height="40" fill="%2304e539"/><rect x="0" y="10" width="12" height="8" fill="%23eab308"/><rect x="0" y="2" width="12" height="6" fill="%23e42335"/></g><g transform="translate(60, 50)"><rect x="0" y="0" width="12" height="60" fill="%23111"/><rect x="0" y="15" width="12" height="45" fill="%2304e539"/><rect x="0" y="8" width="12" height="5" fill="%23eab308"/><rect x="0" y="2" width="12" height="4" fill="%23e42335"/></g><text x="260" y="70" fill="%23888" font-family="monospace" font-size="10">ANIKO // BOOTH</text><text x="260" y="86" fill="%2304e539" font-family="monospace" font-size="12" font-weight="bold">128.00 BPM</text><text x="24" y="375" fill="%2304e539" font-family="monospace" font-size="11" letter-spacing="2">RESIDENT BOOTH // 3-STEP ROLL</text></svg>`,
    defaultCaption: 'Aniko locking the room into 3-step rhythm'
  },
  {
    id: 'preset-crowd',
    name: 'Dancefloor Silhouette',
    imageUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%"><rect width="400" height="400" fill="%23070908"/><defs><radialGradient id="glw" cx="50%" cy="30%" r="70%"><stop offset="0%" stop-color="%2304e539" stop-opacity="0.45"/><stop offset="50%" stop-color="%23122516" stop-opacity="0.6"/><stop offset="100%" stop-color="%23070908" stop-opacity="1"/></radialGradient></defs><rect width="400" height="400" fill="url(%23glw)"/><path d="M0,400 L0,320 Q40,310 70,335 Q100,290 130,325 Q160,270 190,320 Q220,280 250,330 Q280,260 310,320 Q340,300 370,335 Q390,315 400,320 L400,400 Z" fill="%23020302"/><path d="M150,270 Q160,210 168,200 Q176,210 178,270 Z" fill="%23020302"/><path d="M240,280 Q252,220 260,210 Q268,220 272,280 Z" fill="%23020302"/><path d="M100,310 Q110,250 118,245 Q125,255 128,310 Z" fill="%23020302"/><circle cx="200" cy="140" r="70" fill="%2304e539" opacity="0.25"/><text x="24" y="375" fill="%2304e539" font-family="monospace" font-size="11" letter-spacing="2">DANCEFLOOR // COLLECTIVE PULSE</text></svg>`,
    defaultCaption: 'The collective breathing as one organism'
  },
  {
    id: 'preset-dawn',
    name: 'Daybreak After-Hours',
    imageUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%"><defs><linearGradient id="dwn" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="%230d1b1e"/><stop offset="45%" stop-color="%232d3b36"/><stop offset="70%" stop-color="%237a5c32"/><stop offset="85%" stop-color="%23c98a3c"/><stop offset="100%" stop-color="%23141a16"/></linearGradient></defs><rect width="400" height="400" fill="url(%23dwn)"/><polygon points="0,400 0,310 120,310 120,270 220,270 280,310 400,310 400,400" fill="%23090d0b"/><circle cx="320" cy="220" r="28" fill="%23ffc87a" opacity="0.45"/><text x="24" y="375" fill="%23ffc87a" font-family="monospace" font-size="11" letter-spacing="2">06:15 AM // DAYBREAK DEPARTURE</text></svg>`,
    defaultCaption: '06:15 AM reflections outside the warehouse'
  },
  {
    id: 'preset-vinyl',
    name: 'Sound System Stack',
    imageUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%"><rect width="400" height="400" fill="%23070807"/><rect x="70" y="40" width="260" height="300" fill="%23141815" stroke="%2304e539" stroke-width="2" rx="6"/><circle cx="200" cy="120" r="55" fill="%230b0e0c" stroke="%232a382d" stroke-width="6"/><circle cx="200" cy="120" r="22" fill="%2304e539" opacity="0.85"/><circle cx="200" cy="250" r="55" fill="%230b0e0c" stroke="%232a382d" stroke-width="6"/><circle cx="200" cy="250" r="22" fill="%2304e539" opacity="0.85"/><text x="24" y="375" fill="%2304e539" font-family="monospace" font-size="11" letter-spacing="2">DUAL 18" SUBWOOFER STACK // 32HZ</text></svg>`,
    defaultCaption: 'Sub-bass pressure against the concrete'
  }
];

/**
 * SAMPLE PRIVATE THERAPY NOTES
 * Strictly personal to author Lami Adeyemi (Demo Profile).
 * Private by default. Not visible to public visitors or community feed.
 */
export const SAMPLE_PRIVATE_NOTES: PrivateTherapyNote[] = [
  {
    id: 'priv-note-aniko-gt12',
    sessionId: 'gt-xii',
    sessionCode: 'GT-XII',
    sessionTitle: 'Group Therapy XII',
    artistName: 'Aniko',
    noteType: 'dj_session_note',
    title: 'The 4:00 AM frequency shift behind the booth',
    content: `Around 3:45 AM, the character of the room inverted. There was no theatrical announcement: Aniko brought the high frequencies down to a whisper, let a lone syncopated kick roll across the floor for four bars, and pulled the floor into a focused hypnotic trance.

You could feel the collective tension break. Nobody was clutching a drink anymore; people were completely locked into the syncopation. I caught that transition into the heavy rolling sub-bass and just stood there for a second letting the low frequencies shudder through my jacket. She commanded the tempo with zero hesitation, avoiding frantic buildups in favor of raw rhythmic mastery.`,
    authorDisplayName: 'Lami Adeyemi',
    isDraft: false,
    polaroids: [
      {
        id: 'pol-1',
        imageUrl: POLAROID_PRESETS[1].imageUrl,
        caption: 'Aniko controlling the tempo // 03:50 AM',
        position: 'top-right',
        rotation: 2.5
      }
    ],
    createdAt: '2026-02-28T04:45:00Z',
    updatedAt: '2026-02-28T04:45:00Z'
  },
  {
    id: 'priv-note-dancefloor-gt15',
    sessionId: 'gt-xv',
    sessionCode: 'GT-XV',
    sessionTitle: 'Group Therapy XV',
    noteType: 'patient_note',
    title: 'Sound pressure, floor chemistry & respecting the perimeter',
    content: `Near the secondary sound stack around 2:30 AM, the haze was thick enough to turn the green strobes into solid beams. The floor was dense. Someone in front of me with silver rings and an iridescent mesh top was moving with incredible fluid rhythm to the 3-step percussions. 

The bass was rattling the concrete beneath our boots, and for a minute the intensity made you want to step right into that orbit. But I noticed their posture tighten slightly as the space grew crowded. That is the real test of being in a community like this: understanding that everyone is here to be free, not watched. I took three intentional paces back into the clearance lane, gave them full room to dance, and anchored into my own space near the wooden beam.

The dancefloor instantly felt lighter. Respect the space, always.`,
    authorDisplayName: 'Lami Adeyemi',
    isDraft: false,
    polaroids: [
      {
        id: 'pol-2',
        imageUrl: POLAROID_PRESETS[0].imageUrl,
        caption: 'Haze & green lasers // Left stack perimeter',
        position: 'top-right',
        rotation: -2
      }
    ],
    createdAt: '2026-11-07T05:15:00Z',
    updatedAt: '2026-11-07T05:15:00Z'
  }
];

/**
 * SAMPLE COMMUNITY SUBMISSIONS
 * Explicitly submitted by verified attendees for collective curation.
 * Visible only to verified members inside the community archive.
 */
export const SAMPLE_COMMUNITY_SUBMISSIONS: CommunitySubmission[] = [
  {
    id: 'comm-sub-timi-gt12',
    originalNoteId: 'note-timi-gt12',
    sessionId: 'gt-xii',
    sessionCode: 'GT-XII',
    sessionTitle: 'Group Therapy XII',
    artistName: 'Aniko',
    noteType: 'dj_session_note',
    title: 'Track ID search for the 3:10 AM rolling breakdown',
    content: `Aniko played a dubplate right before 3:15 AM that had this syncopated vocal chant repeating under a relentless 3-step groove. It drove the center circle completely wild. Submitting this to the community wall so someone can confirm whether this was an unreleased edit. That transition saved my entire week.`,
    authorDisplayName: 'Timi_Afrobeat',
    isAnonymous: false,
    includePolaroids: true,
    moderationStatus: 'approved',
    submittedAt: '2026-03-01T14:30:00Z',
    reviewedAt: '2026-03-01T18:00:00Z',
    reviewedBy: 'Staff Curator',
    pinnedByDj: true,
    isResonated: false,
    trackRequested: 'Aniko 03:15 AM Vocal Dubplate',
    tags: ['Track ID', 'Aniko', 'GT-XII', 'Dubplate'],
    djResponse: '[SIMULATED DEMO RESPONSE] Aniko (Resident DJ): That is an unreleased dubplate edit with SoundsofAce titled Lekki Haze Roll.',
    isSimulatedDemo: true,
    polaroids: [
      {
        id: 'pol-5',
        imageUrl: POLAROID_PRESETS[2].imageUrl,
        caption: 'The 3:10 AM breakdown moment',
        position: 'top-right',
        rotation: -1.8
      }
    ]
  },
  {
    id: 'comm-sub-pele-gt4',
    originalNoteId: 'note-kelechi-gt4',
    sessionId: 'gt-iv',
    sessionCode: 'GT-IV',
    sessionTitle: 'Group Therapy IV',
    artistName: 'WeAreAllChemicals',
    noteType: 'dj_session_note',
    title: 'Foundational Epiphany: When the underground became a sanctuary',
    content: `GT-IV was my first time in this space, and it reset what I expected from nightlife in Nigeria. No VIP rope barriers, no table sparklers, no one hovering around taking flash videos. Just an uncompromised sound system, dark corners, and people truly listening with their bodies.

WeAreAllChemicals played a 90-minute journey that blended deep Afro-tech with industrial European dub textures. It proved that this is more than an event brand; it is a cultural archive in motion.`,
    authorDisplayName: 'Kelechi O.',
    isAnonymous: false,
    includePolaroids: true,
    moderationStatus: 'approved',
    submittedAt: '2024-05-04T07:10:00Z',
    reviewedAt: '2024-05-04T12:00:00Z',
    reviewedBy: 'Staff Curator',
    isResonated: true,
    tags: ['Sanctuary', 'Community', 'GT-IV'],
    polaroids: [
      {
        id: 'pol-4',
        imageUrl: POLAROID_PRESETS[4].imageUrl,
        caption: 'The foundation // Group Therapy IV',
        position: 'top-left',
        rotation: -3
      }
    ]
  },
  {
    id: 'comm-sub-kemi-gt15',
    sessionId: 'gt-xv',
    sessionCode: 'GT-XV',
    sessionTitle: 'Group Therapy XV',
    noteType: 'patient_note',
    title: 'The 3-step percussive arc that took over room 2',
    content: `Around 02:45 AM, the secondary room reached complete somatic synchronization. The selector pitched down a rolling polyrhythm, and the entire perimeter locked into a collective bounce. No one was on their phone, no one was shouting over the sound system, just heavy sub-bass warmth vibrating in the chest. This community continues to prove that dancefloors can heal.`,
    authorDisplayName: 'Kemi B.',
    isAnonymous: false,
    includePolaroids: true,
    moderationStatus: 'approved',
    submittedAt: '2026-11-07T03:30:00Z',
    reviewedAt: '2026-11-07T09:00:00Z',
    reviewedBy: 'Staff Curator',
    isResonated: false,
    tags: ['Dancefloor', 'GT-XV', 'Healing'],
    polaroids: [
      {
        id: 'pol-c-1',
        imageUrl: POLAROID_PRESETS[1].imageUrl,
        caption: 'Room 2 collective pulse // 02:45 AM',
        position: 'top-right',
        rotation: 2
      }
    ]
  },
  {
    id: 'comm-sub-nia-gt12',
    sessionId: 'gt-xii',
    sessionCode: 'GT-XII',
    sessionTitle: 'Group Therapy XII',
    artistName: 'Aniko',
    noteType: 'dj_session_note',
    title: 'Analog rotary mixer acoustics near the rear column',
    content: `Spent the entire hour between 03:00 and 04:00 AM standing three feet behind the rotary mixer console. The acoustic isolation was stunning: crisp high-hat transients cutting through thick warehouse air, but with zero ear fatigue. You can tell the sound engineering team spent 14 hours tuning those phase delays.`,
    authorDisplayName: 'Nia O.',
    isAnonymous: false,
    includePolaroids: true,
    moderationStatus: 'approved',
    submittedAt: '2026-03-01T04:10:00Z',
    reviewedAt: '2026-03-01T08:00:00Z',
    reviewedBy: 'Staff Curator',
    isResonated: false,
    tags: ['SoundSystem', 'Acoustics', 'GT-XII'],
    polaroids: [
      {
        id: 'pol-c-2',
        imageUrl: POLAROID_PRESETS[3].imageUrl,
        caption: 'Rotary mixer balance // Rear column view',
        position: 'top-left',
        rotation: -1.5
      }
    ]
  },
  {
    id: 'comm-sub-marcus-gt10',
    sessionId: 'gt-x',
    sessionCode: 'GT-X',
    sessionTitle: 'Group Therapy X',
    artistName: 'Aniko',
    noteType: 'patient_note',
    title: 'First time standing directly in front of the sub stacks',
    content: `I usually stay near the back bar, but at GT-X I walked right up to the front left stack around 01:30 AM. When the sub frequencies dropped to 38Hz, you do not just hear it in your ears; your whole ribcage resonates with the groove. Total somatic release from a relentless working month.`,
    authorDisplayName: 'Anonymous Dancer',
    isAnonymous: true,
    includePolaroids: true,
    moderationStatus: 'approved',
    submittedAt: '2025-10-12T02:40:00Z',
    reviewedAt: '2025-10-12T08:00:00Z',
    reviewedBy: 'Staff Curator',
    isResonated: false,
    tags: ['GT-X', 'SubBass', 'Therapy'],
    polaroids: [
      {
        id: 'pol-c-3',
        imageUrl: POLAROID_PRESETS[0].imageUrl,
        caption: 'Perimeter lasers over front sub stack',
        position: 'top-right',
        rotation: 1.8
      }
    ]
  },
  {
    id: 'comm-sub-pending-lami',
    originalNoteId: 'priv-note-aniko-gt12',
    sessionId: 'gt-xii',
    sessionCode: 'GT-XII',
    sessionTitle: 'Group Therapy XII',
    noteType: 'patient_note',
    title: 'Dusk Checklist vs. 06:15 AM Concrete Reality',
    content: `[DUSK INTENTIONS // Logged 27/02 9:30 PM before leaving Victoria Island]
- Will I have the stamina to stay past 4:30 AM?
- Will the acoustic treatment hold up against the dual sub-bass drivers?
- Will my boots survive the warehouse floor dust?

[DAWN REALITY // Logged 28/02 06:15 AM while waiting for morning cab]
1. Stayed until house lights flickered on at 5:50 AM.
2. Low end was pristine with zero ear fatigue, just heavy somatic warmth vibrating in the chest.
3. Boots are covered in white warehouse chalk dust, a certified badge of honor.`,
    authorDisplayName: 'Lami Adeyemi',
    isAnonymous: false,
    includePolaroids: true,
    moderationStatus: 'pending',
    submittedAt: '2026-02-28T05:20:00Z',
    isResonated: false,
    tags: ['GT-XII', 'SoundSystem', 'DuskDawn'],
    polaroids: [
      {
        id: 'pol-3',
        imageUrl: POLAROID_PRESETS[3].imageUrl,
        caption: '06:15 AM curb // Boots coated in warehouse dust',
        position: 'bottom-right',
        rotation: 1.5
      }
    ]
  },
  {
    id: 'comm-sub-flagged-promo',
    sessionId: 'gt-xv',
    sessionCode: 'GT-XV',
    sessionTitle: 'Group Therapy XV',
    noteType: 'patient_note',
    title: 'Unofficial VIP afterparty wristbands available',
    content: `Selling unauthorized wristbands and drink tokens for an after-hours hotel suite near Lekki. Contact telegram handle for fast transfer.`,
    authorDisplayName: 'Club_Scalper_99',
    isAnonymous: false,
    includePolaroids: false,
    moderationStatus: 'pending',
    isFlagged: true,
    flagReason: 'Commercial promotion and unauthorized ticket resale reported by community',
    submittedAt: '2026-11-08T03:00:00Z',
    isResonated: false,
    tags: ['Flagged']
  }
];

// Backward-compatible export mapping
export const SAMPLE_THERAPY_NOTES: TherapyNote[] = [
  ...SAMPLE_PRIVATE_NOTES.map(n => ({
    ...n,
    visibility: 'private' as const,
    submissionStatus: 'none' as const,
    moderationStatus: 'none' as const
  })),
  ...SAMPLE_COMMUNITY_SUBMISSIONS.map(s => ({
    ...s,
    id: s.id,
    visibility: 'public_submission' as const,
    submissionStatus: s.moderationStatus === 'pending' ? 'pending' as const : 'approved' as const,
    isDraft: false,
    createdAt: s.submittedAt,
    updatedAt: s.submittedAt
  }))
];

export const DEFAULT_NOTE_REPORTS: NoteReport[] = [
  {
    id: 'report-1',
    noteId: 'comm-sub-flagged-promo',
    noteTitle: 'Unofficial VIP afterparty wristbands available',
    noteSnippet: 'Selling unauthorized wristbands and drink tokens for an after-hours hotel suite near Lekki...',
    reason: 'spam',
    reasonText: 'Commercial advertising and unofficial ticket/wristband resale',
    reportedBy: 'Lami Adeyemi',
    reportedAt: '2026-11-08T04:15:00Z',
    details: 'This user is trying to scalp unauthorized access passes in community notes.',
    status: 'pending_review'
  },
  {
    id: 'report-2',
    noteId: 'comm-sub-marcus-gt10',
    noteTitle: 'First time standing directly in front of the sub stacks',
    noteSnippet: 'I usually stay near the back bar, but at GT-X I walked right up to the front left stack...',
    reason: 'other',
    reasonText: 'Accidental report submitted during interface testing',
    reportedBy: 'Demo Attendee',
    reportedAt: '2026-10-15T11:20:00Z',
    details: 'User tapped flag by mistake. Reflection contains positive community feedback.',
    status: 'dismissed',
    resolvedAt: '2026-10-15T12:00:00Z',
    resolvedBy: 'Staff Curator',
    resolutionNotes: 'No guideline violation found; reflection kept active in Community Archive.'
  }
];

export const DEFAULT_TRACK_INQUIRIES: TrackIdInquiry[] = [
  {
    id: 'inquiry-gt12-1',
    sessionId: 'gt-xii',
    sessionTitle: 'Group Therapy XII',
    sessionCode: 'GT-XII',
    timestampApprox: '03:15 AM',
    description: 'What was that unreleased dubplate Aniko played right before the 3-step transition? It had a repeating syncopated vocal chant.',
    submittedBy: 'Lami Adeyemi',
    createdAt: '2026-03-01T10:15:00Z',
    djResponse: '[SIMULATED DEMO RESPONSE] Aniko (Resident DJ): That was an unreleased VIP edit of Aniko - Pulse Drift (Dub Mix). Kept exclusively for late-night resident sets.',
    respondedBy: 'Aniko (Resident DJ)',
    respondedAt: '2026-03-02T16:30:00Z',
    isSimulatedDemo: true,
    status: 'answered'
  },
  {
    id: 'inquiry-gt15-1',
    sessionId: 'gt-xv',
    sessionTitle: 'Group Therapy XV',
    sessionCode: 'GT-XV',
    timestampApprox: '02:45 AM',
    description: 'Heavy bassline rollout when the green lasers shifted to strobe mode near the left stack. Need the track ID or artist name!',
    submittedBy: 'Dancefloor Explorer',
    createdAt: '2026-11-08T05:30:00Z',
    status: 'unanswered'
  }
];

/**
 * Predictable Attendance & Ticket Demonstration Scenarios
 * Demonstrates the six core scenarios required by product alignment.
 */
export const DEFAULT_ATTENDANCE_SCENARIOS: AttendanceScenario[] = [
  {
    id: 'scen-lami',
    name: 'Lami Adeyemi (Sample Patient)',
    persona: 'patient',
    email: 'lami@grouptherapy.live',
    title: 'Purchaser Attended & Verified at Door',
    purchaseSummary: '1 Ticket purchased via Tix Africa for GT-XII and GT-XV',
    doorCheckInSummary: 'Verified physical door scans recorded at GT-XII (01:30 AM) and GT-XV (11:15 PM)',
    eligibilityStatus: 'Verified Patient',
    explanation: 'Both ticket purchase and physical door scan verified. Qualifies for full patient privileges across attended sessions.'
  },
  {
    id: 'scen-group',
    name: 'Chidi Okafor (Group Buyer)',
    persona: 'patient',
    email: 'chidi@grouptherapy.live',
    title: 'Group Purchase with Individual Claim Passes',
    purchaseSummary: '3 Tickets purchased under 1 email for GT-XV',
    doorCheckInSummary: '3 Distinct physical barcodes scanned at the door',
    eligibilityStatus: 'Verified Patient',
    explanation: 'Purchaser claims 1 physical attendance pass for themselves. System generated 2 invite claim links for their companions so only scanned attendees become patients.'
  },
  {
    id: 'scen-noshow',
    name: 'Alex Morgan (No-Show Purchaser)',
    persona: 'follower',
    email: 'alex@grouptherapy.live',
    title: 'Purchased Ticket but Did Not Attend',
    purchaseSummary: '1 Ticket purchased on Tix Africa for GT-VIII',
    doorCheckInSummary: 'No door check-in scan recorded during event hours',
    eligibilityStatus: 'Community Follower',
    explanation: 'Financial purchase alone does not grant patient status. Remains a registered Community Follower with access to public archives and follow updates.'
  },
  {
    id: 'scen-guestlist',
    name: 'Ngozi Eze (Guest List Attendee)',
    persona: 'patient',
    email: 'ngozi@grouptherapy.live',
    title: 'Door Guest List Check-in Verified',
    purchaseSummary: 'Complimentary promoter / artist guest list allocation',
    doorCheckInSummary: 'Verified check-in recorded on door manager guestlist tablet at GT-X',
    eligibilityStatus: 'Verified Patient',
    explanation: 'Physical presence in the room verified via door staff check-in. Receives full patient privileges regardless of zero commercial purchase.'
  },
  {
    id: 'scen-cash',
    name: 'Tunde Bakare (Historical Cash Entry)',
    persona: 'follower',
    email: 'tunde@grouptherapy.live',
    title: 'Historical Attendance Claim (GT-IV Cash Entry)',
    purchaseSummary: 'Cash door entry at Ultima Studios (2024)',
    doorCheckInSummary: 'No digital check-in; manual claim submitted with wristband photo',
    eligibilityStatus: 'Awaiting Curator Review',
    explanation: 'Historical claim submitted to Curator Terminal. Awaiting staff review before verified patient status is granted.'
  },
  {
    id: 'scen-linked-email',
    name: 'Lami Adeyemi (Secondary Email Linked)',
    persona: 'patient',
    email: 'lami.work@gmail.com',
    title: 'Secondary Purchase Email Linked via OTP',
    purchaseSummary: 'Historical ticket purchased under corporate email address',
    doorCheckInSummary: 'OTP verified ownership of secondary email; attendance linked to primary account',
    eligibilityStatus: 'Verified Patient',
    explanation: 'Dancer retains unified immutable account while consolidating tickets from multiple email addresses.'
  }
];
