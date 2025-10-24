import React, { useContext, useEffect, useState } from "react";
import { View, Text, Button, TextInput, StyleSheet } from "react-native";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";

export default function ProfileScreen() {
  const { user, setUser, logout } = useContext(AuthContext);
  const [name, setName] = useState(user?.name || "");
  const [address, setAddress] = useState(user?.address || "");
  const [phone, setPhone] = useState(user?.phone || "");

  useEffect(() => {
    setName(user?.name || "");
    setAddress(user?.address || "");
    setPhone(user?.phone || "");
  }, [user]);

  const save = async () => {
    try {
      const res = await api.put("/profile/update", { name, address, phone });
      setUser(res.data.user);
      alert("Profile updated");
    } catch (err) {
      alert("Error updating profile");
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Name" />
      <TextInput style={styles.input} value={address} onChangeText={setAddress} placeholder="Address" />
      <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="Phone" />
      <Button title="Save" onPress={save} />
      <View style={{ height: 10 }} />
      <Button title="Logout" onPress={logout} />
    </View>
  );
}

const styles = StyleSheet.create({
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 6 }
});