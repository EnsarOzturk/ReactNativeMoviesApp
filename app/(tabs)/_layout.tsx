// Tab Navigation için (tab bar)

// Gerekli importlarrrr....
import { Tabs, useRouter, usePathname } from 'expo-router'; // Tab navigasyonu için
import { Platform } from 'react-native'; // Platform kontrolü
import { Ionicons } from '@expo/vector-icons'; // İkonlar için
import { StyleSheet } from 'react-native';

export default function TabLayout() {
  // Hook..........
  const pathname = usePathname();  // Mevcut sayfa için.
  const router = useRouter();  // navigation (router)
  const isHomeScreen = pathname === '/';  // Ana sayfada mıyız kontrolü , tabbar için.
  // ana sayfayı temsil ediyo

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#FF4D4D', // seçili olan tab rengi için.
        tabBarInactiveTintColor: '#666',  // seçili olmayan için.
        tabBarStyle: {
          backgroundColor: '#1a1a1a',
          borderTopWidth: 1,
          borderTopColor: '#333',
          height: 65,
        },
        tabBarItemStyle: {
          height: 65,
          paddingTop: 10,
          paddingBottom: 10,
        },
        tabBarIconStyle: {
          marginBottom: 2,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
      }}>
      <Tabs.Screen // Ana sayfa....
        name="home" // bu kısımdan mevcut tab'a tıklanıldı.
        options={{
          title: 'Ana Sayfa',
          headerShown: false,
          tabBarIcon: ({ focused, color }) => (
            <Ionicons 
              name={focused ? 'home' : 'home-outline'} 
              size={26} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen // Keşfet...
        name="movies"
        options={{
          title: 'Filmler',
          headerShown: false,
          tabBarIcon: ({ focused, color }) => (
            <Ionicons 
              name={focused ? 'film' : 'film-outline'} 
              size={26} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen // favoriler....
        name="favorites"
        options={{
          title: 'Favoriler',
          headerShown: false,
          tabBarIcon: ({ focused, color }) => (
            <Ionicons 
              name={focused ? 'heart' : 'heart-outline'} 
              size={26} 
              color={color} 
            />
          ),
        }}
      />
    </Tabs>
  );
}