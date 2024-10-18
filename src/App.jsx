import { useState } from 'react';
import './App.css';
import Content from './components/content/Content';

function App() {
  const [searchTitle, setSearchTitle] = useState('chainsaw man');
  const [searchQuery, setSearchQuery] = useState('');

  // Fungsi untuk mengubah searchQuery ketika tombol search atau enter ditekan
  const handleSearch = () => {
    setSearchQuery(searchTitle);
  };

  // Fungsi untuk mendeteksi Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Manga Search</h1>

      <div className="mb-4 w-full max-w-lg flex">
        <input
          type="text"
          value={searchTitle}
          onChange={(e) => setSearchTitle(e.target.value)}
          onKeyPress={handleKeyPress} // Event listener untuk mendeteksi Enter
          placeholder="Enter manga title..."
          className="w-full px-4 py-2 border border-gray-300 rounded-l-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded-r-lg shadow-sm hover:bg-blue-600 transition duration-300"
        >
          Search
        </button>
      </div>

      <Content title={searchQuery} />
    </div>
  );
}

export default App;