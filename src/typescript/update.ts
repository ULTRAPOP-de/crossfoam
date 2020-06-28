import { setHTML } from "@crossfoam/ui-helpers";
import { setupFooter, setupVersion } from "./nav";

setHTML("#versionControl", browser.i18n.getMessage(
  "updateVersion",
  [
    window.location.href.split("=")[1],
    browser.runtime.getManifest().version,
  ],
));

setHTML("#githubPromote", browser.i18n.getMessage("githubPromote"));

const list = document.querySelector("#updateMessage ul");

browser.i18n.getMessage("updateMessage").split(";").forEach((item) => {
  const li = document.createElement("LI");
  const text = document.createTextNode(item);
  li.appendChild(text);
  list.appendChild(li);
});

setupVersion();
setupFooter();
