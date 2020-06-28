import { setHTML } from "@crossfoam/ui-helpers";
import { setupFooter, setupVersion } from "./nav";

const translateHowTo = [
  ["howto--title", "howToTitle"],
  ["howto--intro", "howToIntro"],
  ["howto--copy1", "howToCopy1"],
  ["howto--copy2", "howToCopy2"],
  ["howto--copy3", "howToCopy3"],
  ["howto--copy4", "howToCopy4"],
  ["howto--copy5", "howToCopy5"],
  ["howto--copy6", "howToCopy6"],
  ["howto--copy7", "howToCopy7"],
  ["howto--copy8", "howToCopy8"],
  ["howto--copy9", "howToCopy9"],
  ["howto--copy10", "howToCopy10"],
  ["howto--copy11", "howToCopy11"],
  ["howto--copy12", "howToCopy12"],
];

translateHowTo.forEach((t) => {
  setHTML("#" + t[0], browser.i18n.getMessage(t[1]));
});

const imageSrcs = [
  "../assets/images/story/intro-5-",
  "../assets/images/story/intro-6-",
  "../assets/images/story/intro-7-",
];

for (let i = 1; i <= 3; i += 1) {
  const img: HTMLImageElement = document.querySelector("#howto--transl-img" + i) as HTMLImageElement;
  const lang = browser.i18n.getUILanguage().split("-")[0].toLowerCase();
  img.setAttribute("src", imageSrcs[i - 1] + lang + "@2x.png");
}

setupVersion();
setupFooter();
