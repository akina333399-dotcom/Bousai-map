// --- 南海トラフ想定津波マップ ---
// 吉田町中心を表示
const map = L.map("map").setView([34.746, 138.255], 13);

// --- OpenStreetMap タイル ---
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 18,
  attribution: "© OpenStreetMap contributors"
}).addTo(map);

// --- 浸水深に応じた色設定（吉田町公式に準拠） ---
function getColor(depth) {
  return depth >= 8   ? '#ff0000' :  // 赤
         depth >= 7   ? '#ff5500' :  // 濃オレンジ
         depth >= 6   ? '#ffaa00' :  // オレンジ
         depth >= 5   ? '#ffdd00' :  // 黄オレンジ
         depth >= 4   ? '#88cc00' :  // 黄緑
         depth >= 3   ? '#00ccff' :  // 水色
         depth >= 2   ? '#0099ff' :  // 青
         depth >= 1   ? '#0066cc' :  // 濃青
         depth >= 0   ? '#003399' :  // 深青
                        '#ffffff';   // データなし
}

// --- 仮データ（将来的にGeoJSONに差し替え可能） ---
const sampleAreas = [
  { name: "住吉地区", depth: 8, lat: 34.7695, lng: 138.2530 },
  { name: "住吉東部", depth: 6, lat: 34.7656, lng: 138.2600 },
  { name: "片岡地区", depth: 3, lat: 34.7520, lng: 138.2580 },
  { name: "川尻地区", depth: 2, lat: 34.7460, lng: 138.2470 }
];

// --- 地図上に色付き円で表示（テスト用） ---
sampleAreas.forEach(a => {
  L.circleMarker([a.lat, a.lng], {
    radius: 25,
    fillColor: getColor(a.depth),
    color: "#555",
    weight: 1,
    fillOpacity: 0.6
  }).addTo(map)
    .bindPopup(`<b>${a.name}</b><br>想定浸水深：約${a.depth} m`);
});

// --- 凡例を追加 ---
const legend = L.control({ position: "bottomright" });
legend.onAdd = function () {
  const div = L.DomUtil.create("div", "info legend");
  const grades = [0,1,2,3,4,5,6,7,8];
  div.innerHTML = "<b>想定浸水深 (m)</b><br>";
  for (let i = 0; i < grades.length; i++) {
    const from = grades[i];
    const to   = grades[i + 1];
    div.innerHTML +=
      `<i style="background:${getColor(from + 0.1)}; width:18px; height:18px; display:inline-block; margin-right:5px;"></i> ` +
      `${from}${to ? "〜" + to : "以上"}<br>`;
  }
  return div;
};
legend.addTo(map);
