import AddPresenter from "./add-presenter";

class AddPage {
  constructor() {
    this._presenter = null;
  }

  async render() {
    return `
      <h1>Tambah Cerita</h1>

      <section class="add-story">
        <form id="add-story-form">
          <label for="description">Deskripsi</label>
          <textarea id="description" required></textarea>

          <label for="open-camera">Gambar</label>
          <div class="camera-buttons">
            <button type="button" id="open-camera">Buka Kamera</button>
            <button type="button" id="choose-image-btn">Pilih Gambar</button>
            <input type="file" id="file-input" class="input-image" accept="image/*" style="display: none;" />
          </div>

          <video id="camera-preview" autoplay playsinline style="display:none; width:100%; max-width:300px;"></video>
          <button type="button" id="take-photo" style="display:none;">Ambil Gambar</button>
          <canvas id="photo-canvas" style="display:none;"></canvas>
          <img id="photo-result" src="" alt="Hasil Foto" style="display:none; width:100%; max-width:300px;" />

          <label>Lokasi</label>
          <div id="map" style="height: 300px;"></div>
          <div id="location-coordinates" style="margin-top: 10px;">Koordinat: -</div>
          <input type="hidden" id="lat">
          <input type="hidden" id="lon">

          <button type="button" id="use-my-location">Lokasi Saya</button>
          <button type="submit">Kirim</button>
          <button type="button" id="back-home">Kembali</button>
        </form>
      </section>
    `;
  }

  async afterRender() {
    const elements = {
      form: document.getElementById("add-story-form"),
      description: document.getElementById("description"),
      openCameraBtn: document.getElementById("open-camera"),
      chooseImageBtn: document.getElementById("choose-image-btn"),
      fileInput: document.getElementById("file-input"),
      takePhotoBtn: document.getElementById("take-photo"),
      cameraPreview: document.getElementById("camera-preview"),
      photoCanvas: document.getElementById("photo-canvas"),
      photoResult: document.getElementById("photo-result"),
      mapContainer: document.getElementById("map"),
      useMyLocationBtn: document.getElementById("use-my-location"),
      locationCoordinates: document.getElementById("location-coordinates"),
      latInput: document.getElementById("lat"),
      lonInput: document.getElementById("lon"),
      backHomeBtn: document.getElementById("back-home"),
    };

    this._presenter = new AddPresenter(elements);
    this._presenter.initMap();

    elements.chooseImageBtn.addEventListener("click", () => {
      elements.fileInput.click();
    });

    elements.fileInput.addEventListener("change", (e) => {
      this._presenter.handleFileInput(e);
    });

    elements.openCameraBtn.addEventListener("click", () => {
      this._toggleCamera();
    });

    elements.takePhotoBtn.addEventListener("click", () => {
      this._takePhoto();
    });

    elements.useMyLocationBtn.addEventListener("click", () => {
      this._presenter.useMyLocation();
    });

    elements.form.addEventListener("submit", (e) => {
      this._presenter.submitForm(e);
    });

    elements.backHomeBtn.addEventListener("click", () => {
      window.location.hash = "/";
    });

    window.addEventListener("hashchange", () => {
      this._stopCamera();
    });
  }

  _toggleCamera() {
    const el = this._presenter.elements;

    if (!this._presenter.stream) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          this._presenter.stream = stream;
          el.cameraPreview.srcObject = stream;
          el.cameraPreview.style.display = "block";
          el.takePhotoBtn.style.display = "inline-block";
          el.openCameraBtn.textContent = "Tutup Kamera";
        })
        .catch((err) => alert("Gagal membuka kamera: " + err.message));
    } else {
      this._stopCamera();
    }
  }

  _stopCamera() {
    const el = this._presenter.elements;

    if (this._presenter.stream) {
      this._presenter.stream.getTracks().forEach((track) => track.stop());
      this._presenter.stream = null;
    }

    el.cameraPreview.style.display = "none";
    el.takePhotoBtn.style.display = "none";
    el.openCameraBtn.textContent = "Buka Kamera";
  }

  _takePhoto() {
    const el = this._presenter.elements;
    const context = el.photoCanvas.getContext("2d");

    el.photoCanvas.width = el.cameraPreview.videoWidth;
    el.photoCanvas.height = el.cameraPreview.videoHeight;
    context.drawImage(el.cameraPreview, 0, 0, el.photoCanvas.width, el.photoCanvas.height);

    el.photoResult.src = el.photoCanvas.toDataURL("image/jpeg");
    el.photoResult.style.display = "block";

    this._stopCamera();
  }
}

export default AddPage;
