import { Sample, Producer, SoundPack } from './types';

// Utility to generate unique IDs
const genId = () => Math.random().toString(36).substr(2, 9);

export const PRODUCERS: Producer[] = [
  { id: 'p1', name: 'Ghost Echo', specialization: ['Techno', 'Dark Ambient'], bio: 'Analog synth textures.', avatar: 'https://picsum.photos/seed/p1/200/200', sampleCount: 12, rating: 4.9 },
  { id: 'p2', name: 'Lush Theory', specialization: ['Neo-Soul', 'Lo-Fi'], bio: 'Warm Rhodes chords.', avatar: 'https://picsum.photos/seed/p2/200/200', sampleCount: 8, rating: 4.8 },
  { id: 'p3', name: 'HyperDrive', specialization: ['D&B', 'Neurofunk'], bio: 'Precision reese basses.', avatar: 'https://picsum.photos/seed/p3/200/200', sampleCount: 15, rating: 5.0 },
  { id: 'p4', name: 'Neon Samurai', specialization: ['Synthwave', 'Phonk'], bio: '80s aesthetics.', avatar: 'https://picsum.photos/seed/p4/200/200', sampleCount: 22, rating: 4.7 },
  { id: 'p5', name: 'Vanta Black', specialization: ['Industrial', 'Techno'], bio: 'Pure sonic darkness.', avatar: 'https://picsum.photos/seed/p5/200/200', sampleCount: 10, rating: 4.9 },
  { id: 'p6', name: 'Cloud Kicker', specialization: ['Ambient', 'Lo-Fi'], bio: 'Ethereal soundscapes.', avatar: 'https://picsum.photos/seed/p6/200/200', sampleCount: 30, rating: 4.6 },
  { id: 'p7', name: 'Circuit Break', specialization: ['Glitch', 'IDM'], bio: 'Error-based beauty.', avatar: 'https://picsum.photos/seed/p7/200/200', sampleCount: 14, rating: 4.8 },
  { id: 'p8', name: 'Soul Architect', specialization: ['House', 'Disco'], bio: 'Classic groove design.', avatar: 'https://picsum.photos/seed/p8/200/200', sampleCount: 18, rating: 4.9 },
  { id: 'p9', name: 'Bit Crusher', specialization: ['8-Bit', 'Chiptune'], bio: 'Retro gaming sounds.', avatar: 'https://picsum.photos/seed/p9/200/200', sampleCount: 25, rating: 4.5 },
  { id: 'p10', name: 'Static Flow', specialization: ['Dub Techno'], bio: 'Deep immersion.', avatar: 'https://picsum.photos/seed/p10/200/200', sampleCount: 11, rating: 4.7 },
  { id: 'p11', name: 'Velvet Moon', specialization: ['Jazz', 'Chillhop'], bio: 'Smooth nocturnal vibes.', avatar: 'https://picsum.photos/seed/p11/200/200', sampleCount: 19, rating: 4.8 },
  { id: 'p12', name: 'Titan Sound', specialization: ['Cinematic', 'Epic'], bio: 'Orchestral power.', avatar: 'https://picsum.photos/seed/p12/200/200', sampleCount: 5, rating: 5.0 },
  { id: 'p13', name: 'Pulse Width', specialization: ['Minimal', 'Micro'], bio: 'Precise textures.', avatar: 'https://picsum.photos/seed/p13/200/200', sampleCount: 16, rating: 4.6 },
  { id: 'p14', name: 'Sub Zero', specialization: ['Trap', 'Grime'], bio: 'Low-end specialists.', avatar: 'https://picsum.photos/seed/p14/200/200', sampleCount: 28, rating: 4.9 },
  { id: 'p15', name: 'Aether', specialization: ['Future Bass'], bio: 'Crystal clear leads.', avatar: 'https://picsum.photos/seed/p15/200/200', sampleCount: 12, rating: 4.7 },
  { id: 'p16', name: 'Mod Matrix', specialization: ['Modular', 'Experimental'], bio: 'Unpredictable voltage.', avatar: 'https://picsum.photos/seed/p16/200/200', sampleCount: 9, rating: 4.8 },
  { id: 'p17', name: 'Redux', specialization: ['Boom Bap'], bio: 'Golden era drums.', avatar: 'https://picsum.photos/seed/p17/200/200', sampleCount: 33, rating: 4.7 },
  { id: 'p18', name: 'Frequency', specialization: ['Psytrance'], bio: 'High-speed energy.', avatar: 'https://picsum.photos/seed/p18/200/200', sampleCount: 21, rating: 4.6 },
  { id: 'p19', name: 'Analog Kid', specialization: ['Synth-pop'], bio: 'Vintage oscillators.', avatar: 'https://picsum.photos/seed/p19/200/200', sampleCount: 17, rating: 4.8 },
  { id: 'p20', name: 'Last Call', specialization: ['Post-Rock'], bio: 'Atmospheric guitars.', avatar: 'https://picsum.photos/seed/p20/200/200', sampleCount: 10, rating: 4.9 }
];

