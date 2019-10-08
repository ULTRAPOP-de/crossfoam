document.getElementById("clicker").addEventListener("click", () => {
  browser.tabs.create({
    url: "/html/options.html",
  }).then((results) => {
    // successful opening options.html
  }, (err) => {
    throw err;
  });
});
