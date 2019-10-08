import { services } from "@crossfoam/services";

Object.keys(services).forEach((serviceKey) => {

    document.getElementById("options--services").innerHTML = `<div class='services--service-container'>\
        <h3>${services[serviceKey].config.service_name}</h3>\
        <div id='services--service-${serviceKey}'></div>`;

    services[serviceKey].createOptions(document.getElementById(`services--service-${serviceKey}`));

});
