import { Exhibit, Gallery, Visitor, AnalyticsEvent, Ticket, User } from '../models/types.js';

export const seedGalleries: Gallery[] = [
  {
    id: 'GAL-001',
    galleryId: 'GAL_A',
    name: 'Gallery A - Renaissance & Classical Masters',
    description: 'Masterpieces from the 14th to 17th century celebrating perspective, humanism, and anatomical mastery.',
    floor: 1,
    capacity: 100,
    currentOccupancy: 84, // Normal/High demo
    themeColor: '#D4AF37',
    beaconId: 'BEACON_GALLERY_A',
    coordinates: { x: 50, y: 50, width: 280, height: 200 },
    recommendedAlternative: 'GAL_D'
  },
  {
    id: 'GAL-002',
    galleryId: 'GAL_B',
    name: 'Gallery B - Impressionism & Post-Impressionism',
    description: 'Vibrant depictions of light, motion, and psychological depth from late 19th-century pioneers.',
    floor: 1,
    capacity: 90,
    currentOccupancy: 102, // High Traffic Bottleneck alert!
    themeColor: '#38BDF8',
    beaconId: 'BEACON_GALLERY_B',
    coordinates: { x: 370, y: 50, width: 280, height: 200 },
    recommendedAlternative: 'GAL_C'
  },
  {
    id: 'GAL-003',
    galleryId: 'GAL_C',
    name: 'Gallery C - Modern & Surrealist Art',
    description: 'Avant-garde movements exploring the subconscious, geometry, and revolutionary expressions.',
    floor: 1,
    capacity: 80,
    currentOccupancy: 42, // Normal
    themeColor: '#EC4899',
    beaconId: 'BEACON_GALLERY_C',
    coordinates: { x: 690, y: 50, width: 280, height: 200 },
    recommendedAlternative: 'GAL_E'
  },
  {
    id: 'GAL-004',
    galleryId: 'GAL_D',
    name: 'Gallery D - Sculptures & Antiquities',
    description: 'Three-dimensional monumental stone, bronze, and classical sculptural heritage across ages.',
    floor: 1,
    capacity: 75,
    currentOccupancy: 28, // Low
    themeColor: '#10B981',
    beaconId: 'BEACON_GALLERY_D',
    coordinates: { x: 50, y: 290, width: 280, height: 200 },
    recommendedAlternative: 'GAL_A'
  },
  {
    id: 'GAL-005',
    galleryId: 'GAL_E',
    name: 'Gallery E - Asian Heritage & Special Exhibits',
    description: 'Woodblock prints, silk scrolls, and rare temporary international showcases.',
    floor: 1,
    capacity: 85,
    currentOccupancy: 35, // Low
    themeColor: '#8B5CF6',
    beaconId: 'BEACON_GALLERY_E',
    coordinates: { x: 690, y: 290, width: 280, height: 200 },
    recommendedAlternative: 'GAL_C'
  }
];

