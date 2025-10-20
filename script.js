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

// --- 避難場所データ（津波避難タワーA〜R + ホテルプレストンYOSHIDA）---
const shelters = [
  { name_ja: "津波避難タワーA", name_en: "Tsunami Evacuation Tower A", address_ja: "住吉4403-6地先", address_en: "Near 4403-6 Sumiyoshi", lat: 34.746319, lng: 138.247944, capacity: 500, source: "町PDF／Navitime・Yahoo", type: "tower" },
  { name_ja: "津波避難タワーB", name_en: "Tsunami Evacuation Tower B", address_ja: "住吉3254-6地先", address_en: "Near 3254-6 Sumiyoshi", lat: 34.750227, lng: 138.251965, capacity: 500, source: "町PDF／Navitime", type: "tower" },
  { name_ja: "津波避難タワーC", name_en: "Tsunami Evacuation Tower C", address_ja: "住吉4805-2地先", address_en: "Near 4805-2 Sumiyoshi", lat: 34.751166, lng: 138.256964, capacity: 1100, source: "町PDF／Navitime", type: "tower" },
  { name_ja: "津波避難タワーD", name_en: "Tsunami Evacuation Tower D", address_ja: "住吉3484-1", address_en: "3484-1 Sumiyoshi", lat: 34.754471, lng: 138.259400, capacity: 900, source: "町PDF／Navitime", type: "tower" },
  { name_ja: "津波避難タワーE", name_en: "Tsunami Evacuation Tower E", address_ja: "住吉5228-1地先", address_en: "Near 5228-1 Sumiyoshi", lat: 34.7577, lng: 138.2645, capacity: 900, source: "町PDF／位置図", type: "tower" },
  { name_ja: "津波避難タワーF", name_en: "Tsunami Evacuation Tower F", address_ja: "住吉3719-1地先", address_en: "Near 3719-1 Sumiyoshi", lat: 34.7562, lng: 138.2578, capacity: 500, source: "町PDF／Navitime", type: "tower" },
  { name_ja: "津波避難タワーG", name_en: "Tsunami Evacuation Tower G", address_ja: "川尻2557-11", address_en: "2557-11 Kawashiri", lat: 34.760645, lng: 138.271097, capacity: 700, source: "町PDF／Navitime／Yahoo", type: "tower" },
  { name_ja: "津波避難タワーH", name_en: "Tsunami Evacuation Tower H", address_ja: "川尻2918", address_en: "2918 Kawashiri", lat: 34.7622, lng: 138.2735, capacity: 800, source: "町PDF（人数）", type: "tower" },
  { name_ja: "レック㈱ 吉田防災倉庫", name_en: "Rek Co. Yoshida Disaster Warehouse", address_ja: "川尻3308", address_en: "3308 Kawashiri", lat: 34.7638, lng: 138.2750, capacity: 1000, source: "町PDF／位置図", type: "tower" },
  { name_ja: "津波避難タワーJ", name_en: "Tsunami Evacuation Tower J", address_ja: "住吉3365-1", address_en: "3365-1 Sumiyoshi", lat: 34.7539, lng: 138.2502, capacity: 800, source: "町PDF／Navitime", type: "tower" },
  { name_ja: "津波避難タワーK", name_en: "Tsunami Evacuation Tower K", address_ja: "住吉2868-3地先", address_en: "Near 2868-3 Sumiyoshi", lat: 34.755232, lng: 138.254129, capacity: 1200, source: "町PDF／Navitime／bosai-map", type: "tower" },
  { name_ja: "津波避難タワーL", name_en: "Tsunami Evacuation Tower L", address_ja: "住吉5525-1地先", address_en: "Near 5525-1 Sumiyoshi", lat: 34.7588, lng: 138.2662, capacity: 800, source: "町PDF／位置図", type: "tower" },
  { name_ja: "津波避難タワーM", name_en: "Tsunami Evacuation Tower M", address_ja: "片岡1697-1", address_en: "1697-1 Kataoka", lat: 34.7701, lng: 138.2615, capacity: 1000, source: "町PDF／位置図", type: "tower" },
  { name_ja: "川尻会館（2階・屋上）", name_en: "Kawashiri Community Hall (2F & Roof)", address_ja: "川尻1623", address_en: "1623 Kawashiri", lat: 34.7613, lng: 138.2693, capacity: 1600, source: "町PDF／位置図", type: "tower" },
  { name_ja: "津波避難タワーO", name_en: "Tsunami Evacuation Tower O", address_ja: "川尻2743-1", address_en: "2743-1 Kawashiri", lat: 34.7627, lng: 138.2724, capacity: 500, source: "町PDF／位置図", type: "tower" },
  { name_ja: "津波避難タワーP", name_en: "Tsunami Evacuation Tower P", address_ja: "住吉2649-2", address_en: "2649-2 Sumiyoshi", lat: 34.753871, lng: 138.248147, capacity: 1300, source: "町PDF／Navitime／Yahoo", type: "tower" },
  { name_ja: "吉田町立住吉小学校（屋上）", name_en: "Sumiyoshi Elementary School (Roof Shelter)", address_ja: "住吉2223", address_en: "2223 Sumiyoshi", lat: 34.7695107, lng: 138.2530098, capacity: 1560, source: "町PDF／地図データ", type: "shelter" },
  { name_ja: "津波避難タワーR", name_en: "Tsunami Evacuation Tower R", address_ja: "住吉2143-1", address_en: "2143-1 Sumiyoshi", lat: 34.7680, lng: 138.2525, capacity: 800, source: "町PDF／位置図", type: "tower" },
  { name_ja: "ホテルプレストンYOSHIDA（避難場所：屋上・非常階段）", name_en: "Hotel Preston YOSHIDA (Evacuation: Roof & Stairs)", address_ja: "住吉580", address_en: "580 Sumiyoshi", lat: 34.765695, lng: 138.251411, capacity: 517, source: "町PDF／ホテル公式／Navitime", type: "shelter" }
];

shelters.forEach(shelter => {
  const iconColor = shelter.type === "tower" ? "blue" : "green";
  const icon = L.icon({
    iconUrl: `https://maps.google.com/mapfiles/ms/icons/${iconColor}-dot.png`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -28]
  });

  const marker = L.marker([shelter.lat, shelter.lng], { icon }).addTo(map);
  marker.bindPopup(`
    <b>${shelter.name_ja}</b><br>
    <i>${shelter.name_en}</i><br>
    📍 ${shelter.address_ja}<br>
    <i>${shelter.address_en}</i><br><br>
    👥 収容人数: ${shelter.capacity.toLocaleString()}人<br>
    Capacity: ${shelter.capacity.toLocaleString()} people<br><br>
    🔗 出典 / Source: ${shelter.source}
  `);
});
