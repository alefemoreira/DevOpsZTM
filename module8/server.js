// -----------------------------------------------------------------------------
// Arquivo: app/index.js
// -----------------------------------------------------------------------------
// Aplicação Express básica que expõe métricas para o Prometheus.
// Usamos a biblioteca 'prom-client' para instrumentar o código.
// -----------------------------------------------------------------------------
const express = require('express');
const client = require('prom-client');

const app = express();
const port = 8080;

// Cria um registro para coletar as métricas padrão do Node.js
const register = new client.Registry();
client.collectDefaultMetrics({ register });

// Cria um contador customizado para o número de requisições
const reqCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total de requisições HTTP recebidas',
  labelNames: ['method', 'path', 'status_code'],
  registers: [register],
});

// Middleware para contar todas as requisições
app.use((req, res, next) => {
  res.on('finish', () => {
    // Incrementa o contador com os labels corretos
    reqCounter.inc({
      method: req.method,
      path: req.path,
      status_code: res.statusCode
    });
  });
  next();
});

// Rota principal da aplicação
app.get('/', (req, res) => {
  res.send('Olá, Mundo! Acesse /metrics para ver as métricas do Prometheus.');
});

// Rota que expõe as métricas para o Prometheus fazer o 'scrape'
app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (ex) {
    res.status(500).end(ex);
  }
});

app.listen(port, () => {
  console.log(`Aplicação rodando em http://localhost:${port}`);
});
