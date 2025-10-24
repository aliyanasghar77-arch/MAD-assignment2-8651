import React, { useState, useContext } from "react";
import { View, TextInput, Button, StyleSheet, Alert } from "react-native";
import api from "../services/api";
import { CartContext } from "../context/CartContext";

export default function CheckoutScreen({ navigation }) {
  const [address, setAddress] = useState("");
  const [payment, setPayment] = useState("Cash on Delivery");
  const { cart, clearCart } = useContext(CartContext);

  const placeOrder = async () => {
    try {
      await api.post("/orders/create", { shippingAddress: address, paymentMethod: payment });
      clearCart();
      navigation.navigate("OrderConfirmation");
    } catch (err) {
      Alert.alert("Error", err.response?.data?.message || err.message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder="Shipping address" value={address} onChangeText={setAddress} style={styles.input} />
      <TextInput placeholder="Payment method" value={payment} onChangeText={setPayment} style={styles.input} />
      <Button title="Place Order" onPress={placeOrder} />
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, padding: 20 }, input: { borderWidth: 1, padding: 10, marginBottom: 10 } });