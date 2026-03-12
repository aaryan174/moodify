import {RouterProvider} from "react-router-dom"
import {router} from "./app.routes"
import { AuthProvider } from "./Features/Auth/Auth.context"

const App = () => {
  return (
    <AuthProvider>
          <RouterProvider router={router} />
    </AuthProvider>
  )
}

export default App
