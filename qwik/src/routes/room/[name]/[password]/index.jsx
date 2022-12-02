import { $, component$, useClientEffect$, useContext, useStore, useStyles$, useMount$ } from "@builder.io/qwik";
import { AuthContext } from "~/routes/context";
import { useLocation, useNavigate, Link } from "@builder.io/qwik-city";
import jwt_decode from "jwt-decode"
import axios from "axios";
import ChatPageStyle from "~/styles/Chat.scss?inline"
import back from "~/assets/back.svg"

export default component$(() => {
    useStyles$(ChatPageStyle)
    const state = useContext(AuthContext)
    const loc = useLocation()
    const nav = useNavigate()
    const store = useStore({
        messages: [],
        name: loc.params.name,
        password: loc.params.password
    })
    const getMessages = $(async() => {
        console.log(state.authTokens)
        await fetch(`http://localhost:8000/room/${store.name}/${store.password}`, {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${state.authTokens.access}`
            }
        })
        .then(response => response.json())
        .then(data => store.messages = data)
        .catch(err => nav.path = '/')
    })
    useClientEffect$(() => {
        state.authTokens = localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null
        state.user = localStorage.getItem('authTokens') ? jwt_decode(localStorage.getItem('authTokens')) : null  
        state.user !== null && state.authTokens !== null ? '' : nav.path = '/login' 
        // const timer = setInterval(() => getMessages(), 10000)
        // getMessages()
        // return () => clearInterval(timer) 
        setInterval(async () => {
            await fetch(`http://localhost:8000/room/${store.name}/${store.password}`, {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${state.authTokens.access}`
            }
        })
        .then(response => response.json())
        .then(data => store.messages = data)
        .catch(err => nav.path = '/')
        }, 1000)  
    })
    const Send = $(async (e) => {
        // let data = {'message': e.target.message.value, "image": [e.target.image.files[0], e.target.image.files[0].name]}
        let data = new FormData()
        data.append("message", e.target.message.value)
        data.append("image", e.target.image.files[0])
        await axios(`http://localhost:8000/room/${store.name}/${store.password}`, {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${state.authTokens.access}`,
                "Content-Type": "multipart/form-data"
            },
            data: data
        })
        e.target.reset()
        let messagesContainer = document.getElementById("messagesContainer")
        messagesContainer.scrollTo(0, 0)
    })
    return (
        <>
            <nav>
                <Link href='/'>
                    <img src={back} alt="back button" width={40} height={40} />
                </Link>
                <button onClick$={() => {
                    fetch(`http://localhost:8000/room/${store.name}/${store.password}`, {
                        method: 'DELETE',
                        headers: {
                            "Authorization": `Bearer ${state.authTokens.access}`
                        }
                    })
                }}>Delete</button>
                <h2>{store.name}</h2>
            </nav>
            <div className="messages">
                <div className="message" id='messagesContainer'>
                    {store.messages && store.messages.map((message) => {
                        return <div className={`${state.user.username == message.user ? 'owner' : 'another'}`} key={message.id}><h3>{message.user}</h3> <p>{message.message}</p>
                            {message.image ? <img className='image' style={{'width': 'auto', 'height': "100px", "display": "block"}} src={`http://localhost:8000${message.image}`} loading="lazy" width={300} height={150} /> : ''}
                        </div>
                    })}
                </div>
            </div>
            <form preventdefault:submit className='send' onSubmit$={(e) => Send(e)}>
                <input type="text" name="message" />
                <input type="file" name="image" />
                <input type="submit" value="Send" />
            </form>
        </>
    )
})