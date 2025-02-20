import { StyleSheet, FlatList, Pressable, Image, Dimensions, View, Text } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useState, useCallback } from 'react';
import { Movie } from '@/services/api';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage'; // veriyi AsyncStorage e kaydetmek amacı.

const { width } = Dimensions.get('window');
const cardColumns = 3; 
const cardSpacing = 16;
// kart genişlik vs hesaplamalarrıı
const availableWidth = width - (2 * cardSpacing); // Sağ sol kenar boşl,
const cardWidth = (availableWidth - (2 * cardSpacing)) / 3; // Kartlar arası boşlukları çıkar ve zböl

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState<Movie[]>([]); // favori filmlerin tutuyoruz burada.
  const router = useRouter(); 

  useFocusEffect( 
    useCallback(() => { //sayfa açıldı ve favorileri yükle!!!! 
      loadFavorites();
    }, [])
  );

  const loadFavorites = async () => { // favorite eklenen filmleri AsyncStorage ile kullanıcıya gösteren fonksyionum.
    try {
      const favoritesData = await AsyncStorage.getItem('favorites'); // liste elimde.
      if (favoritesData) {
        setFavorites(JSON.parse(favoritesData)); // json dan favoritesData set ettiğim yer burası. 
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const removeFromFavorites = async (movieId: number) => { // favori kaldırmaca..
    try {
      const updatedFavorites = favorites.filter(movie => movie.id !== movieId); 
      await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites)); //  favoriden kalkan filmleri updatedFavorites e kaydettimm. 
      setFavorites(updatedFavorites); // ve güncellenir.
    } catch (error) {
      console.error('Errorr:', error);
    }
  };

  const handleMoviePress = (movie: Movie) => { // detaya git->>>>>
    router.push({
      pathname: '/movie-details',
      params: { movie: JSON.stringify(movie) }
    });
  };

  const movieCard = ({ item }: { item: Movie }) => (
    <Pressable
      style={styles.movieCard}
      onPress={() => handleMoviePress(item)}
    >
      <Image
        source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
        style={styles.poster}
      />
      <View style={styles.textContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.year}>
          {new Date(item.release_date).getFullYear()}
        </Text>
      </View>
      <Pressable
        style={styles.favoriteButton}
        onPress={() => removeFromFavorites(item.id)}
      >
        <Ionicons
          name="heart"
          size={24}
          color="red"
        />
      </Pressable>
    </Pressable>
  );

  return ( 
    <View style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Favori Filmlerim</Text>
        </View>
        {favorites.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Henüz favori film eklemediniz.
            </Text>
          </View>
        ) : (
          <FlatList // listele.
            data={favorites}
            renderItem={movieCard}
            keyExtractor={(item) => item.id.toString()}
            numColumns={cardColumns}
            contentContainerStyle={styles.listStyle}
            columnWrapperStyle={styles.cardStyle}
          />
        )}
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
    marginTop: 50,
  },
  headerContainer: {
    padding: cardSpacing,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
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
    position: 'relative',
    elevation: 5,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
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
  year: {
    fontSize: 10,
    color: 'white',
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 16,
    padding: 6,
    zIndex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
    color: 'white',
  },
});