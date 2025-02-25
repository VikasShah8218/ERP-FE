import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getFromServer, patchToServer } from "../../globals/requests";
import { useDispatch } from "react-redux";
import { setRequestLoading } from "../../app/slices/authSlice";
import { faPenFancy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { showMessages, showErrorAlert } from "../../globals/messages";

const UserDetail: React.FC = () => {
  const loggedInUser =  useSelector((state:any) => state.auth.user)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser,setSelectedUser] = useState<any>({})
  const [editData,setEditData] = useState<any>({label:"",value:""})
  const dispatch = useDispatch();


  const getUser = async()=> {
      const response = await getFromServer(`/accounts/user/${loggedInUser.id}`);
      if (response.status){
          setSelectedUser(response.data)
      }
      dispatch(setRequestLoading(false))   
  }

  const editDataChange = (event:any) => {
      setEditData({...editData,value:event.target.value})
  }

  
  const handleEditClick = (label:string) => {
    setIsModalOpen(true);
    setEditData({label:label,value:selectedUser[label]})

  }

  const handelUpdateData = async() => {
    const userRes = await patchToServer(`/accounts/update-user/${loggedInUser.id}/`,{[editData.label]:editData.value})
    if (userRes.status==200 || userRes.status==201){
      showMessages(userRes.data.detail)
      setIsModalOpen(false) 
      setEditData({label:"",value:""})
      getUser();
    }
    else{
      showErrorAlert(userRes.data.detail)
    }
  }

  useEffect(()=>{
    getUser();
  },[])

  return (
    <div className="p-4 bg-gray-900 text-white">
      <h2 className="text-xl font-bold mb-6 text-center">User Details</h2>
      {/* <div className="grid grid-cols-4 gap-4"> */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div  className="p-4 bg-gray-800 rounded-lg shadow hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <span className="font-semibold">{selectedUser.username}</span>
              {/* <button onClick={() => handleEditClick("username")}>
                <div className="text-green-500">
                  <FontAwesomeIcon icon={faPenFancy} />
                </div>
              </button> */}
            </div>
          </div>
          <div  className="p-4 bg-gray-800 rounded-lg shadow hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <span className="font-semibold">{selectedUser.first_name}</span>
              <button onClick={() => handleEditClick("first_name")}>
                <div className="text-green-500">
                  <FontAwesomeIcon icon={faPenFancy} />
                </div>
              </button>
            </div>
          </div>
          <div  className="p-4 bg-gray-800 rounded-lg shadow hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <span className="font-semibold">{selectedUser.last_name}</span>
              <button onClick={() => handleEditClick("last_name")}>
                <div className="text-green-500">
                  <FontAwesomeIcon icon={faPenFancy} />
                </div>
              </button>
            </div>
          </div>
          <div  className="p-4 bg-gray-800 rounded-lg shadow hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <span className="font-semibold">{selectedUser.email}</span>
              <button onClick={() => handleEditClick("email")}>
                <div className="text-green-500">
                  <FontAwesomeIcon icon={faPenFancy} />
                </div>
              </button>
            </div>
          </div>
          <div  className="p-4 bg-gray-800 rounded-lg shadow hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <span className="font-semibold">{selectedUser.user_type}</span>
              {/* <button onClick={() => handleEditClick("user_type")}>
                <div className="text-green-500">
                  <FontAwesomeIcon icon={faPenFancy} />
                </div>
              </button> */}
            </div>
          </div>
          <div  className="p-4 bg-gray-800 rounded-lg shadow hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <span className="font-semibold">{selectedUser.phone}</span>
              <button onClick={() => handleEditClick("phone")}>
                <div className="text-green-500">
                  <FontAwesomeIcon icon={faPenFancy} />
                </div>
              </button>
            </div>
          </div>
          <div  className="p-4 bg-gray-800 rounded-lg shadow hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <span className="font-semibold">{selectedUser.work_location}</span>
              <button onClick={() => handleEditClick("work_location")}>
                <div className="text-green-500">
                  <FontAwesomeIcon icon={faPenFancy} />
                </div>
              </button>
            </div>
          </div>
          <div  className="p-4 bg-gray-800 rounded-lg shadow hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <span className="font-semibold">{selectedUser.department}</span>
              <button onClick={() => handleEditClick("department")}>
                <div className="text-green-500">
                  <FontAwesomeIcon icon={faPenFancy} />
                </div>
              </button>
            </div>
          </div>
          <div  className="p-4 bg-gray-800 rounded-lg shadow hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <span className="font-semibold">{selectedUser.client_id}</span>
              <button onClick={() => handleEditClick("client_id")}>
                <div className="text-green-500">
                  <FontAwesomeIcon icon={faPenFancy} />
                </div>
              </button>
            </div>
          </div>
          <div  className="p-4 bg-gray-800 rounded-lg shadow hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <span className="font-semibold">{selectedUser.address}</span>
              <button onClick={() => handleEditClick("address")}>
                <div className="text-green-500">
                  <FontAwesomeIcon icon={faPenFancy} />
                </div>
              </button>
            </div>
          </div>
      </div>

          
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" style={{backdropFilter:"blur(2px)"}}>
            <div className="bg-black rounded-lg shadow-lg w-11/12 max-w-md mx-auto p-5">
            <h3 className="text-lg font-semibold text-white-800 mb-4 text-center">Add User</h3>
            <div className="w-full  rounded-md p-3 mb-4 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none">
                <label className="mb-2.5 block text-black dark:text-white">
                  {editData.label}
                </label>
                <input
                  type="text"
                  name="phone"
                  placeholder="Enter Phone"
                  value={editData.value}
                  onChange={editDataChange}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
            </div>          
            <div className="flex justify-between">
                <button
                onClick={()=>{ setIsModalOpen(false); setEditData({label:"",value:""})}}
                className="w-[48%] px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                Cancel
                </button>
                <button
                onClick={handelUpdateData}
                className="w-[48%] px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                Submit
                </button>
            </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default UserDetail;
