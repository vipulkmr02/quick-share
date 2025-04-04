import { useContext, useState } from "react";
import { AppContext } from "./App";
import { File, PageTitle } from "./components";
import { toast } from "react-toastify";
import { Navigate } from "react-router-dom";

function Files() {
  const appContext = useContext(AppContext);
  const [ shown, setShown] = useState(false);

  if (!appContext.token) {
    console.warn("not logged in, redirecting to /")
    if (!shown) {
      setShown(true)
      toast.error("You are not logged in!", {autoClose: 2000})
    }

    return <Navigate to="/login" />
  }

  return <div className="container">
    <div className="d-flex align-items-center flex-row justify-content-between">
      <div>
        <PageTitle title="Files" />
        <h5 className="fw-bold my-3"> <span className="bi bi-file-earmark-fill" /> 10 Files  <span className="bi bi-folder-fill" /> 5 Directories </h5>
      </div>
      <div>
        <button className="btn btn-secondary">
          <span className="display-5 bi bi-plus"></span>
        </button>
      </div>
    </div>

    <div className="d-flex gap-2 flex-column">
      <File file={{
        name: "File",
        type: "pdf",
        isDir: false,
        size: 2000,
        owner: 'Vipul'
      }} view="list" />
      <File file={{
        name: "File",
        type: "pdf",
        isDir: false,
        size: 2000,
        owner: 'Vipul'
      }} view="list" />
      <File file={{
        name: "File",
        type: "pdf",
        isDir: false,
        size: 2000,
        owner: 'Vipul'
      }} view="list" />
    </div>
  </div>

}

export default Files;
