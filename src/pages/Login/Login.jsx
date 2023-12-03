import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import { FiArrowUpRight, FiStar } from "react-icons/fi";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { dbUrl } from "../../tools";
import {AuthContext, RoleContext} from "../../context"
const Login = () => {
    const navigate = useNavigate()
    const { role, setRole } = useContext(RoleContext)
    const {user,setUser} = useContext(AuthContext)
    const [account, setAccount] = useState({
        email: '',
        password: ''
    })
    const submitHandler = (e) => {
        e.preventDefault()
        if (!account.email || !account.password) return
        // axios.post(dbUrl + 'creators', account)
        // .then(() => {
        //    
        //     setRole("creator")
        // })
        axios.get(dbUrl + `creators/${account.email}/${account.password}`)
            .then(res => {
                if (!res.data) return
                setAccount({
                    email: '',
                    password: ''
                })
                setUser(res.data)
                setRole("creator")
                sessionStorage.setItem("_id", res.data._id)
            })
    }
   

  
 

   

    return (
        <body className="absolute top-0 bottom-0 left-0 right-0 ">
            <section className="w-full grid min-h-screen grid-cols-1 bg-[--background] text-white md:grid-cols-[1fr,_400px] lg:grid-cols-[1fr,_600px]">
                <Logo />
                <Form
                    account={account}
                    setAccount={setAccount}
                    submitHandler={submitHandler}
               
            
                />
                <SupplementalContent />
            </section>

        </body>
    );
};

const Form = ({ account, setAccount, submitHandler }) => {
    const navigate = useNavigate()
    return (
        <motion.div
            initial="initial"
            whileInView="animate"
            transition={{
                staggerChildren: 0.05,
            }}
            viewport={{ once: true }}
            className="flex items-center justify-center pb-4 pt-20 md:py-20"
        >
            <div className="mx-auto my-auto max-w-xl px-4 md:pr-0">
                <motion.h1
                    variants={primaryVariants}
                    className="mb-2 text-center text-4xl font-semibold"
                >
                    Join the world of quiz
                </motion.h1>
                <motion.p variants={primaryVariants} className="mb-8 text-center">
                    Dive into the realm of creativity – join now and design your own quiz, sparking curiosity and learning!
                </motion.p>

                <form onSubmit={submitHandler} className="w-full">
                    <motion.div variants={primaryVariants} className="mb-2 w-full">
                        <label
                            htmlFor="email-input"
                            className="mb-1 inline-block text-sm font-medium"
                        >
                            Email<span className="text-red-600">*</span>
                        </label>
                        <input
                            id="email-input"
                            type="email"
                            placeholder="Enter your email"
                            className="w-full rounded border-[1px] text-[--text-black] border-slate-300 px-2.5 py-1.5 focus:outline-indigo-600"
                            required
                            value={account.email}
                            onChange={(e) => setAccount({ ...account, email: e.target.value })}
                        />
                    </motion.div>

                    <motion.div variants={primaryVariants} className="mb-2 w-full">
                        <label
                            htmlFor="password-input"
                            className="mb-1 inline-block text-sm font-medium "
                        >
                            Password<span className="text-red-600">*</span>
                        </label>
                        <input
                            id="password-input"
                            type="password"
                            placeholder="Enter your password"
                            className="w-full rounded text-[--text-black]  border-[1px] border-slate-300 px-2.5 py-1.5 focus:outline-indigo-600"
                            required
                            onChange={(e) => setAccount({ ...account, password: e.target.value })}
                            value={account.password}
                        />
                    </motion.div>

                   


                    <motion.button
                        variants={primaryVariants}
                        whileTap={{
                            scale: 0.985,
                        }}
                        type="submit"
                        className="mt-5 mb-1.5 w-full rounded bg-indigo-600 px-4  text-center font-medium text-white transition-colors hover:bg-indigo-700"
                    >
                        Sign In
                    </motion.button>
                    <motion.p variants={primaryVariants} className="text-xs">
                        Dont't have an account?{" "}
                        <a className="text-indigo-600 underline" href="#" onClick={() => navigate("/signup")}>
                            Sign Up
                        </a>
                    </motion.p>
                </form>
            </div>
        </motion.div>
    );
};

