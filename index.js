const axios = require("axios");

// ===== CONFIG =====
const ACCESS_API = "NFDxa2v8RWD9-PnFVXKu-ivIAJIdul9w";
const WP_POST_URL = "https://picknexa.net/index.php/wp-json/wp/v2/posts";
const WP_MEDIA_URL = "https://picknexa.net/index.php/wp-json/wp/v2/media";
const WP_CAT_URL = "https://picknexa.net/index.php/wp-json/wp/v2/categories";
const WP_TAG_URL = "https://picknexa.net/index.php/wp-json/wp/v2/tags";

const WP_USER = "adminPickNexa";
const WP_PASS = "CaKx ax8g tIQk 9JL5 Raeu tR3s";

const AD_SCRIPT = `<script type='text/javascript' src='//www.profitablecpmratenetwork.com/wky46md4ed?key=0bf214546080c884f5718e571b61c73b'></script>`;
const token = Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");

// ===== RANDOM TITLE =====
function seoTitle(name){
    const hooks = [
        "Deal Hot Hôm Nay",
        "Khuyến Mãi Cực Sốc",
        "Giá Tốt Không Ngờ",
        "Sản Phẩm Được Săn Đón",
        "Flash Sale Hấp Dẫn"
    ];
    return `${hooks[Math.floor(Math.random()*hooks.length)]}: ${name}`;
}

// ===== RANDOM CONTENT BLOCK =====
function randomIntro(name){
    const arr = [
        `${name} hiện đang trở thành lựa chọn hàng đầu của nhiều người tiêu dùng nhờ mức giá cực kỳ hấp dẫn và chất lượng ổn định.`,
        `Trong thời gian gần đây, ${name} liên tục nằm trong danh sách sản phẩm bán chạy nhờ thiết kế tiện lợi và độ bền cao.`,
        `${name} là sản phẩm đang được đông đảo khách hàng quan tâm bởi ưu đãi lớn cùng khả năng sử dụng linh hoạt.`
    ];
    return arr[Math.floor(Math.random()*arr.length)];
}

// ===== SLUG =====
function makeSlug(text){
    return text.toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g,"d")
        .replace(/[^a-z0-9 ]/g,"")
        .replace(/\s+/g,"-")
        .substring(0,80);
}

// ===== GET PRODUCTS =====
async function getProducts(){
    try{
        const res = await axios.get("https://api.accesstrade.vn/v1/datafeeds",{
            headers:{
                "Authorization":"Token "+ACCESS_API,
                "Content-Type":"application/json"
            },
            params:{limit:15}
        });

        let items = [];

        if(res.data && res.data.data){
            items = res.data.data.filter(p=>{
                const link = p.tracking_url || p.url_tracking || p.aff_link || "";
                return link.includes("go.isclix.com");
            });
        }

        console.log("VALID:", items.length);
        return items.slice(0,5);

    }catch(err){
        console.log("AT ERROR:", err.response ? JSON.stringify(err.response.data) : err.message);
        return [];
    }
}

// ===== CREATE CATEGORY =====
async function ensureCategory(name="Deal Hot"){
    try{
        const res = await axios.post(WP_CAT_URL,{
            name:name
        },{
            headers:{
                Authorization:`Basic ${token}`,
                "Content-Type":"application/json"
            }
        });
        return res.data.id;
    }catch{
        return 1;
    }
}

// ===== CREATE TAG =====
async function ensureTag(name){
    try{
        const res = await axios.post(WP_TAG_URL,{
            name:name
        },{
            headers:{
                Authorization:`Basic ${token}`,
                "Content-Type":"application/json"
            }
        });
        return [res.data.id];
    }catch{
        return [];
    }
}

// ===== UPLOAD IMAGE =====
async function uploadImage(imageUrl,title){
    try{
        const img = await axios.get(imageUrl,{responseType:"arraybuffer"});
        const res = await axios.post(WP_MEDIA_URL,img.data,{
            headers:{
                Authorization:`Basic ${token}`,
                "Content-Disposition":`attachment; filename="${makeSlug(title)}.jpg"`,
                "Content-Type":"image/jpeg"
            }
        });
        return res.data.id;
    }catch{
        return null;
    }
}

