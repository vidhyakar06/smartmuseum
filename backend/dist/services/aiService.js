"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.askAIGuide = askAIGuide;
const genai_1 = require("@google/genai");
const db_js_1 = require("../config/db.js");
const languageNames = {
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
async function askAIGuide(req) {
    const { message, exhibitId, language = 'en', history = [] } = req;
    const msgLower = message.toLowerCase();
    // 1. Resolve current or queried exhibit dynamically from database
    let targetExhibit = exhibitId
        ? db_js_1.dbStore.exhibits.find(e => e.exhibitId === exhibitId || e.id === exhibitId)
        : undefined;
    // If not explicitly set, search if user is asking about a specific artwork or artist
    if (!targetExhibit) {
        targetExhibit = db_js_1.dbStore.exhibits.find(e => {
            const titleMatch = msgLower.includes(e.title.toLowerCase());
            const artistMatch = msgLower.includes(e.artist.toLowerCase()) ||
                e.artist.toLowerCase().split(' ').some(part => part.length > 3 && msgLower.includes(part));
            return titleMatch || artistMatch;
        });
    }
    // 2. Curate companion/related exhibits
    const relatedExhibits = db_js_1.dbStore.exhibits
        .filter(e => e.exhibitId !== targetExhibit?.exhibitId && ((targetExhibit && e.galleryId === targetExhibit.galleryId) ||
        (targetExhibit && e.category === targetExhibit.category) ||
        e.highlight))
        .slice(0, 3)
        .map(e => ({
        exhibitId: e.exhibitId,
        title: e.title,
        artist: e.artist,
        category: e.category,
        location: e.location
    }));
    // 3. Optional External API: Gemini (only if GEMINI_API_KEY explicitly provided and not empty)
    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (geminiApiKey && geminiApiKey.trim() !== '' && process.env.DEMO_MODE !== 'true') {
        try {
            const ai = new genai_1.GoogleGenAI({ apiKey: geminiApiKey });
            const targetLangName = languageNames[language] || 'English';
            let systemPrompt = `You are "Athena", the AI Conversational Art Expert and Interactive Guide for the Smart Museum.
Your tone is warm, culturally insightful, concise, and engaging (keep responses under 130 words unless asked for a deep dive).
You must respond in ${targetLangName}.`;
            if (targetExhibit) {
                systemPrompt += `\nViewing: ${targetExhibit.title} by ${targetExhibit.artist} (${targetExhibit.year}). Location: ${targetExhibit.location}. Overview: ${targetExhibit.description}`;
            }
            const contents = [];
            const validHistory = history.filter(h => h.text && h.text.trim().length > 0);
            const firstUserIdx = validHistory.findIndex(h => h.sender === 'user');
            if (firstUserIdx !== -1) {
                const historySlice = validHistory.slice(firstUserIdx);
                let expectedRole = 'user';
                for (const h of historySlice) {
                    const role = h.sender === 'user' ? 'user' : 'model';
                    if (role === expectedRole) {
                        contents.push({ role, parts: [{ text: h.text }] });
                        expectedRole = expectedRole === 'user' ? 'model' : 'user';
                    }
                }
            }
            if (contents.length > 0 && contents[contents.length - 1].role === 'user') {
                contents[contents.length - 1].parts.push({ text: message });
            }
            else {
                contents.push({ role: 'user', parts: [{ text: message }] });
            }
            const modelsToTry = [process.env.GEMINI_MODEL, 'gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-2.5-flash']
                .filter((m, i, arr) => Boolean(m) && arr.indexOf(m) === i);
            for (const model of modelsToTry) {
                try {
                    const response = await ai.models.generateContent({
                        model,
                        contents,
                        config: { systemInstruction: systemPrompt, temperature: 0.6, maxOutputTokens: 400 }
                    });
                    const answer = response.text?.trim();
                    if (answer) {
                        return { answer, relatedExhibits, source: 'gemini-flash' };
                    }
                }
                catch {
                    // Try next model
                }
            }
        }
        catch {
            // Fall through to autonomous museum AI
        }
    }
    // 4. Default Autonomous Art Historian Engine (No External API Key Required)
    const answer = generateAutonomousArtAI(message, targetExhibit, language, history);
    return {
        answer,
        relatedExhibits,
        source: 'athena-art-ai'
    };
}
/**
 * Autonomous Museum Art Knowledge Intelligence Engine
 * 100% Self-Contained • Zero External API Keys • Deep Curatorial Grounding
 */
function generateAutonomousArtAI(query, exhibit, lang = 'en', history = []) {
    const q = query.toLowerCase().trim();
    // Multi-lingual handler
    if (lang === 'ta') {
        return generateTamilAIResponse(q, exhibit);
    }
    if (lang === 'hi') {
        return generateHindiAIResponse(q, exhibit);
    }
    if (lang === 'fr') {
        return generateFrenchAIResponse(q, exhibit);
    }
    if (lang === 'es') {
        return generateSpanishAIResponse(q, exhibit);
    }
    // ==========================================
    // ENGLISH AUTONOMOUS CURATORIAL INTELLIGENCE
    // ==========================================
    // Intent 1: Greetings & AI Persona
    if (q === 'hi' || q === 'hello' || q === 'hey' || q.includes('who are you') || q.includes('your name') || q.includes('what can you do')) {
        if (exhibit) {
            return `Hello! I am Athena, your AI Curatorial Guide. We are currently observing "${exhibit.title}" by ${exhibit.artist} (${exhibit.year}) in ${exhibit.location}. Feel free to ask about its hidden symbols, artistic techniques, historical significance, or nearby masterworks!`;
        }
        return `Hello and welcome to the Smart Museum! I am Athena, your interactive Art Historian and Museum Guide. I can walk you through our permanent collections, explain secret symbols in paintings, give walking directions to any gallery or cafe, and recommend highlights tailored to your visit. What would you like to explore today?`;
    }
    // Intent 2: Museum Hours & Ticket Pricing
    if (q.includes('hour') || q.includes('time') || q.includes('open') || q.includes('close') || q.includes('ticket') || q.includes('price') || q.includes('fee') || q.includes('admission')) {
        return `🏛️ Smart Museum Visiting Hours & Admissions:
• Visiting Hours: Open Daily from 9:00 AM to 7:00 PM (Last entry at 6:15 PM).
• Standard Admission: $20 (Full access to all 5 permanent galleries).
• Student & Senior Pass: $12 (Valid ID required).
• VIP Curatorial Guided Pass: $35 (Includes audio headsets, priority entry, and curator notes).
• Children under 12: Complimentary admission.
Digital passes can be booked directly in our Tickets tab!`;
    }
    // Intent 3: Navigation, Restrooms, Amenities, Cafe
    if (q.includes('cafe') || q.includes('coffee') || q.includes('food') || q.includes('eat') || q.includes('drink')) {
        return `☕ The Museum Café is situated on the Ground Floor right beside the Main Sunlit Atrium. They serve artisanal espresso, pastries, light Mediterranean lunch, and refreshing beverages from 9:30 AM to 6:30 PM.`;
    }
    if (q.includes('restroom') || q.includes('toilet') || q.includes('washroom') || q.includes('bathroom')) {
        return `🚻 Restrooms are located on Floor 1 adjacent to Gallery A (Renaissance Masters) and near the eastern corridor of Gallery D (Sculptures). Both facilities are fully ADA accessible and equipped with baby-care stations.`;
    }
    if (q.includes('gift shop') || q.includes('store') || q.includes('souvenir') || q.includes('locker') || q.includes('wifi')) {
        return `The Museum Gift Shop and Cloakroom Lockers are located next to the Main Entrance Hall. Complimentary high-speed Wi-Fi is accessible throughout all galleries under the network "SmartMuseum_Visitor".`;
    }
    // Intent 4: Gallery Navigation & Overviews
    if (q.includes('gallery') || q.includes('floor') || q.includes('map') || q.includes('where is')) {
        const matchedGallery = db_js_1.dbStore.galleries.find(g => q.includes(g.name.toLowerCase()) ||
            q.includes(g.galleryId.toLowerCase()) ||
            (q.includes('renaissance') && g.galleryId === 'GAL_A') ||
            (q.includes('impression') && g.galleryId === 'GAL_B') ||
            (q.includes('modern') && g.galleryId === 'GAL_C') ||
            (q.includes('sculpture') && g.galleryId === 'GAL_D') ||
            (q.includes('asian') && g.galleryId === 'GAL_E'));
        if (matchedGallery) {
            const artCount = db_js_1.dbStore.exhibits.filter(e => e.galleryId === matchedGallery.galleryId).length;
            return `🏛️ ${matchedGallery.name} (Floor ${matchedGallery.floor}):
${matchedGallery.description}
• Current Occupancy: ${matchedGallery.currentOccupancy}/${matchedGallery.capacity} visitors (${matchedGallery.currentOccupancy >= matchedGallery.capacity ? '⚠️ High Traffic - Bottleneck Alert' : '✅ Optimal Flow'}).
• Key Highlights: Features ${artCount} cataloged masterworks.
Tap the interactive Map tab to generate step-by-step vector walking directions to this gallery!`;
        }
        return `The museum features 5 world-class wings:
1. Gallery A: Renaissance & Classical Masters (Da Vinci, Michelangelo, Raphael)
2. Gallery B: Impressionism & Post-Impressionism (Van Gogh, Monet, Degas)
3. Gallery C: Modern & Surrealist Art (Dalí, Picasso, Magritte)
4. Gallery D: Sculptures & Antiquities (Rodin, Classical Bronzes)
5. Gallery E: Asian Heritage & Special Exhibits (Hokusai, Silk Scrolls)
Which gallery would you like to navigate to?`;
    }
    // Intent 5: Highlights & Recommendations
    if (q.includes('recommend') || q.includes('must see') || q.includes('highlight') || q.includes('best') || q.includes('first') || q.includes('top')) {
        const highlights = db_js_1.dbStore.exhibits.filter(e => e.highlight || e.featured).slice(0, 4);
        const list = highlights.map((h, i) => `${i + 1}. "${h.title}" by ${h.artist} (${h.location})`).join('\n');
        return `✨ Athena's Recommended Masterpiece Tour:
${list}
Tip: You can scan the QR code located in front of any of these works or select them in the Explore tab to hear their original audio guide!`;
    }
    // Intent 6: Specific Artwork Inquiries (When an Exhibit is Active or Mentioned)
    if (exhibit) {
        // 6a. Artist Information
        if (q.includes('who') || q.includes('artist') || q.includes('painter') || q.includes('creator') || q.includes('painted') || q.includes('sculpted')) {
            return `"${exhibit.title}" was created by ${exhibit.artist} around ${exhibit.year}. ${exhibit.artist} was a towering figure in the ${exhibit.category} movement. The work is crafted using ${exhibit.medium || 'traditional fine art materials'} and measures ${exhibit.dimensions || 'standard gallery format'}.`;
        }
        // 6b. Symbolism, Meaning & Secrets
        if (q.includes('symbol') || q.includes('meaning') || q.includes('secret') || q.includes('hidden') || q.includes('smile') || q.includes('detail') || q.includes('eyes')) {
            if (exhibit.curatorNotes) {
                return `🔍 Curatorial Insights & Symbolism for "${exhibit.title}":
${exhibit.curatorNotes}
Notice how ${exhibit.artist} balances light, color contrasts, and subtle geometric harmony to draw your gaze towards the focal point.`;
            }
            return `In "${exhibit.title}", ${exhibit.artist} embedded subtle storytelling cues: ${exhibit.description} Look closely at the background contours and lighting transitions to appreciate the underlying psychological tension.`;
        }
        // 6c. Kid-friendly / Simple Explanation
        if (q.includes('simple') || q.includes('child') || q.includes('kid') || q.includes('explain') || q.includes('basic') || q.includes('summarize')) {
            return `🎨 In simple terms: Think of "${exhibit.title}" as a creative snapshot of ${exhibit.artist}'s imagination from ${exhibit.year}! Instead of taking a photo with a smartphone, the artist spent months carefully mixing pigments and painting feelings, dramatic atmosphere, and light. When you stand in front of it in ${exhibit.location}, notice how the artwork feels alive!`;
        }
        // 6d. Historical Context & Background
        if (q.includes('why') || q.includes('famous') || q.includes('history') || q.includes('background') || q.includes('story') || q.includes('importance')) {
            return `"${exhibit.title}" is historically pivotal because it defined the aesthetics of ${exhibit.category}. ${exhibit.longDescription || exhibit.description} It remains one of our museum's crowning jewels in ${exhibit.location}.`;
        }
        // 6e. Medium, Dimensions & Technique
        if (q.includes('medium') || q.includes('size') || q.includes('dimension') || q.includes('canvas') || q.includes('technique') || q.includes('sfumato') || q.includes('paint')) {
            return `Technical Curatorial Data for "${exhibit.title}":
• Medium: ${exhibit.medium || 'Oil on canvas / fine art medium'}
• Dimensions: ${exhibit.dimensions || 'Curated gallery proportion'}
• Era: ${exhibit.year} (${exhibit.category})
• Location: ${exhibit.location} (${exhibit.galleryId})`;
        }
        // 6f. Nearby Artworks
        if (q.includes('near') || q.includes('next') || q.includes('companion') || q.includes('around') || q.includes('same room')) {
            const neighbors = db_js_1.dbStore.exhibits
                .filter(e => e.galleryId === exhibit.galleryId && e.exhibitId !== exhibit.exhibitId)
                .map(e => `"${e.title}" by ${e.artist}`)
                .join(', ');
            return `Within the same gallery (${exhibit.galleryId}), you can also admire: ${neighbors || 'related works in this curatorial wing'}. Tap the map icon to see exact wall placement!`;
        }
        // 6g. General description for the active artwork
        return `"${exhibit.title}" (${exhibit.year}) is a celebrated highlight by ${exhibit.artist} located in ${exhibit.location}. ${exhibit.description}
Would you like to know about the artist's life, technical brushwork, or hear the full audio narration?`;
    }
    // Intent 7: General Art Movements
    if (q.includes('renaissance')) {
        return `The Renaissance (14th–17th Century) was a golden age of cultural revival celebrating humanism, anatomy, linear perspective, and classical philosophy. Key luminaries like Leonardo da Vinci and Michelangelo redefined fine art. Experience our Renaissance collection in Gallery A!`;
    }
    if (q.includes('impression')) {
        return `Impressionism emerged in late 19th-century France. Pioneers like Monet, Degas, and Van Gogh broke free from rigid academic rules to capture momentary natural light, quick brushstrokes, and emotional vibrancy. Explore Gallery B for our Impressionist masterworks!`;
    }
    if (q.includes('surreal') || q.includes('modern')) {
        return `Modern and Surrealist art challenged reality itself by exploring the subconscious, dreams, and revolutionary geometries. Artists like Salvador Dalí and Pablo Picasso created thought-provoking visuals that you can experience in Gallery C!`;
    }
    // Default Warm Curatorial Guidance
    return `Thank you for asking! In the Smart Museum, every gallery tells an extraordinary story of human creativity. You can ask me about:
• Specific artworks (e.g. "Tell me about Mona Lisa", "Starry Night")
• Artists and their techniques (e.g. "Who was Leonardo da Vinci?")
• Museum hours, ticket bookings, cafe, and restrooms
• Step-by-step directions to any of our 5 galleries
How can I assist your tour next?`;
}
function generateTamilAIResponse(q, exhibit) {
    if (exhibit) {
        if (q.includes('யார்') || q.includes('வரைந்த') || q.includes('artist') || q.includes('who')) {
            return `'${exhibit.title}' கலைப்படைப்பு தலைசிறந்த கலைஞர் ${exhibit.artist} அவர்களால் ${exhibit.year} இல் உருவாக்கப்பட்டது. இது ${exhibit.category} கலை இயக்கத்தின் உன்னத சான்றாகும்.`;
        }
        return `'${exhibit.title}': ${exhibit.translations?.ta?.description || exhibit.description} கலைஞர் ${exhibit.artist} அவர்களின் இந்த படைப்பு ${exhibit.location} அரங்கில் பார்வைக்கு வைக்கப்பட்டுள்ளது.`;
    }
    if (q.includes('நேரம்') || q.includes('டிக்கெட்') || q.includes('ticket') || q.includes('hour')) {
        return `அருங்காட்சியகம் தினமும் காலை 9:00 மணி முதல் மாலை 7:00 மணி வரை திறந்திருக்கும். நுழைவுக் கட்டணம்: பொது $20, மாணவர்கள் $12. டிஜிட்டல் டிக்கெட்டுகளை ஆப் மூலம் எளிதாகப் பெறலாம்.`;
    }
    return `வணக்கம்! நான் ஏதெனா, உங்கள் ஏஐ அருங்காட்சியக கலை வழிகாட்டி. அருங்காட்சியகத்தின் அரிய கலைப்படைப்புகள், கலைஞர்கள் மற்றும் வழிகாட்டுதல்கள் குறித்து நீங்கள் என்னிடம் கேட்கலாம்.`;
}
function generateHindiAIResponse(q, exhibit) {
    if (exhibit) {
        if (q.includes('किसने') || q.includes('बनाया') || q.includes('artist') || q.includes('who')) {
            return `'${exhibit.title}' महान कलाकार ${exhibit.artist} द्वारा वर्ष ${exhibit.year} में बनाई गई थी। यह ${exhibit.category} शैली की एक ऐतिहासिक कृति है।`;
        }
        return `'${exhibit.title}': ${exhibit.translations?.hi?.description || exhibit.description} यह कृति ${exhibit.location} में प्रदर्शित है।`;
    }
    if (q.includes('समय') || q.includes('टिकट') || q.includes('ticket') || q.includes('time')) {
        return `संग्रहालय प्रतिदिन सुबह 9:00 बजे से शाम 7:00 बजे तक खुला रहता है। सामान्य टिकट $20 और छात्र टिकट $12 है।`;
    }
    return `स्मार्ट संग्रहालय में आपका स्वागत है! मैं आपकी एआई कला विशेषज्ञ 'एथेना' हूँ। आप किसी भी कलाकृति, कलाकार या दीर्घा के बारे में पूछ सकते हैं।`;
}
function generateFrenchAIResponse(q, exhibit) {
    if (exhibit) {
        return `L'œuvre '${exhibit.title}' a été créée par ${exhibit.artist} en ${exhibit.year} (${exhibit.category}). ${exhibit.translations?.fr?.description || exhibit.description} Elle est exposée dans ${exhibit.location}.`;
    }
    return `Bienvenue au Musée Intelligent ! Je suis Athena, votre guide artistique IA. Comment puis-je vous accompagner dans votre visite aujourd'hui ?`;
}
function generateSpanishAIResponse(q, exhibit) {
    if (exhibit) {
        return `'${exhibit.title}' fue realizada por el maestro ${exhibit.artist} en ${exhibit.year}. Es una obra cumbre del ${exhibit.category}. Ubicación: ${exhibit.location}. ${exhibit.translations?.es?.description || exhibit.description}`;
    }
    return `¡Bienvenido al Museo Inteligente! Soy Athena, su guía curatorial de IA. Puede preguntarme sobre obras maestras, artistas y horarios.`;
}
