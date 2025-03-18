"use client";

import * as React from "react";
import { Check, ChevronDown } from "lucide-react";

import { cn } from "@/utils/common-utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export type Category = {
  id: string;
  name: string;
};

interface MultiSelectProps {
  options: Category[];
  placeholder?: string;
  value?: Category[];
  onValueChange?: (value: Category[]) => void;
  dissabled?: boolean;
  className?: string;
}

export function MultiSelect({
  options,
  placeholder = "Select options",
  value = [],
  onValueChange,
  dissabled,
  className,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedItems, setSelectedItems] = React.useState<Category[]>(value);

  React.useEffect(() => {
    setSelectedItems(value);
  }, [value]);

  const isSelected = (item: Category) => {
    return selectedItems.some((selectedItem) => selectedItem.id === item.id);
  };

  const handleSelect = (item: Category) => {
    let newSelectedItems: Category[];

    if (isSelected(item)) {
      newSelectedItems = selectedItems.filter((i) => i.id !== item.id);
    } else {
      newSelectedItems = [...selectedItems, item];
    }

    setSelectedItems(newSelectedItems);
    onValueChange?.(newSelectedItems);
  };

  return (
    <div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn("w-full justify-between", className)}
            disabled={dissabled}
          >
            {selectedItems.length > 0 ? (
              <span className="truncate">
                {selectedItems.map((item) => item.name).join(", ")}
              </span>
            ) : (
              placeholder
            )}
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandList>
              <CommandEmpty>No options found.</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.id}
                    value={option.id}
                    onSelect={() => handleSelect(option)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        isSelected(option) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {option.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
