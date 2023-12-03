import React, { useContext } from 'react'
import { GamePlayContext, } from '../../context';
import dummy from "../../assets/dummy.jpg"
import { FiCloudLightning } from "react-icons/fi";
import { motion } from "framer-motion";
import { useEffect } from 'react';
import axios from 'axios';
import { usersUrl } from '../../tools';
import { RoomIdContext } from '../GamePlay/GamePlay';
import Trophy from '../Trophy/Trophy';
import { useState } from 'react';
import ReactConfetti from 'react-confetti';
function Winner() {
    const roomId = useContext(RoomIdContext)
    const [dimension, setDimension] = useState({ width: window.innerWidth, height: window.innerHeight })
    const { users, setUsers } = useContext(GamePlayContext)
    const [winner,setWinner] = useState(null)
    const detectSize = () => {
        setDimension({ width: window.innerWidth, height: window.innerHeight })
    }
    useEffect(() => {
        window.addEventListener('resize', detectSize);
        return () => {
            window.removeEventListener('resize', detectSize)
        }
    }, [dimension])
    useEffect(() => {
        fetchScores()
    }, [])
    const fetchScores = async () => {
        const res = await axios.get(usersUrl)
        console.log(res.data)
        console.log(roomId)
        const filter = res.data.filter(user => {
            return user.roomId == roomId
        })
        filter.sort((a, b) => {
            return b.points - a.points
        })
        setWinner(filter[0])


    }
    return (
        <div className='flex flex-col bg-red-50 overflow-y-hidden'>
            {/* {JSON.stringify(users)}
            {users?.map((u) => {
                return (
                    <MemberCard user={u} />
                )
            })} */}
           <ReactConfetti
                        width={dimension.width}
                        height={dimension.height}

                        // numberOfPieces={numOfPieces}
                    />
            <Trophy winner={winner}/>
            {/* <span className='absolute text-white'>{JSON.stringify(winner)}</span> */}
        </div>
    )
}




export default Winner