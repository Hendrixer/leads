import mongoose from 'mongoose';
const {Schema} = mongoose;

const <%= upcaseName %>Schema = new Schema({

});

export const <%= upcaseName %> = mongoose.model('<%= name %>', <%= upcaseName %>Schema);
