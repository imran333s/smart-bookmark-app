
import * as React from "react"
import { cn } from "@/lib/utils"

const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' | 'destructive', size?: 'default' | 'sm' | 'lg' | 'icon' }>(
    ({ className, variant = 'primary', size = 'default', ...props }, ref) => {
        const variants = {
            primary: "bg-[var(--primary)] text-white hover:opacity-90 shadow-lg shadow-purple-500/20",
            secondary: "bg-[var(--secondary)] text-[var(--secondary-foreground)] hover:bg-[var(--muted)] border border-[var(--border)]",
            ghost: "hover:bg-[var(--muted)] text-[var(--foreground)]",
            destructive: "bg-[var(--destructive)] text-white hover:opacity-90"
        }

        const sizes = {
            default: "h-10 px-4 py-2",
            sm: "h-9 rounded-md px-3",
            lg: "h-11 rounded-md px-8",
            icon: "h-10 w-10"
        }

        return (
            <button
                className={cn(
                    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] disabled:pointer-events-none disabled:opacity-50",
                    variants[variant],
                    sizes[size],
                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button }
