/*import React from "react";
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

export default MovementChart;*/


/*
import React from "react";
import { View, Text, Dimensions, StyleSheet } from "react-native";
import { LineChart } from "react-native-chart-kit";

interface MovementChartProps {
  data: { date: string; count: number }[];
}

const MovementChart: React.FC<MovementChartProps> = ({ data }) => {
  const screenWidth = Dimensions.get("window").width;
  const chartWidth = screenWidth * 0.95;
  const chartHeight = 260;

  if (!data || data.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Nenhum dado para exibir</Text>
      </View>
    );
  }

  const parseDate = (str: string) => {
  const [day, month] = str.split("/");
  return new Date(`2024-${month}-${day}`);
};

const sortedData = [...data].sort((a, b) => {
  return parseDate(a.date).getTime() - parseDate(b.date).getTime();
});

  const labels = sortedData.map((d) => d.date);
  const values = sortedData.map((d) => d.count);
  const labelInterval = Math.ceil(labels.length / 5);
  const displayedLabels = labels.map((label, index) =>
    index % labelInterval === 0 ? label : ""
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>VELOCIDADE (m/s) POR DIA</Text>
      <View style={styles.chartWrapper}>
        <LineChart
          data={{
            labels: displayedLabels,
            datasets: [{ data: values }],
          }}
          width={chartWidth}
          height={chartHeight}
          fromZero={true}
          formatYLabel={(value) => `${parseFloat(value).toFixed(1)} m/s`}
          withVerticalLabels={true}
          chartConfig={{
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            decimalPlaces: 1,
            color: (opacity = 1) => `rgba(104, 82, 245, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(30, 30, 30, ${opacity})`,
            propsForDots: {
              r: "5",
              strokeWidth: "2",
              stroke: "#4c3de0",
            },
            propsForBackgroundLines: {
              stroke: "#e0e0e0",
            },
          }}
          bezier
          withInnerLines={true}
          withOuterLines={true}
          yLabelsOffset={8}
          segments={5}
          style={styles.chartStyle}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    width: "100%",
    alignSelf: "center",
    marginVertical: 12,
    elevation: 3,
  },
  title: {
    textAlign: "center",
    fontWeight: "600",
    fontSize: 14,
    color: "#333",
    marginBottom: 10,
  },
  chartWrapper: {
    borderRadius: 16,
    overflow: "hidden", // ✅ evita que estoure
  },
  chartStyle: {
    marginVertical: 8,
    borderRadius: 16,
    marginLeft: -10, // ajusta alinhamento sem estourar
  },
});

export default MovementChart;
*/



import React, { useState } from "react";
import { View, Text, Dimensions, StyleSheet, TouchableOpacity } from "react-native";
import { LineChart, BarChart } from "react-native-chart-kit";
import { Derivador } from "../service/deviceService";

interface MovementChartProps {
  velocityData?: { date: string; count: number }[]; // Dados de velocidade
  history?: Derivador[] | undefined; // Histórico de coordenadas
  deviceId: string; // ID do dispositivo
}

