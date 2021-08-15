import './App.css';
import {BookOpenIcon, HeartIcon, HomeIcon, LinkIcon, SearchIcon,} from '@heroicons/react/outline'
import React from "react";
import {NavLink, Routes, Route, Link} from "react-router-dom";
import {LoansPage, HomePage, ListsPage, DigitalPage, BookDisplay, SearchResult} from './page.js'

const menuItems = [
    {
        name: "home",
        icon: React.createElement(HomeIcon, {className: 'Menu-Item', alt: 'home'}),
        link: "/"
    },
    {
        name: "loans and orders",
        icon: React.createElement(BookOpenIcon, {className: 'Menu-Item'}),
        link: "/loans"
    },
    {
        name: "lists",
        icon: React.createElement(HeartIcon, {className: 'Menu-Item'}),
        link: "/lists"
    },
    {
        name: "digital content",
        icon: React.createElement(LinkIcon, {className: 'Menu-Item'}),
        link: "/digital"
    },
];

function SideBar() {
  return (
      <nav className="fixed flex justify-center left-0 bg-green-900 w-20 h-screen py-5 pl-2">
          <ul className="text-white text-center">
              {
                  menuItems.map( (item, index) =>
                      <li key={index} className="items-center justify-center py-4">
                          <NavLink end to={item.link} activeClassName="active">{item.icon}</NavLink>
                      </li>
                  )
              }
              <li key="logo" className="flex justify-center pt-7">
                  <h1 className="text-white text-center vertical-rl transform rotate-180">
                      <span className="font-bold">Bergen</span><span className="font-thin">Bibliotek</span>
                  </h1>
              </li>
          </ul>
      </nav>
  )
}

function TopBar() {
    return (
        <section className="TopBar">
            <Search />
            <Personal />
        </section>
    )
}

class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = { query: '' };
    }
    myChangeHandler = (event) => {
        this.setState({query: event.target.value});
    }
    render() {
        return (
            <form>
                <div className="flex items-center w-auto lg:w-5/12 mx-6 px-3 py-2 border rounded hover:bg-white focus-within:bg-white">
                    <label htmlFor="search" className="sr-only">Search</label>
                    <input id="search" placeholder="Search library..."
                           type="text" className="bg-transparent w-11/12 ring-0" onChange={this.myChangeHandler}/>
                    <Link to={`/search/` + this.state.query} className="w-1/12 h-full hover:text-green-800 text-gray-500">
                        <button type="submit" className="w-full"><SearchIcon /></button>
                    </Link>
                </div>
            </form>
        );
    }
}

function Personal() {
    return (
        <></>
    )
}

function App() {
  return (
      <>
          <SideBar />
          <TopBar />
          <section className="Content">
              <Routes>
                  <Route path="/" >
                      <HomePage/>
                  </Route>
                  <Route path="/loans" >
                      <LoansPage/>
                  </Route>
                  <Route path="/lists" >
                      <ListsPage/>
                  </Route>
                  <Route path="/digital" >
                      <DigitalPage/>
                  </Route>
                  <Route path="/book/:id">
                      <BookDisplay/>
                  </Route>
                  <Route path="/search/:query">
                      <SearchResult/>
                  </Route>
              </Routes>
          </section>
      </>
  );
}

export default App;
