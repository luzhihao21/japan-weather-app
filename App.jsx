const { useState, useEffect } = React;

// 动态调整地图中心的组件
function ChangeView({ center }) {
  const map = useMap();
  map.setView(center, 7);
  return null;
}

function App() {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState('');
  const [pos, setPos] = useState([35.6895, 139.6917]); // 默认东京坐标
  const apiKey = '46b039e5a1e9a26ee496fae918a02946';

  const fetchWeather = async (cityName = 'Tokyo') => {
    try {
      const res = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&lang=ja&appid=${apiKey}`);
      setWeather(res.data);
      setPos([res.data.coord.lat, res.data.coord.lon]);
    } catch (err) { alert("都市名が見つかりませんでした"); }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  return (
    <div className="app-container">
      <header>
        <h1>🇯🇵 天気ナビ</h1>
        <p className="subtitle">今日、何着ていく？</p>
      </header>

      <div className="search-box">
        <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Nagoya, Osaka..." />
        <button onClick={() => fetchWeather(city)}>検索</button>
      </div>

      <div className="main-content">
        {weather && (
          <div className="weather-card">
            <h2>📍 {weather.name}</h2>
            <p className="temp">{Math.round(weather.main.temp)}°C</p>
            <div className="advice-box">
              <h3>👔 服装アドバイス</h3>
              <p>{weather.main.temp < 15 ? "厚手のコートが必要です" : "シャツ一枚で大丈夫です"}</p>
            </div>
          </div>
        )}

        <div id="map-container">
          <MapContainer center={pos} zoom={7} scrollWheelZoom={false} style={{ height: "300px", width: "100%", borderRadius: "15px" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <ChangeView center={pos} />
            <Marker position={pos}>
               {/* 这里可以通过CSS给Marker加跳动效果 */}
            </Marker>
          </MapContainer>
        </div>
      </div>
    </div>
  );
}

export default App;
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
