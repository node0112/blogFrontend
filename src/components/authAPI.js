import axios from "axios";

export default axios.create({
    baseURL: "https://itypeauth.onrender.com/auth"
})