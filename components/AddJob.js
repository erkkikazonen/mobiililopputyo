import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Button,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AddJob() {
  const [job, setJob] = useState({
    name: "",
    location: "",
    date: "",
    hours: "",
    rate: "",
    coordinates: null
  });

  const handleInputChange = (name, value) => {
    setJob({
      ...job,
      [name]: value,
    });
  };

  const getCoordinates = async (address) => {
    const apiKey = '66393fec72849673216152xesa800fb'; 
    const url = `https://geocode.maps.co/search?q=${encodeURIComponent(address)}&api_key=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.length > 0) {
        return {
          latitude: data[0].lat,
          longitude: data[0].lon
        };
      } else {
        throw new Error('No results found');
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      Alert.alert('Geocoding Error', 'Unable to fetch location coordinates');
      return null;
    }
  };

  const addJob = async () => {
    const coordinates = await getCoordinates(job.location);
    if (!coordinates) {
      Alert.alert("Error", "Failed to get location coordinates. Please check the address and try again.");
      return;
    }

    const newJob = { ...job, coordinates };
    try {
      const currentJobs = JSON.parse(await AsyncStorage.getItem("jobs")) || [];
      const updatedJobs = [...currentJobs, newJob];
      await AsyncStorage.setItem("jobs", JSON.stringify(updatedJobs));
      Alert.alert("Success", "Job added successfully!");
      setJob({ name: "", location: "", date: "", hours: "", rate: "", coordinates: null });
    } catch (error) {
      Alert.alert("Error", "Failed to add the job.");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <TextInput
          placeholder="Job Name"
          value={job.name}
          onChangeText={(text) => handleInputChange("name", text)}
          style={styles.input}
        />
        <TextInput
          placeholder="Address and City"
          value={job.location}
          onChangeText={(text) => handleInputChange("location", text)}
          style={styles.input}
        />
        <TextInput
          placeholder="Date"
          value={job.date}
          onChangeText={(text) => handleInputChange("date", text)}
          style={styles.input}
        />
        <TextInput
          placeholder="Hours"
          keyboardType="numeric"
          value={job.hours}
          onChangeText={(text) => handleInputChange("hours", text)}
          style={styles.input}
        />
        <TextInput
          placeholder="Rate"
          keyboardType="numeric"
          value={job.rate}
          onChangeText={(text) => handleInputChange("rate", text)}
          style={styles.input}
        />
        <Button title="Add Job" onPress={addJob} />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  input: {
    width: "50%",
    marginVertical: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
});
