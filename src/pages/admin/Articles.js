import React, { useEffect, useState } from "react";
import NavbarAdmin from "../../components/NavbarAdmin";
import Api from "../../Model/Api";

const Articles = () => {

    const [articles, setArticles] = useState([]);
    const [views, setViews] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try{
                const { data } = await Api().get('/articles');
                setArticles(data.data);
            }catch(error){
                setArticles([]);
            }
        }
        const fetchData2 = async () => {
            try{
                const { data } = await Api().get('/article-views');
                console.log(data.data.views);
                setViews(data.data.views);
            }catch(error){
                setViews(0);
            }
        }
        fetchData();
        fetchData2();
    } ,[])

    return(<>
        
        <NavbarAdmin/>

        {/* <!-- Main Content --> */}
        <div className="md:ml-64 pt-24 px-4 md:px-8 pb-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
                <h1 className="text-2xl font-bold">Statistika Jumlah Pengunjung Artikel</h1>
            </div>
            </div>

            {articles.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl p-6 shadow-md col-span-2">
                    <canvas id="visitorChart" height="180"></canvas>
                </div>
                <div className="flex flex-col gap-4">
                    <div className="bg-blue-600 text-white p-6 rounded-lg shadow-md text-center">
                    <h2 className="text-2xl font-bold">{views}</h2>
                    <p>Visitor Articles</p>
                    </div>
                    <div className="bg-indigo-500 text-white p-6 rounded-lg shadow-md text-center">
                    <h2 className="text-2xl font-bold">{articles.length}</h2>
                    <p>Articles</p>
                    </div>
                </div>
            </div>)}

            {/* <!-- Kumpulan Artikel --> */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Kumpulan - Kumpulan Artikel</h2>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-semibold" onClick={() => window.location.href = window.location.origin + "/admin/articles/create"}>Buat Artikel</button>
            </div>

            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.length > 0 && articles.map(value => {
                        return <div className="bg-white rounded-lg overflow-hidden shadow-md cursor-pointer" onClick={() => window.location.href = window.location.origin + `/admin/articles/${value.id}`}>
                            <img src={value.image_url} alt="banjir" className="w-full h-40 object-cover"/>
                            <div className="p-4">
                                <h3 className="font-semibold text-gray-800 text-lg mb-2">{value.title}</h3>
                                <p className="text-gray-600 text-sm">{value.content.slice(0,67)}...</p>
                                <p className="text-xs text-gray-500 mt-2">{new Date(value.created_at).toLocaleDateString()}</p>
                            </div>
                        </div>
                    })}  
            </div>    
        </div>
    </>)
}

export default Articles;