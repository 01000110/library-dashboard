import logo from './logo.svg';
import './App.css';
import {ClipboardListIcon, HomeIcon, LinkIcon, ShoppingCartIcon} from '@heroicons/react/outline'
import React from "react";

const menuItems = [
    {
        name: "home",
        icon: React.createElement(HomeIcon, {className: 'Menu-Item'}),
        link: "/",
        active: true
    },
    {
        name: "loans and orders",
        icon: React.createElement(ShoppingCartIcon, {className: 'Menu-Item'}),
        link: "/loans",
        active: false
    },
    {
        name: "lists",
        icon: React.createElement(ClipboardListIcon, {className: 'Menu-Item'}),
        link: "/lists",
        active: false
    },
    {
        name: "digital content",
        icon: React.createElement(LinkIcon, {className: 'Menu-Item'}),
        link: "/digital",
        active: false
    },
];

function Sidebar() {
  return (
      <nav className="fixed flex justify-center left-0 bg-black w-20 h-screen py-5 pl-2 -ml-2">
          <div>
              <img src={logo} className="h-10 inset-0 w-full" alt="logo"/>
              <ul className="text-white text-center">
                  {
                      menuItems.map( (item, index) =>
                          <li data-active={item.active} key={index} className="items-center justify-center">
                              <a href={item.link}>
                                  {item.icon}
                              </a>
                          </li>

                      )
                  }
              </ul>
          </div>
      </nav>
  )
}

function App() {
  return (
      <Sidebar />
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.js</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header>
    // </div>
  );
}

export default App;
