import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState} from "react";
import { format } from "date-fns";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { patchToServer ,postToServer,getFromServer,postToServerFileUpload} from "../../globals/requests";
import Select from 'react-select'


const TaskDetail:React.FC<{ setPage: Function; selectedTask: any , refreshTaskList:Function, optionUsers:any }> = ({setPage,selectedTask,refreshTaskList,optionUsers}) => {
    const [formData, setFormData] = useState({conversation: "",});
    const [errors, setErrors] = useState<any>({});
    const [formDataRe, setFormDataRe] = useState({task:"",re_allocate_to: "", message: "."});
    const [uploadFile, setUploadFile] = useState({task:"",file: "",});
    const [userReallocateMap, setUserReallocateMap] = useState<Record<string, string>>({});
    const [assosiatedLandmakrs, setAssosiatedLandmakrs] = useState<any[]>([]);
    const [selectLandmarkComplete, setSelectLandmarkComplete] = useState<any>(Number);
    const [taskTrakeData, setTaskTrakeData] = useState<any>({});
    const [taskMedia, setTaskMedia] = useState<any>([]);

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
        // console.log(taskMedia)
        if (taskMedia.status) {
            console.log(taskMedia.data.results)
          const processedMedia = processTaskMedia(taskMedia.data.results);
        //   console.log(processedMedia)
          setTaskMedia(processedMedia); // Set the modified data
        console.log("*-*-*-*-*-*-*-*-*-**-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*")
        console.log(processedMedia) // Set the modified data
        console.log("*-*-*-*-*-*-*-*-*-**-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*")
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
        console.log( "landmarksnotComplete: ", landmarksnotComplete )
        const taskComplete = totalLandmarks > 0 ? ((landmarksComplete / totalLandmarks) * 100).toFixed(0) + "%" : "0%";
        setTaskTrakeData( {totalLandmarks,landmarksnotComplete,taskComplete,})
    };
        
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type} = e.target;
        setFormData((prev:any) => {
            return { ...prev, [name]: value };
        });
    }

    const handelFileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, type, files } = e.target;
        if (type === "file") {
            const selectedFile = files ? files[0] : null;
            setUploadFile((prev) => ({...prev,task: selectedTask.id,[name]: selectedFile,}));
            // console.log("Selected File:", selectedFile); 
        }
    };

    const getReAllocatedUser = async()=> {
        const reAllocatedUser = await getFromServer(`/task_flow/task-re-allocations/filter-by-task/?task_id=${selectedTask.id}`);
        if (reAllocatedUser.status){
            console.log(reAllocatedUser.data.user_reallocate_map);
            setUserReallocateMap(reAllocatedUser.data.user_reallocate_map);
        }
    }
  
    const handelSelectLandmarktoComplete = (selected:any) =>{
        setSelectLandmarkComplete(selected.value)
        console.log(selected.value)
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
        console.log(formData)
        const response =  await patchToServer(`/task_flow/tasks/${selectedTask.id}/accept-task/`,formData);
        if (response.status === 201 || response.status === 200){
            refreshTaskList();
            setPage("main");
            formData.conversation = "";
        }
    }
    }

    const handelMessage = async () => {
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
          setErrors(validationErrors);
        }else{
        console.log(formData)
        const response =  await patchToServer(`/task_flow/tasks/${selectedTask.id}/add-conversation/`,formData);
        if (response.status === 201 || response.status === 200){
            refreshTaskList();
            setPage("main");
            formData.conversation = "";

        }
    }
    }

    const handelTaskComplete = async () => {
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
          setErrors(validationErrors);
        }
        else{
            console.log(formData)
            const response =  await patchToServer(`/task_flow/tasks/${selectedTask.id}/complete-task/`,formData);
            if (response.status === 201 || response.status === 200){
                refreshTaskList();
                setPage("main");
                formData.conversation = "";
            }
    }
    }

    const handelselectedUser1 = (selected:any) =>{
        console.log(selected)
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
    const validate4 = () => {
        const validationErrors: any = {};
        // console.log(uploadFile.file, "----");

        if (!uploadFile.file) validationErrors.file = "Please select a File";
        if (!uploadFile.task) validationErrors.task = "Error With Task Id";
        return validationErrors;
    };
    const handelReallocate = async () => {
        const validationErrors = validate2();
        if (Object.keys(validationErrors).length > 0) {
          setErrors(validationErrors);
        }
        else{
            console.log(formDataRe)
            const response =  await postToServer(`/task_flow/task-re-allocations/`,formDataRe);
            if (response.status === 201 || response.status === 200){
                refreshTaskList();
                setPage("main");
                console.log(response)
                // formData.conversation = "";
            }
            console.log(response)
    }
    }
    const handelCompleteLandMark = async () => {
        const validationErrors = validate3();
        if (Object.keys(validationErrors).length > 0) {
          setErrors(validationErrors);
        }
        else{
            // console.log(formDataRe)
            const temp = {task:"",landmark:"",is_complete: true}
            temp.task = selectedTask.id;
            temp.landmark = selectLandmarkComplete;
            const response =  await postToServer(`/task_flow/task-landmark-completions/`,temp);
            if (response.status === 201 || response.status === 200){
                refreshTaskList();
                setPage("main");
                console.log(response)
            }
            console.log(temp)
    }
    }
    const handelUploadFile = async () => {
        const validationErrors = validate4();
        if (Object.keys(validationErrors).length > 0) {
          setErrors(validationErrors);
        }
        else{
            const formData =  new FormData()
            formData.append("task",selectedTask.id)
            formData.append("file",uploadFile.file)
            const response =  await postToServerFileUpload(`/task_flow/task-media/`,formData);
            if (response.status === 201 || response.status === 200){
                refreshTaskList();
                // setPage("main");
                console.log(response)
            }
            // console.log(uploadFile)
        }
    }
    

    interface MediaItem {
        id: number;
        file_type: string; // 'image' or 'video'
        file: string; // Media file URL
        thumbnail: string; // Media file URL
    }
    
    interface MediaGalleryProps {
        mediaData: MediaItem[]; // Array of media items
    }
    
    const MediaGallery: React.FC<MediaGalleryProps> = ({ mediaData }) => {
        const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
        const closeFullView = () => setSelectedMedia(null);
        return (
        <div className="p-4">
            <h3 className="text-lg font-semibold mb-2">Media Gallery</h3>
            <div className="flex space-x-2 overflow-x-auto p-2 bg-gray-800 rounded-md">
            {mediaData.map((media) => (
                <div key={media.id} className="min-w-[100px] h-[100px] bg-gray-700 flex items-center justify-center cursor-pointer rounded-md"
                onClick={() => setSelectedMedia(media)}>
                {media.file_type === "image" || media.file_type === "video" ? (
                    <img
                    src={media.thumbnail}
                    alt="media-thumbnail"
                    className="w-full h-full object-cover rounded-md"
                    />
                ) : (
                    <div className="text-white">▶️</div> 
                )}
                </div>
            ))}
            </div>
            {selectedMedia && (
            <div onClick={closeFullView} className="fixed top-0 left-30 w-full h-full bg-black bg-opacity-90 flex items-center justify-center z-50">
                {selectedMedia.file_type === "image" ? 
                (<img src={selectedMedia.file} alt="full-view" className="max-w-full max-h-full rounded-md" />) : 
                (<video src={selectedMedia.file} controls className="max-w-full max-h-full rounded-md"/>)}
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
    },[])

    const normalizedDate = format(new Date(selectedTask.estimate_ex_date), "MMMM d, yyyy h:mm a");
    return(
        <>
            <div onClick={()=>{setPage("main")}} > <FontAwesomeIcon icon="fa-solid fa-angle-left" /> </div> 

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
                {selectedTask.assigned_users.map((user:any) => (
                    <div key={user.id} className="bg-blue-900 font-semibold text-white px-3 py-1 rounded-md text-sm shadow-md whitespace-nowrap">
                        {user.first_name}
                    </div>
                ))}
            </div>

            <div className="rounded-sm mt-2 border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                    <h3 className="font-medium text-black dark:text-white">
                    Note for this Task
                    </h3>
                </div>
                <div className="flex flex-col gap-5.5 p-6.5">
                    {selectedTask.note}
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
                <textarea
                  rows={1}
                  name="conversation"
                  value={formData.conversation}
                  onChange={handleChange}
                  placeholder="Add Message here"
                  className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
                ></textarea>
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

                <div className="flex  gap-5.5 p-5.5  xl:w-1/3">
                    <div>
                        <input type="file"  name="file" onChange={handelFileChange} className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"/>
                        {errors.file && <p className="text-meta-1">{errors.file}</p>}
                        {errors.task && <p className="text-meta-1">{errors.task}</p>}
                    </div>
                </div>
                
            </div>

            <div className="mt-5">
                <Stack spacing={2} direction="row">
                    <Button onClick={handelMessage} className="mr-4" variant="contained" disabled={!selectedTask.is_started}> Message</Button>
                    <Button className="mr-4"variant="contained" disabled={!selectedTask.is_started} > Add Sub Task </Button>
                    <Button onClick={handelTaskComplete}  className="mr-4" variant="contained" disabled={!selectedTask.is_started} > Task Completed </Button>
                    <Button onClick={handelCompleteLandMark}  className="mr-4" variant="contained" disabled={!selectedTask.is_started} >  Mark Landmark Complete </Button>
                    <Button onClick={handelReallocate}  className="mr-4" variant="contained" disabled={!selectedTask.is_started} >  User Realocate </Button>
                    <Button onClick={handelUploadFile}  className="mr-4" variant="contained" disabled={!selectedTask.is_started} >  Upload Media </Button>
                    <Button onClick={handelAccept} className="mr-4" variant="contained" > Accept </Button>
                </Stack>
            </div>
        </>
    )
}
export default TaskDetail

