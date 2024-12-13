import ShowTasks from "./ShowTasks";
import { getFromServer } from '../../globals/requests';
// import RegisterUser from "./RegisterUser";
// import UpdateUser from "./UpdateUser";
import { useEffect, useState } from 'react';
import CreateTask from "./CreateTask";
import TaskDetail from "./TaskDetail";

const Users :React.FC = () => {
    
    // const [page, setPage] = useState(true)
    const [page, setPage] = useState<"main" | "createTask" | "taskDetail">("main");
    const [allTasksList,setAllTasksList] = useState([])
    const [selectedTask,setSelectedTask] = useState({})
    const [optionUsers,setOptionUsers] = useState<any[]>([])
 
    const getAllTaskList = async()=> {
        const resTasks = await getFromServer("/task_flow/tasks");
        if (resTasks.status){
            setAllTasksList(resTasks.data.results)
        }
    }
    
    const getUsers = async()=> {
      const resUsers = await getFromServer("/task_flow/get-users-with-landmarks/");
      if (resUsers.status){
          const temp:any = [];
          const LandMarkData:any = {};
          resUsers.data.forEach((element:any) => {
            temp.push({value:element.id,label:element.username})
            element.landmarks.forEach((userLandmark:any) => {
              if(!LandMarkData[userLandmark.id]){
                LandMarkData[userLandmark.id] =[]
              }
              LandMarkData[userLandmark.id].push({value:element.id,label:element.username})
            });
          });
          setOptionUsers(temp)
      }
    }

    useEffect(() => {
        getAllTaskList();
        getUsers();
    }, []);

  return (
    <>
      {page === "main" && <ShowTasks setPage={setPage} allTasksList={allTasksList} setSelectedTask={setSelectedTask} />}
      {page === "createTask" && <CreateTask setPage={setPage} refreshTaskList={getAllTaskList}/>}
      {page === "taskDetail" && <TaskDetail setPage={setPage} refreshTaskList={getAllTaskList} selectedTask={selectedTask} optionUsers={optionUsers}/>}
    </>
  )
};

export default Users;
