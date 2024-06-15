import {createSlice} from '@reduxjs/toolkit'
const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user:null,
    },
    reducers: {
        login(state, action) {
            state.user = action.payload;
            sessionStorage.setItem('auth', JSON.stringify(state));
        },
        logout(state) {
            state.user = null;
            sessionStorage.removeItem('auth');
        },
        loadAuthFromStorage: (state) => {
            const auth = sessionStorage.getItem('auth');
            if(auth){
                state.user = JSON.parse(auth).user;
            }
        }
    }
})

export const {login, logout, loadAuthFromStorage} = authSlice.actions;
export default authSlice.reducer;