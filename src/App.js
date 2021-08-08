import logo from './logo.svg';
import './App.css';
import {BookOpenIcon, ClipboardListIcon, HomeIcon, LinkIcon, } from '@heroicons/react/outline'
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
        icon: React.createElement(BookOpenIcon, {className: 'Menu-Item'}),
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
      <nav className="fixed flex justify-center left-0 bg-green-900 w-20 h-screen py-5 pl-2">
          <div>
              <ul className="text-white text-center">
                  {
                      menuItems.map( (item, index) =>
                          <li data-active={item.active} key={index} className="items-center justify-center py-4">
                              {item.icon}
                          </li>
                      )
                  }
                  <li className="flex justify-center pt-7">
                      <h1 className="text-white text-center vertical-rl transform rotate-180">
                          <span className="font-bold">Bergen</span><span className="font-thin">Bibliotek</span>
                      </h1>
                  </li>
              </ul>
          </div>
      </nav>
  )
}

function App() {
  return (
      <Sidebar />
  );
}

export default App;
