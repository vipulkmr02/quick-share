import { useState } from "react"
import { Link, useLocation } from "react-router"
import '../node_modules/bootstrap/dist/js/bootstrap.min.js';

export function Navbar() {
  return <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
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
  size: number
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
        <div className="fileSize">{opts.file.size}</div>
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
