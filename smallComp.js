import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";

import { saveAsJSON } from "./techreviewer.js";

const saveAsCSV = (companies, filename) => {
    const filePath = path.resolve(filename);
    const csvContent = companies
        .map(
            (c) =>
                `${c.name},${c.Website},${c.Crunchbase},${c.Twitter},${c.Facebook},${c.Linkedin}`,
        )
        .join("\n");
    const header = "Company_name,Website,Crunchbase,Twitter,Facebook,Linkedin\n";
    fs.writeFileSync(filePath, header + csvContent, "utf-8");
    console.log(`Data saved to ${filePath}`);
};

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(
        "https://beststartup.ca/101-top-small-and-medium-businesses-startups-and-companies-in-canada/",
        { waitUntil: "networkidle0" },
    );
    await page.waitForSelector(".wp-block-cover-is-layout-flow");

    const companies = [];

    const pageData = await page.evaluate(() => {
        const companyElements = document.querySelectorAll(
            ".wp-block-cover-is-layout-flow",
        );
        const data = [];
        companyElements.forEach((el) => {
            let name = el.querySelector("strong")?.innerText.trim() || "N/A";
            const linksEl = el.querySelector("p");
            const links = linksEl.querySelectorAll("a");
            const websiteData = {};
            links.forEach((a) => {
                const text = a?.innerText.trim();

                websiteData[text] =
                    a?.href.trim() ===
                        "https://beststartup.ca/101-top-small-and-medium-businesses-startups-and-companies-in-canada/"
                        ? "N/A"
                        : a.href.trim();
            });
            data.push({ name, ...websiteData });
        });
        return data;
    });
    companies.push(...pageData);
    saveAsJSON(companies, "beststartup.json");
    saveAsCSV(companies, "beststartup.csv");

    await browser.close();
})();
