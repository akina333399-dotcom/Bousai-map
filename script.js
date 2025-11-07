
// --- 避難場所データ（津波避難タワーA〜R + ホテルプレストン）---
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
  { name_ja: "津波避難タワーR", name_en: "Tsunami Evacuation Tower R", address_ja: "住吉2143-1", address_en: "2143-1 Sumiyoshi", lat: 34.7680, lng: 138.2525, capacity: 800, source: "町PDF／位置図", type: "tower" },
  { name_ja: "ホテルプレストンYOSHIDA（避難場所）", name_en: "Hotel Preston YOSHIDA (Evacuation Site)", address_ja: "住吉580", address_en: "580 Sumiyoshi", lat: 34.765695, lng: 138.251411, capacity: 517, source: "町PDF／ホテル公式／Navitime", type: "shelter" }
];

// --- 地図を吉田町中心に作成 ---
const map = L.map('map', {
  center: [34.746, 138.255],
  zoom: 14,
  zoomControl: true
});

// --- OpenStreetMapタイルを追加 ---
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// --- 避難所マーカーを追加 ---
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

// --- 現在地を取得 ---
if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      // 現在地マーカーを追加
      const userMarker = L.marker([lat, lng], {
        title: "あなたの現在地 / Your location"
      }).addTo(map);
      userMarker.bindPopup("📍あなたの現在地 / Your location").openPopup();

      // 最も近い避難所を計算
      let nearest = null;
      let minDistance = Infinity;

      shelters.forEach(shelter => {
        const distance = map.distance([lat, lng], [shelter.lat, shelter.lng]);
        if (distance < minDistance) {
          minDistance = distance;
          nearest = shelter;
        }
      });

      // 結果を線とアラートで表示
      if (nearest) {
        L.polyline([[lat, lng], [nearest.lat, nearest.lng]], {
          color: "blue",
          dashArray: "5,10"
        }).addTo(map);

        alert(`最も近い避難所は「${nearest.name_ja}」です。\nThe nearest shelter is ${nearest.name_en}.`);
      }
    },
    (error) => {
      alert("現在地を取得できませんでした / Unable to access your location.");
    }
  );
} else {
  alert("このブラウザでは現在地機能が使えません / Geolocation not supported.");
}
