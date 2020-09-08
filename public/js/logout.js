import axios  from 'axios'
import {showAlert} from './alert'


export const logout = async () => {
 try {
     const res = await axios({
         method:"GET",
         url:"/api/v1/users/logout",
     })
     console.log(res);
     if(res.data.status === "success") {
         console.log(res);
          window.location.reload(true)
         }
        }
 
         catch (err){
     console.log(err.logout);
     showAlert("error", "problem loggin you out")
     
 }
}
