import React, { useContext, useState, useEffect } from 'react'
import "./RoomCreator.css"
import LeftBar from '../LeftBar/LeftBar'
import { MembersContext, RoomContext, ServerContext, UnAnsweredContext } from '../../context'
import MemberCard from '../MemberCard/MemberCard'
import { CountdownItem } from '../GamePlay/GamePlay'


function RoomCreator() {
    const socket = useContext(ServerContext)
    const { roomId, setRoomId } = useContext(RoomContext)
    // const [roomId,setRoomId] = useState(null)
    const { members, setMembers } = useContext(MembersContext)
    const { unAnswered, setUnAnswered } = useContext(UnAnsweredContext)


    useEffect(() => {


        socket.on("newMember", signal => {
            const { members, messages } = signal
            setMembers(members)

        })
        socket.on("memberLeft", members => {
            setMembers(members)
        })
        socket.on("getUnAnswered", unAnswered => {
            console.log(unAnswered)
            setUnAnswered(unAnswered)
        })
        socket.on("getQuestion", question => {

            setUnAnswered(question.unAnswered)

        })
        socket.on("clearMembers", members => {
            setMembers(members)

        })
        // socket.on("getUnAnswered", unAnswered => {
        //     console.log(unAnswered)
        //     setUnAnswered(unAnswered)
        // })
    }, [])
    const createRoom = () => {
        if (roomId) return
        const generatedRoomId = JSON.stringify(Math.floor(100000 + Math.random() * 900000))
        // const generatedRoomId = "123"
        setRoomId(generatedRoomId)

        socket.emit("createRoom", generatedRoomId)


    }
    const removeRoom = () => {
        socket.emit("deleteRoom", roomId)
        setRoomId(null)
    }
    return (
        <div className='hosting-body'>
            <LeftBar />
            <div className="flex flex-col w-full">
                <div className='flex flex-row justify-between w-full bg-[#232323] p-3 px-8 text-white'>
                    <div className="flex flex-row gap-3 items-center">


                        <button onClick={() => createRoom()}
                            className='bg-[--brand] text-slate-900'
                        >
                            Create room
                        </button>
                        <span>Room Id: {roomId}</span>
                    </div>
                    <div>
                        <button onClick={() => removeRoom()}
                            className='bg-[--brand] text-slate-900'
                        >
                            Leave room
                        </button>

                    </div>




                </div>
                <div className="flex flex-col bg-[--background] h-screen text-white">
                    <span className='text-xl font-bold flex flex-row items-center justify-center'>Participants: <CountdownItem num={members?.length} text="" /></span>
                    <div className='flex flex-wrap gap-8'>
                        {members?.map((m) => {
                            return (
                                <MemberCard socketId={m} />
                            )
                        })}

                    </div>
                </div>
            </div>
        </div>
    )
}

export default RoomCreator