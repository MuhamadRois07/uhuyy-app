import BookmarkPresenter from "./bookmark-presenter";
import Database from "../../data/database";

class BookmarkPage {
  async render() {
  return `
    <section class="bookmark-page container">
      <h2 class="section-title">Daftar Cerita Tersimpan</h2>
      <div id="loading" style="display:none;"></div>
      <div id="message"></div>
      <div id="saved-story-list" class="story-list"></div>
    </section>
  `;
}

  async afterRender() {
    this._presenter = new BookmarkPresenter(this);

    this.showLoading();
    await this._presenter.loadSavedStories();
    this.hideLoading();
  }

  showLoading() {
    const loadingEl = document.getElementById("loading");
    loadingEl.innerHTML = `<div class="spinner"></div>`;
    loadingEl.style.display = "flex";
  }

  hideLoading() {
    const loadingEl = document.getElementById("loading");
    loadingEl.style.display = "none";
    loadingEl.innerHTML = "";
  }

  async renderSavedStories(stories) {
    const container = document.getElementById("saved-story-list");
    const messageEl = document.getElementById("message");
    messageEl.innerHTML = "";

    if (!stories || stories.length === 0) {
      container.innerHTML = "<p>Tidak ada cerita yang disimpan.</p>";
      return;
    }

    const content = stories
  .map((story) => {
    return `
      <div class="story">
        <img src="${story.photoUrl}" alt="${story.description}">
        <div class="story-content">
          <p><strong>${story.name}</strong></p>
          <p>${story.description}</p>
          <button class="remove-saved-story-btn" data-id="${story.id}">Hapus</button>
        </div>
      </div>
    `;
  })
  .join("");


    container.innerHTML = content;

    this._initRemoveButtons();
  }

  _initRemoveButtons() {
    const removeButtons = document.querySelectorAll(".remove-saved-story-btn");

    removeButtons.forEach((btn) => {
      const id = btn.dataset.id;
      btn.addEventListener("click", async () => {
        await Database.deleteStory(id);
        alert("Cerita berhasil dihapus dari bookmark.");
        this.showLoading();
        await this._presenter.loadSavedStories();
        this.hideLoading();
      });
    });
  }

  showError(message) {
    const messageEl = document.getElementById("message");
    messageEl.innerHTML = `<p class="error">${message}</p>`;
  }
}

export default BookmarkPage;
