const axios = require("axios");

// ===== WORDPRESS =====
const WP_URL = process.env.WP_URL;
const USER = process.env.USER;
const APP_PASS = process.env.APP_PASS;

// ===== PRODUCTS =====
const products = [
  {
    title: "🔥 Tai nghe Bluetooth giảm giá sốc",
    link: "https://s.shopee.vn/6VKLAmA3sn",
    keyword: "tai nghe bluetooth"
  },
  {
    title: "⚡ Nồi chiên không dầu hot trend",
    link: "https://s.shopee.vn/6VKLAmA3sn",
    keyword: "nồi chiên không dầu"
  }
];

// ===== CONTENT =====
function buildContent(p) {
  return `
    <h1>${p.title}</h1>

    <p><b>Từ khóa:</b> ${p.keyword}</p>

    <p>Sản phẩm đang giảm giá mạnh hôm nay.</p>

    <a href="${p.link}" target="_blank">👉 MUA NGAY</a>
  `;
}

// ===== POST =====
async function post(p) {
  const auth = Buffer.from(`${USER}:${APP_PASS}`).toString("base64");

  try {
    console.log("👉 TRY POST:", p.title);

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

    console.log("✅ POST SUCCESS:", res.data.id);
  } catch (err) {
    console.log("❌ ERROR:");
    console.log(err.response?.status);
    console.log(err.response?.data || err.message);
  }
}

// ===== RUN =====
async function run() {
  console.log("🚀 BOT START");

  for (const p of products) {
    await post(p);
  }

  console.log("🎯 DONE");
}

run();
  
