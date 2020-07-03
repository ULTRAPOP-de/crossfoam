import * as cfData from "@crossfoam/data";
import { analyseNetwork, buildNetwork, checkupNetwork, cleanupNetwork,
         estimateCompletion, removeNetwork, updateNetworkDictionary, visualizeNetwork } from "@crossfoam/network";
import * as queue from "@crossfoam/queue";
import { identifyService, services } from "@crossfoam/services";
import { objEmpty, uuid } from "@crossfoam/utils";
import { json as d3json } from "d3";

// Modify dom
const handleUpdated = (tabId, changeInfo, tabInfo) => {
  // Only inject script after page is loaded and complete
  if ("status" in changeInfo && changeInfo.status === "complete") {
    /*
      For obvious reasons it is not allowed to inject code
      into the pages listed below, if we try, our dom manipulation
      will produce errors, so the safest thing is to not even try
    */
    const ignore = [
      "chrome-extension://",
      "chrome://",
      "edge-extension://",
      "edge://",
      "about:newtab",
      "about:home",
      "about:addons",
      "about:debugging",
      "about:devtools-toolbox",
    ];

    let goodToGo = true;

    if (!("url" in tabInfo)) {
      goodToGo = false;
    } else {
      ignore.forEach((i) => {
        if (tabInfo.url.indexOf(i) !== -1) {
          goodToGo = false;
        }
      });
    }

    if (goodToGo) {
      /*
        For some misterious reason onUpdate with a complete message
        gets fired when someone closes this tab, so we need to
        check if the tab still exists
      */
      browser.tabs.get(tabId)
        .then((result) => {
          return browser.tabs.executeScript(tabId, {
            code: "typeof browserMessage === 'function';",
          });
        })
        .then((result: any): Promise<any> => {
          if (!result || result[0] !== true) {
            return cfData.get("config--siteAnalysis", "false")
              .then((data) => {
                if (data === "true") {
                  return browser.tabs.executeScript(tabId, {
                    allFrames: true,
                    file: "assets/js/browser-polyfill.js",
                    matchAboutBlank: false,
                  }).then(() => {
                    return browser.tabs.executeScript(tabId, {
                      allFrames: true,
                      file: "assets/js/content.js",
                      matchAboutBlank: false,
                    });
                  }).then(() => {
                    return browser.tabs.insertCSS(tabId, {
                      allFrames: true,
                      file: "assets/css/content.css",
                      matchAboutBlank: false,
                    });
                  });
                } else {
                  return browser.tabs.executeScript(tabId, {
                    allFrames: true,
                    file: "assets/js/browser-polyfill.js",
                    matchAboutBlank: false,
                  }).then(() => {
                    return browser.tabs.executeScript(tabId, {
                      allFrames: true,
                      file: "assets/js/content-light.js",
                      matchAboutBlank: false,
                    });
                  }).then(() => {
                    return browser.tabs.insertCSS(tabId, {
                      allFrames: true,
                      file: "assets/css/content-light.css",
                      matchAboutBlank: false,
                    });
                  });
                }
              });
          } else {
            return Promise.resolve();
          }
        }).catch((err) => {
          /*
            we can ignore this.
            this means the tab we were supposed to inject into
            does not exists anymore.
          */
          throw err;
        });
    }
  }
};

browser.tabs.onUpdated.addListener(handleUpdated);

/* --------------------------------- */

/*
 in order for the detection to work super smoothly,
 we keep an updated object of users and clusters
 in the background page
*/

const networkDictionary = {};

const updateDictionary = () => {
  return Promise.all(Object.keys(services).map((service) => cfData.get(`s--${service}--d`)))
    .then((data) => {
      Object.keys(services).forEach((service, si) => {
        networkDictionary[service] = data[si];
      });
    })
    .catch((error) => {
      throw error;
    });
};
updateDictionary();

/* --------------------------------- */

/*
 register all required functions in the queue.
*/

Object.keys(services).forEach((service) => {
  services[service].config.queue_functions.forEach((queueFunction) => {
    queue.register(services[service][queueFunction.name],
       `${service}--${queueFunction.name}`,
       queueFunction.paramCount,
       queueFunction.skip,
       queueFunction.passDown,
       queueFunction.timeout);
  });
});

queue.register(buildNetwork,
  "network--buildNetwork",
  [3, 3], true, true, 1);

