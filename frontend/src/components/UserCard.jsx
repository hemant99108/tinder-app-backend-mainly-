import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import {removeUserFromFeed} from './../utils/feedSlice';

function UserCard({user}) {
    const {_id,firstName,lastName,photoUrl,age,gender,about}=user;
    const dispatch=useDispatch();

    const handleSendRequest=async(status,userId)=>{
        try {
            const res=await axios.post(
                BASE_URL+'/request/send'+status+'/'+userId,{},{withCredentials:true}
            );

            dispatch(removeUserFromFeed(userId));
        } catch (error) {}
    }


  return (
    <div>UserCard</div>
  )
}

export default UserCard