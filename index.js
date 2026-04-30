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

// ===== TITLE =====
function seoTitle(name){
    const hooks = [
        "Deal Lazada Hôm Nay",
        "Flash Sale Lazada",
        "Giá Sốc Từ Lazada",
        "Săn Deal Lazada Cực Hot"
    ];
    return `${hooks[Math.floor(Math.random()*hooks.length)]}: ${name}`;
}

function randomIntro(name){
    const arr = [
        `${name} đang là một trong những sản phẩm bán chạy nổi bật trên Lazada với mức giảm giá hấp dẫn.`,
        `Người mua trên Lazada đang săn đón ${name} nhờ ưu đãi tốt và chất lượng ổn định.`,
        `${name} hiện xuất hiện trong danh sách deal hot Lazada được quan tâm nhiều hôm nay.`
    ];
    return arr[Math.floor(Math.random()*arr.length)];
}

function makeSlug(text){
    return text.toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g,"d")
        .replace(/[^a-z0-9 ]/g,"")
        .replace(/\s+/g,"-")
        .substring(0,80);
}

// ===== GET LAZADA PRODUCTS ONLY =====
async function getProducts(){
    try{
        const res = await axios.get("https://api.accesstrade.vn/v1/datafeeds",{
            headers:{
                "Authorization":"Token "+ACCESS_API,
                "Content-Type":"application/json"
            },
            params:{
                campaign:"lazada",
                limit:15
            }
        });

        let items = [];

        if(res.data && res.data.data){
            items = res.data.data.filter(p=>{
                const link = p.tracking_url || p.url_tracking || p.aff_link || "";
                return link.includes("lazada") || link.includes("go.isclix") || link.includes("c.lazada");
            });
        }

        console.log("LAZADA VALID:", items.length);
        return items.slice(0,5);

    }catch(err){
        console.log("AT ERROR:", err.response ? JSON.stringify(err.response.data) : err.message);
        return [];
    }
}

// ===== CATEGORY =====
async function ensureCategory(name="Deal Lazada"){
    try{
        const res = await axios.post(WP_CAT_URL,{name:name},{
            headers:{Authorization:`Basic ${token}`,"Content-Type":"application/json"}
        });
        return res.data.id;
    }catch{
        return 1;
    }
}

// ===== TAG =====
async function ensureTag(name){
    try{
        const res = await axios.post(WP_TAG_URL,{name:name},{
            headers:{Authorization:`Basic ${token}`,"Content-Type":"application/json"}
        });
        return [res.data.id];
    }catch{
        return [];
    }
}

// ===== IMAGE =====
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
    const title = product.name || "Deal hot Lazada";
    const price = product.price || product.sale_price || "Liên hệ";

    return `
    ${AD_SCRIPT}
    <div style="max-width:760px;margin:auto;font-family:Arial;line-height:1.8;color:#222;">
        <h1>${seoTitle(title)}</h1>
        <img src="${image}" style="width:100%;border-radius:14px;box-shadow:0 0 15px rgba(0,0,0,.15);margin-bottom:20px;">

        <div style="background:#fff4f4;border:1px solid #ffb8b8;padding:18px;border-radius:12px;">
            <p style="font-size:24px;color:red;font-weight:bold;">🔥 Giá ưu đãi Lazada: ${price} VNĐ</p>
            <p>✔ Chính hãng ✔ Flash Sale ✔ Số lượng có hạn</p>
        </div>

        <p>${randomIntro(title)}</p>
        <p>Sản phẩm đang được giảm giá mạnh trên Lazada và thu hút lượng lớn người mua trong hôm nay. Đây là lựa chọn phù hợp nếu bạn đang muốn mua hàng chất lượng với chi phí tiết kiệm.</p>

        <h3>⭐ Điểm nổi bật:</h3>
        <ul>
            <li>Giá tốt hơn thị trường</li>
            <li>Gian hàng uy tín trên Lazada</li>
            <li>Nhiều đánh giá tích cực</li>
            <li>Khuyến mãi thay đổi liên tục</li>
        </ul>

        <div style="text-align:center;margin:35px 0;">
            <a href="${buyLink}" target="_blank"
            style="background:#e60000;color:#fff;padding:16px 35px;text-decoration:none;border-radius:10px;font-size:20px;font-weight:bold;">
            🛒 SĂN DEAL LAZADA NGAY
            </a>
        </div>
    </div>
    ${AD_SCRIPT}
    `;
}

// ===== POST =====
async function postWordpress(title,content,featuredId,catId,tags){
    await axios.post(WP_POST_URL,{
        title:seoTitle(title),
        slug:makeSlug(title+"-"+Date.now()),
        excerpt:`Cập nhật deal Lazada mới nhất cho ${title} với mức giá hấp dẫn hôm nay.`,
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
        console.log("NO LAZADA PRODUCTS");
        return;
    }

    const catId = await ensureCategory("Deal Lazada");

    for(let product of products){
        const title = product.name || "Deal hot Lazada";
        const image = product.image || product.image_url || "";
        const featuredId = await uploadImage(image,title);
        const tags = await ensureTag(title);
        const html = makeContent(product);

        await postWordpress(title,html,featuredId,catId,tags);
    }
}

runBot();
     
           
