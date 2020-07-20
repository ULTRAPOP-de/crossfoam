import { modal } from "@crossfoam/ui-helpers";

(() => {

  if (browser) {
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
  }

  return true;

})();
