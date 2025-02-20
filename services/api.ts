// (API Entegrasyonu) ödev.... 
// typescript kodu çünkü react bileşeni yokk..

import axios from 'axios'; // HTTP istekleri için Axios kütüphanesi

const apiBaseUrl = 'https://api.themoviedb.org/3';
const apiKey = 'ff8d5fe53a4adc3caeeb2cdebe5f52b6'; 

// (API isteği)
const apiCall = async (endpoint: string, params = {}) => {
  
  // options objesi - API isteği için gerekli ayarlar:
  const options = {
    method: 'GET', // get methodu ile veriyi al 
    url: endpoint, // url....
    params: { api_key: apiKey, ...params }  // API anahtarı ve diğer parametreler
  };

  try {
    const response = await axios.request(options);  // isteği atmaca.
    return response.data;  // başarı olursa veriyi döndür.....
  } catch (error) {
    console.log('error: ', error);  
    return {};  // Hata varsa boş döndür.....
  }
};

// veriler ve tip.....
export type Movie = {
  id: number;           
  title: string;        
  poster_path: string;  
  release_date: string; 
  backdrop_path?: string; 
  overview?: string;    
  vote_average: number; 
};

// Genre (Kategori) tipi
export interface Genre {
  id: number;
  name: string;
}

export const fetchTrendingMovies = async () => {
  return apiCall(`${apiBaseUrl}/trending/movie/day`); // popüler filmler fonksiyonu....
};

// Film arama fonksiyonu
export const searchMovies = async (query: string) => {
  return apiCall(`${apiBaseUrl}/search/movie`, { query }); // Film adına göre arama yap....(query)
};

// Kategorileri getiren ...
export const fetchGenres = async () => {
  const endpoint = `${apiBaseUrl}/genre/movie/list`;
  return apiCall(endpoint);
};

// Kategoriye göre filmleri getiren!!
export const fetchMoviesGenre = async (genreId: number) => {
  const endpoint = `${apiBaseUrl}/discover/movie`;
  return apiCall(endpoint, { with_genres: genreId });
};