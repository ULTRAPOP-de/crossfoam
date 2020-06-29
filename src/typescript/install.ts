import { setHTML } from "@crossfoam/ui-helpers";
import { setupNav, setupFooter, setupVersion } from "./nav";

const translateInstall = [
  "installTitle",
  "installSubTitle",
  "installIntro",
  "installSpecialHeadline",
  "installParagraph1",
  "installParagraph2",
  "installParagraph3",
  "installParagraph4",
  "selectionOutro",
  "installParagraph5",
  "fundingTitle",
  "fundingDescription",
  "fundingThanks",
  "howToTitle",
];

translateInstall.forEach((t) => {
  setHTML("#" + t, browser.i18n.getMessage(t));
});

setupNav();
setupVersion();
setupFooter();
