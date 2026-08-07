// =========================
// Web3Jobs Authentication
// Supabase Auth System
// =========================


// Supabase Configuration

const SUPABASE_URL = "ضع_رابط_Supabase_هنا";
const SUPABASE_KEY = "ضع_مفتاح_Supabase_هنا";


const db = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);




// Register User

async function register(){


const email =
document.getElementById("email").value;


const password =
document.getElementById("password").value;


const role =
document.getElementById("role").value;



const message =
document.getElementById("message");



if(!email || !password){

message.innerHTML =
"Please fill all fields";

return;

}




const { data, error } =
await db.auth.signUp({

email: email,

password: password

});




if(error){

message.innerHTML =
error.message;

return;

}





// Save User Profile


const user =
data.user;



if(user){



const { error: profileError } =
await db
.from("profiles")
.insert([

{

id:user.id,

email:email,

role:role

}

]);



if(profileError){

console.log(profileError);

}



}




message.innerHTML =
"Account created successfully!";



setTimeout(()=>{


window.location.href =
"login.html";


},2000);



}
