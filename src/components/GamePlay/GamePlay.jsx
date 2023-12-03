import React, { useState, useContext, createContext, useRef } from 'react'
import "./GamePlay.css"
import { motion, AnimatePresence } from "framer-motion"
import Waiting from '../Waiting/Waiting'
import { AuthContext, GamePlayContext, MeContext, QuestionContext, ServerContext } from '../../context'
import { useEffect } from 'react'
export const RoomIdContext = createContext()


function GamePlay({ question }) {
    const { unAnswered, answerQuestion, me, timer, setTimer,selectedOption, setSelectedOption } = useContext(GamePlayContext)

    const { user, setUser } = useContext(AuthContext)
    const socket = useContext(ServerContext)
    const intervalRef = useRef(null);
    
    // const {question,setQuestion} = useContext(QuestionContext)
    const overTime = () => {
        setTimer(0)
        answerQuestion(false)
        const wrongAns = question.choices.find((c) => c.isCorrect == false)
        setSelectedOption(wrongAns)
    
    }


    useEffect(() => {
        if (timer <= 0 && !selectedOption) {
            overTime()
        }
        intervalRef.current = setInterval(() => {
            setTimer(timer-1)
        }, 1000);

        return () => {
            clearInterval(intervalRef.current || undefined)
        };
    }, [timer]);


    return (
        <>
            {!selectedOption && <div className='w-full h-full justify-center pointer-events-auto flex flex-col items-center text-[--text] '>
                {question && <>
                    <div className='w-full relative h-[5%] flex flex-row items-center justify-start'>
                        <img src="/top-bar.png" className='absolute -right-10 top-0 ' />
                        Timer:  <CountdownItem num={timer} text="s" />
                    </div>
                    <div className='w-full h-[90%] flex flex-row justify-center pt-4'>
                        <img src="/side-bar-r.png" className='hidden md:block' />
                     
                        <Polygon>

                            <span className='w-[90%]'>{question?.query}</span>
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
                        {question?.choices.map(option => {
                            return (
                                <motion.div variants={primaryVariants} className='p-8 text-2xl bg-slate-100 w-full font-bold flex items-center justify-center cursor-pointer hover:text-3xl hover:scale-125 transition-all md:w-1/4'
                                    style={{ backgroundImage: 'url(/answ-card.png)', backgroundSize: '100% 100%' }}
                                    onClick={() => {
                                        answerQuestion(option.isCorrect)
                                        setSelectedOption(option)
                                        setTimer(30)
                                        clearInterval(intervalRef.current || undefined)
                                    }}>
                                    {option.text}
                                </motion.div>
                            )
                        })}
                        <img src="/answ-bar-r.png" className='hidden md:block' />
                    </motion.div>
                </>}
            </div>}
            {selectedOption &&
                <RoomIdContext.Provider value={question?.roomId}>

                    <Waiting unAnswered={unAnswered} selectedOption={selectedOption} />
                </RoomIdContext.Provider>
            }
        </>
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
export const CountdownItem = ({ num, text }) => {
    return (
      <div className="flex w-fit items-center justify-center gap-1.5 py-2">
        <div className="relative w-full overflow-hidden text-center">
          <AnimatePresence mode="popLayout">
            <motion.span
              key={num}
              initial={{ y: "100%" }}
              animate={{ y: "0%" }}
              exit={{ y: "-100%" }}
              transition={{ ease: "backIn", duration: 0.75 }}
              className="block font-mono text-sm font-semibold md:text-base"
            >
             {num}
            </motion.span>
          </AnimatePresence>
        </div>
        <span>{text}</span>
      </div>
    );
  };
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

const avatarVariants = {
    initial: {
        x: 10,
        opacity: 0,
    },
    animate: {
        x: 0,
        opacity: 1,
    },
};

export default GamePlay