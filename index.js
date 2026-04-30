const axios = require("axios");

const WP_URL = process.env.WP_URL;
const USER = process.env.USER;
const APP_PASS = process.env.APP_PASS;

// ===== FAKE SHOPEE FEED (PROXY SYSTEM) =====
const keywords = [
  "áo sơ mi nam",
  "váy nữ đẹp",
  "quần jean nam",
  "thời trang Hàn Quốc",
  "áo thun basic"
];

// ===== GENERATE PRODUCT DYNAMIC =====
function generateProduct() {
  const kw = keywords[Math.floor(Math.random() * keywords.length)];

  return {
    title: `🔥 ${kw.toUpperCase()} - Sale sốc hôm nay`,
    link: "https://s.shopee.vn/6VKLAmA3sn",
    keyword: kw
  };
}

// ===== CONTENT =====
function buildContent(p) {
  return `
    <h1>${p.title}</h1>

    <p><b>Từ khóa:</b> ${p.keyword}</p>

    <p>
      🔥 Sản phẩm đang hot trend trên Shopee hôm nay.
    </p>

    <h2>Ưu điểm</h2>
    <ul>
      <li>Giá rẻ</li>
      <li>Trending</li>
      <li>Freeship</li>
    </ul>

    <a href="${p.link}" target="_blank">
      👉 XEM DEAL SHOPEE
    </a>
  `;
}

// ===== POST WORDPRESS =====
async function post() {
  const product = generateProduct();

  const auth = Buffer.from(`${USER}:${APP_PASS}`).toString("base64");

  try {
    console.log("👉 POST:", product.title);

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

    console.log("✅ SUCCESS:", res.data.id);
  } catch (err) {
    console.log("❌ ERROR:", err.response?.status, err.message);
  }
}

// ===== RUN =====
async function run() {
  console.log("🚀 AUTO SHOPEE ENGINE START");

  await post();

  console.log("🎯 DONE");
}

run();
