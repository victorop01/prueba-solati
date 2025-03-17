/* eslint-disable @typescript-eslint/promise-function-async */
import * as jwt from 'jsonwebtoken';

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class AuthUtils {
  public static async generateToken(
    userLogin: string,
    id: number,
    email: string
  ): Promise<{ internalToken: string }> {
    const privateKey: string | undefined = process.env.SECRET_KEY_JWT_API;

    if (privateKey != null) {
      const internalToken = jwt.sign(
        {
          user_login: userLogin,
          idUser: id,
          email: email
        },
        privateKey,
        {
          algorithm: 'HS256',
          expiresIn: '1d'
        }
      );

      return { internalToken };
    } else {
      const internalToken = '';
      return { internalToken };
    }
  }

  public static async decodeToken(token: string): Promise<any> {
    try {
      const decoded = jwt.verify(
        token,
        process.env.SECRET_KEY_JWT_API as string
      );
      return decoded;
    } catch (err) {
      return false;
    }
  }
}
