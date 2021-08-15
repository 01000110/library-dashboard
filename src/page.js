import React, {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {ChevronDoubleRightIcon, ExternalLinkIcon, HeartIcon} from "@heroicons/react/outline";
import {HeartIcon as FullHeartIcon} from "@heroicons/react/solid";

function BookItem(props) {
    const borrowed = [{id: 'fXFfDwAAQBAJ', due: '2021-09-20'}, {id: 'yHTLngEACAAJ', due: '2021-10-08'}]

    function Button() {
        return (
            !borrowed.filter(book => (book.id === props.id)).length
                ?<button
                    className="mb-2 md:mb-0 bg-gray-900 px-5 py-2 shadow-sm tracking-wider text-white rounded-full cursor-not-allowed"
                    type="button" disabled={true}>Returned on {props.date}</button>
                :<>
                    <p className="text-green-700">due date: {borrowed.filter(book => (book.id === props.id))[0].due}</p>
                    <button
                        className="mb-2 md:mb-0 bg-green-900 px-5 py-2 shadow-sm tracking-wider text-white rounded-full hover:bg-gray-800"
                        type="button">Renew
                    </button>
                </>
        )
    }

    return (
        <div className="flex items-stretch mx-auto lg:mx-0 break-all">
            <Link to={`/book/`+props.id}
                className="bg-white shadow-lg border-gray-100 border sm:rounded-3xl p-8 non-flex sm:flex sm:space-x-8 w-full">
                <div className="h-48 md:w-1/4 sm:w-1/3 w-full">
                    <img className="rounded shadow-lg h-48 object-cover mx-auto"
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
                        props.button ? <Button/> : <></>
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
                            <button className="flex-shrink-0 text-green-900 w-12 h-12  hover:text-gray-800" type="button"
                            onClick={() => updateList({id: data.id})}>
                                {
                                    list.includes(data.id) ? <FullHeartIcon className="h-12"/> : <HeartIcon className="h-12"/>
                                }
                            </button>
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
                <div className="lg:grid lg:grid-cols-2 space-y-4 lg:space-y-0 lg:gap-4 lg:items-stretch lg:flex">
                {
                    data.items.map(item => {
                        return (
                            <BookItem key={item.id}
                                id={item.id}
                                type={item.volumeInfo.printType ? item.volumeInfo.printType : ''}
                                title={item.volumeInfo.title ? item.volumeInfo.title : ''}
                                cover={item.volumeInfo?.imageLinks ? item.volumeInfo.imageLinks.thumbnail : 'https://books.google.no/googlebooks/images/no_cover_thumb.gif'}
                                authors={item.volumeInfo.authors ? item.volumeInfo.authors : ['']}
                                date={item.volumeInfo.publishedDate ? item.volumeInfo.publishedDate : ''}
                                button={true}
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
        <>
            <header>Digital Resources</header>
            <ul>
                <li className="hover:text-green-800 py-3"><ExternalLinkIcon className="h-5 mr-3 inline-block justify-self-center text-green-700"/><a href="https://www.pressreader.com/catalog/">PressReader</a></li>
                <li className="hover:text-green-800 py-3"><ExternalLinkIcon className="h-5 mr-3 inline-block justify-self-center text-green-700"/><a href="http://bergen.naxosmusiclibrary.com/">Naxos Music Library</a></li>
                <li className="hover:text-green-800 py-3"><ExternalLinkIcon className="h-5 mr-3 inline-block justify-self-center text-green-700"/><a href="https://www.nb.no/search">NB.no: Nettbiblioteket</a></li>
                <li className="hover:text-green-800 py-3"><ExternalLinkIcon className="h-5 mr-3 inline-block justify-self-center text-green-700"/><a href="https://www.bibsent.no/bibliotekprodukter/bookbites">Bookbites (e-book reader)</a></li>
                <li className="hover:text-green-800 py-3"><ExternalLinkIcon className="h-5 mr-3 inline-block justify-self-center text-green-700"/><a href="https://filmbib.dspree.com/">Filmbib</a></li>
                <li className="hover:text-green-800 py-3"><ExternalLinkIcon className="h-5 mr-3 inline-block justify-self-center text-green-700"/><a href="https://filmoteket.no/">filmoteket.no</a></li>
            </ul>
        </>
    )
}

export function ListsPage() {
    if (!localStorage.getItem('list')) {
        localStorage.setItem('list', 'QOX5zQEACAAJ')
    }
    const list = localStorage.getItem('list')?.split(',');

    const [result, setResult] = useState([]);
    useEffect(()=>{
        if (list)
        {
            Promise.all(
                list.map(id => {
                    return (fetch(`https://www.googleapis.com/books/v1/volumes/${id}`))
                })
            ).then(function (responses) {
                // Get a JSON object from each of the responses
                return Promise.all(responses.map(function (response) {
                    return response.json();
                }));
            }).then(function (data) {
                // Log the data to the console
                // You would do something with both sets of data here
                setResult(data)
            }).catch(function (error) {
                // if there's an error, log it
                console.log('ERR: ' + error);
            });
        }
    },[])
    console.log(result)
    return (
        <>
            <header>Your Favorite List</header>
            {
                result.length > 0 ?
                    <div className="lg:grid lg:grid-cols-2 space-y-4 lg:space-y-0 lg:gap-4 lg:items-stretch lg:flex">
                        {
                            result.map(item => {
                                if (item.hasOwnProperty('error')) {
                                    return null;
                                }
                                else {
                                    return (
                                        <BookItem key={item.id}
                                                  id={item.id}
                                                  type={item.volumeInfo.printType ? item.volumeInfo.printType : ''}
                                                  title={item.volumeInfo.title ? item.volumeInfo.title : ''}
                                                  cover={item.volumeInfo?.imageLinks ? item.volumeInfo.imageLinks.thumbnail : 'https://books.google.no/googlebooks/images/no_cover_thumb.gif'}
                                                  authors={item.volumeInfo.authors ? item.volumeInfo.authors : ['']}
                                                  date={item.volumeInfo.publishedDate ? item.volumeInfo.publishedDate : ''}
                                                  button={false}
                                        />
                                    )
                                }
                            })
                        }
                    </div>
                    : <p>...</p>
            }

        </>
    )
}

export function SearchResult() {
    const { query } = useParams();
    const [page, setPage] = useState(0);
    const [data, setData] = useState(null);
    useEffect(() => {
        fetch(`https://www.googleapis.com/books/v1/volumes?q=`+query+
            `&printType=books&maxResults=6&projection=lite&orderBy=relevance&startIndex=`+page*6)
            .then(response => response.json())
            .then(setData)
    }, [page, query]);

    if(data) {
        const lastPage = (data.totalItems - 1) / 6;
        return (
            <>
                <header>Search results for: {query}</header>
                <div className="flex justify-center m-2">
                    <button onClick={() => setPage(Math.max(page-1, 0))}
                            className={page > 0
                                ?`mb-2 md:mb-0 px-5 py-2 shadow-sm tracking-wider text-white rounded-full w-28 bg-green-800`
                                :`mb-2 md:mb-0 px-5 py-2 shadow-sm tracking-wider text-white rounded-full w-28 bg-gray-900`}>Previous</button>
                    <button onClick={() => setPage(Math.min(page+1, lastPage))}
                            className={page < lastPage
                                ?`mb-2 md:mb-0 px-5 py-2 shadow-sm tracking-wider text-white rounded-full w-28 bg-green-800`
                                :`mb-2 md:mb-0 px-5 py-2 shadow-sm tracking-wider text-white rounded-full w-28 bg-gray-900`}>Next</button>
                </div>
                <div className="lg:grid lg:grid-cols-2 space-y-4 lg:space-y-0 lg:gap-4 lg:items-stretch lg:flex">
                    {
                        data.items.map(item => {
                            return (
                                <BookItem key={item.id}
                                          id={item.id}
                                          type={item.volumeInfo.printType ? item.volumeInfo.printType : ''}
                                          title={item.volumeInfo.title ? item.volumeInfo.title : ''}
                                          cover={item.volumeInfo?.imageLinks ? item.volumeInfo.imageLinks.thumbnail : 'https://books.google.no/googlebooks/images/no_cover_thumb.gif'}
                                          authors={item.volumeInfo.authors ? item.volumeInfo.authors : ['']}
                                          date={item.volumeInfo.publishedDate ? item.volumeInfo.publishedDate : ''}
                                          button={false}
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