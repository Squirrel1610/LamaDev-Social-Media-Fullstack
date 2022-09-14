import { LoginStart, LoginSuccess, LoginFailure} from "./context/AuthActions"
import API from "./api";

export const loginCall = async (userCredential, dispatch) => {
    dispatch(LoginStart(userCredential));

    try {
        const response = await API.post("api/auth/login", userCredential);
        dispatch(LoginSuccess(response.data.data))
    } catch (error) {
        console.error(error.response.data.message);
        dispatch(LoginFailure(error.response.data.message))
    }
}