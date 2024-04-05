const performanceFormat = (chartData) => {
      const categories = chartData.kind;
      const displayingData = chartData.data;
    console.log(chartData)
      return displayingData.map(({ value, kind }) => ({
        subject: categories[kind],
        value,
      }));
    };
    
    export default performanceFormat;