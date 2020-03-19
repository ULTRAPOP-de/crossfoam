import { getScrapes } from "@crossfoam/services";
import { logoSpinner } from "@crossfoam/ui-helpers";
import { formatDate, formatDuration } from "@crossfoam/utils";
import * as d3 from "d3";

let scrapes = [];

const updateList = () => {
  d3.selectAll("#scrape-list li").remove();

  if (scrapes.length > 0) {

    d3.select("#scrape-title").text(browser.i18n.getMessage("popupScrapeTitle") + ":")
      .on("mouseover", () => {
          d3.select("#overlay")
            .style("display", "none");
        });

    const scrapeItems = d3.select("#scrape-list")
      .selectAll("li").data(scrapes).enter().append("li")
        .classed("scrape", true)
        .on("mouseover", (d, i, nodes) => {
          cancelID = i;

          const bbox = d3.select(nodes[i]).node().getBoundingClientRect();
          d3.select("#overlay")
            .style("display", "table")
            .style("top", (bbox.top + 1) + "px")
            .style("width", bbox.width + "px")
            .style("height", (bbox.height - 1) + "px");
        });

    scrapeItems.append("span")
      .classed("scrape--title", true)
      .html((d) => d.service + ":&nbsp;" + d.screenName);

    scrapeItems.append("span")
      .classed("outer-progress", true)
      .append("span")
        .classed("inner-progress", true)
        .style("width", (d) => ((d.callCount === null) ? 0 : (d.completeCount / d.callCount)) * 100 + "%");

    const scrapeRow = scrapeItems.append("span")
      .classed("scrape--table", true)
      .append("span")
        .classed("scrape--row", true);

    scrapeRow.append("span")
      .classed("scrape--left", true)
      .text((d) => formatDate(new Date(d.date), true));

    scrapeRow.append("span")
      .classed("scrape--middle", true)
      .text((d) => {
        if (d.callCount === null) {
          return "";
        }
        return formatDuration((((d.callCount === null) ? 0 : d.callCount) - d.completeCount) * 60000);
      });

    scrapeRow.append("span")
      .classed("scrape--right", true)
      .html((d) => {
        if (d.callCount === null) {
          return browser.i18n.getMessage("popupPending");
        }
        return ((d.callCount === null) ? 0 : d.callCount) + "<span>/</span>" + d.completeCount;
      });

  } else {
    d3.select("#scrape-title").text("");
  }
};

let spinnerDestroyed: boolean = true;
let destroySpinner: () => {};

const loadUpdate = () => {
  getScrapes()
    .then((tempScrapes) => {
      scrapes = tempScrapes.filter((scrape) => !scrape.completed);
      updateList();
      if (!spinnerDestroyed) {
        spinnerDestroyed = true;
        destroySpinner();
        d3.select("#scrape-loader").remove();
      }
    });
};

/*----- Cancel Overlay -----*/

let cancelID = 0;

d3.select("body").append("div")
  .attr("id", "overlay")
  .on("mouseout", () => {
    d3.select("#overlay")
      .style("display", "none");
  })
  .on("click", () => {

    browser.runtime.sendMessage({
      centralNode: scrapes[cancelID].screenName,
      id: scrapes[cancelID].nUuid,
      service: scrapes[cancelID].service,
      type: "removeFromQueue",
    })
    .then((response) => {
      if (response.type === "update") {
        loadUpdate();

        d3.select("#overlay")
          .style("top", 0)
          .style("height", 0)
          .style("display", "none");
      }
    })
    .catch((err) => {
      throw err;
    });

  })
  .append("span")
    .html("<span><img src='../assets/images/popup-action-cancel.png' \
      srcset='../assets/images/popup-action-cancel.png 1x, \
      ../assets/images/popup-action-cancel@2x.png 2x' \
      alt='" + browser.i18n.getMessage("popupCancelLink") + "' ></span><span>"
      + browser.i18n.getMessage("popupCancelLink") + "</span>");

/*----- Link to Vis -----*/

d3.select("#action--text span")
  .text(browser.i18n.getMessage("popupExploreLink"));

d3.select("#action a")
  .on("click", () => {
    browser.tabs.create({
      url: "/html/vis.html",
    }).then((results) => {
      // successful opening options.html
    }, (err) => {
      throw err;
    });
  })
  .on("mouseover", () => {
    d3.select("#overlay")
      .style("display", "none");
  });

/*----- Footer -----*/

d3.select("#footer .right")
  .text(browser.runtime.getManifest().version);

d3.select("#footer .left")
  .append("span")
    .text(browser.i18n.getMessage("settings"))
    .on("click", () => {
      browser.tabs.create({
        url: "/html/options.html",
      }).then((results) => {
        // successful opening options.html
      }, (err) => {
        throw err;
      });
    });

window.addEventListener("DOMContentLoaded", () => {
  destroySpinner = logoSpinner("#scrape-loader", 50);
  spinnerDestroyed = false;
  loadUpdate();
  setInterval(loadUpdate, 15000);
}, false);
