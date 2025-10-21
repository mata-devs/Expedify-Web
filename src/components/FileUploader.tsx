import { useEffect, useState } from 'react'
import { storage } from '../firebase'
import { ref, uploadBytes, getDownloadURL, listAll } from 'firebase/storage'

export default function FileUploader({ uid }: { uid: string }) {
  const [file, setFile] = useState<File | null>(null)
  const [items, setItems] = useState<string[]>([])
  const baseRef = ref(storage, `users/${uid}/uploads`)

  const refresh = async () => {
    const res = await listAll(baseRef)
    const urls = await Promise.all(res.items.map(getDownloadURL))
    setItems(urls)
  }

  useEffect(() => {
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid])

  const upload = async () => {
    if (!file) return
    const objectRef = ref(storage, `users/${uid}/uploads/${Date.now()}-${file.name}`)
    await uploadBytes(objectRef, file)
    setFile(null)
    await refresh()
  }

  return (
    <>
      <div className="row">
        <input type="file" onChange={e=>setFile(e.target.files?.[0] ?? null)} />
        <button className="btn" onClick={upload} disabled={!file}>Upload</button>
      </div>
      <div className="grid">
        {items.map(u => (
          <a className="thumb" key={u} href={u} target="_blank" rel="noreferrer">
            <img src={u} alt="uploaded" />
          </a>
        ))}
        {items.length === 0 && <p className="muted">No files yet.</p>}
      </div>
    </>
  )
}
