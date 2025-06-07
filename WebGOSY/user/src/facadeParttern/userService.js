import axios from "axios";

import {API_URL} from '../config'

const UserService = {
    async fetchUserDetails(id) {
        try {
            const response = await axios.get(`${API_URL}/api/Users/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching user details:", error);
            throw new Error("Không thể lấy thông tin người dùng");
        }
    }
};

export default UserService;
