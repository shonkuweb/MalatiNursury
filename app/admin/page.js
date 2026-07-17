"use client";
import { useState, useEffect } from "react";
import { FiUpload, FiTrash2, FiPlus, FiTag, FiEdit2 } from "react-icons/fi";
import Link from "next/link";
import imageCompression from 'browser-image-compression';

export default function AdminPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  
  // Edit mode state
  const [editingProductId, setEditingProductId] = useState(null);
  const [existingImage, setExistingImage] = useState("");
  
  // New product form state
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [type, setType] = useState("");
  
  // Adenium options state
  const [adeniumPrice8, setAdeniumPrice8] = useState("");
  const [adeniumPrice10, setAdeniumPrice10] = useState("");
  const [adeniumPriceSingle, setAdeniumPriceSingle] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

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

  const handleEditProduct = (product) => {
    setEditingProductId(product.id);
    setTitle(product.title);
    setSlug(product.slug);
    setPrice(product.price);
    setDescription(product.description || "");
    setExistingImage(product.image);
    setType(product.type || "");
    setFile(null);

    if (product.adeniumOptions) {
      setAdeniumPrice8(product.adeniumOptions["Multigrafted 8\" Pot"] || "");
      setAdeniumPrice10(product.adeniumOptions["Multigrafted 10\" Pot"] || "");
      setAdeniumPriceSingle(product.adeniumOptions["Single Grafted"] || "");
    } else {
      setAdeniumPrice8("");
      setAdeniumPrice10("");
      setAdeniumPriceSingle("");
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingProductId(null);
    setTitle("");
    setSlug("");
    setPrice("");
    setDescription("");
    setExistingImage("");
    setFile(null);
    setType("");
    setAdeniumPrice8("");
    setAdeniumPrice10("");
    setAdeniumPriceSingle("");
  };

  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    if (!title || !slug || !price) {
      alert("Title, Slug, and Price are required!");
      return;
    }
    if (!editingProductId && !file) {
      alert("Image is required for new products!");
      return;
    }

    setIsUploading(true);

    try {
      let imageUrl = existingImage;

      // 1. Compress and Upload the image if a new file is selected
      if (file) {
        const options = {
          maxSizeMB: 0.5,
          maxWidthOrHeight: 1200,
          useWebWorker: true
        };
        const compressedFile = await imageCompression(file, options);
        
        const formData = new FormData();
        formData.append("file", new File([compressedFile], file.name, { type: compressedFile.type }));
        formData.append("type", type);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const uploadData = await uploadRes.json();

        if (!uploadRes.ok) {
          throw new Error(uploadData.error || "Failed to upload image");
        }

        imageUrl = uploadData.url;
      }

      // 2. Save the product
      const isAdenium = title.toLowerCase().includes('adenium');
      const adeniumOptions = isAdenium ? {
        "Multigrafted 8\" Pot": adeniumPrice8 || null,
        "Multigrafted 10\" Pot": adeniumPrice10 || null,
        "Single Grafted": adeniumPriceSingle || null
      } : undefined;

      const productData = {
        slug,
        title,
        price,
        description,
        image: imageUrl,
        type,
        rating: 5.0,
        reviews: 120,
        adeniumOptions
      };

      let res;
      if (editingProductId) {
        productData.id = editingProductId;
        res = await fetch("/api/products", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productData),
        });
      } else {
        res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productData),
        });
      }

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to ${editingProductId ? 'update' : 'save'} product`);
      }

      // 3. Reset form
      handleCancelEdit();
      
      // 4. Refresh list
      fetchData();
      alert(`Product ${editingProductId ? 'updated' : 'added'} successfully!`);

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

  return (
    <div className="admin-container" style={{ padding: 0 }}>
      <main className="admin-main" style={{ margin: 0 }}>
        <div className="admin-content-grid">
          
          <div className="admin-left-col">
            <section className="admin-card add-product-section">
              <h2><FiPlus /> {editingProductId ? "Edit Product" : "Add New Product"}</h2>
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
                  <label>Type</label>
                  <select 
                    value={type} 
                    onChange={(e) => setType(e.target.value)}
                    required
                  >
                    <option value="">Select a Type</option>
                    <option value="Both Wholesale and retail">Both Wholesale and retail</option>
                    <option value="Wholesale only">Wholesale only</option>
                    <option value="Retail only">Retail only</option>
                  </select>
                </div>

                {title.toLowerCase().includes('adenium') && (
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
                  <label>Description</label>
                  <textarea 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    placeholder="Product description..." 
                    rows={4}
                  />
                </div>

                <div className="form-group">
                  <label>Product Image</label>
                  <div className="file-upload-wrapper">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => setFile(e.target.files[0])} 
                      required={!editingProductId}
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="file-upload-label">
                      <FiUpload /> {file ? file.name : (editingProductId ? "Choose a new image (optional)..." : "Choose an image to upload...")}
                    </label>
                  </div>
                </div>

                <div style={{display: 'flex', gap: '12px'}}>
                  <button type="submit" className="admin-submit-btn" disabled={isUploading} style={{flex: 1}}>
                    {isUploading ? "Saving..." : (editingProductId ? "Update Product" : "Save Product")}
                  </button>
                  {editingProductId && (
                    <button type="button" onClick={handleCancelEdit} className="admin-cancel-btn" style={{flex: 1}}>
                      Cancel Edit
                    </button>
                  )}
                </div>
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
                  <div key={product.id || product.slug} className="admin-product-item">
                    <div className="admin-product-image">
                      <img src={product.image} alt={product.title} />
                    </div>
                    <div className="admin-product-details">
                      <h3>{product.title}</h3>
                      <p>₹{product.price} {product.type && <span>({product.type})</span>}</p>
                      {product.category_name && <span style={{fontSize: '12px', background: '#eaf4ee', color: '#187a32', padding: '2px 8px', borderRadius: '12px', display: 'inline-block', marginTop: '4px'}}>{product.category_name}</span>}
                    </div>
                    <div style={{display: 'flex', gap: '12px'}}>
                      <button 
                        onClick={() => handleEditProduct(product)} 
                        className="admin-edit-btn"
                        title="Edit Product"
                        style={{background: 'none', border: 'none', color: '#1890ff', cursor: 'pointer', fontSize: '20px'}}
                      >
                        <FiEdit2 />
                      </button>
                      <button 
                        onClick={() => handleDeleteProduct(product.slug)} 
                        className="admin-delete-btn"
                        title="Delete Product"
                        style={{background: 'none', border: 'none', color: '#ff4d4f', cursor: 'pointer', fontSize: '20px'}}
                      >
                        <FiTrash2 />
                      </button>
                    </div>
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
