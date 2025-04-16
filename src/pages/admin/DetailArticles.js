import { useParams } from "react-router-dom";
import NavbarAdmin from "../../components/NavbarAdmin";
import { useEffect, useState } from "react";
import Api from "../../Model/Api";
import Loading from "../../components/Loading";

const DetailArticles = () => {
    
    const { id } = useParams();

    const [article, setArticle] = useState({
        title : "",
        content : "",
        tag : "",
        category : "",
        status : "",
        image : null,
        useImage : false,
    });
    const [newImage, setNewImage] = useState({
        image : null,
        url : '',
    });

    useEffect(() => {
        const fetchingData = async() => {
            try{
                const { data } = await Api().get(`/article/${id}`);
                setArticle({...data.data[0], useImage : false});
            }catch(errorMessage){
                setArticle({});
            }
        }
        fetchingData();
    }, [])
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title',article.title);
        formData.append('content',article.content);
        formData.append('tag',article.tag);
        formData.append('category',article.category);
        formData.append('status',article.status);
        if(newImage.url){
            formData.append('image',article.image);
            formData.append('useImage',true);
        }
        try{
            <Loading></Loading>
           const { data } =  await Api().put(`/articles/${id}`, formData, {

            },{
                headers : {
                    "Content-Type" : "multipart/data"
                }
            }) 
            alert(data.message);
            window.location.reload();
        }catch(errorMessage){
            alert(errorMessage.response.data.message);
        }
    }

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if(name === "image"){
            setNewImage({
                image : files[0],
                url : URL.createObjectURL(files[0])
            });
        }
        setArticle({
            ...article,
            [name] : name === "image"? files[0] : value
        })
    }

    const deleteHandle = async() => {
       if(window.confirm('are you sure? want to delete?')){
            try{
                const { data } = await Api().delete('/articles/'+id);
                alert('succesfully delete article');
                window.location.href = window.location.origin + "/admin/articles";
            }catch(errorMessage){
                alert(errorMessage.response.data.message);
            }
       }
    }

    return(<>
    
    <NavbarAdmin></NavbarAdmin>

    {/* <!-- Content --> */}
    {!article.title > 0? <div className="w-screen h-dvh flex flex-col justify-center items-center gap-3">
        <h2 className="text-blue-500 text-4xl">NOT FOUND</h2>
        <a href="/admin/articles" className="text-white bg-blue-600 p-1.5 rounded-lg">Back?</a>
    </div> : <form className="max-w-4xl mx-auto p-6 mt-20 bg-white shadow-md rounded-lg" action="#" onSubmit={handleSubmit}>
        {/* <!-- Action buttons --> */}
        <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
            <button type="button" className="bg-purple-600 text-white px-4 py-2 rounded shadow hover:bg-purple-700">Edit</button>
            <button type="button" className="border border-gray-400 text-gray-600 px-4 py-2 rounded shadow hover:bg-gray-100">Preview</button>
        </div>
        <div className="flex gap-2">
            <button className="border border-gray-400 text-gray-600 px-4 py-2 rounded hover:bg-gray-100" onClick={() => {
                if(window.confirm('are you sure want to leave while edit article?')){
                    window.location.href = window.location.origin + "/admin/articles";
                }
            }}>Cancel</button>
            <button type="button" className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600" onClick={deleteHandle}>Delete Article</button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Save & Publish</button>
        </div>
        </div>

        {/* <!-- Image --> */}
            <div className="flex flex-col justify-center items-center mb-6">
                <img src={ newImage.url || article.image_url} alt="Artikel Banjir" className="w-full md:w-96 rounded shadow" />
                <br />
                <input type="file" accept="img/jpeg, image/png" onChange={handleChange} name='image'/>
            </div>

            {/* <!-- Judul --> */}
            <input className="w-full text-2xl font-medium text-gray-800 mb-4 p-1 border-blue-600 border-2" value={article.title} name="title" onChange={handleChange} />

            {/* <!-- Isi Artikel --> */}
            <textarea 
                className="w-full min-h-[400px] p-3 text-black mb-4 border-blue-600 border-2"
                name="content" id="#" value={article.content} onChange={handleChange}> 
                {article.content}
            </textarea>
    </form>}
  </>)
}

export default DetailArticles;