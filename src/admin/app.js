import authLogo from "./extensions/dhruniIcon.png";

const config = {
  auth: { authLogo },
  locales: ["en"],
  head: { favicon: authLogo },
  menu: { menuLogo: authLogo },
  tutorials: false,
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

const bootstrap = () => {};

export default {
  config,
  bootstrap,
};