export const SOUND_PACKS: SoundPack[] = PRODUCERS.map((p, i) => ({
  id: `sp${i}`,
  title: `${p.name} Artifacts Vol. ${i + 1}`,
  producerId: p.id,
  producerName: p.name,
  sampleCount: Math.floor(Math.random() * 10) + 5,
  genre: p.specialization[0],
  coverImage: `https://images.unsplash.com/photo-${1500000000000 + i * 10000}?auto=format&fit=crop&q=80&w=400`,
  description: `Highly exclusive ${p.specialization[0]} collection from the vault of ${p.name}.`
}));

export const SAMPLES: Sample[] = [
  {
    id: 's1',
    title: 'Void Sub Bass Loop',
    producerId: 'p1',
    producerName: 'Ghost Echo',
    packId: 'sp0',
    genre: 'Techno',
    bpm: 128,
    key: 'Fm',
    type: 'Loop',
    price: 24.99,
    licensesSold: 2,
    maxLicenses: 5,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    tags: ['dark', 'heavy', 'analog'],
    description: 'A deep, modulated sub-bass loop recorded from a Moog Sub 37.'
  },
  {
    id: 's2',
    title: 'Dusk Rhodes Progressions',
    producerId: 'p2',
    producerName: 'Lush Theory',
    packId: 'sp1',
    genre: 'Neo-Soul',
    bpm: 90,
    key: 'EbMaj7',
    type: 'Loop',
    price: 18.50,
    licensesSold: 4,
    maxLicenses: 5,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    tags: ['warm', 'jazzy', 'electric piano'],
    description: 'Beautifully voiced Rhodes chords with vintage tape saturation.'
  },
  {
    id: 's3',
    title: 'Steel Snare One-Shot',
    producerId: 'p3',
    producerName: 'HyperDrive',
    packId: 'sp2',
    genre: 'D&B',
    bpm: 174,
    key: 'N/A',
    type: 'One-shot',
    price: 5.00,
    licensesSold: 0,
    maxLicenses: 5,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    tags: ['punchy', 'high-frequency', 'sharp'],
    description: 'A clinical, high-frequency snare hit designed for neurofunk.'
  },
  {
    id: 's4',
    title: 'Warehouse Kick Drum',
    producerId: 'p1',
    producerName: 'Ghost Echo',
    packId: 'sp0',
    genre: 'Techno',
    bpm: 130,
    key: 'C',
    type: 'One-shot',
    price: 7.99,
    licensesSold: 4,
    maxLicenses: 5,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    tags: ['industrial', 'distorted', 'peak-time'],
    description: 'A thunderous kick drum with high-end distortion and room reverb.'
  },
  {
    id: 's5',
    title: 'Rainy Day Beat',
    producerId: 'p2',
    producerName: 'Lush Theory',
    packId: 'sp1',
    genre: 'Lo-Fi',
    bpm: 84,
    key: 'N/A',
    type: 'Loop',
    price: 12.00,
    licensesSold: 1,
    maxLicenses: 5,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    tags: ['dusty', 'vinyl', 'chill'],
    description: 'Textured lo-fi hip hop drum loop with vinyl crackle.'
  }
];
