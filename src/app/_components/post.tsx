"use client";

// import { useState } from "react";
// import { api } from "~/trpc/react";

export function LatestPost() {
  // Temporariamente comentado - router post não existe mais
  // const [latestPost] = api.post.getLatest.useSuspenseQuery();
  // const utils = api.useUtils();
  // const [name, setName] = useState("");
  // const createPost = api.post.create.useMutation({
  //   onSuccess: async () => {
  //     await utils.post.invalidate();
  //     setName("");
  //   },
  // });

  return (
    <div className="w-full max-w-xs">
      <p>Component temporariamente desabilitado</p>
    </div>
  );
}
