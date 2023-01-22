import Post from "../../post";
import { PrismaClient } from "@prisma/client";

function getPost(id: string) {
  const prismaClient = new PrismaClient();
  return prismaClient.post.findFirst({
    where: { id },
    include: {
      files: true
    }
  });
}

export default async function PostPage({ params }: { params: { id: string } }) {

  const post = await getPost(params.id);

  if (!post) {
    return <div>Post not found</div>
  }

  return (
    <div className={"flex flex-col items-center"}>
      <Post post={post}/>
    </div>
  )
}
