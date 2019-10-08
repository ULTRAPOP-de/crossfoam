const translate_install = [
  "installTitle",
  "installSubTitle",
  "installIntro",
  "installSpecialHeadline",
  "installParagraph1",
  "installParagraph2",
  "installParagraph3",
  "installParagraph4",
  "installParagraph5",
];

translate_install.forEach((t) => {
  document.querySelector("#" + t).innerHTML = browser.i18n.getMessage(t);
});
