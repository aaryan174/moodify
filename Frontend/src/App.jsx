import {RouterProvider} from "react-router-dom"
import {router} from "./app.routes"
import { AuthProvider } from "./Features/Auth/Auth.context"
import { SongContextProvider } from "./Features/home/Song.context"

const App = () => {
  return (
    <AuthProvider>
      <SongContextProvider>
                  <RouterProvider router={router} />
        </SongContextProvider>  
    </AuthProvider>
  )
}

export default App
