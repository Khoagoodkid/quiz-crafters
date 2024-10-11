import React, { useEffect, useState, useRef, useContext } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { io } from 'socket.io-client'
import { questions } from '../../../db'

import axios from 'axios'

import "./Room.css"
import Avatar from '@mui/material/Avatar'
import dummy from '../../assets/dummy.jpg'
import MemberCard from '../../components/MemberCard/MemberCard'
import GamePlay from '../../components/GamePlay/GamePlay'
import {motion} from "framer-motion"
import { MembersContext, QuestionContext, ServerContext, StartContext } from '../../context'

function Room({ user, question, isStart, roomId, messages, setIsOpenSetting }) {
    const { members, setMembers } = useContext(MembersContext)
    const messagesEndRef = useRef(null)
    const socket = useContext(ServerContext)
    const [room, setRoom] = useState(null)
    const location = useLocation()
    const [message, setMessage] = useState({
        name: user.name,
        text: "",
        roomId,
        type: "text"
    })
    useEffect(() => {
        messagesEndRef?.current?.scrollIntoView()
    }, [messages])
    const submitHandler = (e) => {
        e.preventDefault()
        if (!message.text) return
        // const dummyMsg = messages
        // dummyMsg.push(message)
        socket.emit("sendMsg", { dummyMsg: [...messages, message], roomId })
        setMessage({
            ...message, text: ""
        })
    }

    return (
        <>
            {!isStart ? (<div className='w-full text-white flex md:flex-row flex-col justify-center gap-10'>
                <div className='flex flex-col w-full md:w-1/2  justify-center items-center gap-10'>
                    <div className='flex flex-col items-center gap-0'>
                        <img src={dummy} className="relative w-40 z-10 mb-10 mt-2 rounded-full border-2 border-indigo-500 bg-slate-900 p-4  text-indigo-500" />
                        <span className='text-3xl font-bold'>{user.name}</span>

                    </div>
                    <form className='w-[90%] h-80 flex flex-col pointer-events-auto rounded-xl border-4 border-indigo-500 bg-slate-900 '
                        style={{ backgroundColor: 'rgba(71, 71, 71,0.5)' }}
                        onSubmit={submitHandler}
                    >
                        <div className='w-full h-[85%]  flex flex-col items-start text-left overflow-y-scroll overflow-x-hidden p-5 pl-3 pb-1 '>
                            {messages?.map((m) => {
                                return (
                                    <div className='flex flex-wrap items-start h-auto gap-2 '>
                                        {m.type === "text" &&
                                            <>
                                                <span className='font-bold'>{m.name}: </span>
                                                <span>{m.text}</span>
                                            </>
                                        }
                                        {m.type == "joined" && <span className='font-bold text-[--brand]'>{m.name} {m.text}</span>}
                                    </div>
                                )
                            })}
                            <div ref={messagesEndRef} />
                        </div>
                        <input style={{ backgroundColor: 'rgba(120, 119, 119,0.8)' }}
                            placeholder='Send message to your room...'
                            className='h-[15%] p-5 pl-2 border-none'
                            value={message.text}
                            onChange={(e) => setMessage({ ...message, text: e.target.value })}
                        />
                    </form>
                </div>
                <div className='w-full flex flex-col'>
                    <div>
                        <h2 className='text-2xl font-bold'>Participants: {members.length}</h2>
                    </div>
                    <div id="members-box" className=' w-full flex flex-wrap items-start overflow-y-croll rounded-xl border-4 border-indigo-500 bg-slate-900 p-4 h-full'

                    >

                        {members?.map((socketId) => {
                            return (
                                <div style={{ width: 'auto' }} key={socketId}>
                                    <MemberCard socketId={socketId} dummy={dummy} />

                                </div>
                            )
                        })}
                    </div>
                      
                </div>


            </div>) : (
                <GamePlay question={question} />
            )}
        </>
    )
}

export default Room