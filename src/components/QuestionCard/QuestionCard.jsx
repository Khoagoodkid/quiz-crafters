import React from 'react'
import "./QuestionCard.css"
import {

    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Button,
    Box,
   
} from '@chakra-ui/react'
import { DeleteIcon,EditIcon } from '@chakra-ui/icons'
import axios from 'axios'
import { dbUrl } from '../../tools'
import { useContext } from 'react'
import { RoomContext, ServerContext } from '../../context'
import EditQuestion from '../EditQuestion/EditQuestion'
import { useState } from 'react'
function QuestionCard({ ques,getQuestionsByCollectionId, user }) {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const socket = useContext(ServerContext)
    const {roomId} = useContext(RoomContext)
    const deleteQuestion = async() => {
        const colId = ques.collectionId
        await axios.delete(dbUrl+`questions/${ques._id}`)
        .then(res => {
            console.log(colId)
            getQuestionsByCollectionId(colId)
        })
    }
    const editQuestion = async() => {
        setIsModalOpen(true)
    }
  
 
    const sendQuestion = (question) => {
        // if (roomId) {
        console.log(question)
        socket.emit("sendQuestion", { ...question, roomId:roomId })
        // }
    }
    return (

        <AccordionItem className='w-4/5 bg-[#232323] text-white text-2xl'>
            <EditQuestion  isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                user={user}
                getQuestionsByCollectionId={getQuestionsByCollectionId}
                ques={ques}
                />
                
            <h2>
                <AccordionButton className='flex flex-row border-[--brand] border-2 font-bold gap-3'>
                    <Box as="span" flex='1' textAlign='left'>
                        {ques.query}
                    </Box>
                    <EditIcon onClick={() => editQuestion()} />
                    <DeleteIcon onClick={() => deleteQuestion()}/>
                    <AccordionIcon />
                </AccordionButton>
         
            </h2>
            {/* <button onClick={() => sendQuestion(ques)}>Send</button> */}
            {ques.choices.map((choice) => {
                return (
                    <AccordionPanel pb={4} className='w-full text-left  p-2' sx={{color:choice.isCorrect ? 'var(--approve)' : 'var(--reject)'}}>
                        {choice.text}
                    </AccordionPanel>
                )
            })}

        </AccordionItem>



    )
}

export default QuestionCard