import React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, TextInput, FlatList, Image, Pressable, Dimensions, View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Movie, fetchTrendingMovies, searchMovies } from '@/services/api'; // servisden aldık.

const { width } = Dimensions.get('window');  // tüm ekranının genişliği
const cardColumns = 3;  // Her satırda 3 kart
const cardSpacing = 16; // Kartlar arası boşluk
// Her kartın genişliğini hesaplıyoruz
const availableWidth = width - (2 * cardSpacing); // Sağ ve sol kenar boşluğunu çıkar
const cardWidth = (availableWidth - (2 * cardSpacing)) / 3; // Kartlar arası boşlukları çıkar ve 3'e böl

export default function MoviesScreen() {
  //statee yapısı.
  const [movies, setMovies] = useState<Movie[]>([]); //film listesi tutan state.
  const [searchQuery, setSearchQuery] = useState(''); // search bar metin stateti......
  const router = useRouter(); // sayfa yönlendrmesi için (navigation) işlemi .

  useEffect(() => {
    loadTrendingMovies(); // sayfa yüklendipğinde filmleri yüklüyo...!
  }, []);

  // filmleri çek.
  const loadTrendingMovies = async () => {  // asenkron kullandım, api yi bekle, senkron ol.
    try {
      const data = await fetchTrendingMovies();  // isteği atıp api verisini data ya yükle. 
      setMovies(data.results); // filmler çekilsin ve movies e kaydet, setle.
    } catch (error) {
      console.error('error movirs:', error); // hatalar falan.
    }
  };

  // Arama işlemleri!:)
  const handleSearch = async (text: string) => {    // Parametre olarak text aldırdım.
    setSearchQuery(text);                           // yazılan texti güncelle.
    
    if (text.length > 2) {                         // en az 2 harf yazılınca sonuç almak içindi.
      try {
        const results = await searchMovies(text);   // searchmovie ile api istek at
        setMovies(results.results);                 // sonra movie kaydet, liste güncellernir
      } catch (error) {
        console.error('Arama hatası:', error);   
      }
    } else if (text.length === 0) {                // text yoksa
      loadTrendingMovies();                        // listede popüler filmleri göster.
    }
  };

  // Film kartları.
  const movieCard = ({ item }: { item: Movie }) => ( // movie tipinde item bilgisi aldık.
    <Pressable 
      style={styles.movieCard}             
      onPress={() => movieCardPress(item)} 
    >
      <Image
        source={{
          uri: `https://image.tmdb.org/t/p/w500${item.poster_path}`
        }}
        style={styles.poster}
      />
      <View style={styles.textContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.year}>
          {item.release_date}
        </Text>
      </View>
    </Pressable>
  );

  const movieCardPress = (movie: Movie) => {
    router.push({ //detay ekranına pushla yerimiz.
      pathname: '/movie-details', 
      params: { movie: JSON.stringify(movie) }
    });
  };

  // genel ana ekran 
  return (
    <View style={styles.safeArea}>              
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Film Ara"            
            placeholderTextColor="white"        
            value={searchQuery}                  
            onChangeText={handleSearch} // Text değişince arama yap
          />
        </View>
        <Text style={styles.headerTitle}>Popüler Filmler</Text>
        <FlatList 
          data={movies} // liste,kartlar (grid yapısı)
          renderItem={movieCard} // film listesi= movieCard fonksiyonu kulanıp kart oluşturdum
          keyExtractor={(item) => item.id.toString()} // her kart için key ve id yi string çevirme yeri
          numColumns={cardColumns} //sütun 
          contentContainerStyle={styles.listStyle}  // Liste düzeni...
          columnWrapperStyle={styles.cardStyle}    // kart düzeni....
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'black',
  },
  container: {
    flex: 1,
    paddingTop: 50,
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  searchContainer: {
    padding: cardSpacing,
    paddingBottom: 10,
    zIndex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  searchInput: {
    height: 40,
    backgroundColor: 'dimgray',
    borderRadius: 20,
    paddingHorizontal: 15,
    color: 'white',
    fontSize: 14,
  },
  listStyle: {
    padding: cardSpacing,
  },
  cardStyle: {
    justifyContent: 'space-between',
    marginBottom: cardSpacing,
  },
  movieCard: {
    width: cardWidth,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'darkgray',
    elevation: 5,
    shadowColor: 'black',
  },
  poster: {
    width: '100%',
    height: cardWidth * 1.5,
  },
  textContainer: {
    backgroundColor: '#222',
    padding: 8,
  },
  title: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  year: {
    fontSize: 10,
    marginTop: 4,
    color: 'white',
  },
});