queue.register(cleanupNetwork,
  "network--cleanupNetwork",
  [3, 3], true, false, 1);

queue.register(analyseNetwork,
  "network--analyseNetwork",
  [3, 3], true, true, 1);

queue.register(estimateCompletion,
  "network--estimateCompletion",
  [3, 3], true, true, 1);

queue.register(checkupNetwork,
  "network--checkupNetwork",
  [3, 3], true, true, 1);

queue.register(visualizeNetwork,
  "network--visualizeNetwork",
  [3, 3], true, true, 1);

queue.register(updateNetworkDictionary,
  "network-updateNetworkDictionary",
  [3, 3], true, true, 1);

queue.register(updateDictionary,
  "updateDictionary",
  [0, 0], true, false, 1);

// Pick up where we left of...

queue.init();

// queue.call("network--buildNetwork", ["twitter", "kaglinka", "f66a77c1"], 0, 0);

/* --------------------------------- */

// Context Menu for links
browser.contextMenus.removeAll()
  .then(() => {
    browser.contextMenus.create({
        contexts: ["link"],
        id: "cf--linkMenu",
        title: browser.i18n.getMessage("contextMenu"),
    });
  });

browser.contextMenus.onClicked.addListener((info, tab) => {
  // TODO: Why does this sometimes generate multiple overlays
  if (info.menuItemId === "cf--linkMenu") {
    const found = identifyService(info.linkUrl);

    if (found !== null) {

      // TODO: Check if data set already exists
      cfData.get(`s--${found[0]}--nw--${found[1]}`)
        .then((exists) => {
          if (exists !== null && !objEmpty(exists)) {

            const nUuid = uuid();
            browser.tabs.sendMessage(tab.id, {
              modal: {
                buttons: [
                  {value: true, label: browser.i18n.getMessage("yes")},
                  {value: false, label: browser.i18n.getMessage("no")},
                ],
                message: browser.i18n.getMessage("duplicateLinkMessage", found[1]),
                title: browser.i18n.getMessage("requestLinkTitle"),
                uuid: nUuid,
              },
              type: "modal",
            })
            .then((response: any) => {
              switch (response) {
                case "true":
                  startScrape(found, tab);
                  break;
                default:
                  // false || null > Exit
                  // console.log("Default", response);
                  break;
              }
            }).catch((error) => {
              // The user clicked the background, don't worry
            });
          } else {
            startScrape(found, tab);
          }
        })
        .catch((error) => {
          throw error;
        });

    } else {

      const nUuid = uuid();
      browser.tabs.sendMessage(tab.id, {
          modal: {
            buttons: [
              {value: true, label: browser.i18n.getMessage("continue")},
            ],
            message: browser.i18n.getMessage("invalidLinkMessage"),
            title: browser.i18n.getMessage("requestLinkTitle"),
            uuid: nUuid,
          },
          type: "modal",
        })
        .then((response) => {
          // Ignore
        })
        .catch((error) => {
          // The user clicked the background, don't worry
        });

    }
  }
});

const startScrape = (found: [string, string], tab: any) => {
  if (services[found[0]].config.auth) {
    services[found[0]].authRequired()
      .then((required) => {
        if (required) {
          const nUuid = uuid();
          browser.tabs.sendMessage(tab.id, {
            modal: {
              buttons: [
                {value: true, label: browser.i18n.getMessage("openSettings")},
                {value: false, label: browser.i18n.getMessage("close")},
              ],
              message: browser.i18n.getMessage("authRequiredMessage", found[0]),
              title: browser.i18n.getMessage("requestLinkTitle"),
              uuid: nUuid,
            },
            type: "modal",
          })
          .then((response: any) => {
              if (response === "true") {
                browser.tabs.create({
                  url: "/html/options.html",
                }).then((results) => {
                  // successful opening options.html
                }, (err) => {
                  throw err;
                });
              }
            })
          .catch((error) => {
            // The user clicked the background, don't worry
          });
        } else {
          const nUuid = uuid();
          queue.call(`${found[0]}--getUser`, [found[1]], (new Date()).getTime(), nUuid);
          notifyOnNewScrape(found[1], nUuid);
          return cfData.get(`s--${found[0]}--u`, [])
            .then((data) => {
              if (data.indexOf(found[1]) > -1) {
                return Promise.resolve();
              } else {
                data.push(found[1]);
                return cfData.set(`s--${found[0]}--u`, data);
              }
            });
            // .then(() => {
            //   return cfData.get();
            // });
        }
      })
      .catch((error) => {
        throw error;
      });
  } else {
    const nUuid = uuid();
    queue.call(`${found[0]}--getUser`, [found[1]], (new Date()).getTime(), nUuid);
    notifyOnNewScrape(found[1], nUuid);
  }
};

