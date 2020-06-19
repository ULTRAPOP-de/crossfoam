import { setupVersion } from "./nav";

const translates = [
  ["help--headline", "navHelp"],
  ["help--howto-link", "helpPageHowToLink"],
  ["help--faq1", "helpPageFaqLink1"],
  ["faq--privacy", "helpPageFaqLink1"],
  ["help--faq2", "helpPageFaqLink2"],
  ["faq--proxy", "helpPageFaqLink2"],
  ["help--faq3", "helpPageFaqLink3"],
  ["faq--profiles", "helpPageFaqLink3"],
  ["help--faq4", "helpPageFaqLink4"],
  ["faq--browserbar", "helpPageFaqLink4"],
  ["help--faq5", "helpPageFaqLink5"],
  ["faq--slow", "helpPageFaqLink5"],
  ["help--faq6", "helpPageFaqLink6"],
  ["faq--follower", "helpPageFaqLink6"],
  ["help--faq7", "helpPageFaqLink7"],
  ["faq--webgl", "helpPageFaqLink7"],
  ["faq--privacy-copy", "helpPagePrivacyCopy"],
  ["faq--proxy-copy-1", "helpPageProxyCopy1"],
  ["faq--proxy-copy-2", "helpPageProxyCopy2"],
  ["faq--proxy-copy-3", "helpPageProxyCopy3"],
  ["faq--profiles-copy", "helpPageProfilesCopy"],
  ["faq--browserbar-copy1", "helpPageBrowserbarCopy1"],
  ["faq--browserbar-copy2", "helpPageBrowserbarCopy2"],
  ["faq--follower-copy", "helpPageFollowerCopy"],
  ["faq--vis-webgl-copy", "helpPageWebglCopy"],
  ["faq--slow-head1", "helpPageSlowHead1"],
  ["faq--slow-head2", "helpPageSlowHead2"],
  ["faq--slow-copy1", "helpPageSlowCopy1"],
  ["faq--slow-copy2", "helpPageSlowCopy2"],
  ["faq--contact", "contact"],
  ["help--get-in-touch", "helpPageGetInTouch"],
];

translates.forEach((t: [string, string]) => {
  document.querySelector("#" + t[0]).innerHTML = browser.i18n.getMessage(t[1]);
});

setupVersion();
