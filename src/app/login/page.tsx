
'use client'

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Chrome } from 'lucide-react'
import { useState } from 'react'

export default function LoginPage() {
    const [loading, setLoading] = useState(false)

    const handleLogin = async () => {
        setLoading(true)
        const supabase = createClient()
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${location.origin}/auth/callback`,
            },
        })
        if (error) {
            console.error(error)
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-purple-600/20 blur-[100px]" />
                <div className="absolute top-[30%] -right-[10%] w-[40%] h-[40%] rounded-full bg-blue-500/20 blur-[100px]" />
                <div className="absolute -bottom-[10%] left-[20%] w-[60%] h-[60%] rounded-full bg-pink-500/20 blur-[100px]" />
            </div>

            <div className="w-full max-w-md animate-in">
                <Card className="border-slate-800 bg-slate-900/50 backdrop-blur-xl">
                    <CardHeader className="text-center space-y-2">
                        <div className="mx-auto w-12 h-12 bg-gradient-to-tr from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20 mb-4">
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                className="w-6 h-6 text-white"
                            >
                                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                            </svg>
                        </div>
                        <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                            Smart Bookmarks
                        </CardTitle>
                        <p className="text-slate-400 text-sm">
                            Your personal bookmark manager across devices.
                        </p>
                    </CardHeader>
                    <CardContent>
                        <Button
                            onClick={handleLogin}
                            className="w-full h-12 text-base font-medium transition-all hover:scale-[1.02]"
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                            ) : (
                                <Chrome className="w-5 h-5 mr-2" />
                            )}
                            Continue with Google
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
