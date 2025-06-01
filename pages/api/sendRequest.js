import dbConnect from "@/db/connect";
import Request from "@/db/models/Request";
import { limiter } from "@/lib/rate-limit"; 

export default async function handler(req, res) {
  try {
    // await limiter.check(res, 5, 'REQUEST_WEBSITE_LIMIT');

    if (req.method !== "POST") {
      return res.status(405).json({ message: `Methode ${req.method} nicht erlaubt` });
    }

    await dbConnect();
    const requestData = req.body;

    const { company, pagenames, pageTexts } = req.body;

    if (typeof company !== 'string' || company.length > 100) {
        return res.status(400).json({ error: 'Ungültiger Firmenname' });
    }

    if (!Array.isArray(pagenames) || pagenames.length > 10) {
        return res.status(400).json({ error: 'Ungültige Seitenliste' });
    }
    
    for (const name of pagenames) {
        if (typeof name !== 'string' || name.includes('$')) {
            return res.status(400).json({ error: 'Ungültiger Seitenname' });
        }
    }

    if (typeof pageTexts !== 'object') {
        return res.status(400).json({ error: 'Ungültige Inhalte' });
    }

    for (const [key, value] of Object.entries(pageTexts)) {
        if (typeof key !== 'string' || key.includes('$')) {
            return res.status(400).json({ error: `Ungültiger Feldname: ${key}` });
        }
        if (typeof value !== 'string' || value.length > 1000) {
            return res.status(400).json({ error: `Ungültiger Text für ${key}` });
        }
    }


    const newRequest = new Request(requestData);
    await newRequest.save();

    res.status(201).json({ message: "Anfrage erfolgreich erstellt", request: newRequest });
  } catch (err) {
    if (err.status === 429) {
      return res.status(429).json({ error: "Zu viele Anfragen. Bitte warte kurz." });
    }

    console.error("Fehler beim Speichern der Anfrage:", err);
    res.status(500).json({ error: "Interner Serverfehler" });
  }
}
