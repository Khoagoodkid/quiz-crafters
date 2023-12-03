import React, { useState } from 'react'
import Modal from 'react-modal'
import { CloseButton, VStack, HStack, RadioGroup } from '@chakra-ui/react'
import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Input,
    Radio,
    Button
} from '@chakra-ui/react'
// import "./AddQuestion.css"
import axios from 'axios'
import { dbUrl } from '../../tools'
function AddCollection({ isCollectionCreOpen, setIsCollectionCreOpen, user,getColletionsByUserId }) {
    const [collection, setCollection] = useState({
        name:'',
        userId: user._id
    })

    const submitHandler = async () => {
        await axios.post(dbUrl + "collections", collection)
        .then(() => getColletionsByUserId())
    } 
    return (
        <Modal isOpen={isCollectionCreOpen} className='aq-body'>
            <CloseButton onClick={() => setIsCollectionCreOpen(false)} className='absolute left-3 top-4 border-none'/>
            <FormControl onSubmit={submitHandler}>
                <div className='flex flex-row gap-8 items-center pt-5'>

                    <FormLabel className='font-bold text-2xl'>Collection Name</FormLabel>
                    <Input type='text'  onChange={(e) => setCollection({...collection, name:e.target.value})}
                    className='w-3/5 p-3'
                    />
                </div>

            </FormControl>

            <Button
                onClick={submitHandler}
                loadingText='Submitting'
                colorScheme='teal'
                variant='outline'
                className='bg-[--brand] font-bold border-none'
            >
                Submit
            </Button>
        </Modal>
    )
}

export default AddCollection