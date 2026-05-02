const xmlrpc = require("wordpress-xmlrpc");
const client = xmlrpc.createClient({
  url: "https://picknexa.net/xmlrpc.php",
  username: "adminPickNexa",
  password: "GJEY Sr5W bHeo wk8Y Pp75 nOl7"
});

const AFF_LINK =
  "https://fast.accesstrade.com.vn/deep_link/v6/6969678484958443485/5087153089503673507?sub4=oneatweb&url_enc=aHR0cHM6Ly93d3cubGF6YWRhLnZuLz9yZWZlcmVyPWF0LWtvbA%3D%3D";

const keywords = [
  "áo sơ mi nam",
  "váy nữ đẹp",
  "quần jean nam",
  "đầm nữ cao cấp",
  "set đồ hot trend"
];

function makePost() {
  const kw = keywords[Math.floor(Math.random() * keywords.length)];
  return {
    title: `🔥 ${kw.toUpperCase()} - Deal hot hôm nay`,
    description: `
      <h1>🔥 ${kw.toUpperCase()} - Deal hot hôm nay</h1>
      <p>Sản phẩm đang giảm giá mạnh, cập nhật xu hướng mới nhất.</p>
      <ul>
        <li>Giá ưu đãi</li>
        <li>Mẫu đẹp dễ phối</li>
        <li>Được săn nhiều</li>
      </ul>
      <p><a href="${AFF_LINK}" target="_blank">👉 XEM DEAL NGAY</a></p>
    `
  };
}

const post = makePost();

console.log("🚀 Đang đăng:", post.title);

client.newPost(
  {
    title: post.title,
    content: post.description,
    status: "publish"
  },
  function(err, id) {
    if (err) {
      console.log("❌ XMLRPC ERROR:", err);
    } else {
      console.log("✅ Đăng thành công ID:", id);
    }
  }
);
