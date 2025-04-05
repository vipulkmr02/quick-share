import { useContext, useEffect, useState } from "react";
import { AppContext } from "./App";
import { File, PageTitle, UploadButton } from "./components";
import { toast } from "react-toastify";
import { Navigate } from "react-router-dom";
import { fetchFiles } from "./utils";

function Files() {
  const appContext = useContext(AppContext);
  appContext.token = localStorage.getItem('token');
  const [shown, setShown] = useState(false);
  const [files, setFiles] = useState<{ [x: string]: string }[]>([]);

  useEffect(() => {
    const token = appContext.token;
    if (token)
      fetchFiles({ token })
        .then(res => res.json())
        .then(data => {
          if (data.message !== 'No Files Found') setFiles(data)
        })
  }, [])

  if (!appContext.token) {
    console.warn("not logged in, redirecting to /")
    if (!shown) {
      setShown(true)
      toast.error("You are not logged in!", { autoClose: 2000 })
    }
    return <Navigate to="/login" />
  }

  return <div  className="container">
    <div className="py-4 d-flex align-items-center flex-row justify-content-between">
      <div>
        <PageTitle title="Your Files" />
      </div>
      <div>
        <UploadButton />
      </div>
    </div>

    <div style={{maxHeight: '70vh'}} className="p-2 overflow-y-scroll d-flex gap-2 flex-column ">
      {files.map((x) => <File file={{
        name: x['file_name'],
        isDir: false,
        owner: appContext.fullname!,
        type: x['file_name'].split('.').slice(-1)[0]
      }} view="list" key={x['id']}/>)}

    </div>
  </div>

}

export default Files;
