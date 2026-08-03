import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini client if API key exists
const getGenAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
};

// First person perspective check helper
function checkFirstPerson(text: string): boolean {
  const lower = text.toLowerCase();
  const firstPersonPronouns = ['aku', 'saya', 'gue', 'gw', 'daku', 'ku ', 'ku,', 'ku.', 'kua', 'ku-'];
  return firstPersonPronouns.some(p => lower.includes(p));
}

// Lexicon keyword detector
function checkLexicon(text: string): boolean {
  const lower = text.toLowerCase();
  const keywords = [
    'stres', 'stress', 'depresi', 'depression', 'cemas', 'anxiety', 'panik', 'khawatir',
    'capek mental', 'burnout', 'overthinking', 'pengen nyerah', 'hampa', 'putus asa',
    'kesepian', 'terpuruk', 'kecewa', 'menyerah', 'sendirian', 'tak berguna'
  ];
  return keywords.some(k => lower.includes(k));
}

// Simulated rule-based fallback classification
function fallbackClassify(text: string) {
  const lower = text.toLowerCase();
  const isFirstPerson = checkFirstPerson(lower);
  const hasLexicon = checkLexicon(lower);

  let predictedLabel: 'Positif Terindikasi (1)' | 'Netral (0)' = 'Netral (0)';

  if (!isFirstPerson && hasLexicon) {
    // Third person mentioning depression/stress -> Netral (e.g., "temenku depresi")
    predictedLabel = 'Netral (0)';
  } else if (lower.includes('depresi') || lower.includes('pengen nyerah') || lower.includes('hampa') || lower.includes('putus asa') || lower.includes('terpuruk') || lower.includes('stres') || lower.includes('burnout') || lower.includes('overthinking') || lower.includes('capek mental') || lower.includes('cemas')) {
    predictedLabel = 'Positif Terindikasi (1)';
  } else {
    predictedLabel = 'Netral (0)';
  }

  // IndoBERTweet is more confident on informal social media text
  const isInformal = lower.includes('bgt') || lower.includes('btw') || lower.includes('burnout') || lower.includes('overthinking') || lower.includes('gue') || lower.includes('gw') || lower.includes('ngerasa') || lower.includes('nyerah');

  const baseSubwords = lower.split(' ').flatMap(w => w.length > 7 ? [w.slice(0, 4), '##' + w.slice(4)] : [w]);
  const tweetSubwords = lower.split(' ');

  let baseProbs = { 'Positif Terindikasi (1)': 0.30, 'Netral (0)': 0.70 };
  let tweetProbs = { 'Positif Terindikasi (1)': 0.20, 'Netral (0)': 0.80 };

  if (predictedLabel === 'Positif Terindikasi (1)') {
    baseProbs = { 'Positif Terindikasi (1)': 0.85, 'Netral (0)': 0.15 };
    tweetProbs = { 'Positif Terindikasi (1)': 0.94, 'Netral (0)': 0.06 };
  }

  const wordWeights = tweetSubwords.map(w => ({
    word: w,
    weight: checkLexicon(w) ? (isFirstPerson ? 0.8 : 0.3) : 0.05
  }));

  return {
    inputText: text,
    processedText: lower.replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ').trim(),
    firstPersonValidated: isFirstPerson,
    hasLexiconKeyword: hasLexicon,
    indoBertBase: {
      label: predictedLabel,
      probabilities: baseProbs,
      latencyMs: isInformal ? 54.2 : 44.1,
      ramUsageMb: 1240,
      subwords: ['[CLS]', ...baseSubwords, '[SEP]'],
      oovCount: isInformal ? 3 : 1,
      explanation: isInformal 
        ? "IndoBERT-Base memecah kata slang/code-mixing menjadi subword terpisah (OOV)." 
        : "IndoBERT-Base dapat mengenali kata baku.",
      wordWeights
    },
    indoBertweet: {
      label: predictedLabel,
      probabilities: tweetProbs,
      latencyMs: isInformal ? 31.8 : 29.5,
      ramUsageMb: 980,
      subwords: ['[CLS]', ...tweetSubwords, '[SEP]'],
      oovCount: 0,
      explanation: "IndoBERTweet mengenali slang & istilah informal tanpa fragmentasi.",
      wordWeights
    },
    recommendedModel: 'IndoBERTweet' as const,
    analysisNote: isFirstPerson && predictedLabel === 'Positif Terindikasi (1)'
      ? `Validasi sudut pandang orang pertama terpenuhi. Model mengidentifikasi indikasi positif.` 
      : `Teks tidak memuat ungkapan diri, diklasifikasikan sebagai Netral/Tidak Terindikasi.`
  };
}

