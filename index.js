const fs = require("fs");
const axios = require("axios");

const AFF_LINK = "https://fast.accesstrade.com.vn/deep_link/v6/6969678484958443485/5087153089503673507?sub4=oneatweb&url_enc=aHR0cHM6Ly93d3cubGF6YWRhLnZuLz9yZWZlcmVyPWF0LWtvbA%3D%3D";

const keywords = [
  "áo sơ mi nam",
  "váy nữ đẹp",
  "quần jean nam",
  "đầm nữ cao cấp",
  "set đồ nữ hot trend",
  "thời trang nữ công sở"
];

function makePost(){
  const kw = keywords[Math.floor(Math.random() * keywords.length)];
  return {
    title: `🔥 ${kw.toUpperCase()} - Deal hot hôm nay`,
    content: `
      <h1>🔥 ${kw.toUpperCase()} - Deal hot hôm nay</h1>
      <p>Sản phẩm đang được săn đón mạnh với mức giá cực kỳ ưu đãi.</p>
      <ul>
        <li>Mẫu mới hot trend</li>
        <li>Chất liệu đẹp</li>
        <li>Giá đang giảm sâu</li>
      </ul>
      <p><a href="${AFF_LINK}" target="_blank">👉 XEM CHI TIẾT DEAL TẠI ĐÂY</a></p>
    `
  };
}

async function run(){
  const post = makePost();

  fs.writeFileSync("post-data.json", JSON.stringify(post));

  const RAW_URL = "https://raw.githubusercontent.com/picknexaus/picknexa-affiliate-bot/main/post-data.json";

  const call = `https://picknexa.net/importer.php?key=post123abc&url=${encodeURIComponent(RAW_URL)}`;

  console.log("🚀 Trigger:", call);

  try{
    const res = await axios.get(call,{timeout:30000});
    console.log("✅ RESULT:", res.data);
  }catch(e){
    console.log("❌ ERROR:", e.message);
  }
}

run();
