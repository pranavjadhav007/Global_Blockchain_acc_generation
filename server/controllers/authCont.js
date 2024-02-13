import authmodel from  '../models/authmodel.js';
import bcryptjs from 'bcryptjs'; 
import jwt from 'jsonwebtoken';
import authModel from '../models/authmodel.js';

class AuthController{
    static userRegistration= async(req,res)=>{
        const {name,email,password} =req.body;
        try{
            if(name && email && password){
                const isuser= await authmodel.findOne({email:email});
                if(isuser){
                    res.status(400).json({message:"User Already exist"});
                }
                else{
                    const genSalt=await bcryptjs.genSalt(10);
                    const hashedpassword=await bcryptjs.hash(password,genSalt);
                    const newuser=authmodel({
                        name,
                        email,
                        password:hashedpassword
                    });
                    const resUser=await newuser.save();
                    const componentWillMount= (getAccounts)=>{
                        getAccounts.loadWeb3()
                        getAccounts.loadBlockchainData()
                    }
                    const loadWeb3= (pid) =>{
                        if (window.ethereum) {
                          window.web3 = new Web3(window.ethereum)
                          window.ethereum.enable()
                        }
                        else if (window.web3) {
                          window.web3 = new Web3(window.web3.currentProvider)
                        }
                      }
                    
                    const loadBlockchainData=(cid)=>{
                        const web3 = window.web3
                        const accounts = web3.eth.getAccounts()
                        cid.setState({ account: accounts[0] })
                        const networkId = web3.eth.net.getId()
                        const networkData = account.networks[networkId]
                        if(networkData) {
                          const account = web3.eth.Contract(account.abi, networkData.address)
                          cid.setState({ account })
                          const postCount = account.methods.postCount().call()
                          cid.setState({ postCount })
                          for (var i = 1; i <= postCount; i++) {
                            const post = account.methods.posts(i).call()
                            cid.setState({
                              posts: [...cid.state.posts, post]
                            })
                          }
                          this.setState({
                            posts: this.state.posts.sort((a,b) => b.tipAmount - a.tipAmount )
                          })
                          this.setState({ loading: false})
                        } 
                      }
                    
                      const constructor=(props)=> {
                        this.state = {
                          account: '',
                          account: null,
                          postCount: 0,
                          posts: [],
                          loading: true
                        }
                        this.createPost = this.createPost.bind(this)
                        this.tipPost = this.tipPost.bind(this)
                      }
                    if(resUser){
                        return res.status(201).json({message:"Register Successfully",user:resUser});
                    }
                }
            }else{
                return res.status(400).json({message:"Fill complete details."});
            }
        }catch(error){
            return res.status(400).json({message:error.message});
        }
    }    


    static userLogin=async(req,res) =>{
        const{email, password}=req.body;
        try{
            if(email && password){
                const isUser=await authmodel.findOne({email:email}); 
                if(isUser){
                    if(email == isUser.email && await bcryptjs.compare(password, isUser.password)){
                        const token=jwt.sign({userID:isUser._id},"blockchainroute",{
                            expiresIn:"4d"
                        });
                        res.status(200).json({message:"Login Successfully",token});
                    }else{
                        res.status(400).json({message:"Invalid Crediantials"});
                    }
                }else{
                    res.status(400).json({message:"User Not Registered"});
                }
            }else{
                res.status(400).json({message:"All fields not set"});
            }
        }catch(error){
            res.status(400).json({message:error.message});
        }
    }

    static changePassword= async(req,res)=>{
        const {newPassword, conformPassword}=req.body;
        try{
            if(newPassword == conformPassword){
                const genSalt=await bcryptjs.genSalt(10);
                const hashedpassword=await bcryptjs.hash(newPassword,genSalt);
                await authmodel.findByIdAndUpdate(req.user._id,{
                    newPassword: hashedpassword
                });
                return res.status(200).json({message:"Password Change Successfully"});
            }
        }catch(error){
            res.status(400).json({message:error.message})
        }
    }
};

export default AuthController;