import React, { useEffect, useState, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, FlatList, Image, StyleSheet, SafeAreaView, Dimensions, Pressable } from 'react-native';
import { fetchGenres, fetchMoviesGenre, Genre, Movie } from '../../services/api'; // api servisinden kullancaklarımızı alıyoz.
import { router } from 'expo-router'; // geçişler için router unutmaa.
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window'); 
// kartrlar için ayarlamaları yaptığım yer burası .
const cardColumns = 3; 
const cardSpacing = 16;
const availableWidth = width - (2 * cardSpacing); 
const cardWidth = (availableWidth - (2 * cardSpacing)) / 3; 

export default function HomeScreen() {
  const [genres, setGenres] = useState<Genre[]>([]); // kategori film için.
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null); //seçilen kategori .
  const [movies, setMovies] = useState<Movie[]>([]); // Filmler için state
  const genresScrollViewRef = useRef<ScrollView>(null);

  useEffect(() => { // aslında yaşam döngüsü, sayfa gelince yükle gibi .
    loadGenres();
    loadLastSelectedGenre();
  }, []);

  useEffect(() => { // kategori değiştiğinde filmleri yükle buradaaaaa
    if (selectedGenre) {
      loadMoviesByGenre(selectedGenre);
    }
  }, [selectedGenre]);

  // kategorileri yükleme yerimizz
  const loadGenres = async () => {
    try {
      const response = await fetchGenres();
      setGenres(response.genres);
      if (response.genres.length > 0) { // ilk açılınca seçilsin diye
        setSelectedGenre(response.genres[0].id);
      }
    } catch (error) {
      console.error('Error loading genres:', error);
    }
  };

  // buda Seçime göre yükleyen kısım. 
  const loadMoviesByGenre = async (genreId: number) => {
    try {
      const response = await fetchMoviesGenre(genreId);
      setMovies(response.results);
    } catch (error) {
      console.error('Error loading movies:', error);
    }
  };

  const loadLastSelectedGenre = async () => {
    try {
      const savedGenre = await AsyncStorage.getItem('lastSelectedGenre');
      if (savedGenre) {
        const genreId = parseInt(savedGenre);
        setSelectedGenre(genreId);
        loadMoviesByGenre(genreId);
        
        // Kategorilerin yüklenmesini bekle
        setTimeout(() => {
          scrollToSelectedGenre(genreId);
        }, 500);
      }
    } catch (error) {
      console.error('Error loading last selected genre:', error);
    }
  };

  const scrollToSelectedGenre = (genreId: number) => {
    const selectedIndex = genres.findIndex(genre => genre.id === genreId);
    if (selectedIndex !== -1 && genresScrollViewRef.current) {
      genresScrollViewRef.current.scrollTo({
        x: selectedIndex * 120, // burayı düzelticem olmadıysa.!!!!!!
        animated: true
      });
    }
  };

  const handleGenrePress = async (genreId: number) => { // kategori butonları!!!!!
    setSelectedGenre(genreId); //seçilen kategori.
    loadMoviesByGenre(genreId);
    scrollToSelectedGenre(genreId); // butonu otomaik kaydır.
    
    try {
      await AsyncStorage.setItem('lastSelectedGenre', genreId.toString()); // kategoriyi sonra Async storage ile kaydetz
    } catch (error) {
      console.error('error', error);
    }
  };

  // Kategori butonunu render eden fonksiyon
  const genreButton = ({ item }: { item: Genre }) => (
    <TouchableOpacity
      style={[
        styles.genreButtonStyle,
        selectedGenre === item.id && styles.selectedGenreButton // seçilince değişsin .buton.
      ]}
      onPress={() => handleGenrePress(item.id)}
    >
      <Text style={[
        styles.genreButtonText,
        selectedGenre === item.id && styles.selectedGenreButtonText
      ]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  // film kartları burada...
  const renderMovieItem = ({ item }: { item: Movie }) => (
    <Pressable
      style={styles.movieCard}
      onPress={() => movieCardPress(item)}
    >
      <Image
        source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
        style={styles.poster}
      />
      <View style={styles.textContainer}>
        <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.year}>{item.release_date}</Text>
      </View>
    </Pressable>
  );

  const movieCardPress = (movie: Movie) => { // detaya gitt!!!! 
    router.push({
      pathname: '/movie-details',
      params: { movie: JSON.stringify(movie) }
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <Text style={styles.headerTitle}>Kategoriler</Text>
        <ScrollView
          ref={genresScrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.genreContainer}
          contentContainerStyle={styles.genreContent}
        >
          {genres.map((genre) => (
            <View key={genre.id} style={styles.genreButtonContainer}>
              {genreButton({ item: genre })}
            </View>
          ))}
        </ScrollView>

        <FlatList // filmler kartlar
          data={movies}
          renderItem={renderMovieItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={cardColumns}
          contentContainerStyle={styles.listStyle}
          columnWrapperStyle={styles.cardStyle}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'black',
  },
  content: {
    flex: 1,
  },
  headerTitle: { // başlık....
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  // kaegori
  genreContainer: { 
    backgroundColor: 'black',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    height: 55,
  },
  // Kategori butonları
  genreButtonContainer: {
    marginHorizontal: 4,
    height: '100%',
    justifyContent: 'center',
  },
  // buton şekil falan
  genreButtonStyle: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#333',
    minWidth: 100,
    alignItems: 'center',
    justifyContent: 'center',
    height: 36,
  },
  // Seçili olanın tipi yaptım 
  selectedGenreButton: {
    backgroundColor: '#FF4D4D',
  },
  genreButtonText: {
    fontSize: 13,
    color: '#999',
    textAlign: 'center',
  },
  selectedGenreButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  // filmlerr
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
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
    color: 'white',
  },
  // buraya tekrar bakıcasss.!!!!!!!!!!!!!!!!!!!!
  year: {
    fontSize: 10,
    marginBottom: 8,
    color: 'white',
  },
  genreContent: {
    paddingHorizontal: 16,
  },
});
