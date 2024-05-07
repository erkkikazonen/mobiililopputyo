import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Button, Alert, Modal, TouchableOpacity } from "react-native";
import { useFocusEffect } from '@react-navigation/native';
import MapView, { Marker } from "react-native-maps";
import { database } from '../firebaseConfig';
import { ref, onValue, remove } from "firebase/database";

const calculateDailyWage = (hours, rate) => parseFloat(hours) * parseFloat(rate);

const calculateTotalSalary = (jobs) => {
  return jobs.reduce((sum, job) => sum + calculateDailyWage(job.hours, job.rate), 0).toFixed(2);
}

export default function JobList() {
  const [jobs, setJobs] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      const jobsRef = ref(database, 'jobs');
      const unsubscribe = onValue(jobsRef, snapshot => {
        const data = snapshot.val();
        const jobList = data ? Object.keys(data).map(key => ({ ...data[key], id: key })) : [];
        setJobs(jobList);
      });

      return () => unsubscribe();
    }, [])
  );

  const deleteJob = async (index) => {
    try {
      const jobToDelete = jobs[index];
      const jobRef = ref(database, `jobs/${jobToDelete.id}`);
      await remove(jobRef);
      Alert.alert("Success", "Job deleted successfully!");
    } catch (error) {
      Alert.alert("Error", "Failed to delete the job.");
    }
  };


  const openMap = (job) => {
    if (job.coordinates && job.coordinates.latitude && job.coordinates.longitude) {
      setSelectedJob(job);
      setModalVisible(true);
    } else {
      Alert.alert("Error", "No location coordinates available for this job.");
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={jobs}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.item}>
            <Text style={styles.text}>Name: {item.name}</Text>
            <TouchableOpacity onPress={() => openMap(item)}>
              <Text style={styles.text}>Location: {item.location}</Text>
            </TouchableOpacity>
            <Text style={styles.text}>Date: {item.date}</Text>
            <Text style={styles.text}>Hours: {item.hours}</Text>
            <Text style={styles.text}>Rate: {item.rate} €/hr</Text>
            <Text style={styles.text}>Daily Wage: {calculateDailyWage(item.hours, item.rate).toFixed(2)} €</Text>
            <Button title="Delete" onPress={() => deleteJob(index)} />
          </View>
        )}
      />
      {modalVisible && selectedJob && (
        <Modal
          animationType="slide"
          transparent={false}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setModalVisible(!modalVisible);
          }}
        >
          <View style={{ flex: 1 }}>
            <MapView
              style={{ flex: 1 }}
              initialRegion={{
                latitude: selectedJob.coordinates.latitude,
                longitude: selectedJob.coordinates.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
            >
              <Marker
                coordinate={{
                  latitude: selectedJob.coordinates.latitude,
                  longitude: selectedJob.coordinates.longitude
                }}
                title={selectedJob.name}
              />
            </MapView>
            <Button title="Close Map" onPress={() => setModalVisible(false)} />
          </View>
        </Modal>
      )}
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total Salary: {calculateTotalSalary(jobs)} €</Text>
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

