import './Modal.css'

const Modal = ({ head, body, active,bgcolor }) => {
    return (
        <div className={`modal-background${(active) ? '' : ' hidden'}`}>
            <div style={{backgroundColor:bgcolor || "rgb(45,45,45)"}} className='modal'>
                {
                    (head) ?
                        <div className='modal-header'>
                            {head}
                        </div>
                        : null
                }
                <div className='modal-body'>
                    {body}
                </div>
                {/* <div className='modal-footer'></div> */}
            </div>
        </div>
    )
}

export default Modal