import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { getFromServer, patchToServer, postToServer } from "../../../globals/requests";
import ProductImg from "../../../static/image/product-img.png"
import { useSelector } from "react-redux";

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
const productType =  {
  id: "",
  name: "",
  description: "",
  category: "",
  group: "",
  price: "",
  quantity: "",
  serial_number: "",
  model: "",
  location: "",
  status: "",
  created_on: "",
  updated_on: "",
  product_image: "",
  bill_image: "",
  other_document: "",
}

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState<Product| null>({...productType});
    const [locationList, setLocationList] = useState<any[]>([]);
    const [categoryList, setCategoryList] = useState<any[]>([]);
    const [pGroup, setPGroup]             = useState<any[]>([]);

    const [ formData, setFormData] = useState<any>({...productType});
    const user = useSelector((state:any) => state.auth.user);

    const updateFormData = (e:any) => setFormData({...formData,[e.target.name]:e.target.value});

    const getInitialList = async () => {
        const res0 = await getFromServer("/store/locations")
        const res1 = await getFromServer(`/store/products/${id}`)
        const res2 = await getFromServer("/store/categories")
        const res3 = await getFromServer("/store/product-group")
        if (res1.status && res2.status && res3.status && res0.status ){
            setLocationList(res0.data.results);
            setCategoryList(res2.data.results);
            setPGroup(res3.data.results);
            setProduct(res1.data);
        } else{ toast.error("Something Went Wrong while fetching data")  }
    }
    useEffect(() => {setFormData(product); console.log("==>",product)}, [product])

    const updateProduct = async() => {
      const requestData = {...formData}
      delete requestData.product_image
      delete requestData.bill_image
      delete requestData.other_document
      const response = await patchToServer(`/store/products/${id}/`,requestData);
      if(response?.status == 200 || response?.status == 201){toast.success("👍 Product Updated")}
      else{toast.error(response?.data?.detail)}

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
            <select name="category" onChange={updateFormData} value={formData.category} disabled={!user?.permissions?.includes("can_update_product") }  className="w-full p-2 border border-gray-300 rounded-md dark:border-strokedark dark:bg-boxdark dark:text-white" required>
                <option value="">Select Category</option>
                {categoryList?.map((category:any)=>(<option value={category.id}>{category.name}</option>))}
            </select>
            <select name="location" onChange={updateFormData} value={formData.location} disabled={!user?.permissions?.includes("can_update_product") }  className="w-full p-2 border border-gray-300 rounded-md dark:border-strokedark dark:bg-boxdark dark:text-white" required>
              <option value="">Select Location</option>
              {locationList?.map((location:any)=>(<option value={location.id}>{location.name}</option>))}
            </select>
            <select name="group"  onChange={updateFormData} value={formData.group} disabled={!user?.permissions?.includes("can_update_product") }  className="w-full  p-2 border border-gray-300 rounded-md dark:border-strokedark dark:bg-boxdark dark:text-white" required>
              <option value="">Select Group</option>
              {pGroup?.map((group:any)=>(<option value={group.id}>{group.name}</option>))}
            </select>
          </div>

          {/* Price & Quantity */}
          <div className="mt-4 text-lg font-semibold text-gray-800 dark:text-white">
            Price: <span className="text-blue-600">₹{product.price}</span>
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
        <button onClick={updateProduct} className="ml-0 lg:ml-2 lg:mt-0 rounded-lg px-4 py-2 text-sm transition bg-primary text-white hover:bg-blue-700 ">
            Update
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;
