import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import CreatableSelect from "react-select/creatable";
import ToastMessage from "../toast/toastmessage";
import escapeHTML from "escape-html";
import { XCircleIcon } from "@heroicons/react/24/solid";
import imageCompression from 'browser-image-compression';

export default function WebsiteForm() {
  const [customFont, setCustomFont] = useState(false);
  const [font, setFont] = useState("Arial");
  const [preview, setPreview] = useState("Modern");
  const [selectedPages, setSelectedPages] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);
  const [imagePreview, setImagePreview] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef();

  const fonts = [
    { name: "Inter", value: "Inter, sans-serif" },
    { name: "Poppins", value: "Poppins, sans-serif" },
    { name: "Roboto", value: "Roboto, sans-serif" },
    { name: "Lato", value: "Lato, sans-serif" },
    { name: "Helvetica", value: "Helvetica, sans-serif" },
    { name: "Verdana", value: "Verdana, sans-serif" },
    { name: "Georgia", value: "Georgia, serif" },
  ];

  function handleFontChange(e) {
    setFont(e.target.value);
  }

  function handleCustomFontChange(e) {
    setPreview(e.target.value);
  }

  console.log("1");
  
  async function handleImageUploadConverter(file) {
    const options = {
      maxSizeMB: 0.3,
      quality: 0.8,
      maxWidthOrHeight: 900,
      useWebWorker: true,
      fileType: "image/webp",
      preserveExif: true,
    };

    try {
      const compressedBlob = await imageCompression(file, options);
      return new File([compressedBlob], file.name, { type: compressedBlob.type });
    } catch (error) {
      console.error("Fehler bei der Komprimierung:", error);
      return file;
    }
  }

  async function handleFileChange(e) {
    const files = Array.from(e.target.files);

    if(files) {
      if(files.size > 10 * 1024 * 1024) {
        setToastMessage({
          type: 'error',
          message: 'Die Datei ist zu groß. Maximal 10 MB erlaubt.',
          timestamp: Date.now(),
        });
        return;
      }
    }

    if (files.length + imagePreview.length > 10) {
      setToastMessage({
        type: 'error',
        message: 'Du kannst maximal 10 Bilder hochladen.',
        timestamp: Date.now(),
      });
      return;
    }

    const compressedPreviews = await Promise.all(
      files.map(async (file) => {
        const compressedFile = await handleImageUploadConverter(file);
        return {
          file: compressedFile,
          url: URL.createObjectURL(compressedFile),
        };
      })
    );

    setImagePreview(prev => {
      const existingNames = new Set(prev.map(p => p.file.name));
      const filtered = compressedPreviews.filter(p => !existingNames.has(p.file.name));
      return [...prev, ...filtered];
    });
  }


  function handleRemoveImage(index) {
    const updatedPreviews = imagePreview.filter((_, i) => i !== index);

    // Entferne URL zur Speicherfreigabe
    URL.revokeObjectURL(imagePreview[index].url);
    setImagePreview(updatedPreviews);

    // Wenn keine mehr da sind → input zurücksetzen
    if (updatedPreviews.length === 0 && inputRef.current) {
      inputRef.current.value = "";
    }
  }

  useEffect(() => {
    if (selectedPages.length > 10) {
      setToastMessage({
        type: "error",
        message: "Du kannst maximal 10 Seiten auswählen.",
        timestamp: Date.now(),
      });

      setSelectedPages(selectedPages.slice(0, 10));
    }
  }, [selectedPages]);

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setToastMessage("");

    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    if (selectedPages.length === 0) {
      setToastMessage({
        type: "error",
        message: "Bitte wähle mindestens eine Seite aus.",
        timestamp: Date.now(),
      });
      setIsSubmitting(false);
      return;
    }

    data.pagenames = selectedPages.map((page) => page.label);
    const pageTexts = {};
    selectedPages.forEach((page) => {
      const key = `pageTexts[${page.value}]`;
      const rawValue = formData.get(key) || "";
      pageTexts[page.label] = escapeHTML(rawValue);
    });
    data.pageTexts = pageTexts;

    [
      "company",
      "address",
      "postcode",
      "city",
      "email",
      "references",
      "extras",
      "customFont",
      "colorPrimary",
      'shortdescription',
      "colorSecondary",
      "font",
      "styleWebsite",
      "startingPages",
      "contactperson",
    ].forEach((key) => {
      data[key] = escapeHTML(data[key] || "");
    });

    const imageFiles = imagePreview.map((p) => p.file);

    if (imageFiles.length > 10) {
      setToastMessage({
        type: "error",
        message: "Du kannst maximal 10 Bilder hochladen.",
        timestamp: Date.now(),
      });
      return;
    }

    try {
      if (imageFiles.length === 0) {
        const response = await fetch("/api/sendRequest", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        const result = await response.json();
        if (response.ok) {
          setToastMessage({
            type: "success",
            message: "Anfrage erfolgreich gesendet! Wir melden uns innerhalb von 24 Stunden bei Ihnen.",
            timestamp: Date.now(),
          });
          form.reset();
          setImagePreview([]);
          setSelectedPages([]);
        } else {
          throw new Error(result.error || "Unbekannter Fehler");
        }
      } else {
        const formDataToSend = new FormData();
        formDataToSend.append("data", JSON.stringify(data));
        imageFiles.forEach((file) => {
          formDataToSend.append("images", file);
        });

        for (let [key, value] of formDataToSend.entries()) {
          console.log(`${key}:`, value);
        }

        const response = await fetch("/api/sendRequestWithFiles", {
          method: "POST",
          body: formDataToSend,
        });

        const result = await response.json();
        if (response.ok) {
          setToastMessage({
            type: "success",
            message: "Anfrage erfolgreich gesendet!",
            timestamp: Date.now(),
          });
          form.reset();
          setSelectedPages([]);
        } else {
          throw new Error(result.error || "Unbekannter Fehler");
        }
      }
    } catch (error) {
      setToastMessage({
        type: "error",
        message: `Fehler beim Senden der Anfrage: ${error.message}`,
        timestamp: Date.now(),
      });
      console.error(error);
    }
    setIsSubmitting(false); 
  }

  return (
    <main className="max-w-4xl mx-auto p-6 mt-10 bg-white rounded shadow">
      {toastMessage && (
        <ToastMessage
          message={toastMessage.message}
          type={toastMessage.type}
          timestamp={toastMessage.timestamp}
        />
      )}
      <h1 className="text-2xl font-semibold">Website-Informationen</h1>
      <h2 className="text-sm text-gray-400 mb-6">
        Alle Eingaben mit * sind Pflichtfelder
      </h2>
      <h2 className="text-sm text-gray-400 mb-6 font-semibold">
        Bitte denken Sie daran: Unvollständig ausgefüllte Angaben bedeuten für uns mehr Aufwand – und können zu einer entsprechenden Preisanpassung führen.
      </h2>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <h3 className="text-xl font-semibold mb-6 mt-12">
          Allgemeine Informationen
        </h3>
         <div>
          <label className="block font-medium mb-1" name="contactperson">
            Ihr vollständiger Name*
          </label>
          <input
            id="contactperson"
            name="contactperson"
            type="text"
            maxLength={250}
            className="w-full border border-gray-300 rounded px-4 py-2"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1" name="company">
            Name der Firma*
          </label>
          <input
            id="company"
            name="company"
            type="text"
            maxLength={250}
            className="w-full border border-gray-300 rounded px-4 py-2"
            required
          />
        </div>

        <div className="space-y-2">
          <div>
            <label className="block font-medium mb-1" htmlFor="address">
              addresse*
            </label>
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
              <label className="block font-medium mb-1" htmlFor="postcode">
                PLZ*
              </label>
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
              <label className="block font-medium mb-1" htmlFor="city">
                Stadt*
              </label>
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
            <label className="block font-medium mb-1" htmlFor="address">
              Email-addresse*
            </label>
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
        <div>
          <label className="block font-medium mb-1" htmlFor="shortdescription">
            Kurze Beschreibung der Firmentätigkeit*
          </label>
          <textarea
            id="shortdescription"
            name="shortdescription"
            maxLength={1000}
            required
            className="w-full border border-gray-300 rounded px-4 py-2"
            rows="3"
          ></textarea>
        </div>

        <h3 className="text-xl font-semibold mb-6 mt-12">
          Informationen zur Website
        </h3>

        <div>
          <label htmlFor="imageUpload" className="block font-medium mb-1">
            Lade die Bilder deiner Website hoch*
          </label>
          <input
            ref={inputRef}
            id="imageUpload"
            name="imageUpload"
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border border-gray-300 rounded px-4 py-2"
          />

          {imagePreview && imagePreview.length > 0 && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
              {imagePreview.map((img, index) => (
                <div
                  key={index}
                  className="border rounded overflow-hidden relative">
                  <XCircleIcon
                    className="h-6 w-6 text-red-500 absolute top-2 right-2 cursor-pointer z-10"
                    onClick={() => handleRemoveImage(index)}
                  />
                  <Image
                    src={img.url}
                    alt={`Upload Preview ${index}`}
                    width={100}
                    height={100}
                    className="w-full h-32 object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <label name="styleWebsite" className="block font-medium mb-1">
            Stil der Website*
          </label>
          <select
            id="styleWebsite"
            name="styleWebsite"
            className="w-full border border-gray-300 rounded px-4 py-2"
            value={preview}
            onChange={handleCustomFontChange}
            required>
            <option>Modern</option>
            <option>Klassisch</option>
            <option>Minimalistisch</option>
            <option>Verspielt</option>
          </select>
        </div>

        {preview && (
          <div className="mt-4 p-4 text-lg border border-gray-300 rounded bg-gray-100">
            <Image
              src={`/websitepreview/${preview}.png`}
              alt="Website Vorschau"
              width={800}
              height={450}
              unoptimized
              className="w-full h-auto rounded"
            />
          </div>
        )}

        <div>
          <label name="colorPrimary" className="block font-medium mb-1">
            Farbschema (Primärfarbe)*
          </label>
          <input
            id="colorPrimary"
            name="colorPrimary"
            type="color"
            className="w-16 h-10 border border-gray-300 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">
            Farbschema (Sekundärfarbe)
          </label>
          <input
            type="color"
            id="colorSecondary"
            name="colorSecondary"
            className="w-16 h-10 border border-gray-300 rounded"
          />
        </div>

        {!customFont && (
          <div>
            <label htmlFor="fontSelect" className="block font-medium mb-1">
              Schriftart
            </label>
            <select
              id="fontSelect"
              name="font"
              className="w-full border border-gray-300 rounded px-4 py-2"
              onChange={handleFontChange}
              value={font}>
              {fonts.map((fontOption) => (
                <option key={fontOption.name} value={fontOption.value}>
                  {fontOption.name}
                </option>
              ))}
            </select>

            <div
              className="mt-4 p-4 text-lg border border-gray-300 rounded bg-gray-100"
              style={{ fontFamily: font }}>
              Vorschau: Dies ist die Website Vorschau mit der ausgewählten
              Schriftart.
            </div>
          </div>
        )}

        <div>
          <label className="block font-medium mb-1">
            Benutzerdefinierte Schriftart
          </label>
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
            <label name="customFont" className="block font-medium mb-1">
              Benutzerdefinierte Schriftart angeben
            </label>
            <input
              id="customFont"
              name="customFont"
              type="text"
              className="w-full border border-gray-300 rounded px-4 py-2"
            />
          </div>
        )}

        <h3 className="text-xl font-semibold mb-6 mt-12">
          Allgemeine Informationen
        </h3>
        <div>
          <label name="pagenames" className="block font-medium mb-1">
            Welche Seiten soll es geben?*
          </label>
          <CreatableSelect
            id="pagenames"
            name="pagenames"
            isMulti
            options={[
              { value: "home", label: "Startseite" },
              { value: "about", label: "Über uns" },
              { value: "services", label: "Dienstleistungen" },
              { value: "prices", label: "Preise" },
              { value: "appointment", label: "Terminvereinbarung" },
              { value: "forum", label: "Forum" },
              { value: "support", label: "Support" },
              { value: "docs", label: "Dokumentation" },
              { value: "contact", label: "Kontakt" },
              { value: "gallery", label: "Galerie" },
              { value: "blog", label: "Blog" },
              { value: "faq", label: "FAQ" },
              { value: "sonstiges", label: "Sonstiges" },
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
                    <label
                      htmlFor={page.value}
                      className="block font-medium mb-1">
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
          <label name="references" className="block font-medium mb-1">
            Referenz-Websites / Wünsche
          </label>
          <textarea
            id="references"
            name="references"
            className="w-full border border-gray-300 rounded px-4 py-2"
            rows="3"></textarea>
        </div>

        <div>
          <label name="extras" className="block font-medium mb-1">
            Besonderheiten
          </label>
          <textarea
            id="extras"
            name="extras"
            className="w-full border border-gray-300 rounded px-4 py-2"
            rows="3"></textarea>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-6 py-2 rounded text-white transition ${
            isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
          }`}>
          {isSubmitting ? "Wird gesendet..." : "Absenden"}
        </button>
      </form>
    </main>
  );
}
