import { Router } from 'express';

const router = Router();

// Map supported app language codes to Google TTS codes
const langCodeMap: Record<string, string> = {
  en: 'en',
  ta: 'ta',
  hi: 'hi',
  ml: 'ml',
  te: 'te',
  kn: 'kn',
  fr: 'fr',
  de: 'de',
  es: 'es'
};

// GET /api/audio/tts?text=...&lang=...
router.get('/tts', async (req, res) => {
  try {
    const text = (req.query.text as string || '').trim();
    const reqLang = (req.query.lang as string || 'en').toLowerCase().trim();
    const targetLang = langCodeMap[reqLang] || 'en';

    if (!text) {
      return res.status(400).json({ error: 'Text query parameter is required' });
    }

    // Google Translate TTS accepts up to 200 chars per request
    const cleanText = text.slice(0, 200);
    const googleTTSUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(cleanText)}&tl=${targetLang}&client=tw-ob`;

    const response = await fetch(googleTTSUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'audio/mpeg, audio/*;q=0.9, */*;q=0.8',
        'Referer': 'https://translate.google.com/'
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to retrieve TTS audio' });
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', buffer.length);
    res.setHeader('Cache-Control', 'public, max-age=604800, immutable');
    res.send(buffer);
  } catch (err: any) {
    console.error('TTS endpoint error:', err);
    res.status(500).json({ error: 'TTS audio synthesis failed', details: err.message });
  }
});

export default router;
