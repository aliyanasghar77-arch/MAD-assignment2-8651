import React from "react";
import { View, Text, Button } from "react-native";

export default function OrderConfirmationScreen({ navigation }) {
  return (
    <View style={{ flex: 1, padding: 20, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>Thank you! Your order is placed.</Text>
      <Button title="Go to Home" onPress={() => navigation.navigate("Home")} />
    </View>
  );
}