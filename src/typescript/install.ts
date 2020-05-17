const translateInstall = [
  "installTitle",
  "installSubTitle",
  "installIntro",
  "installSpecialHeadline",
  "installParagraph1",
  "installParagraph2",
  "installParagraph3",
  "installParagraph4",
];

translateInstall.forEach((t) => {
  document.querySelector("#" + t).innerHTML = browser.i18n.getMessage(t);
});
