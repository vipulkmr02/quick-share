import "../node_modules/bootstrap/dist/css/bootstrap.min.css"
import "../node_modules/bootstrap/dist/js/bootstrap.min.js"
import { Outlet } from 'react-router-dom'
import { Navbar } from "./components.js"
import { createContext } from "react"

export interface ContextType {
  email: string | null
  password: string | null
  username: string | null
  token: string | null
}

const AppContext = createContext<ContextType>({
  email: null,
  password: null,
  username: null,
  token: null
})

const App = () => {
  return <>
    <AppContext.Provider value={{
      email: null,
      password: null,
      username: null,
      token: null
    }}>
      <Navbar />
      <Outlet></Outlet>
    </AppContext.Provider>
  </>
}

export default App;
export { AppContext }
