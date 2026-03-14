import { useContext, useEffect } from "react";
import { register, login, getMe, logout } from "../services/auth.api";
import { AuthContext } from "../Auth.context";


export const useAuth = () => {
   const context = useContext(AuthContext);

   const { user, setUser, loading, setLoading } = context

   async function handleRegister({ username, email, password }) {
      setLoading(true)
      const data = await register({ username, email, password })
      setUser(data.user)
      setLoading(false)
   }

   async function handleLogin({ username, email, password }) {
      setLoading(true)
      const data = await login({ username, email, password })
      setUser(data.user)
      setLoading(false)
   }

   async function handleGetme() {
      setLoading(true)
      try {
         const data = await getMe()
         setUser(data.user)
      } catch (error) {
         console.log("Not logged in or token missing.")
         setUser(null)
      } finally {
         setLoading(false)
      }
   }

   async function handleLogout() {
      setLoading(true)
      const data = await logout()
      setUser(null)
      setLoading(false)
   }

   useEffect(() => {
      handleGetme()
   }, [])

   return ({
      user, setUser, loading, setLoading, handleRegister, handleLogin, handleGetme, handleLogout
   })
}