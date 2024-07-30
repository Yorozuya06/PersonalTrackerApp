import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { supabase } from './../ExpensesTab/SupabaseConfig';

const screenWidth = Dimensions.get('window').width;

const Charts = () => {
  const [pieData, setPieData] = useState([]);

  const fetchCategoryData = async () => {
    const { data, error } = await supabase
      .from('category')
      .select('name, assigned_budget, color');

    if (error) {
      console.error(error);
      return;
    }

    const formattedData = data.map(category => ({
      name: category.name,
      population: parseFloat(category.assigned_budget),
      color: category.color,
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    }));

    setPieData(formattedData);
  };

  useEffect(() => {
    fetchCategoryData();

    const intervalId = setInterval(() => {
      fetchCategoryData();
    }, 60000); // Fetch data every 60 seconds

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  const chartConfig = {
    backgroundGradientFrom: "#1E2923",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#08130D",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <PieChart 
          data={pieData}
          width={screenWidth}
          height={220}
          chartConfig={chartConfig}
          accessor={"population"}
          backgroundColor={"white"}
          paddingLeft={"15"}
          absolute
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});

export default Charts;
