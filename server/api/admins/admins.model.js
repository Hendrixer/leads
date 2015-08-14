import mongoose from 'mongoose';
const {Schema} = mongoose;

const AdminsSchema = new Schema({

});

export const Admins = mongoose.model('admins', AdminsSchema);
