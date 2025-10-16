// --- 地図を表示する設定 ---
const map = L.map('map').setView([34.746, 138.255], 13); // 吉田町の中心付近

// --- OpenStreetMapを表示するタイルレイヤーを設定 ---
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// --- 地震・津波情報のリアルタイム取得 ---
// 気象庁API（JSON）を使用
async function loadEarthquakeData() {
  const response = await fetch('https://www.jma.go.jp/bosai/quake/data/list.json');
  const data = await response.json();

  // 最新の地震情報だけ取得
  const latest = data[0];
  const detailUrl = `https://www.jma.go.jp/bosai/quake/data/${latest.json}`; 

  // 詳細データを取得
  const detailResponse = await fetch(detailUrl);
  const detailData = await detailResponse.json();

  // 緯度経度を取得してピンを追加
  if (detailData && detailData.Body && detailData.Body.Earthquake) {
    const lat = detailData.Body.Earthquake.Hypocenter.Latitude;
    const lon = detailData.Body.Earthquake.Hypocenter.Longitude;
    const mag = detailData.Body.Earthquake.Magnitude;
    const name = detailData.Body.Earthquake.Hypocenter.Name;

    // ピンを地図に追加
    L.marker([lat, lon]).addTo(map)
      .bindPopup(`<b>地震情報</b><br>${name}<br>マグニチュード: ${mag}`)
      .openPopup();
  }
}

// ページ読み込み時に実行
loadEarthquakeData();

// 5分ごとに最新情報を更新
setInterval(loadEarthquakeData, 300000);

// --- 津波警報の取得 ---
async function loadTsunamiInfo() {
  const response = await fetch('https://www.jma.go.jp/bosai/tsunami/data/list.json');
  const data = await response.json();

  if (data && data.length > 0) {
    const latest = data[0];
    alert(`🌊 津波警報: ${latest.Title}`);
  }
}

// 10分ごとに確認
setInterval(loadTsunamiInfo, 600000);

// --- 避難所データ（例） ---
const shelters = [
  { name: "吉田町総合体育館", lat: 34.7687907, lng: 138.2544665, capacity: 1870 },
  { name: "住吉小学校", lat: 34.75928775, lng: 138.25393645, capacity: 2620 },
  { name: "吉田中学校", lat: 34.76935, lng: 138.25329, capacity: 1687 },
  { name: "中央小", lat: 34.77104218, lng: 138.25966353, capacity: 2338 }
];

// --- マーカーを地図に追加 ---
shelters.forEach(shelter => {
  const marker = L.marker([shelter.lat, shelter.lng]).addTo(map);
  marker.bindPopup(`
    <b>${shelter.name}</b><br>
    収容人数: ${shelter.capacity}人
  `);
});
