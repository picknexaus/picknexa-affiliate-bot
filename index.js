const axios = require("axios");

// ===== WORDPRESS =====
const WP_URL = process.env.WP_URL;
const USER = process.env.USER;
const APP_PASS = process.env.APP_PASS;

// ===== 6 AFFILIATE LINKS =====
const LINKS = [
  "https://collshp.com/shopeviet/category/3541311?view=storefront",
  "https://collshp.com/shopeviet/category/3541342?view=storefront",
  "https://collshp.com/shopeviet/category/3541405?view=storefront",
  "https://collshp.com/shopeviet/category/3682118?view=storefront",
  "https://collshp.com/shopeviet/category/3682155?view=storefront",
  "https://collshp.com/shopeviet/category/3682260?view=storefront"
];

// ===== KEYWORDS (QUẦN ÁO) =====
const keywords = [
  "áo sơ mi nam",
  "váy nữ đẹp",
  "quần jean nam",
  "thời trang Hàn Quốc",
  "áo thun basic",
  "set đồ nữ hot trend"
];

// ===== RANDOM PRODUCT =====
function generatePost() {
  const kw = keywords[Math.floor(Math.random() * keywords.length)];
  const link = LINKS[Math.floor(Math.random() * LINKS.length)];

  return {
    title: `🔥 ${kw.toUpperCase()} - Deal hot hôm nay`,
    keyword: kw,
    link: link
  };
}

// ===== CONTENT =====
function buildContent(p) {
  return `
    <h1>${p.title}</h1>

    <p><b>Từ khóa:</b> ${p.keyword}</p>

    <p>
      🔥 Sản phẩm thời trang đang giảm giá mạnh hôm nay.
      Số lượng có hạn.
    </p>

    <h2>Ưu điểm</h2>
    <ul>
      <li>Giá tốt</li>
      <li>Hot trend</li>
      <li>Freeship (tùy shop)</li>
    </ul>

    <a href="${p.link}" target="_blank">
      👉 XEM NGAY DEAL
    </a>
  `;
}

// ===== POST WORDPRESS =====
async function post() {
  const product = generatePost();

  const auth = Buffer.from(`${USER}:${APP_PASS}`).toString("base64");

  try {
    console.log("👉 POST:", product.title);
    console.log("🔗 LINK:", product.link);

    const res = await axios.post(
      WP_URL,
      {
        title: product.title,
        content: buildContent(product),
        status: "publish"
      },
      {
        headers: {
          Authorization: `Basic ${auth}`
        }
      }
    );

    console.log("✅ SUCCESS ID:", res.data.id);
  } catch (err) {
    console.log("❌ ERROR:", err.response?.status, err.message);
  }
}

// ===== RUN =====
async function run() {
  console.log("🚀 AUTO AFFILIATE SYSTEM START");

  await post();

  console.log("🎯 DONE");
}

run();
