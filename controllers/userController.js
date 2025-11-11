const {sqlPool} = require('../config/database');


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

       // check if user already exists by email
       const [existingUser] = await sqlPool.query('SELECT * FROM users WHERE email = ?', [email]);
       if(existingUser.length > 0){
        return res.status(409).json({message: "Account already exists with this email"});
       }

       // insert new user into database
       const [result] = await sqlPool.query(
        'insert into users (firstName, lastName, email, password) values (?, ?, ?, ?)',
        [firstName, lastName, email, password]
     );
        
        res.status(201).json({message:"User registered successfully"});

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

        // check if user exists by email
        const [userResult] = await sqlPool.query('SELECT * FROM users WHERE email = ?',[email]);
        if(userResult.length === 0){
            return res.status(404).json({message: "No account found with this email"});
        }
        const user = userResult[0];

        //check if passwords match
        if(user.password !== password){
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


