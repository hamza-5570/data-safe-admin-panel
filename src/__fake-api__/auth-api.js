import { createResourceId } from "../utils/create-resource-id";
import { sign, decode, JWT_SECRET, JWT_EXPIRES_IN } from "../utils/jwt";
import { wait } from "../utils/wait";
import axiosClient from "./../helper";

const users = [
  {
    id: "5e86809283e28b96d2d38537",
    avatar: "/static/mock-images/avatars/avatar-anika_visser.png",
    email: "demo@devias.io",
    name: "Anika Visser",
    password: "Password123!",
    plan: "Premium",
  },
];

class AuthApi {
  async login({ email, password }) {
    await wait(500);
    let user = await axiosClient().post(`/user/adminLogin`, {
      email,
      password,
    });
    return new Promise((resolve, reject) => {
      try {
        if (!user.data.success) {
          reject(new Error("Please check your email and password"));
          return;
        }

        // Create the access token
        const accessToken = user.data.token;
        // sign({ userId: user.data.data._id }, JWT_SECRET, {
        //   expiresIn: JWT_EXPIRES_IN,
        // });

        resolve(accessToken);
      } catch (err) {
        console.error("[Auth Api]: ", err);
        reject(new Error("Internal server error"));
      }
    });
  }

  async register({ email, name, password }) {
    await wait(1000);

    return new Promise((resolve, reject) => {
      try {
        // Check if a user already exists
        let user = users.find((_user) => _user.email === email);

        if (user) {
          reject(new Error("User already exists"));
          return;
        }

        user = {
          id: createResourceId(),
          avatar: null,
          email,
          name,
          password,
          plan: "Standard",
        };

        users.push(user);

        const accessToken = sign({ userId: user.id }, JWT_SECRET, {
          expiresIn: JWT_EXPIRES_IN,
        });

        resolve(accessToken);
        return user;
      } catch (err) {
        console.error("[Auth Api]: ", err);
        reject(new Error("Internal server error"));
      }
    });
  }

  async me(accessToken) {
    const user = await axiosClient().get(`/user/auth`, {
      headers: {
        "x-auth-token": accessToken,
      },
    });
    return new Promise((resolve, reject) => {
      try {
        // Decode access token
        // const { userId } = decode(accessToken);

        // Find the user
        // const user = users.find((_user) => _user.id === userId);

        if (!user) {
          reject(new Error("Invalid authorization token"));
          return;
        }

        resolve(user.data);
      } catch (err) {
        console.error("[Auth Api]: ", err);
        reject(new Error("Internal server error"));
      }
    });
  }
}

export const authApi = new AuthApi();
