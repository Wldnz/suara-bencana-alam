
const CreateReport = () => {
    return(<>
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6 mt-10">
            <h1 className="text-2xl font-bold mb-4">Form Laporan Bencana Alam</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input id="username" type="text" placeholder="Username" className="border p-2 rounded" />
            <input id="fullname" type="text" placeholder="Full Name" className="border p-2 rounded" />
            <input id="phone" type="text" placeholder="Number Phone" className="border p-2 rounded" />
            <input id="email" type="email" placeholder="Email Address" className="border p-2 rounded" />
            <input id="address" type="text" placeholder="Address" className="border p-2 rounded" />
            <input id="title" type="text" placeholder="Title" className="border p-2 rounded" />
            <input id="type" type="text" placeholder="Type" className="border p-2 rounded" />
            <input id="damage" type="text" placeholder="Damage" className="border p-2 rounded" />
            <input id="fatalities" type="number" placeholder="Fatalities" className="border p-2 rounded" />
            <input id="province" type="text" placeholder="Province" className="border p-2 rounded" />
            <input id="city" type="text" placeholder="City" className="border p-2 rounded" />
            <input id="longitude" type="text" placeholder="Longitude" className="border p-2 rounded" />
            <input id="latitude" type="text" placeholder="Latitude" className="border p-2 rounded" />
            </div>

            <textarea id="description" rows="3" placeholder="Description" className="w-full border p-2 mt-4 rounded"></textarea>
            <textarea id="summary" rows="2" placeholder="Summary From Machine Learning" className="w-full border p-2 mt-2 rounded"></textarea>

            <button id="saveButton" className="mt-6 w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
            KIRIM LAPORAN
            </button>

            <div id="notification" className="hidden mt-4 p-3 rounded text-white font-semibold text-center"></div>
        </div>    
    </>)
}

export default CreateReport;