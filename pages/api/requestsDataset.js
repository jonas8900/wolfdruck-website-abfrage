import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import dbConnect from "@/db/connect";
import Request from "@/db/models/Request";

export default async function handler(req, res) {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
        return res.status(403).json({ message: "No access" });
    }

    await dbConnect();

    const { id } = req.query;
    console.log(id);


    if (req.method !== "GET") {
        return res.status(405).json({ message: `Methode ${req.method} nicht erlaubt` });
    }

    try {
        const request = await Request.findById(id); 
        if (!request) {
            return res.status(404).json({ error: "Request nicht gefunden" });
        }
        res.status(200).json(request);
    } catch (error) {
        console.error("Fehler beim Abrufen der Anfrage:", error);
        res.status(500).json({ error: "Interner Serverfehler" });
    }
}
