"use client"

import * as React from "react"
import { Check, ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

const fruits = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "blueberry", label: "Blueberry" },
  { value: "grapes", label: "Grapes" },
  { value: "pineapple", label: "Pineapple" },
]

export function SelectDemo() {
  const [open, setOpen] = React.useState(false)
  const [selectedValues, setSelectedValues] = React.useState<string[]>([])

  const selectedLabels = selectedValues.map((value) => {
    const fruit = fruits.find((fruit) => fruit.value === value)
    return fruit?.label || value
  })

  const handleSelect = (value: string) => {
    setSelectedValues((current) => {
      if (current.includes(value)) {
        return current.filter((v) => v !== value)
      } else {
        return [...current, value]
      }
    })
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-[180px] justify-between">
          {selectedValues.length > 0 ? <span className="truncate">{selectedLabels.join(", ")}</span> : "Select fruits"}
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[180px] p-0">
        <Command>
          <CommandList>
            <CommandEmpty>No fruit found.</CommandEmpty>
            <CommandGroup>
              {fruits.map((fruit) => (
                <CommandItem key={fruit.value} value={fruit.value} onSelect={() => handleSelect(fruit.value)}>
                  <Check
                    className={cn("mr-2 h-4 w-4", selectedValues.includes(fruit.value) ? "opacity-100" : "opacity-0")}
                  />
                  {fruit.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

