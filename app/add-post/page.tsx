"use client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRef } from "react";
import PostComponent from "../post";

const postSchema = z.object({
  title: z.string(),
  location: z.string().optional(),
  content: z.string(),
  files: z.instanceof(FileList).optional(),
});

type PostSchema = z.infer<typeof postSchema>;

export default function AddPostPage() {
  const { register, handleSubmit, getValues, watch } = useForm<PostSchema>({
    resolver: zodResolver(postSchema),
  })

  const watchAllFields = watch();

  const onSubmit = async (data: PostSchema) => {
    const formData = new FormData();
    formData.append("title", data.title);
    if (data.location)
      formData.append("location", data.location);
    formData.append("content", data.content);
    if (data.files) {
      for (let i = 0; i < data.files.length; i++) {
        formData.append("files", data.files[i]);
      }
    }

    const response = await fetch("/api/add-post", {
      method: "POST",
      body: formData
    })
    console.log("response", response);
  }

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { ref: fileInputRegisterRef, ...fileInputRegister } = register("files");

  return (
    <div className={"flex items-start justify-around"}>
      <form
        className={"max-w-3xl w-fit shrink-0 border rounded bg-white"}
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="space-y-6 px-4 py-5 sm:p-6">
          <div className="col-span-6 sm:col-span-3">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Post title
            </label>
            <input
              type="text"
              id="title"
              required
              placeholder={"Wystawa w Bielsku"}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              {...register("title")}
            />
          </div>
          <div className="col-span-6 sm:col-span-3">
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
              Location
              <span className={"ml-1 font-light"}>
                (Optional)
              </span>
            </label>
            <input
              type="text"
              id="location"
              placeholder={"Bielsko-Biała"}
              autoComplete="location"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              {...register("location")}
            />
          </div>
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">
              Post content
            </label>
            <div className="mt-1">
              <textarea
                id="content"
                rows={4}
                placeholder="Lorem ipsum dolor amet..."
                defaultValue={""}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                {...register("content")}
              />
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Brief description for your profile. URLs are hyperlinked.
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Cover photo</label>
            <div
              onClick={() => {
                fileInputRef.current?.click();
              }}
              onDrop={e => {
                console.log(e.dataTransfer.files);
                e.preventDefault()
              }}
              onDragOver={e => e.preventDefault()}
              className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6"
            >
              <div className="space-y-1 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                  >
                    <span>Upload a file</span>
                    <input
                      id="file-upload"
                      type="file"
                      className="sr-only"
                      multiple
                      {...fileInputRegister}
                      ref={e => {
                        fileInputRegisterRef(e);
                        fileInputRef.current = e;
                      }}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>
          </div>
        </div>
        <div className="px-4 py-3 text-right sm:px-6">
          <button
            type="submit"
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Save
          </button>
        </div>
      </form>

      {watchAllFields &&
        <PostComponent
          className={"shrink-0"}
          post={{
            id: "1",
            title: getValues("title"),
            content: getValues("content"),
            createdAt: new Date(),
            authorId: "",
            location: getValues("location") ?? null,
            files: parseFiles(fileInputRef.current?.files),
          }}/>
      }
    </div>
  );
}

function parseFiles(files: FileList | null | undefined) {
  if (!files)
    return [];
  return Array.from(files).map(file => URL.createObjectURL(file));
}
