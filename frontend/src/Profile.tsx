import { useEffect, useContext, useRef, useState } from "react";
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
  const dpR = useRef(null);
  const dpiR = useRef(null);
  const dobR = useRef(null);

  if (!appContext.token) {
    console.warn("not logged in, redirecting to /")
    if (!shown) {
      setShown(true)
      toast.error("You are not logged in!", { autoClose: 2000 })
    }
    return <Navigate to="/login" />
  }

  useEffect(() => {
    if (emailR.current) {
      const userInfo = JSON.parse(localStorage.getItem('user-info') ?? '{}');
      const profile = userInfo.profile;

      if (emailR.current) (emailR.current as HTMLInputElement).value = userInfo.email;
      if (usernameR.current) (usernameR.current as HTMLInputElement).value = userInfo.username;
      if (fullNameR.current) (fullNameR.current as HTMLInputElement).value = profile ? profile.full_name : '';
      if (dobR.current) (dobR.current as HTMLInputElement).valueAsDate = profile ? new Date(profile.dob) : null;
    }
  }, [usernameR, emailR])

  useEffect(() => {
    fetch('http://localhost:8000/dp', {
      headers: {
        Authorization: `Token ${appContext.token}`
      }
    }).then(res => res.ok ? res.blob() : Promise.reject(res))
      .then(blob => {
        const url = URL.createObjectURL(blob);
        if (dpR.current) (dpR.current as HTMLImageElement).src = url;
      })
  }, [])

  function saveChanges() {
    const fd = new FormData();
    fd.append("full_name", (fullNameR.current! as HTMLInputElement).value);
    fd.append("dob", (dobR.current! as HTMLInputElement).value);
    console.log("Saving changes", fd);
    fetch('http://localhost:8000/profile', {
      method: "PATCH",
      headers: {
        Authorization: `Token ${appContext.token}`,
      }, body: fd
    }).then(res => {
      if (res.status === 201)
        toast.success("Profile Updated!", { autoClose: 2000 })
      else
        toast.error("Profile Unable to be Updated!", { autoClose: 2000 })
    })
  }

  return <>
    <div className="container w-100">
      <PageTitle title="Your Profile" />
      <input name="dpInput" type="file" className="d-none" />
      <div className="container p-5 d-flex gap-3 justify-content-around flex-row flex-wrap align-items-center">
        <div>
          <img src="/default-profile-picture.png" alt="Display Picture" style={{ width: '300px', height: '300px' }} className="rounded-circle border border-3 border-secondary" ref={dpR} />
        </div>
        <div className="details flex-grow-0">
          <form id="form">
            <div className="form-floating mb-3">
              <input type="text" name="username" className="form-control" id="username" ref={usernameR} />
              <label htmlFor="username">Username</label>
            </div>
            <div className="form-floating mb-3">
              <input type="email" name="email" className="form-control" id="email" ref={emailR} />
              <label htmlFor="email">Email address</label>
            </div>
            <div className="form-floating mb-3">
              <input type="text" name="full_name" className="form-control" id="fullName" ref={fullNameR} />
              <label htmlFor="fullName">Full Name</label>
            </div>
            <div className="form-floating mb-3">
              <input type="date" name="dob" className="form-control" id="dob" ref={dobR} />
              <label htmlFor="dob">Date of Birth</label>
            </div>
            <div className="d-flex flex-wrap justify-content-center gap-3 m-4">
              <button type='button' className="btn btn-primary" onClick={saveChanges}>Save Changes</button>
              <button type='button' className="btn btn-primary" onClick={() => {
                if (dpR.current) {
                  const element = dpR.current as HTMLInputElement;
                  element.click();
                }
              }}>
                Change Display Picture
                <input ref={dpiR} className="d-none" type="file" accept="image/*" name="dp" onChange={() => {
                  if (dpiR.current) {
                    const file = (dpiR.current as HTMLInputElement).files![0];
                    const fd = new FormData();
                    fd.append("display_picture", file);
                    fetch("http://localhost:8000/profile", {
                      method: "PATCH",
                      headers: {
                        "Authorization": `Token ${localStorage.getItem("token")}`,
                      },
                      body: fd,
                    }).then(res => res.json()).then(data => {
                      console.log(data);
                      toast.success("Display Picture Updated!", { autoClose: 2000 })
                    }).catch(err => {
                      console.error(err);
                      toast.error("Error updating display picture!", { autoClose: 2000 })
                    });
                  }
                }} id="dp-input" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </>;
}

export default Profile;
