const axios = require("axios");

const WP_URL = "https://picknexa.net/wp-json/wp/v2/posts";
const USER = "adminPickNexa";
const PASS = "GJEY Sr5W bHeo wk8Y Pp75 nOl7";

const AFF_LINK = "https://fast.accesstrade.com.vn/deep_link/v6/6969678484958443485/5087153089503673507?sub4=oneatweb&url_enc=aHR0cHM6Ly93d3cubGF6YWRhLnZuLz9yZWZlcmVyPWF0LWtvbA%3D%3D";

const keywords = [
  "áo sơ mi nam",
  "váy nữ đẹp",
  "quần jean nam",
  "đầm nữ cao cấp",
  "set đồ nữ hot"
];

function sleep(ms){
  return new Promise(r => setTimeout(r, ms));
}

function makePost(){
  const kw = keywords[Math.floor(Math.random() * keywords.length)];
  return {
    title: `🔥 ${kw.toUpperCase()} - Deal hot hôm nay`,
    content: `
      <h1>${kw.toUpperCase()} - Deal hot hôm nay</h1>
      <p>Sản phẩm đang giảm giá mạnh và được nhiều người quan tâm.</p>
      <ul>
        <li>Mẫu mới</li>
        <li>Giá ưu đãi</li>
        <li>Hot trend</li>
      </ul>
      <p><a href="${AFF_LINK}" target="_blank">👉 XEM DEAL NGAY</a></p>
    `
  };
}

async function run(){
  await sleep(5000);

  const p = makePost();
  const auth = Buffer.from(`${USER}:${PASS}`).toString("base64");

  try{
    console.log("🚀 Đang đăng:", p.title);

    const res = await axios.post(
      WP_URL,
      {
        title: p.title,
        content: p.content,
        status: "publish"
      },
      {
        timeout: 60000,
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0 Bot"
        }
      }
    );

    console.log("✅ SUCCESS POST ID:", res.data.id);

  }catch(err){
    console.log("❌ POST ERROR:", err.response?.status || err.message);
    console.log(err.response?.data || "");
  }
}

run();
