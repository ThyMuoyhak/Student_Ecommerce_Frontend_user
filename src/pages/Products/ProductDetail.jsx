import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { productsAPI } from '../../api/products';
import { ArrowLeftIcon, PencilIcon } from '@heroicons/react/24/outline';
import Loader from '../../components/common/Loader';
import StatusBadge from '../../components/common/StatusBadge';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const data = await productsAPI.getById(id);
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;
  if (!product) return null;

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link to="/products" className="text-primary-600 hover:text-primary-700 flex items-center mb-2">
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Back to Products
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>
        </div>
        <Link to={`/products/edit/${product.id}`} className="btn-primary flex items-center">
          <PencilIcon className="h-5 w-5 mr-2" />
          Edit Product
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Images */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4">Images</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 mb-2">Main Image</p>
              <img src={product.main_image} alt={product.title} className="w-full max-w-md rounded-lg" />
            </div>
            {product.images?.length > 0 && (
              <div>
                <p className="text-sm text-gray-500 mb-2">Additional Images</p>
                <div className="grid grid-cols-3 gap-2">
                  {product.images.map((img, idx) => (
                    <img key={idx} src={img.image_url} alt={`${product.title} ${idx + 1}`} className="rounded-lg" />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-4">Product Information</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Category</p>
                <p className="font-medium">{product.category?.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <StatusBadge status={product.is_active ? 'active' : 'inactive'} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Price</p>
                <p className="font-medium">
                  {product.discount_price ? (
                    <>
                      <span className="text-gray-500 line-through mr-2">${product.original_price}</span>
                      <span className="text-green-600">${product.discount_price}</span>
                    </>
                  ) : (
                    `$${product.original_price}`
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Stock</p>
                <p className="font-medium">{product.stock_quantity} units</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Description</p>
                <p className="text-gray-700">{product.description || 'No description'}</p>
              </div>
            </div>
          </div>

          {/* Sizes */}
          {product.sizes?.length > 0 && (
            <div className="card p-6">
              <h2 className="text-xl font-semibold mb-4">Sizes</h2>
              <div className="grid grid-cols-2 gap-2">
                {product.sizes.map((size, idx) => (
                  <div key={idx} className="flex justify-between p-2 bg-gray-50 rounded">
                    <span>Size: {size.size}</span>
                    <span>Stock: {size.stock}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Colors */}
          {product.colors?.length > 0 && (
            <div className="card p-6">
              <h2 className="text-xl font-semibold mb-4">Colors</h2>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((color, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    <div className="w-6 h-6 rounded border" style={{ backgroundColor: color.color_code || '#000' }}></div>
                    <span>{color.color}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;