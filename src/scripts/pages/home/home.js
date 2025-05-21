import HomePresenter from "./home-presenter";
import StoryMap from "../../utils/map";
import Database from "../../data/database";

class HomePage {
  constructor() {
    this._map = null;
    this._markers = [];
    this.storyMap = null;
  }

  async render() {
    return `
      <div id="loading" class="loading" style="display:none;">
        <div class="spinner"></div>
        <p>Memuat data...</p>
      </div>

      <section class="home">
        <div id="map-container" style="height: 400px; margin-top: 60px;"></div>
        <h1>Daftar Cerita</h1>
        <div id="story-list"></div>
        <!-- Tambahkan keterangan dan tombol untuk menambah cerita -->
        <div id="add-story-section">
          <p>Jika Anda memiliki cerita, Anda dapat menambahkannya dengan menekan tombol berikut:</p>
          <button id="add-story-btn">Tambah Cerita</button>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this.initMap();
    const presenter = new HomePresenter(this);
    await presenter.showStories();
    this._initAddStoryButton();
  }

  initMap() {
    this.storyMap = new StoryMap("map-container");
    this._map = this.storyMap.getMapInstance();
    this._markers = [];
  }

  async renderStories(stories) {
    const container = document.getElementById("story-list");
    const content = await Promise.all(
      stories.map(async (story) => {
        const isSaved = await Database.getStory(story.id);

        return `
      <div class="story" data-id="${story.id}" data-lat="${
          story.lat || ""
        }" data-lon="${story.lon || ""}">
        <img src="${story.photoUrl}" alt="${story.description}">
        <p>${story.name}</p>
        <p>${story.description}</p>
        ${
          story.lat && story.lon
            ? `<small class="location">
              <i class="fas fa-map-marker-alt"></i> Lokasi ${story.lat.toFixed(
                4
              )}, ${story.lon.toFixed(4)}
            </small>`
            : ""
        }
        <small>Dibuat Pada: ${new Date(story.createdAt).toLocaleString(
          "id-ID"
        )}</small>
        <button class="${
          isSaved ? "remove-story-btn" : "save-story-btn"
        }" data-id="${story.id}">
          ${isSaved ? "Hapus" : "Simpan"}
        </button>
      </div>
    `;
      })
    );

    container.innerHTML = content.join("");

    this.addStoryMarkers(stories);
    this._initSaveButtons(stories);
  }

  addStoryMarkers(stories) {
    this.storyMap.addMarkers(stories);
    this._markers = this.storyMap.markers;
  }

  showLoading() {
    document.getElementById("loading").style.display = "flex";
  }

  hideLoading() {
    document.getElementById("loading").style.display = "none";
  }

  _initSaveButtons(stories) {
    const saveButtons = document.querySelectorAll(".save-story-btn");
    const removeButtons = document.querySelectorAll(".remove-story-btn");

    saveButtons.forEach((btn) => {
      const id = btn.dataset.id;
      const story = stories.find((s) => s.id === id);
      btn.addEventListener("click", async () => {
        const presenter = new HomePresenter(this);
        await presenter.saveStoryToBookmark(story);
        await this.renderStories(stories);
      });
    });

    removeButtons.forEach((btn) => {
      const id = btn.dataset.id;
      btn.addEventListener("click", async () => {
        await Database.deleteStory(id);
        alert("Cerita berhasil dihapus!");
        await this.renderStories(stories);
      });
    });
  }

  _initAddStoryButton() {
    document
      .getElementById("add-story-btn")
      .addEventListener("click", () => (window.location.hash = "#/add"));
  }
}

export default HomePage;
