const translate_howto = [
  "installTitle",
  "installIntro",
];

translate_howto.forEach((t) => {
  document.querySelector("#" + t).innerHTML = browser.i18n.getMessage(t);
});
