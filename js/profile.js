// =========================
// Web3Jobs User Profile
// =========================


// Supabase Configuration

const SUPABASE_URL = "ضع_رابط_Supabase_هنا";
const SUPABASE_KEY = "ضع_مفتاح_Supabase_هنا";


const db = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);




// Save Profile

async function saveProfile(){


const name =
document.getElementById("name").value;


const skills =
document.getElementById("skills").value;


const github =
document.getElementById("github").value;


const linkedin =
document.getElementById("linkedin").value;


const bio =
document.getElementById("bio").value;



const message =
document.getElementById("message");




// Get Current User

const { data:{user} } =
await db.auth.getUser();



if(!user){

message.innerHTML =
"Please login first";

return;

}




// Insert or Update Profile


const { error } =
await db
.from("profiles")
.upsert([

{

id:user.id,

email:user.email,

name:name,

skills:skills,

github:github,

linkedin:linkedin,

bio:bio

}

]);




if(error){

console.log(error);

message.innerHTML =
"Error saving profile";

return;

}




message.innerHTML =
"Profile saved successfully 🚀";



}
