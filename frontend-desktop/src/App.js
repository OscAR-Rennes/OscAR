import { useEffect, useState } from 'react';

export default function Home() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('https://oscbackend-production.up.railway.app/api/hello')
      .then(res => res.json())
      .then(data => setMessage(data.message, "coucou"))
      .catch(err => setMessage('Error: ' + err.message));
  }, []);

  return (
    <div>
      <h1>Test Frontend → Backend</h1>
      <p>{message}</p>
    </div>
  );
}
