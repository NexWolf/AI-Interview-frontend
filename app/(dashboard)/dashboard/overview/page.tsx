import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const Overview =  async () => {

    const cookieStore = await cookies();
    const token =  cookieStore.get('token')?.value;
        if(!token) {
        return redirect('/sign')
    }

    const response = await fetch('http://localhost:5000/overview' , {
        method : 'GET',
        headers : {
            Cookie : `token=${token}`
        },
        cache : 'no-store'
    })



    if(response.status !== 200) {
        console.log("something went wrong")
    }

    const result = await response.json();

    return (
        <div>
            <div className="">
                <h1>Welcome {result.firstname} {result.lastname}</h1>
            </div>
        </div>
    )
}

export default Overview;