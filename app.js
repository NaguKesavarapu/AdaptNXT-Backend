const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.WEATHERSTACK_API_KEY;

app.use(express.json());

app.get('/weather', async (req, res) => {
    const city = req.query.city;
    if (!city) {
        return res.status(400).send({ error: 'City is required' });
    }

    try {
        const response = await axios.get(`http://api.weatherstack.com/current`, {
            params: {
                access_key: API_KEY,
                query: city
            }
        });

        if (response.data.error) {
            return res.status(400).send({ error: response.data.error.info });
        }

        res.send({
            location: response.data.location.name,
            temperature: response.data.current.temperature,
            weather_descriptions: response.data.current.weather_descriptions,
            wind_speed: response.data.current.wind_speed,
            pressure: response.data.current.pressure,
            humidity: response.data.current.humidity,
        });
    } catch (error) {
        res.status(500).send({ error: 'Unable to fetch weather data' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
