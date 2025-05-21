import HomePage from "../pages/home/home";
import AddPage from "../pages/add/add";
import LoginPage from "../pages/auth/login/login";
import RegisterPage from "../pages/auth/register/register";
import BookmarkPage from "../pages/bookmark/bookmark";

const routes = {
  "/": {
    page: new HomePage(),
    requiresAuth: true,
  },
  "/add": {
    page: new AddPage(),
    requiresAuth: true,
  },
  "/save-story": {
    page: new BookmarkPage(),
    requiresAuth: true,
  },
  "/login": {
    page: new LoginPage(),
    requiresAuth: false,
  },
  "/register": {
    page: new RegisterPage(),
    requiresAuth: false,
  },
};

export default routes;
