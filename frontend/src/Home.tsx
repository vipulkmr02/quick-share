import { useContext } from "react"
import { AppContext } from "./App"

function Home() {
  const context = useContext(AppContext)

  function signup() {
    const form$ = document.getElementById('signup-form')!
    const username = form$?.querySelectorAll('input')[0].value
    const email = form$?.querySelectorAll('input')[1].value
    const password = form$?.querySelectorAll('input')[2].value

    const body = { username: username, email: email, password: password }
    fetch('http://localhost:8000/signup', {
      method: 'POST',
      body: JSON.stringify(body),

    })
  }

  function login() {
    const form$ = document.getElementById('login-form')!
    const email = form$?.querySelectorAll('input')[0].value
    const password = form$?.querySelectorAll('input')[1].value

    const body = { email: email, password: password }
    fetch('https://localhost:8000/login', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body),
    }).then(res => res.json()).then(({ token }) => context.token = token)
  }

  return <>
    <div className="container mt-5">
      <h1 className="display-5 fw-bold">Welcome to Quick Share</h1>
      <h3>Save your files on the cloud and Share</h3>
      <div className="d-flex w-50 m-auto justify-content-between">
        <button type="button" data-bs-toggle="modal" data-bs-target="#loginModal"
          className="btn btn-primary"> Login </button>
        <button type="button" className="btn btn-primary"
          data-bs-toggle="modal" data-bs-target="#signupModal"> Signup </button>
      </div>
    </div>

    <div className="modal fade" id="loginModal" tabIndex={-1} aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5">Login</h1>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
          </div>
          <div className="modal-body">
            <form id="login-form">
              <div className="mb-3">
                <label htmlFor="login-email-input" className="form-label">E-Mail</label>
                <input id='login-email-input' type="email" className="form-control" />
              </div>

              <div className="mb-3">
                <label htmlFor="login-password-input" className="form-label">Password</label>
                <input id="login-password-input" type='password' className="form-control" />
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button type="button" onClick={login} className="btn btn-primary">Login</button>
          </div>
        </div>
      </div>
    </div>
    <div className="modal fade" id="signupModal" tabIndex={-1} aria-hidden="true">
      <div className="modal-dialog">
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

  </>
}

export default Home;