export const seedExhibits: Exhibit[] = [
  {
    id: 'EX-001',
    exhibitId: 'EX001',
    title: 'Mona Lisa',
    artist: 'Leonardo da Vinci',
    year: 'c. 1503–1519',
    category: 'Renaissance',
    description: 'The world\'s most famous portrait, renowned for its enigmatic smile, subtle sfumato shading, and psychological presence.',
    longDescription: 'Painted by Florentine polymath Leonardo da Vinci, the portrait depicts Lisa Gherardini, wife of Francesco del Giocondo. Leonardo pioneered the sfumato technique here—softly blurring transitions between tones and colors to evoke an atmospheric realism and a gaze that seems to follow the observer.',
    images: [
      '/artworks/mona_lisa.jpg'
    ],
    audioUrl: '/audio/mona_lisa_en.mp3',
    audioDuration: 145,
    galleryId: 'GAL_A',
    location: 'Gallery A - Wall 1',
    coordinates: { x: 120, y: 90, floor: 1 },
    highlight: true,
    featured: true,
    curatorNotes: 'Oil on poplar panel. Acquired by King Francis I of France in 1518. Displayed behind bulletproof glass.',
    medium: 'Oil on poplar panel',
    dimensions: '77 cm × 53 cm (30 in × 21 in)',
    translations: {
      ta: {
        title: 'மோனா லிசா',
        description: 'லியனார்டோ டா வின்சியின் புகழ்பெற்ற ஓவியம், அதன் புதிரான புன்னகை மற்றும் அரிய கலை நுணுக்கங்களுக்காக உலகப் பிரசித்தி பெற்றது.',
        category: 'மறுமலர்ச்சிக் கலை',
        artistBio: 'லியனார்டோ டா வின்சி (1452–1519) இத்தாலிய மறுமலர்ச்சியின் தலைசிறந்த மேதை.'
      },
      hi: {
        title: 'मोना लिसा',
        description: 'लियोनार्डो दा विंची की विश्व प्रसिद्ध पेंटिंग, जो अपनी रहस्यमयी मुस्कान और अद्भुत छायांकन तकनीक के लिए जानी जाती है।',
        category: 'पुनर्जागरण कला',
        artistBio: 'लियोनार्डो दा विंची इतालवी पुनर्जागरण के महान कलाकार और वैज्ञानिक थे।'
      },
      fr: {
        title: 'La Joconde (Mona Lisa)',
        description: 'Le portrait le plus célèbre au monde, réputé pour son sourire énigmatique et la technique du sfumato.',
        category: 'Renaissance',
        artistBio: 'Léonard de Vinci (1452-1519), maître emblématique de la Renaissance italienne.'
      },
      de: {
        title: 'Mona Lisa',
        description: 'Das berühmteste Porträt der Welt, bekannt für ihr rätselhaftes Lächeln und die meisterhafte Sfumato-Technik.',
        category: 'Renaissance'
      },
      es: {
        title: 'Mona Lisa',
        description: 'El retrato más famoso del mundo, reconocido por su enigmática sonrisa y la técnica del sfumato.',
        category: 'Renacimiento'
      },
      ml: {
        title: 'മോണാലിസ',
        description: 'ലിയനാർഡോ ഡാവിഞ്ചിയുടെ വിശ്വപ്രസിദ്ധമായ ചിത്രം, അതിന്റെ നിഗൂഢമായ പുഞ്ചിരിക്ക് പേരുകേട്ടത്.',
        category: 'നവോത്ഥാന കല'
      },
      te: {
        title: 'మోనాలిసా',
        description: 'లియోనార్డో డా విన్సీ గీసిన అత్యంత ప్రసిద్ధ చిత్రపటం, దాని చిరునవ్వుకు ప్రపంచఖ్యాతి.',
        category: 'పునరుజ్జీవన కళ'
      },
      kn: {
        title: 'ಮೋನಾ ಲಿಸಾ',
        description: 'ಲಿಯೊನಾರ್ಡೊ ಡಾ ವಿಂಚಿ ರಚಿಸಿದ ವಿಶ್ವವಿಖ್ಯಾತ ಕಲಾಕೃತಿ, ನಿಗೂಢ ನಗೆಗೆ ಪ್ರಸಿದ್ಧವಾಗಿದೆ.',
        category: 'ನವೋದಯ ಕಲೆ'
      }
    },
    createdAt: new Date().toISOString()
  },
  {
    id: 'EX-002',
    exhibitId: 'EX002',
    title: 'The Starry Night',
    artist: 'Vincent van Gogh',
    year: '1889',
    category: 'Post-Impressionism',
    description: 'A turbulent, emotive nocturnal dreamscape depicting swirling celestial patterns over the quiet town of Saint-Rémy.',
    longDescription: 'Painted from the window of his asylum room in Saint-Rémy-de-Provence just after sunrise, Van Gogh channeled intense emotional resonance using rhythmic, impasto brush strokes and vivid cobalt blues contrasted against glowing golden stars.',
    images: [
      '/artworks/starry_night.jpg'
    ],
    audioUrl: '/audio/starry_night_en.mp3',
    audioDuration: 165,
    galleryId: 'GAL_B',
    location: 'Gallery B - East Wing',
    coordinates: { x: 440, y: 90, floor: 1 },
    highlight: true,
    featured: true,
    curatorNotes: 'Celebrates post-impressionist expressive color over objective representation.',
    medium: 'Oil on canvas',
    dimensions: '73.7 cm × 92.1 cm',
    translations: {
      ta: {
        title: 'நட்சத்திர இரவு',
        description: 'வின்சென்ட் வான் கோவின் உணர்ச்சிமிக்க இரவு நேர விண்வெளி ஓவியம்.',
        category: 'பின்-உணர்வுப்பின்னோக்குக் கலை'
      },
      hi: {
        title: 'द स्टार्री नाइट',
        description: 'विन्सेंट वैन गॉग द्वारा चित्रित एक स्वप्निल और भावुक रात्रि आकाश का दृश्य।',
        category: 'उत्तर-प्रभाववाद'
      },
      fr: {
        title: 'La Nuit étoilée',
        description: 'Un chef-d\'œuvre tourbillonnant de Vincent van Gogh représentant le ciel nocturne de Saint-Rémy.',
        category: 'Postimpressionnisme'
      },
      es: {
        title: 'La noche estrellada',
        description: 'Pintura icónica de Vincent van Gogh con cielo turbulento y estrellas radiantes.',
        category: 'Postimpresionismo'
      }
    },
    createdAt: new Date().toISOString()
  },
  {
    id: 'EX-003',
    exhibitId: 'EX003',
    title: 'The Persistence of Memory',
    artist: 'Salvador Dalí',
    year: '1931',
    category: 'Surrealism',
    description: 'Iconic melting pocket watches draped across a desolate landscape, questioning time, memory, and reality.',
    longDescription: 'Dalí introduced his paranoiac-critical method to depict soft, limp timepieces in a surreal desert setting. Inspired by Camembert cheese melting in the sun, this artwork symbolizes the fluidity of time in human psychology and dream states.',
    images: [
      '/artworks/persistence_of_memory.jpg'
    ],
    audioUrl: '/audio/persistence_memory_en.mp3',
    audioDuration: 130,
    galleryId: 'GAL_C',
    location: 'Gallery C - Center Display',
    coordinates: { x: 760, y: 90, floor: 1 },
    highlight: true,
    featured: true,
    curatorNotes: 'Masterwork of 20th century Surrealism.',
    medium: 'Oil on canvas',
    dimensions: '24.1 cm × 33 cm',
    translations: {
      ta: {
        title: 'நினைவின் தொடர்ச்சி',
        description: 'சல்வதோர் தாலியின் உருகும் கடிகாரங்கள் கொண்ட வியத்தகு கனவுலக ஓவியம்.',
        category: 'மிகை எதார்த்தவாதம்'
      },
      hi: {
        title: 'स्मृति का स्थायित्व',
        description: 'साल्वाडोर डाली की प्रसिद्ध पिघलती घड़ियों वाली अतियथार्थवादी कलाकृति।',
        category: 'अतियथार्थवाद'
      },
      fr: {
        title: 'La Persistance de la mémoire',
        description: 'Les montres molles emblématiques de Salvador Dalí questionnant le temps.',
        category: 'Surréalisme'
      }
    },
    createdAt: new Date().toISOString()
  },
  {
    id: 'EX-004',
    exhibitId: 'EX004',
    title: 'The Scream',
    artist: 'Edvard Munch',
    year: '1893',
    category: 'Expressionism',
    description: 'An agonized figure set against a fiery red sky, embodying the quintessential anxiety of modern civilization.',
    longDescription: 'Munch described a personal walk at sunset when the clouds suddenly turned blood red and he sensed an infinite scream passing through nature. This piece revolutionized expressionism by prioritizing inner torment over outer aesthetics.',
    images: [
      '/artworks/the_scream.jpg'
    ],
    audioUrl: '/audio/the_scream_en.mp3',
    audioDuration: 140,
    galleryId: 'GAL_B',
    location: 'Gallery B - North Wall',
    coordinates: { x: 530, y: 90, floor: 1 },
    highlight: true,
    featured: false,
    medium: 'Oil, tempera, pastel and crayon on cardboard',
    dimensions: '91 cm × 73.5 cm',
    translations: {
      ta: {
        title: 'தி ஸ்க்ரீம் (அலறல்)',
        description: 'எட்வர்ட் மங்கின் புகழ்பெற்ற மனித மனக் கொந்தளிப்பு ஓவியம்.',
        category: 'வெளிப்பாட்டுவாதம்'
      },
      hi: {
        title: 'द स्क्रीम',
        description: 'एडवर्ड मुंख का कालजयी चित्र जो मानवीय चिंता और पीड़ा को दर्शाता है।',
        category: 'अभिव्यक्तिवाद'
      }
    },
    createdAt: new Date().toISOString()
  },
  {
    id: 'EX-005',
    exhibitId: 'EX005',
    title: 'Girl with a Pearl Earring',
    artist: 'Johannes Vermeer',
    year: 'c. 1665',
    category: 'Dutch Golden Age',
    description: 'Often referred to as the \'Mona Lisa of the North\', capturing an intimate glance and luminous pearl reflection.',
    longDescription: 'Vermeer\'s tronie features an oriental turban and an impossibly lustrous pearl earring executed with just two bold brushstrokes of white lead paint.',
    images: [
      '/artworks/girl_with_pearl_earring.jpg'
    ],
    audioUrl: '/audio/girl_pearl_earring_en.mp3',
    audioDuration: 120,
    galleryId: 'GAL_A',
    location: 'Gallery A - Wall 3',
    coordinates: { x: 230, y: 90, floor: 1 },
    highlight: true,
    featured: true,
    medium: 'Oil on canvas',
    dimensions: '44.5 cm × 39 cm',
    translations: {
      ta: {
        title: 'முத்து கம்மலுடன் பெண்',
        description: 'யோஹன்னஸ் வெர்மீரின் புகழ்பெற்ற டச்சுப் பொற்காலக் கலைப்படைப்பு.',
        category: 'டச்சுப் பொற்காலம்'
      },
      hi: {
        title: 'मोती की बाली वाली लड़की',
        description: 'जोहान्स वर्मीर की अद्भुत डच पेंटिंग, उत्तरी यूरोप की मोना लिसा कही जाती है।',
        category: 'डच स्वर्ण युग'
      }
    },
    createdAt: new Date().toISOString()
  },
  {
    id: 'EX-006',
    exhibitId: 'EX006',
    title: 'Pietà',
    artist: 'Michelangelo Buonarroti',
    year: '1498–1499',
    category: 'Renaissance Sculpture',
    description: 'A profoundly poignant marble masterpiece depicting the Virgin Mary cradling the body of Christ with sublime serenity.',
    longDescription: 'Carved when Michelangelo was just 24 years old, the Pietà in St. Peter\'s Basilica is revered for its unmatched emotional gravity, intricate multi-layered drapery folds, and harmonious pyramid composition. It remains the only artwork Michelangelo ever signed.',
    images: [
      '/artworks/pieta.jpg'
    ],
    audioUrl: '/audio/pieta_en.mp3',
    audioDuration: 145,
    galleryId: 'GAL_D',
    location: 'Gallery D - Rotunda Center',
    coordinates: { x: 170, y: 350, floor: 1 },
    highlight: true,
    featured: true,
    medium: 'Carrara Marble',
    dimensions: '174 cm × 195 cm (68.5 in × 76.8 in)',
    translations: {
      ta: {
        title: 'பியட்டா (மைக்கேலேஞ்சலோ)',
        description: 'மைக்கேலேஞ்சலோவின் அழியாப் புகழ் வாய்ந்த பளிங்குச் சிற்பம், அன்னை மரியாள் மடியில் இயேசுவின் அமைதியான வடிவத்தை உணர்வுப்பூர்வமாகச் சித்தரிக்கிறது.',
        category: 'மறுமலர்ச்சிச் சிற்பம்',
        artistBio: 'மைக்கேலேஞ்சலோ புவனாரோட்டி (1475–1564) இத்தாலிய மறுமலர்ச்சியின் இணையற்ற சிற்பி மற்றும் ஓவியர்.'
      },
      hi: {
        title: 'पिएटा',
        description: 'माइकलएंजेलो की संगमरमर से तराशी गई भावपूर्ण उत्कृष्ट कृति, जो करुणा और अद्वितीय मूर्तिकला का प्रतीक है।',
        category: 'पुनर्जागरण मूर्तिकला',
        artistBio: 'माइकलएंजेलो इतालवी पुनर्जागरण के सर्वोच्च मूर्तिकार, चित्रकार और वास्तुकार थे।'
      },
      fr: {
        title: 'La Pietà',
        description: 'Chef-d\'œuvre sculpté dans le marbre de Carrare par Michel-Ange, représentant la Vierge Marie tenant le corps du Christ avec une grâce infinie.',
        category: 'Sculpture de la Renaissance',
        artistBio: 'Michel-Ange (1475-1564), l\'un des plus grands maîtres de la Renaissance italienne.'
      },
      de: {
        title: 'Pietà',
        description: 'Meisterwerk aus Carrara-Marmor von Michelangelo im Petersdom, das Maria mit dem Leichnam Christi in vollendeter Harmonie darstellt.',
        category: 'Renaissance-Skulptur'
      },
      es: {
        title: 'La Piedad (Pietà)',
        description: 'Obra cumbre esculpida en mármol de Carrara por Miguel Ángel en la Basílica de San Pedro, de profunda serenidad y devoción.',
        category: 'Escultura Renacentista'
      },
      ml: {
        title: 'പിയത്ത',
        description: 'മൈക്കലാഞ്ചലോയുടെ അനശ്വര മാർബിൾ ശില്പം, മാതാവ് മറിയം യേശുവിനെ മടിയിൽ കിടത്തുന്ന രൂപം.',
        category: 'നവോത്ഥാന ശില്പകല'
      },
      te: {
        title: 'పియెటా',
        description: 'మైఖేలాంజెలో పాలరాతితో రూపొందించిన జగద్విఖ్యాత శిల్పం, కరుణ మరియు భక్తి ప్రతీక.',
        category: 'పునరుజ్జీవన శిల్పకళ'
      },
      kn: {
        title: 'ಪಿಯೆಟಾ',
        description: 'ಮೈಕೆಲ್ಯಾಂಜೆಲೋ ರಚಿಸಿದ ವಿಶ್ವವಿಖ್ಯಾತ ಅಮೃತಶಿಲೆಯ ಶಿಲ್ಪ, ಕರುಣೆ ಮತ್ತು ಅಪೂರ್ವ ಕಲಾ ಕೌಶಲ್ಯದ ಸಂಕೇತ.',
        category: 'ನವೋದಯ ಶಿಲ್ಪಕಲೆ'
      }
    },
    createdAt: new Date().toISOString()
  },
  {
    id: 'EX-007',
    exhibitId: 'EX007',
    title: 'The Great Wave off Kanagawa',
    artist: 'Katsushika Hokusai',
    year: 'c. 1831',
    category: 'Ukiyo-e Woodblock',
    description: 'A monumental cresting wave framing sacred Mount Fuji, showing nature\'s power versus fragile humanity.',
    longDescription: 'The first print in Hokusai\'s series \'Thirty-Six Views of Mount Fuji\', utilizing newly imported Prussian Blue pigment to create dramatic oceanic depth.',
    images: [
      '/artworks/great_wave.jpg'
    ],
    audioUrl: '/audio/great_wave_en.mp3',
    audioDuration: 135,
    galleryId: 'GAL_E',
    location: 'Gallery E - Asian Pavilion',
    coordinates: { x: 760, y: 350, floor: 1 },
    highlight: true,
    featured: false,
    medium: 'Color woodblock print',
    dimensions: '25.7 cm × 37.8 cm',
    translations: {
      ta: {
        title: 'கனகாவா பெருமலை அலை',
        description: 'ஹோக்குசாயின் உலகப் புகழ்பெற்ற ஜப்பானிய உக்கியோ-இ மரப்பலகை அச்சு ஓவியம்.',
        category: 'ஜப்பானியக் கலை'
      },
      hi: {
        title: 'कनागावा की महान लहर',
        description: 'होकुसाई का विश्व प्रसिद्ध जापानी वुडब्लॉक प्रिंट, माउंट फुजी की पृष्ठभूमि के साथ।',
        category: 'जापानी कला'
      }
    },
    createdAt: new Date().toISOString()
  },
  {
    id: 'EX-008',
    exhibitId: 'EX008',
    title: 'Guernica',
    artist: 'Pablo Picasso',
    year: '1937',
    category: 'Cubism / Anti-War',
    description: 'Monochromatic mural exposing the horrors of the Spanish Civil War and bombing of Guernica.',
    longDescription: 'Commissioned for the 1937 Paris World\'s Fair, Picasso painted this massive monochrome canvas using black, white, and grey to mirror the immediacy and devastation of newspaper photojournalism.',
    images: [
      '/artworks/guernica.jpg'
    ],
    audioUrl: '/audio/guernica_en.mp3',
    audioDuration: 180,
    galleryId: 'GAL_C',
    location: 'Gallery C - North Wall',
    coordinates: { x: 860, y: 90, floor: 1 },
    highlight: true,
    featured: true,
    medium: 'Oil on canvas',
    dimensions: '3.49 m × 7.76 m (11 ft 5 in × 25 ft 6 in)',
    translations: {
      ta: {
        title: 'குவெர்னிகா',
        description: 'பாப்லோ பிக்காசோவின் போருக்கு எதிரான மாபெரும் கியூபிச ஓவியம்.',
        category: 'கியூபிசம்'
      },
      hi: {
        title: 'गुएर्निका',
        description: 'पाब्लो पिकासो का युद्ध विरोधी उत्कृष्ट म्यूरल चित्र।',
        category: 'क्यूबिज्म'
      }
    },
    createdAt: new Date().toISOString()
  },
  {
    id: 'EX-009',
    exhibitId: 'EX009',
    title: 'The School of Athens',
    artist: 'Raphael (Raffaello Sanzio)',
    year: '1509–1511',
    category: 'High Renaissance Fresco',
    description: 'A monumental Renaissance fresco honoring philosophy and science, depicting Plato and Aristotle leading classical antiquity\'s greatest minds.',
    longDescription: 'Commissioned by Pope Julius II to decorate the Stanza della Segnatura in the Apostolic Palace, Vatican, Raphael\'s fresco represents the pinnacle of High Renaissance harmony, intellectual humanism, and linear perspective.',
    images: [
      '/artworks/school_of_athens.jpg'
    ],
    audioUrl: '/audio/school_athens_en.mp3',
    audioDuration: 160,
    galleryId: 'GAL_A',
    location: 'Gallery A - South Wing',
    coordinates: { x: 120, y: 170, floor: 1 },
    highlight: true,
    featured: true,
    medium: 'Fresco',
    dimensions: '500 cm × 770 cm (200 in × 300 in)',
    translations: {
      ta: {
        title: 'ஏதென்ஸ் பள்ளி',
        description: 'இத்தாலிய மறுமலர்ச்சி மேதை ராஃபேலின் புகழ்பெற்ற சுவரோவியம், பிளேட்டோ மற்றும் அரிஸ்டாட்டில் உள்ளிட்ட தலைசிறந்த தத்துவஞானிகளை ஒருங்கிணைத்துக் காட்டுகிறது.',
        category: 'மறுமலர்ச்சிக் கலை',
        artistBio: 'ராஃபேல் சான்சியோ (1483–1520) உயர் மறுமலர்ச்சியின் மும்பெரும் தலைவர்களில் ஒருவர்.'
      },
      hi: {
        title: 'द स्कूल ऑफ एथेंस',
        description: 'इतालवी पुनर्जागरण कलाकार राफेल की विख्यात कृति, जो प्लेटो और अरस्तू सहित महान दार्शनिकों के ज्ञान और विमर्श को दर्शाती है।',
        category: 'पुनर्जागरण कला',
        artistBio: 'राफेल (1483–1520) उच्च पुनर्जागरण के महान चित्रकार और वास्तुकार थे।'
      },
      fr: {
        title: 'L\'École d\'Athènes',
        description: 'Fresque monumentale de Raphaël au Vatican illustrant l\'harmonie de la philosophie et de la science à travers Platon et Aristote.',
        category: 'Renaissance',
        artistBio: 'Raphaël (1483-1520), maître de la Haute Renaissance italienne.'
      },
      de: {
        title: 'Die Schule von Athen',
        description: 'Monumentales Fresko von Raffael im Apostolischen Palast des Vatikans, das die großen Philosophen der Antike vereint.',
        category: 'Renaissance'
      },
      es: {
        title: 'La escuela de Atenas',
        description: 'Célebre fresco de Rafael en el Vaticano que rinde homenaje a la filosofía y el pensamiento clásico renacentista.',
        category: 'Renacimiento'
      },
      ml: {
        title: 'ദി സ്കൂൾ ഓഫ് ഏതൻസ്',
        description: 'റാഫേലിന്റെ വിഖ്യാതമായ ചുവർചിത്രം, പ്ലേറ്റോയും അരിസ്റ്റോട്ടിലും ഉൾപ്പെടെയുള്ള തത്ത്വചിന്തകരെ ചിത്രീകരിക്കുന്നു.',
        category: 'നവോത്ഥാന കല'
      },
      te: {
        title: 'ది స్కూల్ ఆఫ్ ఏథెన్స్',
        description: 'రాఫెల్ రచించిన అద్భుతమైన కుడ్యచిత్రం, ప్లేటో మరియు అరిస్టాటిల్ వంటి తత్వవేత్తలను ప్రదర్శిస్తుంది.',
        category: 'పునరుజ్జీవన కళ'
      },
      kn: {
        title: 'ದಿ ಸ್ಕೂಲ್ ಆಫ್ ಅಥೆನ್ಸ್',
        description: 'ರಾಫೆಲ್ ರಚಿಸಿದ ವಿಶ್ವವಿಖ್ಯಾತ ಮ್ಯೂರಲ್, ಪ್ಲೇಟೋ ಮತ್ತು ಅರಿಸ್ಟಾಟಲ್ ಸೇರಿದಂತೆ ಮಹಾನ್ ತತ್ವಜ್ಞಾನಿಗಳನ್ನು ಚಿತ್ರಿಸುತ್ತದೆ.',
        category: 'ನವೋದಯ ಕಲೆ'
      }
    },
    createdAt: new Date().toISOString()
  },
  {
    id: 'EX-010',
    exhibitId: 'EX010',
    title: 'The Kiss',
    artist: 'Gustav Klimt',
    year: '1907–1908',
    category: 'Art Nouveau / Vienna Secession',
    description: 'A couple embraced in shimmering gold leaf, geometric robes, and intense romantic intimacy.',
    longDescription: 'High point of Klimt\'s \'Golden Phase\', heavily inspired by Byzantine mosaics of Ravenna and Japanese woodcuts.',
    images: [
      '/artworks/the_kiss.jpg'
    ],
    audioUrl: '/audio/the_kiss_en.mp3',
    audioDuration: 140,
    galleryId: 'GAL_B',
    location: 'Gallery B - West Alcove',
    coordinates: { x: 440, y: 170, floor: 1 },
    highlight: true,
    featured: false,
    medium: 'Oil and gold leaf on canvas',
    dimensions: '180 cm × 180 cm',
    createdAt: new Date().toISOString()
  },
  {
    id: 'EX-011',
    exhibitId: 'EX011',
    title: 'The Thinker (Le Penseur)',
    artist: 'Auguste Rodin',
    year: '1904',
    category: 'Bronze Sculpture',
    description: 'A heroic nude figure resting his chin on his right wrist, immersed in deep philosophical contemplation.',
    longDescription: 'Originally conceived as Dante Alighieri pondering The Divine Comedy for Rodin\'s monumental project \'The Gates of Hell\'.',
    images: [
      '/artworks/the_thinker.jpg'
    ],
    audioUrl: '/audio/thinker_en.mp3',
    audioDuration: 125,
    galleryId: 'GAL_D',
    location: 'Gallery D - Entrance Portal',
    coordinates: { x: 250, y: 350, floor: 1 },
    highlight: false,
    featured: false,
    medium: 'Bronze cast',
    dimensions: '186 cm × 98 cm × 140 cm',
    createdAt: new Date().toISOString()
  },
  {
    id: 'EX-012',
    exhibitId: 'EX012',
    title: 'The Night Watch',
    artist: 'Rembrandt van Rijn',
    year: '1642',
    category: 'Baroque',
    description: 'Masterful depiction of light and shadow (chiaroscuro) capturing a civic guard company marching out.',
    longDescription: 'Rembrandt broke with traditional static military group portraiture by animating his figures into dynamic forward motion and dramatic theatrical illumination.',
    images: [
      '/artworks/the_night_watch.jpg'
    ],
    audioUrl: '/audio/night_watch_en.mp3',
    audioDuration: 170,
    galleryId: 'GAL_A',
    location: 'Gallery A - Grand Salon',
    coordinates: { x: 230, y: 170, floor: 1 },
    highlight: true,
    featured: false,
    medium: 'Oil on canvas',
    dimensions: '363 cm × 437 cm',
    createdAt: new Date().toISOString()
  },
  {
    id: 'EX-013',
    exhibitId: 'EX013',
    title: 'The Birth of Venus',
    artist: 'Sandro Botticelli',
    year: 'c. 1485',
    category: 'Renaissance',
    description: 'The goddess of love and beauty arrives ashore on a scallop shell, propelled by the breath of Zephyr into a shower of spring roses.',
    longDescription: 'Painted for the Medici family, Botticelli revived classical mythological iconography on an unprecedented monumental scale. Venus stands in classical contrapposto, her golden tresses flowing in the sea breeze as an attendant of spring rushes to clothe her in a floral mantle.',
    images: [
      '/artworks/birth_of_venus.jpg'
    ],
    audioUrl: '/audio/birth_of_venus_en.mp3',
    audioDuration: 155,
    galleryId: 'GAL_A',
    location: 'Gallery A - North Portico',
    coordinates: { x: 80, y: 130, floor: 1 },
    highlight: true,
    featured: true,
    curatorNotes: 'Tempera on canvas. One of the earliest Italian Renaissance works executed on canvas rather than wood panel.',
    medium: 'Tempera on canvas',
    dimensions: '172.5 cm × 278.9 cm (67.9 in × 109.8 in)',
    translations: {
      ta: {
        title: 'வீனஸின் பிறப்பு',
        description: 'சாண்ட்ரோ போத்திசெல்லியின் உலகப் புகழ்பெற்ற மறுமலர்ச்சி ஓவியம், கடலலையிலிருந்து வீனஸ் தேவதை சிப்பியில் தோன்றுவதை விவரிக்கிறது.',
        category: 'மறுமலர்ச்சிக் கலை'
      },
      hi: {
        title: 'वीनस का जन्म',
        description: 'सैंड्रो बोतितिचेली की कालजयी पेंटिंग, जिसमें प्रेम और सौंदर्य की देवी वीनस को शंख से प्रकट होते दिखाया गया है।',
        category: 'पुनर्जागरण कला'
      },
      fr: {
        title: 'La Naissance de Vénus',
        description: 'Chef-d\'œuvre de Sandro Botticelli montrant la déesse de l\'amour émergeant des eaux sur une conque marine.',
        category: 'Renaissance'
      },
      es: {
        title: 'El nacimiento de Venus',
        description: 'Obra cumbre de Sandro Botticelli que representa a la diosa Venus emergiendo del mar sobre una concha dorada.',
        category: 'Renacimiento'
      }
    },
    createdAt: new Date().toISOString()
  },
  {
    id: 'EX-014',
    exhibitId: 'EX014',
    title: 'The Creation of Adam',
    artist: 'Michelangelo Buonarroti',
    year: 'c. 1512',
    category: 'Renaissance Fresco',
    description: 'The near-touching fingertips of God and Adam, capturing the spark of divine life transmitted to humanity.',
    longDescription: 'Forming the iconic centerpiece of the Sistine Chapel ceiling in Rome, Michelangelo\'s fresco features God floating amid a billowing mantle shaped like a human brain, symbolizing intellect and divine consciousness bestowed upon mankind.',
    images: [
      '/artworks/creation_of_adam.jpg'
    ],
    audioUrl: '/audio/creation_of_adam_en.mp3',
    audioDuration: 160,
    galleryId: 'GAL_A',
    location: 'Gallery A - Vaulted Ceiling Gallery',
    coordinates: { x: 180, y: 50, floor: 1 },
    highlight: true,
    featured: true,
    curatorNotes: 'Fresco technique painted directly on wet plaster while Michelangelo stood on elaborate scaffolding.',
    medium: 'Fresco on plaster',
    dimensions: '280 cm × 570 cm (110 in × 220 in)',
    translations: {
      ta: {
        title: 'ஆதாமின் படைப்பு',
        description: 'மைக்கேலேஞ்சலோவின் சிஸ்டைன் தேவாலய உச்சவரம்பு சுவரோவியம், கடவுளுக்கும் மனிதனுக்கும் இடையிலான தெய்வீகத் தொடுதலைக் காட்டுகிறது.',
        category: 'மறுமலர்ச்சிக் கலை'
      },
      hi: {
        title: 'आदम का निर्माण',
        description: 'माइकलएंजेलो की सिस्टिन चैपल छत पर चित्रित प्रसिद्ध भित्तिचित्र, जो ईश्वरीय चेतना के संचरण को दर्शाता है।',
        category: 'पुनर्जागरण कला'
      },
      fr: {
        title: 'La Création d\'Adam',
        description: 'Célèbre fresque de la chapelle Sixtine par Michel-Ange immortalisant les doigts effleurés de Dieu et d\'Adam.',
        category: 'Renaissance'
      }
    },
    createdAt: new Date().toISOString()
  },
  {
    id: 'EX-015',
    exhibitId: 'EX015',
    title: 'Water Lilies (Nymphéas)',
    artist: 'Claude Monet',
    year: '1916–1919',
    category: 'Impressionism',
    description: 'Luminous water flora and weeping willow branches mirrored on the shimmering pond of Giverny.',
    longDescription: 'Monet spent the last thirty years of his life cultivating and painting his flower garden and Japanese water bridge at Giverny. His immense panoramic canvases dissolve traditional horizon lines, immersing the observer into atmospheric water reflections.',
    images: [
      '/artworks/water_lilies.jpg'
    ],
    audioUrl: '/audio/water_lilies_en.mp3',
    audioDuration: 145,
    galleryId: 'GAL_B',
    location: 'Gallery B - Central Salon',
    coordinates: { x: 390, y: 130, floor: 1 },
    highlight: true,
    featured: true,
    curatorNotes: 'Exemplifies the climax of French Impressionism, blurring representation into early abstraction.',
    medium: 'Oil on canvas',
    dimensions: '200 cm × 200 cm (78.7 in × 78.7 in)',
    translations: {
      ta: {
        title: 'தாமரை மலர்கள் (நிம்பியாஸ்)',
        description: 'கிளாட் மோனேயின் புகழ்பெற்ற இம்ப்ரெஷனிச நீர் மலர் ஓவியம்.',
        category: 'உணர்வுப்பின்னோக்குக் கலை'
      },
      hi: {
        title: 'वाटर लिलीज (कुमुदिनी)',
        description: 'क्लाउड मोने की अद्भुत जल-कुमुदिनी पेंटिंग, प्रभाववाद का उत्कृष्ट उदाहरण।',
        category: 'प्रभाववाद'
      },
      fr: {
        title: 'Les Nymphéas',
        description: 'La féerie aquatique de Claude Monet à Giverny, chef-d\'œuvre mondial de l\'impressionnisme.',
        category: 'Impressionnisme'
      }
    },
    createdAt: new Date().toISOString()
  },
  {
    id: 'EX-016',
    exhibitId: 'EX016',
    title: 'Café Terrace at Night',
    artist: 'Vincent van Gogh',
    year: '1888',
    category: 'Post-Impressionism',
    description: 'An inviting, radiant open-air terrace in Arles bathed in golden gaslight beneath an intensely blue, star-strewn sky.',
    longDescription: 'Van Gogh painted this scene directly on site in Place du Forum, Arles at night. Notably, he rendered this nocturnal painting entirely without using black, choosing instead brilliant contrasts of sulphur yellow, citron, and deep violet-blue.',
    images: [
      '/artworks/cafe_terrace.jpg'
    ],
    audioUrl: '/audio/cafe_terrace_en.mp3',
    audioDuration: 140,
    galleryId: 'GAL_B',
    location: 'Gallery B - South Promenade',
    coordinates: { x: 490, y: 150, floor: 1 },
    highlight: true,
    featured: false,
    curatorNotes: 'First painting in which Van Gogh featured his signature swirling starry nocturnal skies.',
    medium: 'Oil on canvas',
    dimensions: '80.7 cm × 65.3 cm (31.8 in × 25.7 in)',
    translations: {
      ta: {
        title: 'இரவு நேரக் காபி அரங்கம்',
        description: 'வின்சென்ட் வான் கோவின் மின்னும் இரவு வானம் மற்றும் மஞ்சள் ஒளிரும் காபி கடை ஓவியம்.',
        category: 'பின்-உணர்வுப்பின்னோக்குக் கலை'
      },
      hi: {
        title: 'कैफे टेरेस एट नाइट',
        description: 'विन्सेंट वैन गॉग द्वारा चित्रित रात का जादुई और रंगीन कैफे दृश्य।',
        category: 'उत्तर-प्रभाववाद'
      }
    },
    createdAt: new Date().toISOString()
  },
  {
    id: 'EX-017',
    exhibitId: 'EX017',
    title: 'Wanderer above the Sea of Fog',
    artist: 'Caspar David Friedrich',
    year: '1818',
    category: 'Romanticism',
    description: 'A contemplative mountaineer standing atop a rocky precipice, gazing out over a dense, swirling sea of mountain mist.',
    longDescription: 'The defining icon of German Romanticism. Viewed from behind (Rückenfigur technique), the figure invites observers to project themselves into his perspective, experiencing nature\'s sublime majesty and existential wonder.',
    images: [
      '/artworks/wanderer_sea_fog.jpg'
    ],
    audioUrl: '/audio/wanderer_fog_en.mp3',
    audioDuration: 135,
    galleryId: 'GAL_B',
    location: 'Gallery B - Panorama Wall',
    coordinates: { x: 570, y: 130, floor: 1 },
    highlight: true,
    featured: false,
    curatorNotes: 'Masterpiece of Romantic landscape philosophy and sublime aesthetic contemplation.',
    medium: 'Oil on canvas',
    dimensions: '94.8 cm × 74.8 cm (37.3 in × 29.4 in)',
    translations: {
      ta: {
        title: 'பனிமூட்டக் கடலின் மேல் பயணி',
        description: 'காஸ்பர் டேவிட் ஃபிரீட்ரிக்கின் ஜெர்மன் ரொமாண்டிசிச பாணி தத்துவார்த்த ஓவியம்.',
        category: 'கற்பனாவாதம்'
      },
      hi: {
        title: 'कोहरे के सागर के ऊपर पथिक',
        description: 'कैस्पर डेविड फ्रेडरिक का जर्मन स्वच्छंदतावाद का प्रतीकात्मक उत्कृष्ट चित्र।',
        category: 'स्वच्छंदतावाद'
      }
    },
    createdAt: new Date().toISOString()
  },
  {
    id: 'EX-018',
    exhibitId: 'EX018',
    title: 'The Son of Man',
    artist: 'René Magritte',
    year: '1964',
    category: 'Surrealism',
    description: 'A gentleman in an overcoat and bowler hat with a crisp green apple mysteriously hovering in front of his face.',
    longDescription: 'Magritte painted this as a self-portrait exploring the interplay between the visible and the hidden. As Magritte observed: "Everything we see hides another thing, we always want to see what is hidden by what we see."',
    images: [
      '/artworks/the_son_of_man.jpg'
    ],
    audioUrl: '/audio/son_of_man_en.mp3',
    audioDuration: 130,
    galleryId: 'GAL_C',
    location: 'Gallery C - East Niche',
    coordinates: { x: 720, y: 150, floor: 1 },
    highlight: true,
    featured: true,
    curatorNotes: 'One of the most famous surrealist motifs of the 20th century.',
    medium: 'Oil on canvas',
    dimensions: '116 cm × 89 cm (45.6 in × 35 in)',
    translations: {
      ta: {
        title: 'மனித குமாரன்',
        description: 'ரெனே மேக்ரிட்டின் ஆப்பிள் முகம் மறைக்கும் புகழ்பெற்ற சர்ரியலிச ஓவியம்.',
        category: 'மிகை எதார்த்தவாதம்'
      },
      hi: {
        title: 'द सन ऑफ मैन',
        description: 'रेने माग्रिट की प्रसिद्ध अतियथार्थवादी पेंटिंग, जिसमें चेहरे के आगे हरा सेब तैरता है।',
        category: 'अतियथार्थवाद'
      }
    },
    createdAt: new Date().toISOString()
  }
];

