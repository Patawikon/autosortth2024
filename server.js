const express = require('express');
const request = require('request');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/*', (req, res) => {
    const url = `https://staff.flashexpress.com${req.originalUrl.replace('/api', '')}`;
    req.pipe(request({ qs:req.query, uri: url })).pipe(res);
});

app.post('/api/*', (req, res) => {
    const url = `https://staff.flashexpress.com${req.originalUrl.replace('/api', '')}`;
    req.pipe(request.post({ uri: url, form: req.body })).pipe(res);
});

app.listen(port, () => {
    console.log(`Proxy server running at http://localhost:${port}`);
});
