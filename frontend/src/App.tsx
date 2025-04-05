import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.min.js"
import "bootstrap-icons/font/bootstrap-icons.min.css"
import { Outlet } from 'react-router-dom'
import { Navbar } from "./components.js"
import { ToastContainer } from "react-toastify"
import { createContext } from "react"

export interface ContextType {
  email: string | null
  username: string | null
  fullname: string | null
  token: string | null
  fileCount: number | null
  dirCount: number | null
}

const AppContext = createContext<ContextType>({
  email: null,
  username: null,
  fullname: null,
  token: localStorage.getItem('token'),
  fileCount: null,
  dirCount:  null
})

const App = () => {
  return <>
    <ToastContainer />
    <Navbar />
    <Outlet></Outlet>
  </>
}

export default App;
export { AppContext }
