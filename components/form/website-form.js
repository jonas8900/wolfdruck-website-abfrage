import Image from "next/image";
import { useEffect, useState } from "react";
import CreatableSelect from 'react-select/creatable';
import ToastMessage from "../toast/toastmessage";
import escapeHTML from "escape-html";


export default function WebsiteForm() {
    const [customFont, setCustomFont] = useState(false);
    const [font, setFont] = useState('Arial');
    const [preview, setPreview] = useState('modern');
    const [selectedPages, setSelectedPages] = useState([]);
    const [toastMessage, setToastMessage] = useState(null);


    const fonts = [
        { name: 'Inter', value: 'Inter, sans-serif' },
        { name: 'Poppins', value: 'Poppins, sans-serif' },
        { name: 'Roboto', value: 'Roboto, sans-serif' },
        { name: 'Lato', value: 'Lato, sans-serif' },
        { name: 'Helvetica', value: 'Helvetica, sans-serif' },
        { name: 'Verdana', value: 'Verdana, sans-serif' },
        { name: 'Georgia', value: 'Georgia, serif' },
    ];

    function handleFontChange(e) {
        setFont(e.target.value);
    }


    function handleCustomFontChange(e) {
        setPreview(e.target.value);
    }

    useEffect(() => {
      if (selectedPages.length > 10) {
        setToastMessage({
          type: 'error',
          message: 'Du kannst maximal 10 Seiten auswählen.',
          timestamp: Date.now(),
        });

        setSelectedPages(selectedPages.slice(0, 10));
      }
    }, [selectedPages]);

    


   
    async function handleSubmit(event) {
      event.preventDefault();
      setToastMessage('');

      const formData = new FormData(event.target);
      const data = Object.fromEntries(formData);

      if (selectedPages.length === 0) {
        setToastMessage({
          type: 'error',
          message: 'Bitte wähle mindestens eine Seite aus.',
          timestamp: Date.now(),
        });
        return;
      }

      data.pagenames = selectedPages.map(page => page.label);

      const pageTexts = {};
      selectedPages.forEach((page) => {
        const key = `pageTexts[${page.value}]`;
        const rawValue = formData.get(key) || "";
        pageTexts[page.label] = escapeHTML(rawValue);
      });
      data.pageTexts = pageTexts;

      data.company = escapeHTML(data.company || "");
      data.adress = escapeHTML(data.adress || "");
      data.postcode = escapeHTML(data.postcode || "");
      data.city = escapeHTML(data.city || "");
      data.email = escapeHTML(data.email || "");
      data.references = escapeHTML(data.references || "");
      data.extras = escapeHTML(data.extras || "");
      data.customFont = escapeHTML(data.customFont || "");
      data.colorPrimary = escapeHTML(data.colorPrimary || "");
      data.colorSecondary = escapeHTML(data.colorSecondary || "");
      data.font = escapeHTML(data.font || "");
      data.styleWebsite = escapeHTML(data.styleWebsite || "");
      data.startingPages = escapeHTML(data.startingPages || "");

      const response = await fetch('/api/sendRequest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if(data.logoUpload && data.logoUpload.length > 0) {
        const logoFile = formData.get('logoUpload');
        const logoResponse = await fetch('/api/uploadLogo', {
          method: 'POST',
          body: logoFile,
        });
        if (!logoResponse.ok) {
          setToastMessage({
            type: 'error',
            message: 'Fehler beim Hochladen des Logos.',
            timestamp: Date.now(),
          });
          return;
        }
      } 
      

      if (response.ok) {
        const result = await response.json();
        setToastMessage({
          type: 'success',
          message: 'Anfrage erfolgreich gesendet!',
          timestamp: Date.now(),
        });
        event.target.reset(); 
        setSelectedPages([]);
      }
    }



    return(

         <main className="max-w-4xl mx-auto p-6 mt-10 bg-white rounded shadow">
        {toastMessage && (
          <ToastMessage
            message={toastMessage.message}
            type={toastMessage.type}
            timestamp={toastMessage.timestamp}
          />
        )}
        <h1 className="text-2xl font-semibold">Website-Informationen</h1>
        <h2 className="text-sm text-gray-400 mb-6">Alle Eingaben mit * sind Pflichtfelder</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <h3 className="text-xl font-semibold mb-6 mt-12">Allgemeine Informationen</h3>
          <div>
            <label className="block font-medium mb-1" name="company">Name der Firma*</label>
            <input id="company" name="company" type="text" maxLength={250} className="w-full border border-gray-300 rounded px-4 py-2" required/>
          </div>

          <div className="space-y-2">
            <div>
              <label className="block font-medium mb-1" htmlFor="address">Adresse*</label>
              <input
                id="address"
                name="address"
                type="text"
                maxLength={250}
                required
                className="w-full border border-gray-300 rounded px-4 py-2"
              />
            </div>
            <div className="flex gap-2">
              <div className="w-1/3">
                <label className="block font-medium mb-1" htmlFor="postcode">PLZ*</label>
                <input
                  id="postcode"
                  name="postcode"
                  type="text"
                  pattern="\d{5}"
                  title="Bitte gib eine gültige Postleitzahl ein (5 Ziffern)"
                
                  maxLength={10}
                  required
                  className="w-full border border-gray-300 rounded px-4 py-2"
                />
              </div>
              <div className="w-2/3">
                <label className="block font-medium mb-1" htmlFor="city">Stadt*</label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  required
                  className="w-full border border-gray-300 rounded px-4 py-2"
                />
              </div>
            </div>
            <div>
              <label className="block font-medium mb-1" htmlFor="address">Email-Adresse*</label>
              <input
                id="email"
                name="email"
                type="email"
                maxLength={250}
                required
                className="w-full border border-gray-300 rounded px-4 py-2"
              />
            </div>
          </div>

          <h3 className="text-xl font-semibold mb-6 mt-12">Informationen zur Website</h3>
          {/* <div>
            <label name="logoUpload" className="block font-medium mb-1">Logo Upload*</label>
            <input id="logoUpload" name="logoUpload" type="file" className="w-full border border-gray-300 rounded px-4 py-2"/>
          </div> */}

          <div>
            <label name="styleWebsite" className="block font-medium mb-1">Stil der Website*</label>
            <select id="styleWebsite" name="styleWebsite" className="w-full border border-gray-300 rounded px-4 py-2" value={preview} onChange={handleCustomFontChange} required>
              <option>Modern</option>
              <option>Klassisch</option>
              <option>Minimalistisch</option>
              <option>Verspielt</option>
            </select>
          </div>

          {preview && (

            <div
                    className="mt-4 p-4 text-lg border border-gray-300 rounded bg-gray-100"
                >
                <Image 
                    src={`/websitepreview/${preview}.png` }
                    alt="Website Vorschau"
                    width={800}
                    height={450}
                    className="w-full h-auto rounded"
                />
            </div>

            )}

          <div>
            <label name="colorPrimary" className="block font-medium mb-1">Farbschema (Primärfarbe)*</label>
            <input id="colorPrimary" name="colorPrimary" type="color" className="w-16 h-10 border border-gray-300 rounded" required/>
          </div>

          <div>
            <label className="block font-medium mb-1">Farbschema (Sekundärfarbe)</label>
            <input type="color" id="colorSecondary" name="colorSecondary" className="w-16 h-10 border border-gray-300 rounded"/>
          </div>

        {!customFont && (
           <div>
                <label htmlFor="fontSelect" className="block font-medium mb-1">Schriftart</label>
                <select
                    id="fontSelect"
                    name="font"
                    className="w-full border border-gray-300 rounded px-4 py-2"
                    onChange={handleFontChange}
                    value={font}
                >
                    {fonts.map((fontOption) => (
                    <option key={fontOption.name} value={fontOption.value}>
                        {fontOption.name}
                    </option>
                    ))}
                </select>

                <div
                    className="mt-4 p-4 text-lg border border-gray-300 rounded bg-gray-100"
                    style={{ fontFamily: font }}
                >
                    Vorschau: Dies ist die Website Vorschau mit der ausgewählten Schriftart.
                </div>
            </div>
            )}

          <div>
            <label className="block font-medium mb-1">Benutzerdefinierte Schriftart</label>
            <input
              type="checkbox"
              id="customFont"
              name="customFont"
              className="mr-2"
              checked={customFont}
              onChange={() => setCustomFont(!customFont)}
            />
          </div>
           

          {customFont && (
            <div>
              <label name="customFont" className="block font-medium mb-1">Benutzerdefinierte Schriftart angeben</label>
              <input id="customFont" name="customFont" type="text" className="w-full border border-gray-300 rounded px-4 py-2"/>
            </div>
          )}

          <h3 className="text-xl font-semibold mb-6 mt-12">Allgemeine Informationen</h3>
          <div>
            <label name="pagenames" className="block font-medium mb-1">Welche Seiten soll es geben?*</label>
            <CreatableSelect 
              id="pagenames"
              name="pagenames"
              isMulti
              options={[
                { value: 'home', label: 'Startseite' },
                { value: 'about', label: 'Über uns' },
                { value: 'services', label: 'Dienstleistungen' },
                { value: 'prices', label: 'Preise' },
                { value: 'appointment', label: 'Terminvereinbarung' },
                { value: 'forum', label: 'Forum' },
                { value: 'support', label: 'Support' },
                { value: 'docs', label: 'Dokumentation' },
                { value: 'contact', label: 'Kontakt' },
                { value: 'gallery', label: 'Galerie' },
                { value: 'blog', label: 'Blog' },
                { value: 'faq', label: 'FAQ' },
                { value: 'sonstiges', label: 'Sonstiges' },
              ]}
              value={selectedPages}
              onChange={setSelectedPages}
              className="basic-multi-select"
              classNamePrefix="select"
              placeholder="Wähle Seiten aus (Impressum und Datenschutz sind immer dabei)"
              isClearable
              isSearchable
              />
          </div>

          {selectedPages.length > 0 && (
            <>
              {selectedPages.length > 0 && (
                  <>
                    {selectedPages.map((page) => (
                      <div key={page.value} className="mt-4">
                        <label htmlFor={page.value} className="block font-medium mb-1">
                          Welche Texte sollen in {page.label} enthalten sein?
                        </label>
                        <textarea
                          id={page.value}
                          maxLength={1000}
                          name={`pageTexts[${page.value}]`} 
                          className="w-full border border-gray-300 rounded px-4 py-2"
                        />
                      </div>
                    ))}
                  </>
                )}
            </>
          )}

          <div>
            <label name="references" className="block font-medium mb-1">Referenz-Websites / Wünsche</label>
            <textarea id="references" name="references" className="w-full border border-gray-300 rounded px-4 py-2" rows="3"></textarea>
          </div>

                    <div>
            <label name="extras" className="block font-medium mb-1">Besonderheiten</label>
            <textarea id="extras" name="extras" className="w-full border border-gray-300 rounded px-4 py-2" rows="3"></textarea>
          </div>

          <button type="submit" className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600">Absenden</button>
        </form>
      </main>
    )
}


