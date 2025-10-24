import React, { useContext } from "react";
import { View, Text, FlatList, Button, StyleSheet } from "react-native";
import { CartContext } from "../context/CartContext";
import api from "../services/api";

export default function CartScreen({ navigation }) {
  const { cart, removeItem, loadCart } = useContext(CartContext);

  const proceed = () => {
    navigation.navigate("Checkout");
  };

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={{ flex: 1 }}>{item.productId?.name || "Product"}</Text>
      <Text>Qty: {item.quantity}</Text>
      <Button title="Remove" onPress={() => removeItem(item._id)} />
    </View>
  );

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <FlatList data={cart.items} keyExtractor={i => i._id} renderItem={renderItem} ListEmptyComponent={<Text>Cart is empty</Text>} />
      <Button title="Checkout" onPress={proceed} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", padding: 10, borderBottomWidth: 1 }
});