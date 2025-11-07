// --- 吉田町を中心に設定 ---
const map = L.map('map').setView([34.746, 138.255], 13);

// --- OpenStreetMap タイル ---
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// --- 津波高さデータ（例：想定値） ---
// 値は仮の例（静岡県防災資料などのイメージ）
// 実際のデータが入手できれば差し替え可能です。
const tsunamiAreas = [
  { lat: 34.743, lng: 138.247, height: 10 },
  { lat: 34.748, lng: 138.255, height: 8 },
  { lat: 34.754, lng: 138.262, height: 6 },
  { lat: 34.760, lng: 138.271, height: 4 },
  { lat: 34.768, lng: 138.252, height: 2 }
];

// --- 色分け関数（高さに応じて色を変える） ---
function getColor(height) {
  return height >= 10 ? '#ff0000' :
         height >= 8  ? '#ff6600' :
         height >= 6  ? '#ffcc00' :
         height >= 4  ? '#66cc00' :
         height >= 2  ? '#00ccff' :
                        '#0099ff';
}

// --- 円で津波高さを表示 ---
tsunamiAreas.forEach(area => {
  L.circleMarker([area.lat, area.lng], {
    radius: 25,
    fillColor: getColor(area.height),
    color: "#000",
    weight: 1,
    fillOpacity: 0.5
  })
  .addTo(map)
  .bindPopup(`🌊 想定津波高：約${area.height} m`);
});

// --- 凡例（レジェンド）を追加 ---
const legend = L.control({ position: "bottomright" });
legend.onAdd = function () {
  const div = L.DomUtil.create("div", "info legend");
  const grades = [0, 2, 4, 6, 8, 10];
  div.innerHTML = "<b>想定津波高 (m)</b><br>";
  for (let i = 0; i < grades.length; i++) {
    div.innerHTML +=
      `<i style="background:${getColor(grades[i] + 1)}; width:18px; height:18px; display:inline-block; margin-right:5px;"></i> 
      ${grades[i]}${grades[i + 1] ? "〜" + grades[i + 1] : "以上"}<br>`;
  }
  return div;
};
legend.addTo(map);
