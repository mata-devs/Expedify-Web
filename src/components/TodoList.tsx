import { useEffect, useState } from 'react'
import { db } from '../firebase'
import {
  collection, addDoc, serverTimestamp, onSnapshot,
  query, orderBy, doc, deleteDoc, updateDoc
} from 'firebase/firestore'

type Todo = { id: string; text: string; done: boolean; createdAt?: any }

export default function TodoList({ uid }: { uid: string }) {
  const [todos, setTodos] = useState<Todo[]>([])
  const [text, setText] = useState('')

  useEffect(() => {
    const q = query(
      collection(db, 'users', uid, 'todos'),
      orderBy('createdAt', 'desc')
    )
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }))
      setTodos(data)
    })
    return () => unsub()
  }, [uid])

  const add = async () => {
    const t = text.trim()
    if (!t) return
    await addDoc(collection(db, 'users', uid, 'todos'), {
      text: t,
      done: false,
      createdAt: serverTimestamp(),
    })
    setText('')
  }

  const toggle = async (id: string, done: boolean) => {
    await updateDoc(doc(db, 'users', uid, 'todos', id), { done: !done })
  }

  const remove = async (id: string) => {
    await deleteDoc(doc(db, 'users', uid, 'todos', id))
  }

  return (
    <>
      <div className="row">
        <input placeholder="Add a todo…" value={text} onChange={e=>setText(e.target.value)} onKeyDown={(e)=> e.key==='Enter' && add()} />
        <button className="btn" onClick={add}>Add</button>
      </div>
      <ul className="list">
        {todos.map(t => (
          <li key={t.id} className="list-item">
            <label className="checkbox">
              <input type="checkbox" checked={!!t.done} onChange={() => toggle(t.id, !!t.done)} />
              <span className={t.done ? 'strike' : ''}>{t.text}</span>
            </label>
            <button className="btn danger small" onClick={() => remove(t.id)}>Delete</button>
          </li>
        ))}
        {todos.length === 0 && <li className="muted">No todos yet.</li>}
      </ul>
    </>
  )
}
