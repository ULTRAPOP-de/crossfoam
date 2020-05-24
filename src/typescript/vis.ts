import * as cfData from "@crossfoam/data";
import { exportFormats, exportNetwork } from "@crossfoam/export";
import { getScrapes } from "@crossfoam/services";
import { formatDate } from "@crossfoam/utils";
import { ClusterVis, ListVis, NetworkVis, OverviewVis } from "@crossfoam/vis";
import * as d3 from "d3";
import { setupNav, setupVersion, StateManager } from "./nav";

// Master nav and extension version
setupNav();
setupVersion();

const destroyVis = () => {
  if (cache.vis !== null) {
    cache.vis.destroy();
    cache.vis = null;
  }
};

const updateView = () => {
  if (stateManager.urlState.view === "selection" ||
      !("nUuid" in stateManager.urlState)
  ) {

    destroyVis();
    selectionView();

  } else if (stateManager.urlState.view === "export") {

    destroyVis();
    setupExport();

  } else {

    if (cache.vis !== null && stateManager.urlState.view === cache.vis.visType) {
      cache.vis.updateView();
    } else {
      destroyVis();
      setupVis();

      let loadState: Promise<any>;
      if (!(stateManager.urlState.nUuid in cache.networks)) {
        const scrape = cache.scrapes[cache.scrapeKeys[stateManager.urlState.nUuid]];
        loadState = cfData.get(`s--${scrape.service}--a--${scrape.screenName}-${scrape.nUuid}--nw`)
          .then((data) => {
            cache.networks[stateManager.urlState.nUuid] = data;
            return Promise.resolve();
          });
      } else {
        loadState = Promise.resolve();
      }

      loadState.then(() => {

        switch (stateManager.urlState.view) {
          case "list":
            cache.vis = new ListVis(stateManager);
            break;
          case "network":
            cache.vis = new NetworkVis(stateManager);
            break;
          case "overview":
            cache.vis = new OverviewVis(stateManager);
            break;
          case "cluster":
            cache.vis = new ClusterVis(stateManager);
            break;
        }

        d3.select("#visContainer").attr("class", stateManager.urlState.view);

        cache.vis.build(cache.networks[stateManager.urlState.nUuid],
                        cache.scrapes[cache.scrapeKeys[stateManager.urlState.nUuid]]);

        d3.selectAll("#spinnerOverlay").remove();
      });
    }

  }

  updateBackButton();
};

const stateManager = new StateManager(updateView);

