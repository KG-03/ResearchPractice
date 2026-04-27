const input = document.querySelector(".input");
const btn = document.querySelector(".btn");
const result = document.querySelector(".result");
const state = document.querySelector(".state");

let requestId = 0;

const MESSAGES = {
    loading: "불러오는 중...",
    research: "다시 검색해주십시오.",
    notFound: "도시를 찾을 수 없습니다.",
    error: "오류가 발생했습니다"
};

btn.addEventListener("click", function() {
    btn.blur();
    getWeather();
});

input.addEventListener("keydown", function(e) {
    if(e.key === "Enter") {
        getWeather();
    }
});

async function getWeather() {
    if(btn.disabled) return;

    const city = input.value.trim();
    if(!city) return;

    showMessage("loading");

    const start = Date.now();
    const currentId = ++requestId;

    try {
        btn.disabled = true;

        const geoRes = await fetch (`https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${API_KEY}`);
        if(!geoRes.ok) {
            throw new Error("Geocoding failed");
        }

        const geoData = await geoRes.json();
        if(!geoData.length) {
            throw new Error("notFound");
        }

        const {lat, lon, name} = geoData[0];

        const weatherRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        if (!weatherRes.ok) {
            throw new Error("Weather request failed");
        }

        const weatherData = await weatherRes.json();

        if (!weatherData.main || !weatherData.weather) {
            throw new Error("Invalid data");
        }

        if (currentId !== requestId) {
            throw new Error("research");
        }

        const elapsed = Date.now() - start;
        const delayTime = Math.max(0, 200 - elapsed);
        if (elapsed < 200) {
            await new Promise(resolve => setTimeout(resolve, delayTime));
        }

        renderWeather(weatherData, name);
        showMessage();

        input.value = "";
        input.focus();
    } catch (error) {
        console.error(error);

        //이후 확장을 위해 각각 분리하여 관리중.
        if (error.message === "notFound") {
            showMessage("notFound");
        } else if (error.message === "research") {
            showMessage("research");
        } else if (error.message === "Geocoding failed") {
            showMessage("error");
        } else if (error.message === "Weather request failed") {
            showMessage("error");
        } else if (error.message === "Invalid data") {
            showMessage("error");
        } else {
            showMessage("error");
        }
    } finally {
        btn.disabled = false;
    }
}

function renderWeather(data, cityName) {
    if(!data.main || !data.weather) return;

    const temp = data.main.temp;
    const weather = data.weather[0].main;
    const icon = data.weather[0].icon;

    const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

    const oldCard = document.querySelector(".weather-card");

    const weatherMain = data.weather[0].main;

    if(oldCard) {
        console.log("fade-out")
        oldCard.classList.remove("show");
        oldCard.classList.remove("fade-in");
        oldCard.classList.add("fade-out");

        setTimeout(() => {
            console.log("swap");
            result.innerHTML = createCardHTML(cityName, data, iconUrl);

            const newCard = document.querySelector(".weather-card");

            newCard.classList.add("fade-in");
            requestAnimationFrame(() => {
                newCard.classList.add("show");
            });
        }, 300);
    } else {
        result.innerHTML = createCardHTML(cityName, data, iconUrl);

        const newCard = document.querySelector(".weather-card");
        
        newCard.classList.add("fade-in");
        requestAnimationFrame(() => {
            newCard.classList.add("show");
        });
    }
    
    setWeatherBackground(weather);
}

function createCardHTML(cityName, data, iconUrl) {
    const temp = data.main.temp;
    const weather = data.weather[0].main;
    
    return `
        <div class=weather-card>
            <h2>${cityName || data.name}</h2>
            <img src="${iconUrl}" alt=${weather}>
            <p class="temp">${temp}°C</p>
            <p class="weather">${weather}</p>
        </div>
    `;
}

function showMessage(type) {
    if(!type) {
        state.textContent = "";
        return;
    }
    state.textContent = MESSAGES[type] || "";
}

function setWeatherBackground(weather) {
    document.body.classList.remove("weather-clear", "weather-clouds", "weather-rain", "weather-snow");

    if (weather === "Clear") {
        document.body.classList.add("weather-clear");
    } else if (weather === "Clouds") {
        document.body.classList.add("weather-clouds");
    } else if (weather === "Rain") {
        document.body.classList.add("weather-rain");
    } else if (weather === "Snow") {
        document.body.classList.add("weather-snow");
    }
}

/* 4월 23일
 * fetch    : 서버 요청
 * await    : 기다림
 * json()   : 데이터 변환
 * data     : 객체로 사용
 */

/* 24일차
 * try-catch-finally    : finally === 성공/실패 상관없이 실행되는 것.
 * 
 * const start = Date.now();                : 로딩 시작 시점 기록
 * const elapsed = Date.now() - start;      : 지금까지 걸린 시간 계산
 * delayTime = Math.max(0, 200 - elapsed);  : 음수 방지. 최소 0ms를 보장하기 위해서.
 * await new Promise(resolve => setTimeout(resolve, 200 - elapsed));    : (200ms - 이미 지나간 시간)만큼 기다렸다가 다음으로 진행.
 *      setTimeout(resolve, 200)                            : 200ms 뒤에 resolve()를 실행.
 *      new Promise(resolve => setTimeout(resolve, 200))    : 200ms 뒤에 "완료되는 작업". 언젠가 끝나는 작업. resolve()가 실행되면 Promise()가 끝난다.
 *      resolve()                                           : Promise()를 만들 때, JS 엔진이 즉석에서 만들어서 넘겨주는 함수.
 *      =>                                                  : (매개변수) => {실행 코드}. function (resolve) {return setTimeout (...);}와 같은 구조.
 *                                                            왼쪽 값을 받아서 오른쪽 코드를 실행하는 함수를 만드는 문법.
 *      JS가 Promise 종료 시점(==resolve 실행 시점) 생성 > setTimeout(...)이 되면 종료 시점 실행.
 */

/* 26일차
 * requestAnimationFrame()  : DOM이 그려진 "다음 프레임"에 실행된다.
 */

/* 27일차
 * document.body.classList. : <body> 요소에 CSS 클래스를 추가한다는 의미.
 */
