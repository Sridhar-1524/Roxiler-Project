import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';

const PieChart1 = () => {
  const [month, setMonth] = useState('March');
  const [data, setData] = useState([]);
  const chartRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, [month]);

  const fetchData = () => {
    axios.get(`http://localhost:3001/api/pie-chart?month=${month}`)
      .then((response) => {
        setData(response.data);
        renderChart(response.data);
      })
      .catch((error) => {
        console.error('Error fetching pie chart data:', error);
      });
  };

  const renderChart = (data) => {
    if (chartRef.current !== null) {
      chartRef.current.destroy();
    }

    const ctx = document.getElementById('myPieChart').getContext('2d');
    chartRef.current = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: data.map(item => item.category),
        datasets: [{
          label: 'Count',
          data: data.map(item => item.count),
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: false
      }
    });
  };

  return (
    <div className=' rounded-xl'>
      <h2 className='text-3xl'>Pie Chart</h2>
      <div>
        <select value={month} onChange={(e) => setMonth(e.target.value)} className="border border-gray-300 p-2 mr-2">
          <option value="">Select Month</option>
          <option value="January">January</option>
          <option value="February">February</option>
          <option value="March">March</option>
          <option value="April">April</option>
          <option value="May">May</option>
          <option value="June">June</option>
          <option value="July">July</option>
          <option value="August">August</option>
          <option value="September">September</option>
          <option value="October">October</option>
          <option value="November">November</option>
          <option value="December">December</option>
        </select>
        <button onClick={fetchData} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
          Fetch Data
        </button>
      </div>
      <div>
        <canvas id="myPieChart" width="400" height="400"></canvas>
      </div>
    </div>
  );
};

export default PieChart1;
