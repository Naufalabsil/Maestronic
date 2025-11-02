let mapOptions = {
  center: [-6.91773, 107.61091], // Titik awal (Bandung)
  zoom: 13
};

// Inisialisasi peta
let map = L.map('map', mapOptions);

// 🔹 API keys
const MAPTILER_KEY = "qSkAuKyg80LYGXkzh5Cw";
const ORS_KEY = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjMxMTkwNTQ3MzVkODQxZmJiY2ZjMTU2YzJjYmZmYmNmIiwiaCI6Im11cm11cjY0In0=";

// 🔹 Ganti layer dari OSM ke MapTiler
L.tileLayer(`https://api.maptiler.com/maps/streets-v4/{z}/{x}/{y}.png?key=${MAPTILER_KEY}`, {
  attribution: '&copy; <a href="https://www.maptiler.com/">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  tileSize: 512,
  zoomOffset: -1,
  crossOrigin: true
}).addTo(map);

// 🔹 Marker lokasi resto (tenant)
let restoCoords = [-6.91773, 107.61091];
let restoMarker = L.marker(restoCoords)
  .addTo(map)
  .bindPopup("🍜 Bakso Maestronic<br>Kuah sapi gurih, rasa mantap!");

// 🔹 Layer rute (biar bisa dihapus pas update)
let routeLayer = null;

// 🔹 Fungsi buat ambil dan gambar rute pakai ORS
async function drawRoute(userLat, userLon) {
  const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${ORS_KEY}&start=${userLon},${userLat}&end=${restoCoords[1]},${restoCoords[0]}`;
  
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Gagal fetch data dari ORS");

    const data = await res.json();
    if (!data.routes || !data.routes[0]) {
      alert("⚠️ Tidak ditemukan rute antara lokasi kamu dan resto!");
      return;
    }

    const route = data.routes[0];
    const coords = route.geometry.coordinates.map(c => [c[1], c[0]]); // lon,lat → lat,lon
    const distance = route.summary && route.summary.distance ? (route.summary.distance / 1000).toFixed(2) : 0;
    const duration = route.summary && route.summary.duration ? Math.round(route.summary.duration / 60) : 0;

    // update div jarak & menit
    document.getElementById("distance").textContent = distance;
    document.getElementById("duration").textContent = duration;

    // update popup resto
    restoMarker.bindPopup(
      `🍜 Bakso Maestronic<br>
      Kuah sapi gurih, rasa mantap!<br>
      🚗 Jarak: ${distance} km<br>
      ⏱️ Waktu tempuh: ${duration} menit`
    ).openPopup();

    // gambar rute
    if (routeLayer) map.removeLayer(routeLayer);
    routeLayer = L.polyline(coords, {
      color: 'blue',
      weight: 5,
      smoothFactor: 2,
      lineJoin: 'round'
    }).addTo(map);

    map.fitBounds(routeLayer.getBounds());
  } catch (err) {
    console.error("Gagal ambil rute:", err);
    alert("❌ Gagal mendapatkan rute. Coba ulangi.");
  }
}


// 🔹 Fungsi untuk deteksi lokasi pengguna
function detectLocation() {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        let lat = pos.coords.latitude;
        let lon = pos.coords.longitude;

        // Marker lokasi user
        let userMarker = L.marker([lat, lon]).addTo(map);
        userMarker.bindPopup("📍 Lokasi Saya").openPopup();

        // Fokus ke lokasi user
        map.setView([lat, lon], 15);

        // Gambar rute ke resto
        drawRoute(lat, lon);
      },
      (err) => {
        console.error("Gagal mendapatkan lokasi:", err.message);
        alert("❌ Tidak bisa mendeteksi lokasi. Coba aktifkan GPS dan ulangi.");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  } else {
    alert("Browser kamu tidak mendukung fitur GPS 😢");
  }
}

// Jalankan otomatis saat halaman dibuka
detectLocation();

// Tombol retry manual (opsional)
let btn = L.control({ position: 'topleft' });
btn.onAdd = function() {
  let div = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
  div.innerHTML = 'Lokasi';
  div.style.cursor = 'pointer';
  div.style.fontSize = '22px';
  div.style.backgroundColor = '#8f2626';
  div.style.color = '#fff';
  div.style.padding = '4px 8px';
  div.title = 'Deteksi lokasi ulang';
  div.onclick = detectLocation;
  return div;
};
btn.addTo(map);
