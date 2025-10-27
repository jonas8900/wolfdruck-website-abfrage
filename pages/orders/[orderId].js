import Image from "next/image";
import { useRouter } from "next/router";
import useSWR from "swr";


export default function OrderDetails() {
    const router = useRouter();
    const { orderId } = router.query;

    const { data, error, isLoading } = useSWR(
        orderId ? `/api/requestsDataset?id=${orderId}` : null
    );

    if (!orderId || isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-900">
                <p className="text-gray-400 text-lg">Lade Auftragsdetails...</p>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-900">
                <p className="text-red-500 text-lg">Fehler beim Laden der Daten</p>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-5xl mx-auto text-gray-100">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Auftragsdetails</h1>
                <button
                    onClick={() => router.push("/admindata")}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded shadow"
                >
                    Zurück
                </button>
            </div>

            <section className="bg-gray-800 rounded-xl shadow p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Kundendaten</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-base">
                    <p><span className="font-medium font-semibold">Firma:</span> {data.company}</p>
                    <p><span className="font-medium font-semibold">Name der Person:</span> {data.contactperson}</p>
                    <p><span className="font-medium font-semibold">E-Mail:</span> {data.email}</p>
                    <p><span className="font-medium font-semibold">Status:</span> {data.status}</p>
                    <p><span className="font-medium font-semibold">Erstellt am:</span> {new Date(data.createdAt).toLocaleDateString()}</p>
                    <p><span className="font-medium font-semibold">Bestell-ID:</span> {data.orderid}</p>
                    <p><span className="font-medium font-semibold">Adresse:</span> {data.address}</p>
                    <p><span className="font-medium font-semibold">PLZ / Stadt:</span> {data.postcode} {data.city}</p>
                </div>
            </section>

            <section className="bg-gray-800 rounded-xl shadow p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Anfrage</h2>
                <div className="space-y-3 text-base">
                    <p><span className="font-medium font-semibold">Kurzbeschreibung:</span> {data.shortdescription}</p>
                    <p><span className="font-medium font-semibold">Primäre Farbe:</span> {data.colorPrimary}</p>
                    <p><span className="font-medium font-semibold">Sekundäre Farbe:</span> {data.colorSecondary}</p>
                    <p><span className="font-medium font-semibold">Schriftart:</span> {data.font}</p>
                    <p><span className="font-medium font-semibold">Benutzerdefinierte Schriftart:</span> {data.customFont}</p>
                    <p><span className="font-medium font-semibold">Stil der Website:</span> {data.styleWebsite}</p>
                    <p><span className="font-medium font-semibold">Startseiten:</span> {data.startingPages}</p>
                    <p><span className="font-medium font-semibold">Seitenamen:</span> {data.pagenames?.join(", ")}</p>
                    <p><span className="font-medium font-semibold">Referenzen:</span> {data.references}</p>
                </div>
            </section>

            <section className="bg-gray-800 rounded-xl shadow p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Seiteninhalte</h2>
                <div className="space-y-3 text-base">
                    {data.pageTexts && Object.entries(data.pageTexts).map(([page, text]) => (
                        <p key={page}><span className="font-medium font-semibold">{page}:</span> {text}</p>
                    ))}
                </div>
            </section>

            <section className="bg-gray-800 rounded-xl shadow p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Bilder</h2>
                {data.images && data.images.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {data.images.map((image, index) => (
                            <Image
                                key={index}
                                src={image}
                                width={300}
                                height={200}
                                alt={`Bild ${index + 1}`}
                                className="rounded shadow object-cover"
                            />
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-400">Keine Bilder vorhanden</p>
                )}
            </section>

            {data.extras && (
                <section className="bg-gray-800 rounded-xl shadow p-6 mb-12">
                    <h2 className="text-xl font-semibold mb-4">Extras</h2>
                    <p className="text-base">{data.extras}</p>
                </section>
            )}
        </div>
    );
}
