import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiArrowUpRight, FiStar } from "react-icons/fi";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { dbUrl } from "../../tools";
export const SignUp = () => {
    const [user, setUser] = useState({
        email: "",
        password: ""
    })
    const [rtPassword, setRtPassword] = useState("")
    const [boxCheck,setBoxCheck] = useState(false)
    const checkForDuplicate = async () => {
        let acc
        await axios.get(dbUrl + `creators/${user.email}`)
        .then(res => acc= res.data)
        return acc ? true: false
    }

    const submitHandler = async (e) => {
        e.preventDefault()
        // const duplicated = await checkForDuplicate()
        // if (!user.email || !user.password || user.password != rtPassword || !boxCheck || duplicated) {
        //     return
        // }
        await axios.post(dbUrl+"creators", user)
        .then(() => {
            setUser({
                email: "",
                password: ""
            })
            setRtPassword("")
            setBoxCheck(false)
        })
    }

    return (
        <body className="absolute top-0 bottom-0 left-0 right-0 ">
            <section className="w-full grid min-h-screen grid-cols-1 bg-[--background] text-white md:grid-cols-[1fr,_400px] lg:grid-cols-[1fr,_600px]">
                <Logo />
                <Form
                    user={user}
                    setUser={setUser}
                    submitHandler={submitHandler}
                    rtPassword={rtPassword}
                    setRtPassword={setRtPassword}
                    boxCheck ={boxCheck}
                    setBoxCheck = {setBoxCheck}
                />
                <SupplementalContent />
            </section>

        </body>
    );
};

const Form = ({ user, setUser, submitHandler, rtPassword, setRtPassword, boxCheck, setBoxCheck }) => {
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
            <div className="mx-auto my-auto max-w-lg px-4 md:pr-0">
                <motion.h1
                    variants={primaryVariants}
                    className="mb-2 text-center text-4xl font-semibold"
                >
                    Create your account
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
                            value={user.email}
                            onChange={(e) => setUser({ ...user, email: e.target.value })}
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
                            onChange={(e) => setUser({ ...user, password: e.target.value })}
                            value={user.password}
                        />
                    </motion.div>

                    <motion.div variants={primaryVariants} className="mb-4 w-full">
                        <label
                            htmlFor="rt-password-input"
                            className="mb-1 inline-block text-sm font-medium"
                        >
                            Re-type Password<span className="text-red-600">*</span>
                        </label>
                        <input
                            id="rt-password-input"
                            type="password"
                            placeholder="Re-type your password"
                            className="w-full rounded text-[--text-black]  border-[1px] border-slate-300 px-2.5 py-1.5 focus:outline-indigo-600"
                            required
                            onChange={(e) => setRtPassword(e.target.value)}
                            value={rtPassword}
                        />
                        {rtPassword.length > 0 && <span>{rtPassword == user.password ?
                            <span className="text-[--approve]">
                                The password matches!<span> <CheckCircleIcon/></span>
                            </span>
                            : <span className="text-[--reject]">
                                The password does not match! <span> <CancelIcon/></span>
                            </span>
                        }</span>}
                    </motion.div>

                    <motion.div
                        variants={primaryVariants}
                        className="mb-4 flex w-full items-start gap-1.5"
                    >
                        <input
                            type="checkbox"
                            id="terms-checkbox"
                            className="h-4 w-4 accent-indigo-600"
                            required
                            checked = {boxCheck}
                            onClick={() => setBoxCheck(!boxCheck)}
                        />
                        <label htmlFor="terms-checkbox" className="text-xs">
                            By signing up, I agree to the terms and conditions, privacy
                            policy, and cookie policy
                        </label>
                    </motion.div>

                    <motion.button
                        variants={primaryVariants}
                        whileTap={{
                            scale: 0.985,
                        }}
                        type="submit"
                        className="mb-1.5 w-full rounded bg-indigo-600 px-4 py-2 text-center font-medium text-white transition-colors hover:bg-indigo-700"
                    >
                        Sign up
                    </motion.button>
                    <motion.p variants={primaryVariants} className="text-xs">
                        Already have an account?{" "}
                        <a className="text-indigo-600 underline" href="#" onClick={() => navigate("/login")}>
                            Sign in
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