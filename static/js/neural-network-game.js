/**
 * Neural Network Playground
 * Interactive game to understand neural network training and hyperparameters
 */

class NeuralNetworkGame {
    constructor() {
        this.canvas = document.getElementById('nn-canvas');
        this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
        this.lossChart = document.getElementById('nn-loss-chart');
        this.lossCtx = this.lossChart ? this.lossChart.getContext('2d') : null;

        this.data = [];
        this.network = null;
        this.isTraining = false;
        this.epoch = 0;
        this.lossHistory = [];
        this.accuracyHistory = [];
        this.maxEpochs = 1000;
        this.animationId = null;

        this.initializeControls();
        this.generateData();
        this.initializeNetwork();
        this.draw();
    }

    initializeControls() {
        // Dataset selector
        const datasetSelect = document.getElementById('nn-dataset');
        if (datasetSelect) {
            datasetSelect.addEventListener('change', () => {
                this.generateData();
                this.resetTraining();
            });
        }

        // Architecture controls
        const layersSlider = document.getElementById('nn-layers');
        const layersValue = document.getElementById('nn-layers-value');
        if (layersSlider && layersValue) {
            layersSlider.addEventListener('input', (e) => {
                layersValue.textContent = e.target.value;
                this.initializeNetwork();
                this.draw();
            });
        }

        const neuronsSlider = document.getElementById('nn-neurons');
        const neuronsValue = document.getElementById('nn-neurons-value');
        if (neuronsSlider && neuronsValue) {
            neuronsSlider.addEventListener('input', (e) => {
                neuronsValue.textContent = e.target.value;
                this.initializeNetwork();
                this.draw();
            });
        }

        // Hyperparameter controls
        const lrSlider = document.getElementById('nn-lr');
        const lrValue = document.getElementById('nn-lr-value');
        if (lrSlider && lrValue) {
            lrSlider.addEventListener('input', (e) => {
                lrValue.textContent = parseFloat(e.target.value).toFixed(3);
            });
        }

        const activationSelect = document.getElementById('nn-activation');
        if (activationSelect) {
            activationSelect.addEventListener('change', () => {
                this.initializeNetwork();
                this.draw();
            });
        }

        // Training controls
        const trainBtn = document.getElementById('nn-train-btn');
        const pauseBtn = document.getElementById('nn-pause-btn');
        const resetBtn = document.getElementById('nn-reset-btn');

        if (trainBtn) {
            trainBtn.addEventListener('click', () => this.startTraining());
        }
        if (pauseBtn) {
            pauseBtn.addEventListener('click', () => this.pauseTraining());
        }
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetTraining());
        }
    }

    generateData() {
        const datasetType = document.getElementById('nn-dataset')?.value || 'xor';
        this.data = [];
        const numPoints = 100;

        switch (datasetType) {
            case 'xor':
                this.generateXORData(numPoints);
                break;
            case 'circle':
                this.generateCircleData(numPoints);
                break;
            case 'spiral':
                this.generateSpiralData(numPoints);
                break;
            case 'gaussian':
                this.generateGaussianData(numPoints);
                break;
        }
    }

    generateXORData(n) {
        for (let i = 0; i < n; i++) {
            const x = Math.random() * 2 - 1;
            const y = Math.random() * 2 - 1;
            const label = (x > 0) === (y > 0) ? 0 : 1;
            this.data.push({ x, y, label });
        }
    }

    generateCircleData(n) {
        for (let i = 0; i < n; i++) {
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random();
            const noise = (Math.random() - 0.5) * 0.2;
            const x = Math.cos(angle) * radius + noise;
            const y = Math.sin(angle) * radius + noise;
            const label = radius < 0.5 ? 0 : 1;
            this.data.push({ x, y, label });
        }
    }

    generateSpiralData(n) {
        const pointsPerClass = n / 2;
        for (let i = 0; i < pointsPerClass; i++) {
            const r = i / pointsPerClass;
            const t = 1.75 * i / pointsPerClass * 2 * Math.PI;

            // First spiral
            const noise1 = (Math.random() - 0.5) * 0.2;
            const x1 = r * Math.sin(t) + noise1;
            const y1 = r * Math.cos(t) + noise1;
            this.data.push({ x: x1, y: y1, label: 0 });

            // Second spiral
            const noise2 = (Math.random() - 0.5) * 0.2;
            const x2 = r * Math.sin(t + Math.PI) + noise2;
            const y2 = r * Math.cos(t + Math.PI) + noise2;
            this.data.push({ x: x2, y: y2, label: 1 });
        }
    }

    generateGaussianData(n) {
        const gaussian = () => {
            let u = 0, v = 0;
            while (u === 0) u = Math.random();
            while (v === 0) v = Math.random();
            return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
        };

        for (let i = 0; i < n / 2; i++) {
            this.data.push({
                x: gaussian() * 0.3 - 0.5,
                y: gaussian() * 0.3 - 0.5,
                label: 0
            });
            this.data.push({
                x: gaussian() * 0.3 + 0.5,
                y: gaussian() * 0.3 + 0.5,
                label: 1
            });
        }
    }

    initializeNetwork() {
        const numLayers = parseInt(document.getElementById('nn-layers')?.value || 2);
        const neuronsPerLayer = parseInt(document.getElementById('nn-neurons')?.value || 4);
        const activation = document.getElementById('nn-activation')?.value || 'relu';

        // Create network architecture: [2 (input), hidden layers..., 1 (output)]
        const layers = [2];
        for (let i = 0; i < numLayers; i++) {
            layers.push(neuronsPerLayer);
        }
        layers.push(1);

        this.network = new SimpleNeuralNetwork(layers, activation);
    }

    startTraining() {
        if (this.isTraining) return;

        this.isTraining = true;
        document.getElementById('nn-train-btn').disabled = true;
        document.getElementById('nn-pause-btn').disabled = false;

        this.trainStep();
    }

    pauseTraining() {
        this.isTraining = false;
        document.getElementById('nn-train-btn').disabled = false;
        document.getElementById('nn-pause-btn').disabled = true;

        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    resetTraining() {
        this.pauseTraining();
        this.epoch = 0;
        this.lossHistory = [];
        this.accuracyHistory = [];
        this.initializeNetwork();
        this.updateStats(0, 0, 0);
        this.draw();
        this.drawLossChart();
    }

    trainStep() {
        if (!this.isTraining || this.epoch >= this.maxEpochs) {
            this.pauseTraining();
            return;
        }

        const learningRate = parseFloat(document.getElementById('nn-lr')?.value || 0.1);

        // Train on all data points (batch gradient descent)
        let totalLoss = 0;
        let correct = 0;

        // Forward and backward pass for each data point
        for (const point of this.data) {
            const input = [point.x, point.y];
            const target = point.label;

            const output = this.network.forward(input);
            const loss = Math.pow(output - target, 2);
            totalLoss += loss;

            const predicted = output > 0.5 ? 1 : 0;
            if (predicted === target) correct++;

            this.network.backward(target, learningRate);
        }

        const avgLoss = totalLoss / this.data.length;
        const accuracy = correct / this.data.length;

        this.epoch++;
        this.lossHistory.push(avgLoss);
        this.accuracyHistory.push(accuracy);

        // Update display every 10 epochs
        if (this.epoch % 10 === 0) {
            this.updateStats(this.epoch, accuracy, avgLoss);
            this.draw();
            this.drawLossChart();
        }

        // Continue training
        this.animationId = requestAnimationFrame(() => this.trainStep());
    }

    updateStats(epoch, accuracy, loss) {
        const epochDisplay = document.getElementById('nn-epoch-display');
        const accuracyDisplay = document.getElementById('nn-accuracy-display');
        const lossDisplay = document.getElementById('nn-loss-display');

        if (epochDisplay) epochDisplay.textContent = epoch;
        if (accuracyDisplay) accuracyDisplay.textContent = (accuracy * 100).toFixed(1) + '%';
        if (lossDisplay) lossDisplay.textContent = loss.toFixed(4);
    }

    draw() {
        if (!this.ctx) return;

        const canvas = this.canvas;
        const ctx = this.ctx;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw decision boundary
        this.drawDecisionBoundary();

        // Draw data points
        for (const point of this.data) {
            const screenX = (point.x + 1) * canvas.width / 2;
            const screenY = (1 - point.y) * canvas.height / 2;

            ctx.beginPath();
            ctx.arc(screenX, screenY, 4, 0, Math.PI * 2);
            ctx.fillStyle = point.label === 0 ? 'rgba(74, 144, 226, 0.8)' : 'rgba(236, 64, 122, 0.8)';
            ctx.fill();
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    }

    drawDecisionBoundary() {
        if (!this.ctx || !this.network) return;

        const canvas = this.canvas;
        const ctx = this.ctx;
        const resolution = 4;

        for (let x = 0; x < canvas.width; x += resolution) {
            for (let y = 0; y < canvas.height; y += resolution) {
                // Convert screen coordinates to network coordinates
                const nx = x / canvas.width * 2 - 1;
                const ny = 1 - y / canvas.height * 2;

                const output = this.network.forward([nx, ny]);

                // Color based on output
                const intensity = output;
                const color = output > 0.5
                    ? `rgba(236, 64, 122, ${intensity * 0.3})`
                    : `rgba(74, 144, 226, ${(1 - intensity) * 0.3})`;

                ctx.fillStyle = color;
                ctx.fillRect(x, y, resolution, resolution);
            }
        }
    }

    drawLossChart() {
        if (!this.lossCtx || this.lossHistory.length === 0) return;

        const canvas = this.lossChart;
        const ctx = this.lossCtx;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw axes
        ctx.strokeStyle = '#ccc';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(40, 0);
        ctx.lineTo(40, canvas.height - 30);
        ctx.lineTo(canvas.width, canvas.height - 30);
        ctx.stroke();

        // Draw labels
        ctx.fillStyle = '#666';
        ctx.font = '12px Arial';
        ctx.fillText('Loss', 5, 20);
        ctx.fillText('Epoch', canvas.width - 40, canvas.height - 5);

        // Draw loss curve
        if (this.lossHistory.length < 2) return;

        const maxLoss = Math.max(...this.lossHistory, 1);
        const xScale = (canvas.width - 50) / Math.max(this.lossHistory.length, 100);
        const yScale = (canvas.height - 40) / maxLoss;

        ctx.strokeStyle = '#4a90e2';
        ctx.lineWidth = 2;
        ctx.beginPath();

        for (let i = 0; i < this.lossHistory.length; i++) {
            const x = 40 + i * xScale;
            const y = canvas.height - 30 - this.lossHistory[i] * yScale;

            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();

        // Draw current loss value
        if (this.lossHistory.length > 0) {
            const lastLoss = this.lossHistory[this.lossHistory.length - 1];
            ctx.fillStyle = '#4a90e2';
            ctx.font = 'bold 14px Arial';
            ctx.fillText(lastLoss.toFixed(4), 45, 20);
        }
    }
}

// Simple Neural Network Implementation
class SimpleNeuralNetwork {
    constructor(layers, activation = 'relu') {
        this.layers = layers;
        this.activation = activation;
        this.weights = [];
        this.biases = [];
        this.activations = [];
        this.zValues = [];

        // Initialize weights and biases
        for (let i = 0; i < layers.length - 1; i++) {
            const w = [];
            const b = [];

            for (let j = 0; j < layers[i + 1]; j++) {
                const neuronWeights = [];
                for (let k = 0; k < layers[i]; k++) {
                    neuronWeights.push(Math.random() * 0.5 - 0.25);
                }
                w.push(neuronWeights);
                b.push(Math.random() * 0.1 - 0.05);
            }

            this.weights.push(w);
            this.biases.push(b);
        }
    }

    activate(x, derivative = false) {
        switch (this.activation) {
            case 'relu':
                if (derivative) return x > 0 ? 1 : 0;
                return Math.max(0, x);
            case 'sigmoid':
                if (derivative) {
                    const s = 1 / (1 + Math.exp(-x));
                    return s * (1 - s);
                }
                return 1 / (1 + Math.exp(-x));
            case 'tanh':
                if (derivative) {
                    const t = Math.tanh(x);
                    return 1 - t * t;
                }
                return Math.tanh(x);
            default:
                return x;
        }
    }

    forward(input) {
        this.activations = [input];
        this.zValues = [];

        let current = input;

        for (let i = 0; i < this.weights.length; i++) {
            const z = [];
            const a = [];

            for (let j = 0; j < this.weights[i].length; j++) {
                let sum = this.biases[i][j];
                for (let k = 0; k < current.length; k++) {
                    sum += current[k] * this.weights[i][j][k];
                }
                z.push(sum);

                // Use sigmoid for output layer, activation function for hidden layers
                const activated = i === this.weights.length - 1
                    ? 1 / (1 + Math.exp(-sum))  // Sigmoid for output
                    : this.activate(sum);
                a.push(activated);
            }

            this.zValues.push(z);
            this.activations.push(a);
            current = a;
        }

        return current[0];
    }

    backward(target, learningRate) {
        const deltas = [];

        // Output layer error (using sigmoid output)
        const outputError = this.activations[this.activations.length - 1][0] - target;
        const outputZ = this.zValues[this.zValues.length - 1][0];
        const sigmoid = 1 / (1 + Math.exp(-outputZ));
        const outputDelta = [outputError * sigmoid * (1 - sigmoid)];
        deltas.unshift(outputDelta);

        // Backpropagate through hidden layers
        for (let i = this.weights.length - 2; i >= 0; i--) {
            const layerDelta = [];

            for (let j = 0; j < this.weights[i].length; j++) {
                let error = 0;
                for (let k = 0; k < this.weights[i + 1].length; k++) {
                    error += deltas[0][k] * this.weights[i + 1][k][j];
                }

                const derivative = this.activate(this.zValues[i][j], true);
                layerDelta.push(error * derivative);
            }

            deltas.unshift(layerDelta);
        }

        // Update weights and biases
        for (let i = 0; i < this.weights.length; i++) {
            for (let j = 0; j < this.weights[i].length; j++) {
                for (let k = 0; k < this.weights[i][j].length; k++) {
                    this.weights[i][j][k] -= learningRate * deltas[i][j] * this.activations[i][k];
                }
                this.biases[i][j] -= learningRate * deltas[i][j];
            }
        }
    }
}

// Initialize the game when the page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new NeuralNetworkGame();
    });
} else {
    new NeuralNetworkGame();
}
