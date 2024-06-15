import {configureStore} from '@reduxjs/toolkit'
import authSlice from './authSlice';
import launchSlice from './launchSlice';
const appStore = configureStore({
    reducer:{
     auth:authSlice,
     launch: launchSlice
    }
})

appStore.dispatch({ type: 'auth/loadAuthFromStorage' });

export default appStore;