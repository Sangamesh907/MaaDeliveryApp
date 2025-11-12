import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  Alert,
  ActivityIndicator,
} from "react-native";
import { DeliveryContext } from "../Context/DeliveryContext";

const screenHeight = Dimensions.get("window").height;

const LoginScreen = ({ navigation }) => {
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const { saveAuth, connectWebSocket } = useContext(DeliveryContext);

  const handleLogin = async () => {
    console.log("📱 Trying login with mobile:", mobile);

    if (mobile.length !== 10) {
      return Alert.alert("Invalid Number", "Please enter a valid 10-digit number");
    }

    setLoading(true);
    try {
      console.log("📤 Sending POST request to backend...");
      const response = await fetch("http://3.110.207.229/api/delivery/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone_number: mobile }),
      });

      const data = await response.json();
      console.log("📩 Parsed Response:", data);

      if (response.ok && data.id && data.token) {
        console.log("✅ Login Success:", data);

        // Save authentication data
        await saveAuth({
          deliveryId: data.id,
          token: data.token,
          role: "delivery",
        });

        // Connect WebSocket (updates isOnline automatically)
        connectWebSocket(data.id);

        Alert.alert("✅ Success", data.message || "Login successful");

        // Navigate to OTP screen (or Home if you want)
        navigation.reset({
          index: 0,
          routes: [{ name: "Otp", params: { mobile, isNewUser: data.new } }],
        });
      } else {
        Alert.alert("Login Failed", data.message || "Unable to login. Please try again.");
      }
    } catch (error) {
      console.error("🔥 Login Error:", error);
      Alert.alert("Error", "Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <Image source={require("../assets/logo32.png")} style={styles.logo} />
      </View>

      <View style={styles.bottomCard}>
        <Text style={styles.label}>Login with Mobile</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Your Mobile Number"
          keyboardType="number-pad"
          maxLength={10}
          value={mobile}
          onChangeText={setMobile}
        />

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.7 }]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Continue</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ff5858" },
  topSection: {
    height: screenHeight * 0.5,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 10,
  },
  logo: { width: 300, height: 300, resizeMode: "contain" },
  bottomCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 30,
    alignItems: "center",
    marginTop: -30,
  },
  label: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    fontSize: 16,
    width: "100%",
    paddingVertical: 8,
    marginBottom: 30,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#ff5858",
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 60,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});

export default LoginScreen;
