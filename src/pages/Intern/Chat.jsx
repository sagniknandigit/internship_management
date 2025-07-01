import React,{useState, useEffect, useRef} from "react";
import {useAuth} from "../../context/AuthContext";
import conversationsData from "../../mock/conversations.json";

const Chat = () => {
  const {user}=useAuth();
  const [messages,setMessages]=useState([]);
  const [newMessage,setNewMessage]=useState([]);
  const chatEndRef=useRef(null);

  useEffect(()=>{
    if(user?.id && conversationsData[user.id]){
      setMessages(conversationsData[user.id]);
    }
  },[user]);

  useEffect(()=>{
    chatEndRef.current?.scrollIntoView({behaviour:"smooth"});
  },[messages]);

  const handleSendMessage=(e)=>{
    e.preventDefault();
    if(!newMessage.trim()){
      return;
    }

    const message={
      sender:"intern",
      text:newMessage.trim(),
      timestamp:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),
    };

    const updatedMessages=[...messages,message];
    setMessages(updatedMessages);
    setNewMessage("");

    const allConversations=JSON.parse(localStorage.getItem("conversations")) || {};
    allConversations[user.id]=updatedMessages;
    localStorage.setItem("conversations",JSON.stringify(allConversations));
  };

  return(
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow">
      <h1 className="text-2xl font-bold text-indigo-800 mb-4">Chat with Mentor</h1>
      <div className="h-96 overflow-y-auto border rounded-lg p-4 bg-gray-50 mb-4">
        {messages.length===0?(
          <p className="text-gray-500">No messages yet.</p>
        ):(
          messages.map((msg,idx)=>(
            <div key={idx} className={`mb-2 p-2 rounded-lg max-w-sm ${
              msg.sender==="intern"? "bg-indigo-100 ml-auto text-right":"bg-gray-200 text-left"
            }`}>
              <p className="text-sm">{msg.text}</p>
              <span className="text-xs text-gray-500">{msg.timeestamp}</span>
              </div>
          ))
        )}
        <div ref={chatEndRef}></div>
      </div>

      <form onSubmit={handleSendMessage} className="flex gap-2">
        <input type="text" value={newMessage} onChange={(e)=>setNewMessage(e.target.value)} placeholder="Type your meessage..." className="flex-1 border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"></input>
        <button type="submit" className="bg-indigo-600 text-white px-3 py-2 rounded-lg hover:bg-indigo-700">Send</button>
      </form>
    </div>
  );
};
export default Chat;