export const seedVisitors: Visitor[] = [
  {
    id: 'VIS-001',
    sessionId: 'session_demo_001',
    language: 'en',
    currentLocation: 'Gallery A',
    currentBeaconId: 'BEACON_GALLERY_A',
    startedAt: new Date(Date.now() - 45 * 60000).toISOString(),
    lastActiveAt: new Date().toISOString(),
    favorites: ['EX001', 'EX002'],
    visitedExhibits: ['EX001', 'EX005'],
    deviceInfo: 'iPhone 15 Pro / Safari iOS'
  },
  {
    id: 'VIS-002',
    sessionId: 'session_demo_002',
    language: 'ta',
    currentLocation: 'Gallery B',
    currentBeaconId: 'BEACON_GALLERY_B',
    startedAt: new Date(Date.now() - 30 * 60000).toISOString(),
    lastActiveAt: new Date().toISOString(),
    favorites: ['EX002'],
    visitedExhibits: ['EX002', 'EX004'],
    deviceInfo: 'Samsung Galaxy S24 / Chrome Mobile'
  },
  {
    id: 'VIS-003',
    sessionId: 'session_demo_003',
    language: 'hi',
    currentLocation: 'Gallery C',
    currentBeaconId: 'BEACON_GALLERY_C',
    startedAt: new Date(Date.now() - 15 * 60000).toISOString(),
    lastActiveAt: new Date().toISOString(),
    favorites: ['EX003', 'EX008'],
    visitedExhibits: ['EX003'],
    deviceInfo: 'Google Pixel 8 / Chrome'
  },
  {
    id: 'VIS-004',
    sessionId: 'session_demo_004',
    language: 'fr',
    currentLocation: 'Gallery D',
    currentBeaconId: 'BEACON_GALLERY_D',
    startedAt: new Date(Date.now() - 60 * 60000).toISOString(),
    lastActiveAt: new Date().toISOString(),
    favorites: ['EX006'],
    visitedExhibits: ['EX006', 'EX011'],
    deviceInfo: 'iPad Air / Safari'
  },
  {
    id: 'VIS-005',
    sessionId: 'session_demo_005',
    language: 'es',
    currentLocation: 'Gallery B',
    currentBeaconId: 'BEACON_GALLERY_B',
    startedAt: new Date(Date.now() - 10 * 60000).toISOString(),
    lastActiveAt: new Date().toISOString(),
    favorites: ['EX002', 'EX010'],
    visitedExhibits: ['EX002'],
    deviceInfo: 'OnePlus 12 / Chrome'
  }
];

