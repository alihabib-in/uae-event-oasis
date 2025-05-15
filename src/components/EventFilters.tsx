
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Filter, Search, Tag, X } from "lucide-react";

interface EventFiltersProps {
  categories: string[];
  tags: string[];
  searchQuery: string;
  selectedCategory: string;
  selectedTags: string[];
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onTagToggle: (value: string) => void;
  onClearFilters: () => void;
}

const EventFilters = ({
  categories,
  tags,
  searchQuery,
  selectedCategory,
  selectedTags,
  onSearchChange,
  onCategoryChange,
  onTagToggle,
  onClearFilters,
}: EventFiltersProps) => {
  return (
    <div className="bg-card/30 p-4 rounded-xl mb-8">
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search events..."
            className="pl-9 dark-input"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={onClearFilters}
          >
            <Filter className="h-4 w-4" />
            Clear Filters
          </Button>
        </div>
      </div>
      
      <div>
        {categories.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-medium mb-2">Categories</p>
            <ToggleGroup 
              type="single" 
              className="justify-start flex-wrap" 
              value={selectedCategory} 
              onValueChange={onCategoryChange}
            >
              {categories.map(category => (
                <ToggleGroupItem key={category} value={category} className="text-xs">
                  {category}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
        )}
        
        {tags.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-2">Tags</p>
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <Badge 
                  key={tag} 
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => onTagToggle(tag)}
                >
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventFilters;
