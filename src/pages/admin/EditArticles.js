import NavbarAdmin from "../../components/NavbarAdmin";

const EditArticles = () => {
    return(<>
     
        <NavbarAdmin/>

    {/* <!-- Content --> */}
    <div className="max-w-4xl mx-auto p-6 bg-white mt-6 shadow-md rounded-lg">
        {/* <!-- Mode buttons --> */}
        <div className="flex gap-2 mb-6">
        <button className="bg-purple-600 text-white px-4 py-2 rounded shadow hover:bg-purple-700">Edit</button>
        <button className="border border-gray-300 text-black px-4 py-2 rounded hover:bg-gray-100">Preview</button>
        </div>

        {/* <!-- Upload image --> */}
        <div className="flex justify-center mb-6">
        <label for="imageUpload" className="cursor-pointer flex items-center justify-center w-40 h-40 bg-gray-100 border-2 border-dashed border-gray-400 rounded-md">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Banjir_di_Kampung_Pulo.jpg/800px-Banjir_di_Kampung_Pulo.jpg" alt="Upload" className="w-16 h-16 opacity-70"/>
        </label>
        <input type="file" id="imageUpload" className="hidden" />
        </div>

        {/* <!-- Judul --> */}
        <input type="text" placeholder="Write title here..." className="w-full border-2 border-indigo-300 rounded p-3 font-semibold text-center text-lg mb-6 focus:outline-none focus:ring-2 focus:ring-indigo-400"/>

        {/* <!-- Konten --> */}
        <textarea placeholder="Write Content Here...." className="w-full h-64 border-2 border-indigo-300 rounded p-4 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400"></textarea>
    </div>
    </>)
}

export default EditArticles;