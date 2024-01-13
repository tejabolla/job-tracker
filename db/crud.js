require('dotenv').config();
const config = process.env;
const { MongoClient } = require("mongodb");
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userName: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
userSchema.index({ userName: 1 }, { unique: true });

const jobSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  jobLink: { type: String, required: true },
  description: { type: String, required: true },
  roleName: { type: String, required: true },
  dateApplied: { type: Date, required: true },
  status: { type: String, required: true, enum: ['Applied', 'Interviewed', 'Offer received', 'Offer rejected'] },
});

const cred = mongoose.model('cred', userSchema);
const job = mongoose.model('job', jobSchema);

class Crud {
  constructor() {
    this.client = new MongoClient(config.localUrl);
    this.client.connect();
    console.log('Debug: Crud Initialization Done');
  }

  async insertUser(newUser) {
    try {
      const existingUser = await this.client.db(config.dbName).collection('credentials').findOne({ userName: newUser.userName });

      if (!existingUser) {
        await this.client.db(config.dbName).collection('credentials').insertOne(newUser);
        console.log('Debug: User inserted successfully.');
      } else {
        console.log('Debug: User with the same userName already exists.');
      }
    } catch (err) {
      console.error('Error inserting user:', err);
    }
  }

  async deleteUser(user) {
    try {
      const existingUser = await this.client.db(config.dbName).collection('credentials').findOne({ userName: user.userName });

      if (!existingUser) {
        console.log('Debug: User not found.');
      } else {
        await this.client.db(config.dbName).collection('credentials').deleteOne(existingUser);
        console.log('Debug: User successfully deleted.');
      }
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  }

  async updateUser(user) {
    try {
      const existingUser = await this.client.db(config.dbName).collection('credentials').findOne({ userName: newUser.userName });

      if (!existingUser) {
        console.log('Debug: User not found.');
      } else {
        await this.client.db(config.dbName).collection('credentials').updateOne(existingUser, { $set: { userName: newUser.userName, password: newUser.password } });
        console.log('Debug: User successfully updated.');
      }
    } catch (err) {
      console.error('Error updating user:', err);
    }
  }
  async findUser(newUser) {
    try {
      const usr=await this.client.db(config.dbName).collection('credentials').findOne({ userName: newUser.userName }).then((user)=>{
        // console.log('Debug: Heyy found user',user);
        return user;
        });

    //   console.log(usr);
      return usr;
    } catch (err) {
      console.error('Error finding user:', err);
      return null;
    }
  }
  async findAllJobs() {
    try{
    const documents = await this.client.db('users').collection('jobs').find({"username":"helloworld"}).toArray();
    // console.log(documents[0]["jobs"]);
    return documents[0]["jobs"];

    }catch(err){
        console.log(err)
    }
    // console.log(documents);
  }

}

module.exports = { Crud, cred, job };



// // config.serverUrl
