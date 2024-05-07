import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

const MonthlyDetailsScreen = ({ route }) => {
  const { monthData } = route.params;

  const labels = monthData.data.map(job => new Date(job.date).getDate().toString());
  const hoursData = monthData.data.map(job => parseFloat(job.hours));
  const salaryData = monthData.data.map(job => parseFloat(job.hours) * parseFloat(job.rate));

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Hours Graph for {monthData.title}</Text>
      <BarChart
        data={{
          labels: labels,
          datasets: [{ data: hoursData }]
        }}
        width={300} 
        height={220}
        yAxisLabel=""
        yAxisSuffix=" hrs"
        chartConfig={hoursChartConfig}
        fromZero={true}
        style={styles.chart}
      />
      <Text style={styles.header}>Daily Salary Graph for {monthData.title}</Text>
      <BarChart
        data={{
          labels: labels,
          datasets: [{ data: salaryData }]
        }}
        width={300}
        height={220}
        yAxisLabel="€"
        yAxisSuffix=""
        chartConfig={salaryChartConfig}
        fromZero={true}
        style={styles.chart}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16
  }
});

const hoursChartConfig = {
  backgroundColor: '#ffa500', 
  backgroundGradientFrom: '#ffa500',
  backgroundGradientTo: '#ff7f50',
  decimalPlaces: 2,
  color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`, 
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  style: {
    borderRadius: 16
  },
  barPercentage: 0.5,
};

const salaryChartConfig = {
  backgroundColor: '#ffa500',  
  backgroundGradientFrom: '#ffa500',
  backgroundGradientTo: '#ff7f50',
  decimalPlaces: 2,
  color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  style: {
    borderRadius: 16
  },
  barPercentage: 0.5,
};

export default MonthlyDetailsScreen;
