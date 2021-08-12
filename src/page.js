import {useEffect, useState} from "react";

function BookItem(props) {
    return (
        <div className="flex items-stretch sm:max-w-xl mx-auto lg:mx-0">
            <div className="bg-white shadow-lg border-gray-100 border sm:rounded-3xl p-8 non-flex sm:flex sm:space-x-8 w-full">
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
                                  type="button" disabled="true">Returned on {props.date}</button>
                    }
                </div>

            </div>
        </div>
    )
}

export function LoansPage() {
    const [data, setData] = useState(null);
    useEffect(() => {
        fetch(`https://www.googleapis.com/books/v1/users/105889888655647378716/bookshelves/1001/volumes`)
            .then(response => response.json())
            .then(setData)
    }, []);

    console.log(data)
    if(data) {
        return (
            <>
                <header>Your Loans</header>
                <div className="lg:grid lg:grid-cols-2 space-y-4 lg:gap-4 lg:items-stretch lg:flex">
                {
                    data.items.map(item => {
                        return (
                            <BookItem
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
        <p>Home</p>
    )
}

export function DigitalPage() {
    return (
        <p>Digital</p>
    )
}

export function ListsPage() {
    return (
        <p>Lists</p>
    )
}

