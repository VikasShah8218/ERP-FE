import Product from "../../static/image/product-img.png"
import RequestImg from "../../static/image/appeals.png"
import EntryImg from "../../static/image/entry.png"
import { Link } from "react-router-dom";
const Store = () => {
return(
    <>
    <div className="grid grid-cols-8 gap-8">
            <div className="col-span-4 xl:col-span-2 flex justify-center items-center cursor-pointer">
                <Link to="/store/products" >
                    <div className="h-50 w-50 flex flex-col items-center justify-center gap-2 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-4 transition-transform duration-300 hover:shadow-lg hover:scale-105">
                        <div className="w-full flex justify-center">
                        <img src={Product} alt="Product" className="h-24 w-24 object-contain" />
                        </div>
                        <div className="text-center font-semibold">
                        Products
                        </div>
                    </div>
                </Link>       
            </div>
            <div className="col-span-4 xl:col-span-2 flex justify-center items-center cursor-pointer">
                <Link to="/store/requests" >
                    <div className="h-50 w-50 flex flex-col items-center justify-center gap-2 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-4 transition-transform duration-300 hover:shadow-lg hover:scale-105">
                        <div className="w-full flex justify-center">
                        <img src={RequestImg} alt="Product" className="h-24 w-24 object-contain" />
                        </div>
                        <div className="text-center font-semibold">
                        Requests
                        </div>
                    </div>
                </Link>
            </div>  
            <div className="col-span-4 xl:col-span-2 flex justify-center items-center cursor-pointer">
                <Link to="/store/daily-entry" >
                    <div className="h-50 w-50 flex flex-col items-center justify-center gap-2 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-4 transition-transform duration-300 hover:shadow-lg hover:scale-105">
                        <div className="w-full flex justify-center">
                        <img src={EntryImg} alt="Product" className="h-24 w-24 object-contain" />
                        </div>
                        <div className="text-center font-semibold">
                        Daily Entry
                        </div>
                    </div>
                </Link>
            </div>  
    </div>
    </>
)
}
export default Store;