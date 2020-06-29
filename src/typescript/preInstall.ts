import * as cfData from "@crossfoam/data";
import { setHTML } from "@crossfoam/ui-helpers";
import { setupNav, setupFooter, setupVersion } from "./nav";

const translateInstall = [
  "installTitle",
  "preInstallIntro",
];

translateInstall.forEach((t) => {
  setHTML("#" + t, browser.i18n.getMessage(t));
});

const updateState = () => {
  cfData.get("s--twitter--a--wikidata-d1f6b7b3--nw", { empty: true })
    .then((data) => {
      if ("empty" in data) {
        setTimeout(() => { updateState(); }, 1000);
      } else {
        window.location.href = "/html/install.html";
      }
    })
    .catch((err) => {
      throw err;
    });
};

updateState();

setupNav();
setupVersion();
setupFooter();
