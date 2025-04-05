export async function verifyToken({ token }: { token: string }) {
  const res = await fetch(
    'http://localhost:8000/authorized', {
    'headers': { 'Authorization': `Token ${token}` }
  });
  return res.ok;
}


export function deleteFiles({ token, query }:
  {
    token: string,
    query: string
  }) {
    return fetch(
      `http://localhost:8000/file?${query}`,
      {
        "method": "DELETE",
        "headers": {
          "Authorization": `Token ${token}`
        }
      }
    )
}

export function fetchFiles({ token }: { token: string }) {
  return fetch(
    "http://localhost:8000/file",
    {
      "headers": {
        "Authorization": `Token ${token}`
      }
    }
  )
}

export function upload(
  { token, file }: {
    token: string,
    file: File
  }) {
  const formData = new FormData();
  formData.append('file', file)

  return fetch("http://localhost:8000/file", {
    method: 'POST',
    headers: {
      "Authorization": `Token ${token}`
    }, body: formData
  })
}
