const axios = require("axios");

// ===== WORDPRESS =====
const WP_URL = process.env.WP_URL;
const USER = process.env.USER;
const APP_PASS = process.env.APP_PASS;

// ===== AFFILIATE LINKS =====
const LINKS = [
  "https://collshp.com/shopeviet/category/3541311?view=storefront",
  "https://collshp.com/shopeviet/category/3541342?view=storefront",
  "https://collshp.com/shopeviet/category/3541405?view=storefront",
  "https://collshp.com/shopeviet/category/3682118?view=storefront",
  "https://collshp.com/shopeviet/category/3682155?view=storefront",
  "https://collshp.com/shopeviet/category/3682260?view=storefront"
];

// ===== KEYWORDS =====
const keywords = [
  "áo sơ mi nam",
  "váy nữ đẹp",
  "quần jean nam",
  "thời trang Hàn Quốc",
  "set đồ nữ",
  "áo thun basic"
];

// ===== RANDOM PRODUCT =====
function getPostData() {
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

    <p><b>Danh mục:</b> ${p.keyword}</p>

    <p>
      🔥 Sản phẩm đang giảm giá mạnh, số lượng có hạn.
    </p>

    <h2>Lý do nên xem</h2>
    <ul>
      <li>Hot trend 2026</li>
      <li>Giá tốt</li>
      <li>Nhiều người quan tâm</li>
    </ul>

    <a href="${p.link}" target="_blank">
      👉 XEM NGAY DEAL
    </a>
  `;
}

// ===== POST =====
async function post() {
  const p = getPostData();

  const auth = Buffer.from(`${USER}:${APP_PASS}`).toString("base64");

  try {
    console.log("🚀 POST:", p.title);

    const res = await axios.post(
      WP_URL,
      {
        title: p.title,
        content: buildContent(p),
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
    console.log("❌ ERROR:", err.response?.status || err.message);
  }
}

post();
