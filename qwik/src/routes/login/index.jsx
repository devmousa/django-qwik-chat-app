import { useStyles$, useClientEffect$, component$, useContext, $ } from "@builder.io/qwik"
import LoginPageStyle from "~/styles/LoginPage.scss?inline"
import { AuthContext } from "../context";
import jwt_decode from "jwt-decode";
import { Link, useNavigate } from "@builder.io/qwik-city";



// export default component$(() => {
    // const state = useStore({
    //     authTokens: localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null,
    //     user: localStorage.getItem('authTokens') ? jwt_decode(localStorage.getItem('authTokens')) : null,
    //     loading: true
    // })

    // let loginUser = async (e) => {
    //     e.preventDefault()
    //     let response = await fetch('http://127.0.0.1:8000/api/token/', {
    //         method:'POST',
    //         headers:{
    //             'Content-Type':'application/json'
    //         },
    //         body:JSON.stringify({'username':e.target.username.value, 'password':e.target.password.value})
    //     })
    //     let data = await response.json()

    //     if(response.status === 200){
    //         state.authTokens = data
    //         state.user = jwt_decode(data.access)
    //         localStorage.setItem('authTokens', JSON.stringify(data))
    //         window.location.href = '/'
    //     }else{
    //         console.log(response)
    //         alert('Something went wrong!')
    //     }
    // }


    // let logoutUser = () => {
    //     state.authTokens = null
    //     state.user = null
    //     localStorage.removeItem('authTokens')
    // }


    // let updateToken = async () => {

    //     let response = await fetch('http://127.0.0.1:8000/api/token/refresh/', {
    //         method:'POST',
    //         headers:{
    //             'Content-Type':'application/json'
    //         },
    //         body: JSON.stringify({'refresh':authTokens?.refresh})
    //     })

    //     let data = await response.json()
        
    //     if (response.status === 200){
    //         state.authTokens = data
    //         state.user = jwt_decode(data.access)
    //         localStorage.setItem('authTokens', JSON.stringify(data))
    //     }else{
    //         logoutUser()
    //     }

    //     if(loading){
    //         state.loading = false
    //     }
    // }

    // let contextData = {
    //     user:state.user,
    //     authTokens:state.authTokens,
    //     // loginUser:loginUser,
    //     // logoutUser:logoutUser,
    // }

    // const watch = () => {
    //     if(loading){
    //         updateToken()
    //     }

    //     let fourMinutes = 1000 * 60 * 4

    //     let interval =  setInterval(()=> {
    //         if(authTokens){
    //             updateToken()
    //         }
    //     }, fourMinutes)
    //     return () => clearInterval(interval)
    // }


    // useWatch$(({ track }) => {
    //     track(() => state.loading)
    //     watch()
    // })
    // useWatch$(({track}) => {
    //     track(() => state.authTokens)
    //     watch()
    // })
    // contextData = 'hi'
    // useContextProvider(AuthContext, 'state')
//     return (
//         <Child />
//     )
// })

// export default component$(() => {
//     useContextProvider(AuthContext, {"h": 1})
//     return (
//         <Child />
//     )
// })
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
    // const m = typeof window !== 'undefined' ? localStorage.getItem('test') : null
    // typeof window !== 'undefined' ? localStorage.setItem('test', "hello") : null
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
    // <>
    //     {/* <p>{state}</p> */}
    // </>
    )
})