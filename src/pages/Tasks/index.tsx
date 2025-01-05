import ShowTasks from "./ShowTasks";
import { getFromServer } from '../../globals/requests';
import { useEffect, useState } from 'react';
import CreateTask from "./CreateTask";
import TaskDetail from "./TaskDetail";
import { useSelector } from "react-redux";

const Users :React.FC = () => {
    
    const userId = useSelector((state:any) => state.auth.user.id);
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
            if ( element.id !== userId  ){
              temp.push({value:element.id,label:element.first_name})
              element.landmarks.forEach((userLandmark:any) => {
                  if(!LandMarkData[userLandmark.id]){
                    LandMarkData[userLandmark.id] =[]
                  }
                  LandMarkData[userLandmark.id].push({value:element.id,label:element.first_name})
              });
            }
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
      {page === "taskDetail" && <TaskDetail setPage={setPage} refreshTaskList={getAllTaskList} selectedTask={selectedTask} optionUsers={optionUsers} setSelectedTask={setSelectedTask} setOptionUsers={setOptionUsers}/>}
    </>
  )
};

export default Users;
