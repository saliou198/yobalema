import { useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';
import api from '../api';
import { useAuth } from '../context/AuthContext';

const MessagesPage = () => {
  const { user } = useAuth();
  const socket = useMemo(() => io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000'), []);

  const [conversations, setConversations] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');

  const loadConversations = async () => {
    const response = await api.get('/messages/conversations');
    setConversations(response.data.data || []);
  };

  const loadMessages = async (otherUserId) => {
    const response = await api.get(`/messages/${otherUserId}`);
    setMessages(response.data.data || []);
  };

  useEffect(() => {
    if (!user?.id) return;

    socket.emit('auth:join', user.id);
    socket.on('message:new', (message) => {
      if (message.senderId === selectedUserId || message.receiverId === selectedUserId) {
        setMessages((prev) => [...prev, message]);
      }
      loadConversations();
    });

    loadConversations();

    return () => {
      socket.off('message:new');
      socket.disconnect();
    };
  }, [user?.id, selectedUserId]);

  const openConversation = async (otherUserId) => {
    setSelectedUserId(otherUserId);
    await loadMessages(otherUserId);
  };

  const sendMessage = async (event) => {
    event.preventDefault();
    if (!selectedUserId || !content.trim()) return;

    const response = await api.post('/messages', {
      receiverId: selectedUserId,
      content,
    });

    setMessages((prev) => [...prev, response.data.data]);
    setContent('');
    loadConversations();
  };

  return (
    <main className="container py-4">
      <h1 className="h4 mb-3">Messagerie</h1>
      <div className="row g-3">
        <aside className="col-md-4">
          <div className="card p-2" style={{ minHeight: 420 }}>
            {conversations.map((conversation) => (
              <button
                key={conversation.user?.id}
                className={`btn text-start ${selectedUserId === conversation.user?.id ? 'btn-dark' : 'btn-light'} mb-2`}
                onClick={() => openConversation(conversation.user?.id)}
              >
                {conversation.user?.firstName} {conversation.user?.lastName}
              </button>
            ))}
          </div>
        </aside>

        <section className="col-md-8">
          <div className="card p-3 d-flex" style={{ minHeight: 420 }}>
            <div className="flex-grow-1 overflow-auto mb-3">
              {messages.map((message) => (
                <div key={message.id} className="mb-2">
                  <span className={`badge ${message.senderId === user?.id ? 'bg-primary' : 'bg-secondary'}`}>{message.content}</span>
                </div>
              ))}
            </div>

            <form onSubmit={sendMessage} className="d-flex gap-2">
              <input
                className="form-control"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Écrire un message..."
              />
              <button className="btn btn-dark" type="submit">Envoyer</button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
};

export default MessagesPage;
