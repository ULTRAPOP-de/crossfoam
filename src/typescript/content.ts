import { identifyService, services } from "@crossfoam/services";
import { modal } from "@crossfoam/ui-helpers";

// TODO: No fonts, use Helvetica/Arial
declare var FontFace: any;

(() => {

  let dict;
  let configLabel;

  /* tslint:disable:only-arrow-functions */
  const debounce = (fn, time) => {
    let timeout;

    return function() {
      const functionCall = function() {
        fn.apply(this, arguments);
      };

      clearTimeout(timeout);
      timeout = setTimeout(functionCall, time);
    };
  };
  /* tslint:enable:only-arrow-functions */

  const updateSite = () => {
    const identifiedElements = [];

    // CSS CHECK IF ONE OF ITS PARENTS OR CHILDREN HAS BEEN MODIFIED
    Array.from(document.body.querySelectorAll("a:not([cfModified=modified])")).forEach((item: HTMLLinkElement) => {
      const attr = document.createAttribute("cfModified");
      attr.value = "modified";
      item.setAttributeNode(attr); 

      const username = identifyService(item.href);

      if (username !== null) {

        identifiedElements.push([
          item, username[0], username[1],
        ]);

      }

    });

    if (identifiedElements.length > 0) {
      identifiedElements.forEach((item) => {
        updateElement(item);
      });
    }
  };

  const updateElement = (item: {0: HTMLLinkElement, 1: string, 2: string}): void => {
    if (item[2] in dict[item[1]].nodes) {
      dict[item[1]].nodes[item[2]].forEach((clusterIds) => {
        const clusterData = dict[item[1]].cluster[clusterIds];
        const text = document.createTextNode(clusterData.name);
        const span = document.createElement("span");
        span.style.backgroundColor = clusterData.color;
        span.className = "cf--clusterLabel";
        if (configLabel === "true") {
          span.appendChild(text);
        }
        item[0].appendChild(span);
      });
    }
  };

  const debounceUpdate = debounce(updateSite, 200);

  // Updating the site if the dom changes
  const mConfig = { attributes: false, childList: true, subtree: true };
  const observer = new MutationObserver((mutationList) => {
    debounceUpdate();
  });
  observer.observe(document.body, mConfig);

  // Testing the content_script injection for seb_meier
  // browser.storage.local.set({"s--twitter--nodes--seb_meier": [["seb_meier", 0]]});
  // browser.storage.local.set({"s--twitter--seb_meier--clusters--0": {name: "Cluster#1", color: "red"}});

  browser.runtime.sendMessage({
    type: "getConfigLabel"
  }).then((config) => {
    configLabel = config;
    return browser.runtime.sendMessage({
      type: "getDictionary"
    });
  }).then((dictionary) => {
    dict = dictionary;
    updateSite();
  });
  
  const browserMessage = (request, sender, sendResponse) => {
    switch (request.type) {
      case "modal":
        return modal(request.modal);
        break;
      default:
        console.log(request);
        break;
    }
    return true;
  };

  browser.runtime.onMessage.addListener(browserMessage);

  const fonts = [
    ["Inter", "normal", 400, "Inter-Regular"],
    ["Inter", "italic", 400, "Inter-Italic"],
    ["Inter", "normal", 500, "Inter-Medium"],
    ["Inter", "italic", 500, "Inter-MediumItalic"],
    ["Inter", "normal", 600, "Inter-SemiBold"],
    ["Inter", "italic", 600, "Inter-SemiBoldItalic"],
    ["Inter", "normal", 700, "Inter-Bold"],
    ["Inter", "italic", 700, "Inter-BoldItalic"],
    ["Inter", "normal", 800, "Inter-ExtraBold"],
    ["Inter", "italic", 800, "Inter-ExtraBoldItalic"],
    ["Inter", "normal", 900, "Inter-Black"],
    ["Inter", "italic", 900, "Inter-BlackItalic"],
  ];

  fonts.forEach((font) => {
    const nFont = new FontFace(font[0],
      `url('${browser.runtime.getURL("assets/fonts/Inter/Inter/" + font[3] + ".woff")}')`,
      {
        family: font[0],
        style: font[1],
        weight: font[2],
      });

    nFont.load()
      .then(() => {
        (document as any).fonts.add(nFont);
      });
  });

  return true;

})();