export const seedTickets: Ticket[] = [
  {
    id: 'TCK-101',
    ticketId: 'TCK-2026-09201',
    visitorName: 'Elena Rostova',
    visitorEmail: 'elena@example.com',
    ticketType: 'VIP',
    amount: 350.00,
    status: 'Completed',
    date: '2026-09-20',
    time: '10:00 AM',
    createdAt: new Date(Date.now() - 5 * 3600000).toISOString()
  },
  {
    id: 'TCK-102',
    ticketId: 'TCK-2026-09202',
    visitorName: 'Karthik Subramanian',
    visitorEmail: 'karthik@example.com',
    ticketType: 'Standard',
    amount: 200.00,
    status: 'Completed',
    date: '2026-09-20',
    time: '11:30 AM',
    createdAt: new Date(Date.now() - 4 * 3600000).toISOString()
  },
  {
    id: 'TCK-103',
    ticketId: 'TCK-2026-09203',
    visitorName: 'Sophie Dubois',
    visitorEmail: 'sophie@example.fr',
    ticketType: 'Student',
    amount: 120.00,
    status: 'Completed',
    date: '2026-09-20',
    time: '12:00 PM',
    createdAt: new Date(Date.now() - 3 * 3600000).toISOString()
  },
  {
    id: 'TCK-104',
    ticketId: 'TCK-2026-09204',
    visitorName: 'Rohan Sharma',
    visitorEmail: 'rohan.s@example.com',
    ticketType: 'Family',
    amount: 550.00,
    status: 'Completed',
    date: '2026-09-20',
    time: '01:15 PM',
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString()
  },
  {
    id: 'TCK-105',
    ticketId: 'TCK-2026-09205',
    visitorName: 'Marcus Weber',
    visitorEmail: 'mweber@example.de',
    ticketType: 'Standard',
    amount: 200.00,
    status: 'Completed',
    date: '2026-09-20',
    time: '02:00 PM',
    createdAt: new Date(Date.now() - 1 * 3600000).toISOString()
  },
  {
    id: 'TCK-106',
    ticketId: 'TCK-2026-09206',
    visitorName: 'Aisha Al-Mansoor',
    visitorEmail: 'aisha@example.com',
    ticketType: 'VIP',
    amount: 350.00,
    status: 'Completed',
    date: '2026-09-20',
    time: '02:30 PM',
    createdAt: new Date(Date.now() - 40 * 60000).toISOString()
  },
  {
    id: 'TCK-107',
    ticketId: 'TCK-2026-09207',
    visitorName: 'Mateo Hernandez',
    visitorEmail: 'mateo@example.es',
    ticketType: 'Standard',
    amount: 200.00,
    status: 'Completed',
    date: '2026-09-20',
    time: '03:15 PM',
    createdAt: new Date(Date.now() - 20 * 60000).toISOString()
  }
];