const selectionView = () => {

  d3.selectAll("#page *").remove();

  const container = d3.select("#page").append("div").attr("id", "scrape-container");

  container.append("h1")
    .html(`${browser.i18n.getMessage("selectionTitle")}`);

  // TODO: No scrapes, yet

  container.append("p")
    .classed("intro", true)
    .html(browser.i18n.getMessage("selectionIntro", [
      `<img src="../assets/images/navbar--icon-vis-download-inline.png" \
      srcset="../assets/images/navbar--icon-vis-download-inline.png 1x, \
      ../assets/images/navbar--icon-vis-download-inline@2x.png 2x">`,
      `<img src="../assets/images/navbar--icon-vis-delete-inline.png" \
      srcset="../assets/images/navbar--icon-vis-delete-inline.png 1x, \
      ../assets/images/navbar--icon-vis-delete-inline@2x.png 2x">`,
    ]));

  if (cache.scrapes.length < 1) {

    container.append("div")
      .attr("id", "nodatayet")
      .append("p")
        .html(browser.i18n.getMessage("noDataYet"));

  } else {
    const list = container.append("ul");

    let lastService = "";

    cache.scrapes.forEach((scrape) => {

      if (scrape.service !== lastService) {
        list.append("li")
          .classed("scrapeTitle", true)
          .text(scrape.service);

        lastService = scrape.service;
      }

      const li = list.append("li")
        .classed("scrapeItem", true)
        .on("click", () => {
          stateManager.urlState.nUuid = scrape.nUuid;
          stateManager.urlState.view = "overview";
          stateManager.update();
        });

      li.append("span")
        .classed("scrapeImage", true)
        .append("img")
          .on("error", (d, i, a) => {
            d3.select(a[i])
              .attr("src", "https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png");
          })
          .attr("src", cache.userImages[scrape.screenName]);

      li.append("span")
        .text(scrape.screenName)
        .classed("scrapeName", true);

      li.append("a")
        .datum(scrape)
        .classed("scrapeDelete", true)
        .html(`<img src="../assets/images/navbar--icon-vis-delete.png" \
    srcset="../assets/images/navbar--icon-vis-delete.png 1x, \
    ../assets/images/navbar--icon-vis-delete@2x.png 2x" >`)
        .on("click", (d) => {
          d3.event.stopPropagation();

          const confirmation = confirm(browser.i18n.getMessage("confirmDelete"));

          if (confirmation === true) {
            li
              .style("opacity", 0.5)
              .style("pointer-events", "none");

            browser.runtime.sendMessage({
              centralNode: d.screenName,
              id: d.nUuid,
              service: d.service,
              type: "removeFromQueue",
            })
            .then(() => {
              return Promise.all([
                cfData.remove(`s--${d.service}--a--${d.screenName}-${d.nUuid}--c`),
                cfData.remove(`s--${d.service}--a--${d.screenName}-${d.nUuid}--n`),
                cfData.remove(`s--${d.service}--a--${d.screenName}-${d.nUuid}--nw`),
              ]);
            })
            .then(() => {
              return cfData.get(`s--${d.service}--nw--${d.screenName}`);
            })
            .then((data) => {
              delete data[d.nUuid];
              return cfData.set(`s--${d.service}--nw--${d.screenName}`, data);
            })
            .then(() => {
              update();
            });
          }
        });

      li.append("a")
        .classed("scrapeExport", true)
        .html(`<img src="../assets/images/navbar--icon-vis-download.png" \
    srcset="../assets/images/navbar--icon-vis-download.png 1x, \
    ../assets/images/navbar--icon-vis-download@2x.png 2x" >`)
        .on("click", () => {
          d3.event.stopPropagation();

          stateManager.urlState.nUuid = scrape.nUuid;
          stateManager.urlState.view = "export";
          stateManager.update();
        });

      const scrapeRight = li.append("span")
        .classed("scrapeMeta", true);

      if (!scrape.completed) {
        scrapeRight.append("span")
          .text(browser.i18n.getMessage("selectionInProgress"))
          .classed("scrapeState", true);
      }

      const date = new Date(scrape.date);

      scrapeRight.append("span")
        .html(`&nbsp;${formatDate(date, true)}&nbsp;(${scrape.nUuid})`)
        .classed("scrapeDate", true);

      scrapeRight.append("br");

      scrapeRight.append("span")
        .text(scrape.completeCount + " Nodes")
        .classed("scrapeCount", true);

      li.append("hr");

    });
  }
};

const setupBackButton = () => {
  d3.select("#page").append("a")
    .attr("id", "backButton")
    .html(`&larr;&nbsp;${browser.i18n.getMessage("backToOverview")}`)
    .attr("href", "vis.html");
};

const updateBackButton = () => {
  const backButton = d3.select("#backButton");
  if (!backButton.empty()) {
    if ("subView" in stateManager.urlState && stateManager.urlState.subView !== "level0") {
      backButton
        .on("click", () => {
          window.history.back();
        })
        .html(`&larr;&nbsp;${browser.i18n.getMessage("back")}`)
        .attr("href", null);
    } else {
      backButton
        .on("click", null)
        .html(`&larr;&nbsp;${browser.i18n.getMessage("backToOverview")}`)
        .attr("href", "vis.html");
    }
  }
};

const setupExport = () => {

  const scrape = cache.scrapes[cache.scrapeKeys[stateManager.urlState.nUuid]];

  d3.selectAll("#page *").remove();

  setupBackButton();

  const exportContainer = d3.select("#page").append("div")
    .attr("id", "exportContainer");

  exportContainer.append("h1")
    .html(`<span>${scrape.service}</span>: ${scrape.screenName} (${formatDate(new Date(scrape.date), true)})`);

  exportContainer.append("p")
    .classed("intro", true)
    .html(`${browser.i18n.getMessage("exportMessage")}:`);

  const li = exportContainer.append("ul")
    .selectAll("li").data(exportFormats.sort((a, b) => {
      if (a.label > b.label) {
        return 1;
      }
      if (a.label < b.label) {
        return -1;
      }
      return 0;
    })).enter().append("li")
      .classed("scrapeItem", true)
      .on("click", (d) => {
        exportNetwork(scrape.service, scrape.screenName, scrape.nUuid, d.id);
      });

  li.append("span")
    .classed("scrapeImage", true)
    .append("img")
      .attr("src", (d) => `../assets/images/navbar--icon-vis-file-${d.icon}@2x.png`);

  li.append("span")
    .text((d) => d.label)
    .style("float", "none")
    .classed("scrapeName", true);

  li.append("br");

  li.append("span")
    .text((d) => d.description)
    .classed("scrapeSub", true);

  li.append("hr");
};

