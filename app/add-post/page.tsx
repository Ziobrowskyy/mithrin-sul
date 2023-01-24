"use client";
import PostEditor, { PostSchema } from "../post-editor";

function submitPost(data: PostSchema) {
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
  return fetch("/api/add-post", {
    method: "POST",
    body: formData
  })
}

export default function AddPostPage() {
  return (
    <PostEditor onSubmit={submitPost}/>
  )
}
