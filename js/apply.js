// =========================
// Web3Jobs Applications System
// =========================


const SUPABASE_URL = "https://lmkfieqwkrbdbtemhsyr.supabase.co";
const SUPABASE_KEY = "sb_publishable_S_2GRmf1XaPVG0KQ8-sQIg_eHXLfHus";


const db = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);



// Apply For Job

async function applyForJob(jobId){



const message =
document.getElementById("apply-message");



// Check User

const { data:{user} } =
await db.auth.getUser();



if(!user){

if(message)
message.innerHTML =
"Please login before applying";


return;

}




// Save Application

const { error } =
await db
.from("applications")
.insert([

{

job_id: jobId,

user_id: user.id,

status: "Pending"

}

]);




if(error){

console.log(error);


if(message)
message.innerHTML =
"Application failed";


return;

}



if(message)
message.innerHTML =
"Application submitted successfully 🚀";


}
