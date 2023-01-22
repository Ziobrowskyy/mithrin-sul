import { PrismaClient } from "@prisma/client";
import RenderPost from "./post";

async function getPosts() {
  const prisma = new PrismaClient();
  return prisma.post.findMany({
    include: {
      files: true
    }
  });
}

export default async function Home() {
  const posts = await getPosts();
  return (
    <div className={"flex flex-col items-center"}>
      {posts.map((post) => <RenderPost key={post.id} post={post}/>)}
    </div>
  )
}
