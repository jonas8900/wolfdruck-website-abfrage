import WebsiteForm from "@/components/form/website-form";
import Navbar from "@/components/navigation/navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
        <Navbar />
      {/* Formular */}
        <WebsiteForm/>
    </div>
  );
}
