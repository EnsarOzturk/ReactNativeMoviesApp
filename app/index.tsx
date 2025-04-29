// ana ekranım.
import { Image, StyleSheet, Platform, Dimensions, Pressable, View } from 'react-native';
import { useRouter } from 'expo-router'; // router = sayfa yön lendirmesi için kullanıyoz.
import { useState, useEffect } from 'react';
import { ThemedText } from '@/components/ThemedText';

const { width, height } = Dimensions.get('window'); // cihazın boyutunu böyle alyoruz..

export default function HomeScreen({ showExploreButton = true }) { // butonun görünürlüğü yaptım.
  const router = useRouter();
  const [imageIndex, setImageIndex] = useState(0); //ekrandaki resimlerin ideksini tutuyor bu , ilk index ve güncellenen.!

  const images = [
    require('@/assets/images/movie1.jpg'),
    require('@/assets/images/movie2.jpg'),
    require('@/assets/images/movie3.jpg'),
    require('@/assets/images/movie4.jpg'),
    require('@/assets/images/movie5.jpg'),
    require('@/assets/images/movie6.jpg'),
    require('@/assets/images/movie7.jpg'),
    require('@/assets/images/movie8.jpg'),
    require('@/assets/images/movie9.jpg'),
  ];

  useEffect(() => { 
    const interval = setInterval(() => {
      setImageIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1 // son resimde başa döndürmek için kullandım .
      );
    }, 1000); // resim değişme süresi ayarıı

    return () => clearInterval(interval); //işlem dursun diye kullaıyors, farklı ekrana geçince vs....
  }, [images]);

  const handleExplorePress = () => { // buton ile sayfa yönlendirmesi yaptım = filmlere git.
    router.replace('/(tabs)/home');
  };

  return (
    <View style={styles.container}>
      <Image
        source={images[imageIndex]} // eklediğim resim indexleri al.
        style={styles.backgroundImage}
        resizeMode="cover" // cover = ekranı kaplama olayı.
      />
      {showExploreButton && (
          <Pressable 
            style={({ pressed }) => [
              styles.exploreButton,
            ]}
            onPress={handleExplorePress}
          >
            <ThemedText style={styles.exploreButtonText}>KEŞFET</ThemedText>
          </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  backgroundImage: {
    width: width,
    height: height,
    position: 'absolute',
    resizeMode: 'cover',
  },
  exploreButton: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    backgroundColor: '#FF4D4D',
    paddingVertical: 18,
    paddingHorizontal: 70,
    borderRadius: 30,
    elevation: 8,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: '#FF6666',
  },
  exploreButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
});
