import { submitStory as addStory } from "../../data/story-api";
import L from "leaflet";

class AddPresenter {
  constructor(elements) {
    this.elements = elements;
    this.stream = null;
    this.lat = null;
    this.lon = null;
    this.map = null;
    this.marker = null;
  }

  initMap() {
    const el = this.elements;

    this.map = L.map(el.mapContainer).setView([-7.797068, 110.370529], 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(this.map);

    this.marker = L.marker([0, 0], { draggable: true }).addTo(this.map);

    this.map.on("click", (e) => {
      const { lat, lng } = e.latlng;
      this.setMarker(lat, lng);
    });

    this.marker.on("drag", () => {
      const pos = this.marker.getLatLng();
      this.setMarker(pos.lat, pos.lng);
    });
  }

  setMarker(lat, lon) {
    const el = this.elements;

    this.lat = lat;
    this.lon = lon;
    this.marker.setLatLng([lat, lon]);
    el.latInput.value = lat;
    el.lonInput.value = lon;
    el.locationCoordinates.textContent = `Koordinat: ${lat.toFixed(6)}, ${lon.toFixed(6)}`;
  }

  handleFileInput(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.elements.photoResult.src = e.target.result;
        this.elements.photoResult.style.display = "block";
      };
      reader.readAsDataURL(file);
    }
  }

  useMyLocation() {
    if (!navigator.geolocation) {
      alert("Geolocation tidak didukung browser ini.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        this.setMarker(latitude, longitude);
        this.map.setView([latitude, longitude], 15);
      },
      (error) => {
        alert("Gagal mendapatkan lokasi: " + error.message);
      }
    );
  }

  async submitForm(e) {
    e.preventDefault();
    const el = this.elements;

    const description = el.description.value;
    const imageDataUrl = el.photoResult.src;

    if (!imageDataUrl || !this.lat || !this.lon) {
      alert("Pastikan sudah mengambil gambar dan lokasi.");
      return;
    }

    try {
      const blob = await (await fetch(imageDataUrl)).blob();
      const formData = new FormData();
      formData.append("description", description);
      formData.append("photo", blob, "story.jpg");
      formData.append("lat", this.lat);
      formData.append("lon", this.lon);

      const token = localStorage.getItem("token");
      const result = await addStory(formData, token);
      alert(result.message);

      if (!result.error) {
        window.location.hash = "/";
      }
    } catch (err) {
      alert("Terjadi kesalahan saat mengirim data: " + err.message);
    }
  }
}

export default AddPresenter;
