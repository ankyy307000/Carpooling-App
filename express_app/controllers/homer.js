 
 
 
const CurrentRide=require("../models/Auction");
const {initializeProvider, createIdentity} = require("./utils")
 


module.exports=(app)=>{
    app.get("/homer",async (req,res)=>{
        
        if(req.session.username!==undefined){
            if(req.session.userType==="Rider")
            {
                const dbRecord=await CurrentRide.findOne({username:req.session.username});
                if(dbRecord===null){
                    res.render("homer");
                }
                else{
                    res.redirect("/currentbids");
                }
            }
            else{
                res.render("homed");
            }
        }else{
            res.redirect("/");
        }
        

    }); 

    app.post("/homer",async (req,res)=>{
        if(req.session.username)
        {
       
        const from=req.body.from;
        const to=req.body.to;

        const currentRide=new CurrentRide({
            from:from,
            to:to,
            username:req.session.username,
            status:"AVL",
            bids:[]
        });
        currentRide.save((err)=>{
            if(err)
            console.log(err);
        });

        req.session.On=true;
        res.redirect("/currentbids");
  
        
    }

    });

    app.get("/currentbids",async (req,res)=>{
        if(req.session.username){
            const dbRecord=await CurrentRide.findOne({username:req.session.username});
            console.log(dbRecord);
            
            if(dbRecord.status==="BOK" || dbRecord.status==="MET"){
                res.redirect("/finalr");
            }else{
            let message=null;
            const bids=dbRecord.bids;
            if(bids.length===0){
                // console.log(bids);
                message="No bids yet";
            }
            res.render("bid",{to:dbRecord.to,from:dbRecord.from,bid:bids,message:message});
            }
        }else{
            res.redirect("/");
        }
    });

    app.post("/currentbids",async (req,res)=>{
        if(req.session.username){
            const bidder=req.body.bidder;
            const value=req.body.value;
            const resp=await CurrentRide.findOneAndUpdate({username:req.session.username},{finalBidder:bidder,finalValue:value,status:"BOK",$set:{bids:[]}});
            console.log(resp);
            
            res.redirect("/finalr");
        }
    });

    app.get("/finalr",async(req,res)=>{
        if(req.session.username!==undefined){
        const getBidder= await CurrentRide.find({username:req.session.username});
        const contract = await initializeProvider();
        const response = await contract.get(getBidder[0].finalBidder)
        console.log(response);
        
        const final={
            name:response['5'],
            phoneNumber:response['1'],
            value:getBidder[0].finalValue,
            vehicle:response['2'],
            vehicleNo:response['3']

        }
        const status=getBidder[0].status;
        if(status==="MET"){
            res.render("finalr",{final:final,message:"done"});    
        }else{
        res.render("finalr",{final:final,message:null});
        }}else{
            res.redirect("/");
        }

    });
    app.post("/finalr",async(req,res)=>{
        const contract = await initializeProvider();
        const getBidder= await CurrentRide.find({username:req.session.username});
        const response = await contract.get(getBidder[0].finalBidder)
        
        
        const final={
            name:response['5'],
            phoneNumber:response['1'],
            value:getBidder[0].finalValue,
            vehicle:response['2'],
            vehicleNo:response['3']

        }


        res.render("finalr",{final:final,message:"done"})

    });
 
}