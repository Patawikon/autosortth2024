const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const axios = require('axios');
const app = express();

const PORT = 3004;

// Middleware for serving static files
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.set('view engine', 'ejs');

// Route to render login.ejs
app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const response = await axios.post('https://staff.flashexpress.com/loginuser/loginv3', `account=${username}&pwd=${password}&token=&from=&l=th`, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        });

        if (response.data.code === 1) {
            // Store session_id and other data in cookies
            res.cookie('session_id', response.data.data.session_id, { maxAge: 3600000, httpOnly: true });
            res.cookie('user_id', response.data.data.id, { maxAge: 3600000, httpOnly: true });
            res.cookie('user_name', response.data.data.name, { maxAge: 3600000, httpOnly: true });
            res.cookie('mobile', response.data.data.mobile, { maxAge: 3600000, httpOnly: true });
            res.cookie('organization_id', response.data.data.organization_id, { maxAge: 3600000, httpOnly: true });
            res.cookie('organization_name', response.data.data.organization_name, { maxAge: 3600000, httpOnly: true });

            // Redirect to dashboard
            res.redirect('/dashboard');
        } else {
            res.send('Login failed: ' + (response.data.msg || 'Unknown error'));
        }
    } catch (error) {
        console.error('Login error:', error);
        res.send('An error occurred');
    }
});

app.get('/dashboard', (req, res) => {
    res.render('dashboard');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
