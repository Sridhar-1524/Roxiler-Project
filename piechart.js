import React, { useState, useEffect } from 'react';
import axios from 'axios';


const PieChart = () => {
  const [month, setMonth] = useState('March');
  const [data, setData] = useState([]);

  useEffect(() => {
    if (month) {
      fetchData();
    }
  }, [month]);

  const fetchData = () => {
    axios.get(`http://localhost:3001/api/pie-chart?month=${month}`)
      .then((response) => {
        setData(response.data);
        
      })
      .catch((error) => {
        console.error('Error fetching pie chart data:', error);
      });
  };

 
  

  
 

  return (
    <div className='bg-slate-500 rounded-xl'>
      <h2 className='text-3xl '>Pie Chart Data</h2>
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
      <ul>
            {data.map((item, index) => (
              <li key={index} className="flex justify-between mb-2 p-3">
                <span>category :{item.category}</span>
                <span>Count :{item.count}</span>
              </li>
            ))}
          </ul>
      </div>
    </div>
  );
};

export default PieChart;
