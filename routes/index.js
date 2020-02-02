const express = require('express');

const router = express.Router();
const weatherService = require('../services/weather_service');


router.get('/', (req, res) => {
	res.render('index.ejs', {data: {}});
});

router.post('/', (req, res) => {
	weatherService.forecast(req.body.city, (err, response, body) => {
		if (err) {
			return res.status(500).send({ message: err });
		}
		const data = weatherService.dataForTemplate(body);
		res.render('index.ejs', { data });
	});
});

module.exports = router;
