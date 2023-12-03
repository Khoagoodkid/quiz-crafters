import React, { useContext, useEffect } from 'react'
import { RoleContext } from '../context'
import { useNavigate } from 'react-router-dom'
function PageController() {
    const navigate = useNavigate()
    const {role,setRole} = useContext(RoleContext)
    useEffect(() => {
        switch (role) {
          case "player": {
            navigate("/")
            return
          }
          case "creator": {
            navigate("/creator")
            return
          }
        }
      }, [role])
  return (
    
    <>
    </>
  )
}

export default PageController