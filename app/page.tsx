import { PrismaClient } from "@prisma/client";
import PostComponent from "./post";

async function getPosts() {
  const prisma = new PrismaClient();
  return prisma.post.findMany();
}

export default async function Home() {
  const posts = await getPosts();
  return (
    <div className={"flex flex-col items-center"}>
      {posts.map((post) => <PostComponent key={post.id} post={post}/>)}
    </div>
  )
}
