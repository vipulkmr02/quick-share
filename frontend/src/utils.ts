export async function verifyToken({ token }: { token: string }) {
  const res = await fetch(
    "http://localhost:8000/authorized",
    {
      "headers": { "Authorization": `Token ${token}` },
    },
  );
  return res.ok;
}

export function deleteFiles({ token, query }: {
  token: string;
  query: string;
}) {
  return fetch(
    `http://localhost:8000/file?${query}`,
    {
      "method": "DELETE",
      "headers": {
        "Authorization": `Token ${token}`,
      },
    },
  );
}

export function fetchFiles({ token }: { token: string }) {
  return fetch(
    "http://localhost:8000/file",
    {
      "headers": {
        "Authorization": `Token ${token}`,
      },
    },
  );
}

export function upload(
  { token, file }: {
    token: string;
    file: File;
  },
) {
  const formData = new FormData();
  formData.append("file", file);

  return fetch("http://localhost:8000/file", {
    method: "POST",
    headers: {
      "Authorization": `Token ${token}`,
    },
    body: formData,
  });
}

export function fetchUserInfo({ token }: { token: string }) {
  return fetch("http://localhost:8000/user-info", {
    "headers": { "Authorization": `Token ${token}` },
  });
}

export function setDP(file: File) {
  const fd = new FormData();
  fd.append("file", file);
  return fetch("http://localhost:8000/user-info", {
    method: "PATCH",
    headers: { "Authorization": `Token ${localStorage.getItem("token")}` },
    body: fd,
  });
}

export function changeVisibility(
  { token, fileId }: {
    token: string;
    fileId: string;
  }
) {
  return fetch(`http://localhost:8000/change-visibility/${fileId}`, {
    method: "GET",
    headers: {
      "Authorization": `Token ${token}`,
      "Content-Type": "application/json",
    },
  });
}

export function downloadFile(
  opts: { name: string; uuid: string; token?: string },
) {
  return opts.token
    ? fetch(`http://localhost:8000/private-download/${opts.uuid}`, {
      method: "GET",
      headers: { Authorization: `Token ${opts.token}` },
    }).then((res) => {
      if (res.ok) return res.blob();
      throw new Error("Failed to download file");
    }).then((blob) => {
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = opts.name;
      anchor.click();
      URL.revokeObjectURL(url);
      anchor.remove();
    })
    : fetch(`http://localhost:8000/download/${opts.uuid}`, {
      method: "GET",
    });
}
