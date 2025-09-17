import bcrypt from "bcryptjs";
import crypto from "crypto";

// 🔒 Middleware: Hash password before saving
export async function hashPasswordMiddleware(next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
}

// 🔑 Method: Compare password
export async function matchPassword(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

// 📧 Method: Generate email verification token
export function generateVerificationToken() {
    const token = crypto.randomBytes(32).toString("hex");
    this.verificationToken = crypto.createHash("sha256").update(token).digest("hex");
    this.verificationTokenExpires = Date.now() + 60 * 60 * 1000; // 1 hour
    return token;
}

// 🔑 Method: Generate password reset token
export function generatePasswordResetToken() {
    const token = crypto.randomBytes(32).toString("hex");
    this.resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");
    this.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 min
    return token;
}
