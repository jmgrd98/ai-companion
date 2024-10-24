'use client'

import { useEffect, useState } from "react";
import { CldUploadWidget } from 'next-cloudinary';
import Image from "next/image";

interface ImageUploadProps {
    value: string;
    onChange: (src: string) => void;
    disabled: boolean;
}

const ImageUpload = ({
    value,
    onChange,
    disabled
}: ImageUploadProps) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Log the value whenever it changes
    useEffect(() => {
        console.log('Current image value:', value);
    }, [value]);

    const handleUpload = (result: any) => {
        console.log('Upload result:', result); // Log the entire result
        if (result?.info?.secure_url) {
            console.log('Uploaded image URL:', result.info.secure_url);
            onChange(result.info.secure_url);
        }
    };

    const handleError = (error: any) => {
        console.error('Upload error:', error); // Log any potential errors
    };

    if (!isMounted) return null;

    return (
        <div className="space-y-4 w-full flex flex-col justify-center items-center">
            <CldUploadWidget
                uploadPreset="ltbuyufq"
                onSuccess={handleUpload}
                onError={handleError} // Add error logging
            >
                {({ open }) => {
                    return (
                        <div onClick={() => open()} className="cursor-pointer p-4 border-4 border-dashed border-primary/10 rounded-lg hover:opacity-75 transition flex flex-col space-y-2 items-center justify-center">
                            <div className="relative h-40 w-40">
                                <Image
                                    fill
                                    alt="Upload image"
                                    src={value || "/placeholder.png"}
                                    className="rounded-lg object-cover"
                                />
                            </div>
                        </div>
                    );
                }}
            </CldUploadWidget>
        </div>
    )
}

export default ImageUpload;
