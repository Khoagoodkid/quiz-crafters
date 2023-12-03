import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import { usersUrl } from '../../tools'
import { CountdownItem, RoomIdContext } from '../GamePlay/GamePlay'
import "./ScoreBoard.css"

import dummy from '../../assets/dummy.jpg'
import { FiAward, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { GamePlayContext } from '../../context'
import { AnimatePresence, motion } from "framer-motion";
import { FiAlertCircle } from "react-icons/fi";

import { Stack } from "@mui/material";
function ScoreBoard() {
    const roomId = useContext(RoomIdContext)
    const { users, setUsers, isOpenScoreboard,me } = useContext(GamePlayContext)
    const [userStatus, setUserStatus] = useState(null)
    useEffect(() => {
        // fetchScores()

        setTimeout(() => {
            fetchScores()
        }, 2000)
    }, [])
    const fetchScores = async () => {
        const res = await axios.get(usersUrl)
        console.log(res.data)
        const filter = res.data.filter(user => {
            return user.roomId == roomId
        })
        filter.sort((a, b) => {
            return b.points - a.points
        })
        setUsers(filter)
        const curUser = filter.find(u => u.socketId == me)
        setUserStatus({...curUser, rank: filter.indexOf(curUser)+1})
    }


    return (
        <AnimatePresence>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}

                className="bg-slate-900/20 backdrop-blur w-full p-8 fixed inset-0 z-50 grid place-items-center overflow-y-scroll cursor-pointer"
            >
                <motion.div
                    initial={{ scale: 0, rotate: "12.5deg" }}
                    animate={{ scale: 1, rotate: "0deg" }}
                    exit={{ scale: 0, rotate: "0deg" }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-gradient-to-br from-violet-600 to-indigo-600 text-black p-6 rounded-lg w-[200em] max-w-lg shadow-xl cursor-default relative overflow-hidden"
                >
                    <FiAlertCircle className="text-white/10 rotate-12 text-[250px] absolute z-0 -top-24 -left-24" />
                    <div className="relative z-10 ">
                        <span className='text-white font-bold text-2xl'>Your current rank is {userStatus?.rank}
                            {userStatus?.rank % 10 == 1 &&"st" }
                            {userStatus?.rank % 10 == 2 && "nd"}
                            {userStatus?.rank % 10 == 3 && "rd"}
                            {userStatus?.rank % 10 > 3 && "th"}
                        </span>
                        <div className="pointer-events-auto w-full bg-transparent shadow-lg rounded-lg  max-w-4xl mx-auto  ">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b-[1px] border-slate-200 text-white text-sm uppercase font-bold">

                                        <th className="text-start p-4">Players</th>
                                        <th className="text-start p-4 ">Rank</th>
                                        <th className="text-start p-4 ">Score</th>
                                        {/* <th className="text-start p-4 font-medium">Status</th> */}
                                    </tr>
                                </thead>

                                <tbody>
                                    {users?.slice(0, 5).map((user, index) => {
                                        return (
                                            <TableRows
                                                key={user._id}
                                                user={user}
                                                index={index}
                                                userStatus = {userStatus}
                                                users={users}
                                            />
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </motion.div>
            </motion.div>

        </AnimatePresence>

    )
}

export default ScoreBoard


const TableRows = ({ user, index, users, userStatus }) => {
    const rankOrdinal = numberToOrdinal(index + 1);
    const maxRankOrdinal = numberToOrdinal(user.maxRank);

    return (
        <motion.tr
            layoutId={`row-${user._id}`}
            className={`text-sm bg-trasnparent text-white ${user._id == userStatus?._id ? "bg-indigo-800": ""}`}
        >


            <td className="p-4 flex items-center gap-3 overflow-hidden">
                <img
                    src={dummy}
                    alt="Example user photo"
                    className="w-10 h-10 rounded-full bg-slate-300 object-cover object-top shrink-0"
                />
                <div>
                    <span className="block mb-1 font-medium">{user.name}</span>
                    {/* <span className="block text-xs text-slate-500">{user.contact}</span> */}
                </div>
            </td>

            <td className="p-4">
                <div
                    className={`flex items-center gap-2  ${rankOrdinal === "1st" && "text-white-500 font-bold "
                        }`}
                >
                    <span>{rankOrdinal}</span>
                    {rankOrdinal === "1st" && <FiAward className="text-xl text-[yellow]" />}{" "}
                </div>
            </td>

            {/* <td className="p-4 font-medium">{maxRankOrdinal}</td> */}

            <td className="p-4 flex items-center">

                <CountdownItem num={user.points} text="" />

            </td>
        </motion.tr>
    );
};



const numberToOrdinal = (n) => {
    let ord = "th";

    if (n % 10 == 1 && n % 100 != 11) {
        ord = "st";
    } else if (n % 10 == 2 && n % 100 != 12) {
        ord = "nd";
    } else if (n % 10 == 3 && n % 100 != 13) {
        ord = "rd";
    }

    return n + ord;
};
