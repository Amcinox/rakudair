"use client";

import { ImagePicker } from "@/components/dashboard/image-picker";

interface ImagePickerFieldProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export function ImagePickerField({
    value,
    onChange,
    placeholder,
}: ImagePickerFieldProps) {
    return (
        <ImagePicker
            value={value || ""}
            onChange={onChange}
            placeholder={placeholder}
        />
    );
}
