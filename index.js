const axios = require('axios');

// Cấu hình từ GitHub Secrets
const config = {
    username: process.env.USER,
    password: process.env.APP_PASS,
    wpUrl: process.env.WP_URL.replace(/\/$/, "") + "/wp-json/wp/v2/posts", // Tự động sửa lỗi thiếu/thừa dấu gạch chéo
    tikiLinks: [
        "https://ti.ki/AVARxdrq/BYFTWCJX", "https://ti.ki/3QJR1sXj/BYFTWCJX",
        "https://ti.ki/Oc2NNhea/BYFTWCJX", "https://ti.ki/4qh1kk3m/BYFTWCJX",
        "https://ti.ki/MMlKZDJE/BYFTWCJX", "https://ti.ki/Fz0LrsMG/BYFTWCJX",
        "https://ti.ki/vco1qLoR/BYFTWCJX", "https://ti.ki/koYLFPe8/BYFTWCJX",
        "https://ti.ki/5JTf8xmY/BYFTWCJX", "https://ti.ki/jHolCIrZ/BYFTWCJX",
        "https://ti.ki/eCmSVMkH/BYFTWCJX", "https://ti.ki/6ayVdofN/BYFTWCJX",
        "https://ti.ki/eakZlxem/BYFTWCJX", "https://ti.ki/vL3PUsue/BYFTWCJX",
        "https://ti.ki/fV3MFGrk/BYFTWCJX", "https://ti.ki/jTiA1Nbd/BYFTWCJX",
        "https://ti.ki/qIrxviEx/BYFTWCJX", "https://ti.ki/CccTGPPQ/BYFTWCJX"
    ]
};

async function postToWordPress() {
    // Lấy ngẫu nhiên 1 link để đăng bài
    const randomLink = config.tikiLinks[Math.floor(Math.random() * config.tikiLinks.length)];
    
    const postData = {
        title: `🔥 Top Sản Phẩm Tiki Ưu Đãi Cực Sốc - Đừng Bỏ Lỡ!`,
        content: `
            <p>Chào các bạn, mình vừa săn được một sản phẩm cực hời trên Tiki gửi đến cả nhà!</p>
            <div style="text-align: center; margin: 20px 0;">
                <a href="${randomLink}" target="_blank" rel="nofollow" 
                   style="background-color: #ff424e; color: white; padding: 15px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                   XEM CHI TIẾT VÀ MUA TẠI TIKI
                </a>
            </div>
            <p>Sản phẩm đang có giá rất tốt, hãy nhanh tay vì chương trình có thể kết thúc sớm!</p>
        `,
        status: 'publish'
    };

    try {
        console.log(`🚀 Đang kiểm tra kết nối tới: ${config.wpUrl}...`);
        const response = await axios.post(config.wpUrl, postData, {
            auth: {
                username: config.username,
                password: config.password
            },
            timeout: 10000 // Chờ tối đa 10 giây
        });

        if (response.status === 201) {
            console.log(`✅ THÀNH CÔNG: Bài viết đã được đăng lên Picknexa.net!`);
            console.log(`🔗 Link bài: ${response.data.link}`);
        }
    } catch (error) {
        if (error.code === 'ECONNABORTED') {
            console.error("❌ LỖI: Website phản hồi quá chậm (Timeout). Vui lòng kiểm tra Hosting.");
        } else if (error.response && error.response.status === 401) {
            console.error("❌ LỖI: Sai Username hoặc Application Password.");
        } else {
            console.error(`❌ LỖI KHÔNG XÁC ĐỊNH: ${error.message}`);
        }
    }
}

postToWordPress();
