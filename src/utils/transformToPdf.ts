import chromium from "chrome-aws-lambda";

export default async (content_html: string): Promise<Buffer> => {
  let executablePath = await chromium.executablePath;

  console.log("==> transformToPDf was called");

  const browser = await chromium.puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath,
    headless: true,
    ignoreHTTPSErrors: true,
  });

  const page = await browser.newPage();

  console.log("==> transformToPDf created new page");

  await page.setContent(content_html);

  console.log("==> transformToPDf set content");

  const pdf = await page.pdf({
    format: "a4",
    landscape: true,
    path: process.env.IS_OFFLINE ? `cert-${Date.now()}.pdf` : null,
    printBackground: true,
    preferCSSPageSize: true,
  });

  console.log("==> transformToPDf created a PDF");

  await browser.close();

  console.log("==> transformToPDf close browser and return it");

  return pdf;
};
