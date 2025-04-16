import { useState } from "react";
import LoadingIndicator from "../LoadingIndicator"

const Loading =  () => {
    const [bool, setBool] = useState(true);
    return(<div className={`${bool? 'flex' : 'hidden'} w-screen h-dvh fixed top-0 left-0 bg-slate-300/50  flex-col justify-center items-center gap-5`}>
        <h2 className="text-4xl font-bold">Loading....</h2>
        <button className="bg-blue-500 font-bold text-white p-1.5 rounded-lg" onClick={() => setBool(false)}>Close Loading...</button>
    </div>)
}

export default Loading;