import authLogo from "./extensions/dhruniIcon.png";

const config = {
  auth: { authLogo },
  locales: ["en"],
  head: { favicon: authLogo },
  menu: { menuLogo: authLogo },
  tutorials: false,
  notifications: { releases: false },
  serveAdminPanel: false,
  translations: {
    en: {
      "app.components.LeftMenu.navbrand.title": "Dhruni Realty",
      "app.components.LeftMenu.navbrand.workplace": "Development",
      "Auth.form.welcome.title": "Welcome to Dhruni Realty",
      "Auth.form.welcome.subtitle": "Login to your account",
      "Settings.profile.form.section.experience.interfaceLanguageHelp":
        "Preference changes will apply only to you.",
    },
  },
};

const bootstrap = (app) => {
  console.log(app);
};

export default {
  config,
  bootstrap,
};
