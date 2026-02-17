
'use client'

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Plus, Trash2, LogOut, ExternalLink, Globe } from 'lucide-react'
import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'

type Bookmark = {
    id: string
    title: string
    url: string
    created_at: string
}

export default function Dashboard() {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
    const [title, setTitle] = useState('')
    const [url, setUrl] = useState('')
    const [loading, setLoading] = useState(true)
    const [adding, setAdding] = useState(false)
    const router = useRouter()
    const [supabase] = useState(() => createClient())

    const fetchBookmarks = useCallback(async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            router.push('/login')
            return
        }

        const { data, error } = await supabase
            .from('bookmarks')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) console.error('Error fetching bookmarks:', error)
        else setBookmarks(data || [])
        setLoading(false)
    }, [supabase, router])

    useEffect(() => {
        fetchBookmarks()

        const channel = supabase
            .channel('realtime bookmarks')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'bookmarks'
            }, (payload) => {
                if (payload.eventType === 'INSERT') {
                    setBookmarks((prev) => {
                        // Avoid duplicates if optimistic update already ran
                        if (prev.some(b => b.id === payload.new.id)) return prev
                        return [payload.new as Bookmark, ...prev]
                    })
                } else if (payload.eventType === 'DELETE') {
                    setBookmarks((prev) => prev.filter((b) => b.id !== payload.old.id))
                } else if (payload.eventType === 'UPDATE') {
                    setBookmarks((prev) => prev.map((b) => (b.id === payload.new.id ? (payload.new as Bookmark) : b)))
                }
            })
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [supabase, fetchBookmarks])

    const addBookmark = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!title || !url) return

        setAdding(true)
        const { data: { user } } = await supabase.auth.getUser()

        if (user) {
            const { data, error } = await supabase.from('bookmarks').insert([
                { title, url, user_id: user.id }
            ]).select().single()

            if (error) {
                alert('Error adding bookmark')
                console.error(error)
            } else if (data) {
                // Optimistic Update: Add to list immediately
                setBookmarks((prev) => {
                    if (prev.some(b => b.id === data.id)) return prev
                    return [data as Bookmark, ...prev]
                })
                setTitle('')
                setUrl('')
            }
        }
        setAdding(false)
    }

    const deleteBookmark = async (id: string) => {
        // Optimistic Update: Remove from list immediately
        setBookmarks((prev) => prev.filter((b) => b.id !== id))

        const { error } = await supabase.from('bookmarks').delete().eq('id', id)
        if (error) {
            alert('Error deleting bookmark')
            console.error(error)
            // Rollback on error
            fetchBookmarks()
        }
    }

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.refresh()
        router.push('/login')
    }

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-100 selection:bg-purple-500/30">
            {/* Navbar */}
            <nav className="sticky top-0 z-50 border-b border-slate-800 bg-[#0f172a]/80 backdrop-blur-xl">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-tr from-purple-500 to-blue-500 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/20">
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                className="w-4 h-4 text-white"
                            >
                                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                            </svg>
                        </div>
                        <span className="font-bold text-lg hidden sm:inline-block">Smart Bookmarks</span>
                    </div>
                    <Button variant="ghost" onClick={handleLogout} className="text-slate-400 hover:text-white">
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign out
                    </Button>
                </div>
            </nav>

            <main className="container mx-auto px-4 py-8 max-w-5xl">
                {/* Add Bookmark Section */}
                <div className="mb-12">
                    <Card className="border-slate-800 bg-slate-900/50 backdrop-blur-xl overflow-hidden relative">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 opacity-50" />
                        <CardContent className="pt-6">
                            <form onSubmit={addBookmark} className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1">
                                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">Title</label>
                                    <Input
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="e.g. My Portfolio"
                                        className="bg-slate-950/50 border-slate-800 focus:border-purple-500/50 transition-colors"
                                    />
                                </div>
                                <div className="flex-[2]">
                                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">URL</label>
                                    <div className="flex gap-4">
                                        <Input
                                            value={url}
                                            onChange={(e) => setUrl(e.target.value)}
                                            placeholder="https://example.com"
                                            className="bg-slate-950/50 border-slate-800 focus:border-purple-500/50 transition-colors"
                                        />
                                        <Button type="submit" disabled={adding || !title || !url} className="px-8 bg-purple-600 hover:bg-purple-700">
                                            {adding ? (
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            ) : (
                                                <>
                                                    <Plus className="w-4 h-4 mr-2" />
                                                    Add
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                {/* Bookmarks Grid */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-slate-200 flex items-center gap-2">
                        Your Collection
                        <span className="text-xs font-normal text-slate-500 bg-slate-800/50 px-2 py-0.5 rounded-full border border-slate-800">
                            {bookmarks.length}
                        </span>
                    </h2>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-32 rounded-xl bg-slate-800/30 animate-pulse border border-slate-800" />
                            ))}
                        </div>
                    ) : bookmarks.length === 0 ? (
                        <div className="text-center py-20 border border-dashed border-slate-800 rounded-xl bg-slate-900/20">
                            <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Globe className="w-8 h-8 text-slate-600" />
                            </div>
                            <h3 className="text-lg font-medium text-slate-300">No bookmarks yet</h3>
                            <p className="text-slate-500">Add your first bookmark to get started.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <AnimatePresence mode="popLayout">
                                {bookmarks.map((bookmark) => (
                                    <motion.div
                                        key={bookmark.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Card className="group hover:border-purple-500/30 hover:bg-slate-800/40 transition-all duration-300 h-full flex flex-col justify-between relative overflow-hidden">
                                            <CardContent className="pt-6">
                                                <div className="flex items-start justify-between gap-4 mb-2">
                                                    <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700/50 group-hover:border-purple-500/30 transition-colors">
                                                        <Globe className="w-5 h-5 text-slate-400 group-hover:text-purple-400 transition-colors" />
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => deleteBookmark(bookmark.id)}
                                                        className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 hover:bg-red-950/30 -mt-2 -mr-2 transition-all p-2 h-8 w-8 rounded-full"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>

                                                <h3 className="font-medium text-lg text-slate-200 mb-1 line-clamp-1 group-hover:text-purple-400 transition-colors">
                                                    {bookmark.title}
                                                </h3>
                                                <p className="text-xs text-slate-500 font-mono truncate mb-4 bg-slate-950/30 p-1.5 rounded border border-slate-800/50">
                                                    {bookmark.url}
                                                </p>

                                                <a
                                                    href={bookmark.url.startsWith('http') ? bookmark.url : `https://${bookmark.url}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center text-xs font-medium text-slate-400 hover:text-white transition-colors mt-auto group/link"
                                                >
                                                    Visit Website
                                                    <ExternalLink className="w-3 h-3 ml-1 opacity-0 -translate-x-1 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all" />
                                                </a>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
