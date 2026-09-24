import puppeteer from "puppeteer";

interface RenderData {
  headline: string;
  name: string;
  designation: string;
  party?: string;
  organization?: string;
  district?: string;
  photos: string[];
  layout: any;
}

export const renderPoster = async (
  data: RenderData
) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox"
    ]
  });

  try {
    const page = await browser.newPage();

    await page.setViewport({
      width: 1200,
      height: 1600,
      deviceScaleFactor: 2
    });

    const photos = data.photos
      .map(
        (photo) =>
          `<img src="${photo}" class="leader-photo" />`
      )
      .join("");

    const html = `
      <!DOCTYPE html>
      <html lang="bn">
      <head>

        <meta charset="UTF-8" />

        <style>

          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            padding: 0;
            font-family:
              "Noto Sans Bengali",
              "Noto Sans",
              sans-serif;
          }

          .poster {
            width: 1200px;
            height: 1600px;
            position: relative;
            overflow: hidden;

            background:
              linear-gradient(
                135deg,
                #006a4e,
                #008f68,
                #f4f4f4
              );

            color: #ffffff;
          }

          .top-decoration {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 90px;

            background:
              linear-gradient(
                to right,
                #006a4e,
                #f42a41,
                #006a4e
              );
          }

          .headline {
            position: absolute;
            top: 130px;
            left: 60px;
            right: 60px;

            text-align: center;

            font-size: 78px;
            font-weight: 900;
            line-height: 1.2;

            color: #ffffff;

            text-shadow:
              3px 3px 0 #006a4e,
              6px 6px 15px rgba(0,0,0,.4);
          }

          .photos {
            position: absolute;
            top: 420px;
            left: 50px;
            right: 50px;

            display: flex;
            justify-content: center;
            gap: 25px;
          }

          .leader-photo {
            width: 320px;
            height: 400px;

            object-fit: cover;

            border: 10px solid white;
            border-radius: 20px;

            box-shadow:
              0 10px 25px
              rgba(0,0,0,.3);
          }

          .content {
            position: absolute;

            left: 70px;
            right: 70px;
            bottom: 300px;

            text-align: center;
          }

          .name {
            font-size: 54px;
            font-weight: 800;
          }

          .designation {
            margin-top: 20px;
            font-size: 34px;
          }

          .organization {
            margin-top: 15px;
            font-size: 30px;
          }

          .footer {
            position: absolute;

            bottom: 0;
            left: 0;

            width: 100%;
            height: 220px;

            display: flex;
            flex-direction: column;

            justify-content: center;
            align-items: center;

            background: #111827;

            border-top:
              8px solid #f42a41;
          }

          .campaign {
            font-size: 28px;
            margin-bottom: 15px;
          }

          .credit {
            font-size: 25px;
            color: #d1d5db;
          }

        </style>

      </head>

      <body>

        <div class="poster">

          <div class="top-decoration"></div>

          <div class="headline">
            ${escapeHtml(data.headline)}
          </div>

          <div class="photos">
            ${photos}
          </div>

          <div class="content">

            <div class="name">
              ${escapeHtml(data.name)}
            </div>

            <div class="designation">
              ${escapeHtml(data.designation)}
            </div>

            ${
              data.organization ||
              data.party ||
              data.district
                ? `
                  <div class="organization">
                    ${escapeHtml(
                      [
                        data.organization,
                        data.party,
                        data.district
                      ]
                        .filter(Boolean)
                        .join(" • ")
                    )}
                  </div>
                `
                : ""
            }

          </div>

          <div class="footer">

            <div class="campaign">
              প্রচারে: ${escapeHtml(data.name)}
            </div>

            <div class="credit">
              AI Political Poster Maker
            </div>

          </div>

        </div>

      </body>
      </html>
    `;

//     await page.setContent(html, {
//       waitUntil: "networkidle0"
//     });

    const buffer = await page.screenshot({
      type: "png",
      fullPage: true
    });

    return buffer;
  } finally {
    await browser.close();
  }
};

const escapeHtml = (value: string) => {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};