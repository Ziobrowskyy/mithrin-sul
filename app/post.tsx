import { ImageCarousel } from "./image-carousel";
import { Post, File } from "@prisma/client";

function parseDate(date: Date): string {
  return new Date(date).toLocaleDateString();
}

export default function RenderPost({ post }: { post: Post }) {
  const parsedDate = parseDate(post.createdAt);
  const files = post.files.map(({ url }) => ({ url }));
  const hasLocation = !!post.location
  return (
    <div
      className={`p-4 max-w-3xl bg-white border-gray-200 hover:border-pink-200 border rounded ${className ?? ""}`}>
      <div className={"flex justify-between items-center gap-2"}>
        <h2 className={"font-medium text-gray-800 text-2xl"}>{post.title}</h2>
        <div className={" gap-1 font-light text-gray-600 tracking-wider uppercase"}>
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
      <div>
        <p className={"py-4 text-gray-600 "}>
          {post.content}
        </p>
      </div>
    </div>
  )
}