const setupVis = () => {
  d3.selectAll("#page *").remove();

  const visContainer = d3.select("#page").append("div")
    .attr("id", "visContainer");

  d3.select("#page").append("div")
    .attr("id", "spinnerOverlay")
    .append("img")
      .attr("src", "../assets/images/logo-animation.gif");

  const visNav = d3.select("#page").append("div")
    .attr("id", "visNav")
    .html(`<ul>
    <li class="${(stateManager.urlState.view === "overview") ? "active" : ""}">
      <a href="vis.html?view=overview&nUuid=${stateManager.urlState.nUuid}">
        <span class="icon">
        <img src="../assets/images/navbar--icon-vis-overview.png" \
        srcset="../assets/images/navbar--icon-vis-overview.png 1x, \
        ../assets/images/navbar--icon-vis-overview@2x.png 2x" >
        </span>
        <span>${browser.i18n.getMessage("visMenuOverview")}</span>
      </a>
    </li>
    <li class="${(stateManager.urlState.view === "network") ? "active" : ""}">
      <a href="vis.html?view=network&nUuid=${stateManager.urlState.nUuid}">
        <span class="icon">
        <img src="../assets/images/navbar--icon-vis-network.png" \
        srcset="../assets/images/navbar--icon-vis-network.png 1x, \
        ../assets/images/navbar--icon-vis-network@2x.png 2x" >
        </span>
        <span>${browser.i18n.getMessage("visMenuNetwork")}</span>
      </a>
    </li>
    <li class="${(stateManager.urlState.view === "cluster") ? "active" : ""}">
      <a href="vis.html?view=cluster&nUuid=${stateManager.urlState.nUuid}">
        <span class="icon">
        <img src="../assets/images/navbar--icon-vis-cluster.png" \
        srcset="../assets/images/navbar--icon-vis-cluster.png 1x, \
        ../assets/images/navbar--icon-vis-cluster@2x.png 2x" >
        </span>
        <span>${browser.i18n.getMessage("visMenuCluster")}</span>
      </a>
    </li>
    <li class="${(stateManager.urlState.view === "list") ? "active" : ""}">
      <a href="vis.html?view=list&nUuid=${stateManager.urlState.nUuid}">
        <span class="icon">
        <img src="../assets/images/navbar--icon-vis-list.png" \
        srcset="../assets/images/navbar--icon-vis-list.png 1x, \
        ../assets/images/navbar--icon-vis-list@2x.png 2x" >
        </span>
        <span>${browser.i18n.getMessage("visMenuList")}</span>
      </a>
    </li>
    </ul>`);

  const visHelp = d3.select("#page").append("div")
    .attr("id", "visHelp")
    .html(`<span><span class="icon">
    <img src="../assets/images/navbar--icon-chatbot.png" \
    srcset="../assets/images/navbar--icon-chatbot.png 1x, \
    ../assets/images/navbar--icon-chatbot@2x.png 2x" >
    </span>
    <span>${browser.i18n.getMessage("navHelp")}</span></span>`);

  setupBackButton();
};

const cache = {
  networks: {},
  scrapeKeys: {},
  scrapes: [],
  userImages: {},
  vis: null,
};

const update = () => {
  if (stateManager.urlState.view === "selection") {
    updatedScrapes()
      .then(() => {
        selectionView();
      });
  }
};

const updatedScrapes = (): Promise<any> => {
  return getScrapes()
    .then((scrapes) => {

      return Promise.all(scrapes.map(
        (scrape) => cfData.get(`s--${scrape.service}--a--${scrape.screenName}-${scrape.nUuid}--c`, {}),
      )).then((userDatas) => {

        cache.userImages = {};

        userDatas.forEach((userData: {handle: string, image: string}) => {
          cache.userImages[userData.handle] = userData.image;
        });

        // Sort list by service, screenName and date
        scrapes.sort((a, b) => {
          if (a.service === b.service) {
            if (a.screenName < b.screenName) {
              return 1;
            } else if (a.screenName > b.screenName) {
              return -1;
            } else {
              if (a.date < b.date) {
                return -1;
              } else if (a.date > b.date) {
                return 1;
              }
              return 0;
            }
          } else if (a.service < b.service) {
            return -1;
          } else if (a.service > b.service) {
            return 1;
          }
        });

        cache.scrapes = scrapes;

        cache.scrapes.forEach((_scrape, si) => {
          cache.scrapeKeys[_scrape.nUuid] = si;
          _scrape.image = cache.userImages[_scrape.screenName];
        });

        return Promise.resolve();
      });
    });
};

let selectionInterval;

updatedScrapes()
  .then(() => {
    stateManager.retrieveUrl();
    selectionInterval = setInterval(update, 15000);
  });
