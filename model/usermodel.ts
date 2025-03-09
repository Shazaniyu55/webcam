import mongoose, {Schema, Document} from "mongoose";
import bcrypt from 'bcryptjs';

export interface Iuser extends Document{
    username: String;
    email: String;
    password: String;
    comparePassword(password: String): Promise<Boolean>;
}


const userSchema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  });


userSchema.methods.comparePassword = async function (password: string) {
    return bcrypt.compare(password, this.password);
  };


// Hash password before saving
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
      this.password = await bcrypt.hash(this.password, 10);
    }
    next();
  });


const User = mongoose.model<Iuser>('User', userSchema);

export default User;
  