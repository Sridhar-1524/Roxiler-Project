import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BarChart = () => {
  const [month, setMonth] = useState('February');
  const [data, setData] = useState([]);
  const [error, setError] = useState('');

  const handleMonthChange = (e) => {
    setMonth(e.target.value);
  };

  const fetchData = () => {
    axios.get(`http://localhost:3001/api/bar-chart?month=${month}`)
      .then((response) => {
       
        setData(response.data);
        setError('');
      })
      .catch((error) => {
        setError(error.response ? error.response.data.error : 'An error occurred');
        setData([]);
      });
  };

  return (
    <div className="container mx-auto bg-slate-400 rounded-xl ">
      <h1 className="text-2xl font-bold mb-4 items-center">Bar Chart Data</h1>
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
        <div className="w-full max-w-lg">
          <ul>
            {data.map((item, index) => (
              <li key={index} className="flex justify-between mb-2">
                <span>priceRange :{item.price_range}</span>
                <span>Count{item.count}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BarChart;
