import { useState, useEffect } from "react";

export default function Content({ title }) {
  const [manga, setManga] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [translate, setTranslate] = useState('');
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const fetchManga = async () => {
      try {
        const response = await fetch(`https://api.jikan.moe/v4/manga?q=${title}`);
        const data = await response.json();

        if (data.data.length > 0) {
          setManga(data.data[0]); // Ambil manga pertama dari hasil
          setTranslate(data.data[0].synopsis);
        } else {
          setError('Manga not found.');
        }
        setLoading(false);
      } catch (e) {
        setError(e.message);
        setLoading(false);
      }
    };    
    
    if (title) {
      setLoading(true); // Reset loading ketika melakukan pencarian baru
      fetchManga();
    }
  }, [title]);

  const switchToId = async () => {
    if (!manga || !manga.synopsis) return;

    try {
      const response = await fetch('https://libretranslate.com/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          q: manga.synopsis,
          source: 'en',
          target: 'id',
        })
      });

      const data = await response.json();
      setTranslate(data.translatedText|| 'Terjemahan untuk indonesia tidak tersedia');
      setLanguage('id');
    } catch(e) {
      setError(e.message);
    }
  }

  const switchToEn = () => {
    if (!manga || !manga.synopsis) return;
    setTranslate(manga.synopsis);
    setLanguage('en')
  }

  const japaneseTitle = manga?.titles?.find(t => t.type === "Japanese")?.title || "N/A";

  if (loading) return <p className="text-gray-500">Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="content-app mt-8">
      {manga && (
        <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Menambahkan gambar cover */}
            <img
              src={manga.images.jpg.large_image_url}
              alt={`${manga.title} cover`}
              className="w-64 h-auto object-cover rounded-md shadow-lg mx-auto md:mx-0 md:mr-6"
            />
            <div className="px-6 py-4">
              <h2 className="text-2xl font-bold mb-2 text-gray-800">{manga.title}</h2>
              <h2 className="text-2xl font-bold mb-2 text-gray-800">Japan: {japaneseTitle}</h2>
              <p className="text-gray-700"><strong>Author:</strong> {manga.authors.map((author) => author.name).join(', ')}</p>
              <p className="text-gray-700"><strong>Score:</strong> {manga.score}</p>
              <p className="text-gray-700"><strong>Status:</strong> {manga.status}</p>
              <p className="text-gray-700"><strong>Published:</strong> {manga.published.string}</p>
              <p className="text-gray-700"><strong>Type:</strong> {manga.type}</p>
              <p className="text-gray-700"><strong>Chapter:</strong> {manga.chapters || 'N/A'}</p>
              <p className="text-gray-700"><strong>Volume:</strong> {manga.volumes || 'N/A'}</p>
              <p className="text-gray-700"><strong>Genre:</strong> {manga.genres.map((genre) => genre.name).join(", ")}</p>
              <p className="text-gray-700 mt-4">
                <strong>Synopsis ({language.toUpperCase()}):</strong> {translate}
              </p>
              <div className="buttons mt-5 flex relative bottom-0 left-0 right-0">
              <div
                className={`p-2 rounded-tl-lg rounded-bl-lg cursor-pointer text-slate-50 ${language === 'en' ? 'bg-sky-500' : 'bg-slate-400'}`}
                onClick={switchToEn}
              >
                EN
              </div>
              <div
                className={`p-2 rounded-tr-lg rounded-br-lg cursor-pointer text-slate-50 ${language === 'id' ? 'bg-sky-500' : 'bg-slate-400'}`}
                onClick={switchToId}
              >
                ID
              </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}