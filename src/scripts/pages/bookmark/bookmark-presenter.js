import Database from "../../data/database";

class BookmarkPresenter {
  constructor(view) {
    this._view = view;
  }

  async loadSavedStories() {
    try {
      const savedStories = await Database.getAllStories();
      await this._view.renderSavedStories(savedStories);
    } catch (error) {
      console.error("Gagal memuat cerita tersimpan:", error);
      this._view.showError("Gagal memuat cerita tersimpan.");
    }
  }
}

export default BookmarkPresenter;
