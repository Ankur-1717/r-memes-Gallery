// pages/index.js
import { useEffect, useState } from 'react'
import axios from 'axios'
import Gallery from '../components/Gallery'
import './index.css'

const Home = () => {
  const [memes, setMemes] = useState([])
  const [loading, setLoading] = useState(false)
  const [noMoreContent, setNoMoreContent] = useState(false)
  const [selectedMeme, setSelectedMeme] = useState(null)
  const [maxScroll, setMaxScrollPls] = useState(999)


  let after = null;
  let scrollamt = 0
  let moreFetched = false


  const fetchMoreMemes = async () => {
    setLoading(true)
    try {
      const response = await axios.get(
        `https://www.reddit.com/r/memes.json?after=${after || ''}`
      )
      console.log('API Response:', response.data)

      const newMemeData = response.data.data.children.map(child => ({
        id: child.data.id,
        title: child.data.title,
        thumbnail: child.data.thumbnail,
        url: child.data.url,
        upvotes: child.data.ups,
        downvotes: child.data.downs,
        comments: child.data.num_comments,
        post_hint: child.data.post_hint
      }))

      after = response.data.data.after; 

      if (newMemeData.length === 0) {
        setNoMoreContent(true)
      } else {
        setMemes(prevMemes => [...prevMemes, ...newMemeData])
      }
      moreFetched = false
      setLoading(false)
    } catch (error) {
      console.error('Error fetching memes:', error)
      moreFetched = false
      setLoading(false)
    }
  }

  const openMemeDialog = meme => {
    setSelectedMeme(meme)
  }

  const closeMemeDialog = () => {
    setSelectedMeme(null)
  }

  const handleScroll = async () => {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement
    if (!loading) {
      scrollamt = Math.max(
        scrollamt,
        scrollTop + clientHeight - scrollHeight + 100
      )
    }
    if (scrollamt > 0 && !noMoreContent && !moreFetched) {
      scrollamt = -1 * clientHeight
      moreFetched = true
      console.log(scrollamt)
      await fetchMoreMemes()
    }
  }

  useEffect(async () => {
    let isMounted = true 

    const fetchMemes = async () => {
      try {
        setLoading(true)

        const response = await axios.get(
          `https://www.reddit.com/r/memes.json?after=${after || ''}`
        )
        console.log('API Response:', response.data)

        if (isMounted) {
          const newMemeData = response.data.data.children.map(child => ({
            id: child.data.id,
            title: child.data.title,
            thumbnail: child.data.thumbnail,
            url: child.data.url,
            upvotes: child.data.ups,
            downvotes: child.data.downs,
            comments: child.data.num_comments,
            post_hint: child.data.post_hint
          }))

          after = response.data.data.after;

          if (newMemeData.length === 0) {
            setNoMoreContent(true)
          } else {
            setMemes(prevMemes => [...prevMemes, ...newMemeData])
          }

          setLoading(false)
        }
      } catch (error) {
        console.error('Error fetching memes:', error)
        if (isMounted) {
          setLoading(false)
        }
      }
    }
    setMaxScrollPls(window.innerHeight, () => {
      console.log(maxScroll)
    })
    window.addEventListener('scroll', handleScroll)
    

    if (!noMoreContent && memes.length === 0) {
      fetchMemes()
    }

    
    return () => {
    }
  }, [])

  return (
    <div className='container'>

      <div className='app-bar'>
        <h1>Reddit r/memes Gallery</h1>
      </div>

      <div className='content'>
        <Gallery memes={memes} onMemeClick={openMemeDialog} />
      </div>

      {noMoreContent && <p>No more content</p>}

      {selectedMeme && (
        <div className='meme-dialog'>
          <div className='dialog-content'>
            <img src={selectedMeme.url} alt={selectedMeme.title} />
            <div className='details'>
              <h2>{selectedMeme.title}</h2>
              <p>{`Upvotes ${selectedMeme.upvotes} | Comments ${selectedMeme.comments}`}</p>
            </div>
            <button onClick={closeMemeDialog}>Close</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home