// API endpoint for model classification comparison
app.post("/api/classify", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== "string") {
      res.status(400).json({ error: "Text parameter is required" });
      return;
    }

    const ai = getGenAI();
    if (!ai) {
      // Return simulated NLP classifier response
      res.json(fallbackClassify(text));
      return;
    }

    // Use Gemini 3.6 Flash to provide enhanced tokenization & probability comparison
    const prompt = `
You are an expert NLP researcher comparing two BERT model variants for Indonesian mental health text binary classification:
1. IndoBERT-Base (trained on formal news/Wikipedia data)
2. IndoBERTweet (trained on 3M+ Indonesian tweets, specialized for social media slang & code-mixing)

Input Text: "${text}"

Classes: "Positif Terindikasi (1)" or "Netral (0)".
Rules for Ground Truth:
- "Positif Terindikasi (1)": First-person self-disclosure ("aku", "gue", "saya") expressing mental health issues, hopelessness, stress, anxiety, "capek mental", etc.
- "Netral (0)": No personal mental health distress, third-person descriptions ("temenku depresi"), public education/info, physical tired, or positive text.

Provide a JSON response matching this exact structure:
{
  "inputText": "${text}",
  "processedText": "<cleaned lowercase text>",
  "firstPersonValidated": <true/false if first person pronoun present>,
  "hasLexiconKeyword": <true/false if mental health lexicon detected>,
  "indoBertBase": {
    "label": "<Positif Terindikasi (1) | Netral (0)>",
    "probabilities": { "Positif Terindikasi (1)": <0.0-1.0>, "Netral (0)": <0.0-1.0> },
    "latencyMs": <simulated CPU latency 42-58>,
    "ramUsageMb": 1240,
    "subwords": ["<array of subwords with [CLS] and [SEP]>"],
    "oovCount": <number of fragmented/OOV subwords>,
    "explanation": "<short explanation of how IndoBERT-Base handled the vocabulary>",
    "wordWeights": [
      { "word": "<word>", "weight": <0.0-1.0 impact on classification> }
    ]
  },
  "indoBertweet": {
    "label": "<Positif Terindikasi (1) | Netral (0)>",
    "probabilities": { "Positif Terindikasi (1)": <0.0-1.0>, "Netral (0)": <0.0-1.0> },
    "latencyMs": <simulated CPU latency 28-36>,
    "ramUsageMb": 980,
    "subwords": ["<array of subwords with [CLS] and [SEP]>"],
    "oovCount": <number of fragmented/OOV subwords>,
    "explanation": "<short explanation of how IndoBERTweet handled the informal vocabulary>",
    "wordWeights": [
      { "word": "<word>", "weight": <0.0-1.0 impact on classification> }
    ]
  },
  "recommendedModel": "IndoBERTweet",
  "analysisNote": "<academic analysis note in Indonesian explaining why it is classified as such (e.g. why neutral or positive) and word importance for explainability>"
}

Ensure sum of probabilities for each model equals 1.0. Output raw JSON only.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const responseText = response.text || "";
    try {
      const parsed = JSON.parse(responseText);
      res.json(parsed);
    } catch {
      res.json(fallbackClassify(text));
    }
  } catch (error) {
    console.error("Classification error:", error);
    res.json(fallbackClassify(req.body?.text || ""));
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
