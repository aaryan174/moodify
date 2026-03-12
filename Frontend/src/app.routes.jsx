import {createBrowserRouter} from 'react-router-dom'
import Login from './Features/Auth/pages/Login'
import Register from './Features/Auth/pages/Register'
import Protected from './Features/Auth/components/Protected'


export const router = createBrowserRouter([
    {
        path: "/",
        element: <Protected> <h1>Home</h1></Protected>
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