const SupplementalContent = () => {
    return (
        <div className="group sticky top-4 m-4 h-80 overflow-hidden rounded-3xl rounded-tl-[4rem] bg-slate-950 md:h-[calc(100vh_-_2rem)]">
            <img
                alt="An example image"
                src="/signup.jpg"
                className="h-full w-full bg-white object-cover transition-all duration-500 group-hover:scale-105 group-hover:opacity-50"
            />

            <div className="absolute right-2 top-4 z-10">
                <FiArrowUpRight className="rotate-45 text-6xl text-indigo-200 opacity-0 transition-all duration-500 group-hover:rotate-0 group-hover:opacity-100" />
            </div>

            <motion.div
                initial="initial"
                whileInView="animate"
                transition={{
                    staggerChildren: 0.05,
                }}
                viewport={{ once: true }}
                className="absolute inset-0 flex flex-col items-start justify-end bg-gradient-to-t from-slate-950/90 to-slate-950/0 p-8"
            >
                <motion.h2
                    className="mb-2 text-3xl font-semibold leading-[1.25] text-white lg:text-4xl"
                    variants={primaryVariants}
                >
                    Connecting Designers
                    <br />
                    with Opportunities
                </motion.h2>
                <motion.p
                    variants={primaryVariants}
                    className="mb-6 max-w-md text-sm text-slate-300"
                >
                    Bloop is the home of makers, making amazing things, and getting paid.
                    Find your dream job with us.
                </motion.p>
                <div className="flex items-center gap-4">
                    <div className="flex items-center">
                        <motion.img
                            variants={avatarVariants}
                            className="h-8 w-8 rounded-full border-[1px] border-slate-100 object-cover shadow-inner"
                            alt="A placeholder testimonial image"
                            src="/imgs/head-shots/1.jpg"
                        />
                        <motion.img
                            variants={avatarVariants}
                            className="-ml-4 h-8 w-8 rounded-full border-[1px] border-slate-100 object-cover shadow-inner"
                            alt="A placeholder testimonial image"
                            src="/imgs/head-shots/2.jpg"
                        />
                        <motion.img
                            variants={avatarVariants}
                            className="-ml-4 h-8 w-8 rounded-full border-[1px] border-slate-100 object-cover shadow-inner"
                            alt="A placeholder testimonial image"
                            src="/imgs/head-shots/3.jpg"
                        />
                        <motion.img
                            variants={avatarVariants}
                            className="-ml-4 h-8 w-8 rounded-full border-[1px] border-slate-100 object-cover shadow-inner"
                            alt="A placeholder testimonial image"
                            src="/imgs/head-shots/4.jpg"
                        />
                        <motion.img
                            variants={avatarVariants}
                            className="-ml-4 h-8 w-8 rounded-full border-[1px] border-slate-100 object-cover shadow-inner"
                            alt="A placeholder testimonial image"
                            src="/imgs/head-shots/6.jpg"
                        />
                    </div>
                    <div>
                        <motion.div variants={primaryVariants} className="flex gap-0.5">
                            <FiStar className="fill-yellow-300 text-sm text-yellow-300" />
                            <FiStar className="fill-yellow-300 text-sm text-yellow-300" />
                            <FiStar className="fill-yellow-300 text-sm text-yellow-300" />
                            <FiStar className="fill-yellow-300 text-sm text-yellow-300" />
                            <FiStar className="fill-yellow-300 text-sm text-yellow-300" />
                            <span className="ml-2 text-sm text-white">5.0</span>
                        </motion.div>
                        <motion.p
                            variants={primaryVariants}
                            className="text-xs text-slate-300"
                        >
                            from over 100,000 reviews
                        </motion.p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

const Logo = () => {
    // Temp logo from https://logoipsum.com/
    return (
        <img
            src="logo.png"
            className="absolute w-40"

        />
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
export default Login