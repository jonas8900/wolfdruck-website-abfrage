export default function Calculation() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <h1 className="text-3xl font-bold text-center mt-10">Website Kostenrechner</h1>
      <p className="text-center mt-4">Berechne die Kosten für deine individuelle Website.</p>
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <form>
          <label className="block mb-4">
            <span className="text-gray-700">Anzahl der Seiten:</span>
            <input type="number" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500" />
          </label>
          <label className="block mb-4">
            <span className="text-gray-700">Design-Komplexität:</span>
            <select className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500">
              <option value="basic">Basic</option>
              <option value="advanced">Advanced</option>
              <option value="premium">Premium</option>
            </select>
          </label>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">Kosten berechnen</button>
        </form>
      </div>
    </div>
  );
}