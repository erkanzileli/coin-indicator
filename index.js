const { app, Menu, Tray } = require("electron");
const fetch = require("electron-fetch").default;

const API_KEY = "";
const COINS = ["BTC", "ETH", "SBR", "SUNNY", "DOGE", "PORT", "AVAX"];

let tray = null;

app.dock.hide();

app.whenReady().then(async () => {
  tray = new Tray(
    "/Users/erkan.zileli/workspace/fun/coin-indicator/coin-10-16.png"
  );

  await updatePricesAndMenuItems();

  setInterval(async () => {
    await updatePricesAndMenuItems();
  }, 3 * 60 * 1000);
});

async function updatePricesAndMenuItems() {
  updateMenuItems(getFormattedCoinPriceMap(await retrieveData()));
}

function getFormattedCoinPriceMap(data) {
  return Object.keys(data).reduce(
    (acc, coin) => ({
      ...acc,
      [coin]: data[coin].quote.USD.price.toFixed(2),
    }),
    {}
  );
}

function updateMenuItems(data) {
  tray.setContextMenu(
    Menu.buildFromTemplate([
      ...Object.keys(data).map((coin) => ({
        label: `${coin} - ${data[coin]}`,
        type: "normal",
      })),
      { type: "separator" },
      { label: "Quit", type: "normal", click: () => app.quit() },
    ])
  );
}

async function retrieveData() {
  return fetch(
    `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${COINS}`,
    {
      method: "GET",
      headers: {
        "X-CMC_PRO_API_KEY": API_KEY,
      },
    }
  )
    .then((resp) => resp.json())
    .then((respBody) => respBody.data);
}
