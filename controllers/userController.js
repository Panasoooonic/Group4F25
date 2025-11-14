const {sqlPool} = require('../config/database');
const user = require('../models/user');

//register user 
const registerUser = async (req, res) => {
    try {
        const {firstName, lastName,email, password} = req.body;

        // ensure all fields are provided
        if(!firstName || !lastName || !email || !password){
            return res.status(400).json({message: "All fields are required"});  
        }
        //ensure email field has @
        if(!email.includes('@')){
            return res.status(400).json({message: "Invalid email address"});
        }

       
       const existing = await user.findbyEmail(email);
         if(existing){
            return res.status(409).json({message: "An account with this email already exists"});
        }
        
        await user.create(firstName, lastName, email, password);
        res.status(201).json({message: "User registered successfully"});

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({message: "Error"});
        
    }
}

//login user
const loginUser = async (req, res) => {
    
    try{
        const {email,password} = req.body;

        // ensure all fields are provided
        if(!email || !password){
            return res.status(400).json({message: "Email and password are required"});
        }
        
        const existing = await user.findbyEmail (email);
        if(!existing){
            return res.status(404).json({message:"Account not found with this email"});
        }

        //check if passwords match
        if(existing.password !== password){
            return res.status(401).json({message:"Incorrect password"});
        }

        //successful login
        res.status(200).json({message:"Login successful"})

    
    }catch(error){
        console.error("Login errror: ",error);
        res.status(500).json({message:"Error"});
    }
}



module.exports = { registerUser, loginUser };


