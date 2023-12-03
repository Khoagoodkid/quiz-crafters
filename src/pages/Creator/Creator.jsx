import React, { createContext, useContext, useEffect, useState } from 'react'
import Modal from 'react-modal';
import AddQuestion from '../../components/AddQuestion/AddQuestion';
import { AuthContext, RoomContext, ServerContext } from '../../context';
import LeftBar from '../../components/LeftBar/LeftBar';
import "./Creator.css"
import axios from 'axios';
import { dbUrl } from '../../tools';

import { Accordion } from '@chakra-ui/react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import AddCollection from '../../components/AddCollection/AddCollection';
import QuestionCard from '../../components/QuestionCard/QuestionCard';
import { useNavigate } from 'react-router-dom';

function Creator() {
    const navigate = useNavigate()
    const { user, setUser } = useContext(AuthContext)
    const socket = useContext(ServerContext)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCollectionCreOpen, setIsCollectionCreOpen] = useState(false)
    const [questions, setQuestions] = useState(null);
    const [collections, setCollections] = useState(null);
    const {roomId,setRoomId} = useContext(RoomContext)
    const [selectedCollection ,setSelectedCollection] = useState(null)
    useEffect(() => {


        getColletionsByUserId()

    }, [])


    const getColletionsByUserId = async () => {
        await axios.get(dbUrl + `collections/${user._id}`)
            .then(res => {
                console.log(res.data)
                setCollections(res.data)
            })
            .catch(err => console.log(err))
    }
    const getQuestionsByCollectionId = async (id) => {
        await axios.get(dbUrl + `questions/${id}`)
            .then(res => {
                setQuestions(res.data)
            })

    }
    const startQuiz = () => {
        if(!questions) return;
        
     
    
        navigate(`/creator/collection/${selectedCollection._id}`, {state :{
            questions: questions,
            roomId: roomId,

        }})
    }
    return (

        <div className='creator-body' >
            <AddQuestion
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                user={user}
                getQuestionsByCollectionId={getQuestionsByCollectionId}
            />
            <AddCollection
                isCollectionCreOpen={isCollectionCreOpen}
                setIsCollectionCreOpen={setIsCollectionCreOpen}
                user={user}
                getColletionsByUserId={getColletionsByUserId}
            />
            
                <LeftBar
                  
                />
           
            <div className="w-full bg-[var(--background)] flex flex-col text-white h-auto overflow-y-scroll">
                <div className='bg-[--background-dark] flex flex-row justify-between items-center p-3 px-8'>


                    <div className='flex flex-row justify-between gap-5 w-80'>
                        <FormControl fullWidth sx={{border:'.1em solid white', borderRadius:'.5em', padding:'.1em'}} >
                            <InputLabel variant="standard" htmlFor="uncontrolled-native" sx={{ paddingLeft: '.2em', color:'white', textField: {border:'1px solid red'} }}
                            className='border-blue-500'
                            >
                                Collections
                            </InputLabel>
                            <Select
                                label="Collection"
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                sx={{color:'white'}}
                            >
                                {collections?.map((col) => {
                                    return (
                                        <MenuItem value={col.name} onClick={() => {
                                            getQuestionsByCollectionId(col._id)
                                            setSelectedCollection(col)
                                        }}>{col.name}</MenuItem >
                                    )
                                })}

                            </Select>
                        </FormControl>
                        <button onClick={() => setIsCollectionCreOpen(true)} className='text-slate-900 bg-[--brand]'> Create Collection</button>
                    </div>
                    <button onClick={() => setIsModalOpen(true)} className='text-slate-900 bg-[--brand]'>
                        Add question
                    </button>
                   
                    <button onClick={() => startQuiz()} className='bg-[--brand] text-slate-900'>
                        Start Quiz
                    </button>
                    {/* <button onClick={() => createRoom()}>
                        Create room
                        </button>
                        <button onClick={() => startQuiz()}>
                        Start Quiz
                    </button> */}


                </div>
                <Accordion defaultIndex={[0]} allowMultiple className='flex flex-col items-center pt-20 gap-20'>
                    {questions?.map((ques) => {
                        return (
                            <QuestionCard ques={ques} getQuestionsByCollectionId={getQuestionsByCollectionId} user={user} />
                        )
                    })}
                </Accordion>
            </div>


        </div>

    )
}

export default Creator 