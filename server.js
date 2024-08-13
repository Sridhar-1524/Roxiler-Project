const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3001;
app.use(bodyParser.json());


// MySQL Connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'dinesh2003',
    database: 'roxiler'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL: ', err);
        return;
    }
    console.log('Connected to MySQL');
});
app.use(cors());

// Route to initialize the database
app.get('/initialize_database', (req, res) => {
    // Fetch JSON data from the third-party API
    const jsonURL = 'https://s3.amazonaws.com/roxiler.com/product_transaction.json';
    fetch(jsonURL)
        .then(response => response.json())
        .then(products => {
            // Insert products into the database
            const query = 'INSERT INTO products (id, title, price, description, category, image, sold, dateOfSale) VALUES ?';
            const values = products.map(product => [
                product.id,
                product.title,
                product.price,
                product.description,
                product.category,
                product.image,
                product.sold,
                product.dateOfSale
            ]);
            connection.query(query, [values], (err, result) => {
                if (err) {
                    console.error('Error inserting data into MySQL: ', err);
                    res.status(500).json({ error: 'Error inserting data into MySQL' });
                    return;
                }
                console.log('Data inserted into MySQL');
                res.json({ message: 'Database initialized successfully' });
            });
        })
        .catch(error => {
            console.error('Error fetching JSON data: ', error);
            res.status(500).json({ error: 'Error fetching JSON data' });
        });
});



