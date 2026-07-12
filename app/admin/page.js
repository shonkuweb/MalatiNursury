"use client";
import { useState, useEffect } from "react";
import { FiUpload, FiTrash2, FiPlus, FiTag } from "react-icons/fi";
import Link from "next/link";
import imageCompression from 'browser-image-compression';

export default function AdminPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  
  // New product form state
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [price, setPrice] = useState("");
  const [oldPrice, setOldPrice] = useState("");
  const [offer, setOffer] = useState("");
  const [file, setFile] = useState(null);
  const [categoryId, setCategoryId] = useState("");
  
  // Adenium options state
  const [adeniumPrice8, setAdeniumPrice8] = useState("");
  const [adeniumPrice10, setAdeniumPrice10] = useState("");
  const [adeniumPriceSingle, setAdeniumPriceSingle] = useState("");

  // New category form state
  const [categoryName, setCategoryName] = useState("");
  const [categorySlug, setCategorySlug] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  // Temporary feature: auto-select Hoya category on load
  useEffect(() => {
    if (categories.length > 0 && !categoryId) {
      const hoyaCat = categories.find(c => c.name.toLowerCase() === 'hoya');
      if (hoyaCat) {
        setCategoryId(hoyaCat.id.toString());
        setTitle('Hoya');
        setSlug('hoya');
        setPrice('450');
        setOldPrice('650');
        setOffer('20% OFF');
      }
    }
  }, [categories, categoryId]);

  const fetchData = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/categories")
      ]);
      const prodData = await prodRes.json();
      const catData = await catRes.json();
      setProducts(prodData);
      setCategories(catData);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async (slug) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await fetch(`/api/products?slug=${slug}`, { method: "DELETE" });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCategory = async (slug) => {
    if (!confirm("Are you sure you want to delete this category? Products in this category will lose their category association.")) return;
    try {
      await fetch(`/api/categories?slug=${slug}`, { method: "DELETE" });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!categoryName || !categorySlug) return;
    setIsAddingCategory(true);
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: categoryName, slug: categorySlug }),
      });
      if (!res.ok) throw new Error("Failed to add category");
      setCategoryName("");
      setCategorySlug("");
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Error: " + err.message);
    } finally {
      setIsAddingCategory(false);
    }
  };

  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    if (!title || !slug || !price || !file) {
      alert("Title, Slug, Price, and Image are required!");
      return;
    }

    setIsUploading(true);

    try {
      // 1. Compress and Upload the image
      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1200,
        useWebWorker: true
      };
      const compressedFile = await imageCompression(file, options);
      
      const formData = new FormData();
      formData.append("file", new File([compressedFile], file.name, { type: compressedFile.type }));

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const uploadData = await uploadRes.json();

      if (!uploadRes.ok) {
        throw new Error(uploadData.error || "Failed to upload image");
      }

      const imageUrl = uploadData.url;

      // 2. Save the product
      const isAdenium = categories.find(c => c.id == categoryId)?.name === "Adenium";
      const adeniumOptions = isAdenium ? {
        "Multigrafted 8\" Pot": adeniumPrice8 || null,
        "Multigrafted 10\" Pot": adeniumPrice10 || null,
        "Single Grafted": adeniumPriceSingle || null
      } : undefined;

      const newProduct = {
        slug,
        title,
        price,
        oldPrice: oldPrice || undefined,
        offer: offer || undefined,
        image: imageUrl,
        categoryId: categoryId ? parseInt(categoryId) : null,
        rating: 5.0,
        reviews: 120,
        adeniumOptions
      };

      const productRes = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });

      if (!productRes.ok) {
        throw new Error("Failed to save product");
      }

      // 3. Reset form
      setTitle("");
      setSlug("");
      setPrice("");
      setOldPrice("");
      setOffer("");
      setFile(null);
      setCategoryId("");
      setAdeniumPrice8("");
      setAdeniumPrice10("");
      setAdeniumPriceSingle("");
      
      // 4. Refresh list
      fetchData();
      alert("Product added successfully!");

    } catch (err) {
      console.error(err);
      alert("Error: " + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    setSlug(newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
  };

  const handleCategoryNameChange = (e) => {
    const newName = e.target.value;
    setCategoryName(newName);
    setCategorySlug(newName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
  };

  return (
    <div className="admin-container">
      <header className="admin-header">
        <div className="admin-header-content">
          <h1>Admin Dashboard</h1>
          <Link href="/" className="admin-back-btn">View Store</Link>
        </div>
      </header>

      <main className="admin-main">
        <div className="admin-content-grid">
          
          <div className="admin-left-col">
            <section className="admin-card add-product-section" style={{marginBottom: '24px'}}>
              <h2><FiTag /> Manage Categories</h2>
              <form onSubmit={handleAddCategory} className="admin-form" style={{display: 'flex', gap: '8px', marginBottom: '16px'}}>
                <input 
                  type="text" 
                  value={categoryName} 
                  onChange={handleCategoryNameChange} 
                  placeholder="New Category Name" 
                  required 
                  style={{flex: 1, padding: '8px', border: '1px solid #ddd', borderRadius: '4px'}}
                />
                <button type="submit" disabled={isAddingCategory} style={{background: '#187a32', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer'}}>
                  {isAddingCategory ? "Adding..." : "Add"}
                </button>
              </form>
              <div className="admin-category-list">
                {categories.map(cat => (
                  <div key={cat.id} style={{display: 'flex', justifyContent: 'space-between', padding: '8px', borderBottom: '1px solid #eee', alignItems: 'center'}}>
                    <span>{cat.name}</span>
                    <button onClick={() => handleDeleteCategory(cat.slug)} style={{background: 'none', border: 'none', color: '#ff4d4f', cursor: 'pointer'}}><FiTrash2 /></button>
                  </div>
                ))}
                {categories.length === 0 && <p style={{color: '#666', fontSize: '14px'}}>No categories yet.</p>}
              </div>
            </section>

            <section className="admin-card add-product-section">
              <h2><FiPlus /> Add New Product</h2>
              <form onSubmit={handleSubmitProduct} className="admin-form">
                <div className="form-group">
                  <label>Product Title</label>
                  <input 
                    type="text" 
                    value={title} 
                    onChange={handleTitleChange} 
                    placeholder="e.g. Rare Hoya Compacta" 
                    required 
                  />
                </div>

                <div className="form-group">
                  <label>URL Slug</label>
                  <input 
                    type="text" 
                    value={slug} 
                    onChange={(e) => setSlug(e.target.value)} 
                    placeholder="e.g. rare-hoya-compacta" 
                    required 
                  />
                </div>

                <div className="form-group">
                  <label>Category</label>
                  <select 
                    value={categoryId} 
                    onChange={(e) => {
                      const newCatId = e.target.value;
                      setCategoryId(newCatId);
                      
                      // Temporary feature for Hoya category
                      const selectedCat = categories.find(c => c.id == newCatId);
                      if (selectedCat && selectedCat.name.toLowerCase() === 'hoya') {
                        setTitle('Hoya');
                        setSlug('hoya');
                        setPrice('450');
                        setOldPrice('650');
                        setOffer('20% OFF');
                      }
                    }}
                    style={{width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cde2d3'}}
                  >
                    <option value="">Select a Category (Optional)</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                {categories.find(c => c.id == categoryId)?.name === "Adenium" && (
                  <div className="form-group" style={{background: '#f9f9f9', padding: '16px', borderRadius: '8px', marginBottom: '16px'}}>
                    <h3 style={{marginBottom: '12px', fontSize: '16px', color: '#187a32'}}>Adenium Prices (Leave empty if not applicable)</h3>
                    <div style={{display: 'flex', gap: '12px', flexDirection: 'column'}}>
                      <div>
                        <label>Multigrafted 8" Pot (₹)</label>
                        <input type="number" value={adeniumPrice8} onChange={e => setAdeniumPrice8(e.target.value)} placeholder="e.g. 500" />
                      </div>
                      <div>
                        <label>Multigrafted 10" Pot (₹)</label>
                        <input type="number" value={adeniumPrice10} onChange={e => setAdeniumPrice10(e.target.value)} placeholder="e.g. 800" />
                      </div>
                      <div>
                        <label>Single Grafted (₹)</label>
                        <input type="number" value={adeniumPriceSingle} onChange={e => setAdeniumPriceSingle(e.target.value)} placeholder="e.g. 300" />
                      </div>
                    </div>
                  </div>
                )}

                <div className="form-row">
                  <div className="form-group">
                    <label>Price (₹)</label>
                    <input 
                      type="number" 
                      value={price} 
                      onChange={(e) => setPrice(e.target.value)} 
                      placeholder="299" 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Old Price (₹) (Optional)</label>
                    <input 
                      type="number" 
                      value={oldPrice} 
                      onChange={(e) => setOldPrice(e.target.value)} 
                      placeholder="399" 
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Offer Badge Text (Optional)</label>
                  <input 
                    type="text" 
                    value={offer} 
                    onChange={(e) => setOffer(e.target.value)} 
                    placeholder="e.g. 20% OFF" 
                  />
                </div>

                <div className="form-group">
                  <label>Product Image</label>
                  <div className="file-upload-wrapper">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => setFile(e.target.files[0])} 
                      required 
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="file-upload-label">
                      <FiUpload /> {file ? file.name : "Choose an image to upload..."}
                    </label>
                  </div>
                </div>

                <button type="submit" className="admin-submit-btn" disabled={isUploading}>
                  {isUploading ? "Uploading & Saving..." : "Save Product"}
                </button>
              </form>
            </section>
          </div>

          <section className="admin-card product-list-section">
            <h2>Manage Inventory</h2>
            {isLoading ? (
              <p className="admin-loading">Loading products...</p>
            ) : products.length === 0 ? (
              <p className="admin-empty">No products found. Add some to get started!</p>
            ) : (
              <div className="admin-product-list">
                {products.map(product => (
                  <div key={product.slug} className="admin-product-item">
                    <div className="admin-product-image">
                      <img src={product.image} alt={product.title} />
                    </div>
                    <div className="admin-product-details">
                      <h3>{product.title}</h3>
                      <p>₹{product.price} {product.oldPrice && <span>(was ₹{product.oldPrice})</span>}</p>
                      {product.category_name && <span style={{fontSize: '12px', background: '#eaf4ee', color: '#187a32', padding: '2px 8px', borderRadius: '12px', display: 'inline-block', marginTop: '4px'}}>{product.category_name}</span>}
                    </div>
                    <button 
                      onClick={() => handleDeleteProduct(product.slug)} 
                      className="admin-delete-btn"
                      title="Delete Product"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

        </div>
      </main>
    </div>
  );
}
