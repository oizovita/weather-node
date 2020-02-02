const request = require('request');

const appid = process.env.API_KEY;
const apiUrl = process.env.API_URL;

function clearData(data) {
	const clearedData = data.reduce((acc, value) => {
		acc[value.dt_txt.slice(0, 10)] = value;
		return acc;
	}, {});

	const date = new Date();

	date.setDate(date.getDate() + 6);
	const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
	const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
	const lastDay = date.getDate() - 1 < 9 ? `0${date.getDate() - 1}` : date.getDate() - 1;
	clearedData[`${date.getFullYear()}-${month}-${day}`] = clearedData[`${date.getFullYear()}-${month}-${lastDay}`];

	return clearedData;
}

function getWeekDay(date) {
	const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
	return days[date.getDay()];
}

function dataForTemplate(body) {
	const clearedData = clearData(JSON.parse(body).list);
	const dataWeather = {};
	for (const key in clearedData) {
		if ({}.hasOwnProperty.call(clearedData, key)) {
			const date = new Date(key);
			dataWeather[key] = {
				date: getWeekDay(date),
				icon: clearedData[key].weather[0].icon,
				temp: clearedData[key].main.temp,
				description: clearedData[key].weather[0].description,
			};
		}
	}

	return dataWeather;
}

function forecast(city, cb) {
	request(`${apiUrl}/forecast?q=${city}&units=metric&appid=${appid}`, cb);
}

module.exports = {
	forecast,
	dataForTemplate,
};
