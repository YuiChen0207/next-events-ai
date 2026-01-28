interface FormFieldProps {
  label: string;
  type?: string;
  defaultValue?: string;
  value?: string;
  placeholder?: string;
  disabled?: boolean;
}

export function FormField({
  label,
  type = "text",
  defaultValue,
  value,
  placeholder,
  disabled = false,
}: FormFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <input
        type={type}
        defaultValue={defaultValue}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full px-4 py-2 rounded-sm border border-border/60 bg-background disabled:bg-muted disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary/50"
      />
    </div>
  );
}
