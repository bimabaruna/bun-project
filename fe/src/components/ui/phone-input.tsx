import * as React from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export interface PhoneInputProps
  extends Omit<React.ComponentProps<"input">, "type"> {
  countryCode?: string
}

const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ className, countryCode = "+62", value, onChange, ...props }, ref) => {
    const [inputValue, setInputValue] = React.useState(value?.toString() || "")

    React.useEffect(() => {
      setInputValue(value?.toString() || "")
    }, [value])

    const formatPhoneNumber = (input: string) => {
      // Remove all non-numeric characters
      const numbers = input.replace(/\D/g, "")
      
      // Format as: +62 XXX-XXXX-XXXX
      if (numbers.length <= 3) return numbers
      if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`
      if (numbers.length <= 11) return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7)}`
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target.value
      const formatted = formatPhoneNumber(input)
      setInputValue(formatted)
      
      // Call the original onChange with the raw numbers
      if (onChange) {
        const rawValue = input.replace(/\D/g, "")
        const syntheticEvent = {
          ...e,
          target: {
            ...e.target,
            value: rawValue
          }
        }
        onChange(syntheticEvent as React.ChangeEvent<HTMLInputElement>)
      }
    }

    return (
      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none">
          {countryCode}
        </div>
        <Input
          type="tel"
          className={cn("pl-12", className)}
          value={inputValue}
          onChange={handleInputChange}
          placeholder="812-3456-7890"
          ref={ref}
          {...props}
        />
      </div>
    )
  }
)

PhoneInput.displayName = "PhoneInput"

export { PhoneInput }