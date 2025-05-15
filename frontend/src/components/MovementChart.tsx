// src/components/MovementChart.tsx
import React from "react";
import { View, Text, Dimensions, StyleSheet } from "react-native";
import { LineChart } from "react-native-chart-kit";

interface MovementChartProps {
  deviceId?: string; // Ainda opcional
}

const mockData = [
  { date: "10/05", count: 2 },
  { date: "11/05", count: 3 },
  { date: "12/05", count: 5 },
  { date: "13/05", count: 4 },
  { date: "14/05", count: 6 },
];

const MovementChart: React.FC<MovementChartProps> = () => {
  const values = mockData.map((d) => d.count);
  const labels = mockData.map((d) => d.date);
  const screenWidth = Dimensions.get("window").width;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>MOVIMENTAÇÕES / DIA</Text>
      <LineChart
        data={{
          labels: labels,
          datasets: [{ data: values }],
        }}
        width={screenWidth * 0.9}
        height={220}
        yAxisLabel=""
        yAxisSuffix=""
        chartConfig={{
          backgroundGradientFrom: "#ffffff",
          backgroundGradientTo: "#ffffff",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
          labelColor: () => "#000",
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: "4",
            strokeWidth: "2",
            stroke: "#8e44ad",
          },
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 12,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    width: "90%",
    alignSelf: "center",
    marginVertical: 10,
  },
  title: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 14,
    color: "#000",
    marginBottom: 8,
  },
});

export default MovementChart;
