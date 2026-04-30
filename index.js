const axios = require("axios");

// ====== ACCESSTRADE API ======
const ACCESS_API = "NFDxa2v8RWD9-PnFVXKu-ivIAJIdul9w";

// ====== WORDPRESS API ======
const WP_URL = "https://picknexa.net/index.php/wp-json/wp/v2/posts";
const WP_USER = "adminPickNexa";
const WP_PASS = "CaKx ax8g tIQk 9JL5 Raeu tR3s";

// ====== CPM ADS ======
const AD_SCRIPT = `<script type='text/javascript' src='//www.profitablecpmratenetwork.com/wky46md4ed?key=0bf214546080c884f5718e571b61c73b'></script>`;

// ====== LAY SAN PHAM TU ACCESSTRADE ======
async function getProducts() {
    try {
        const res = await axios.get("https://api.accesstrade.vn/v1/datafeeds", {
            headers: {
                "Authorization": "Token " + ACCESS_API,
                "Content-Type": "application/json"
            },
            params: {
                limit: 5
            }
        });

        console.log("DATA:", JSON.stringify(res.data));

        if (res.data && res.data.data) {
            return res.data.data;
        } else {
            return [];
        }

    } catch (err) {
        console.log("ACCESSTRADE ERROR:", err.response ? JSON.stringify(err.response.data) : err.message);
        return [];
    }
}

// ====== TAO NOI DUNG BAI VIET ======
function makeContent(product) {

    const buyLink = product.tracking_url || product.aff_link || product.link || "#";
    const image = product.image || product.image_url || "";
    const title = product.name || product.product_name || "Sản phẩm hot hôm nay";
    const price = product.price || product.sale_price || "Liên hệ";

    return `
    ${AD_SCRIPT}

    <h2>${title}</h2>

    <img src="${image}" style="max-width:100%;border-radius:12px;">

    <p><strong>Giá bán:</strong> ${price} VNĐ</p>

    <p>Sản phẩm đang được nhiều người săn đón với ưu đãi cực lớn hôm nay.</p>

    <a href="${buyLink}" target="_blank"
    style="background:red;color:#fff;padding:12px 22px;text-decoration:none;border-radius:6px;font-weight:bold;">
    MUA NGAY GIÁ ƯU ĐÃI
    </a>

    <hr>

    ${AD_SCRIPT}
    `;
}

// ====== DANG BAI LEN WORDPRESS ======
async function postWordpress(title, content) {
    const token = Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");

    await axios.post(WP_URL, {
        title: title,
        content: content,
        status: "publish"
    }, {
        headers: {
            Authorization: `Basic ${token}`,
            "Content-Type": "application/json"
        }
    });

    console.log("Đăng thành công:", title);
}

// ====== CHAY BOT ======
async function runBot() {
    const products = await getProducts();

    if (products.length === 0) {
        console.log("Không lấy được sản phẩm từ ACCESSTRADE");
        return;
    }

    for (let product of products) {

        console.log("PRODUCT:", JSON.stringify(product));

        const html = makeContent(product);
        await postWordpress(product.name || "Sản phẩm hot hôm nay", html);
    }
}

runBot();
