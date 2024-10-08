// CustomField.tsx
import React from "react";
import { Control, Controller, FieldValues } from "react-hook-form";
import { z } from "zod";

import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormLabel,
} from "../ui/form";
import { formSchema } from "./TransformationForm";

type CustomFieldProps = {
  control: Control<z.infer<typeof formSchema>>;
  render: (props: { field: any }) => JSX.Element; // Ensure it returns JSX.Element
  name: keyof z.infer<typeof formSchema>;
  formLabel?: string;
  className?: string;
};

export const CustomField = ({
  control,
  render,
  name,
  formLabel,
  className,
}: CustomFieldProps) => {
  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {formLabel && <FormLabel>{formLabel}</FormLabel>}
          <FormControl>
            <Controller
              control={control}
              name={name}
              render={({ field }) => render({ field })}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CustomField;
