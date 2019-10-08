import { identifyService, services } from "@crossfoam/services";
import { modal } from "@crossfoam/ui-helpers";

declare var FontFace: any;

(() => {

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

    document.body.querySelectorAll("a:not(.cf--modified)").forEach((item: HTMLLinkElement) => {
      item.className = item.className + " cf--modified";

      const username = identifyService(item.href);

      if (username !== null) {

        identifiedElements.push([
          item, username[0], username[1],
        ]);

      }

    });

    if (identifiedElements.length > 0) {
      Promise.all(identifiedElements.map((item) => updateElement(item)))
        .catch((err) => {
          throw err;
        });
    }
  };

  const updateElement = (item: {0: HTMLLinkElement, 1: string, 2: string}): Promise<any> => {
    const nodeQuery = {};
    const nodeQueryKey = `s--${item[2]}--nodes--${item[1]}`;
    nodeQuery[nodeQueryKey] = [];
    return Promise.resolve();
    // return browser.storage.local.get(nodeQuery)
    //   .then((clusters: {}) => {
    //     if (clusters && (nodeQueryKey in clusters) && clusters[nodeQueryKey].length >= 1) {
    //       return Promise.all(clusters[nodeQueryKey].map((cluster) => {
    //         const clusterQuery = {};
    //         const clusterQueryKey = `s--${item[2]}--${cluster[0]}--clusters--${cluster[1]}`;
    //         clusterQuery[clusterQueryKey] = {name: "unknown", color: "#dddddd"};
    //         return browser.storage.local.get(clusterQuery);
    //       })).then((clustersData) => {
    //         clustersData.forEach((clusterDataObj: {}) => {
    //           const clusterData = clusterDataObj[Object.keys(clusterDataObj)[0]];
    //           const text = document.createTextNode(clusterData.name);
    //           const span = document.createElement("span");
    //           span.style.color = clusterData.color;
    //           span.className = "cf--clusterLabel";
    //           span.appendChild(text);
    //           item[0].appendChild(span);
    //         });
    //       });

    //     } else {
    //       return Promise.resolve();
    //     }
    //   });
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

  updateSite();

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
