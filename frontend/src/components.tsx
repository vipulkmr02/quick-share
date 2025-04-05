import { useContext, useRef, useState } from "react"
import { Link, useLocation } from "react-router"
import '../node_modules/bootstrap/dist/js/bootstrap.min.js';
import { AppContext } from "./App.js";
import { upload } from "./utils.js";
import { toast } from "react-toastify";


export function Navbar() {
  return <nav className="mb-2 navbar navbar-expand-lg navbar-dark bg-dark">
    <div className="container justify-content-between">
      <Link className="navbar-brand" to="/">Quick Share</Link>
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbar" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse flex-grow-0" id="navbar">
        <ul className="navbar-nav mb-2 mb-lg-0">
          <li className="nav-item">
            <Link to='/' className={"nav-link " + (useLocation().pathname === '/' && 'active')}>Home</Link>
          </li>
          <li className="nav-item" >
            <Link to='/files' className={"nav-link " + (useLocation().pathname === '/files' && 'active')}>Files</Link>
          </li>
          <li className="nav-item">
            <Link to='/profile' className={"nav-link " + (useLocation().pathname === '/profile' && 'active')}>Profile</Link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
}

export interface file {
  name: string
  size?: number
  owner: string
  type: string
  isDir: boolean
}

export function File(opts: { file: file, view: 'list' | 'grid' }) {
  const [options, showOptions] = useState(false);

  return <div onMouseEnter={() => showOptions(true)} onMouseLeave={() => showOptions(false)} className="card bg-body-secondary">
    <div className="card-body">
      <div className="d-flex file align-items-center flex-row gap-5">
        <div className="fileIcon fs-4">
          <span className="bi bi-file-earmark-fill"></span>
        </div>
        <div className="fileName fw-bold flex-grow-1">{opts.file.name}</div>
        <div className="fileOptions d-flex gap-3">
          <span className={`bi cursor-pointer bi-trash-fill opacity-${options ? 100 : 0}`}></span>
        </div>
        <div className="fileOwner">{opts.file.owner}</div>
      </div>
    </div>
  </div>
}

// export interface ToastOpts { id: string, title?: string, body: string, sub?: string };

// export function Toast({ id, title, body, sub }: ToastOpts) {
//   return <div id={id} className="toast show m-2" role="alert" aria-live="assertive" aria-atomic="true">
//     <div className="toast-header">
//       <strong className="me-auto">{title ?? "Notification"}</strong>
//       <small>{sub ?? ""}</small>
//       <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"> </button>
//     </div>
//     <div className="toast-body"> {body} </div>
//   </div>
// }
//
// export function toast(opts: ToastOpts) {
//   return bootstrap.Toast.getOrCreateInstance()
// }

export function PageTitle({ title }: { title: string }) {
  return <>
    <h1 className='my-3 display-3 fw-bold'> {title} </h1>
  </>
}

export function Error() {
  return <div className="container"> <h1 className="display-1 ta-center fw-bold">Error!</h1> </div>
}

export function UploadButton() {
  const context = useContext(AppContext);
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const mainBtn = useRef<HTMLButtonElement | null>(null);

  const onFileChange = () => {
    if (context.token && file)
      return upload({ token: context.token, file: file })
        .then(res => res.status === 201)
    return new Promise((_resolve, reject) => { reject(null) });
  }

  const onFileSelection = () => {
    mainBtn.current!.classList.remove('bg-success')
    mainBtn.current!.classList.remove('bg-danger')
    const element = inputRef.current as HTMLInputElement | null
    const file = element ? element.files![0] : null;
    setFile(file!)
  }

  return <>
    <button ref={mainBtn} className="d-flex flex-column btn btn-secondary" onClick={
      () => file ? onFileChange().then(uploadSuccess => {
        if (uploadSuccess) {
          toast.success("File Upload Successful!")
          mainBtn.current!.classList.add('bg-success')
          setFile(null);
        } else {
          toast.error("File Upload Unsuccessful!")
          mainBtn.current!.classList.add('bg-danger')
          setFile(null);
        }
      }) : inputRef.current ? inputRef.current.click() : 0}>
      <i className="fs-1 bi bi-upload" />
      <div className="fw-bold fs-5">{file ? "Upload" : "Select File"}</div>
      {file && <div> File: <span className="align-bottom d-inline-block text-truncate" style={{ maxWidth: '100px' }}>{file.name}</span> </div>}
      <input onChange={onFileSelection} type="file" ref={inputRef} className="d-none" />
    </button>
  </>
}
