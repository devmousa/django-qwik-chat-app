import { useStyles$, useClientEffect$, component$, useContext, $ } from "@builder.io/qwik"
import LoginPageStyle from "~/styles/LoginPage.scss?inline"
import { AuthContext } from "../context";
import jwt_decode from "jwt-decode";
import { Link, useNavigate } from "@builder.io/qwik-city";

export default component$(() => {
    const nav = useNavigate()
    useStyles$(LoginPageStyle)
    const state = useContext(AuthContext)
    
    useClientEffect$(() => {
        state.authTokens = localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null
        state.user = localStorage.getItem('authTokens') ? jwt_decode(localStorage.getItem('authTokens')) : null  
    })

    const login = $(async (e) => {
        
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
    })
    return (
        <>
        <div id='login'>
            <Link id="register" href='/register'>Register</Link>
            <form preventdefault:submit onSubmit$={(e) => login(e)}>
                <h2>Login</h2>
                <input type="text" name="username" placeholder="Enter Username" />
                <input type="password" name="password" placeholder="Enter Password" />
                <button>Login</button>
            </form>
        </div>
        </>
    )
})