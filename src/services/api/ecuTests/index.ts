import { EcuTestsRepo } from "../../testrepo/EcuTestsRepo";
import axios from "../axiosClient";
import { APIResponse } from "../types";
import { EcuTest } from "./types";

async function getEcuTests(){

//var response = await axios.get<APIResponse<EcuTest[]>>("EcuTest"); 

    //console.log(response.data)
    
    //return ecu
    //return response 
    return EcuTestsRepo.getEcuTests()
}

// Todo add more functions here


export default{
    getEcuTests,
    // TODO add more functions here
}