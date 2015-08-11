import mongoose from 'mongoose';
const {Schema} = mongoose;

const LeadsSchema = new Schema({

});

export const Leads = mongoose.model('leads', LeadsSchema);
