import React, { useState, useEffect, createContext, useContext } from 'react'
import "./Home.css"
import { io } from 'socket.io-client'
import { questions } from '../../../db'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import Room from '../Room/Room'
import bg from '../../assets/bg.jpg'
import TextField from '@mui/material/TextField'
import { dbUrl, usersUrl } from '../../tools'
import Questions from '../../components/Questions/Questions'
import { GamePlayContext, MeContext, MembersContext, QuestionContext, ServerContext, StartContext, UnAnsweredContext } from '../../context'
import TopBar from '../../components/TopBar/TopBar'

import { useAnimate } from "framer-motion";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// const url = 'http://localhost:3000/'
import music from "/music.mp4"
import { useRef } from 'react'
import Setting from '../../components/Setting/Setting'
import SettingsIcon from '@mui/icons-material/Settings';
function Home() {
    const socket = useContext(ServerContext)
    const navigate = useNavigate()
    // const {question,setQuestion} = useContext(QuestionContext)
    const { members, setMembers } = useContext(MembersContext)
    // const {isStart, setIsStart} = useContext(StartContext)
    const [isStart, setIsStart] = useState(false)
    // const {me, setMe} = useContext(MeContext)
    const [me, setMe] = useState(null)
    const { unAnswered, setUnAnswered } = useContext(UnAnsweredContext)
    // const [unAnswered, setUnAnswered] = useState(null)
    const [count, setCount] = useState(0)
    const [roomId, setRoomId] = useState(null)
    const [question, setQuestion] = useState(null)
    const [isLogin, setIsLogin] = useState(false)
    const [rooms, setRooms] = useState(null)
    const [isCreator, setIsCreator] = useState(false)

    const [user, setUser] = useState({
        name: null,
        points: 0

    })
    const [timer, setTimer] = useState(30)

    const [scope, animate] = useAnimate();

    const [size, setSize] = useState({ columns: 0, rows: 0 });
    const [messages, setMessages] = useState([])
    const [audioPlay, setAudioPlay] = useState(false)
    const [soundTrigger, setSoundTrigger] = useState(0)
    const [isOpenSetting, setIsOpenSetting] = useState(false);
    const [volume, setVolume] = useState(.5)
    const [selectedOption, setSelectedOption] = useState(null)
    const [isOpenScoreboard, setIsOpenScoreboard] = useState(false)
    const [users, setUsers] = useState([])
    const [isOpenWinner,setIsOpenWinner] = useState(false)
    useEffect(() => {
        generateGridCount();
        document.getElementById("audio").volume = volume
        window.addEventListener("resize", generateGridCount);

        return () => window.removeEventListener("resize", generateGridCount);
    }, []);
    useEffect(() => {
        document.getElementById("audio").volume = volume
    }, [volume])

    useEffect(() => {
        socket.on("getQuestion", question => {
            setIsStart(question.question.isStart)
            setTimer(30)
            setQuestion(question.question)
            setUnAnswered(question.unAnswered)
            setSelectedOption(null)
            setIsOpenScoreboard(false)
        })
        socket.on("getMe", signal => {
            const { socketId, rooms } = signal

            setMe(socketId)
            setRooms(rooms)
        })
        socket.on("newMember", signal => {
            const { members, messages } = signal
            setMembers(members)
            setMessages(messages)
        })
        socket.on("memberLeft", members => {
            setMembers(members)
        })
        socket.on("clearMembers", members => {
            setMembers(members)
            setIsLogin(false)
            window.location.reload()
        })
        
        socket.on("getUnAnswered", unAnswered => {
            console.log(unAnswered)
            setUnAnswered(unAnswered)
        })
        socket.on("roomList", rooms => {
            console.log(rooms)
            setRooms(rooms)
        })
        socket.on("getMsg", messages => {
            setMessages(messages)
            console.log(messages)
        })
        socket.on("getScoreboard", isOpen => {
            setIsOpenScoreboard(isOpen)
        })
        socket.on("getWinner", isOpenWinner => {
            setIsOpenWinner(isOpenWinner)
        })

    }, [])
    ////
    const generateGridCount = () => {
        const columns = Math.floor(document.body.clientWidth / 75);
        const rows = Math.floor(document.body.clientHeight / 75);

        setSize({
            columns,
            rows,
        });
    };

    const handleMouseLeave = (e) => {
        // @ts-ignore
        const id = `#${e.target.id}`;
        animate(id, { background: "rgba(129, 140, 248, 0)" }, { duration: 1.5 });
    };

    const handleMouseEnter = (e) => {
        // @ts-ignore
        const id = `#${e.target.id}`;
        animate(id, { background: "rgba(129, 140, 248, 1)" }, { duration: 0.15 });
    };

    ////


    const joinRoom = async () => {
        const users = await axios.get(usersUrl)
        // console.log(users)
        const sameName = users.data?.some((u) => {
            return u.name == user.name && u.roomId == roomId
        })
        if (sameName) {
            toast.error("Already existing that username")
            return
        }
        console.log(user)
        if (!(roomId in rooms)) {
            toast.error("Room number is not available")
            return;
        }
        socket.emit("joinRoom", (roomId))
        setIsLogin(true)
        login({
            ...user,
            socketId: me,
            roomId
        })
        document.getElementById("audio").play()
        //send joining message
        socket.emit("sendJoinMsg",
            {
                name: user.name,
                text: "wants to make some noise.",
                roomId,
                type: "joined"
            }

        )
    }


    const login = (user) => {
        console.log(user)


        axios.post(dbUrl + 'users/', user)
            .then(res => {
                setUser(
                    user
                )
            })

    }

    const answerQuestion = (isCorrect) => {

        socket.emit('answeredSignal', {
            socketId: me,
            roomId
        })
        if (isCorrect) {
            let curPoint = user.points + 10
            setUser({
                ...user,
                points: curPoint
            })
          
            axios.patch(usersUrl + me, { curPoint })
        }

    }
    const getUsers = async () => {
        let data = []
        await axios.get(usersUrl)
            .then((res) => {
                console.log(res.data)
                data = res.data
            })
        const filter = data.filter(user => {

            return user.roomId == roomId
        })
        setUsers(filter)

    }
    return (
        <div className="homeBody bg-neutral-950 " >
            <ToastContainer/>
            {isLogin && <SettingsIcon className='absolute left-5 top-5 cursor-pointer text-[--text]'
                onClick={() => setIsOpenSetting(true)}
            />}
            <video src='music.mp4'
                controls
                id="audio"
                onPlay={() => setAudioPlay(true)} className=' hidden absolute top-0 left-0 right-0 bottom-0'

            />
            {!isLogin && <TopBar isOpenSetting={isOpenSetting} setIsOpenSetting={setIsOpenSetting} />}
            <div className="bg-neutral-950 w-full "

            >
                <Setting isOpen={isOpenSetting} setIsOpen={setIsOpenSetting} volume={volume} setVolume={setVolume} />
                <div
                    ref={scope}
                    className="grid h-screen w-full grid-cols-[repeat(auto-fit,_minmax(75px,_1fr))] grid-rows-[repeat(auto-fit,_minmax(75px,_1fr))]"
                >
                    {[...Array(size.rows * size.columns)].map((_, i) => (
                        <div
                            key={i}
                            id={`square-${i}`}
                            onMouseLeave={handleMouseLeave}
                            onMouseEnter={handleMouseEnter}
                            className="h-full w-full border-[1px] border-neutral-900"
                        />
                    ))}
                </div>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center p-8">
                    {!isLogin && <>
                        <h1 className="text-center text-7xl font-black uppercase text-white sm:text-8xl md:text-9xl">
                            Quiz Crafters
                        </h1>

                        <div className='flex flex-col p-5 text-white justify-center font-bold'>
                            <div className='flex flex-row items-center justify-between gap-10 text-2xl'>
                                <span>Name</span>
                                <div>
                                    <TextField id="standard-basic" label="Name" variant="standard"
                                        onChange={(e) => setUser({ ...user, name: e.target.value })}
                                        sx={{ label: { color: 'white' }, input: { color: 'white' } }}
                                        className='pointer-events-auto'
                                    />
                                </div>


                            </div>

                            <div className='flex flex-row items-center justify-between gap-10 text-2xl'>

                                <span>Join Room</span>
                                <div>

                                    <TextField id="standard-basic" label="Room ID" variant="standard"
                                        onChange={(e) => setRoomId(e.target.value)}
                                        sx={{ label: { color: 'white' }, input: { color: 'white' } }}
                                        className='pointer-events-auto'
                                    />

                                </div>
                            </div >

                        </div>
                        <button className="pointer-events-auto bg-indigo-400 px-4 py-2 text-xl font-bold uppercase text-neutral-950 mix-blend-difference"
                            onClick={() => joinRoom()}
                        >
                            Join Room
                        </button>
                    </>
                    }
                    {isLogin && (
                        <GamePlayContext.Provider value={{
                            unAnswered, answerQuestion, me, timer, setTimer, selectedOption, setSelectedOption, isOpenScoreboard,
                            users, setUsers, isOpenWinner
                        }}>
                            <Room question={question} user={{ ...user, socketId: me }} me={me} members={members}
                                setIsOpenSetting={setIsOpenSetting}
                                isStart={isStart} roomId={roomId} messages={messages} />

                        </GamePlayContext.Provider>

                    )

                    }
                </div>
            </div>





        </div >
    )
}

export default Home