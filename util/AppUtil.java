package com.lumea.util;

import java.io.Serializable;
import java.security.SecureRandom;

public class AppUtil {
    private static final SecureRandom random = new SecureRandom();

    public static String genarateVCode() {
        int vcode = random.nextInt(1_000_000);
        return String.format("%6d", vcode);
    }


}
