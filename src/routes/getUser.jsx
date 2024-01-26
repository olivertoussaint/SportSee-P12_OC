import { useState } from 'react'
import { useEffect } from 'react'



function GetUser() {
  const [userData, setUserData] = useState({})
  const [isDataLoading, setDataLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchUser() {
      setDataLoading(true)
      try {
        const response = await fetch(`http://localhost:3000/user`)
        const { userData } = await response.json()
        setUserData(userData)
      } catch (error) {
        console.log(error)
        setError(true)
      } finally {
        setDataLoading(false)
      }
    }
    fetchUser()
  }, [])
}

export default GetUser
