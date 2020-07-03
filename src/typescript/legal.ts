import { setHTML } from "@crossfoam/ui-helpers";
import { setupFooter, setupNav, setupVersion } from "./nav";

const legalTranslate = [
  ["legal--title", "legalTitle"],
  ["legal--headline1", "legalHeadline1"],
  ["legal--copy1", "legalCopy1"],
  ["legal--headline2", "legalHeadline2"],
  ["legal--copy2", "legalCopy2"],
  ["legal--headline3", "legalHeadline3"],
  ["legal--copy3", "legalCopy3"],
  ["legal--headline4", "legalHeadline4"],
  ["legal--copy4", "legalCopy4"],
  ["legal--copy5", "legalCopy5"],
  ["legal--copy6", "legalCopy6"],
  ["legal--copy7", "legalCopy7"],
  ["legal--copy8", "legalCopy8"],
  ["legal--copy9", "legalCopy9"],
  ["legal--headline5", "legalHeadline5"],
  ["legal--copy10", "legalCopy10"],
  ["legal--copy11", "legalCopy11"],
  ["legal--copy12", "legalCopy12"],
  ["legal--copy13", "legalCopy13"],
  ["legal--copy14", "legalCopy14"],
  ["legal--copy15", "legalCopy15"],
  ["legal--headline6", "legaleadline6"],
  ["legal--copy16", "legalCopy16"],
  ["legal--copy17", "legalCopy17"],
  ["legal--headline7", "legalHeadline7"],
  ["legal--copy18", "legalCopy18"],
  ["legal--copy19", "legalCopy19"],
  ["legal--headline8", "legalHeadline8"],
  ["legal--copy20", "legalCopy20"],
];

legalTranslate.forEach((t) => {
  setHTML("#" + t[0], browser.i18n.getMessage(t[1]));
});

setupNav();
setupVersion();
setupFooter();
