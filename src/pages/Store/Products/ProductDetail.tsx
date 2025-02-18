import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getFromServer } from "../../../globals/requests";
import ProductImg from "../../../static/image/product-img.png"

import {toast} from 'react-toastify';

interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  group: string;
  price: string;
  quantity: number;
  serial_number: string;
  model: string;
  location: string;
  status: string;
  created_on: string;
  updated_on: string;
  product_image: string;
  bill_image: string;
  other_document: string;
}

const ProductDetail = () => {
    const { id } = useParams(); // Get product ID from URL
    const [product, setProduct] = useState<Product | null>(null);

    const getInitialList = async () => {
        const res1 = await getFromServer(`/store/products/${id}`)
        if (res1.status){
            setProduct(res1.data);
        } else{ toast.error("Something Went Wrong while fetching data")  }
    }
  
  useEffect(() => {getInitialList();}, [id]);

  if (!product) {
    return <div className="text-center text-lg text-gray-700 dark:text-white">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg dark:bg-boxdark dark:border-strokedark">
      {/* Product Image */}
      <div className="flex flex-col md:flex-row items-center gap-6">
        <img
          src={ product.product_image ? product.product_image : ProductImg}
          alt={product.name}
          className="w-64 h-64 object-cover rounded-md border border-gray-300 dark:border-strokedark"
        />
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{product.name}</h2>
          <p className="text-gray-600 dark:text-gray-300 mt-2">{product.description}</p>

          {/* Category & Group */}
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-600 text-sm font-semibold rounded-md dark:bg-gray-700 dark:text-gray-300">
              {product.category}
            </span>
            {product.group && (
              <span className="px-3 py-1 bg-green-100 text-green-600 text-sm font-semibold rounded-md dark:bg-gray-700 dark:text-gray-300">
                {product.group}
              </span>
            )}
          </div>

          {/* Price & Quantity */}
          <div className="mt-4 text-lg font-semibold text-gray-800 dark:text-white">
            Price: <span className="text-blue-600">${product.price}</span>
          </div>
          <div className="mt-1 text-gray-700 dark:text-gray-300">
            Quantity Available: {product.quantity}
          </div>
        </div>
      </div>

      {/* Additional Details */}
      <div className="mt-6 border-t border-gray-300 dark:border-strokedark pt-4">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Product Details</h3>
        <div className="mt-2 space-y-2 text-gray-700 dark:text-gray-300">
          <p><strong>Serial Number:</strong> {product.serial_number}</p>
          <p><strong>Model:</strong> {product.model}</p>
          <p><strong>Location:</strong> {product.location}</p>
          <p><strong>Status:</strong> {product.status === "1" ? "Active" : "Inactive"}</p>
          <p><strong>Created On:</strong> {product.created_on}</p>
          <p><strong>Updated On:</strong> {product.updated_on}</p>
        </div>
      </div>

      {/* Additional Documents */}
      <div className="mt-6 border-t border-gray-300 dark:border-strokedark pt-4">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Attachments</h3>
        <div className="mt-3 flex flex-col gap-4">
          {product.bill_image && (
            <a
              href={product.bill_image}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              View Bill Image
            </a>
          )}
          {product.other_document && (
            <a
              href={product.other_document}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              View Other Document
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
