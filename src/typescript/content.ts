import { identifyService, services } from "@crossfoam/services";
import { modal } from "@crossfoam/ui-helpers";

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
    if ("altNodes" in dict[item[1]] && item[2] in dict[item[1]].altNodes) {
      item[2] = dict[item[1]].altNodes[item[2]];
    }

    if (item[2] in dict[item[1]].nodes) {
      dict[item[1]].nodes[item[2]].forEach((clusterIds) => {
        const clusterData = dict[item[1]].cluster[clusterIds];
        const text = document.createTextNode(clusterData.name);
        const span = document.createElement("span");
        span.style.backgroundColor = clusterData.color;
        if (configLabel === "true") {
          span.className = "cf--clusterLabel cf--withText";
          span.appendChild(text);
        } else {
          span.className = "cf--clusterLabel cf--noText";
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

  browser.runtime.sendMessage({
    type: "getConfigLabel",
  }).then((config) => {
    configLabel = config;
    return browser.runtime.sendMessage({
      type: "getDictionary",
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

  return true;

})();
