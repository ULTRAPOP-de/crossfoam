import { setupVersion, setupFooter } from "./nav";

const translateInstall = [
  "howToTitle",
];

translateInstall.forEach((t) => {
  // document.querySelector("#" + t).innerHTML = browser.i18n.getMessage(t);
});

setupVersion();
setupFooter();
