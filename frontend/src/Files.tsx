import { useContext, useEffect, useState } from "react";
import { AppContext } from "./App";
import { File, PageTitle, UploadButton } from "./components";
import { toast } from "react-toastify";
import { Navigate } from "react-router-dom";
import { fetchFiles } from "./utils";

function Files() {
  const appContext = useContext(AppContext);
  appContext.token = localStorage.getItem('token');

  const [_uploading, setUploading] = useState(false);
  const [shown, setShown] = useState(false);
  const [files, setFiles] = useState<{ [x: string]: string }[] | null>([]);
  const [fileUpdate, updateFiles] = useState(false);
  const triggerFilesUpdate = () => updateFiles(prev => !prev);

  // useEffect(() => {
  //   const uploadToast = () => toast.loading("Uploading file...", {
  //     position: "top-center",
  //     autoClose: false,
  //     hideProgressBar: true,
  //   })
  //   let id;

  //   if (uploading && !id) {
  //     id = uploadToast();
  //   } else {
  //     console.log('file uploaded');
  //     setTimeout(() => { toast.dismiss(); }, 2000);
  //   }
  // }, [uploading])


  useEffect(() => {
    const token = appContext.token;
    if (token)
      fetchFiles({ token })
        .then(res => res.json())
        .then(data => {
          if (data.message !== 'No Files Found') setFiles(data)
        })
  }, [fileUpdate, appContext])

  if (!appContext.token) {
    console.warn("not logged in, redirecting to /")
    if (!shown) {
      setShown(true)
      toast.error("You are not logged in!", { autoClose: 2000 })
    }
    return <Navigate to="/login" />
  }

  return <div className="container mt-0">
    <div className="d-flex flex-wrap align-items-center flex-row justify-content-between justify-content-center">
      <PageTitle title="Your Files" />
      <UploadButton
        whileUploading={() => { setUploading(true); }}
        onUploadSuccess={() => { triggerFilesUpdate(); setUploading(false); }}
      />
    </div>

    <div style={{ minHeight: '75vh' }} className="list-group mt-2 overflow-y-auto d-flex gap-2 flex-column w-100 p-2">
      {Array.isArray(files) && files.length !== 0 ? files.map((x) => <File file={{
        id: x['id'],
        name: x['file_name'],
        isDir: false,
        owner: appContext.fullname!,
        uuid: x['file_uuid'],
        public: Boolean(x['public']),
        type: x['file_name'].split('.').slice(-1)[0],
      }} view="grid" key={x['id']} afterDelete={triggerFilesUpdate} />)
        : <div className="d-flex flex-column position-absolute top-50 start-50 translate-middle text-center">
          <i className="bi bi-ban fs-1 text-secondary" />
          <h3 className="text-secondary"> No files!  </h3>
          <h5 className="text-secondary mt-3">Start uploading by clicking 'Select File'</h5>
        </div>}
    </div>
  </div>
}

export default Files;
