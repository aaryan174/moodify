import { createBrowserRouter } from 'react-router-dom'
import Login from './Features/Auth/pages/Login'
import Register from './Features/Auth/pages/Register'
import Protected from './Features/Auth/components/Protected'
import Home from './Features/home/pages/Home'
import UploadSong from './Features/songs/UploadSong'


export const router = createBrowserRouter([
    {
        path: "/",
        element: <Protected><Home /></Protected>
    },
    {
        path: "/upload",
        element: <Protected><UploadSong /></Protected>
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
