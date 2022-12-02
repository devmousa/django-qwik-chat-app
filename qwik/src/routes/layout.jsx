import { component$, Slot, useMount$ } from '@builder.io/qwik';
import Header from '../components/header/header';
import jwt_decode from "jwt-decode";
import {
    $,
  useWatch$,
  useStore,
  useContext,
  useContextProvider,
  createContext,
  useClientEffect$
} from '@builder.io/qwik';
import { AuthContext } from './context';

// export const AuthContext1 = AuthContext

export default component$(() => {
    const state = useStore({
      authTokens: "",
      user: "",
      loading: true
    })
    useClientEffect$(() => {
        state.authTokens = localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null
        state.user = localStorage.getItem('authTokens') ? jwt_decode(localStorage.getItem('authTokens')) : null  

    let logoutUser = $(() => {
        state.authTokens = null
        state.user = null
        localStorage.removeItem('authTokens')
    })

    let updateToken = $(async () => {

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
            logoutUser()
        }

        if(state.loading){
            state.loading = false
        }
    })
    
    useWatch$(({ track }) => {
        track(() => state.loading)
        track(() => state.authTokens)
        if(state.loading){
            updateToken()
        }

        let interval =  setInterval(() => {
            if(state.authTokens){
                updateToken()
            }
        }, 240000)
        return () => clearInterval(interval)
    })
  })
  useContextProvider(AuthContext, state)
  return (
    <>
      <Slot />
    </>
  );
});
