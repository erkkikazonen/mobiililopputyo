import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Button, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

export default function JobList() {
  const [jobs, setJobs] = useState([]);
  const [totalSalary, setTotalSalary] = useState(0); 

  useFocusEffect(
    React.useCallback(() => {
      loadJobs();
    }, [])
  );

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const storedJobs = await AsyncStorage.getItem("jobs");
      if (storedJobs) {
        const parsedJobs = JSON.parse(storedJobs);
        setJobs(parsedJobs);
        calculateTotalSalary(parsedJobs); 
      }
    } catch (error) {
      console.error("Failed to load jobs:", error);
      Alert.alert("Error", "Failed to load jobs.");
    }
  };

  const deleteJob = async (index) => {
    try {
      let updatedJobs = [...jobs];
      updatedJobs.splice(index, 1);
      await AsyncStorage.setItem("jobs", JSON.stringify(updatedJobs));
      setJobs(updatedJobs);
      calculateTotalSalary(updatedJobs);  
      Alert.alert("Success", "Job deleted successfully!");
    } catch (error) {
      Alert.alert("Error", "Failed to delete the job.");
    }
  };

  const calculateDailyWage = (hours, rate) => {
    return parseFloat(hours) * parseFloat(rate);
  };

  const calculateTotalSalary = (jobs) => {
    const total = jobs.reduce((sum, job) => sum + calculateDailyWage(job.hours, job.rate), 0);
    setTotalSalary(total.toFixed(2)); 
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={jobs}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.item}>
            <Text style={styles.text}>Name: {item.name}</Text>
            <Text style={styles.text}>Location: {item.location}</Text>
            <Text style={styles.text}>Date: {item.date}</Text>
            <Text style={styles.text}>Hours: {item.hours}</Text>
            <Text style={styles.text}>Rate: {item.rate} €/hr</Text>
            <Text style={styles.text}>Daily Wage: {calculateDailyWage(item.hours, item.rate).toFixed(2)} €</Text>
            <Button title="Delete" onPress={() => deleteJob(index)} />
          </View>
        )}
      />
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total Salary: {totalSalary} €</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 10,
  },
  item: {
    marginVertical: 8,
  },
  text: {
    fontSize: 16,
  },
  totalContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
