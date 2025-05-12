const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Weight conversion routes
app.post('/api/weight', (req, res) => {
  const { value, fromUnit, toUnit } = req.body;
  
  if (!value || !fromUnit || !toUnit) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  // Convert to kg as base unit
  let valueInKg;
  switch (fromUnit) {
    case 'kg':
      valueInKg = value;
      break;
    case 'g':
      valueInKg = value / 1000;
      break;
    case 'lb':
      valueInKg = value * 0.45359237;
      break;
    case 'oz':
      valueInKg = value * 0.0283495231;
      break;
    default:
      return res.status(400).json({ error: 'Invalid source unit' });
  }

  // Convert from kg to target unit
  let result;
  switch (toUnit) {
    case 'kg':
      result = valueInKg;
      break;
    case 'g':
      result = valueInKg * 1000;
      break;
    case 'lb':
      result = valueInKg / 0.45359237;
      break;
    case 'oz':
      result = valueInKg / 0.0283495231;
      break;
    default:
      return res.status(400).json({ error: 'Invalid target unit' });
  }

  res.json({ result: parseFloat(result.toFixed(6)) });
});

// Length conversion routes
app.post('/api/length', (req, res) => {
  const { value, fromUnit, toUnit } = req.body;
  
  if (!value || !fromUnit || !toUnit) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  // Convert to meters as base unit
  let valueInMeters;
  switch (fromUnit) {
    case 'm':
      valueInMeters = value;
      break;
    case 'cm':
      valueInMeters = value / 100;
      break;
    case 'mm':
      valueInMeters = value / 1000;
      break;
    case 'km':
      valueInMeters = value * 1000;
      break;
    case 'ft':
      valueInMeters = value * 0.3048;
      break;
    case 'in':
      valueInMeters = value * 0.0254;
      break;
    case 'yd':
      valueInMeters = value * 0.9144;
      break;
    case 'mi':
      valueInMeters = value * 1609.344;
      break;
    default:
      return res.status(400).json({ error: 'Invalid source unit' });
  }

  // Convert from meters to target unit
  let result;
  switch (toUnit) {
    case 'm':
      result = valueInMeters;
      break;
    case 'cm':
      result = valueInMeters * 100;
      break;
    case 'mm':
      result = valueInMeters * 1000;
      break;
    case 'km':
      result = valueInMeters / 1000;
      break;
    case 'ft':
      result = valueInMeters / 0.3048;
      break;
    case 'in':
      result = valueInMeters / 0.0254;
      break;
    case 'yd':
      result = valueInMeters / 0.9144;
      break;
    case 'mi':
      result = valueInMeters / 1609.344;
      break;
    default:
      return res.status(400).json({ error: 'Invalid target unit' });
  }

  res.json({ result: parseFloat(result.toFixed(6)) });
});

// Temperature conversion routes
app.post('/api/temperature', (req, res) => {
  const { value, fromUnit, toUnit } = req.body;
  
  if (!value || !fromUnit || !toUnit) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  // Convert to Celsius as base unit
  let valueInCelsius;
  switch (fromUnit) {
    case 'C':
      valueInCelsius = value;
      break;
    case 'F':
      valueInCelsius = (value - 32) * 5/9;
      break;
    case 'K':
      valueInCelsius = value - 273.15;
      break;
    default:
      return res.status(400).json({ error: 'Invalid source unit' });
  }

  // Convert from Celsius to target unit
  let result;
  switch (toUnit) {
    case 'C':
      result = valueInCelsius;
      break;
    case 'F':
      result = (valueInCelsius * 9/5) + 32;
      break;
    case 'K':
      result = valueInCelsius + 273.15;
      break;
    default:
      return res.status(400).json({ error: 'Invalid target unit' });
  }

  res.json({ result: parseFloat(result.toFixed(6)) });
});

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'UP' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
