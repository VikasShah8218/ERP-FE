import React, { useState } from "react";
import { patchToServer } from "../../globals/requests";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { showErrorAlert, showMessages } from "../../globals/messages";

const UpdateUser: React.FC <{ setPage: Function; selectedUser: any }> = ({setPage,selectedUser,}) => {
  const [formData, setFormData] = useState({
    first_name: selectedUser.first_name,
    last_name: selectedUser.last_name,
    email: selectedUser.email,
    user_type: selectedUser.user_type,
    phone: selectedUser.phone,
    work_location: selectedUser.work_location,
    address: selectedUser.address,
    department: selectedUser.department,
    username: selectedUser.username,
    password: selectedUser.password,
    client_id:selectedUser.client_id,
    image: null,
  });

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = (reader.result as string).split(",")[1]; // Remove the prefix
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const [errors, setErrors] = useState<any>({});

  const validate = () => {
    const validationErrors: any = {};
    if (!formData.first_name.trim()) validationErrors.first_name = "First name is required.";
    if (!formData.last_name.trim()) validationErrors.last_name = "Last name is required.";
    if (!formData.phone.trim()) {
      validationErrors.phone = "Phone No. is required.";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      validationErrors.phone = "Phone No. must be a valid 10-digit number.";
    }
    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) validationErrors.email = "Valid email is required.";
    if (!formData.user_type) validationErrors.user_type = "User type is required.";
    if (!formData.work_location.trim()) validationErrors.work_location = "Work location is required.";
    if (!formData.department.trim()) validationErrors.department = "Department is required.";
    if (!formData.address.trim()) validationErrors.address = "Address is required.";
    // if (!formData.client_id.trim()) validationErrors.client_id = "Employee Code is required.";
    if (!formData.username.trim()) validationErrors.username = "Username is required.";
    return validationErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData((prev) => ({ ...prev, [name]: files ? files[0] : null }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleUserSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});
      let base64Image = null;

      if (formData.image) {
        base64Image = await convertToBase64(formData.image);
      }
      const formDataToSubmit = { ...formData, image: base64Image };
      const userRes = await patchToServer(`/accounts/update-user/${selectedUser.id}/`,formDataToSubmit)
      if (userRes.status==200 || userRes.status==201){
        setPage("main")
        showMessages(userRes.data.detail)
      }
      else{
        showErrorAlert(userRes.data.detail)
      }
    }
  };

  return(
    <>
    <div onClick={()=>{setPage("main")}} > <FontAwesomeIcon icon="fa-solid fa-angle-left" /> </div> 
    <div className="flex flex-col gap-9">
      {/* <!-- Contact Form --> */}
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Update User
          </h3>
        </div>
        <form  onSubmit={handleUserSubmit}>
          <div className="p-6.5">
            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
              <div className="w-full xl:w-1/2">
                <label className="mb-2.5 block text-black dark:text-white">
                  First name
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="Enter your first name"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
                {errors.first_name && <p className="text-meta-1">{errors.first_name}</p>}
              </div>
              <div className="w-full xl:w-1/2">
                <label className="mb-2.5 block text-black dark:text-white">
                  Last name
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Enter your last name"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
                {errors.last_name && <p className="text-meta-1">{errors.last_name}</p>}
              </div>
              <div className="w-full xl:w-1/2">
              <label className="mb-2.5 block text-black dark:text-white">
                Email <span className="text-meta-1">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
              {errors.email && <p className="text-meta-1">{errors.email}</p>}
              </div>
            </div>

            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
              <div className="w-full xl:w-1/2">
                <label className="mb-2.5 block text-black dark:text-white">
                  User Type <span className="text-meta-1">*</span>
                </label>

                <div className="relative z-20 bg-transparent dark:bg-form-input">
                  <select
                    name="user_type"
                    value={formData.user_type}
                    onChange={handleChange}
                    className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary `
                    //   ${isOptionSelected ? 'text-black dark:text-white' : '' }`
                    }
                  >
                    <option value="" disabled className="text-body dark:text-bodydark">
                      Select one type
                    </option>
                    <option value="Admin" className="text-body dark:text-bodydark">
                      Super Admin
                    </option>
                    <option value="District_Admin" className="text-body dark:text-bodydark">
                      District Admin
                    </option>
                    <option value="Employee" className="text-body dark:text-bodydark">
                      Employee
                    </option>
                  </select>
                  {errors.user_type && <p className="text-meta-1">{errors.user_type}</p>}


                  <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2">
                    <svg
                      className="fill-current"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g opacity="0.8">
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                          fill=""
                        ></path>
                      </g>
                    </svg>
                  </span>
                </div>
              </div>
              <div className="w-full xl:w-1/2">
                <label className="mb-2.5 block text-black dark:text-white">
                  Phone No.
                </label>
                <input
                  type="text"
                  name="phone"
                  placeholder="Enter Phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              {errors.phone && <p className="text-meta-1">{errors.phone}</p>}

              </div>
              <div className="w-full xl:w-1/2">
              <label className="mb-2.5 block text-black dark:text-white">
                Work Location <span className="text-meta-1">*</span>
              </label>
              <input
                type="text"
                name="work_location"
                placeholder="Enter Work Location"
                value={formData.work_location}
                onChange={handleChange}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
              {errors.work_location && <p className="text-meta-1">{errors.work_location}</p>}

              </div>
            </div>

            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
              <div className="w-full xl:w-1/2">
                <label className="mb-2.5 block text-black dark:text-white">
                   Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter address"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              {errors.address && <p className="text-meta-1">{errors.address}</p>}

              </div>
              <div className="w-full xl:w-1/2">
              <label className="mb-2.5 block text-black dark:text-white">
                Department <span className="text-meta-1">*</span>
              </label>
              <input
                type="text" 
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="Enter department"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
              {errors.department && <p className="text-meta-1">{errors.department}</p>}

              </div>
              <div className="w-full xl:w-1/2">
                <label className="mb-3 block text-black dark:text-white">
                  Upload Image
                </label>
                <input
                  name="image"
                  onChange={handleChange}
                  type="file"
                  accept="image/*"
                  className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
                />

              </div>

            </div>
            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
              <div className="w-full xl:w-1/2">
                <label className="mb-2.5 block text-black dark:text-white">
                Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter User"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              {errors.username && <p className="text-meta-1">{errors.username}</p>}

              </div>
              {/* <div className="w-full xl:w-1/2">
              <label className="mb-2.5 block text-black dark:text-white">
                Password <span className="text-meta-1">*</span>
              </label>
              <input
                type="text"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
              {errors.password && <p className="text-meta-1">{errors.password}</p>}
              </div> */}

              <div className="w-full xl:w-1/2">
              <label className="mb-2.5 block text-black dark:text-white">
                Client Id <span className="text-meta-1">*</span>
              </label>
              <input
                type="text"
                name="client_id"
                value={formData.client_id}
                onChange={handleChange}
                placeholder="Enter employee_code"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
              {errors.employee_code && <p className="text-meta-1">{errors.employee_code}</p>}

              </div>
            </div>

            <button className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">
              Register User
            </button>
          </div>
        </form>
      </div>
    </div>
    </>
)
};

export default UpdateUser;
