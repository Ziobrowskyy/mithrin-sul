import { ImageCarousel } from "./image-carousel";
import { Post } from "@prisma/client";

export default function PostComponent({
  post,
  className
}: {
  post: Post,
  className?: string
}) {
  const parsedDate = new Date(post.createdAt).toLocaleString();
  const hasLocation = !!post.location;
  const files = post.files.map(url => ({ url }));
  return (
    <div
      className={`group/post p-4 w-full bg-white border-gray-200 focus-within:border-pink-200 hover:border-pink-200 border rounded ${className ?? ""}`}>
      <div className={"flex justify-between items-center gap-2"}>
        <h2 className={"font-medium text-gray-800 text-2xl"}>{post.title}</h2>
        <div className={"gap-1 font-light text-gray-600 tracking-wider uppercase"}>
          <span>{parsedDate}{hasLocation ? ", " : ""}</span>
          {hasLocation && (
            <span>
              {post.location}
            </span>
          )}
        </div>
      </div>
      {files.length > 0 &&
        <ImageCarousel className={"mt-4"} images={files}/>
      }
      <hr className={"my-4 group-focus-within/post:border-pink-200 group-hover/post:border-pink-200"}/>
      <p className={"text-gray-600 mb-2"}>
        {post.content}
      </p>
    </div>
  )
}
