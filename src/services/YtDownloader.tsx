import { useState } from 'react'

export const YTDownloader = () => {
    const [url, setUrl] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const API_URL = 'https://co.wuk.sh/api/json'

    const getVideoId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
        const match = url.match(regExp)
        return match && match[2].length === 11 ? match[2] : null
    }

    const handleDownload = async () => {
        try {
            setLoading(true)
            setError('')

            const videoId = getVideoId(url)
            window.open(`https://projectlounge.pw/ytdl/download?url=${url}`, '_blank')

        } catch (err) {
            setError('Download failed. Try another video.')
            console.error('Download error:', err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste YouTube URL"
            />
            <button
                onClick={handleDownload}
                disabled={loading}
            >
                {loading ? 'Getting video...' : 'Download'}
            </button>
            {error && <p style={{color: 'red'}}>{error}</p>}
        </div>
    )
}

export default YTDownloader