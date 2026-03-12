import {createBrowserRouter} from 'react-router-dom'
import Login from './Features/Auth/pages/Login'
import Register from './Features/Auth/pages/Register'


export const router = createBrowserRouter([
    {
        path: "/",
        element: <h1>Home</h1>
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    }
])

