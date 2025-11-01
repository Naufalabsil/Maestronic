let mapOptions = {
  center: [-6.91773, 107.61091], // Titik awal (Bandung)
  zoom: 13
};

// Inisialisasi peta
let map = L.map('map', mapOptions);

// Tambah layer OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Tambah marker lokasi resto
let restoMarker = L.marker([-6.91773, 107.61091])
  .addTo(map)
  .bindPopup("🍜 Bakso Maestronic<br>Kuah sapi gurih, rasa mantap!");

// Fungsi untuk deteksi lokasi pengguna
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
      },
      (err) => {
        console.error("Gagal mendapatkan lokasi:", err.message);
        alert("❌ Tidak bisa mendeteksi lokasi. Coba aktifkan GPS dan ulangi.");
      },
      {
        enableHighAccuracy: true, // lebih akurat pakai GPS
        timeout: 10000,           // tunggu max 10 detik
        maximumAge: 0             // jangan pakai cache lokasi lama
      }
    );
  } else {
    alert("Browser kamu tidak mendukung fitur GPS 😢");
  }
}

// Jalankan otomatis saat halaman dibuka
detectLocation();

// Tombol retry manual (opsional)
let btn = L.control({ position: 'topleft'});
btn.onAdd = function() {
  let div = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
  div.innerHTML = 'Lokasi' ;
  div.style.cursor = 'pointer';
  div.style.fontSize = '22px';
  div.style.backgroundColor = '#8f2626';
  div.style.padding = '4px 8px';
  div.title = 'Deteksi lokasi ulang';
  div.onclick = detectLocation;
  return div;
};
btn.addTo(map);
