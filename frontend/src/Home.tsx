import { useContext, useEffect, useRef } from "react"
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

  function signup() {
    const form$ = document.getElementById('signup-form')!
    const username = form$?.querySelectorAll('input')[0].value
    const email = form$?.querySelectorAll('input')[1].value
    const password = form$?.querySelectorAll('input')[2].value

    const body = { username: username, email: email, password: password }
    fetch('http://localhost:8000/signup', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        "Accept": "*/*",
        "Content-Type": "application/json"
      },
    })
  }

  useEffect(() => {
    if (modal === 'signup') {
      const trigger = new window.bootstrap.Modal(signupModalRef.current)
      trigger.show();
    }
    else if (modal === 'login') {
      const trigger = new window.bootstrap.Modal(loginModalRef.current)
      trigger.show();
    }
  }, [modal])

  useEffect(() => {
    if (loginModalRef.current)
      loginModalRef.current.addEventListener('hidden.bs.modal', () => {
        document.querySelectorAll('.modal-backdrop').forEach(x => x.remove())
        navigate('/');
      });

    if (signupModalRef.current)
      signupModalRef.current.addEventListener('hidden.bs.modal', () => {
        document.querySelectorAll('.modal-backdrop').forEach(x => x.remove())
        navigate('/');
      });
  })

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
        console.log("successfully logged in")
        toast.success("Logged IN!", { autoClose: 1000, hideProgressBar: true });
        fetch('http://localhost:8000/info', {
          method: "GET", headers: {
            "Accept": "*/*",
            "Content-Type": "application/json",
            "Authorization": `Token ${token}`
          }
        }).then(res => res.json())
          .then(data => {
            context.email = data.email
            context.username = data.username
            context.fileCount = data.fileCount
            context.dirCount = data.dirCount
            navigate('/');
          })
      }).catch((err) => {
        console.error(err)
        toast.error("Something went wrong!")
      })
  }

  return <>
    <div className="container">
      {!context.token ? <div>
        <PageTitle title="Welcome to Quick Share" />
        <h3 className="display-7 ">Save your files on the cloud and Share</h3>
        <div className="d-flex w-50 m-auto justify-content-between">
          <button type="button" data-bs-toggle="modal" data-bs-target="#loginModal"
            className="btn btn-primary"> Login </button>
          <button type="button" className="btn btn-primary"
            data-bs-toggle="modal" data-bs-target="#signupModal"> Signup </button>
        </div>

      </div> : <PageTitle title="Dashboard" />
      }

      <div className={`modal fade`} ref={loginModalRef} id="loginModal" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5">Login</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
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
      </div>
      <div className={`modal fade`} ref={signupModalRef} id="signupModal" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5">Signup</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
            </div>
            <div className="modal-body">
              <form id="signup-form">
                <div className="mb-3">
                  <label htmlFor="signup-fullname-input" className="form-label">Full Name</label>
                  <input id='signup-fullname-input' type="text" className="form-control" placeholder='Raj Shamani' />
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
      </div>
    </div>

  </>
}

export default Home;
