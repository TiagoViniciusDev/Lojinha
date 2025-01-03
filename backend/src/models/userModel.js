import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {type: String, enum: ["admin", "user"], default: "user", required: true},
    cart: { type: Array },

    cpf: { type: String, require: true},
    phoneNumber: { type: String, require: true},
    gender: { type: String, enum: ["masculino", "feminino"], require: true},
    birthDate: { type: String, require: true},

    cep: { type: String, require: true },
    address: { type: String, require: true },
    complement: { type: String },
    addressNumber: { type: Number, require: true },
    UF: { type: String, require: true },
    city: { type: String, require: true },
    neighborhood: { type: String, require: true }
}, { timestamps: true });

const UserModel = mongoose.model("User", userSchema)

export default UserModel