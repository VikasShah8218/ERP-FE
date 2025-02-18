import { useEffect, useState } from "react";
import { getFromServer, postToServerFileUpload } from "../../../globals/requests";
import {toast} from 'react-toastify';
import { useNavigate } from "react-router-dom";



const ProductCreate = () => {
    const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    group: "",
    price: "",
    quantity: "",
    serial_number: "",
    model: "",
    location: "",
    product_image: null,
    bill_image: null,
    });
    const navigate = useNavigate();

    const [locationList, setLocationList] = useState<any[]>([]);
    const [categoryList, setCategoryList] = useState<any[]>([]);
    const [pGroup, setPGroup] = useState<any[]>([]);
    // const [fetchedProducts, setFetchedProducts] = useState<any[]>([]);
    const [selectedLocation, setSelectedLocation] = useState("");
    const [selectedcategory, setSelectedCategory] = useState("");
    const [selectedpGroup, setSelectedpGroup] = useState("");

    const handelLocationChange = (event: React.ChangeEvent<HTMLSelectElement>) => {setSelectedLocation(event.target.value); setFormData({...formData, location : event.target.value});};
    const handelCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {setSelectedCategory(event.target.value); setFormData({...formData,category : event.target.value});};
    const handelPGroupChange   = (event: React.ChangeEvent<HTMLSelectElement>) => {setSelectedpGroup(event.target.value); setFormData({...formData,group : event.target.value});};

    const getInitialList = async () => {
        const res1 = await getFromServer("/store/locations")
        const res2 = await getFromServer("/store/categories")
        const res3 = await getFromServer("/store/product-group")
        if (res1.status && res2.status && res3){
            setLocationList(res1.data.results);
            setCategoryList(res2.data.results);
            setPGroup(res3.data.results);
        } else{ toast.error("Something Went Wrong while fetching data")  }
    }

    const handleChange = (e:any) => {
        const { name, value, type, files } = e.target;
        setFormData({...formData,[name]: type === "file" ? files[0] : value,});
    };

    const handleSubmit = async(e:any) => {
      e.preventDefault();
      const data = new FormData();
      console.log("Form Data:", formData);
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
            // For file inputs, append them as files
            if (key === "product_image" || key === "bill_image") {
                if (value instanceof File) {
                    data.append(key, value);
                }
            } else {
                data.append(key, value.toString());
            }
        }
      });
      console.log(data)
      const response = await postToServerFileUpload("/store/products/",data);
      if(response.status== 201 || response.status == 200){
        toast.success("Product Created")
        navigate("/store/products")
      }else{ toast.error(response.data.details) }
    };

    useEffect(()=> {getInitialList();},[])


  return (
    <div className="max-w-2xl mx-auto bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-6 rounded-lg">
      <h2 className="text-xl font-bold text-gray-700 dark:text-white mb-4">
        Add New Product
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <input type="text" name="name" placeholder="Product Name" value={formData.name} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md dark:border-strokedark dark:bg-boxdark dark:text-white" required/>
        
        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md dark:border-strokedark dark:bg-boxdark dark:text-white" required></textarea>

        <select onChange={handelLocationChange} value={selectedLocation} className="w-full p-2 border border-gray-300 rounded-md dark:border-strokedark dark:bg-boxdark dark:text-white" required>
            <option value="">Select Location</option>
            {locationList?.map((location:any)=>(<option value={location.id}>{location.name}</option>))}
        </select>

        <select onChange={handelCategoryChange} value={selectedcategory} className="w-full  p-2 border border-gray-300 rounded-md dark:border-strokedark dark:bg-boxdark dark:text-white" required>
            <option value="">Select Category</option>
            {categoryList?.map((category:any)=>(<option value={category.id}>{category.name}</option>))}
        </select>

        <select  onChange={handelPGroupChange} value={selectedpGroup} className="w-full  p-2 border border-gray-300 rounded-md dark:border-strokedark dark:bg-boxdark dark:text-white" required>
            <option value="">Select Group</option>
            {pGroup?.map((group:any)=>(<option value={group.id}>{group.name}</option>))}
        </select>

        <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md dark:border-strokedark dark:bg-boxdark dark:text-white" required/>

        <input type="number" name="quantity" placeholder="Quantity" value={formData.quantity} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md dark:border-strokedark dark:bg-boxdark dark:text-white" required/>

        <input type="text" name="serial_number" placeholder="Serial Number" value={formData.serial_number} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md dark:border-strokedark dark:bg-boxdark dark:text-white" required/>

        <input type="text" name="model" placeholder="Model" value={formData.model} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md dark:border-strokedark dark:bg-boxdark dark:text-white"  required/>

        <input type="file" name="product_image" accept="image/*" onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md dark:border-strokedark dark:bg-boxdark dark:text-white" />

        <input type="file" name="bill_image" accept="image/*" onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md dark:border-strokedark dark:bg-boxdark dark:text-white" />

        <button type="submit" className="w-full p-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 cursor-pointer">
          Add Product
        </button>
      </form>
    </div>
  );
};

export default ProductCreate;