export const seedAnalytics: AnalyticsEvent[] = [
  { id: 'EVT-01', sessionId: 'session_demo_001', eventType: 'visit', timestamp: new Date(Date.now() - 45 * 60000).toISOString() },
  { id: 'EVT-02', sessionId: 'session_demo_001', eventType: 'qr-scan', exhibitId: 'EX001', metadata: { method: 'camera' }, timestamp: new Date(Date.now() - 44 * 60000).toISOString() },
  { id: 'EVT-03', sessionId: 'session_demo_001', eventType: 'exhibit-view', exhibitId: 'EX001', timestamp: new Date(Date.now() - 43 * 60000).toISOString() },
  { id: 'EVT-04', sessionId: 'session_demo_001', eventType: 'audio', exhibitId: 'EX001', metadata: { duration: 120, completed: true }, timestamp: new Date(Date.now() - 40 * 60000).toISOString() },
  { id: 'EVT-05', sessionId: 'session_demo_001', eventType: 'ai-question', exhibitId: 'EX001', metadata: { query: 'Why is Mona Lisa smiling?' }, timestamp: new Date(Date.now() - 38 * 60000).toISOString() },
  { id: 'EVT-06', sessionId: 'session_demo_002', eventType: 'qr-scan', exhibitId: 'EX002', metadata: { method: 'camera' }, timestamp: new Date(Date.now() - 29 * 60000).toISOString() },
  { id: 'EVT-07', sessionId: 'session_demo_002', eventType: 'exhibit-view', exhibitId: 'EX002', timestamp: new Date(Date.now() - 28 * 60000).toISOString() },
  { id: 'EVT-08', sessionId: 'session_demo_002', eventType: 'language-change', metadata: { from: 'en', to: 'ta' }, timestamp: new Date(Date.now() - 27 * 60000).toISOString() },
  { id: 'EVT-09', sessionId: 'session_demo_002', eventType: 'navigation', galleryId: 'GAL_B', metadata: { from: 'GAL_A', to: 'GAL_B' }, timestamp: new Date(Date.now() - 25 * 60000).toISOString() },
  { id: 'EVT-10', sessionId: 'session_demo_003', eventType: 'exhibit-view', exhibitId: 'EX003', timestamp: new Date(Date.now() - 14 * 60000).toISOString() },
  { id: 'EVT-11', sessionId: 'session_demo_003', eventType: 'ai-question', exhibitId: 'EX003', metadata: { query: 'What do the melting clocks mean?' }, timestamp: new Date(Date.now() - 12 * 60000).toISOString() },
  { id: 'EVT-12', sessionId: 'session_demo_004', eventType: 'exhibit-view', exhibitId: 'EX006', timestamp: new Date(Date.now() - 55 * 60000).toISOString() },
  { id: 'EVT-13', sessionId: 'session_demo_004', eventType: 'audio', exhibitId: 'EX006', metadata: { duration: 155, completed: true }, timestamp: new Date(Date.now() - 50 * 60000).toISOString() },
  { id: 'EVT-14', sessionId: 'session_demo_005', eventType: 'qr-scan', exhibitId: 'EX002', timestamp: new Date(Date.now() - 9 * 60000).toISOString() },
  { id: 'EVT-15', sessionId: 'session_demo_005', eventType: 'exhibit-view', exhibitId: 'EX002', timestamp: new Date(Date.now() - 8 * 60000).toISOString() }
];

export const seedAdminUser: User = {
  id: 'USR-001',
  name: 'Museum Administrator',
  email: 'admin@museum.org',
  role: 'admin',
  createdAt: new Date().toISOString()
};
