function makeContent(product){

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
