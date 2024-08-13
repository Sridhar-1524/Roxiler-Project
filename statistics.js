import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Statistics = () => {
    const [statistics, setStatistics] = useState({});
  
    const [selectedMonth, setSelectedMonth] = useState('March');

    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/statistics?month=${selectedMonth}`);
                 
                 
                setStatistics(response.data);
                
            } catch (error) {
                console.error('Error fetching statistics:', error);
                
            }
        };

        fetchStatistics();
    },  [selectedMonth]);
    const handleMonthChange = (event) => {
        setSelectedMonth(event.target.value);
        
      };
    

    return (
        <div className='flext flex-col bg-slate-300 rounded-xl items-center'> 
            <h1 className=' text-3xl'>Statistics</h1>
             <select
          className="border border-gray-300 rounded p-2 mr-2"
          value={selectedMonth}
          onChange={handleMonthChange}
        >
          {Array.from({ length: 12 }, (_, i) => {
            const month = new Date(0, i).toLocaleString('en-US', { month: 'long' });
            return <option key={month} value={month}>{month}</option>;
          })}
        </select>
            
           
                <div className='p-3'>
                    <p>Total Sale Amount: ${statistics.totalSaleAmount}</p>
                    <p>Total Number of Sold Items: {statistics.totalSoldItems}</p>
                    <p>Total Number of Not Sold Items: {statistics.totalNotSoldItems}</p>
                </div>
       
        </div>
    );
};

export default Statistics;
