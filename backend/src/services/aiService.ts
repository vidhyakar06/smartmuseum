import Groq from 'groq-sdk';
import { dbStore } from '../config/db.js';
import { Exhibit } from '../models/types.js';

interface ChatRequest {
  message: string;
  exhibitId?: string;
  language?: string;
  history?: Array<{ sender: 'user' | 'assistant'; text: string }>;
}

interface ChatResponse {
  answer: string;
  relatedExhibits: Array<{
    exhibitId: string;
    title: string;
    artist: string;
    category: string;
    location: string;
  }>;
  source: 'groq-llama' | 'local-art-expert';
}

const languageNames: Record<string, string> = {
  en: 'English',
  ta: 'Tamil (தமிழ்)',
  hi: 'Hindi (हिन्दी)',
  ml: 'Malayalam (മലയാളം)',
  te: 'Telugu (తెలుగు)',
  kn: 'Kannada (ಕನ್ನಡ)',
  fr: 'French (Français)',
  de: 'German (Deutsch)',
  es: 'Spanish (Español)'
};

export async function askAIGuide(req: ChatRequest): Promise<ChatResponse> {
  const { message, exhibitId, language = 'en', history = [] } = req;
  const currentExhibit: Exhibit | undefined = exhibitId
    ? dbStore.exhibits.find(e => e.exhibitId === exhibitId || e.id === exhibitId)
    : undefined;

  // Find related exhibits in the same gallery or category
  const relatedExhibits = dbStore.exhibits
    .filter(e => e.exhibitId !== currentExhibit?.exhibitId && (
      e.galleryId === currentExhibit?.galleryId ||
      e.category === currentExhibit?.category
    ))
    .slice(0, 3)
    .map(e => ({
      exhibitId: e.exhibitId,
      title: e.title,
      artist: e.artist,
      category: e.category,
      location: e.location
    }));

  const groqApiKey = process.env.GROQ_API_KEY;

  if (groqApiKey && process.env.DEMO_MODE !== 'true') {
    try {
      const groq = new Groq({ apiKey: groqApiKey });
      const targetLangName = languageNames[language] || 'English';

      let systemPrompt = `You are "Athena", the AI Conversational Art Expert and Interactive Guide for the Smart Museum.
Your tone is warm, culturally insightful, concise, and engaging (keep responses under 130 words unless asked for a deep dive).
You must respond in ${targetLangName}.`;

      if (currentExhibit) {
        systemPrompt += `
The visitor is currently viewing this artwork:
- Title: ${currentExhibit.title}
- Artist: ${currentExhibit.artist}
- Year: ${currentExhibit.year}
- Category/Movement: ${currentExhibit.category}
- Medium: ${currentExhibit.medium || 'N/A'}
- Dimensions: ${currentExhibit.dimensions || 'N/A'}
- Location: ${currentExhibit.location} (Gallery ID: ${currentExhibit.galleryId})
- Curatorial Overview: ${currentExhibit.description}
- Historical Background: ${currentExhibit.longDescription || ''}
- Curator Notes: ${currentExhibit.curatorNotes || ''}

Use this context to answer accurately. Never invent false dates or unverified museum facts.
If the visitor asks for "simple English" or "explain to a child", make it intuitive and story-like.
If the visitor asks about nearby artworks, refer to items in ${currentExhibit.galleryId}.`;
      } else {
        systemPrompt += `
The visitor is asking a general museum or art history question. Guide them with curatorial wisdom.`;
      }

      const formattedMessages: any[] = [
        { role: 'system', content: systemPrompt }
      ];

      // Add last 4 turns of history
      const recentHistory = history.slice(-4);
      for (const h of recentHistory) {
        formattedMessages.push({
          role: h.sender === 'user' ? 'user' : 'assistant',
          content: h.text
        });
      }

      formattedMessages.push({ role: 'user', content: message });

      const completion = await groq.chat.completions.create({
        messages: formattedMessages,
        model: 'llama-3.3-70b-versatile',
        temperature: 0.6,
        max_tokens: 350
      });

      const answer = completion.choices[0]?.message?.content?.trim() || 'I am happy to assist your exploration of our gallery.';
      return {
        answer,
        relatedExhibits,
        source: 'groq-llama'
      };
    } catch (err: any) {
      console.warn('⚠️  Groq API call failed (' + err.message + '). Falling back to Local Art Expert Engine.');
    }
  }

  // Fallback Local Contextual Museum AI Engine
  const answer = generateLocalAIResponse(message, currentExhibit, language);

  return {
    answer,
    relatedExhibits,
    source: 'local-art-expert'
  };
}

