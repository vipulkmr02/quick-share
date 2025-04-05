import { useContext, useRef, useState } from "react";
import { AppContext } from "./App";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { PageTitle } from "./components";

function Profile() {
  const appContext = useContext(AppContext);
  appContext.token = localStorage.getItem('token');
  const [shown, setShown] = useState(false);
  const emailR = useRef(null);
  const usernameR = useRef(null);
  const fullNameR = useRef(null);

  if (!appContext.token) {
    console.warn("not logged in, redirecting to /")
    if (!shown) {
      setShown(true)
      toast.error("You are not logged in!", { autoClose: 2000 })
    }
    return <Navigate to="/login" />
  }

  return <>
    <div className="container w-100">
      <PageTitle title="Your Profile" />
      <div className="container p-5 d-flex gap-3 flex-row">
        <div className="displayPicture flex-grow-1">
          <img src="http://localhost:8000/dp" alt="Display Picture" />
        </div>
        <div className="details flex-grow-0 ">
          <form action="">
            <div className="form-floating mb-3">
              <input type="text" className="form-control" id="fullName" ref={fullNameR} />
              <label htmlFor="fullName">Full Name</label>
            </div>
            <div className="form-floating mb-3">
              <input type="email" className="form-control" id="email" ref={emailR} />
              <label htmlFor="email">Email address</label>
            </div>
            <div className="form-floating">
              <input type="text" className="form-control" id="username" ref={usernameR} />
              <label htmlFor="username">Username</label>
            </div>
            <div className="d-flex gap-3 m-4">
              <button className="btn btn-primary">Save Changes</button>
              <button className="btn btn-primary">Change Display Picture</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </>;
}

export default Profile;
