import React, { useState, useEffect } from 'react'
import Modal from 'react-modal'
import { CloseButton, VStack, HStack, RadioGroup } from '@chakra-ui/react'
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Radio,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,

} from '@chakra-ui/react'
import { ChevronDownIcon } from '@chakra-ui/icons'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./AddQuestion.css"
import axios from 'axios'
import { dbUrl } from '../../tools'
function AddQuestion({ isModalOpen, setIsModalOpen, user, getQuestionsByCollectionId }) {
  const [collections, setCollections] = useState(null)
  const [selectedCollection ,setSelectedCollection] = useState(null)
  useEffect(() => {
    getColletions()
  }, [])
  const [choice1, setChoice1] = useState({

    index: 0,
    text: '',
    isCorrect: false,

  })
  const [choice2, setChoice2] = useState({

    index: 1,
    text: '',
    isCorrect: false,

  })
  const [choice3, setChoice3] = useState({

    index: 2,
    text: '',
    isCorrect: false,

  })
  const [choice4, setChoice4] = useState({

    index: 3,
    text: '',
    isCorrect: false,

  })
  const [question, setQuestion] = useState({
    userId: user._id,
    query: '',
    collection: '',
    choices: [

    ]
  })
  const getColletions = async () => {
    await axios.get(dbUrl + `collections/${user._id}`)
      .then(res => {

        setCollections(res.data)
      })
      .catch(err => console.log(err))
  }
  const submitHandler = async () => {
    setQuestion({ ...question, choices: [choice1, choice2, choice3, choice4] })
    let numberOfCorrect = 0;
    [choice1, choice2, choice3, choice4].map((choice) => {
        if(choice.isCorrect) numberOfCorrect ++;
    })
    if(numberOfCorrect > 1) {
      toast.error("Please set only 1 correct answer")
      return 
    }
    if(numberOfCorrect == 0) {
      toast.error("Please set 1 correct answer!")
      return
    }
    if(!selectedCollection) {
      toast.error('Please select collection')
      return
    }

    await axios.post(dbUrl + 'questions', { 

      query: question.query,
      choices: [choice1, choice2, choice3, choice4],
      collectionId:selectedCollection._id

    })
    .then(() => {
        setQuestion({...question, query:''})
        setChoice1({...choice1, text:'', isCorrect:false})
        setChoice2({...choice2, text:'', isCorrect:false})
        setChoice3({...choice3, text:'', isCorrect:false})
        setChoice4({...choice4, text:'', isCorrect:false})
        getQuestionsByCollectionId(selectedCollection._id)
        setSelectedCollection(null)
       
    })
    .catch(err => console.log(err))
  }
  return (
    <Modal isOpen={isModalOpen} className='aq-body'>
      <ToastContainer/>
      <CloseButton onClick={() => setIsModalOpen(false)} sx={{position:'absolute', right:10,top:5, backgroundColor:'transparent'}} />
      <Menu>
        <MenuButton sx={{fontWeight:'bold'}} as={Button} rightIcon={<ChevronDownIcon />}>
            {selectedCollection?.name || 'Collections'}
        </MenuButton>
        <MenuList>
          
        
          {
            collections?.map((col) => {
              return (
                <MenuItem value={col.name} sx={{fontWeight:'bold'}} onClick={() => setSelectedCollection(col)}>{col.name}</MenuItem >
              )
            })
          }
        </MenuList>
      </Menu>
      <FormControl onSubmit={submitHandler}>
        <HStack>

          <FormLabel sx={{fontWeight:'bold'}}>Question</FormLabel>
          <Input type='text' value ={question.query} onChange={(e) => setQuestion({ ...question, query: e.target.value })} className='input ques'/>
        </HStack>

      </FormControl>
      <FormControl >
        <FormLabel sx={{fontWeight:'bold'}}>Choice 1</FormLabel>
        <HStack spacing='5px'>
          <Input type='text' onChange={(e) => setChoice1({
            ...choice1,
            text: e.target.value
          })} 
          value = {choice1.text}
          className='input choice'
          />
          <button onClick={() => setChoice1({
            ...choice1,
            isCorrect: !choice1.isCorrect
          })} 
            className= {choice1.isCorrect ? 'cor-btn true':'cor-btn false'}
          >{choice1.isCorrect ? 'True' : 'False'}</button>

        </HStack>
      </FormControl>
      <FormControl>
        <FormLabel sx={{fontWeight:'bold'}}>Choice 2</FormLabel>
        <HStack spacing='5px'>
          <Input type='text' onChange={(e) => setChoice2({
            ...choice2,
            text: e.target.value
          })} 
          value = {choice2.text}
          className='input choice'
          />
          <button onClick={() => setChoice2({
            ...choice2,
            isCorrect: !choice2.isCorrect
          })} 
          className= {choice2.isCorrect ? 'cor-btn true':'cor-btn false'}
          >{choice2.isCorrect ? 'True' : 'False'}</button>

        </HStack>
      </FormControl>
      <FormControl>
        <FormLabel sx={{fontWeight:'bold'}}>Choice 3</FormLabel>
        <HStack spacing='5px'>
          <Input type='text' onChange={(e) => setChoice3({
            ...choice3,
            text: e.target.value
          })} 
          value = {choice3.text}
          className='input choice'
          />
          <button onClick={() => setChoice3({
            ...choice3,
            isCorrect: !choice3.isCorrect
          })} 
          className= {choice3.isCorrect ? 'cor-btn true':'cor-btn false'}
          >{choice3.isCorrect ? 'True' : 'False'}</button>

        </HStack>

      </FormControl>
      <FormControl>
        <FormLabel sx={{fontWeight:'bold'}}>Choice 4</FormLabel>
        <HStack spacing='5px'>
          <Input type='text' onChange={(e) => setChoice4({
            ...choice4,
            text: e.target.value
          })} 
          value = {choice4.text}
          className='input choice'
          />

          <button onClick={() => setChoice4({
            ...choice4,
            isCorrect: !choice4.isCorrect
          })} 
          className= {choice4.isCorrect ? 'cor-btn true':'cor-btn false'}
          >{choice4.isCorrect ? 'True' : 'False'}</button>

        </HStack>

      </FormControl>
      <Button
        onClick={submitHandler}
        loadingText='Submitting'
        colorScheme='teal'
        variant='outline'
        sx={{fontWeight:'bold'}}
        className='add-btn'
      >
        Submit
      </Button>
    </Modal>
  )
}

export default AddQuestion