const notifyOnNewScrape = (userName: string, nUuid: string) => {
  browser.notifications.create("crossfoam-scrapeStart-" + nUuid, {
    iconUrl: browser.runtime.getURL("assets/icons/icon-96.png"),
    message: "We have added " + userName + " to the queue of data collections.",
    title: userName + " added",
    type: "basic",
  });
};

/* --------------------------------- */

// Handle messages between the content scripts and the backend

const browserMessage = (request, sender, sendResponse) => {
  switch (request.type) {
    case "removeFromQueue":

      queue.remove(request.id);
      removeNetwork(request.service, request.centralNode, request.id);
      services[request.service].removeNetwork(request.centralNode, request.id);

      return Promise.resolve({
        type: "update",
      });

      // Or should this be a promise?
      break;
    case "call":
      queue.call(request.func, request.params, request.date, request.nUuid);
      return Promise.resolve();
      break;
    case "updateDictionary":
      updateDictionary();
      return Promise.resolve();
      break;
    case "getDictionary":
      return Promise.resolve(networkDictionary);
      break;
    case "getConfigLabel":
      return cfData.get("config--showLabels", "true");
      break;
    default:
      console.log("UNKNOWN", request, sender, sendResponse);
      return Promise.resolve();
      break;
  }
  return true;
};

browser.runtime.onMessage.addListener(browserMessage);

/* --------------------------------- */

// When the extension is installed or updated let the user know...

const handleInstalled = (details) => {
  // Don't notify user's if in dev mode
  // if (!details.temporary) {
    switch (details.reason) {
      case "update":
        browser.tabs.create({
          active: true,
          url: `/html/update.html?previousVersion=${details.previousVersion}`,
        });
        break;
      case "install":
        installData();
        browser.tabs.create({
          active: true,
          url: "/html/preInstall.html",
        });
        break;
      default:
        // Ignore "browser_update" & "shared_module_update"
        break;
    }
  // }
};

browser.runtime.onInstalled.addListener(handleInstalled);

const installData = () => {
  // make sure its not yet installed
  cfData.get("s--twitter--a--wikidata-d1f6b7b3--nw", { empty: true })
    .then((checkData) => {
      if ("empty" in checkData) {
        cfData.get(`s--twitter--u`, [])
          .then((sTwitterU) => {
            if (!sTwitterU.includes("wikidata")) {
              sTwitterU.push("wikidata");
            }
            return cfData.set(`s--twitter--u`, sTwitterU);
          })
          .then(() => {
            return d3json("/assets/data/wikidata.json");
          })
          .then((data) => {
            const setData = {};
            setData[data["s--twitter--nw--wikidata"].key] = data["s--twitter--nw--wikidata"].value;
            return cfData.set("s--twitter--nw--wikidata", setData)
              .then(() => {
                return cfData.set("s--twitter--a--wikidata-d1f6b7b3--c", data["s--twitter--a--wikidata-d1f6b7b3--c"]);
              })
              .then(() => {
                return cfData.set("s--twitter--a--wikidata-d1f6b7b3--nw", data["s--twitter--a--wikidata-d1f6b7b3--nw"]);
              })
              .then(() => {
                return updateNetworkDictionary("twitter", "wikidata", "d1f6b7b3");
              })
              .then(() => {
                updateDictionary();
              })
              .catch((err) => {
                throw err;
              });
          })
          .catch((err) => {
            throw err;
          });
      } else {
        // console.log("already exists");
      }
    })
    .catch((err) => {
      throw err;
    });
};

/* --------------------------------- */

/*
 * If the user leaves open the overview page or detail page
 * both pages should update, to present the changes of the
 * scraping process. Either both pages run requests in
 * regular intervals and ask if their have been any changes
 * or the background script informs the pages that there
 * have been changes. The latter has the problem, that the
 * pages need to register, as the background script has no
 * idea if there are open pages. This feels slightly to
 * complicated. In the scrape object, there will be a last
 * update timestamp that the pages can query. point.
*/
