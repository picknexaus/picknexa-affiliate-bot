const axios = require("axios");

// ===== WORDPRESS LOGIN THẬT =====
const WP_URL = "https://picknexa.net/wp-json/wp/v2/posts";
const USER = "adminPickNexa";
const APP_PASS = "GJEY Sr5W bHeo wk8Y Pp75 nOl7"; // mật khẩu admin hiện tại

// ===== ACCESSTRADE LINK =====
const AFF_LINK =
  "https://fast.accesstrade.com.vn/deep_link/v6/6969678484958443485/5087153089503673507?sub4=oneatweb&url_enc=aHR0cHM6Ly93d3cubGF6YWRhLnZuLz9yZWZlcmVyPWF0LWtvbA%3D%3D";

// ===== KEYWORDS =====
const keywords = [
  "áo sơ mi nam",
  "váy nữ đẹp",
  "quần jean nam",
  "set đồ nữ hot",
  "thời trang công sở",
  "đầm nữ cao cấp"
];

function makePost() {
  const kw = keywords[Math.floor(Math.random() * keywords.length)];

  return {
    title: `🔥 ${kw.toUpperCase()} - Deal hot hôm nay`,
    content: `
      <h1>🔥 ${kw.toUpperCase()} - Deal hot hôm nay</h1>

      <p>Sản phẩm đang được quan tâm rất nhiều trên thị trường.</p>

      <ul>
        <li>Giá đang giảm sâu</li>
        <li>Mẫu mã hot trend</li>
        <li>Số lượng có hạn</li>
      </ul>

      <p>
        <a href="${AFF_LINK}" target="_blank">👉 XEM CHI TIẾT DEAL TẠI ĐÂY</a>
      </p>
    `
  };
}

async function postToWP() {
  const p = makePost();

  const auth = Buffer.from(`${USER}:${APP_PASS}`).toString("base64");

  try {
    console.log("🚀 Đang đăng:", p.title);

    const res = await axios.post(
      WP_URL,
      {
        title: p.title,
        content: p.content,
        status: "publish"
      },
      {
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json"
        },
        timeout: 15000
      }
    );

    console.log("✅ Đăng thành công ID:", res.data.id);
  } catch (err) {
    console.log("❌ Lỗi:", err.response?.status, err.response?.data || err.message);
  }
}

postToWP();
