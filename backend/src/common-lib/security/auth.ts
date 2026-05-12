import { SignJWT } from "jose";
import { jwtVerify } from "jose";
import { AuthResponseDTO } from "../dto/auth/AuthResponseDTO.js";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function generateToken(user: AuthResponseDTO) {
  return await new SignJWT({
    id: user.id.toString(),
    username: user.username, 
    rights: user.rights,
    id_cultural_center: user.id_cultural_center,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("2h")
    .sign(secret);
}


export async function verifyToken(token: string) {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  return await jwtVerify(token, secret);
}

