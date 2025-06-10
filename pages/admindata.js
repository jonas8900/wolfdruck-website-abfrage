import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/solid";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import useSWR from "swr";

export default function AdminData() {
    const { data: session, status } = useSession();
    const {data: orders, error, isLoading} = useSWR('/api/requests')
    const router = useRouter();

    const dummyOrders = [
        {
            id: "A123",
            kunde: "Müller GmbH",
            datum: "2025-06-06",
            status: "In Bearbeitung",
        },
        {
            id: "B456",
            kunde: "Schmidt & Co.",
            datum: "2025-06-04",
            status: "Abgeschlossen",
        },
        {
            id: "C789",
            kunde: "Druckerei Wolf",
            datum: "2025-06-01",
            status: "Wartet auf Freigabe",
        },
    ];

    if (status === "loading") {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-gray-500 text-lg">Lade...</p>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-gray-500 text-lg">Lade Aufträge...</p>
            </div>
        );
    }

    function handleSignOut() {
        signOut({ callbackUrl: '/auth/login' });
    }
    
    function handleGetOrder(orderId) {
        router.push(`/orders/${orderId}`);
    }

    if (!session) {
        return (
            <div className="p-4 max-w-xl mx-auto">
                <h1 className="text-2xl font-bold mb-2">Bitte anmelden</h1>
                <p className="mb-1 text-base">Du musst angemeldet sein, um auf diese Seite zuzugreifen.</p>
                <p className="text-base">
                    Klicke <Link href="/auth/login" className="text-blue-600 underline">hier</Link>, um dich anzumelden.
                </p>
            </div>
        );
    }

    return (
        <div className="px-4 py-6 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Begrüßung + Logout */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-6 bg-gray-100 rounded-xl shadow-md">
                    <div className="text-center sm:text-left">
                        <p className="text-base lg:text-lg text-gray-500">Willkommen zurück</p>
                        <p className="text-2xl lg:text-3xl font-semibold text-gray-800">
                            {session.user.firstname} {session.user.lastname}
                        </p>
                    </div>
                    <button
                        onClick={handleSignOut}
                        className="flex items-center gap-2 text-red-600 hover:text-red-800 transition"
                    >
                        <ArrowRightOnRectangleIcon className="h-6 w-6" />
                        <span className="text-base font-medium">Logout</span>
                    </button>
                </div>

                {/* Auftragsliste */}
                <div className="bg-white shadow-md rounded-xl overflow-hidden">
                    <div className="bg-gray-200 px-6 py-3 text-base font-semibold text-gray-700">
                        Aufträge
                    </div>
                    <ul>
                       {orders.map((order) => {
                            order.createdAt = new Date(order.createdAt).toLocaleDateString('de-DE', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                            });

                            return (
                                <li
                                    key={order._id}
                                    onClick={() => handleGetOrder(order._id)}
                                    className="border-b px-6 py-4 hover:bg-gray-50 transition cursor-pointer"
                                >
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-base lg:text-lg font-medium text-gray-800">#{order._id}</p>
                                            <p className="text-sm lg:text-base text-gray-500">{order.company}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-400">{order.status}</p>
                                            <p className="text-base text-blue-600">{order.createdAt}</p>
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        </div>
    );
}
