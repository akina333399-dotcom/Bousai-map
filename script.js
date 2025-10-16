// --- 地図を表示する設定 ---
const map = L.map('map').setView([34.746, 138.255], 13); // 吉田町の中心付近

// --- OpenStreetMapを表示するタイルレイヤーを設定 ---
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// --- 避難所データ（例） ---
const shelters = [
  { name: "吉田町総合体育館", lat: 34.7687907, lng: 138.2544665, capacity: 1870 },
  { name: "住吉小学校", lat: 34.75928775, lng: 138.25393645, capacity: 2620 },
  { name: "吉田中学校", lat: 34.76935, lng: 138.25329, capacity: 1687 }
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
