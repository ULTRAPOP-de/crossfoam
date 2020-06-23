import { setupVersion, setupFooter } from "./nav";
import * as cfData from "@crossfoam/data";

const translateInstall = [
  "installTitle",
  "preInstallIntro",
];

translateInstall.forEach((t) => {
  document.querySelector("#" + t).innerHTML = browser.i18n.getMessage(t);
});

const updateState = () => {
  cfData.get("s--twitter--a--wikidata-d1f6b7b3--nw", { empty: true })
    .then((data) => {
      if ("empty" in data) {
        setTimeout(() => { updateState(); }, 1000);
      } else {
        window.location.href = '/html/install.html';
      }
    })
    .catch((err) => {
      throw err;
    });
};

updateState();

setupVersion();
setupFooter();
