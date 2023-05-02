// Importing React useState and useEffect hooks
import { useState, useEffect } from 'react';

const App = () => {
    const [value, setValue ] = useState(null)
    const [message, setMessage] = useState(null)
    const [previousChats, setPreviousChats] = useState([])
    const [currentTitle, setCurrentTitle] = useState(null)

    const createNewChat = () => {
        setMessage(null)
        setValue("")
        setCurrentTitle(null)
    }

    const handleClick = (uniqueTitle) => {
        setCurrentTitle(uniqueTitle)
        setMessage(null)
        setValue("")
    }

    // How to get the messages from the API
    const getMessages = async () => {
        const options = {
            method: 'POST',
            body : JSON.stringify({
                message: value
            }),
            headers: {
                "Content-Type": "application/json"
            }
        }
        try {
            const response = await fetch ('http://localhost:8000/completions', options)
            const data = await response.json()
            setMessage(data.choices[0].message)
        } catch (error) {
            console.error(error)
        }
    }

    // How to update the messages
    useEffect(() => {
        console.log(currentTitle, value, message)
        if (!currentTitle && value && message) {
            setCurrentTitle(value)
        }
        if (currentTitle && value && message) {
            setPreviousChats(prevChats => (
                [...prevChats, 
                    {
                        title: currentTitle,
                        role: "user",
                        content: value
                    }, 
                    {
                        title: currentTitle,
                        role: message.role,
                        content: message.content
                    }
                ]
            ))
        }
    }, [message, currentTitle])

    console.log(previousChats)

    const currentChat = previousChats.filter(previousChats => previousChats.title === currentTitle)
    const uniqueTitles = Array.from(new Set(previousChats.map(previousChats => previousChats.title)))
    console.log(uniqueTitles)
    

    // Interface for the app
    return (
        <div className="app">
            <section className="side-bar">
                <button onClick={createNewChat}>+ New chat</button>
                <ul className="history">
                    {uniqueTitles?.map((uniqueTitle, index) => <li key={index} onClick={() => handleClick(uniqueTitle)}>{uniqueTitle}</li>)}
                </ul>
                <nav>
                    <p className="signature">Made by .tuned</p>
                </nav>
            </section>
            <section className="main">
                {!currentTitle && <h1 className='title'>CharlesGPT</h1>}
                <ul className="feed">
                    {currentChat?.map((chatMessage, index) => <li key={index}>
                        <p className="role">{chatMessage.role}</p>
                        <p>{chatMessage.content}</p>
                    </li>)}
                </ul>
                <div className="bottom-section">
                    <div className="input-container">
                        <input value={value} onChange={(e) => setValue(e.target.value)}/>
                        <div id="submit" onClick={getMessages}>&#10146;</div>
                    </div>
                    <span className="info">
                        Free Research review. ChatGPT may produce inaccurate information about people, places, or facts.&#160;
                        <a href="https://help.openai.com/en/articles/6825453-chatgpt-release-notes" target="_blank" rel="noreferrer">
                            ChatGPT Mar 23 Version
                        </a>
                    </span>
                </div>
            </section>
        </div>
    );
}

export default App;