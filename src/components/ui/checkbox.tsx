import * as React from "react"

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  onCheckedChange?: (checked: boolean) => void
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className = '', onCheckedChange, checked, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onCheckedChange?.(e.target.checked)
      props.onChange?.(e)
    }
    
    return (
      <input
        type="checkbox"
        className={`h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 ${className}`.trim()}
        ref={ref}
        checked={checked}
        onChange={handleChange}
        {...props}
      />
    )
  }
)
Checkbox.displayName = "Checkbox"

export { Checkbox }
