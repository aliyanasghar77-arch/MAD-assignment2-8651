import React, { createContext, useState, useEffect, useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  Alert,
  SafeAreaView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring } from 'react-native-reanimated';

// ------------------------- Mock Data ---------------------------------
const SAMPLE_PRODUCTS = [
  {
    id: 'p1',
    title: 'Classic Sneakers',
    price: 59.99,
    image: 'https://picsum.photos/seed/sneakers/600/400',
    description: 'Comfortable everyday sneakers',
  },
  {
    id: 'p2',
    title: 'Denim Jacket',
    price: 89.99,
    image: 'https://picsum.photos/seed/jacket/600/400',
    description: 'Stylish denim jacket for all seasons',
  },
  {
    id: 'p3',
    title: 'Wireless Headphones',
    price: 129.99,
    image: 'https://picsum.photos/seed/headphones/600/400',
    description: 'Noise-cancelling over-ear headphones',
  },
  {
    id: 'p4',
    title: 'Leather Wallet',
    price: 39.99,
    image: 'https://picsum.photos/seed/wallet/600/400',
    description: 'Slim genuine leather wallet',
  },
  {
    id: 'p5',
    title: 'Sunglasses',
    price: 24.99,
    image: 'https://picsum.photos/seed/sunglasses/600/400',
    description: 'UV-protected sunglasses',
  },
];

// ------------------------- Contexts ---------------------------------
const AuthContext = createContext();
const CartContext = createContext();
const ProductsContext = createContext();

// ------------------------- Auth Provider -----------------------------
function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // load user from AsyncStorage
    (async () => {
      try {
        const raw = await AsyncStorage.getItem('@user');
        if (raw) setUser(JSON.parse(raw));
      } catch (e) {
        console.warn('Failed loading user', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async (email, password) => {
    // mock login: any non-empty email/password works
    if (!email || !password) throw new Error('Email and password required');
    // pretend checking backend
    const found = { id: 'u1', name: email.split('@')[0], email };
    setUser(found);
    await AsyncStorage.setItem('@user', JSON.stringify(found));
  };

  const register = async (name, email, password) => {
    if (!name || !email || !password) throw new Error('All fields required');
    // mock register: store user
    const newUser = { id: 'u' + Date.now(), name, email };
    setUser(newUser);
    await AsyncStorage.setItem('@user', JSON.stringify(newUser));
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem('@user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

// ------------------------- Products Provider -------------------------
function ProductsProvider({ children }) {
  const [products, setProducts] = useState(SAMPLE_PRODUCTS);
  // in real app you'd fetch from API
  return (
    <ProductsContext.Provider value={{ products, setProducts }}>
      {children}
    </ProductsContext.Provider>
  );
}

// ------------------------- Cart Provider -----------------------------
function CartProvider({ children }) {
  const [items, setItems] = useState([]); // {product, qty}

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem('@cart');
        if (raw) setItems(JSON.parse(raw));
      } catch (e) {
        console.warn('load cart err', e);
      }
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('@cart', JSON.stringify(items)).catch(() => {});
  }, [items]);

  const addToCart = (product, qty = 1) => {
    setItems(prev => {
      const found = prev.find(p => p.product.id === product.id);
      if (found) return prev.map(p => (p.product.id === product.id ? { ...p, qty: p.qty + qty } : p));
      return [...prev, { product, qty }];
    });
  };

  const updateQty = (productId, qty) => {
    setItems(prev => prev.map(p => (p.product.id === productId ? { ...p, qty } : p)).filter(p => p.qty > 0));
  };

  const clearCart = () => setItems([]);

  const removeItem = productId => setItems(prev => prev.filter(p => p.product.id !== productId));

  const total = items.reduce((s, it) => s + it.product.price * it.qty, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, updateQty, clearCart, removeItem, total }}>
      {children}
    </CartContext.Provider>
  );
}

// ------------------------- Navigation Setup -------------------------
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// ------------------------- Screens ----------------------------------
function LoadingScreen() {
  return (
    <SafeAreaView style={styles.center}>
      <ActivityIndicator size="large" />
      <Text style={{ marginTop: 12 }}>Loading app...</Text>
    </SafeAreaView>
  );
}

function LoginScreen({ navigation }) {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const doLogin = async () => {
    try {
      scale.value = withSpring(0.95);
      await login(email, password);
      scale.value = withSpring(1);
    } catch (e) {
      scale.value = withSpring(1);
      Alert.alert('Login failed', e.message);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Animated.View style={[styles.card, animatedStyle]}>
        <Text style={styles.h1}>Welcome Back</Text>
        <Text style={styles.p}>Sign in to continue shopping</Text>

        <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} keyboardType="email-address" autoCapitalize="none" />
        <TextInput placeholder="Password" value={password} onChangeText={setPassword} style={styles.input} secureTextEntry />

        <TouchableOpacity style={styles.button} onPress={doLogin} activeOpacity={0.8}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.link}>Don't have an account? Register</Text>
        </TouchableOpacity>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

function RegisterScreen({ navigation }) {
  const { register } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const doRegister = async () => {
    try {
      await register(name, email, password);
      Alert.alert('Registered', 'Account created.');
      navigation.navigate('HomeTabs');
    } catch (e) {
      Alert.alert('Register failed', e.message);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.card}>
        <Text style={styles.h1}>Create Account</Text>
        <Text style={styles.p}>Join our shop</Text>

        <TextInput placeholder="Full name" value={name} onChangeText={setName} style={styles.input} />
        <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} autoCapitalize="none" keyboardType="email-address" />
        <TextInput placeholder="Password" value={password} onChangeText={setPassword} style={styles.input} secureTextEntry />

        <TouchableOpacity style={styles.button} onPress={doRegister} activeOpacity={0.8}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.link}>Already have an account? Login</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

function ProductsScreen({ navigation }) {
  const { products } = useContext(ProductsContext);
  const { addToCart } = useContext(CartContext);

  const render = ({ item }) => (
    <TouchableOpacity style={styles.productCard} onPress={() => navigation.navigate('ProductDetail', { product: item })}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={{ padding: 8 }}>
        <Text style={styles.productTitle}>{item.title}</Text>
        <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
        <TouchableOpacity onPress={() => addToCart(item)} style={styles.smallButton}>
          <Text style={{ color: '#fff' }}>Add</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList data={products} renderItem={render} keyExtractor={p => p.id} contentContainerStyle={{ padding: 12 }} />
    </SafeAreaView>
  );
}

function ProductDetailScreen({ route }) {
  const { product } = route.params;
  const { addToCart } = useContext(CartContext);
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Image source={{ uri: product.image }} style={{ width: '100%', height: 220, borderRadius: 12 }} />
      <Text style={[styles.h1, { marginTop: 12 }]}>{product.title}</Text>
      <Text style={styles.productPrice}>{product.price.toFixed(2)}</Text>
      <Text style={{ marginTop: 12, color: '#374151' }}>{product.description}</Text>

      <Animated.View style={[{ marginTop: 20 }, animatedStyle]}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            scale.value = withSpring(0.95);
            addToCart(product);
            setTimeout(() => (scale.value = withSpring(1)), 150);
            Alert.alert('Added', 'Product added to cart');
          }}
        >
          <Text style={styles.buttonText}>Add to Cart</Text>
        </TouchableOpacity>
      </Animated.View>
    </ScrollView>
  );
}