app.get('/api/products', (req, res) => {
    const { month } = req.query;
    console.log(req.query.month);
    
    let sql = 'SELECT * FROM products';
  
    if (month) {
      // Extract month number from date string (assuming dateOfSale is a DATETIME or TIMESTAMP column)
      var monthNumber =  3;
      switch (month.toLowerCase()) {
        case "january":
            monthNumber = 1;
            break;
        case "february":
            monthNumber = 2;
            break;
        case "march":
            monthNumber = 3;
            break;
        case "april":
            monthNumber = 4;
            break;
        case "may":
            monthNumber = 5;
            break;
        case "june":
            monthNumber = 6;
            break;
        case "july":
            monthNumber = 7;
            break;
        case "august":
            monthNumber = 8;
            break;
        case "september":
            monthNumber = 9;
            break;
        case "october":
            monthNumber = 10;
            break;
        case "november":
            monthNumber = 11;
            break;
        case "december":
            monthNumber = 12;
            break;
        default:
            monthNumber = -1; // Indicate invalid input
    }

      console.log('Month number:', monthNumber); 
      sql += ` WHERE MONTH(dateOfSale) = ${monthNumber}`;
    }
  
    connection.query(sql, (err, results) => {
      if (err) {
        throw err;
      }
      let filteredProducts = results;
  
     
  
      res.json(filteredProducts);
    });
  });


  //API FOR THE STATISTICS

  app.get('/api/statistics', (req, res) => {
    const { month } = req.query;
    console.log(req.query.month);
    
    let sql = 'SELECT * FROM products';
  
    if (month) {
      // Extract month number from date string (assuming dateOfSale is a DATETIME or TIMESTAMP column)
      let monthNumber;
      switch (month.toLowerCase()) {
        case "january":
            monthNumber = 1;
            break;
        case "february":
            monthNumber = 2;
            break;
        case "march":
            monthNumber = 3;
            break;
        case "april":
            monthNumber = 4;
            break;
        case "may":
            monthNumber = 5;
            break;
        case "june":
            monthNumber = 6;
            break;
        case "july":
            monthNumber = 7;
            break;
        case "august":
            monthNumber = 8;
            break;
        case "september":
            monthNumber = 9;
            break;
        case "october":
            monthNumber = 10;
            break;
        case "november":
            monthNumber = 11;
            break;
        case "december":
            monthNumber = 12;
            break;
        default:
            return res.status(400).json({ error: 'Invalid month provided' }); // Return an error for invalid input
      }

      console.log('Month number:', monthNumber); 
      sql += ` WHERE MONTH(dateOfSale) = ${monthNumber}`;
    }
  
    connection.query(sql, (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Internal server error' }); // Return an error for database query error
      }
      let filteredProducts = results;
      let totalSaleAmount = 0;

     
      filteredProducts.forEach(product => {
          totalSaleAmount += parseFloat(product.price);
      });
      const totalSoldItems = filteredProducts.filter(product => product.sold).length;
      const totalNotSoldItems = filteredProducts.filter(product => !product.sold).length;

      // Construct response object
      const response = {
          totalSaleAmount,
          totalSoldItems,
          totalNotSoldItems
      };

      res.json(response);
      console.log(response);
    });
  });


  //barchart api

  app.get('/api/bar-chart', (req, res) => {
    const { month } = req.query;
    console.log(month);
    var monthNumber;
    // Validating month input
    if (month) {
      // Extract month number from date string (assuming dateOfSale is a DATETIME or TIMESTAMP column)
      
      switch (month.toLowerCase()) {
        case "january":
            monthNumber = 1;
            break;
        case "february":
            monthNumber = 2;
            break;
        case "march":
            monthNumber = 3;
            break;
        case "april":
            monthNumber = 4;
            break;
        case "may":
            monthNumber = 5;
            break;
        case "june":
            monthNumber = 6;
            break;
        case "july":
            monthNumber = 7;
            break;
        case "august":
            monthNumber = 8;
            break;
        case "september":
            monthNumber = 9;
            break;
        case "october":
            monthNumber = 10;
            break;
        case "november":
            monthNumber = 11;
            break;
        case "december":
            monthNumber = 12;
            break;
        default:
            return res.status(400).json({ error: 'Invalid month provided' }); // Return an error for invalid input
      }
    }

    const sql = `
      SELECT 
        CASE
          WHEN price >= 0 AND price <= 100 THEN '0 - 100'
          WHEN price >= 101 AND price <= 200 THEN '101 - 200'
          WHEN price >= 201 AND price <= 300 THEN '201 - 300'
          WHEN price >= 301 AND price <= 400 THEN '301 - 400'
          WHEN price >= 401 AND price <= 500 THEN '401 - 500'
          WHEN price >= 501 AND price <= 600 THEN '501 - 600'
          WHEN price >= 601 AND price <= 700 THEN '601 - 700'
          WHEN price >= 701 AND price <= 800 THEN '701 - 800'
          WHEN price >= 801 AND price <= 900 THEN '801 - 900'
          ELSE '901-above'
        END AS price_range,
        COUNT(*) AS count
      FROM 
        products
      WHERE 
        MONTH(dateOfSale) = ?
      GROUP BY 
        price_range
    `;

    connection.query(sql, [monthNumber],(err, results) => {
        if (err) {
            console.error('Error fetching bar chart data:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        res.json(results ); // Standardizing response format
        console.log(results);
    });

});

//pie chart

app.get('/api/pie-chart', (req, res) => {
  const { month } = req.query;

 
  console.log(month);
  var monthNumber;
  // Validating month input
  if (month) {
    // Extract month number from date string (assuming dateOfSale is a DATETIME or TIMESTAMP column)
    
    switch (month.toLowerCase()) {
      case "january":
          monthNumber = 1;
          break;
      case "february":
          monthNumber = 2;
          break;
      case "march":
          monthNumber = 3;
          break;
      case "april":
          monthNumber = 4;
          break;
      case "may":
          monthNumber = 5;
          break;
      case "june":
          monthNumber = 6;
          break;
      case "july":
          monthNumber = 7;
          break;
      case "august":
          monthNumber = 8;
          break;
      case "september":
          monthNumber = 9;
          break;
      case "october":
          monthNumber = 10;
          break;
      case "november":
          monthNumber = 11;
          break;
      case "december":
          monthNumber = 12;
          break;
      default:
          return res.status(400).json({ error: 'Invalid month provided' }); // Return an error for invalid input
    }
  }


  const sql = `
    SELECT category, COUNT(*) AS count
    FROM products
    WHERE MONTH(dateOfSale) = ?
    GROUP BY category
  `;

  connection.query(sql, [monthNumber], (err, results) => {
    if (err) {
      console.error('Error fetching pie chart data:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    res.json( results );
    console.log(results);
  });
});

  

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
export default Server;