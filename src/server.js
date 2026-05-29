require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const portfolioRoutes = require('./routes/portfolio.routes');
const authRoutes = require('./routes/auth.routes');

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use('/auth', authRoutes);

app.use('/', portfolioRoutes);

const PORT = process.env.PORT || 4010;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Portfolio API corriendo en puerto ${PORT}`);
});