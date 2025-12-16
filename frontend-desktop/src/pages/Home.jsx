import { useEffect, useState } from 'react';
import { fetchHello } from '../api/apiClient';

export default function Home() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchHello()
      .then(data => setMessage(data.message))
      .catch(err => setMessage('Error: ' + err.message));
  }, []);

  return (
    <div>
      <h1>Matéo la pupuce !!</h1>
      <p>{message}</p>
    </div>
  );
}
