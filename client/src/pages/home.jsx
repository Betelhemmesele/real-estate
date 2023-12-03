// import React from 'react';

export default function Home() {
  return (
    <div>home
    <form encType="multipart/form-data" method="POST" action="/upload">
  <input type="file" name="image" id="imageInput" accept="image/*"/>
  <button type="submit">Upload</button>
</form>
</div>

  )
}
