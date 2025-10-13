// --- 地図を表示する設定 ---
const map = L.map('map').setView([34.746, 138.255], 13); // 吉田町の中心付近

// --- OpenStreetMapを表示するタイルレイヤーを設定 ---
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// --- 避難所データ（例） ---
const shelters = [
  { name: "吉田町総合体育館", lat: 34.744, lng: 138.255, capacity: 500 },
  { name: "住吉小学校", lat: 34.751, lng: 138.262, capacity: 300 },
  { name: "吉田中学校", lat: 34.739, lng: 138.247, capacity: 450 }
];

// --- マーカーを地図に追加 ---
shelters.forEach(shelter => {
  const marker = L.marker([shelter.lat, shelter.lng]).addTo(map);
  marker.bindPopup(`
    <b>${shelter.name}</b><br>
    収容人数: ${shelter.capacity}人
  `);
});
