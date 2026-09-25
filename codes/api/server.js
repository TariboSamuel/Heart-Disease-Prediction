const express = require('express');
const cors = require('cors');
const { predict, feature_names } = require('./model/predict');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Heart Disease Prediction API', status: 'running' });
});

app.post('/predict', (req, res) => {
  const inputData = req.body;

  const missingFields = feature_names.filter(
    (name) => !(name in inputData)
  );

  if (missingFields.length > 0) {
    return res.status(400).json({
      error: 'Missing required fields',
      missingFields
    });
  }

  for (const name of feature_names) {
    if (typeof inputData[name] !== 'number' || isNaN(inputData[name])) {
      return res.status(400).json({
        error: `Field "${name}" must be a number`,
        received: inputData[name]
      });
    }
  }

  try {
    const result = predict(inputData);
    res.json({
      prediction: result.prediction,
      probability: result.probability,
      risk: result.prediction === 1 ? 'High Risk' : 'Low Risk'
    });
  } catch (err) {
    res.status(500).json({ error: 'Prediction failed', details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});