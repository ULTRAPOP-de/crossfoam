import { setupFooter, setupVersion } from "./nav";

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
  document.querySelector("#" + t).innerHTML = browser.i18n.getMessage(t);
});

setupVersion();
setupFooter();
