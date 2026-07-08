package com.purple.fooddelivery.keygenerator;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Encoders;

public class KeyGenerator {
    static void main() {
        String SECRET_KEY = Encoders.BASE64.encode(Jwts.SIG.HS256.key().build().getEncoded());
        System.out.println(SECRET_KEY);
    }
}
