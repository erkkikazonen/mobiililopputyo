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
  });

  const handleInputChange = (name, value) => {
    setJob({
      ...job,
      [name]: value,
    });
  };

  const addJob = async () => {
    try {
      const currentJobs = JSON.parse(await AsyncStorage.getItem("jobs")) || [];
      const updatedJobs = [...currentJobs, job];
      console.log("Saving jobs: ", updatedJobs);
      await AsyncStorage.setItem("jobs", JSON.stringify(updatedJobs));
      console.log("Job added successfully!");
      Alert.alert("Success", "Job added successfully!");
      setJob({ name: "", location: "", date: "", hours: "", rate: "" });
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
          placeholder="Location"
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
