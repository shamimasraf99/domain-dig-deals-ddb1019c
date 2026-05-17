const puppeteer = require("puppeteer");
const fs = require("fs");

async function scrapeDomains() {

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"]
  });

  const page = await browser.newPage();

  await page.goto("https://domainoffer.net/", {
    waitUntil: "networkidle2"
  });

  await page.waitForSelector("table");

  const domains = await page.evaluate(() => {

    const rows = document.querySelectorAll("table tbody tr");

    return Array.from(rows).map(row => {

      const cols = row.querySelectorAll("td");

      return {
        domain: cols[0]?.innerText.trim() || "",
        registrar: cols[1]?.innerText.trim() || "",
        price: cols[2]?.innerText.trim() || "",
        coupon_code: cols[3]?.innerText.trim() || "",
        registration_price: cols[4]?.innerText.trim() || "",
        transfer_price: cols[5]?.innerText.trim() || "",
        renewal_price: cols[6]?.innerText.trim() || ""
      };

    });

  });

  fs.writeFileSync(
    "./public/domains.json",
    JSON.stringify(domains, null, 2)
  );

  console.log("Scraping Complete");

  await browser.close();
}

scrapeDomains();
