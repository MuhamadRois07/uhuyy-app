import { fetchStories as getStories } from "../../data/story-api";
import Database from "../../data/database";

class HomePresenter {
  constructor(view) {
    this._view = view;
  }

  async showStories() {
    try {
      this._view.showLoading();

      const token = localStorage.getItem("token");
      if (!token) {
        window.location.hash = "#/login";
        return;
      }

      const { stories, message, error } = await getStories(token);
      console.log("API Response:", { stories, message, error });

      if (error) {
        throw new Error(message || "Gagal memuat data cerita");
      }

      if (!stories || stories.length === 0) {
        this._view.showEmptyState("Belum ada cerita yang tersedia");
        return;
      }

      await this._view.renderStories(stories);
      
    } catch (error) {
      console.error("Error in HomePresenter:", error);
      this._view.showError(error.message || "Terjadi kesalahan saat memuat cerita");
      
      if (error.message.includes("401")) {
        localStorage.removeItem("token");
        window.location.hash = "#/login";
      }
    } finally {
      this._view.hideLoading();
    }
  }

  async saveStoryToBookmark(story) {
    try {
      await Database.putStory(story);
      alert('Cerita berhasil disimpan!');
    } catch (error) {
      console.error('Gagal menyimpan cerita:', error);
      alert('Gagal menyimpan cerita: ' + error.message);
    }
  }
}

export default HomePresenter;