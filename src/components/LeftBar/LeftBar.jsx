import React, { useContext } from 'react'
import "./LeftBar.css"
import { Link } from 'react-router-dom'
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import AppsIcon from '@mui/icons-material/Apps';
import { AuthContext, RoomContext, ServerContext } from '../../context';

function LeftBar() {
    const {user,setUser} = useContext(AuthContext)
    const {roomId,setRoomId} = useContext(RoomContext)
    const socket = useContext(ServerContext)
    const logOut = () => {
        setUser(null)
        socket.emit("deleteRoom", roomId)
        setRoomId(null)
        sessionStorage.removeItem("_id")
    }
    const {email} = user
    return (
        <div className='flex flex-col justify-between w-40 bg-slate-900 text-white items-center p-3 '>
            <img src="/logo.png" className='h-40'/>
            <div className='flex flex-col w-full gap-2'>
                <div className='flex flex-col items-center w-full'>
                    <hr className='w-3/4 bg-white h-.5' />
                    <div className='flex flex-col w-full items-center mt-2'>
                        <AppsIcon />
                        <Link to="/creator" style={{ color: 'white' }}>Collections</Link>

                    </div>
                    <div className='flex flex-col w-full items-center'>
                        <MeetingRoomIcon />
                        <Link to="/creator/host"
                      
                        style={{ color: 'white' }}>Room</Link>

                    </div>
                    <hr className='w-3/4 bg-white h-.5' />
                </div>
                <div className='flex flex-col gap-2'>
                    <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" />
                    {email || ''}
                    <button onClick={() => logOut()} className='text-slate-900'>Log out</button>
                </div>
            </div>
        </div>
    )
}

export default LeftBar