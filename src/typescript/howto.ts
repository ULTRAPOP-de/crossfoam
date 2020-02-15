const translateHowTo = [
  "installTitle",
  "installIntro",
];

translateHowTo.forEach((t) => {
  document.querySelector("#" + t).innerHTML = browser.i18n.getMessage(t);
});
