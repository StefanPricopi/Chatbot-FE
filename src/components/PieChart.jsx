import React, { useEffect, useRef } from 'react';
import { Chart } from "chart.js/auto";

export default function PieChart({ FAQStatistics }) {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = document.getElementById('myChart');

    if (!FAQStatistics && FAQStatistics.length === 0) {
      return;
    }

    const category = FAQStatistics.map(faq => faq.category);
    const data = FAQStatistics.map(faq => faq.count);
    <p>category</p>

    const newChart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: category,
          datasets: [{
            label: "Count",
            data: data,
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false, 
          plugins: {
            legend: {
              position: 'bottom' 
            }
          }
        }
      });

    chartRef.current = newChart;

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [FAQStatistics]);

  return (
    <div>
      <canvas id="myChart"></canvas>
    </div>
  );
}
