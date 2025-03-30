import { useState } from "react"
import { Link, useLocation } from "react-router"

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
  size: string
  owner: string
  type: string
}

export function FileGroup(opts: { files: file[] }) {

  const [selectedIndex, select] = useState(-1)

  return <>
    <ul className="list-group">
      {
        opts.files.map((file, index) => {
          return <li key={index}
            className={selectedIndex === index ? 'active' : ''}
            onClick={() => select(index)}
          >
            <div className="container">
              <div className="name">{file.name}</div>
              <div className="size">{file.size}</div>
              <div className="type">{file.type}</div>
              <div className="owner">{file.owner}</div>
            </div>
          </li>
        })
      }
    </ul>

  </>

}
