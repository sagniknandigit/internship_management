import React,{useState, useEffect} from 'react'
import {useAuth} from "../../context/AuthContext";
import {getInternsByMentorId} from "../../services/mockDataService";

const MentorDocuments = () => {
    const {user}=useAuth();
    const [assignedInterns,setAssignedInterns]=useState([]);
    const [formData,setFormData]=useState({
        internId:"",
        title:"",
        file:null,
    });
    const [success,setSuccess]=useState(false);

    useEffect(()=>{
        if(user?.id){
            getInternsByMentorId(user.id).then(setAssignedInterns);
        }
    },[user]);

    const handleChange=(e)=>{
        const {name,value,files}=e.target;
        if(name==="file"){
            setFormData({...formData,file:files[0]});
        }
        else{
            setFormData({...formData,[name]:value});
        }
    };

    const handleSubmit=(e)=>{
        e.preventDefault();
        if(!formData.internId || !formData.title || !formData.file){
            alert("Please fill in all fields and upload a file.");
            return;
        }

        const uploadedDoc={
            id:"doc_"+Date.now(),
            internId:formData.internId,
            title:formData.title,
            fileName:formData.file.name,
            uploadedBy:user.id,
            uploadedAt:new Date().toISOString().split("T")[0],
        };

        const existing=JSON.parse(localStorage.getItem("sharedDocuments")) || [];
        localStorage.setItem(
            "sharedDocuments",
            JSON.stringify([...existing,uploadedDoc])
        );
        setSuccess(true);
        setFormData({internId:"",title:"",file:null});
    };

  return (
    <div className='max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6'>
        <h1 className='text-2xl font-bold mb-4 text-indigo-800'>Upload Documents</h1>

        {success&&(
            <div className='mb-4 p-3 rounded bg-green-100 text-green-700'>
                Document uploaded successfully!
            </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-5'>
            <div>
                <label className='block font-medium text-gray-700 mb-1'>Select Intern</label>
                <select name='internId' value={formData.internId} onChange={handleChange} className='w-full border border-gray-300 rounded px-3 py-2' required>
                    <option value="">-- Select Intern --</option>
                    {assignedInterns.map((intern)=>(
                        <option key={intern.id} value={intern.id}>{intern.name}</option>
                    ))}
                </select>
            </div>

            <div>
                <label className='block font-medium text-gray-700 mb-1'>Document Title</label>
                <input type='text' name='title' value={formData.title} onChange={handleChange} className='w-full border border-gray-300 rounded px-3 py-2' placeholder='e.g., Final Certificate' required></input>
            </div>

            <div> 
                <label className='block font-medium text-gray-700 mb-1'>Upload File (PDF)</label>
                <input type='file' name='file' accept='.pdf' onChange={handleChange} className='w-full border border-gray-300 px-3 py-2' required></input>
                {formData.file &&(
                    <p className='text-sm text-gray-600 mt-2'>Selected File:{formData.file.name}</p>
                )}
            </div>

            <button type='submit' className='bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700'>Upload Documents</button>
        </form>
    </div>
  );
};

export default MentorDocuments
