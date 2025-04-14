import { ReactNode, useContext, useRef, useState } from "react"
import { Link, useLocation } from "react-router"
import Collapse from 'bootstrap/js/dist/collapse';
import { AppContext } from "./App.js";
import { changeVisibility, deleteFiles, downloadFile, upload } from "./utils.js";
import { toast } from "react-toastify";
import 'bootstrap/dist/js/bootstrap.bundle.min'


export function Navbar() {
    return <nav className="position-sticky top-0 shadow mb-2 navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container justify-content-between">
            <Link className="display-5 fs-2 navbar-brand" to="/">Quick Share</Link>
            <button className="navbar-toggler" type="button" onClick={() => {
                const element = document.getElementById('navbar') as HTMLDivElement;
                if (element) {
                    const bsCollapse = new Collapse(element, { toggle: true });
                    bsCollapse.toggle();
                }
            }} aria-expanded="true" aria-label="Toggle navigation">
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
    id: string
    name: string
    size?: number
    owner: string
    type: string
    isDir: boolean
    public: boolean
    uuid: string
}

export function File(opts: { afterDelete?: () => void, active?: boolean, file: file, view: 'list' | 'grid' }) {
    const appContext = useContext(AppContext);
    const [shown, setShown] = useState(false);
    return <div onMouseOver={() => setShown(true)} onMouseLeave={() => setShown(false)} className="shadow-sm card bg-body-secondary">
        <div className="card-body">
            <div className="d-flex file align-items-center flex-row gap-5">
                <div className="fs-4 bi bi-file-earmark-fill" />
                <div className="fileName fw-bold flex-grow-1">
                    {opts.file.name}
                </div>
                <div className={!shown ? `visually-hidden` : 'd-flex gap-3'}>
                    <button className="btn btn-primary py-1" onClick={() => {
                        downloadFile({ name: opts.file.name, uuid: opts.file.uuid, token: appContext.token! }).catch(err => {
                            toast.error(err.message);
                        })
                    }}> <i className="bi bi-download fw-bold py-0 " /> </button>
                    {opts.file.public && <button onClick={
                        () => {
                            navigator.clipboard.writeText(
                                `http://localhost:8000/download/${opts.file.uuid}`
                            ).then(() => {
                                toast.info("Link copied to the clipboard.")
                            })
                        }
                    } className="btn btn-secondary">
                        <i className="bi bi-share" /></button>}
                    <button className="btn btn-danger py-1" onClick={() => {
                        deleteFiles({
                            token: appContext.token!,
                            query: `id=${opts.file.id}`
                        }).finally(() => {
                            opts.afterDelete?.();
                        }).catch(err => {
                            toast.error(err.message);
                        }).then(() => {toast.success("File Deleted!")})
                    }}> <i className="bi bi-trash-fill p-0 fw-bold" /> </button>
                </div>
                <button className="btn" onClick={() => {
                    changeVisibility({ token: appContext.token!, fileId: opts.file.uuid }).then((res) => {
                        if (res.status === 200) {
                            toast.success("Visibility changed!");
                            opts.file.public = !opts.file.public;
                        } else {
                            toast.error("Error changing visibility!");
                        }
                    })
                }}>{opts.file.public ?
                    <i className="bi bi-eye" /> :
                    <i className="bi bi-eye-slash" />}</button>

                {/* <div className="dropdown-center d-flex gap-3">
          <button
            className={`dropdown-toggle btn`}
            type="button"
            data-bs-auto-close="true"
            data-bs-toggle="dropdown" aria-expanded="false" >
            <span className='bi bi-three-dots-vertical' />
          </button>

          <ul className="dropdown-menu">
            <li> <button className="dropdown-item">Information</button> </li>
            <li > <button onClick={() => {
              deleteFiles({
                token: appContext.token!,
                query: `id=${opts.file.id}`
              }).finally(() => {
                opts.afterDelete?.();
              })
            }} className="dropdown-item">Delete</button> </li>
          </ul>
        </div> */}

                {opts.file.isDir && <div className="fs-4 bi bi-folder-fill" />}
                {opts.file.owner && <div className="fs-4 bi bi-person-fill">
                    <div className="fileOwner">{opts.file.owner}</div>
                </div>}
            </div>
        </div>
    </div>
}

export interface ToastOpts { icon?: ReactNode, title?: string, body: string, sub?: string };

export function Toast(data: ToastOpts) {
    const { title, body, sub, icon } = data;
    return <div className="toast show" role="alert" aria-live="assertive" aria-atomic="true">
        <div className="toast-header">
            <strong className="me-auto">{title ?? "Notification"}</strong>
            <small>{sub ?? ""}</small>
            <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"> </button>
        </div>
        <div className="toast-body d-flex flex-row gap-3">
            <div className="icon">{icon}</div>
            <div className="content"> {body} </div>
        </div>
    </div>
}

// export function toast(opts: ToastOpts) {
//   return bootstrap.Toast.getOrCreateInstance()
// }

export function PageTitle({ title }: { title: string }) {
    return <>
        <h1 className='mt-3 mb-4 display-5 fs-1 text-center text-md-start fw-bold'> {title} </h1>
    </>
}

export function Error() {
    return <div className="container"> <h1 className="display-1 ta-center fw-bold">Error!</h1> </div>
}

export function UploadButton(props: {
    onUploadSuccess?: () => void,
    onUploadFailure?: () => void
    whileUploading: () => void
}) {
    const context = useContext(AppContext);
    const [file, setFile] = useState<File | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const mainBtn = useRef<HTMLButtonElement | null>(null);

    const onFileChange = () => {
        props.whileUploading();
        if (context.token && file)
            return upload({ token: context.token, file: file })
                .then(res => res.status === 201)
        return new Promise((_resolve, reject) => { reject(null) });
    }

    const onFileSelection = () => {
        const element = inputRef.current as HTMLInputElement | null
        const file = element ? element.files![0] : null;
        setFile(file!)
    }

    return <>
        <button ref={mainBtn} className="d-flex flex-wrap flex-row gap-4 align-items-center btn btn-secondary" onClick={
            () => file ? onFileChange().then(uploadSuccess => {
                if (uploadSuccess) {
                    toast.success("File Upload Successful!")
                    setFile(null);
                    if (props.onUploadSuccess !== undefined)
                        props.onUploadSuccess();
                } else {
                    toast.error("File Upload Unsuccessful!")
                    setFile(null);
                    if (props.onUploadFailure !== undefined)
                        props.onUploadFailure();
                }
            }) : inputRef.current ? inputRef.current.click() : 0}>
            <i className="fs-5 bi bi-upload" />
            <div className="text-wrap fs-5">{file ? "Upload" : "Select File"}</div>
            {file && <div className="align-bottom d-inline-block text-truncate" style={{ maxWidth: '100px' }}>{file.name} </div>}
            <input onChange={onFileSelection} type="file" ref={inputRef} className="d-none" />
        </button>
    </>
}
