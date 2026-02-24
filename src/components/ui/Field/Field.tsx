import * as React from "react"
import { cn } from "@/lib/utils"

export type FieldProps = React.HTMLAttributes<HTMLDivElement> & {
    required?: boolean
}

const FieldRoot = React.forwardRef<HTMLDivElement, FieldProps>(
    ({ className, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn("flex flex-col gap-1.5", className)}
                {...props}
            />
        )
    }
)
FieldRoot.displayName = "FieldRoot"

export type FieldLabelProps =
    React.LabelHTMLAttributes<HTMLLabelElement> & {
    required?: boolean
}

const FieldLabel = React.forwardRef<HTMLLabelElement, FieldLabelProps>(
    ({ className, children, required, ...props }, ref) => {
        return (
            <label
                ref={ref}
                className={cn(
                    "text-sm font-medium text-slate-900",
                    className
                )}
                {...props}
            >
                {children}
                {required && (
                    <span className="ml-1 text-red-500">*</span>
                )}
            </label>
        )
    }
)
FieldLabel.displayName = "FieldLabel"

export type FieldInputProps =
    React.InputHTMLAttributes<HTMLInputElement>

const FieldInput = React.forwardRef<
    HTMLInputElement,
    FieldInputProps
>(({ className, ...props }, ref) => {
    return (
        <input
            ref={ref}
            className={cn(
                "flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm",
                "placeholder:text-slate-400",
                "focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2",
                "disabled:cursor-not-allowed disabled:opacity-50",
                className
            )}
            {...props}
        />
    )
})
FieldInput.displayName = "FieldInput"

export type FieldErrorProps =
    React.HTMLAttributes<HTMLParagraphElement> & {
    message?: string
}

const FieldError = React.forwardRef<
    HTMLParagraphElement,
    FieldErrorProps
>(({ className, message, ...props }, ref) => {
    if (!message) return null

    return (
        <p
            ref={ref}
            className={cn(
                "text-sm text-red-600",
                className
            )}
            {...props}
        >
            {message}
        </p>
    )
})
FieldError.displayName = "FieldError"


export const Field = Object.assign(FieldRoot, {
    Root: FieldRoot,
    Label: FieldLabel,
    Input: FieldInput,
    Error: FieldError,
})