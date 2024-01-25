import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom"
import Home from './pages/Home/Home'
import Room from './pages/Room/Room'
import Creator from './pages/Creator/Creator'
import { io } from 'socket.io-client'
import { ServerContext, RoleContext, AuthContext, RoomContext, MembersContext, StartContext, QuestionContext,UnAnsweredContext} from './context'
import Login from './pages/Login/Login'
import PageController from './controller/PageController'
import RoomCreator from './components/RoomCreator/RoomCreator'
import { SignUp } from './pages/SignUp/SignUp'
import QuizStream from './pages/QuizStream/QuizStream'
import axios from 'axios'
import { dbUrl } from './tools'
function App() {
  // const socket = io(import.meta.env.VITE_SERVER_SOCKET , {'timeout':5000, 'connect timeout': 5000})
  const socket = io("https://quiz-crafters-server.onrender.com/" , {'timeout':5000, 'connect timeout': 5000})
  
  const [role, setRole] = useState("player")
  const [user, setUser] = useState(null)
  const [roomId, setRoomId] = useState(null)
  const [members, setMembers] = useState([])
  const [isStart, setIsStart] = useState(false)
  const [question, setQuestion] = useState(null)
  const [me, setMe] = useState(null)
  const [unAnswered, setUnAnswered] = useState(null)
  useEffect(() => {
    const userId = sessionStorage.getItem("_id")
    if(!userId) return
    axios.get(dbUrl + `creators/${userId}`)
            .then(res => {
                if (!res.data) return
                
                setUser(res.data)
                setRole("creator")
               
            })
  },[])
  return (

    <BrowserRouter className='App'>
      <AuthContext.Provider value={{ user, setUser }}>
        <RoomContext.Provider value={{ roomId, setRoomId }}>
          <MembersContext.Provider value={{ members, setMembers }}>
            <StartContext.Provider value={{ isStart, setIsStart }}>
              <QuestionContext.Provider value={{ question, setQuestion }}>
                <RoleContext.Provider value={{ role, setRole }}>
                  {/* <MeContext.Provider value={{ me, setMe }}> */}
                    <UnAnsweredContext.Provider value={{unAnswered, setUnAnswered}}>

                      <PageController />

                      <ServerContext.Provider value={socket}>
                        <Routes>
                          <Route path='/' element={<Home />} />
                          <Route path='/login' element={<Login />} />
                          <Route path='/creator' element={user ? <Creator /> : <Login />} />
                          <Route path='/creator/host' element={user ? <RoomCreator /> : <Login />} />
                          <Route path='/room/:roomId' element={<Room />} />
                          <Route path='/signup' element={<SignUp/>}/>
                          <Route path="/creator/collection/:collectionId" element={<QuizStream/>}/>
                        </Routes>

                      </ServerContext.Provider>
                    </UnAnsweredContext.Provider>
                  {/* </MeContext.Provider> */}
                </RoleContext.Provider>

              </QuestionContext.Provider>

            </StartContext.Provider>
          </MembersContext.Provider>
        </RoomContext.Provider>
      </AuthContext.Provider>
    </BrowserRouter>
  )
}

export default App