function CartScreen({ navigation }) {
  const { items, updateQty, removeItem, total, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  const doCheckout = async () => {
    if (!user) {
      Alert.alert('Not signed in', 'Please login to checkout');
      return;
    }
    if (items.length === 0) return Alert.alert('Cart empty', 'Add items first');
    // mock order: store orders in AsyncStorage
    try {
      const order = { id: 'o' + Date.now(), items, total, date: new Date().toISOString() };
      const raw = await AsyncStorage.getItem('@orders');
      const arr = raw ? JSON.parse(raw) : [];
      arr.push(order);
      await AsyncStorage.setItem('@orders', JSON.stringify(arr));
      clearCart();
      Alert.alert('Order placed', 'Thanks for your purchase');
      navigation.navigate('Orders');
    } catch (e) {
      Alert.alert('Checkout failed', e.message);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: 12 }}>
      {items.length === 0 ? (
        <View style={styles.center}>
          <Text>Your cart is empty</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={i => i.product.id}
          renderItem={({ item }) => (
            <View style={styles.cartRow}>
              <Image source={{ uri: item.product.image }} style={styles.cartImage} />
              <View style={{ flex: 1, paddingHorizontal: 8 }}>
                <Text style={{ fontWeight: '600' }}>{item.product.title}</Text>
                <Text>${item.product.price.toFixed(2)}</Text>
                <View style={{ flexDirection: 'row', marginTop: 8, alignItems: 'center' }}>
                  <TouchableOpacity onPress={() => updateQty(item.product.id, item.qty - 1)} style={styles.qtyBtn}><Text>-</Text></TouchableOpacity>
                  <Text style={{ marginHorizontal: 12 }}>{item.qty}</Text>
                  <TouchableOpacity onPress={() => updateQty(item.product.id, item.qty + 1)} style={styles.qtyBtn}><Text>+</Text></TouchableOpacity>
                  <TouchableOpacity onPress={() => removeItem(item.product.id)} style={[styles.smallButton, { marginLeft: 12 }]}>
                    <Text style={{ color: '#fff' }}>Remove</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        />
      )}

      <View style={{ padding: 12, borderTopWidth: 1, borderColor: '#E5E7EB' }}>
        <Text style={{ fontSize: 18, fontWeight: '700' }}>Total: ${total.toFixed(2)}</Text>
        <TouchableOpacity style={[styles.button, { marginTop: 10 }]} onPress={doCheckout}><Text style={styles.buttonText}>Checkout</Text></TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function OrdersScreen() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem('@orders');
      setOrders(raw ? JSON.parse(raw) : []);
    })();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, padding: 12 }}>
      {orders.length === 0 ? (
        <View style={styles.center}><Text>No orders yet</Text></View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={o => o.id}
          renderItem={({ item }) => (
            <View style={styles.orderCard}>
              <Text style={{ fontWeight: '700' }}>Order {item.id}</Text>
              <Text>{new Date(item.date).toLocaleString()}</Text>
              <Text>Total: ${item.total.toFixed(2)}</Text>
              <Text style={{ marginTop: 8, fontWeight: '600' }}>Items:</Text>
              {item.items.map(it => (
                <Text key={it.product.id}>- {it.product.title} x{it.qty}</Text>
              ))}
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

function ProfileScreen() {
  const { user, logout } = useContext(AuthContext);

  return (
    <SafeAreaView style={{ flex: 1, padding: 12 }}>
      <View style={styles.card}>
        <Text style={styles.h1}>Hi, {user?.name || 'Guest'}</Text>
        <Text style={{ marginTop: 8 }}>{user?.email}</Text>

        {user ? (
          <TouchableOpacity style={[styles.button, { marginTop: 20 }]} onPress={() => { logout(); Alert.alert('Logged out'); }}>
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        ) : (
          <Text style={{ marginTop: 20 }}>Sign in to view orders and manage account</Text>
        )}
      </View>
    </SafeAreaView>
  );
}

// ------------------------- Tabs -------------------------------------
function HomeTabs() {
  const { items } = useContext(CartContext);

  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Shop" component={ProductsScreen} options={{ tabBarLabel: 'Shop' }} />
      <Tab.Screen name="Cart" component={CartScreen} options={{ tabBarLabel: `Cart (${items.length})` }} />
      <Tab.Screen name="Orders" component={OrdersScreen} options={{ tabBarLabel: 'Orders' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: 'Profile' }} />
    </Tab.Navigator>
  );
}

// ------------------------- App Entry --------------------------------
export default function App() {
  return (
    <AuthProvider>
      <ProductsProvider>
        <CartProvider>
          <AppInner />
        </CartProvider>
      </ProductsProvider>
    </AuthProvider>
  );
}

function AppInner() {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <LoadingScreen />;

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          // signed in
          <>
            <Stack.Screen name="HomeTabs" component={HomeTabs} options={{ headerShown: false }} />
            <Stack.Screen name="ProductDetail" component={ProductDetailScreen} options={{ title: 'Product' }} />
          </>
        ) : (
          // not signed in
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="HomeTabs" component={HomeTabs} options={{ headerShown: false }} />
            <Stack.Screen name="ProductDetail" component={ProductDetailScreen} options={{ title: 'Product' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// ------------------------- Styles -----------------------------------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center', padding: 12 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { width: '100%', backgroundColor: '#fff', borderRadius: 14, padding: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowOffset: { width: 0, height: 4 }, shadowRadius: 10, elevation: 3 },
  h1: { fontSize: 22, fontWeight: '700' },
  p: { color: '#6B7280', marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10, padding: 12, marginBottom: 12, backgroundColor: '#F9FAFB' },
  button: { backgroundColor: '#0EA5E9', paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '700' },
  link: { marginTop: 12, color: '#2563EB', textAlign: 'center' },
  productCard: { backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden', marginBottom: 12 },
  productImage: { width: '100%', height: 160 },
  productTitle: { fontSize: 16, fontWeight: '700' },
  productPrice: { color: '#111827', marginTop: 6, fontWeight: '700' },
  smallButton: { backgroundColor: '#10B981', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, marginTop: 8, alignSelf: 'flex-start' },
  cartRow: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 10, padding: 8, marginBottom: 10, alignItems: 'center' },
  cartImage: { width: 70, height: 70, borderRadius: 8 },
  qtyBtn: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4 },
  orderCard: { backgroundColor: '#fff', padding: 12, borderRadius: 10, marginBottom: 10 },
});

// ------------------------- End --------------------------------------
