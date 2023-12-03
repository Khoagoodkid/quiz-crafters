import React, { useState, useEffect } from 'react'

import axios from 'axios'
import { dbUrl } from '../../tools'
import dummy from '../../assets/dummy.jpg'
import { FiCloudLightning } from "react-icons/fi";
import { motion } from "framer-motion";
function MemberCard({ socketId }) {
    const [user, setUser] = useState(null)
    useEffect(() => {

        getUser()
    }, [socketId])
    const getUser = async () => {

        const res = await axios.get(dbUrl +'users/' + socketId)
        console.log(res.data)   
        setUser(res.data)
    }
    return (
        <div className="pointer-events-auto px-4 ">

            <div className="flex items-center pointer-events-auto group relative mx-auto w-full w-auto overflow-hidden rounded-lg bg-slate-800 p-0.5 transition-all duration-500 hover:scale-[1.01] hover:bg-slate-800/50">
                <div className="relative z-10 flex flex-row gap-5 pb-0 items-center justify-center overflow-hidden rounded-[7px] bg-slate-900 px-8 pt-3 pb-3 transition-colors duration-500 group-hover:bg-slate-800">
                    <img src={dummy} className="relative w-28 z-10  mt-2 rounded-full border-2 border-indigo-500 bg-slate-900 p-4  text-indigo-500" />

                    <h4 className="relative z-10 w-full text-2xl font-bold text-slate-50">
                        {user?.name}
                    </h4>
                  
                </div>

                <motion.div
                    initial={{ rotate: "0deg" }}
                    animate={{ rotate: "360deg" }}
                    style={{ scale: 1.75 }}
                    transition={{
                        repeat: Infinity,
                        duration: 3.5,
                        ease: "linear",
                    }}
                    className="absolute inset-0 z-0 bg-gradient-to-br from-indigo-200 via-indigo-200/0 to-indigo-200 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                />
            </div>

        </div>
    )
}

export default MemberCard