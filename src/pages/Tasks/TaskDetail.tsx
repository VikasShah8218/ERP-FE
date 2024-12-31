import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState, useRef} from "react";
import { format } from "date-fns";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { patchToServer ,postToServer,getFromServer,postToServerFileUpload} from "../../globals/requests";
import Select from 'react-select'
import PDFImage from '../../static/image/pdf.png'
import { getCurrentLocation ,getPlaceName } from "../../utlis/locationUtils";
import { showMessages , showErrorAlert} from '../../globals/messages';
import { faCloudArrowUp,faPlus,faAngleLeft } from '@fortawesome/free-solid-svg-icons';


const TaskDetail:React.FC<{ setPage: Function; selectedTask: any ,setSelectedTask:Function, refreshTaskList:Function, optionUsers:any ,setOptionUsers:Function}> = ({setPage,selectedTask,refreshTaskList,optionUsers,setSelectedTask,setOptionUsers}) => {
    
    const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const normalizedDate = format(new Date(selectedTask.estimate_ex_date), "MMMM d, yyyy h:mm a");
    const [formDataRe, setFormDataRe] = useState({task:"",re_allocate_to: "", message: "."});
    const [userReallocateMap, setUserReallocateMap] = useState<Record<string, string>>({});
    const [selectLandmarkComplete, setSelectLandmarkComplete] = useState<any>(Number);
    const [assosiatedLandmakrs, setAssosiatedLandmakrs] = useState<any[]>([]);
    const [formData, setFormData] = useState({conversation: "",});
    const [taskTrakeData, setTaskTrakeData] = useState<any>({});
    const [addUserList, setAddUserList] = useState<any[]>([])
    const [addUserForm, setAddUserForm] = useState<any>({})
    const [placeName, setPlaceName] = useState<string>("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [taskMedia, setTaskMedia] = useState<any>([]);
    const [errors, setErrors] = useState<any>({});
    const fileRef = useRef(null);

    interface MediaItem {id: number; file_type: string; file: string; thumbnail: string; }
    interface MediaGalleryProps {mediaData: MediaItem[];}

    const processTaskMedia = (taskMedia: any[]) => {
    return taskMedia.map((media) => {
        let thumbnail = media.file; 
        if (media.file_type === "video") {
        thumbnail = media.file.replace("task_media", "thumbnail").replace(".mp4", ".jpg");
        } else if (media.file_type === "image" && media.file.endsWith(".jpg")) {
        thumbnail = media.file.replace("task_media", "thumbnail");
        } else {
        thumbnail = "http://127.0.0.1:8000/media/default-thumbnail.jpg";
        }
        return {
        ...media,
        thumbnail,
        };
    });
    };
    const getTaskMediaFiels = async (selectedTask:any) => {
        const taskMedia = await getFromServer(`/task_flow/task-media/?task_id=${selectedTask.id}`);
        if (taskMedia.status) {
            const processedMedia = processTaskMedia(taskMedia.data.results);
            setTaskMedia(processedMedia); // Set the modified data
        }
    };
    const getSelectedTask = async () => {
        const resSelectedTask = await getFromServer(`/task_flow/tasks/${selectedTask.id}`);
        if (resSelectedTask.status) {
            setSelectedTask(resSelectedTask.data)
        }
    };
    const fetchLocationData = async () => {
        try {
            const currentLocation = await getCurrentLocation();
            setLocation(currentLocation);
            getPlaceName(currentLocation.latitude,currentLocation.longitude);
            const name = await getPlaceName(currentLocation.latitude, currentLocation.longitude);
            setPlaceName(name);
            // const name = await getPlaceName(currentLocation.latitude, currentLocation.longitude);
            // setPlaceName(name);
        } catch (error) {
            console.error(error);
        }
    };
    const makeLandmarkList: Function = (selectedTask: any) => {
        if (!Array.isArray(selectedTask?.landmarks)) return [];
        setAssosiatedLandmakrs(
            selectedTask.landmarks
                .filter((landmark: any) => !landmark.is_complete)
                .map((landmark: any) => ({ value: landmark.id, label: landmark.name }))
        );
    }
    const taskTrace: Function = (selectedTask: any) => {
        if (!selectedTask.landmarks || !Array.isArray(selectedTask.landmarks)) return null;
    
        const totalLandmarks = selectedTask.landmarks.length;
        const landmarksComplete = selectedTask.landmarks.filter((landmark: any) => landmark.is_complete ).length;
        const temp=(selectedTask.landmarks.filter((landmark: any) => landmark.is_complete== false).length);
        const landmarksnotComplete = temp>0?temp:"0";
        const taskComplete = totalLandmarks > 0 ? ((landmarksComplete / totalLandmarks) * 100).toFixed(0) + "%" : "0%";
        setTaskTrakeData( {totalLandmarks,landmarksnotComplete,taskComplete,})
    };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type} = e.target;
        setFormData((prev:any) => {
            return { ...prev, [name]: value };
        });
    }
    const handelFileChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, type, files } = e.target;
        if( files.length >0 ){
            const formData =  new FormData()
            formData.append("task",selectedTask.id)
            formData.append("file",files[0])
            const response =  await postToServerFileUpload(`/task_flow/task-media/`,formData);
            if (response.status === 201 || response.status === 200){
                showMessages(response.data.detail);
                getTaskMediaFiels(selectedTask)
            }else{
                showErrorAlert(response.data.detail);
            }
            e.target.value = ""
        }
    };
    const getReAllocatedUser = async()=> {
        const reAllocatedUser = await getFromServer(`/task_flow/task-re-allocations/filter-by-task/?task_id=${selectedTask.id}`);
        if (reAllocatedUser.status){
            setUserReallocateMap(reAllocatedUser.data.user_reallocate_map);
        }
    }
    const handelSelectLandmarktoComplete = (selected:any) =>{
        setSelectLandmarkComplete(selected.value)
    }
    const validate = () => {
        const validationErrors: any = {};
        if (!formData.conversation.trim()) validationErrors.conversation = "Conversation is required , please write your requirements";
        return validationErrors;
    };
    const handelAccept = async () => {
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
          setErrors(validationErrors);
        }else{
        const response =  await patchToServer(`/task_flow/tasks/${selectedTask.id}/accept-task/`,formData);
        if (response.status === 201 || response.status === 200){
            getSelectedTask()
            showMessages(response.data.detail);
            formData.conversation = "";
        }else{
            showErrorAlert(response.data.detail);
        }
    }
    }
    const handelMessage = async () => {
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
          setErrors(validationErrors);
        }else{
        const response =  await patchToServer(`/task_flow/tasks/${selectedTask.id}/add-conversation/`,formData);
        if (response.status === 201 || response.status === 200){
            getSelectedTask();
            showMessages(response.data.detail);
            formData.conversation = "";
            setErrors({});
        }else{
            showErrorAlert(response.data.detail);
        }
    }
    }
    const handelTaskComplete = async () => {
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
          setErrors(validationErrors);
        }
        else{
            const response =  await patchToServer(`/task_flow/tasks/${selectedTask.id}/complete-task/`,formData);
            if (response.status === 201 || response.status === 200){
                showMessages(response.data.detail);
                getSelectedTask()
                formData.conversation = "";
            }else{
                showErrorAlert(response.data.detail);
            }
    }
    }
    const handelselectedUser1 = (selected:any) =>{
        setFormDataRe((prev) => {
            return { ...prev, re_allocate_to: selected.value,task: selectedTask.id }
          });
    }
    const validate2 = () => {
        const validationErrors: any = {};
        if (!formDataRe.re_allocate_to) validationErrors.re_allocate_to = "User is required.";
        return validationErrors;
    };
    const validate3 = () => {
        const validationErrors: any = {};
        if (!selectLandmarkComplete) validationErrors.completeLandMark = "Please select Landmark";
        return validationErrors;
    };
    const handelReallocate = async () => {
        const validationErrors = validate2();
        if (Object.keys(validationErrors).length > 0) {
          setErrors(validationErrors);
        }
        else{
            const response =  await postToServer(`/task_flow/task-re-allocations/`,formDataRe);
            if (response.status === 201 || response.status === 200){
                // refreshTaskList();
                // setPage("main");
                getReAllocatedUser()
                showMessages(response.data.detail);
                formData.conversation = "";
            }else{
                showErrorAlert(response.data.detail);
            }
    }
    }
    const handelCompleteLandMark = async () => {
        const validationErrors = validate3();
        if (Object.keys(validationErrors).length > 0) {
          setErrors(validationErrors);
        }
        else{
            const temp = {task:"",landmark:"",is_complete: true}
            temp.task = selectedTask.id;
            temp.landmark = selectLandmarkComplete;
            const response =  await postToServer(`/task_flow/task-landmark-completions/`,temp);
            if (response.status === 201 || response.status === 200){
                getSelectedTask()
                makeLandmarkList(selectedTask);
                taskTrace(selectedTask);
                setPage("main")
                refreshTaskList();
                showMessages(response.data.detail);

            }else{
                showErrorAlert(response.data.detail);
            }
    }
    }
    const filterUserList = () => {
        const selectedUserIds = selectedTask.assigned_users.map((user:any) => user.id);
        const userList = optionUsers.filter((option:any) => !selectedUserIds.includes(option.value));
        setAddUserList(userList)
    };
    const handelSelectedAddUser = (selected:any) => {
        const tempL:any =[]
        selected.forEach((element:any) => {
          tempL.push(element.value)
        })
        setAddUserForm({add_users:tempL})
    }
    const handelAddUser = async() => {
        console.log("Submitted");
        if(addUserForm.add_users.length===0){
            setErrors({addNewUser:"Please Select atleast One Employee"});
            return null;
        }
        else{
            const response = await patchToServer(`/task_flow/tasks/${selectedTask.id}/update-users/`,addUserForm);
            if (response.status === 201 || response.status === 200){
                getSelectedTask()
                showMessages(response.data.detail);
            }
            else{
                showErrorAlert(response.data.detail);
            }
        setErrors({})
        setAddUserForm({});
        setIsModalOpen(false); 
        filterUserList()
        }
    }
  
    const MediaGallery: React.FC<MediaGalleryProps> = ({ mediaData }) => {
        const openFile = () => {fileRef.current.click();}
        const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
        const closeFullView = () => setSelectedMedia(null);
        return (
            <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">Media Gallery</h3>
                <div className="flex space-x-2 overflow-x-auto p-2 bg-gray-800 rounded-md">
                {!(!selectedTask.is_started || selectedTask.is_complete )? <div onClick={openFile} className="min-w-[70px] min-h-[70px] bg-gray-700 flex items-center justify-center cursor-pointer rounded-md">
                    <div className="flex flex-col items-center justify-center ">
                        <input type="file" ref={fileRef}  onChange={handelFileChange}  hidden/>
                        <FontAwesomeIcon icon={faCloudArrowUp} color="#F15642" fontSize={25}/>
                    </div>
                </div> : <p> ! </p> }
                    {mediaData.map((media) => (
                        <div
                            key={media.id}
                            className="min-w-[100px] h-[100px] bg-gray-700 flex items-center justify-center cursor-pointer rounded-md hover:scale-105 transition-transform duration-300"
                            onClick={() => setSelectedMedia(media)}
                        >
                            {media.file_type === "image" || media.file_type === "video" ? (
                                <img
                                    src={media.thumbnail}
                                    alt="media-thumbnail"
                                    className="w-full h-full object-cover rounded-md"
                                />
                            ) : media.file_type === "pdf" ? (
                                <div className="flex flex-col items-center justify-center text-white">
                                    <img src={PDFImage} alt="PDF Icon" className="w-20 h-20 object-contain mb-2"/>
                                </div>
                            ) : (
                                <div className="text-white">❓</div>
                            )}
                        </div>
                    ))}
                </div>
                {selectedMedia && (
                    <div
                        className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-90 flex items-center justify-center z-50"
                    >
                        <div className="max-w-[80%] max-h-[80%] bg-white rounded-md overflow-hidden relative">
                            <button
                                onClick={closeFullView}
                                style={{zIndex:"9999"}}
                                className="absolute top-2 right-2 text-black bg-gray-200 hover:bg-gray-300 rounded-full w-8 h-8 flex items-center justify-center"
                            >
                                ✖️
                            </button>
                            {selectedMedia.file_type === "image" ? (
                                <div style={{maxWidth:"600px"}} >
                                    <img src={selectedMedia.file}  alt="full-view" className="w-full h-auto object-contain"/>
                                </div>
                            ) : selectedMedia.file_type === "video" ? (
                                <div style={{maxWidth:"700px"}} >
                                    <video src={selectedMedia.file} controls className="w-full h-auto object-contain" />
                                </div>
                            ) : selectedMedia.file_type === "pdf" ? (
                                <div style={{backgroundColor:"black"}} className="flex flex-col items-center justify-center p-4">
                                <a
                                    href={selectedMedia.file}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex flex-col items-center hover:scale-105 transition-transform duration-300"
                                >
                                    <img
                                        src={PDFImage}
                                        style={{width:"200px",height:"200px",backgroundColor:"black"}}
                                        alt="PDF Icon"
                                        className="w-20 h-20 object-contain mb-2"
                                    />
                                    {/* <span className="text-gray-100 font-medium">Open PDF</span> */}
                                </a>
                            </div>
                            ) : (
                                <div className="text-center text-gray-700 p-4">
                                    Unsupported file type
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    useEffect(()=>{
        getReAllocatedUser();
        makeLandmarkList(selectedTask);
        taskTrace(selectedTask);
        getTaskMediaFiels(selectedTask);
        fetchLocationData();
        filterUserList()
        
    },[])

    return(
        <>
          {/* { location?<>{location.latitude} {location.longitude}</> : "None" } */}
          {placeName?placeName:"None"}
            <div onClick={()=>{setPage("main")}} > <FontAwesomeIcon icon={faAngleLeft} /> </div> 

            <div className="flex p-5 bg-[#1E293B] shadow-md rounded-lg text-white">
                <h1 className="text-xl font-semibold mb-2">
                    Task Name: <span className="text-[#0EA5E9]">{selectedTask.name}</span>
                </h1>
                <h1 className="ml-4 text-xl font-semibold flex items-center">
                    {/* Status :  {"  "} */}
                    <span  className={`inline-flex rounded-full ml-2 bg-opacity-10 py-1 px-3 text-sm font-medium ${
                    selectedTask.is_complete
                        ? "bg-success text-success"
                        : selectedTask.is_started
                        ? "bg-warning text-warning"
                        : "bg-danger text-danger"
                    }`}
                    >
                    {selectedTask.is_complete
                    ? " Completed"
                    : selectedTask.is_started
                    ? " Active"
                    : " Pending"}
                    </span>
                </h1>
                <h1 className="ml-4 text-xl font-semibold mb-2">
                <span className="text-[#0EA5E9]"> {selectedTask.landmarks? (selectedTask.landmarks[0].name?selectedTask.landmarks[0].name:"NULL"):"NULL"}</span>
                </h1>
                <h1 className="text-xl ml-4 font-semibold mb-2 text-[#AA203B]">
                    {normalizedDate}
                </h1>
                <div>
                    {taskTrakeData && taskTrakeData.totalLandmarks ? (
                        <div className="p-4  rounded-md ">
                        <div className="flex  gap-2">
                            <div className="mr-1 text-gray-600 dark:text-gray-300">
                            <span className="font-medium"><FontAwesomeIcon icon="fa-solid fa-building-flag" /></span> {taskTrakeData.totalLandmarks}
                            </div>
                            <div className="mr-1 text-gray-600 dark:text-gray-300">
                            <span className="font-medium"><FontAwesomeIcon icon="fa-solid fa-spinner" /> </span> {taskTrakeData.landmarksnotComplete}
                            </div>
                            <div className="mr-1 text-gray-600 dark:text-green-300">
                            <span className="font-medium"><FontAwesomeIcon icon="fa-solid fa-check" /></span> {taskTrakeData.taskComplete}
                            </div>
                        </div>
                        </div>
                    ) : (
                        <div className="p-4 bg-red-100 text-red-600 rounded-md shadow-md dark:bg-red-800 dark:text-red-300">
                        Task data is not available.
                        </div>
                    )}
                </div>

            </div>
                        
            <div className="flex mt-2 gap-2 overflow-x-auto">
                <div title="Add User"  onClick={()=>{ setIsModalOpen(true) }} className="bg-blue-900 font-semibold text-white px-3 py-1 rounded-md text-sm shadow-md whitespace-nowrap">
                    <FontAwesomeIcon icon={faPlus} />
                </div>
                {selectedTask.assigned_users.map((user:any) => (
                    <div key={user.id} className="bg-blue-900 font-semibold text-white px-3 py-1 rounded-md text-sm shadow-md whitespace-nowrap">
                        {user.first_name}
                    </div>
                ))}
            </div>

            <div className="rounded-sm mt-2 border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                    <h3 className="font-medium text-black dark:text-white">
                    Instructions
                    <p className="text-gray-700 dark:text-gray-300 mt-2 text-sm leading-6">
                         {selectedTask.note}
                    </p>
                    </h3>
                </div>
                <div className="flex flex-col gap-5.5 p-6.5">
                    <div>
                        <label className="mb-3 block text-black dark:text-white">
                            Conversation
                        </label>
                        <textarea
                            rows={6}
                            disabled
                            value={selectedTask.conversation}
                            placeholder="Disabled textarea"
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary dark:disabled:bg-black">
                        </textarea>
                        {Object.keys(userReallocateMap).length > 0 && (
                            <div className="p-4">
                                <h2 className="text-lg font-bold mb-4">User Reallocation Map</h2>
                                <div className="flex flex-wrap gap-2">
                                {Object.entries(userReallocateMap).map(([user1, user2], index) => (
                                    <div
                                    key={index}
                                    className="flex items-center gap-4 p-2 rounded-md border border-gray-300 shadow-sm dark:border-gray-700 dark:bg-gray-800 min-w-[200px]"
                                    >
                                    <div className="font-medium text-gray-700 dark:text-gray-200">{user1}</div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">{`===>`}</div>
                                    <div className="font-medium text-gray-700 dark:text-gray-200">{user2}</div>
                                    </div>
                                ))}
                                </div>
                            </div>
                        )}
                        <div>
                            {/* Other UI components */}
                            <MediaGallery mediaData={taskMedia} />
                        </div>
                    </div>
                </div>
            </div>
        
            <div className="mt-2">
                <label className="mb-2 block text-black dark:text-white">
                  Add Conversation 
                </label>
                <div className="relative w-full">
                    <textarea
                    rows={1}
                    name="conversation"
                    value={formData.conversation}
                    onChange={handleChange}
                    placeholder="Add Message here"
                    className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
                    ></textarea>
                    <button
                        type="button"
                        onClick={handelMessage}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-primary text-white rounded-lg px-4 py-2 text-sm hover:bg-primary-dark transition">
                        Send
                    </button>
                </div>
                {errors.conversation && <p className="text-meta-1">{errors.conversation}</p>}
            </div>

            <div className="flex mt-2">
                <div className="w-full  mr-3  xl:w-1/3">
                    <label className="mb-2.5 block text-black dark:text-white">
                        Reallocate To <span className="text-meta-1">*</span>
                    </label>
                    <div className="relative z-20 bg-transparent dark:bg-form-input">
                        <Select options={optionUsers} onChange={handelselectedUser1}/>
                        {errors.re_allocate_to && <p className="text-meta-1">{errors.re_allocate_to}</p>}
                    </div>
                </div>
                <div className="w-full  mr-3  xl:w-1/3">
                    <label className="mb-2.5 block text-black dark:text-white">
                        Select Completed Landmark <span className="text-meta-1">*</span>
                    </label>
                    <div className="relative z-20 bg-transparent dark:bg-form-input">
                        <Select options={assosiatedLandmakrs} onChange={handelSelectLandmarktoComplete}/>
                        {errors.completeLandMark && <p className="text-meta-1">{errors.completeLandMark}</p>}
                    </div>
                </div>
                {/* <div className="flex  gap-5.5 p-5.5  xl:w-1/3">
                    <div>
                        <input type="file"  name="file" onChange={handelFileChange} className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"/>
                        {errors.file && <p className="text-meta-1">{errors.file}</p>}
                        {errors.task && <p className="text-meta-1">{errors.task}</p>}
                    </div>
                </div> */}
            </div>

            <div className="mt-5">
                <Stack spacing={2} direction="row">
                    {/* <Button onClick={handelMessage} className="mr-4" variant="contained" disabled={!selectedTask.is_started || selectedTask.is_complete}>Message</Button> */}
                    <Button onClick={handelTaskComplete} className="mr-4" variant="contained" disabled={!selectedTask.is_started || selectedTask.is_complete}>Task Completed</Button>
                    <Button onClick={handelCompleteLandMark} className="mr-4" variant="contained" disabled={!selectedTask.is_started || selectedTask.is_complete}>Mark Landmark Complete</Button>
                    <Button onClick={handelReallocate} className="mr-4" variant="contained" disabled={!selectedTask.is_started || selectedTask.is_complete}>User Reallocate</Button>
                    {/* <Button onClick={handelUploadFile} className="mr-4" variant="contained" disabled={!selectedTask.is_started || selectedTask.is_complete}>Upload Media</Button> */}
                    <Button onClick={handelAccept} className="mr-4" variant="contained" disabled={selectedTask.is_complete}>Accept</Button>
                </Stack>
            </div>

            {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" style={{backdropFilter:"blur(2px)"}}>
                {/* Modal Content */}
                <div className="bg-black rounded-lg shadow-lg w-11/12 max-w-md mx-auto p-5">
                <h3 className="text-lg font-semibold text-white-800 mb-4 text-center">Add User</h3>

                <div className="w-full border border-gray-300 rounded-md p-3 mb-4 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none">
                <Select options={addUserList}  isMulti onChange={handelSelectedAddUser} />    
                {errors.addNewUser && <p className="text-meta-1">{errors.addNewUser}</p>}

                </div>          
        

                {/* Buttons */}
                <div className="flex justify-between">
                    <button
                    onClick={()=>{ setIsModalOpen(false)}}
                    className="w-[48%] px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    >
                    Cancel
                    </button>
                    <button
                    onClick={handelAddUser}
                    className="w-[48%] px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                    Submit
                    </button>
                </div>
                </div>
            </div>
            )}

        </>
    )
}
export default TaskDetail