// ===== CONTENT =====
function makeContent(product){
    const buyLink = product.tracking_url || product.url_tracking || product.aff_link;
    const image = product.image || product.image_url || "";
    const title = product.name || "Sản phẩm hot hôm nay";
    const price = product.price || product.sale_price || "Liên hệ";

    return `
    ${AD_SCRIPT}

    <div style="max-width:760px;margin:auto;font-family:Arial;line-height:1.8;color:#222;">
        <h1>${seoTitle(title)}</h1>

        <img src="${image}" style="width:100%;border-radius:14px;box-shadow:0 0 15px rgba(0,0,0,.15);margin-bottom:20px;">

        <div style="background:#fff4f4;border:1px solid #ffb8b8;padding:18px;border-radius:12px;">
            <p style="font-size:24px;color:red;font-weight:bold;">🔥 Giá ưu đãi hôm nay: ${price} VNĐ</p>
            <p>✔ Chính hãng ✔ Được săn đón ✔ Flash sale số lượng giới hạn</p>
        </div>

        <p>${randomIntro(title)}</p>

        <p>Sản phẩm sở hữu nhiều điểm nổi bật cả về thiết kế lẫn công năng sử dụng. Với mức giá đang được giảm sâu, đây là thời điểm cực kỳ thích hợp để người dùng lựa chọn nhằm tiết kiệm chi phí tối đa.</p>

        <h3>⭐ Những lý do nên chọn mua:</h3>
        <ul>
            <li>Thiết kế đẹp mắt, hiện đại</li>
            <li>Chất lượng hoàn thiện tốt</li>
            <li>Giá thành cạnh tranh hơn thị trường</li>
            <li>Nhiều phản hồi tích cực từ người mua</li>
        </ul>

        <div style="text-align:center;margin:35px 0;">
            <a href="${buyLink}" target="_blank"
            style="background:#e60000;color:#fff;padding:16px 35px;text-decoration:none;border-radius:10px;font-size:20px;font-weight:bold;">
            🛒 MUA NGAY GIÁ TỐT NHẤT
            </a>
        </div>

        <p><b>Xem thêm:</b> Nhiều deal hot khác đang được cập nhật liên tục tại PickNexa giúp bạn không bỏ lỡ những ưu đãi hấp dẫn nhất mỗi ngày.</p>

        <script type="application/ld+json">
        {
          "@context":"https://schema.org",
          "@type":"Article",
          "headline":"${seoTitle(title)}",
          "author":{"@type":"Organization","name":"PickNexa"},
          "image":"${image}"
        }
        </script>
    </div>

    ${AD_SCRIPT}
    `;
}

// ===== POST WORDPRESS =====
async function postWordpress(title,content,featuredId,catId,tags){
    await axios.post(WP_POST_URL,{
        title:seoTitle(title),
        slug:makeSlug(title+"-"+Date.now()),
        excerpt:`Cập nhật ưu đãi mới nhất cho ${title} với mức giá cực kỳ hấp dẫn hôm nay.`,
        content:content,
        featured_media:featuredId,
        categories:[catId],
        tags:tags,
        status:"publish"
    },{
        headers:{
            Authorization:`Basic ${token}`,
            "Content-Type":"application/json"
        }
    });

    console.log("POSTED:", title);
}

// ===== RUN =====
async function runBot(){
    const products = await getProducts();

    if(products.length===0){
        console.log("NO VALID PRODUCTS");
        return;
    }

    const catId = await ensureCategory("Deal Hot");

    for(let product of products){
        const title = product.name || "Sản phẩm hot hôm nay";
        const image = product.image || product.image_url || "";
        const featuredId = await uploadImage(image,title);
        const tags = await ensureTag(title);
        const html = makeContent(product);

        await postWordpress(title,html,featuredId,catId,tags);
    }
}

runBot();
