"use client";
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
          //backgroundColor: "rgba(255,255,255,0.7)",
          //borderColor: "rgba(255,255,255,1)",
          // backgroundColor: "rgba(53,239,79,0.5)",
           borderColor: "rgba(53,239,79,1)",
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
        ticks: {
          color: "white", // Set the x-axis label text color to white
        },
      },
      y: {
        beginAtZero: false,

        ticks: {
          color: "white",
          callback: function (value) {
            return value.toFixed(2);
          },
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: "white", // Set the legend text color to white
        },
      },
      tooltip: {
        titleColor: "white", // Set tooltip title text color to white
        bodyColor: "white", // Set tooltip body text color to white
      },
      title: {
        display: true,
        text: title,
        color: "white", // Set chart title text color to white
      },
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

  // Add a plugin to set the background color
  const backgroundPlugin = {
    id: "custom_canvas_background_color",
    beforeDraw: (chart) => {
      const ctx = chart.canvas.getContext("2d");
      ctx.save();
      ctx.globalCompositeOperation = "destination-over";
      ctx.fillStyle = "black"; // Set your desired background color
      ctx.fillRect(0, 0, chart.width, chart.height);
      ctx.restore();
    },
  };

  return (
    <div className="h-full">
      {" "}
      <Line
        data={chartData}
        options={options}
        plugins={[zoomPlugin, backgroundPlugin]}
      />
    </div>
  );
};

export default ChartComponent;
