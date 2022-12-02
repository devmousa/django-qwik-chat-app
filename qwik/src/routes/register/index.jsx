import { useStore, useStyles$, useClientEffect$, component$, useContext, useContextProvider, createContext, $, useMount$ } from "@builder.io/qwik"
import LoginPageStyle from "~/styles/LoginPage.scss?inline"
import { AuthContext } from "../context";
import jwt_decode from "jwt-decode";
import { Link, useNavigate } from "@builder.io/qwik-city";

export default component$(() => {
    const nav = useNavigate()
    useStyles$(LoginPageStyle)
    const state = useContext(AuthContext)
    const Submit = $(async (e) => {
        const data = {'username':e.target.username.value, 'password':e.target.password.value}
        await fetch('http://localhost:8000/user/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(async data => {
            if (data.ok){
                let username = e.target.username
                let password = e.target.password
                let response = await fetch('http://127.0.0.1:8000/api/token/', {
                    method:'POST',
                    headers:{
                        'Content-Type':'application/json'
                    },
                    body:JSON.stringify({'username':username.value, 'password':password.value})
                })
                let data = await response.json()
        
                if(response.status === 200){
                    state.authTokens = data
                    state.user = jwt_decode(data.access)
                    localStorage.setItem('authTokens', JSON.stringify(data))
                    nav.path = '/'
                }else{
                    console.log(response)
                    alert('Something went wrong!')
                }
            
            }else{
                alert("This Name Already Exists")
            }
        })
        .catch(err => console.log(err))
    })
    return (
        <div id='login'>
            <Link id="register" href='/login'>Login</Link>
            <form preventdefault:submit onSubmit$={(e)=> Submit(e)}>
                <h2>Register</h2>
                <input type="text" name='username' placeholder='Enter Username' />
                <input type="password" name="password" placeholder='Enter Password' />
                <button type="submit">Register</button>
            </form>
        </div>
    )
})