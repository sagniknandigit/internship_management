import React,{useState,useEffect} from "react";
import {useAuth} from "../../context/AuthContext";
import sharedDocuments from "../../mock/sharedDocuments.json";

const Documents = () => {
  const {user}=useAuth();
  const [documents,setDocuments]=useState([]);
  const [loading,setLoading]=useState(true);

  useEffect(()=>{
    if(user?.id){
      const filteredDocs=sharedDocuments.filter((doc)=>doc.internId===user.id);
      setDocuments(filteredDocs);
      setLoading(false);
    }
  },[user]);

  return(
    <div className="p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Shared Documents</h2>
      {loading?(
        <p className="text-gray-600">Loading Documents...</p> 
      ) : documents.length===0 ? (
        <p className="text-gray-600">No documents have been shared with your yet.</p>
      ):(
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">File</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Uploaded By</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Uploaded At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {documents.map((doc)=>(
                <tr key={doc.id}>
                  <td className="px-6 py-4 text-sm text-gray-900">{doc.title}</td>
                  <td className="px-6 py-4 text-sm text-blue-600 hover:underline cursor-pointer">
                    <a href={`/${doc.fileName}`} target="_blank" rel="noopener noreferrer">{doc.fileName}</a>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{doc.uploadedBy}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{doc.uploadedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    }
    </div>
  )
};
export default Documents;
