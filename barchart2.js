import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';

const BarChart1 = () => {
  const [month, setMonth] = useState('February');
  const [data, setData] = useState([]);
  const [error, setError] = useState('');
  const chartRef = useRef(null);

  const handleMonthChange = (e) => {
    setMonth(e.target.value);
  };

  const fetchData = () => {
    axios.get(`http://localhost:3001/api/bar-chart?month=${month}`)
      .then((response) => {
        setData(response.data);
        setError('');
        renderChart(response.data);
      })
      .catch((error) => {
        setError(error.response ? error.response.data.error : 'An error occurred');
        setData([]);
      });
  };

  useEffect(() => {
    fetchData();
  }, [month]);

  const renderChart = (data) => {
    if (chartRef.current !== null) {
      chartRef.current.destroy();
    }

    const ctx = document.getElementById('myChart').getContext('2d');
    chartRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.map(item => item.price_range),
        datasets: [{
          label: 'Count',
          data: data.map(item => item.count),
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          x: {
            title: {
              display: true,
              text: 'Price Range'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Count'
            },
            beginAtZero: true
          }
        }
      }
    });
  };
  

  return (
    <div className="rounded-xl">
      <h1 className="text-2xl font-bold mb-4 items-center">Bar Chart</h1>
      <div className="flex mb-4">
        <select
          className="border border-gray-300 rounded p-2 mr-2"
          value={month}
          onChange={handleMonthChange}
        >
          {Array.from({ length: 12 }, (_, i) => {
            const month = new Date(0, i).toLocaleString('en-US', { month: 'long' });
            return <option key={month} value={month}>{month}</option>;
          })}
        </select>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          onClick={fetchData}
        >
          Fetch Data
        </button>
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="flex justify-center">
        <div style={{ width: '400px' }}> {/* Adjust the width here */}
          <canvas id="myChart"></canvas>
        </div>
      </div>
    </div>
  );
};

export default BarChart1;



