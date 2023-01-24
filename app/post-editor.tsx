import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod/dist/zod";
import { ChangeEvent, useReducer, useRef } from "react";
import Image from "next/image";
import PostComponent from "./post";

const postSchema = z.object({
  title: z.string(),
  location: z.string().optional(),
  content: z.string(),
  files: z.array(z.object({
    name: z.string(),
    lastModified: z.number(),
    size: z.number(),
    type: z.string(),
  })).optional(),
});

export type PostSchema = z.infer<typeof postSchema>;

export default function PostEditor(
  {
    value,
    onSubmit
  }: {
    value?: PostSchema,
    onSubmit?: (data: PostSchema) => void
  }
) {
  const { register, handleSubmit, getValues, watch } = useForm<PostSchema>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: value?.title,
      location: value?.location,
      content: value?.content,
      files: value?.files
    }
  })

  const watchAllFields = watch();

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { ref: fileInputRegisterRef, ...fileInputRegister } = register("files", {
    onChange: (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files)
        dispatchFiles({ type: "add", data: Array.from(e.target.files) });
    }
  });

  type FilesReducerActions = { type: "add", data: File[] } | { type: "remove", data: File };

  const [files, dispatchFiles] = useReducer((files: File[], action: FilesReducerActions) => {
    switch (action.type) {
    case "add": {
      const withoutDuplicates = action.data.filter(file => !files.find(f => f.name === file.name));
      return [...files, ...withoutDuplicates];
    }
    case "remove": {
      return files.filter(f => f != action.data);
    }
    default:
      throw new Error("Invalid action type");
    }
  }, []);

  return (
    <div className={"flex flex-wrap gap-2 gap-y-4 p-4 items-start justify-around"}>
      <form
        className={"grow max-w-3xl border rounded bg-white"}
        onSubmit={handleSubmit((data) => onSubmit?.(data))}
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
            {/*<p className="mt-2 text-sm text-gray-500">*/}
            {/*  Brief description for your profile. URLs are hyperlinked.*/}
            {/*</p>*/}
          </div>
          <div>
            <span className={"block text-sm font-medium text-gray-700"}>
              Uploaded files
            </span>
            <div className={"grid items-center gap-2"}>
              {
                files.map((file) => (
                  <div
                    className={"relative w-32 h-32 border border-gray-300 hover:border-pink-500 rounded"}
                    key={file.name}>
                    <svg
                      onClick={() => dispatchFiles({ type: "remove", data: file })}
                      className="absolute right-0 z-10 h-6 w-6 text-gray-600 hover:text-pink-500 cursor-pointer"
                      stroke="currentColor"
                      fill="currentColor"
                      viewBox="0 0 48 48"
                    >
                      <path d="M13.05 42q-1.25 0-2.125-.875T10.05 39V10.5H8v-3h9.4V6h13.2v1.5H40v3h-2.05V39q0 1.2-.9 2.1-.9.9-2.1.9Zm21.9-31.5h-21.9V39h21.9Zm-16.6 24.2h3V14.75h-3Zm8.3 0h3V14.75h-3Zm-13.6-24.2V39Z"/>
                    </svg>
                    <Image
                      className={"h-full w-auto object-cover"}
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      fill
                    />
                  </div>
                ))
              }
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Post photos</label>
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={e => e.preventDefault()}
              onDrop={e => {
                e.preventDefault();
                dispatchFiles({ type: "add", data: Array.from(e.dataTransfer.files) });
              }}
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
                      accept={"image/*"}
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
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5 MiB</p>
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
          className={"max-w-3xl"}
          post={{
            id: "1",
            title: getValues("title") || "Post title",
            content: getValues("content") || "Some post content",
            createdAt: new Date(),
            authorId: "",
            location: getValues("location") || null,
            files: files.map(file => URL.createObjectURL(file))
          }}/>
      }
    </div>
  );
}
