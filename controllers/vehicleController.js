const {sqlPool} = require('../config/database');

//add vehicle
const addVehicle = async (req,res) =>{
    const { userId,make, model, year, plateNo} = req.body;
    
    
    if(!userId ||!make || !model || !year || !plateNo){
        return res.status(400).json({message: "All fields are required"});
    }

    try{
        const [result] = await sqlPool.query(
            'INSERT INTO vehicle (userId, make, model, year, plateNo) VALUES (?, ?, ?, ?, ?)',
            [userId, make, model, year, plateNo]
        );
        res.status(201).json({message: "Vehicle added successfully"});

    }catch(error){
        console.error('Error adding vehicle:', error);
        res.status(500).json({message: "Error adding vehicle"});

    }
};

//update vehicle
const updateVehicle = async (req,res) =>{

    const{vehicleId} = req.params;
    const {make, model, year, plateNo} = req.body;
    try{
        
        const [result] = await sqlPool.query(
            'UPDATE vehicle SET make = ?, model = ?, year = ?, plateNo = ? WHERE vehicleId = ?',
            [make, model, year, plateNo, vehicleId]);
            
            if(result.affectedRows === 0){
                return res.status(404).json({message: "Vehicle not found"});
            }
            res.status(200).json({message: "Vehicle updated successfully"});
            
        }catch(error){
        console.error('Error updating vehicle:', error);
        res.status(500).json({message: "Error updating vehicle"});
        }

};

//delete vehicle
const deleteVehicle = async (req,res) =>{

    const{vehicleId} = req.params;
    try{
        const [result] = await sqlPool.query(
            'DELETE FROM vehicle WHERE vehicleId = ?',
            [vehicleId]);
            res.status(200).json({message: "Vehicle deleted successfully"});
    }catch(error){
        console.error('Error deleting vehicle:', error);
        res.status(500).json({message: "Error deleting vehicle"});
    }


};

//get vehicles by user
const getVehiclesByUser = async (req,res) =>{
    const{userId} = req.params;
    try{
        const [vehicles] = await sqlPool.query(
            'SELECT * FROM vehicle WHERE userId = ?',
            [userId]);
            res.status(200).json({vehicles});
    }catch(error){
        console.error('Error getting vehicles:', error);
        res.status(500).json({message: "Error getting vehicles"});
    }

};


module.exports = { addVehicle, updateVehicle, deleteVehicle, getVehiclesByUser}
