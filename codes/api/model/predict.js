
const fs = require('fs');
const path = require('path');

const modelData = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'lr_model_export.json'), 'utf-8')
);

const { feature_names, coefficients, intercept, scaler_mean, scaler_scale } = modelData;

function sigmoid(x) {
  return 1 / (1 + Math.exp(-x));
}

function predict(inputData) {
  const scaledFeatures = feature_names.map((name, i) => {
    const value = inputData[name];
    return (value - scaler_mean[i]) / scaler_scale[i];
  });

  let z = intercept;
  for (let i = 0; i < scaledFeatures.length; i++) {
    z += scaledFeatures[i] * coefficients[i];
  }

  const probability = sigmoid(z);
  const prediction = probability >= 0.5 ? 1 : 0;

  return { prediction, probability };
}

module.exports = { predict, feature_names };

