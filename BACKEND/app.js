const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
require('dotenv').config();

const portfolioRoutes = require('./routes/portfolioRoutes'); 
const overlapRoutes = require('./routes/overlapRoutes');
const stockRoutes = require('./routes/stockRoutes');


app.use(cors());
app.use(express.json());

app.use('/api/portfolio', portfolioRoutes);

app.use('/api/overlap', overlapRoutes);
app.use('/api/stock', stockRoutes);
const PORT =3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

