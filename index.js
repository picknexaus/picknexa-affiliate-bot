const axios = require("axios");

// ===== WORDPRESS =====
const WP_URL = process.env.WP_URL;
const USER = process.env.USER;
const APP_PASS = process.env.APP_PASS;

// ===== ACCESSTRADE LINK =====
const AFF_LINK =
  "https://fast.accesstrade.com.vn/deep_link/v6/6969678484958443485/5087153089503673507?sub4=oneatweb&url_enc=aHR0cHM6Ly93d3cubGF6YWRhLnZuLz9yZWZlcmVyPWF0LWtvbA%3D%3D";

// ===== TRACKING MEMORY (tạm thời RAM) =====
let tracking = {
  clicks: 0,
  posts: 0
};

// ===== KEYWORDS =====
const keywords = [
  "thời trang nam",
  "thời trang nữ",
  "váy đẹp",
  "áo sơ mi",
  "quần jean",
  "set đồ hot trend"
];

// ===== AI CONTENT =====
function generate() {
  const kw = keywords[Math.floor(Math.random() * keywords.length)];

  return {
    title: `🔥 ${kw.toUpperCase()} - Xu hướng bán chạy`,
    keyword: kw,
    link: AFF_LINK
  };
}

// ===== TRACKING LINK WRAPPER =====
function trackLink(url) {
  tracking.clicks++;
  console.log("📊 CLICK COUNT:", tracking.clicks);
  return url;
}

// ===== CONTENT =====
function buildContent(p) {
  return `
    <h1>${p.title}</h1>

    <p><b>Danh mục:</b> ${p.keyword}</p>

    <p>
      🔥 Sản phẩm đang trend mạnh trên thị trường affiliate.
    </p>

    <h2>Lý do nên xem</h2>
    <ul>
      <li>Hot trend</li>
      <li>Giá tốt</li>
      <li>Nhiều người quan tâm</li>
    </ul>

    <a href="${trackLink(p.link)}" target="_blank">
      👉 XEM NGAY DEAL
    </a>
  `;
}

// ===== POST WORDPRESS =====
async function post() {
  const p = generate();
  tracking.posts++;

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

    console.log("✅ POST ID:", res.data.id);
    console.log("📦 TOTAL POSTS:", tracking.posts);
  } catch (err) {
    console.log("❌ ERROR:", err.response?.status || err.message);
  }
}

post();
