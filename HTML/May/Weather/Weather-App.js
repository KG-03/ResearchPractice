const input = document.querySelector(".input");
const btn = document.querySelector(".btn");
const result = document.querySelector(".result");
const errorMassage = document.querySelector(".error");

btn.addEventListener("click", getWeather);

async function getWeather() {
    const city = input.value.trim();
    if(!city) return;

    try {
        const geoRes = await fetch (`https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${API_KEY}`);
        if(!geoRes.ok) {
            throw new Error("Geocoding failed");
        }

        const geoData = await geoRes.json();
        if(!geoData.length) {
            errorMassage.textContent = "도시를 찾을 수 없습니다.";
            return;
        }

        const {lat, lon, name} = geoData[0];

        const weatherRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        if (!weatherRes.ok) {
            throw new Error("Weather request failed");
        }

        const weatherData = await weatherRes.json();
        renderWeather(weatherData, name);
    } catch (error) {
        console.error(error);
        errorMassage.textContent = "날씨를 불러오지 못했습니다...";
    }
}

function renderWeather(data, cityName) {
    const temp = data.main.temp;
    const weather = data.weather[0].main;

    result.innerHTML = `
        <h2>${cityName || data.name}</h2>
        <p>${temp}°C</p>
        <p>${weather}</p>
    `;
}


/* 4월 23일
 * fetch    : 서버 요청
 * await    : 기다림
 * json()   : 데이터 변환
 * data     : 객체로 사용
 */
