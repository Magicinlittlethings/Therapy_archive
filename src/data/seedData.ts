import { Session, SessionMaterial, RelatedSessionRef, TherapyNote, NoteReport, TrackIdInquiry } from '../types';

export const CURATED_SESSIONS: Session[] = [
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
    confidence: 'medium',
    verificationNote: 'Historical event listing verified against resident archive; spellings and lineup confirmed.',
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
    confidence: 'medium',
    verificationNote: 'Historical anniversary listing; Yosa B2B Aniko verified against RA event archive.',
    sourceUrls: ['https://ra.co/events/2170672'],
    isPublished: true,
    publishedAt: '2024-08-25'
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
    confidence: 'medium',
    verificationNote: 'Historical event and recording references verified through official GT channels and RA.',
    sourceUrls: ['https://ra.co/events/2168551', 'https://linktr.ee/grouptherapyng'],
    isPublished: true,
    publishedAt: '2025-05-24'
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
    confidence: 'medium',
    verificationNote: 'Milestone 10th session event listing; verified artist spellings and lineup via event archive.',
    sourceUrls: ['https://ra.co/events/2343012'],
    isPublished: true,
    publishedAt: '2025-11-08'
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
    confidence: 'medium',
    verificationNote: 'Artist list is based on published recordings and resident schedule. Complete lineup pending official announcement.',
    sourceUrls: ['https://viewlagos.ng/event/group-therapy-xii/', 'https://www.mixmachina.com/source/group-therapy/'],
    isPublished: true,
    publishedAt: '2026-02-28'
  },
  {
    id: 'gt-xv',
    sessionCode: 'GT-XV',
    title: 'Group Therapy XV',
    date: '2026-11-06',
    city: 'Lagos',
    venue: null,
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
    confidence: 'medium',
    verificationNote: 'Publicly advertised lineup. Venue location and official recording releases currently undergoing verification.',
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
    title: 'SoundsofAce: GT-XII Soundboard Capture',
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
 * 100% original, evocative, culturally immersive reflections capturing
 * the visceral energy, dancefloor boundaries, and sensory rituals of Group Therapy.
 */
export const SAMPLE_THERAPY_NOTES: TherapyNote[] = [
  {
    id: 'sample-note-aniko-gt12',
    sessionId: 'gt-xii',
    sessionCode: 'GT-XII',
    sessionTitle: 'Group Therapy XII',
    artistName: 'Aniko',
    noteType: 'dj_session_note',
    title: 'The 4:00 AM frequency shift behind the booth',
    content: `Around 3:45 AM, the entire character of the room inverted. There was no theatrical announcement: Aniko simply brought the high frequencies down to a whisper, let a lone syncopated kick roll across the floor for four bars, and pulled the floor into a focused hypnotic trance.
    
You could feel the collective tension break. Nobody was clutching a drink anymore; people were completely locked into the syncopation. I caught that transition into the heavy rolling sub-bass and just stood there for a second letting the low frequencies shudder through my jacket. She commanded the tempo with zero hesitation, avoiding frantic buildups in favor of raw rhythmic mastery. By the time the lights flickered blue, every person in that corner was moving on the same count.`,
    visibility: 'private',
    submissionStatus: 'none',
    moderationStatus: 'none',
    authorDisplayName: 'Lami Adeyemi',
    isDraft: false,
    likesCount: 0,
    tags: ['Aniko', '3-Step', 'Booth'],
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
    id: 'sample-note-dancefloor-gt15',
    sessionId: 'gt-xv',
    sessionCode: 'GT-XV',
    sessionTitle: 'Group Therapy XV',
    noteType: 'patient_note',
    title: 'Sound pressure, floor chemistry & respecting the perimeter',
    content: `Near the secondary sound stack around 2:30 AM, the haze was thick enough to turn the green strobes into solid beams. The floor was dense. Someone in front of me with silver rings and an iridescent mesh top was moving with incredible fluid rhythm to the 3-step percussions. 

The bass was rattling the concrete beneath our boots, and for a minute the intensity made you want to step right into that orbit. But I noticed their posture tighten slightly as the space grew crowded. That is the real test of being in a community like this: understanding that everyone is here to be free, not watched. I took three intentional paces back into the clearance lane, gave them full room to dance, and anchored into my own space near the wooden beam.

The dancefloor instantly felt lighter. When we crossed paths near the water cooler an hour later, they gave me that subtle nod of acknowledgment that means everything in nightlife culture. Respect the space, always.`,
    visibility: 'private',
    submissionStatus: 'none',
    moderationStatus: 'none',
    authorDisplayName: 'Lami Adeyemi',
    isDraft: false,
    likesCount: 0,
    tags: ['Dancefloor', 'GT-XV', 'Healing'],
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
  },
  {
    id: 'sample-note-pending-gt12',
    sessionId: 'gt-xii',
    sessionCode: 'GT-XII',
    sessionTitle: 'Group Therapy XII',
    artistName: 'Aniko',
    noteType: 'dj_session_note',
    title: 'Track ID search for the 3:10 AM rolling breakdown',
    content: `Aniko played a dubplate right before 3:15 AM that had this syncopated vocal chant repeating under a relentless 3-step groove. It drove the center circle completely wild. 

Submitting this to the community wall so either Aniko or someone who stood near the monitors can confirm whether this was an unreleased edit or an official release. That transition saved my entire week.`,
    visibility: 'public_submission',
    submissionStatus: 'approved',
    moderationStatus: 'approved',
    authorDisplayName: 'Timi_Afrobeat',
    isSimulatedDemo: true,
    isDraft: false,
    likesCount: 92,
    trackRequested: 'Aniko 03:15 AM Vocal Dubplate',
    tags: ['Track ID', 'Aniko', 'GT-XII', 'Dubplate'],
    djResponse: 'Aniko (Resident DJ): That is an unreleased dubplate edit with SoundsofAce titled Lekki Haze Roll. Official soundboard master is coming to the archive soon.',
    polaroids: [
      {
        id: 'pol-5',
        imageUrl: POLAROID_PRESETS[2].imageUrl,
        caption: 'The 3:10 AM breakdown moment',
        position: 'top-right',
        rotation: -1.8
      }
    ],
    createdAt: '2026-03-01T14:30:00Z',
    updatedAt: '2026-03-01T14:30:00Z'
  },
  {
    id: 'sample-note-pre-post-gt12',
    sessionId: 'gt-xii',
    sessionCode: 'GT-XII',
    sessionTitle: 'Group Therapy XII',
    noteType: 'patient_note',
    title: 'Dusk Checklist vs. 06:15 AM Concrete Reality',
    content: `[DUSK INTENTIONS // Logged 27/02 9:30 PM before leaving Victoria Island]
Will I have the stamina to stay past 4:30 AM?
Will the acoustic treatment hold up against the dual sub-bass drivers?
Will I make genuine conversation or get lost in my own head?
Will my boots survive the warehouse floor dust?

[DAWN REALITY // Logged 28/02 06:15 AM while waiting for the morning cab]
Back with daybreak answers:
1. Stayed until the house lights flickered on at 5:50 AM. Second wind kicked in around 3:15 AM and carried me through.
2. The low end was pristine with zero ear fatigue, just heavy somatic warmth vibrating in the chest plate.
3. Ended up sharing an energy drink with two strangers by the chillout deck and talking about unreleased South African bootlegs for an hour.
4. Boots are covered in white warehouse chalk dust, a certified badge of honor.
5. The sonic continuity between the opening ambient selector and Aniko closer was flawless.`,
    visibility: 'public_submission',
    submissionStatus: 'pending',
    moderationStatus: 'pending',
    authorDisplayName: 'Lami Adeyemi',
    isDraft: false,
    likesCount: 0,
    tags: ['Following', 'GT-XII', 'SoundSystem'],
    polaroids: [
      {
        id: 'pol-3',
        imageUrl: POLAROID_PRESETS[3].imageUrl,
        caption: '06:15 AM curb // Boots coated in warehouse dust',
        position: 'bottom-right',
        rotation: 1.5
      }
    ],
    createdAt: '2026-02-28T05:20:00Z',
    updatedAt: '2026-02-28T05:20:00Z'
  },
  {
    id: 'sample-note-community-gt4',
    sessionId: 'gt-iv',
    sessionCode: 'GT-IV',
    sessionTitle: 'Group Therapy IV',
    artistName: 'WeAreAllChemicals',
    noteType: 'dj_session_note',
    title: 'Foundational Epiphany: When the underground became a sanctuary',
    content: `GT-IV was my first time in this space, and it reset what I expected from nightlife in Nigeria. No VIP rope barriers, no table sparklers, no one hovering around taking flash videos. Just an uncompromised sound system, dark corners, and people truly listening with their bodies.

WeAreAllChemicals played a 90-minute journey that blended deep Afro-tech with industrial European dub textures. It proved that this is more than an event brand; it is a cultural archive in motion.`,
    visibility: 'public_submission',
    moderationStatus: 'approved',
    authorDisplayName: 'Kelechi O.',
    isDraft: false,
    likesCount: 312,
    tags: ['Recommended', 'Sanctuary', 'Community', 'GT-IV'],
    polaroids: [
      {
        id: 'pol-4',
        imageUrl: POLAROID_PRESETS[4].imageUrl,
        caption: 'The foundation // Group Therapy IV',
        position: 'top-left',
        rotation: -3
      }
    ],
    createdAt: '2024-05-04T07:10:00Z',
    updatedAt: '2024-05-04T07:10:00Z'
  },
  {
    id: 'sample-note-jazzwrld-gt12',
    sessionId: 'gt-xii',
    sessionCode: 'GT-XII',
    sessionTitle: 'Group Therapy XII',
    artistName: 'Jazzwrld & Thukuthela',
    noteType: 'dj_session_note',
    title: 'Track ID for the 01:45 AM deep 3-step transition',
    content: `Jazzwrld and Thukuthela laid down one of the most hypnotic percussive sets of the year. There was an afro-electronic track with sustained organ chords right around 01:45 AM that nobody in my group could identify. Can either the selectors or resident curators verify the title?`,
    visibility: 'public_submission',
    moderationStatus: 'approved',
    authorDisplayName: 'Wole_Soundboy',
    isDraft: false,
    likesCount: 78,
    trackRequested: 'Jazzwrld & Thukuthela 01:45 AM Organ Cut',
    tags: ['Track ID', 'GT-XII', 'AfroTech'],
    createdAt: '2026-03-02T11:00:00Z',
    updatedAt: '2026-03-02T11:00:00Z'
  },
  {
    id: 'community-gt15-kemi',
    sessionId: 'gt-xv',
    sessionCode: 'GT-XV',
    sessionTitle: 'Group Therapy XV',
    noteType: 'patient_note',
    title: 'The 3-step percussive arc that took over room 2',
    content: `Around 02:45 AM, the secondary room reached complete somatic synchronization. The selector pitched down a rolling polyrhythm, and the entire perimeter locked into a collective bounce. No one was on their phone, no one was shouting over the sound system, just heavy sub-bass warmth vibrating in the chest. This community continues to prove that dancefloors can heal.`,
    visibility: 'public_submission',
    moderationStatus: 'approved',
    authorDisplayName: 'Kemi B.',
    isDraft: false,
    likesCount: 215,
    tags: ['FYP', 'Dancefloor', 'GT-XV', 'Healing'],
    polaroids: [
      {
        id: 'pol-c-1',
        imageUrl: POLAROID_PRESETS[1].imageUrl,
        caption: 'Room 2 collective pulse // 02:45 AM',
        position: 'top-right',
        rotation: 2
      }
    ],
    createdAt: '2026-11-07T03:30:00Z',
    updatedAt: '2026-11-07T03:30:00Z'
  },
  {
    id: 'community-gt12-nia',
    sessionId: 'gt-xii',
    sessionCode: 'GT-XII',
    sessionTitle: 'Group Therapy XII',
    artistName: 'Aniko',
    noteType: 'dj_session_note',
    title: 'Analog rotary mixer acoustics near the rear column',
    content: `Spent the entire hour between 03:00 and 04:00 AM standing three feet behind the rotary mixer console. The acoustic isolation was stunning: crisp high-hat transients cutting through thick warehouse air, but with zero ear fatigue. You can tell the sound engineering team spent 14 hours tuning those phase delays.`,
    visibility: 'public_submission',
    moderationStatus: 'approved',
    authorDisplayName: 'Nia O.',
    isDraft: false,
    likesCount: 88,
    tags: ['Following', 'SoundSystem', 'Acoustics', 'GT-XII'],
    polaroids: [
      {
        id: 'pol-c-2',
        imageUrl: POLAROID_PRESETS[3].imageUrl,
        caption: 'Rotary mixer balance // Rear column view',
        position: 'top-left',
        rotation: -1.5
      }
    ],
    createdAt: '2026-03-01T04:10:00Z',
    updatedAt: '2026-03-01T04:10:00Z'
  },
  {
    id: 'community-gt10-marcus',
    sessionId: 'gt-x',
    sessionCode: 'GT-X',
    sessionTitle: 'Group Therapy X',
    artistName: 'Aniko',
    noteType: 'patient_note',
    title: 'First time standing directly in front of the sub stacks',
    content: `I usually stay near the back bar, but at GT-X I walked right up to the front left stack around 01:30 AM. When the sub frequencies dropped to 38Hz, you do not just hear it in your ears; your whole ribcage resonates with the groove. Total somatic release from a relentless working month.`,
    visibility: 'public_submission',
    moderationStatus: 'approved',
    authorDisplayName: 'Marcus K.',
    isDraft: false,
    likesCount: 167,
    tags: ['Recommended', 'GT-X', 'SubBass', 'Therapy'],
    polaroids: [
      {
        id: 'pol-c-3',
        imageUrl: POLAROID_PRESETS[0].imageUrl,
        caption: 'Perimeter lasers over the front sub stack',
        position: 'top-right',
        rotation: 1.8
      }
    ],
    createdAt: '2025-10-12T02:40:00Z',
    updatedAt: '2025-10-12T02:40:00Z'
  },
  {
    id: 'community-gt5-amina',
    sessionId: 'gt-v',
    sessionCode: 'GT-V',
    sessionTitle: 'Group Therapy V',
    artistName: 'Yosa B2B Aniko',
    noteType: 'dj_session_note',
    title: 'The anniversary transition into European dub textures',
    content: `The Yosa B2B Aniko set at GT-V was the defining moment of the first anniversary. When they bridged the raw percussive swing with stripped-back Berlin dub techno chords, the energy in the room went completely silent before detonating. An archival masterclass.`,
    visibility: 'public_submission',
    moderationStatus: 'approved',
    authorDisplayName: 'Amina D.',
    isDraft: false,
    likesCount: 294,
    tags: ['Recommended', 'Anniversary', 'GT-V', 'Yosa', 'Aniko'],
    polaroids: [
      {
        id: 'pol-c-4',
        imageUrl: POLAROID_PRESETS[4].imageUrl,
        caption: 'First anniversary master set // GT-V',
        position: 'top-left',
        rotation: -2.2
      }
    ],
    createdAt: '2024-08-25T05:00:00Z',
    updatedAt: '2024-08-25T05:00:00Z'
  },
  {
    id: 'community-gt15-soji',
    sessionId: 'gt-xv',
    sessionCode: 'GT-XV',
    sessionTitle: 'Group Therapy XV',
    artistName: 'Aniko',
    noteType: 'dj_session_note',
    title: 'Track ID request: Afro-acid vocal snippet at 04:20 AM',
    content: `Desperately searching for the 303 acid line track layered under Yoruba spoken word right at peak hour. The blend was seamless, and the crowd lost their minds when the filter opened up. Does anyone know the title?`,
    visibility: 'public_submission',
    moderationStatus: 'approved',
    authorDisplayName: 'Soji R.',
    isDraft: false,
    likesCount: 110,
    trackRequested: '04:20 AM Acid Yoruba Cut',
    djResponse: 'Aniko (Resident DJ): That is an exclusive live blend of a Slikback loop over an archival spoken word tape. Recorded straight to soundboard DAT.',
    tags: ['Track ID', 'GT-XV', 'Acid', 'Dubplate'],
    createdAt: '2026-11-07T06:00:00Z',
    updatedAt: '2026-11-07T06:00:00Z'
  },
  {
    id: 'community-gt4-elena',
    sessionId: 'gt-iv',
    sessionCode: 'GT-IV',
    sessionTitle: 'Group Therapy IV',
    artistName: 'WeAreAllChemicals',
    noteType: 'patient_note',
    title: 'Midnight floor etiquette & shared water cups',
    content: `What makes Group Therapy special is the mutual care. When someone accidentally bumped into me on the turn, they did not just apologize; they offered me water and made sure I had space to recover my rhythm. True underground sanctuary culture.`,
    visibility: 'public_submission',
    moderationStatus: 'approved',
    authorDisplayName: 'Elena S.',
    isDraft: false,
    likesCount: 198,
    tags: ['Sanctuary', 'Community', 'GT-IV'],
    createdAt: '2024-05-04T02:15:00Z',
    updatedAt: '2024-05-04T02:15:00Z'
  },
  {
    id: 'community-gt8-zack',
    sessionId: 'gt-viii',
    sessionCode: 'GT-VIII',
    sessionTitle: 'Group Therapy VIII',
    artistName: 'Aniko',
    noteType: 'dj_session_note',
    title: 'Percussive layers: when the cowbell locked in with the 3-step kick',
    content: `The polyrhythms were so intricate that you could pick any one percussion layer and follow it with your feet. The balance between the metallic tops and the warm sub bottom was the cleanest live mixing I have witnessed all year.`,
    visibility: 'public_submission',
    moderationStatus: 'approved',
    authorDisplayName: 'Zack T.',
    isDraft: false,
    likesCount: 124,
    tags: ['Following', 'Polyrhythms', 'GT-VIII', 'Percussion'],
    polaroids: [
      {
        id: 'pol-c-5',
        imageUrl: POLAROID_PRESETS[1].imageUrl,
        caption: '03:10 AM percussive lock // GT-VIII',
        position: 'top-right',
        rotation: 1.2
      }
    ],
    createdAt: '2025-05-18T04:20:00Z',
    updatedAt: '2025-05-18T04:20:00Z'
  },
  {
    id: 'community-gt12-femi',
    sessionId: 'gt-xii',
    sessionCode: 'GT-XII',
    sessionTitle: 'Group Therapy XII',
    noteType: 'patient_note',
    title: 'Sunrise 05:45 AM light through warehouse rafters',
    content: `Stepping outside as the morning humidity met the cool air. Still humming with sub-bass frequencies in the chest. That sunrise walk to catch the cab across the bridge while the last 3-step echoes in your headphones is unmatched.`,
    visibility: 'public_submission',
    moderationStatus: 'approved',
    authorDisplayName: 'Femi W.',
    isDraft: false,
    likesCount: 230,
    tags: ['Sunrise', 'GT-XII', 'Dawn', 'Healing'],
    polaroids: [
      {
        id: 'pol-c-6',
        imageUrl: POLAROID_PRESETS[3].imageUrl,
        caption: '05:45 AM daylight through the rafters',
        position: 'bottom-right',
        rotation: -2.5
      }
    ],
    createdAt: '2026-02-28T06:00:00Z',
    updatedAt: '2026-02-28T06:00:00Z'
  },
  {
    id: 'community-gt15-chuka',
    sessionId: 'gt-xv',
    sessionCode: 'GT-XV',
    sessionTitle: 'Group Therapy XV',
    noteType: 'patient_note',
    title: 'Respecting dancer personal space near the monitors',
    content: `Shoutout to everyone in the center circle who gave each other room to express themselves without crowding or filming. That mutual respect is why we keep coming back to these sessions. No ego, just sound and movement.`,
    visibility: 'public_submission',
    moderationStatus: 'approved',
    authorDisplayName: 'Chuka E.',
    isDraft: false,
    likesCount: 175,
    tags: ['Etiquette', 'GT-XV', 'Dancefloor'],
    createdAt: '2026-11-07T04:45:00Z',
    updatedAt: '2026-11-07T04:45:00Z'
  },
  {
    id: 'community-gt1-nnamdi',
    sessionId: 'gt-i',
    sessionCode: 'GT-I',
    sessionTitle: 'Group Therapy I',
    artistName: 'Aniko',
    noteType: 'dj_session_note',
    title: 'Foundational archive: the day Group Therapy started',
    content: `Only 60 people in a concrete room with a rented PA system, but you could tell immediately this was going to evolve into something profound. Re-listening to the original soundboard tape today brings back every drop of sweat.`,
    visibility: 'public_submission',
    moderationStatus: 'approved',
    authorDisplayName: 'Nnamdi K.',
    isDraft: false,
    likesCount: 340,
    tags: ['Recommended', 'Archive', 'GT-I', 'Foundations'],
    polaroids: [
      {
        id: 'pol-c-7',
        imageUrl: POLAROID_PRESETS[4].imageUrl,
        caption: 'The original 60 dancers // Group Therapy I',
        position: 'top-left',
        rotation: -1.5
      }
    ],
    createdAt: '2023-08-13T06:00:00Z',
    updatedAt: '2023-08-13T06:00:00Z'
  },
  {
    id: 'community-gt2-folake',
    sessionId: 'gt-ii',
    sessionCode: 'GT-II',
    sessionTitle: 'Group Therapy II',
    artistName: 'WeAreAllChemicals',
    noteType: 'dj_session_note',
    title: 'Track ID search: 02:30 AM rolling sub-bass dubplate',
    content: `Can anyone ID the minimal rolling percussion track that played right before the 03:00 AM tempo drop? The bassline was just three sustained notes with an echo delay.`,
    visibility: 'public_submission',
    moderationStatus: 'approved',
    authorDisplayName: 'Folake A.',
    isDraft: false,
    likesCount: 95,
    trackRequested: '02:30 AM Minimal Bass Roller',
    djResponse: 'WeAreAllChemicals: That was an unreleased dub of ours from 2023. Glad someone remembered that moment!',
    tags: ['Track ID', 'GT-II', 'Dub'],
    createdAt: '2023-11-19T03:00:00Z',
    updatedAt: '2023-11-19T03:00:00Z'
  },
  {
    id: 'community-gt5-yosa',
    sessionId: 'gt-v',
    sessionCode: 'GT-V',
    sessionTitle: 'Group Therapy V',
    artistName: 'Yosa B2B Aniko',
    noteType: 'dj_session_note',
    title: 'The legendary Yosa B2B Aniko 4-hour set review',
    content: `Four continuous hours of master-level curation. The chemistry between Yosa and Aniko behind the rotary mixer was telepathic. Neither of them rushed a blend; every transition felt like it was written together months in advance.`,
    visibility: 'public_submission',
    moderationStatus: 'approved',
    authorDisplayName: 'Yosa Fan Club',
    isDraft: false,
    likesCount: 280,
    tags: ['Yosa', 'Aniko', 'B2B', 'GT-V'],
    polaroids: [
      {
        id: 'pol-c-8',
        imageUrl: POLAROID_PRESETS[2].imageUrl,
        caption: 'Yosa & Aniko deep in the 4-hour set',
        position: 'top-right',
        rotation: 2.1
      }
    ],
    createdAt: '2024-08-25T07:15:00Z',
    updatedAt: '2024-08-25T07:15:00Z'
  },
  {
    id: 'community-gt10-sub',
    sessionId: 'gt-x',
    sessionCode: 'GT-X',
    sessionTitle: 'Group Therapy X',
    noteType: 'patient_note',
    title: 'Somatic frequency therapy in a dark warehouse',
    content: `Had the roughest corporate work week of my life. 3 hours on this dancefloor completely decoupled the stress from my nervous system. Electronic music as genuine collective therapy.`,
    visibility: 'public_submission',
    moderationStatus: 'approved',
    authorDisplayName: 'Sub-Bass Seeker',
    isDraft: false,
    likesCount: 310,
    tags: ['FYP', 'Therapy', 'Healing', 'GT-X', 'Somatic'],
    polaroids: [
      {
        id: 'pol-c-9',
        imageUrl: POLAROID_PRESETS[0].imageUrl,
        caption: 'Sound wave decompression // GT-X',
        position: 'top-right',
        rotation: -1.7
      }
    ],
    createdAt: '2025-10-12T04:50:00Z',
    updatedAt: '2025-10-12T04:50:00Z'
  },
  {
    id: 'sample-note-flagged-promo',
    sessionId: 'gt-xv',
    sessionCode: 'GT-XV',
    sessionTitle: 'Group Therapy XV',
    noteType: 'patient_note',
    title: 'Unofficial VIP afterparty wristbands available',
    content: `Selling unauthorized wristbands and drink tokens for an after-hours hotel suite near Lekki. Contact telegram handle for fast transfer.`,
    visibility: 'public_submission',
    moderationStatus: 'pending',
    isFlagged: true,
    flagReason: 'Commercial promotion and unauthorized ticket resale reported by community',
    authorDisplayName: 'Club_Scalper_99',
    isDraft: false,
    likesCount: 1,
    tags: ['Flagged'],
    createdAt: '2026-11-08T03:00:00Z',
    updatedAt: '2026-11-08T03:00:00Z'
  }
];

export const DEFAULT_NOTE_REPORTS: NoteReport[] = [
  {
    id: 'report-1',
    noteId: 'sample-note-flagged-promo',
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
    noteId: 'community-gt10-sub',
    noteTitle: 'Somatic frequency therapy in a dark warehouse',
    noteSnippet: 'Had the roughest corporate work week of my life. 3 hours on this dancefloor...',
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
    djResponse: '[SIMULATED DEMO RESPONSE] That was an unreleased VIP edit of Aniko - Pulse Drift (Dub Mix). Kept exclusively for late-night resident sets.',
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

