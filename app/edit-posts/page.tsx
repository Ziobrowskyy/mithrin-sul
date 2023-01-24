"use client";
import PostEditor, { PostSchema } from "../post-editor";

export default function EditPostPage() {
  const onSubmit = async (data: PostSchema) => {

  }

  return (
    <>
      <PostEditor onSubmit={onSubmit}/>
    </>
  )
}
