import React from 'react'
import { useCallback } from 'react';
import { useContext } from 'react';
import { useEffect } from 'react';
import { useState, useRef } from 'react';
import { useLocation } from 'react-router-dom'
import { ServerContext, UnAnsweredContext } from '../../context';
import { motion } from "framer-motion"
import { CountdownItem } from '../../components/GamePlay/GamePlay';
function QuizStream() {
    const socket = useContext(ServerContext)
    const { unAnswered, setUnAnswered } = useContext(UnAnsweredContext)
    const location = useLocation();
    const { questions, roomId } = location.state
    const [idx, setIdx] = useState(0)
    const [timer, setTimer] = useState(30)
    const sendQuestion = useCallback((index) => {
        // if (roomId) {

        socket.emit("sendQuestion", { ...questions[index], roomId: roomId, isStart:true })
        // }
    }, idx)
    useEffect(() => {
        sendQuestion(idx)
        setTimer(30)
    }, [idx])

    const intervalRef = useRef(null);

    // const {question,setQuestion} = useContext(QuestionContext)



    useEffect(() => {
        if (timer <= 0) {
            setTimer(0)
            clearInterval(intervalRef.current)
        }
        intervalRef.current = setInterval(() => {
            setTimer(timer - 1)
        }, 1000);

        return () => {
            clearInterval(intervalRef.current || undefined)
        };
    }, [timer]);
    const openScoreboard = () => {
        socket.emit("openScoreboard", {
            roomId: roomId, 
            isOpen: true
        })
    }
    const getWinner = () => {
        socket.emit("openWinner", {
            roomId:roomId,
            isOpenWinner: true
        })
    }
    return (
        <div className='absolute left-0 right-0 top-0 bottom-0 bg-[var(--background)] flex flex-col items-center overflow-hidden'>
            <div className='w-full h-full pb-5 justify-center pointer-events-auto flex flex-col items-center text-[--text] '>

                <div className='w-full relative h-[5%] flex flex-row items-center justify-start p-8 gap-3'>
                    Timer: <CountdownItem num={timer} text="s" />
                  
                    <div className="group relative w-fit transition-transform duration-300 active:scale-95"
                        onClick={() => {
                            if (idx < questions?.length - 1) setIdx(idx + 1)
                        }}
                    >
                        <button className="relative z-10 rounded-lg bg-gradient-to-br from-indigo-500 to-fuchsia-500 p-0.5 duration-300 group-hover:scale-110">
                            <span className="block rounded-md bg-slate-950 px-4 py-2 font-semibold text-slate-100 duration-300 group-hover:bg-slate-950/50 group-hover:text-slate-50 group-active:bg-slate-950/80">
                                Next
                            </span>
                        </button>
                        <span className="pointer-events-none absolute -inset-4 z-0 transform-gpu rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 opacity-30 blur-xl transition-all duration-300 group-hover:opacity-90 group-active:opacity-50" />
                    </div>
                    {unAnswered?.length == 0 && <div className="group relative w-fit transition-transform duration-300 active:scale-95"
                        onClick={() => {
                            openScoreboard()
                        }}
                    >
                        <button className="relative z-10 rounded-lg bg-gradient-to-br from-indigo-500 to-fuchsia-500 p-0.5 duration-300 group-hover:scale-110">
                            <span className="block rounded-md bg-slate-950 px-4 py-2 font-semibold text-slate-100 duration-300 group-hover:bg-slate-950/50 group-hover:text-slate-50 group-active:bg-slate-950/80">
                                Scoreboard
                            </span>
                        </button>
                        <span className="pointer-events-none absolute -inset-4 z-0 transform-gpu rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 opacity-30 blur-xl transition-all duration-300 group-hover:opacity-90 group-active:opacity-50" />
                    </div>}
                    {idx == questions?.length - 1 && <div className="group relative w-fit transition-transform duration-300 active:scale-95"
                        onClick={() => {
                            getWinner()
                        }}
                    >
                        <button className="relative z-10 rounded-lg bg-gradient-to-br from-indigo-500 to-fuchsia-500 p-0.5 duration-300 group-hover:scale-110">
                            <span className="block rounded-md bg-slate-950 px-4 py-2 font-semibold text-slate-100 duration-300 group-hover:bg-slate-950/50 group-hover:text-slate-50 group-active:bg-slate-950/80">
                                Finish
                            </span>
                        </button>
                        <span className="pointer-events-none absolute -inset-4 z-0 transform-gpu rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 opacity-30 blur-xl transition-all duration-300 group-hover:opacity-90 group-active:opacity-50" />
                    </div>}
                    <img src="/top-bar.png" className='absolute -right-10 top-0 ' />
                </div>
                <div className='w-full h-[90%] flex flex-row justify-center pt-4'>
                    <img src="/side-bar-r.png" className='hidden md:block' />
                    <Polygon>

                        <span className='w-[90%]'>{questions[idx]?.query}</span>
                    </Polygon>
                    <img src="/side-bar-r.png" className='hidden md:block' />
                </div>

                <motion.div
                    initial="initial"
                    whileInView="animate"
                    transition={{
                        staggerChildren: 0.05,
                    }}
                    viewport={{ once: true }}
                    className="flex flex-col w-full gap-3 h-[15%] md:flex-row">
                    <img src="/answ-bar-l.png" className='hidden md:block' />
                    {questions[idx]?.choices.map(option => {
                        return (
                            <motion.div variants={primaryVariants} className='p-8 text-2xl bg-slate-100 w-full font-bold flex items-center justify-center cursor-pointer hover:text-3xl hover:scale-125 transition-all md:w-1/4'
                                style={{ backgroundImage: 'url(/answ-card.png)', backgroundSize: '100% 100%' }}
                            >
                                {option.text}
                            </motion.div>
                        )
                    })}
                    <img src="/answ-bar-r.png" className='hidden md:block' />
                </motion.div>

            </div>
        </div>
    )
}
const Polygon = ({ children }) => {
    return (
        <motion.div initial="initial"
            whileInView="animate"
            transition={{
                staggerChildren: 0.05,
            }}
            viewport={{ once: true }} className="font-bold relative  text-white w-full h-[90%] relative float-left m-[30px] bg-[#4d4656] flex items-center justify-center text-xl p-10 md:text-5xl md:w-[80%]"
            style={{ backgroundImage: `url(/ques-card.png)`, backgroundSize: '100% 100%' }}
        >
            {/* <img src='/ques-card.png' className='absolute top-0 left-0 right-0 bottom-0'/> */}
            {children}
        </motion.div>
    )
}
const primaryVariants = {
    initial: {
        y: 25,
        opacity: 0,
    },
    animate: {
        y: 0,
        opacity: 1,
    },
};
export default QuizStream 