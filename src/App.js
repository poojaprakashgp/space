import React from 'react'
import ReactDOM from 'react-dom/client'
import Body from './components/Body';
import { Provider } from 'react-redux';
import appStore from './utils/appStore';

// const parent = React.createElement('div', {id:'parent'}, 
// [React.createElement('div',{id:'child'}, React.createElement('h1',{}, 'im h1 of child 1')),
// React.createElement('div', {id:'child2'}, React.createElement('h1', {}, 'im h1 of child 2'))]);

// // const heading = React.createElement('h1', {}, 'Hello world React..!');
// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(parent)

const App = () => {
    return (
        <Provider store={appStore}>
        <div className="w-full bg-slate-500"> 
            <Body />
        </div>
        </Provider>
    )

}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />)