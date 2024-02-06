import authLogo from "./extensions/dhruniIcon.png";

const config = {
  auth: { logo: authLogo },
  locales: ["en"],
  head: { favicon: authLogo },
  menu: { logo: authLogo },
  tutorials: false,
  translations: {
    en: {
      "Auth.form.email.label": "test",
      "app.components.LeftMenu.navbrand.title": "Dhruni Realty 2",
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
