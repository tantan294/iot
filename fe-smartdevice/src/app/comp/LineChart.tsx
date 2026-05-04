import React from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";
import { formatDate } from "../util/AppUtil";

Chart.register(...registerables, zoomPlugin);

export const LineChart = ({ sensorData, label, dataKey, borderColor, backgroundColor }: any) => {

  const data = {
    labels: sensorData.map((data:any) => formatDate(data.time)),
    datasets: [
      {
        label: label,
        data: sensorData.map((data:any) => data[dataKey]),
        borderColor: borderColor,
        backgroundColor: backgroundColor,
        tension: 0.3,
        fill: true,
      }
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false // Hide legend since we have titles or labels
      },
      zoom: {
        pan: {
          enabled: true,
          mode: "x" as const,
        },
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          mode: "x" as const,
        },
      },
    },
    scales: {
      x: {
        ticks: { maxTicksLimit: 6 }
      }
    }
  };
  return <Line data={data} options={options} />;
};
