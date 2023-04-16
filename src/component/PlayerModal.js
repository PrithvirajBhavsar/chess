import { useState } from 'react'
import Modal from './Modal';

const PlayerModal = ({setPlayers}) => {
    const [user, setUser] = useState({black:"",white:""})
    const [active, setActive] = useState(true);

    const handleSubmit = (e)=>{
        e.preventDefault();
        setActive(false)
        setPlayers(user);
    }

    const handleChange = (e)=>{
        setUser({...user,[e.target.name]:e.target.value});
    }

    const Head = ()=>{
        return <h3 className='text-center text-white'>Pass & Play</h3>
    }

    const Body = () => {
        return (
            <form onSubmit={handleSubmit} id="player-form">
                <div className='input-parent'>
                    <label className='text-white' htmlFor='white-player'>White Player Name</label>
                    <br></br>
                    <input value={user.white} onChange={handleChange} id="white-player" name='white'></input>
                </div>
                <div className='input-parent'>
                    <label className='text-white' htmlFor='black-player'>Black Player Name</label>
                    <br></br>
                    <input value={user.black} onChange={handleChange} id="black-player" name='black'></input>
                </div>
                <button className='primary btn mt-1'>Play</button>
            </form>
        )
    }

    return (
        <Modal active={active} setActive={setActive} head={<Head/>} body={<Body/>}/>
    )
}

export default PlayerModal