const { ref } = require("joi");
const mongoose = require("mongoose");
const Review = require("../models/review.js");
const Schema = mongoose.Schema;
let defaultImage="https://media.istockphoto.com/id/610041376/photo/beautiful-sunrise-over-the-sea.jpg?s=612x612&w=0&k=20&c=R3Tcc6HKc1ixPrBc7qXvXFCicm8jLMMlT99MfmchLNA=";

//declare a new schema.....key and its d.t.
const listingSchema= new Schema({
    title: {
        type:String,
        require:true,
    },
    description:String,
    image:{
        url : String,
        filename : String,
    },
    price:Number,
    location:String,
    country:String,
    review:[
        {
        type : Schema.Types.ObjectId,
        ref : "Review",
    }
    ],
    owner :{
        type: Schema.Types.ObjectId,
        ref : "User",
    }
});

listingSchema.post("findOneAndDelete", async(listing) =>{
    if(listing){
    await Review.deleteMany({_id :{$in:listing.review}})
    }
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports=Listing;