const MovementChart: React.FC<MovementChartProps> = ({ velocityData, history, deviceId }) => {
  const screenWidth = Dimensions.get("window").width;
  const chartWidth = screenWidth * 0.9;
  const chartHeight = 250;

  const [chartMode, setChartMode] = useState<"velocity" | "distance">("velocity");
  const [chartType, setChartType] = useState<"line" | "bar">("line");

  // Função para calcular a distância entre dois pontos (Haversine)
  const calculateDistance = (coord1: [number, number], coord2: [number, number]): number => {
    const toRad = (value: number) => (value * Math.PI) / 180;
    const R = 6371; // Raio da Terra em km
    const dLat = toRad(coord2[1] - coord1[1]);
    const dLon = toRad(coord2[0] - coord1[0]);
    const lat1 = toRad(coord1[1]);
    const lat2 = toRad(coord2[1]);

    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.asin(Math.sqrt(a));
    return R * c * 1000; // Distância em metros
  };

  // Função para agregar dados de distância por dia
  const aggregateDistanceData = (): { date: string; count: number }[] => {
    if (!history || history.length < 2) {
      console.log("aggregateDistanceData: Histórico insuficiente ou vazio", { historyLength: history?.length });
      return [];
    }

    console.log("aggregateDistanceData: Processando history com", history.length, "itens");

    const groupedData: { [key: string]: number } = {};

    for (let i = 0; i < history.length - 1; i++) {
      const current = history[i];
      const next = history[i + 1];

      if (
        typeof current.latitude === "number" &&
        typeof current.longitude === "number" &&
        typeof next.latitude === "number" &&
        typeof next.longitude === "number" &&
        current.timestamp &&
        next.timestamp &&
        !isNaN(new Date(current.timestamp).getTime()) &&
        !isNaN(new Date(next.timestamp).getTime())
      ) {
        const distance = calculateDistance(
          [current.longitude, current.latitude],
          [next.longitude, next.latitude]
        );

        const date = new Date(current.timestamp);
        const key = date.toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });

        groupedData[key] = (groupedData[key] || 0) + distance;
      } else {
        console.warn("aggregateDistanceData: Entrada inválida no índice", i, {
          current: {
            latitude: current.latitude,
            longitude: current.longitude,
            timestamp: current.timestamp,
          },
          next: {
            latitude: next.latitude,
            longitude: next.longitude,
            timestamp: next.timestamp,
          },
        });
      }
    }

    const dataPoints = Object.entries(groupedData).map(([date, count]) => ({
      date,
      count: parseFloat((count / 1000).toFixed(2)), // Converte para km
    }));

    console.log("aggregateDistanceData: Dados agregados:", dataPoints);

    return dataPoints.sort((a, b) => {
      const parseDate = (str: string) => {
        const [day, month, year] = str.split("/").map(Number);
        return new Date(year, month - 1, day).getTime();
      };
      return parseDate(a.date) - parseDate(b.date);
    });
  };

  // Selecionar dados com base no modo
  const chartData = chartMode === "velocity" ? velocityData || [] : aggregateDistanceData();

  if (chartData.length === 0) {
    console.log("MovementChart: Nenhum dado para exibir", { chartMode, velocityData, historyLength: history?.length });
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Nenhum dado disponível</Text>
      </View>
    );
  }

  // Preparar rótulos e valores
  const labels = chartData.map((d) => d.date);
  const values = chartData.map((d) => d.count);
  const labelInterval = Math.ceil(labels.length / 5); // Limitar a 5 rótulos
  const displayedLabels = labels.map((label, index) => (index % labelInterval === 0 ? label : ""));

  // Configuração do gráfico
  const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    decimalPlaces: chartMode === "velocity" ? 1 : 2,
    color: (opacity = 1) => "rgba(104, 82, 245, 0.8)",
    labelColor: (opacity = 1) => `rgba(30, 30, 30, ${opacity})`,
    propsForDots: {
      r: "5",
      strokeWidth: "2",
      stroke: "#5a4af5",
    },
    propsForBackgroundLines: {
      stroke: "#e0e0e0",
    },
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {chartMode === "velocity" ? "VELOCIDADE (m/s) POR DIA" : "DISTÂNCIA PERCORRIDA POR DIA (km)"}
      </Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => setChartMode(chartMode === "velocity" ? "distance" : "velocity")}>
          <Text style={styles.buttonText}>Modo: {chartMode === "velocity" ? "Velocidade" : "Distância"}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => setChartType(chartType === "line" ? "bar" : "line")}>
          <Text style={styles.buttonText}>Gráfico: {chartType === "line" ? "Linha" : "Barra"}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.chartWrapper}>
        {chartType === "line" ? (
          <LineChart
            data={{
              labels: displayedLabels,
              datasets: [{ data: values }],
            }}
            width={chartWidth}
            height={chartHeight}
            yAxisLabel=""
            yAxisSuffix={chartMode === "velocity" ? " m/s" : " km"}
            fromZero={true}
            chartConfig={chartConfig}
            bezier
            withInnerLines={true}
            withOuterLines={true}
            style={styles.chartStyle}
          />
        ) : (
          <BarChart
            data={{
              labels: displayedLabels,
              datasets: [{ data: values }],
            }}
            width={chartWidth}
            height={chartHeight}
            yAxisLabel=""
            yAxisSuffix={chartMode === "velocity" ? " m/s" : " km"}
            fromZero={true}
            chartConfig={chartConfig}
            style={styles.chartStyle}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    width: "100%",
    alignSelf: "center",
    marginVertical: 12,
    boxShadow: "0px 2px 2px rgba(0, 0, 0, 0.1)", // Substitui shadow props
  },
  title: {
    textAlign: "center",
    fontWeight: "600",
    fontSize: 14,
    color: "#333",
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
    gap: 8,
  },
  button: {
    backgroundColor: "#041635",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
  chartWrapper: {
    borderRadius: 16,
    overflow: "hidden",
  },
  chartStyle: {
    marginVertical: 8,
    borderRadius: 16,
  },
});

export default MovementChart;
