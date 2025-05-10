
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from "react-hook-form";
import { Building, MapPin } from "lucide-react";

interface BrandInfoFormProps {
  control: Control<any>;
}

const BrandInfoForm = ({ control }: BrandInfoFormProps) => {
  return (
    <div className="bg-card/30 rounded-xl p-6 space-y-6">
      <h2 className="text-xl font-medium">Brand Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="brandName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Brand Name</FormLabel>
              <FormControl>
                <div className="relative">
                  <Building className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input placeholder="Your brand name" className="pl-10" {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="businessNature"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nature of Business</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Retail, Technology, etc." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website (optional)</FormLabel>
              <FormControl>
                <Input placeholder="https://yourbrand.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="companyAddress"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Company Address</FormLabel>
              <FormControl>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input placeholder="Full company address" className="pl-10" {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="emirate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Emirate</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an emirate" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="abu_dhabi">Abu Dhabi</SelectItem>
                  <SelectItem value="dubai">Dubai</SelectItem>
                  <SelectItem value="sharjah">Sharjah</SelectItem>
                  <SelectItem value="ajman">Ajman</SelectItem>
                  <SelectItem value="umm_al_quwain">Umm Al Quwain</SelectItem>
                  <SelectItem value="fujairah">Fujairah</SelectItem>
                  <SelectItem value="ras_al_khaimah">Ras Al Khaimah</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default BrandInfoForm;
