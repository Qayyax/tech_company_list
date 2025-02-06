import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";

const saveAsJSON = (companies) => {
    const filePath = path.resolve("techreviewerComp.json");
    fs.writeFileSync(filePath, JSON.stringify(companies, null, 2), "utf-8");
    console.log(`Data saved to ${filePath}`);
};

const saveAsCSV = (companies) => {
    const filePath = path.resolve("techreviewerComp.csv");
    const csvContent = companies.map((c) => `${c.name},${c.website}`).join("\n");
    const header = "Company Name,Website\n";
    fs.writeFileSync(filePath, header + csvContent, "utf-8");
    console.log(`Data saved to ${filePath}`);
};

(async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // Navigate to the initial page
    await page.goto(
        "https://techreviewer.co/top-software-development-companies/canada",
        { waitUntil: "networkidle2" },
    );

    const companies = [];

    // Function to extract data from the current page
    const extractCompanies = async () => {
        // Wait for the company list container
        await page.waitForSelector(".company-item__top");

        // Extract company names and websites
        const pageData = await page.evaluate(() => {
            const companyElements = document.querySelectorAll(".company-item__top");
            const data = [];

            companyElements.forEach((el) => {
                let name =
                    el.querySelector(".company-item__list-name")?.innerText.trim() ||
                    "N/A";
                let website =
                    el.querySelector(".list-item__visit-website")?.href || "N/A";
                name = name.replace(/\n\n.*$/, ""); // Remove \n\n and everything after it
                website = website.split("?")[0];
                data.push({ name, website });
            });

            return data;
        });

        companies.push(...pageData);
    };

    // Scrape data from the first page
    await extractCompanies();

    // Pagination loop
    while (true) {
        // Check for the "Next" button
        const nextButton = await page.$("a[rel='next']");

        if (nextButton) {
            // Click the "Next" button and wait for navigation
            await Promise.all([
                nextButton.click(),
                page.waitForNavigation({ waitUntil: "networkidle2" }),
            ]);
            await extractCompanies();
        } else {
            break;
        }
    }

    // Output the collected data
    console.log(companies);

    saveAsCSV(companies);
    saveAsJSON(companies);

    await browser.close();
})();
