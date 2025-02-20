import React from 'react';
import { View, Image, StyleSheet, Dimensions, Pressable, ScrollView, Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Film detayları için tip tanımlaması
type Movie = {
  id: number;
  title: string;
  overview: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
};

// Film detay ekranı bileşeni
export default function MovieDetailsScreen() {
  // Router ve URL parametrelerini alıyoruz
  const params = useLocalSearchParams<{ movie: string }>();
  const router = useRouter();
  
  // Film ve favori durumu için state tanımlamaları
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    // URL'den gelen film verisini parse ediyoruz
    if (params.movie) {
      const movieData = JSON.parse(params.movie) as Movie;
      setMovie(movieData);
      
      // Filmin favori durumunu kontrol ediyoruz
      checkIfFavorite(movieData.id);
    }
  }, [params.movie]);

  // Filmin favori durumunu AsyncStorage'dan kontrol eden fonksiyon
  const checkIfFavorite = async (movieId: number) => {
    try {
      const favorites = await AsyncStorage.getItem('favorites');
      if (favorites) {
        const favoritesList = JSON.parse(favorites) as Movie[];
        setIsFavorite(favoritesList.some(fav => fav.id === movieId));
      }
    } catch (error) {
      console.error('Favori durumu kontrol edilirken hata:', error);
    }
  };

  // Favorilere ekleme/çıkarma işlemini yapan fonksiyon
  const toggleFavorite = async () => {
    if (!movie) return;

    try {
      // Mevcut favorileri al
      const favorites = await AsyncStorage.getItem('favorites');
      let favoritesList: Movie[] = favorites ? JSON.parse(favorites) : [];

      if (isFavorite) {
        // Favorilerden çıkar
        favoritesList = favoritesList.filter(fav => fav.id !== movie.id);
      } else {
        // Favorilere ekle
        favoritesList.push(movie);
      }

      // Güncellenmiş favori listesini kaydet
      await AsyncStorage.setItem('favorites', JSON.stringify(favoritesList));
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Favori işlemi hatası', error);
    }
  };

  // Film verisi yüklenene kadar yükleniyor mesajı göster
  if (!movie) {
    return (
      <View style={styles.container}>
        <Text>Yükleniyor...</Text>
      </View>
    );
  }

  // Film detay ekranının ana render fonksiyonu
  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: `https://image.tmdb.org/t/p/w500${movie.backdrop_path}` }}
            style={styles.backdropImage}
            resizeMode="cover"
          />
          <Pressable 
            style={styles.favoriteButton}
            onPress={toggleFavorite}
          >
            <Ionicons 
              name={isFavorite ? "heart" : "heart-outline"} 
              size={28} 
              color={isFavorite ? "red" : "white"} 
            />
          </Pressable>
          <View style={styles.backButtonContainer}>
            <Pressable onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={28} color="white" />
            </Pressable>
          </View>
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.title}>{movie.title}</Text>
          <Text style={styles.year}>
            {new Date(movie.release_date).getFullYear()}
          </Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={20} color="yellow" />
            <Text style={styles.rating}>
              {movie.vote_average.toFixed(1)}
            </Text>
          </View>
          <Text style={styles.overview}>{movie.overview}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

// Stil tanımlamaları
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  imageContainer: {
    height: Dimensions.get('window').height * 0.4,
    width: Dimensions.get('window').width,
    position: 'relative',
  },
  backdropImage: {
    width: '100%',
    height: '100%',
  },
  backButtonContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 25,
  },
  favoriteButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 25,
  },
  detailsContainer: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  year: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 16,
    color: 'gray',
    marginLeft: 8,
  },
  overview: {
    fontSize: 16,
    color: 'white',
    lineHeight: 24,
  },
});
