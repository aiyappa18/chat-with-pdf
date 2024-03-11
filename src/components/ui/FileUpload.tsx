"use client";
import { uploadToS3 } from "@/lib/s3";
import { useMutation } from "@tanstack/react-query";
import { Inbox, Loader2 } from "lucide-react";
import React from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

const FileUpload = () => {
    const router = useRouter();
    const [uploading, setUploading] = React.useState(false);
    const { mutate } = useMutation({
        mutationFn: async ({ file_key, file_name }: { file_key: string; file_name: string }) => {
            const response = await axios.post('/api/create-chat', { file_key, file_name });
            return response.data;
        },
        onMutate: () => {
            setUploading(true);
        },
        onSuccess: ({ chat_id }) => {
            toast.success("chat_created");
            router.push(`/chat/${chat_id}`);
        },
        onError: (err) => {
            toast.error("error creating chat");
        },
        onSettled: () => {
            setUploading(false);
        }
    });

    const { getRootProps, getInputProps } = useDropzone({
        accept: { 'application/pdf': [".pdf"] },
        maxFiles: 1,
        onDrop: async (acceptedFiles) => {
            console.log(acceptedFiles);
            const file = acceptedFiles[0];
            if (file.size > 10 * 1024 * 1024) {
                toast.error('Please upload a smaller file');
                return;
            }
            try {
                const data = await uploadToS3(file);
                if (!data?.file_key || !data.file_name) {
                    toast.error('Something went wrong');
                    return;
                }
                mutate(data);
            } catch (error) {
                console.error(error);
            }
        }
    });

    return (
        <div className="p-4 bg-blue-100 rounded-xl border-2 border-blue-400">
            <div {...getRootProps({
                className: "border-dashed border-2 rounded-xl cursor-pointer bg-gray-50 py-8 px-4 flex justify-center items-center flex-col"
            })}>
                <input {...getInputProps()} />
                {uploading ? (
                    <>
                        <Loader2 className='w-10 h-10 text-blue-500 animate-spin' />
                        <p className='mt-2 text-base text-blue-500 font-semibold'>Uploading.....</p>
                    </>
                ) : (
                    <>
                        <Inbox className="w-10 h-10 text-blue-500" />
                        <p className="mt-2 text-base text-blue-500 font-semibold">Drop PDF here</p>
                    </>
                )}
            </div>
        </div>
    );
}

export default FileUpload;
