import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);
  const [selectedMonth, setSelectedMonth] = useState('March');
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchProducts();
    
  }, [selectedMonth, currentPage]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/products?month=${selectedMonth}`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
    setCurrentPage(1); // Reset to first page when month changes
  };

  const handleSearch = async (event) => {
    const text = event.target.value;
    setSearchText(text);
  
    try {
      const response = await axios.get(`http://localhost:3001/api/products?month=${selectedMonth}`);
      const filteredProducts = response.data.filter(product => {
        const { title, price, description ,category} = product;
        return (
          title.toLowerCase().includes(text.toLowerCase()) ||
          price.toString().toLowerCase().includes(text.toLowerCase()) ||
          description.toLowerCase().includes(text.toLowerCase())||
          category.toLowerCase().includes(text.toLowerCase())
        );
      });
      setProducts(filteredProducts);
    } catch (error) {
      console.error('Error searching products:', error);
    }
  };

  const paginate = (direction) => {
    if (direction === 'next') {
      setCurrentPage(currentPage + 1);
    } else if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  const renderProducts = currentProducts.map(product => (
    <tr key={product.id}>
      <td className='border-2'>{product.id}</td>
      <td className='border-2'>{product.title}</td>
      <td className='border-2'>{product.price}</td>
      <td className='border-2'>{product.description}</td>
      <td className='border-2'>{product.category}</td>
      <td className='border-2'>{product.sold}</td>
      <td className='border-2'><img src={product.image} height='100' /></td>
      {/* Add more table cells for other product details */}
    </tr>
  ));

  

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Product Table</h1>
      <div className="flex mb-4">
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
        <input
          className="border border-gray-300 rounded p-2 flex-grow"
          type="text"
          placeholder="Search transaction..."
          value={searchText}
          onChange={handleSearch}
        />
      </div>
      <table className="table-auto w-full bg-gray-100 rounded-lg shadow-lg border-black p-4">
  <thead>
    <tr>
      <th className='border-3'>ID</th>
      <th className='border-black'>Title</th>
      <th className='border-black'>Price</th>
      <th className='border-black'>Description</th>
      <th className='border-black'>Category</th>
      <th className='border-black'>Sold</th>
      <th className='border-black'>Image</th>

      {/* Add more table headers for other product details */}
    </tr>
  </thead>
  <tbody className='border-2'>
    {renderProducts}
  </tbody>
</table>

      <div className="flex justify-between mt-4">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={() => paginate('prev')}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={() => paginate('next')}
          disabled={currentProducts.length < productsPerPage}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ProductTable;
