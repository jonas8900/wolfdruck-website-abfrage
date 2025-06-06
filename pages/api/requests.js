import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import dbConnect from "@/db/connect";
import Request from "@/db/models/Request";

export default async function handler(req, res) {

    const session = await getServerSession(req, res, authOptions); 

    if (!session) {
        return response.status(403).json({ message: "No access" });
    }

    await dbConnect();

    if( req.method !== "GET") {
        return res.status(405).json({ message: `Methode ${req.method} nicht erlaubt` });
    }

    try {
        const requests = await Request.find();
        res.status(200).json(requests);
    } catch (error) {
        console.error("Fehler beim Abrufen der Anfragen:", error);
        res.status(500).json({ error: "Interner Serverfehler" });
    }
    





}