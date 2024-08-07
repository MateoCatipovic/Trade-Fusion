"use client"
import React from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import "chartjs-adapter-date-fns";
import zoomPlugin from "chartjs-plugin-zoom";

const ChartComponent = ({ data, title }) => {
  const setChartData = (data) => {
    return {
      labels: data.map((point) => point.time),
      datasets: [
        {
          label: title,
          data: data.map((point) => point.price),
          fill: true,
          backgroundColor: "rgba(75,192,192,0.4)",
          borderColor: "rgba(75,192,192,1)",
          pointRadius: function (context) {
            const index = context.dataIndex;
            const count = context.dataset.data.length;
            return index === count - 1 ? 5 : 0;
          },
        },
      ],
    };
  };

  const chartData = setChartData(data);

  const options = {
    scales: {
      x: {
        type: "time",
        time: {
          unit: "day",
        },
        adapters: {
          date: "date-fns",
        },
      },
      y: {
        beginAtZero: false,
        ticks: {
          callback: function (value) {
            return value.toFixed(2);
          },
        },
      },
    },
    plugins: {
      zoom: {
        zoom: {
          wheel: {
            enabled: true, // Enable zooming with mouse wheel
          },
          pinch: {
            enabled: true, // Enable zooming with pinch gesture
          },
          mode: "xy", // Allow zooming in both x and y directions
        },
        pan: {
          enabled: true,
          mode: "xy", // Allow panning in both x and y directions
        },
      },
    },
  };
    

  return <Line data={chartData} options={options} plugins={[zoomPlugin]}/>;
};

export default ChartComponent;
