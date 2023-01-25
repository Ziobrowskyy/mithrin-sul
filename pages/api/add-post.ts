import { NextApiRequest, NextApiResponse, PageConfig } from "next";
import formidable from "formidable";
import { Writable } from "stream";
import { createClient } from "@supabase/supabase-js";
import { PrismaClient } from "@prisma/client";

export const config: PageConfig = {
  api: {
    bodyParser: false,
  },
};

const formidableConfig = {
  keepExtensions: true,
  maxFileSize: 10_000_000,
  maxFieldsSize: 10_000_000,
  allowEmptyFiles: false,
  multiples: true,
};


function formidablePromise(req: NextApiRequest, options?: formidable.Options) {
  return new Promise<{ fields: formidable.Fields, files: formidable.Files }>((resolve, reject) => {
    const form = formidable(options);
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err);
      } else {
        resolve({ fields, files });
      }
    });
  });
}

function fileConsumer(fileBuffer: Buffer[]) {
  const buff = new Array<any>();
  return new Writable({
    write: (chunk, _enc, next) => {
      buff.push(chunk);
      next();
    },
    final: (cb) => {
      fileBuffer.push(Buffer.concat(buff));
      cb();
    }
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
  const fileChunks = new Array<Buffer>();
  const { fields, files } = await formidablePromise(req, {
    ...formidableConfig,
    fileWriteStreamHandler: () => fileConsumer(fileChunks)
  });

  const formFiles = new Array<formidable.File>();
  if (files.files instanceof Array) {
    formFiles.push(...files.files);
  } else if(files.files) {
    formFiles.push(files.files);
  }

  const urls = await Promise.all(
    formFiles.map(async (file, index) => {
      const { data, error } = await supabase.storage.from("images").upload(file.newFilename, fileChunks[index], {
        contentType: file.mimetype ?? "image/jpeg",
      });
      if (error || !data) {
        throw new Error(error?.message ?? "Could not upload file " + file.originalFilename);
      }
      const { data: { publicUrl } } = supabase.storage.from("images").getPublicUrl(data.path);
      return publicUrl;
    })
  );

  const prisma = new PrismaClient();

  const author = await prisma.user.findFirst() ?? await prisma.user.create({
    data: {
      name: "admin",
      email: "admin@localhost"
    }
  });

  const post = await prisma.post.create({
    data: {
      title: fields.title as string,
      content: fields.content as string,
      location: fields.location as string,
      files: urls,
      author: {
        connect: {
          id: author.id
        }
      },
    }
  });
  res.status(200).json(post);
}