function generateLocalAIResponse(query: string, exhibit?: Exhibit, lang: string = 'en'): string {
  const q = query.toLowerCase();

  // Multi-language response templates
  if (lang === 'ta') {
    if (exhibit) {
      if (q.includes('யார்') || q.includes('வரைந்த') || q.includes('artist') || q.includes('who')) {
        return `இந்த அரிய கலைப்படைப்பு '${exhibit.title}' தலைசிறந்த கலைஞர் ${exhibit.artist} அவர்களால் ${exhibit.year} இல் உருவாக்கப்பட்டது.`;
      }
      return `${exhibit.title}: ${exhibit.translations?.ta?.description || exhibit.description} கலைஞர் ${exhibit.artist} அவர்களின் இந்த படைப்பு ${exhibit.category} பாணியைச் சேர்ந்தது.`;
    }
    return `ஸ்மார்ட் அருங்காட்சியகத்திற்கு நல்வரவு! நான் உங்கள் ஏஐ கலை வழிகாட்டி. அருங்காட்சியகத்தில் உள்ள படைப்புகள் குறித்து ஏதேனும் கேட்கலாம்.`;
  }

  if (lang === 'hi') {
    if (exhibit) {
      if (q.includes('किसने') || q.includes('बनाया') || q.includes('artist') || q.includes('who')) {
        return `यह उत्कृष्ट कलाकृति '${exhibit.title}' महान कलाकार ${exhibit.artist} द्वारा वर्ष ${exhibit.year} में बनाई गई थी।`;
      }
      return `${exhibit.title}: ${exhibit.translations?.hi?.description || exhibit.description} यह ${exhibit.category} काल की एक अनमोल धरोहर है जिसे ${exhibit.artist} ने रचा।`;
    }
    return `स्मार्ट संग्रहालय में आपका स्वागत है! मैं आपका एआई आर्ट गाइड हूँ। आप किसी भी कलाकृति या गैलरी के बारे में पूछ सकते हैं।`;
  }

  if (lang === 'fr') {
    if (exhibit) {
      return `Cette œuvre intitulée '${exhibit.title}' a été créée par ${exhibit.artist} en ${exhibit.year}. Elle illustre parfaitement le mouvement ${exhibit.category}. ${exhibit.translations?.fr?.description || exhibit.description}`;
    }
    return `Bienvenue au Musée Intelligent ! Je suis votre guide artistique IA. Comment puis-je enrichir votre visite aujourd'hui ?`;
  }

  if (lang === 'es') {
    if (exhibit) {
      return `'${exhibit.title}' fue creada por el maestro ${exhibit.artist} en ${exhibit.year}. Es una obra cumbre del ${exhibit.category}. ${exhibit.translations?.es?.description || exhibit.description}`;
    }
    return `¡Bienvenido a la Guía Inteligente del Museo! Estoy aquí para responder todas sus preguntas sobre nuestras obras y galerías.`;
  }

  // English Contextual Intelligence
  if (!exhibit) {
    if (q.includes('where') || q.includes('restroom') || q.includes('cafe') || q.includes('entrance') || q.includes('exit')) {
      return 'The Cafe and Information Desk are situated near the Main Atrium. Restrooms are accessible near Gallery A and Gallery D corridors. Check our interactive Map tab for step-by-step vector routing!';
    }
    if (q.includes('ticket') || q.includes('price') || q.includes('hours') || q.includes('time')) {
      return 'The museum is open today from 9:00 AM to 7:00 PM. Standard tickets are $20, Student passes are $12, and VIP guided access is $35. Check the Tickets section for instant digital passes.';
    }
    return 'Welcome to the Smart Museum! I am your AI Art Guide. You can scan any artwork QR code or choose an exhibit to ask about artists, techniques, hidden symbols, and walking directions.';
  }

  // Exhibit-Specific English Questions
  if (q.includes('who') || q.includes('artist') || q.includes('painted') || q.includes('sculpted') || q.includes('created')) {
    return `'${exhibit.title}' was created by ${exhibit.artist} in ${exhibit.year}. It represents the ${exhibit.category} movement and is crafted with ${exhibit.medium || 'traditional medium'}.`;
  }

  if (q.includes('why') || q.includes('important') || q.includes('famous') || q.includes('significance') || q.includes('meaning')) {
    return `'${exhibit.title}' is iconic because it revolutionized ${exhibit.category}. ${exhibit.longDescription || exhibit.description} Notice how ${exhibit.artist} uses composition to captivate observers from any angle.`;
  }

  if (q.includes('simple') || q.includes('explain') || q.includes('child') || q.includes('basic') || q.includes('summarize')) {
    return `In simple terms: ${exhibit.title} is like a window into the mind of ${exhibit.artist}. Instead of just copying what eyes see, the artist painted feelings and dramatic atmosphere using unique colors and brush strokes. It's located right in ${exhibit.location}.`;
  }

  if (q.includes('near') || q.includes('next') || q.includes('nearby') || q.includes('around') || q.includes('recommend') || q.includes('similar')) {
    const nearby = dbStore.exhibits
      .filter(e => e.galleryId === exhibit.galleryId && e.exhibitId !== exhibit.exhibitId)
      .map(e => `"${e.title}" by ${e.artist}`)
      .join(', ');
    return `In the same gallery (${exhibit.galleryId}), you can also explore: ${nearby || 'curated companion pieces'}. Tap the Navigate button to see the shortest path!`;
  }

  if (q.includes('medium') || q.includes('size') || q.includes('dimension') || q.includes('material')) {
    return `'${exhibit.title}' is executed on ${exhibit.medium || 'fine art substrate'} with physical dimensions of ${exhibit.dimensions || 'standard gallery format'}.`;
  }

  // Default rich answer
  return `'${exhibit.title}' by ${exhibit.artist} (${exhibit.year}) is one of our museum's premier highlights in ${exhibit.category}. ${exhibit.description} Feel free to ask about the artist's life, symbols in the artwork, or directions to companion pieces!`;
}
