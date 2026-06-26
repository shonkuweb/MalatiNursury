const fs = require('fs');

const files = [
  'app/cart/page.js',
  'app/checkout/page.js',
  'app/page.js',
  'app/product/[slug]/page.js'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Remove Product Details link
    content = content.replace(/<Link href="\/product\/buttercup"[^>]*>\s*Product Details <FiChevronRight \/>\s*<\/Link>/g, '');
    
    // Remove Track Order link
    content = content.replace(/<Link href="\/track-order"[^>]*>\s*<span className="bottom-icon">\s*<FiTruck \/>\s*<\/span>\s*<span>Track Order<\/span>\s*<\/Link>/g, '');

    fs.writeFileSync(file, content);
  }
});
