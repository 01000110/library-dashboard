import React, {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {ChevronDoubleRightIcon, HeartIcon} from "@heroicons/react/outline";

function BookItem(props) {
    return (
        <div className="flex items-stretch sm:max-w-xl mx-auto lg:mx-0">
            <Link to={`/book/`+props.id}
                className="bg-white shadow-lg border-gray-100 border sm:rounded-3xl p-8 non-flex sm:flex sm:space-x-8 w-full">
                <div className="h-48 md:w-1/4 sm:w-1/3 w-full">
                    <img className="rounded-3xl shadow-lg h-48 object-contain mx-auto"
                         src={props.cover}
                         alt={props.title+`'s cover`}/>
                </div>
                <div className="flex flex-col md:w-3/4 sm:w-2/3 w-full sm:space-y-4 place-content-between">
                    <div className="flex justify-between items-start">
                        <h2 className="text-3xl font-bold">{props.title}</h2>
                    </div>
                    <div>
                        <div className="text-sm text-gray-400">{props.type}</div>
                        <div className="text-lg text-gray-800">{props.authors.join(', ')}</div>
                    </div>
                    {
                        props.title === 'Do Dice Play God?' | props.title === 'Compilers'
                        ?   <>
                                <p className="text-green-700">due date: 25 Aug 2021</p>
                                <button className="mb-2 md:mb-0 bg-green-900 px-5 py-2 shadow-sm tracking-wider text-white rounded-full hover:bg-gray-800"
                                        type="button">Renew</button>
                            </>
                        :   <button className="mb-2 md:mb-0 bg-gray-900 px-5 py-2 shadow-sm tracking-wider text-white rounded-full cursor-not-allowed"
                                  type="button" disabled={true}>Returned on {props.date}</button>
                    }
                </div>

            </Link>
        </div>
    )
}

export function BookDisplay(props) {
    const [list, setList] = useState(
        localStorage.getItem('list')? localStorage.getItem('list')?.split(',') : []
    )
    useEffect(() => {
        localStorage.setItem('list', list.join(','));
    },[list])
    function updateList(props) {
        if (list.includes(props.id)) {
            const newList = list.filter((item) => item !== props.id);
            setList(newList);
        }
        else {
            const newList = list.concat(props.id);
            setList(newList);
        }
        console.log(list)
    }

    const { id } = useParams();
    const [data, setData] = useState(null);
    useEffect(() => {
        fetch(`https://www.googleapis.com/books/v1/volumes/`+id)
            .then(response => response.json())
            .then(setData)
    }, [id]);
    if (data) {
        return (
            <>
                <div className="bg-white shadow-lg border-gray-100 border sm:rounded-3xl p-8 non-flex sm:flex sm:space-x-8 w-full">
                    <div className="h-48 md:w-1/4 sm:w-1/3 w-full">
                        <img className="rounded-3xl shadow-lg h-48 object-contain mx-auto"
                             src={data.volumeInfo.imageLinks.thumbnail}
                             alt={data.volumeInfo.title+`'s cover`}/>
                    </div>
                    <div className="flex flex-col md:w-3/4 sm:w-2/3 w-full sm:space-y-4 place-content-between">
                        <div className="justify-between items-start">
                            <h2 className="text-3xl font-bold">{data.volumeInfo.title}</h2>
                            <h2 className="text-xl text-gray-700 font-semibold">{data.volumeInfo.subtitle}</h2>
                        </div>
                        <div>
                            <div className="text-sm text-gray-400">
                                {data.volumeInfo.printType + ' | ' + data.volumeInfo.printedPageCount} pages
                            </div>
                            <div className="text-lg text-gray-800">{data.volumeInfo.authors.join(', ')}</div>
                        </div>
                        <div className="flex items-center">
                            <button className="flex-shrink-0 text-green-800 w-12 h-12  hover:text-gray-800" type="button"
                            onClick={() => updateList({id: data.id})}><HeartIcon className="h-12"/></button>
                            {
                            data.volumeInfo.title !== 'Do Dice Play God?' && data.volumeInfo.title !== 'Compilers'
                                ?   <button className="flex-1 ml-2 mb-2 md:mb-0 bg-green-900 px-5 py-2 shadow-sm tracking-wider text-white rounded-full hover:bg-gray-800"
                                                type="button">Request this <span className="lowercase">{data.volumeInfo.printType}</span></button>
                                :   <button className="flex-1 mb-2 md:mb-0 bg-gray-900 px-5 py-2 shadow-sm tracking-wider text-white rounded-full cursor-not-allowed"
                                            type="button" disabled={true}>You already have this one</button>
                            }
                        </div>
                        {
                            data.volumeInfo.categories ? <div className="text-md text-gray-700 whitespace-pre-wrap">{data.volumeInfo.categories.join(`\n`)}</div> : null
                        }

                    </div>
                </div>
                <div className="bg-white shadow-lg border-gray-100 border sm:rounded-3xl p-8 w-full">
                    <p className="text-green-700">Description:</p>
                    <div dangerouslySetInnerHTML={{__html: data.volumeInfo.description}} />
                    <hr className="my-5" />
                    <p><span className="text-green-700">Publisher:</span> {data.volumeInfo.publisher}</p>
                    <p><span className="text-green-700">Publication date:</span> {data.volumeInfo.publishedDate}</p>
                </div>
            </>
        )
    }
    else {
        return (<p>loading...</p>)
    }
}

function BookRow(props) {
    const ApiUrl =`https://www.googleapis.com/books/v1/users/105889888655647378716/bookshelves/${props.shelfId}/volumes`;
    const [data, setData] = useState(null);
    useEffect(() => {
        fetch(ApiUrl)
            .then(response => response.json())
            .then(setData)
    },[ApiUrl])

    function BookRowItem(props) {
        return (
            <Link to={'/book/'+props.id} className="group p-3 hover:bg-gray-50">
                <img className="hidden md:block md:visible max-h-48 object-contain mx-auto"
                     src={props.book.imageLinks.smallThumbnail} alt={`cover of ` + props.book.title + ` by ` + props.book.authors[0]}/>
                <p className="font-black pt-2 group-hover:text-green-700">
                    <span className="md:hidden"><ChevronDoubleRightIcon className="h-5 inline-block justify-self-center text-green-700"/></span>
                    {props.book.title}</p>
                <p className="font-normal group-hover:text-gray-700">{props.book.authors.join(', ')}</p>
            </Link>
        )
    }

    if (data) {
        return (
            <>
                <h1 className="text-green-900 font-black mt-5">{props.shelfName}</h1>
                <div className="bg-white shadow-lg border-gray-100 border rounded-xl w-full px-3 py-5 grid grid-cols-1 md:grid-cols-5 place-content-stretch md:divide-x divide-gray-100">
                    {
                        data.items.map(item => {
                            return (<BookRowItem key={item.id} book={item.volumeInfo} id={item.id}/>)
                        })
                    }
                </div>
            </>
        )
    }
    else {
        return (
            <p>Loading...</p>
        )
    }
}

export function LoansPage() {
    const [data, setData] = useState(null);
    useEffect(() => {
        fetch(`https://www.googleapis.com/books/v1/users/105889888655647378716/bookshelves/1001/volumes`)
            .then(response => response.json())
            .then(setData)
    }, []);

    if(data) {
        return (
            <>
                <header>Your Loans</header>
                <div className="lg:grid lg:grid-cols-2 space-y-4 lg:gap-4 lg:items-stretch lg:flex">
                {
                    data.items.map(item => {
                        return (
                            <BookItem key={item.id}
                                id={item.id}
                                type={item.volumeInfo.printType}
                                title={item.volumeInfo.title}
                                cover={item.volumeInfo.imageLinks.thumbnail}
                                authors={item.volumeInfo.authors}
                                date={item.volumeInfo.publishedDate}
                            />
                        )
                    })
                }
                </div>
            </>
        )
    }
    else {
        return (
            <p>Loading...</p>
        )
    }
}

export function HomePage() {
    return (
       <>
           <header>Home</header>
           <BookRow shelfId="1002" shelfName="Popular Fiction"/>
           <BookRow shelfId="1003" shelfName="Popular Non-Fiction"/>
           <BookRow shelfId="1004" shelfName="Popular Children's"/>
       </>
    )
}

export function DigitalPage() {
    return (
        <p>Digital</p>
    )
}

export function ListsPage() {
    const [list, setList] = useState(
        [localStorage.getItem('list')? localStorage.getItem('list')?.split(',') : null]
    )
    useEffect(() => {
        localStorage.setItem('list', list.join(','));
        console.log(list);
    },[list])
    function updateList(props) {
        if (list.includes(props.id)) {
            const newList = list.filter((item) => item !== props.id);
            setList(newList);
        }
        else {
            const newList = [...list, props.id,];
            setList(newList);
        }
    }
    return (
        <button onClick={() => updateList({id: 'xcL3DwAAQBAJ'})}>add</button>
    )
}

