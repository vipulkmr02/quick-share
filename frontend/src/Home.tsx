import { useContext, useEffect, useRef, useState } from "react"
import 'bootstrap/dist/js/bootstrap.bundle.min'
import { AppContext } from "./App"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { PageTitle } from "./components"

function Home({ modal }: { modal?: undefined | 'login' | 'signup' }) {
  const context = useContext(AppContext)
  const loginModalRef = useRef(null)
  const signupModalRef = useRef(null)
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(!!context.token);

  function signup() {
    const form$ = document.getElementById('signup-form')!
    const username = form$?.querySelectorAll('input')[0].value
    const email = form$?.querySelectorAll('input')[1].value
    const password = form$?.querySelectorAll('input')[2].value

    const body = {
      username: username,
      email: email,
      password: password
    }
    fetch('http://localhost:8000/signup', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        "Accept": "*/*",
        "Content-Type": "application/json"
      },
    }).then(res => res.json())
      .then(json => {
        return Object.create({
          done: json.username === username && json.email === email,
          json: json
        })
      }).then(response => {
        if (response.done) {
          toast.success("Signed UP successfully!")
          // clicking closing btn
          const closeBtn = document.getElementById("signupCloseBtn") as HTMLButtonElement
          closeBtn.click()
        } else {
          for (const key of Object.keys(response.json)) {
            toast.error(`${key.trim().toLocaleUpperCase()}: ${response.json[key]}`)
          }
        }
      }).catch(err => console.error(err.message))
  }

  useEffect(() => {
    if (modal === 'signup')
      document.getElementById('signupTriggerBtn')!.click();
    else if (modal === 'login')
      document.getElementById('signupTriggerBtn')!.click();

  }, [modal])

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      context.token = token
      setLoggedIn(true)
    }

    // removing backdrops
    if (loginModalRef.current) {
      loginModalRef.current.addEventListener('hidden.bs.modal', () => {
        document.querySelectorAll('.modal-backdrop').forEach(x => x.remove())
        navigate('/');
      });
    }

    if (signupModalRef.current)
      signupModalRef.current.addEventListener('hidden.bs.modal', () => {
        document.querySelectorAll('.modal-backdrop').forEach(x => x.remove())
        navigate('/');
      });
  }, [context, navigate])

  function login() {
    const form$ = document.getElementById('login-form')!
    const username = form$?.querySelectorAll('input')[0].value
    const password = form$?.querySelectorAll('input')[1].value

    const body = { username: username, password: password }
    fetch('http://localhost:8000/login', {
      method: 'POST',
      headers: {
        "Accept": "*/*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body),
    }).then(res => res.json())
      .then(({ token }) => {
        context.token = token
        localStorage.setItem('token', token)
        setLoggedIn(true);
        console.log("successfully logged in")
        // close modal
        const closeBtn = document.getElementById("loginCloseBtn") as HTMLButtonElement
        closeBtn.click()
        toast.success("Logged IN!", { autoClose: 1000, hideProgressBar: true });
        setLoggedIn(true)
      }).catch((err) => {
        console.error(err)
        toast.error("Something went wrong!")
      })
  }


  return <>
    <div className="container">
      {!loggedIn ? <div>
        <PageTitle title="Welcome to Quick Share" />
        <h3 className="display-7 ">Save your files on the cloud and Share</h3>
        <div className="d-flex w-50 m-auto justify-content-between">
          <button id='loginTriggerBtn' type="button" data-bs-toggle="modal" data-bs-target="#loginModal"
            className="btn btn-primary"> Login </button>
          <button type="button" className="btn btn-primary"
            data-bs-toggle="modal" data-bs-target="#signupModal"> Signup </button>
        </div>

      </div> : <PageTitle title="Dashboard" />
      }

      {!loggedIn && <div className={`modal fade`} ref={loginModalRef} id="loginModal" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5">Login</h1>
              <button type="button" id="loginCloseBtn" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
            </div>
            <div className="modal-body">
              <form id="login-form">
                <div className="mb-3">
                  <label htmlFor="login-username-input" className="form-label">Username</label>
                  <input id='login-username-input' type="text" className="form-control" />
                </div>

                <div className="mb-3">
                  <label htmlFor="login-password-input" className="form-label">Password</label>
                  <input id="login-password-input" type='password' className="form-control" />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" onClick={login} className="btn btn-primary">Login</button>
              <button type="button" onClick={() => navigate('/signup')} className="btn btn-secondary">Create Account</button>
            </div>
          </div>
        </div>
      </div>}

      {!loggedIn && <div className={`modal fade`} ref={signupModalRef} id="signupModal" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5">Signup</h1>
              <button type="button" id="signupCloseBtn" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
            </div>
            <div className="modal-body">
              <form id="signup-form">
                <div className="mb-3">
                  <label htmlFor="signup-username-input" className="form-label">Username</label>
                  <input id='signup-username-input' type="text" className="form-control" placeholder='raj' />
                </div>

                <div className="mb-3">
                  <label htmlFor="signup-email-input" className="form-label">E-Mail</label>
                  <input type="signup-email-input" className="form-control" placeholder='Raj@gmail.com' />
                </div>

                <div className="mb-3">
                  <label htmlFor="signup-password-input" className="form-label">Password</label>
                  <input type="signup-password-input" className="form-control" placeholder='Keep a strong password!' />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type='button' onClick={signup} className={"btn btn-primary "}>
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>}

      {loggedIn &&
        <div className="container p-0">
          <h3>Hello, <em> {context.fullname ?? "Full Name"}</em></h3>
          <h4>Recent Files</h4>
        </div>}

    </div>

  </>
}

export default Home;
