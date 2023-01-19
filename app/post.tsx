import { ImageCarousel } from "./image-carousel";
import { Post } from "@prisma/client";

function parseDate(date: Date): string {
  return new Date(date).toLocaleDateString();
}

export default function RenderPost({ post }: { post: Post }) {
  const parsedDate = parseDate(post.createdAt);
  return (
    <div
      className={"flex-auto bg-white border-gray-200 hover:border-pink-200 border rounded m-2 p-4 max-w-3xl"}>
      <div className={"flex justify-between"}>
        <h2 className={"font-medium text-gray-800 text-2xl"}>{post.title}</h2>
        <div className={"flex flex-row gap-1 pt-1 font-light text-gray-600 tracking-wider uppercase"}>
          <span>{parsedDate}{", "}</span>
          {post.location && (
            <span>
              {post.location}
            </span>
          )}
        </div>
      </div>
      {/*{post.images &&*/}
      {/*<ImageCarousel className={"mt-4"} images={post.images}/>*/}
      {/*}*/}
      <div>
        <p className={"py-4 text-gray-600 "}>
          {post.content}
        </p>
      </div>
    </div>
  )
}
