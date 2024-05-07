import React, { useState } from "react";
import { View, Text, StyleSheet, Button, Alert, Modal, TouchableOpacity, SectionList } from "react-native";
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import MapView, { Marker } from "react-native-maps";
import { database } from '../firebaseConfig';
import { ref, onValue, remove } from "firebase/database";

export default function JobList() {
  const navigation = useNavigation();  // Oikea paikka useNavigation hookille
  const [jobs, setJobs] = useState([]);
  const [groupedJobs, setGroupedJobs] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      const jobsRef = ref(database, 'jobs');
      const unsubscribe = onValue(jobsRef, snapshot => {
        const data = snapshot.val();
        const jobList = data ? Object.keys(data).map(key => ({ ...data[key], id: key })) : [];
        setJobs(jobList);
        groupJobsByMonth(jobList);
      });
      
      return () => unsubscribe();
    }, [])
  );

  const groupJobsByMonth = (jobs) => {
    const groups = jobs.reduce((acc, job) => {
      const monthYear = new Date(job.date).toLocaleString('default', { month: 'long', year: 'numeric' });
      if (!acc[monthYear]) {
        acc[monthYear] = {
          title: monthYear,
          data: [],
          totalSalary: 0
        };
      }
      acc[monthYear].data.push(job);
      acc[monthYear].data.sort((a, b) => new Date(a.date) - new Date(b.date));
      acc[monthYear].totalSalary += parseFloat(calculateDailyWage(job.hours, job.rate));
      return acc;
    }, {});

    setGroupedJobs(Object.values(groups));
  };

  const calculateDailyWage = (hours, rate) => parseFloat(hours) * parseFloat(rate);

  const deleteJob = async (index, section) => {
    try {
      const jobToDelete = section.data[index];
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
      <SectionList
        sections={groupedJobs}
        keyExtractor={(item, index) => item.id + index}
        renderItem={({ item, index, section }) => (
          <View style={styles.item}>
            <Text style={styles.text}>Name: {item.name}</Text>
            <TouchableOpacity onPress={() => openMap(item)}>
              <Text style={styles.text}>Location: {item.location}</Text>
            </TouchableOpacity>
            <Text style={styles.text}>Date: {item.date}</Text>
            <Text style={styles.text}>Hours: {item.hours}</Text>
            <Text style={styles.text}>Rate: {item.rate} €/hr</Text>
            <Text style={styles.text}>Daily Wage: {calculateDailyWage(item.hours, item.rate).toFixed(2)} €</Text>
            <Button title="Delete" onPress={() => deleteJob(index, section)} />
          </View>
        )}
        renderSectionHeader={({ section }) => (
          <View style={styles.header}>
            <Text style={styles.headerText}>{section.title}</Text>
            <Text style={styles.headerText}>Monthly Salary: {section.totalSalary.toFixed(2)} €</Text>
            <TouchableOpacity onPress={() => navigation.navigate('MonthlyDetailsScreen', { monthData: section })}>
              <Text style={styles.headerText}>View Details</Text>
            </TouchableOpacity>
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
  header: {
    backgroundColor: '#f7f7f7',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
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
