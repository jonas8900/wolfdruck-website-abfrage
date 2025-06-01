import Calculation from "@/components/calculation/calculation";
import Navbar from "@/components/navigation/navbar";

export default function Calculator() {
    return (
       <div className="min-h-screen bg-gray-100 text-gray-900">
             <Navbar />
           {/* Formular */}
             <Calculation/>
         </div>
    );
}