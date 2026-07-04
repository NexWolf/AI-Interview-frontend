import { redirect } from "next/navigation";

export default async function VerifyEmail ({searchParams} : {searchParams : Promise<{token? : string}>}) {
    const {token} = await searchParams;


    if(!token) {
        console.log("not found")
        return (
            <div className="bg-zinc-800 p-8 w-full h-fit">
                <p  className="text-xl font-bold text-center">The link is invalid</p>
                <button>Resent Email Confirm</button>
            </div>
        )

    }

    let isError = false;
    let errorMessage ='An unexpected error occured';
    try {
        const response = await fetch(`http://localhost:5000/verify-email?token=${token}`,{
            method : 'GET',
            cache : 'no-store'
        })

        const contentType = response.headers.get("content-type");
        let data = {message: 'An unxpected error occurred'};

        if(contentType && contentType.includes('application/json')) {
            data = await response.json();
        }

        if(!response.ok) {
                isError = true;
                errorMessage = data.message || "Internal server error";
        }
    }catch(error) {
        console.error('Fetch error : ', error);
            isError = true;
            errorMessage =  "Could not connect to the server. please try again later.";
    }   

    if(isError) {
        return (
            <div>
                <h1>Confirm failed!</h1>
                <p>{errorMessage}</p>
            </div>
        )
    }

    return redirect('/sign');

}

