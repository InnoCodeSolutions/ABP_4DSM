import React from "react";
import { View, Text, Dimensions, StyleSheet } from "react-native";
import { LineChart } from "react-native-chart-kit";

interface MovementChartProps {
  data: { date: string; count: number }[];
}

const MovementChart: React.FC<MovementChartProps> = ({ data }) => {
  const screenWidth = Dimensions.get("window").width;
  const chartWidth = screenWidth * 0.85; // Reduced width to prevent overflow
  const chartHeight = 240; // Increased height for better visibility

  if (!data || data.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Nenhum dado para exibir</Text>
      </View>
    );
  }

  // Simplify labels to avoid overcrowding
  const labels = data.map((d) => d.date);
  const values = data.map((d) => d.count);
  const labelInterval = Math.ceil(labels.length / 5); // Show ~5 labels max
  const displayedLabels = labels.map((label, index) =>
    index % labelInterval === 0 ? label : ""
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>MOVIMENTAÇÕES / DIA</Text>
      <LineChart
        data={{
          labels: displayedLabels,
          datasets: [{ data: values }],
        }}
        width={chartWidth}
        height={chartHeight}
        yAxisLabel=""
        yAxisSuffix=" m/s"
        chartConfig={{
          backgroundGradientFrom: "#f7f7f7",
          backgroundGradientTo: "#ffffff",
          decimalPlaces: 1,
          color: (opacity = 1) => `rgba(104, 82, 245, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(50, 50, 50, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: "5",
            strokeWidth: "2",
            stroke: "#5a4af5",
          },
          propsForBackgroundLines: {
            stroke: "#e0e0e0",
            strokeDasharray: "",
          },
        }}
        bezier
        style={styles.chartStyle}
        withInnerLines={true}
        withOuterLines={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    width: "100%",
    alignSelf: "center",
    marginVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2, // Corrected from shadowMode
    elevation: 3,
  },
  title: {
    textAlign: "center",
    fontWeight: "600",
    fontSize: 14,
    color: "#333",
    marginBottom: 10,
  },
  chartStyle: {
    marginVertical: 8,
    borderRadius: 16,
    paddingRight: 10, // Prevent label cutoff
  },
});

export default MovementChart;