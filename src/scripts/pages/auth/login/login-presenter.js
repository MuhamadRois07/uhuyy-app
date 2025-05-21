import { authenticateUser as login } from "../../../data/story-api";

class LoginPresenter {
  constructor(view) {
    this._view = view;
  }

  async handleLogin({ email, password }) {
    if (password.length < 8) {
      this._view.showError("Password minimal 8 karakter");
      return;
    }
  
    try {
      const result = await login({ email, password });
  
      if (result.failed) {
        this._view.showError(result.message || "Email atau password salah");
        return;
      }
  
      if (!result.authResult || !result.authResult.token) {
        throw new Error("Token tidak ditemukan dalam response");
      }
  
      localStorage.setItem("token", result.authResult.token);
      window.dispatchEvent(
        new CustomEvent("auth-change", {
          detail: { isLoggedIn: true },
        }),
      );
      window.location.hash = "#/";
    } catch (error) {
      this._view.showError(error.message || "Terjadi kesalahan saat login");
    }
  }
}

export default LoginPresenter;
