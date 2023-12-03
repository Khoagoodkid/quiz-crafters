import React, { useEffect, useState } from 'react'
import ReactConfetti from 'react-confetti'
import { motion } from "framer-motion";
import { useContext } from 'react';
import { GamePlayContext } from '../../context';
import ScoreBoard from '../ScoreBoard/ScoreBoard';
import Winner from '../Winner/Winner';
function ResScreen({ selectedOption }) {
    const [dimension, setDimension] = useState({ width: window.innerWidth, height: window.innerHeight })
    const { isOpenScoreboard, isOpenWinner } = useContext(GamePlayContext)
    const [numOfPieces, setNumOfPieces] = useState(200)
    const detectSize = () => {
        setDimension({ width: window.innerWidth, height: window.innerHeight })
    }
    useEffect(() => {
        setTimeout(() => {
            setNumOfPieces(0)

        }, 3000)
    }, [])

    useEffect(() => {
        window.addEventListener('resize', detectSize);
        return () => {
            window.removeEventListener('resize', detectSize)
        }
    }, [dimension])
    return (
        <>
            {!isOpenWinner && <>
                {selectedOption?.isCorrect && <div className='absolute top-0 left-0 bottom-0 right-0  flex items-center justify-center'
                    style={{ background: 'var(--approve)' }}
                >
                     {
                        isOpenScoreboard && <ScoreBoard />
                    }
                    <ReactConfetti
                        width={dimension.width}
                        height={dimension.height}

                        numberOfPieces={numOfPieces}
                    />
                    <SquishyCard heading="Congrats!"
                        text="Success"
                        sub="Your works paid off. Keep going"
                        color="--approve"
                        url="/success.png"
                        subColor="#eefbf2"
                    />
                </div>
                }

                {!selectedOption?.isCorrect && <div className='absolute top-0 left-0 bottom-0 right-0
                flex items-center justify-center'
                    style={{ background: 'var(--reject)' }}
                >
                    <SquishyCard heading="Oops!"
                        text="Failed"
                        sub="It's okay to make mistakes. Keep trying"
                        color="--reject"
                        url="/failure.png"
                        subColor="#fbeef0"
                    />
                    {
                        isOpenScoreboard && <ScoreBoard />
                    }

                </div>}
            </>}
            {isOpenWinner && <Winner/>}

        </>

    )
}
const SquishyCard = ({ heading, text, sub, color, url, subColor }) => {
    return (
        //   <section className="bg-neutral-900 px-4 py-12">
        <div className="mx-auto w-fit pointer-events-auto">
            <Card heading={heading} text={text} sub={sub} color={color} url={url} subColor={subColor} />
        </div>
        //   </section>
    );
};

const Card = ({ heading, text, sub, color, url, subColor }) => {
    return (
        <motion.div
            whileHover="hover"
            transition={{
                duration: 1,
                ease: "backInOut",
            }}
            variants={{
                hover: {
                    scale: 1.05,
                },
            }}
            style={{ backgroundColor: `var(--card-bg)` }}
            className="relative rounded-xl flex flex-col items-center  "
        >
            <div className="relative z-10 w-80 text-[--text-black] flex flex-col items-center">
                {/* <span className="mb-3 block w-fit rounded-full bg-white/30 px-3 py-0.5 text-sm font-light text-white">
            Pro
          </span> */}
                <motion.span
                    initial={{ scale: 0.85 }}
                    variants={{
                        hover: {
                            scale: 1,
                        },
                    }}
                    transition={{
                        duration: 1,
                        ease: "backInOut",
                    }}
                    className="my-2 block  font-mono text-6xl font-black leading-[1.2]"
                >
                    {heading}
                    <br />
                    <img src={url} />
                    {/* <span className='text-xl'>{text}</span> */}
                </motion.span>
                <div className='relative text-center w-full rounded-b-xl p-7 font-bold'
                    style={{ background: `${subColor}` }}
                >
                    <button className='absolute -top-8 w-[50%] rounded-xl left-[25%] font-bold pointer-events-none'
                        style={{ background: `#fefefe`, color: `var(${color})` }}
                    >{text}</button>
                    {sub}

                </div>
            </div>
            {/* <button className="absolute bottom-4 left-4 right-4 z-20 rounded border-2 border-white bg-white py-2 text-center font-mono font-black uppercase text-neutral-800 backdrop-blur transition-colors hover:bg-white/30 hover:text-white">
          Get it now
        </button> */}
            {/* <Background /> */}
        </motion.div>
    );
};

const Background = () => {
    return (
        <motion.svg
            width="320"
            height="384"
            viewBox="0 0 320 384"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute inset-0 z-0"
            variants={{
                hover: {
                    scale: 1.5,
                },
            }}
            transition={{
                duration: 1,
                ease: "backInOut",
            }}
        >
            <motion.circle
                variants={{
                    hover: {
                        scaleY: 0.5,
                        y: -25,
                    },
                }}
                transition={{
                    duration: 1,
                    ease: "backInOut",
                    delay: 0.2,
                }}
                cx="160.5"
                cy="114.5"
                r="101.5"
                fill="#262626"
            />
            <motion.ellipse
                variants={{
                    hover: {
                        scaleY: 2.25,
                        y: -25,
                    },
                }}
                transition={{
                    duration: 1,
                    ease: "backInOut",
                    delay: 0.2,
                }}
                cx="160.5"
                cy="265.5"
                rx="101.5"
                ry="43.5"
                fill="#262626"
            />
        </motion.svg>
    );
};
export default ResScreen