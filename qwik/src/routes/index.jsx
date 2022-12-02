// import {
//     component$,
//     useStore,
//     useContext,
//     useContextProvider,
//     createContext,
//   } from '@builder.io/qwik';
// import { AuthContext } from './layout';
  
//   // Create a new context descriptor
//   export const MyContext = createContext('my-context');

  
//   export default component$(() => {
//     // Create some reactive storage
//     const state = useStore({
//       count: 0,
//     });
  
//     // Assign value (state) to the context (MyContext)
//     useContextProvider(MyContext, state);
//     return (
//       <>
//         <Child />
//         <div>Count: {state.count}</div>
//       </>
//     );
//   });

  
//   export const Child = component$(() => {
//     // Get reference to state using MyContext
//     const state = useContext(MyContext);
//     const contextData = useContext(AuthContext);
//     return (
//       <>
//         <button onClick$={() => state.count++}>Increment</button>

//       </>
//     );
//   });
  
// import React, {useState, useEffect, useContext} from 'react'
// import AuthContext from '../context/AuthContext'
// import { useNavigate } from 'react-router-dom'

import HomePageStyle from "~/styles/HomePage.scss?inline"
import { $, useStylesScoped$, component$, useClientEffect$, useContext } from '@builder.io/qwik'
import { AuthContext } from "./context"
import jwt_decode from "jwt-decode"
import { useNavigate } from "@builder.io/qwik-city"

export default component$(() => {
    const nav = useNavigate()
    useStylesScoped$(HomePageStyle)
    const state = useContext(AuthContext)
    useClientEffect$(() => {
        state.authTokens = localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null
        state.user = localStorage.getItem('authTokens') ? jwt_decode(localStorage.getItem('authTokens')) : null  

        setInterval(async () => {
            let response = await fetch('http://127.0.0.1:8000/api/token/refresh/', {
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({'refresh':state.authTokens?.refresh})
            })
    
            let data = await response.json()
            
            if (response.status === 200){
                state.authTokens = data
                state.user = jwt_decode(data.access)
                localStorage.setItem('authTokens', JSON.stringify(data))
            }else{
                state.authTokens = null
                state.user = null
                localStorage.removeItem('authTokens')
                nav.path = "/login"
            }
    
            if(state.loading){
                state.loading = false
            }
        }, 2000)
    })
    const enterRoom = $((e) => {
        nav.path = `/room/${e.target.room.value}/${e.target.enterPassword.value}`
    })
    const CreateRoom = $(async (e) => {
        await fetch(`http://localhost:8000/room/`, {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${state.authTokens.access}`
            },
            body: JSON.stringify({'name': e.target.name.value, 'password': e.target.password.value})
        })
        .then(response => response.json())
        .then(data => {
            data.status === 200 ? (nav.path = `/room/${e.target.name.value}/${e.target.password.value}`) : alert("This room is already exists")
        })
    })
    const logout = $(() => {
        state.authTokens = null
        state.user = null
        localStorage.removeItem('authTokens')
        nav.path = '/login'
    })
    return (
        <div id='enterRoom'>
            <button id='logout' onClick$={() => logout()}>Logout</button>
            <form preventdefault:submit onSubmit$={(e) => enterRoom(e)}>
                <label htmlFor="room">Enter the room's name</label>
                <input type="text" name="room" placeholder='Room name...' />
                <input type="password" name="enterPassword" placeholder='Room Password...' />
                <button type="submit">Enter</button>
            </form>
            <form preventdefault:submit onSubmit$={(e) => CreateRoom(e)}>
                <h3>or <br /> Create room</h3>
                <label htmlFor="name">Enter the room's name</label>
                <input type="text" name="name" placeholder='Room Name...' />
                <input type="password" name="password" placeholder='Room Password...' />
                <button type="submit">Create</button>
            </form>
        </div>
    )
})