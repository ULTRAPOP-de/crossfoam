import * as cfData from "@crossfoam/data";
import { services } from "@crossfoam/services";

Object.keys(services).forEach((serviceKey) => {

    document.getElementById("options--services").innerHTML = `<div class='services--service-container'>\
        <h3>${services[serviceKey].config.service_name}</h3>\
        <div id='services--service-${serviceKey}'></div>`;

    services[serviceKey].createOptions(document.getElementById(`services--service-${serviceKey}`));

});

cfData.get("config--siteAnalysis", "true")
  .then((state) => {
    const checkbox: HTMLInputElement = document.getElementById("siteAnalysis") as HTMLInputElement;
    if (state === "false") {
      checkbox.checked = false;
    } else {
      checkbox.checked = true;
    }
    checkbox.addEventListener( "change", () => {
      if (checkbox.checked) {
        cfData.set("config--siteAnalysis", "true");
      } else {
        cfData.set("config--siteAnalysis", "false");
      }
    });
  });

cfData.get("config--showLabels", "true")
  .then((state) => {
    const checkbox: HTMLInputElement = document.getElementById("showLabels") as HTMLInputElement;
    if (state === "false") {
      checkbox.checked = false;
    } else {
      checkbox.checked = true;
    }
    checkbox.addEventListener( "change", () => {
      if (checkbox.checked) {
        cfData.set("config--showLabels", "true");
      } else {
        cfData.set("config--showLabels", "false");
      }
    });
  });
