import { getFromServer } from "../../../globals/requests";
import { useEffect, useState } from "react";
import {toast} from 'react-toastify';
import ProductImg from "../../../static/image/product-img.png"
import { Link } from "react-router-dom";


const Products = () => {
    const [locationList, setLocationList] = useState<any[]>([]);
    const [categoryList, setCategoryList] = useState<any[]>([]);
    const [fetchedProducts, setFetchedProducts] = useState<any[]>([]);
    const [selectedLocation, setSelectedLocation] = useState("");
    const [selectedcategory, setSelectedCategory] = useState("");
    // const [groupList, setGroupList] = useState<any[]>([]);
    const getInitialList = async () => {
        const res1 = await getFromServer("/store/locations")
        const res2 = await getFromServer("/store/categories")
        if (res1.status && res2.status){
            setLocationList(res1.data.results);
            setCategoryList(res2.data.results);
        } else{ toast.error("Something Went Wrong while fetching data")  }
    }

    const handelLocationChange = (event: React.ChangeEvent<HTMLSelectElement>) => {setSelectedLocation(event.target.value);};
    const handelCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {setSelectedCategory(event.target.value);};

    const getProduct = async() => {
        if (!selectedLocation.trim()){ toast.error("Select Location");  return false; }
        if (!selectedcategory.trim()){ toast.error("Select Category");  return false; }
        const response = await getFromServer(`/store/products?location_id=${selectedLocation}&category_id=${selectedcategory}`);
        if (response.status){setFetchedProducts(response.data.results);}
    }

    useEffect(()=> {getInitialList();},[])
    return( 
    <>
        <div className="w-full p-4 bg-white shadow-default dark:border-strokedark dark:bg-boxdark rounded-lg flex flex-col md:flex-row items-center gap-4">
            <select className="w-full md:w-1/4 p-2 border border-gray-300 rounded-md dark:border-strokedark dark:bg-boxdark dark:text-white"
             onChange={handelLocationChange}
             value={selectedLocation}
             >
                <option>Select Location</option>
                {locationList?.map((location:any)=>(
                    <option value={location.id}>{location.name}</option>
                ))}
              
            </select>
            <select className="w-full md:w-1/4 p-2 border border-gray-300 rounded-md dark:border-strokedark dark:bg-boxdark dark:text-white"
            onChange={handelCategoryChange}
            value={selectedcategory}
            >
                <option value="">Select Category</option>
                {categoryList?.map((category:any)=>(
                    <option value={category.id}>{category.name}</option>
                ))}
            </select>

            {/* <input type="date" className="w-full md:w-1/4 p-2 border border-gray-300 rounded-md dark:border-strokedark dark:bg-boxdark dark:text-white"/> */}

            <button onClick={getProduct} className="ml-0 lg:ml-2 lg:mt-0 rounded-lg px-4 py-2 text-sm transition bg-primary text-white hover:bg-blue-700 ">
                Search
            </button>

            <Link to={"/store/products/create"}>
                <button className="ml-0 lg:ml-2 lg:mt-0 rounded-lg px-4 py-2 text-sm transition bg-primary text-white hover:bg-blue-700 ">
                   +
                </button>
            </Link>

            <Link to={"/store/products/others"}>
                <button className="ml-0 lg:ml-2 lg:mt-0 rounded-lg px-4 py-2 text-sm transition bg-primary text-white hover:bg-blue-700 ">
                   +
                </button>
            </Link>
        </div>
        <div className="max-w-full overflow-x-auto mt-5">
            <table className="w-full table-auto">
            <thead>
                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                    Image
                </th>
                <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                    Name
                </th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                    Modal
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                    Group
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                    Status
                </th>
               
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                    Actions
                </th>
                </tr>
            </thead>
            <tbody>
                { fetchedProducts?.map((product:any)=> (
                <tr  style={{cursor:"pointer"}} >
                    <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                        <div className="h-15.5 w-15 rounded-md">
                            <img src={ product.product_image ? product.product_image : ProductImg} alt="User"/>
                        </div>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                        <h5 className="font-medium text-black dark:text-white"> {product?.name}</h5>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <p className="text-black dark:text-white">{product.model}</p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <p className="text-black dark:text-white">{product.group}</p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <p className="text-black dark:text-white">
                            <p
                                className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${
                                    true
                                        ? "bg-danger text-danger" 
                                        : false
                                        ? "bg-warning text-warning"
                                        : "bg-success text-success" 
                                }`}
                            >
                                {false
                                    ? "Scheduled" 
                                    : true
                                    ? "Private"
                                    : "Public"}
                            </p>
                        </p>
                    </td>
                 
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <div className="flex items-center space-x-3.5">
                            <button className="hover:text-primary">
                            <svg
                                className="fill-current"
                                width="18"
                                height="18"
                                viewBox="0 0 18 18"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                d="M16.8754 11.6719C16.5379 11.6719 16.2285 11.9531 16.2285 12.3187V14.8219C16.2285 15.075 16.0316 15.2719 15.7785 15.2719H2.22227C1.96914 15.2719 1.77227 15.075 1.77227 14.8219V12.3187C1.77227 11.9812 1.49102 11.6719 1.12539 11.6719C0.759766 11.6719 0.478516 11.9531 0.478516 12.3187V14.8219C0.478516 15.7781 1.23789 16.5375 2.19414 16.5375H15.7785C16.7348 16.5375 17.4941 15.7781 17.4941 14.8219V12.3187C17.5223 11.9531 17.2129 11.6719 16.8754 11.6719Z"
                                fill=""
                                />
                                <path
                                d="M8.55074 12.3469C8.66324 12.4594 8.83199 12.5156 9.00074 12.5156C9.16949 12.5156 9.31012 12.4594 9.45074 12.3469L13.4726 8.43752C13.7257 8.1844 13.7257 7.79065 13.5007 7.53752C13.2476 7.2844 12.8539 7.2844 12.6007 7.5094L9.64762 10.4063V2.1094C9.64762 1.7719 9.36637 1.46252 9.00074 1.46252C8.66324 1.46252 8.35387 1.74377 8.35387 2.1094V10.4063L5.40074 7.53752C5.14762 7.2844 4.75387 7.31252 4.50074 7.53752C4.24762 7.79065 4.27574 8.1844 4.50074 8.43752L8.55074 12.3469Z"
                                fill=""
                                />
                            </svg>
                            </button>
                        </div>
                    </td>
                </tr>
                )) }
               
            </tbody>
            </table>
        </div>

    </>
    )
}
export default Products;