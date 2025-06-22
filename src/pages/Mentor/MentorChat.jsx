import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  getInternsByMentorId,
  getConversationsForMentor,
} from "../../services/mockDataService";
import ProfileAvatar from "../../components/ui/ProfileAvatar";
import Spinner from "../../components/ui/Spinner";
import { IoSend } from "react-icons/io5";

const MentorChat = () => {
  const { user } = useAuth();
  const [interns, setInterns] = useState([]);
  const [conversations, setConversations] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedInternId, setSelectedInternId] = useState(null);

  const messages = conversations[selectedInternId] || [];
  const selectedIntern = interns.find((i) => i.id === selectedInternId);

  useEffect(() => {
    if (user?.id) {
      const fetchData = async () => {
        setLoading(true);
        // Fetch both interns and their conversations in parallel
        const [internsData, convosData] = await Promise.all([
          getInternsByMentorId(user.id),
          getConversationsForMentor(user.id),
        ]);

        setInterns(internsData);
        setConversations(convosData);

        if (internsData.length > 0) {
          setSelectedInternId(internsData[0].id);
        }
        setLoading(false);
      };
      fetchData();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-8rem)]">
      <div className="w-1/3 border-r border-gray-200 bg-white rounded-l-lg flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">Conversations</h2>
        </div>
        <div className="overflow-y-auto">
          {interns.map((intern) => {
            const lastMessage = (conversations[intern.id] || []).slice(-1)[0];
            return (
              <div
                key={intern.id}
                onClick={() => setSelectedInternId(intern.id)}
                className={`p-4 flex items-center cursor-pointer border-l-4 ${
                  selectedInternId === intern.id
                    ? "bg-indigo-50 border-indigo-500"
                    : "border-transparent hover:bg-gray-100"
                }`}
              >
                <ProfileAvatar user={intern} size="sm" />
                <div className="ml-3">
                  <p className="font-semibold text-gray-800">{intern.name}</p>
                  <p className="text-sm text-gray-500 truncate">
                    {lastMessage ? lastMessage.text : "No messages yet"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="w-2/3 flex flex-col bg-white rounded-r-lg">
        {selectedIntern ? (
          <>
            <div className="p-4 border-b flex items-center">
              <ProfileAvatar user={selectedIntern} size="sm" />
              <h3 className="ml-3 text-lg font-semibold text-gray-900">
                {selectedIntern.name}
              </h3>
            </div>
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.sender === "me" ? "justify-end" : "justify-start"
                  } mb-4`}
                >
                  <div
                    className={`rounded-lg p-3 max-w-lg ${
                      msg.sender === "me"
                        ? "bg-indigo-500 text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t bg-white">
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button className="ml-3 p-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700">
                  <IoSend size={20} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a conversation to start chatting.
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorChat;
